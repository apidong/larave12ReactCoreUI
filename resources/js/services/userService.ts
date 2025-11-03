import axios from 'axios'

export interface User {
  id: number
  name: string
  email: string
  role: string
  is_active: boolean
  email_verified_at?: string | null
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

export interface UserFormData {
  name: string
  email: string
  password?: string
  role: string
  is_active?: boolean
  group_id?: number | null
}

export interface PaginatedUsers {
  current_page: number
  data: User[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export const userService = {
  /**
   * Get all users with pagination and search
   */
  async getUsers(page = 1, perPage = 10, search = ''): Promise<PaginatedUsers> {
    const response = await axios.get('/users', {
      params: {
        page,
        per_page: perPage,
        search,
      },
    })
    return response.data
  },

  /**
   * Get single user by ID
   */
  async getUser(id: number): Promise<User> {
    const response = await axios.get(`/users/${id}`)
    return response.data
  },

  /**
   * Create new user
   */
  async createUser(userData: UserFormData): Promise<{ message: string; user: User }> {
    const response = await axios.post('/users', userData)
    return response.data
  },

  /**
   * Update existing user
   */
  async updateUser(
    id: number,
    userData: Partial<UserFormData>
  ): Promise<{ message: string; user: User }> {
    const response = await axios.put(`/users/${id}`, userData)
    return response.data
  },

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<{ message: string }> {
    const response = await axios.delete(`/users/${id}`)
    return response.data
  },

  /**
   * Toggle user active status
   */
  async toggleUserStatus(id: number): Promise<{ message: string; user: User }> {
    const response = await axios.post(`/users/${id}/toggle-status`)
    return response.data
  },
}
