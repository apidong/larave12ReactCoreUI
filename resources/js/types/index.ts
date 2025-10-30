/**
 * Laravel + React + TypeScript + CoreUI Project
 *
 * This file contains TypeScript type definitions for the project
 */

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status: string
}

// Add more types as needed
