import axios from 'axios'

export interface Rule {
  id: number
  name: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
  description: string | null
  groups_count?: number
  created_at?: string
  updated_at?: string
}

export interface RuleFormData {
  name: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
  description?: string | null
}

export interface PaginatedRules {
  current_page: number
  data: Rule[]
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

export const ruleService = {
  /**
   * Get all rules with pagination and search
   */
  async getRules(page = 1, perPage = 10, search = ''): Promise<PaginatedRules> {
    const response = await axios.get('/rules', {
      params: {
        page,
        per_page: perPage,
        search,
      },
    })
    return response.data
  },

  /**
   * Get single rule by ID
   */
  async getRule(id: number): Promise<Rule> {
    const response = await axios.get(`/rules/${id}`)
    return response.data
  },

  /**
   * Create new rule
   */
  async createRule(ruleData: RuleFormData): Promise<{ message: string; rule: Rule }> {
    const response = await axios.post('/rules', ruleData)
    return response.data
  },

  /**
   * Update existing rule
   */
  async updateRule(
    id: number,
    ruleData: Partial<RuleFormData>
  ): Promise<{ message: string; rule: Rule }> {
    const response = await axios.put(`/rules/${id}`, ruleData)
    return response.data
  },

  /**
   * Delete rule
   */
  async deleteRule(id: number): Promise<{ message: string }> {
    const response = await axios.delete(`/rules/${id}`)
    return response.data
  },
}
