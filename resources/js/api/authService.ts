import api from './axios'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  user: {
    id: number
    name: string
    email: string
  }
  token?: string
}

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await api.get('/user')
    return response.data
  },

  /**
   * Refresh token
   */
  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh')
    return response.data
  },
}

export default authService
