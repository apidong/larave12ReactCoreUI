export const APP_NAME = 'Laravel + React + CoreUI'
export const APP_VERSION = '1.0.0'

export const ROUTES = {
  DASHBOARD: '/dashboard',
  USERS: '/users',
} as const

export const API_ENDPOINTS = {
  USERS: '/api/users',
  USER: '/api/user',
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const
