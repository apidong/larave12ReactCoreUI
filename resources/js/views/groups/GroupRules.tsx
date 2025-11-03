import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CSpinner,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilCheckCircle, cilSave } from '@coreui/icons'
import { groupService, Group } from '../../services/groupService'
import { ruleService, Rule } from '../../services/ruleService'
import { hasPermission } from '../../utils/permissions'

const GroupRules = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [group, setGroup] = useState<Group | null>(null)
  const [allRules, setAllRules] = useState<Rule[]>([])
  const [selectedRules, setSelectedRules] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    if (!id) return

    setLoading(true)
    setError('')

    try {
      // Fetch group details
      const groupData = await groupService.getGroup(parseInt(id))
      setGroup(groupData)

      // Extract currently assigned rule IDs
      const assignedRuleIds = groupData.rules?.map((r) => r.id) || []
      setSelectedRules(assignedRuleIds)

      // Fetch all available rules
      const rulesResponse = await ruleService.getRules(1, 100, '')
      setAllRules(rulesResponse.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRule = (ruleId: number) => {
    setSelectedRules((prev) => {
      if (prev.includes(ruleId)) {
        return prev.filter((id) => id !== ruleId)
      } else {
        return [...prev, ruleId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedRules.length === allRules.length) {
      setSelectedRules([])
    } else {
      setSelectedRules(allRules.map((r) => r.id))
    }
  }

  const handleSelectByResource = (resource: string) => {
    const resourceRules = allRules.filter((r) => r.resource === resource)
    const resourceRuleIds = resourceRules.map((r) => r.id)
    const allSelected = resourceRuleIds.every((id) => selectedRules.includes(id))

    if (allSelected) {
      // Deselect all rules for this resource
      setSelectedRules((prev) => prev.filter((id) => !resourceRuleIds.includes(id)))
    } else {
      // Select all rules for this resource
      setSelectedRules((prev) => {
        const newSelection = new Set([...prev, ...resourceRuleIds])
        return Array.from(newSelection)
      })
    }
  }

  const handleSave = async () => {
    if (!group) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await groupService.updateGroup(group.id, {
        name: group.name,
        description: group.description,
        is_active: group.is_active,
        rule_ids: selectedRules,
      })

      setSuccess('Rules assigned successfully!')
      setTimeout(() => {
        navigate('/groups')
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save rules')
    } finally {
      setSaving(false)
    }
  }

  // Group rules by resource
  const rulesByResource = allRules.reduce((acc, rule) => {
    if (!acc[rule.resource]) {
      acc[rule.resource] = []
    }
    acc[rule.resource].push(rule)
    return acc
  }, {} as Record<string, Rule[]>)

  const getActionBadgeColor = (action: string) => {
    const colors: Record<string, string> = {
      create: 'success',
      read: 'info',
      update: 'warning',
      delete: 'danger',
      manage: 'primary',
    }
    return colors[action] || 'secondary'
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
        <p className="mt-3">Loading...</p>
      </div>
    )
  }

  if (!group) {
    return (
      <CAlert color="danger">
        <h4>Group not found</h4>
        <CButton color="primary" onClick={() => navigate('/groups')}>
          Back to Groups
        </CButton>
      </CAlert>
    )
  }

  // Check permission
  if (!hasPermission('groups', 'update')) {
    return (
      <CAlert color="danger">
        <h4 className="alert-heading">Access Denied</h4>
        <p>You don't have permission to assign rules to groups.</p>
        <hr />
        <CButton color="primary" onClick={() => navigate('/groups')}>
          Back to Groups
        </CButton>
      </CAlert>
    )
  }

  return (
    <>
      <CRow className="mb-3">
        <CCol>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Assign Rules to Group</h2>
              <p className="text-muted mb-0">
                Group: <strong>{group.name}</strong>
              </p>
            </div>
            <CButton color="secondary" variant="ghost" onClick={() => navigate('/groups')}>
              <CIcon icon={cilArrowLeft} className="me-2" />
              Back to Groups
            </CButton>
          </div>
        </CCol>
      </CRow>

      {/* Alerts */}
      {error && (
        <CAlert color="danger" dismissible onClose={() => setError('')}>
          {error}
        </CAlert>
      )}
      {success && (
        <CAlert color="success" dismissible onClose={() => setSuccess('')}>
          <CIcon icon={cilCheckCircle} className="me-2" />
          {success}
        </CAlert>
      )}

      {/* Summary Card */}
      <CRow className="mb-4">
        <CCol md={12}>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol md={4}>
                  <strong>Total Rules Available:</strong> {allRules.length}
                </CCol>
                <CCol md={4}>
                  <strong>Rules Selected:</strong> {selectedRules.length}
                </CCol>
                <CCol md={4} className="text-end">
                  <CButton
                    color="secondary"
                    size="sm"
                    variant="outline"
                    onClick={handleSelectAll}
                    className="me-2"
                  >
                    {selectedRules.length === allRules.length ? 'Deselect All' : 'Select All'}
                  </CButton>
                  <CButton color="primary" size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilSave} className="me-2" />
                        Save Rules
                      </>
                    )}
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Rules by Resource */}
      {Object.keys(rulesByResource).map((resource) => {
        const rules = rulesByResource[resource]
        const allResourceSelected = rules.every((r) => selectedRules.includes(r.id))
        const someResourceSelected = rules.some((r) => selectedRules.includes(r.id))

        return (
          <CRow key={resource} className="mb-4">
            <CCol xs={12}>
              <CCard>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-capitalize">{resource}</strong>
                    <CBadge color="secondary" className="ms-2">
                      {rules.length} rules
                    </CBadge>
                    {someResourceSelected && (
                      <CBadge color="primary" className="ms-2">
                        {rules.filter((r) => selectedRules.includes(r.id)).length} selected
                      </CBadge>
                    )}
                  </div>
                  <CButton
                    color={allResourceSelected ? 'danger' : 'success'}
                    size="sm"
                    variant="outline"
                    onClick={() => handleSelectByResource(resource)}
                  >
                    {allResourceSelected ? 'Deselect All' : 'Select All'}
                  </CButton>
                </CCardHeader>
                <CCardBody>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell style={{ width: '50px' }}>Select</CTableHeaderCell>
                        <CTableHeaderCell>Rule Name</CTableHeaderCell>
                        <CTableHeaderCell>Action</CTableHeaderCell>
                        <CTableHeaderCell>Description</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {rules.map((rule) => (
                        <CTableRow
                          key={rule.id}
                          className={selectedRules.includes(rule.id) ? 'table-active' : ''}
                        >
                          <CTableDataCell>
                            <CFormCheck
                              id={`rule-${rule.id}`}
                              checked={selectedRules.includes(rule.id)}
                              onChange={() => handleToggleRule(rule.id)}
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <strong>{rule.name}</strong>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getActionBadgeColor(rule.action)}>{rule.action}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <small className="text-muted">{rule.description || '-'}</small>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        )
      })}

      {/* Save Button (Bottom) */}
      <CRow className="mb-4">
        <CCol className="text-end">
          <CButton
            color="secondary"
            variant="outline"
            onClick={() => navigate('/groups')}
            className="me-2"
          >
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <CIcon icon={cilSave} className="me-2" />
                Save Rules
              </>
            )}
          </CButton>
        </CCol>
      </CRow>
    </>
  )
}

export default GroupRules
