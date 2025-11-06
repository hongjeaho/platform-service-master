import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useSetAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

import { alertMessageState } from '@/store/message'
import { API_BASE_URL } from '@/util/env'

const AUTHORIZATION = 'authorization'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

// 토큰 만료 알림 중복 방지를 위한 플래그
let isTokenExpiredAlertShown = false

export const useAxiosInstance = () => {
  const setAlertMessage = useSetAtom(alertMessageState)

  const onRequest = useCallback(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = localStorage.getItem(AUTHORIZATION) as string | undefined
      if (token !== undefined) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    [],
  )

  const onResponse = useCallback((response: AxiosResponse): AxiosResponse => {
    const { headers } = response

    if (headers[AUTHORIZATION] !== undefined) {
      localStorage.setItem(AUTHORIZATION, headers[AUTHORIZATION])
    }

    if (headers['content-disposition']) {
      const disposition = headers['content-disposition']
      const match = disposition?.match(/filename\*?=([^;]+)/i)
      const extracted = match?.[1]?.replace("UTF-8''", '').replace(/"/g, '').trim()
      if (extracted) {
        const filename = decodeURIComponent(extracted)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      }
    }

    return response
  }, [])

  const onError = useCallback(
    (error: AxiosError | Error): Promise<AxiosError> => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { headers } = error.response

          const isTokenExpired = headers['x-token-expired']
          if (isTokenExpired === 'true') {
            localStorage.removeItem(AUTHORIZATION)
            localStorage.removeItem('user')

            // 이미 알림이 표시되었으면 중복 표시 방지
            if (!isTokenExpiredAlertShown) {
              isTokenExpiredAlertShown = true

              setAlertMessage({
                message: '로그인이 필요합니다.',
                onCallBack: () => {
                  // 페이지 이동 전 플래그 리셋
                  isTokenExpiredAlertShown = false
                  window.location.href = '/'
                },
              })
            }
          }
        }
      }

      return Promise.reject(error)
    },
    [setAlertMessage],
  )

  useEffect(() => {
    // 인터셉터 등록
    const requestInterceptor = axiosInstance.interceptors.request.use(onRequest)
    const responseInterceptor = axiosInstance.interceptors.response.use(onResponse, onError)

    // cleanup: 인터셉터 제거 (중복 등록 방지 및 메모리 누수 방지)
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor)
      axiosInstance.interceptors.response.eject(responseInterceptor)
    }
  }, [onRequest, onResponse, onError])
}

export const request = <T>(options: AxiosRequestConfig): Promise<T> => {
  const config = {
    ...options,
  }

  if (config.method?.toUpperCase() === 'GET') {
    config.paramsSerializer = paramObj => {
      const queryString = new URLSearchParams()
      for (const [key, value] of Object.entries(flatObject(paramObj))) {
        if (value !== null && value !== undefined && value !== '') {
          const addKey = key.replace(/\[.+]/, '')
          queryString.append(addKey, value)
        }
      }
      return queryString.toString()
    }
  }

  const controller = new AbortController()
  const promise = axiosInstance({ ...config, signal: controller.signal }).then(({ data }) => data)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  promise.cancel = () => {
    controller.abort()
  }

  return promise
}

const flatObject = (object: Record<string, any>, prefix = '') => {
  return Object.keys(object).reduce((carry: Record<string, any>, key: string) => {
    const pre = prefix ? prefix + `.${key}` : ''

    if (Array.isArray(object[key])) {
      carry = object[key].reduce((array: Record<string, any>, value: any, index: number) => {
        array[(pre || key) + `[${index}]`] = value
        return array
      }, carry)
    } else if (object[key] && typeof object[key] === 'object') {
      Object.assign(carry, flatObject(object[key], pre || key))
    } else {
      carry[pre || key] = object[key]
    }

    return carry
  }, {})
}

export type ErrorType<Error> = AxiosError<Error>
