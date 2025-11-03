import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

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

export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  group_id?: number | null
  group?: {
    id: number
    name: string
    description?: string
    is_active: boolean
  }
  created_at?: string
  updated_at?: string
}

export interface Permission {
  resource: string
  action: string
  name: string
}

export interface AuthResponse {
  message: string
  user: User
  permissions: Permission[]
  access_token: string
  token_type: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials)
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('permissions', JSON.stringify(response.data.permissions || []))
    }
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data)
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('permissions', JSON.stringify(response.data.permissions || []))
    }
    return response.data
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('permissions')
  },

  async getUser(): Promise<User> {
    const token = localStorage.getItem('token')
    const response = await axios.get<{ user: User; permissions: Permission[] }>(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Update permissions in localStorage
    if (response.data.permissions) {
      localStorage.setItem('permissions', JSON.stringify(response.data.permissions))
    }
    return response.data.user
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getPermissions(): Permission[] {
    const permissions = localStorage.getItem('permissions')
    return permissions ? JSON.parse(permissions) : []
  },

  hasPermission(resource: string, action: string): boolean {
    const permissions = this.getPermissions()
    return permissions.some(
      (p) => p.resource === resource && (p.action === action || p.action === 'manage') // 'manage' grants all actions
    )
  },

  canAccess(resource: string): boolean {
    const permissions = this.getPermissions()
    return permissions.some((p) => p.resource === resource)
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  },
}
