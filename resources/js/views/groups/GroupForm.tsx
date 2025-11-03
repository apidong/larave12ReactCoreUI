import { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormCheck,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { Group, GroupFormData } from '../../services/groupService'
import { ruleService, Rule } from '../../services/ruleService'

interface GroupFormProps {
  visible: boolean
  onClose: () => void
  onSubmit: (data: GroupFormData) => Promise<void>
  group?: Group | null
}

const GroupForm = ({ visible, onClose, onSubmit, group }: GroupFormProps) => {
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    is_active: true,
    rule_ids: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rules, setRules] = useState<Rule[]>([])
  const [loadingRules, setLoadingRules] = useState(false)

  useEffect(() => {
    if (visible) {
      fetchRules()
      if (group) {
        setFormData({
          name: group.name,
          description: group.description || '',
          is_active: group.is_active,
          rule_ids: group.rules?.map((r) => r.id) || [],
        })
      } else {
        setFormData({
          name: '',
          description: '',
          is_active: true,
          rule_ids: [],
        })
      }
      setError('')
    }
  }, [visible, group])

  const fetchRules = async () => {
    try {
      setLoadingRules(true)
      const response = await ruleService.getRules(1, 100, '')
      setRules(response.data)
    } catch (err) {
      console.error('Failed to fetch rules:', err)
    } finally {
      setLoadingRules(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleRuleToggle = (ruleId: number) => {
    setFormData((prev) => {
      const currentRules = prev.rule_ids || []
      const newRules = currentRules.includes(ruleId)
        ? currentRules.filter((id) => id !== ruleId)
        : [...currentRules, ruleId]

      return {
        ...prev,
        rule_ids: newRules,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.name.trim()) throw new Error('Name is required')

      await onSubmit(formData)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CModal visible={visible} onClose={onClose} backdrop="static" size="lg">
      <CModalHeader>
        <CModalTitle>{group ? 'Edit Group' : 'Add New Group'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError('')}>
              {error}
            </CAlert>
          )}
          <div className="mb-3">
            <CFormLabel htmlFor="name">Name *</CFormLabel>
            <CFormInput
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormTextarea
              id="description"
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <CFormCheck
              id="is_active"
              name="is_active"
              label="Active Group"
              checked={formData.is_active}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Assigned Rules</CFormLabel>
            {loadingRules ? (
              <div className="text-center p-3">
                <CSpinner size="sm" />
              </div>
            ) : (
              <div
                style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  border: '1px solid #d8dbe0',
                  borderRadius: '4px',
                  padding: '10px',
                }}
              >
                {rules.length === 0 ? (
                  <small className="text-muted">No rules available</small>
                ) : (
                  rules.map((rule) => (
                    <CFormCheck
                      key={rule.id}
                      id={`rule-${rule.id}`}
                      label={`${rule.name} (${rule.resource}:${rule.action})`}
                      checked={formData.rule_ids?.includes(rule.id) || false}
                      onChange={() => handleRuleToggle(rule.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </CButton>
          <CButton color="primary" type="submit" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : group ? 'Update' : 'Create'}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default GroupForm
