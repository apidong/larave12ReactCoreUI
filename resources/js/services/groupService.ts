import axios from 'axios'

export interface Group {
  id: number
  name: string
  description: string | null
  is_active: boolean
  users_count?: number
  rules_count?: number
  created_at?: string
  updated_at?: string
  rules?: Rule[]
}

export interface Rule {
  id: number
  name: string
  resource: string
  action: string
  description: string | null
  created_at?: string
  updated_at?: string
}

export interface GroupFormData {
  name: string
  description?: string | null
  is_active?: boolean
  rule_ids?: number[]
}

export interface PaginatedGroups {
  current_page: number
  data: Group[]
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

export const groupService = {
  /**
   * Get all groups with pagination and search
   */
  async getGroups(page = 1, perPage = 10, search = ''): Promise<PaginatedGroups> {
    const response = await axios.get('/groups', {
      params: {
        page,
        per_page: perPage,
        search,
      },
    })
    return response.data
  },

  /**
   * Get single group by ID
   */
  async getGroup(id: number): Promise<Group> {
    const response = await axios.get(`/groups/${id}`)
    return response.data
  },

  /**
   * Create new group
   */
  async createGroup(groupData: GroupFormData): Promise<{ message: string; group: Group }> {
    const response = await axios.post('/groups', groupData)
    return response.data
  },

  /**
   * Update existing group
   */
  async updateGroup(
    id: number,
    groupData: Partial<GroupFormData>
  ): Promise<{ message: string; group: Group }> {
    const response = await axios.put(`/groups/${id}`, groupData)
    return response.data
  },

  /**
   * Delete group
   */
  async deleteGroup(id: number): Promise<{ message: string }> {
    const response = await axios.delete(`/groups/${id}`)
    return response.data
  },

  /**
   * Toggle group active status
   */
  async toggleGroupStatus(id: number): Promise<{ message: string; group: Group }> {
    const response = await axios.post(`/groups/${id}/toggle-status`)
    return response.data
  },
}
