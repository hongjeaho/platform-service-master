const locale = 'ko-KR'

export const formatWithCommas = (value: number | string | undefined | null) => {
  if (value === null || value === undefined) return '0'
  // 문자열인 경우, 불필요한 공백 제거 및 콤마 제거 후 숫자 체크
  const raw = typeof value === 'string' ? value.replace(/,/g, '').trim() : value

  const num = typeof raw === 'number' ? raw : Number(raw)
  if (!isFinite(num)) return ''

  return new Intl.NumberFormat(locale).format(num)
}

export const formatPrice = (price: number): string => {
  if (price >= 100000000) {
    return `${(price / 100000000).toFixed(1)}억원`
  } else if (price >= 10000) {
    return `${(price / 10000).toFixed(0)}만원`
  }
  return `${price.toLocaleString()}원`
}
