import { createBrowserRouter, type RouteObject } from 'react-router-dom'

import AuthenticationLayout from '@/layout/AuthenticationLayout'
import BaseLayout from '@/layout/BaseLayout'
import FullScreenLayout from '@/layout/FullScreenLayout'
import references from '@/router/references'
import ErrorPage from '@/views/ErrorPage'
import Home from '@/views/Home'
import LoginApplication from '@/views/login/LoginApplication'

import admin from './admin'
import board from './board'
import conclusion from './conclusion'
import deliberation from './deliberation'
import land from './land'
import receipt from './receipt'

const router: RouteObject[] = [
  {
    path: '/',
    element: <AuthenticationLayout />,
    children: [...receipt, ...conclusion, ...deliberation, ...references, ...board, ...admin],
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      ...land,
    ],
  },
  {
    path: '/',
    element: <FullScreenLayout />,
    children: [
      {
        path: '/login',
        element: <LoginApplication />,
      },
    ],
  },
]

const options = {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
}

export default createBrowserRouter(router, options)
