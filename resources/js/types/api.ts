export interface User {
  id: number
  name: string
  email: string
  role: string
  created_at?: string
  updated_at?: string
}

export interface AuthUser extends User {
  email_verified_at?: string
}

export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface FormErrors {
  [key: string]: string[]
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
}

// Add more types as needed
