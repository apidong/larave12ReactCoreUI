import api from './axios'
import { User } from '@/types'

export const userService = {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/users')
    return response.data
  },

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  /**
   * Create new user
   */
  async createUser(data: Partial<User>): Promise<User> {
    const response = await api.post('/users', data)
    return response.data
  },

  /**
   * Update user
   */
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}

export default userService
