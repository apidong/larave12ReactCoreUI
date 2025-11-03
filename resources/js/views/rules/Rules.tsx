import { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CSpinner,
  CAlert,
  CBadge,
  CInputGroup,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSearch } from '@coreui/icons'
import { ruleService, Rule, RuleFormData } from '../../services/ruleService'
import RuleForm from './RuleForm'

const Rules = () => {
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)

  useEffect(() => {
    fetchRules()
  }, [search])

  const fetchRules = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await ruleService.getRules(1, 100, search)
      setRules(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch rules')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule)
    setShowModal(true)
  }

  const handleFormSubmit = async (formData: RuleFormData) => {
    try {
      setError('')
      setSuccess('')

      if (editingRule) {
        await ruleService.updateRule(editingRule.id, formData)
        setSuccess('Deskripsi rule berhasil diperbarui')
      }

      setShowModal(false)
      setEditingRule(null)
      fetchRules()
    } catch (err: any) {
      throw err
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

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

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Manajemen Rule</strong>
            </CCardHeader>
            <CCardBody>
              {error && (
                <CAlert color="danger" dismissible onClose={() => setError('')}>
                  {error}
                </CAlert>
              )}
              {success && (
                <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                  {success}
                </CAlert>
              )}

              <CRow className="mb-3">
                <CCol md={6}>
                  <CInputGroup>
                    <CFormInput
                      type="text"
                      placeholder="Cari berdasarkan nama, resource, action..."
                      value={search}
                      onChange={handleSearch}
                    />
                    <CButton color="secondary" variant="outline">
                      <CIcon icon={cilSearch} />
                    </CButton>
                  </CInputGroup>
                </CCol>
              </CRow>

              {loading ? (
                <div className="text-center p-5">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Nama</CTableHeaderCell>
                      <CTableHeaderCell>Resource</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                      <CTableHeaderCell>Deskripsi</CTableHeaderCell>
                      <CTableHeaderCell>Groups</CTableHeaderCell>
                      <CTableHeaderCell>Aksi</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {rules.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={7} className="text-center">
                          Tidak ada rule ditemukan
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      rules.map((rule, index) => (
                        <CTableRow key={rule.id}>
                          <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                          <CTableDataCell>{rule.name}</CTableDataCell>
                          <CTableDataCell>
                            <code>{rule.resource}</code>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getActionBadgeColor(rule.action)}>{rule.action}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{rule.description || '-'}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="info">{rule.groups_count || 0}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="info"
                              variant="ghost"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(rule)}
                              title="Edit Deskripsi"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <RuleForm
        visible={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingRule(null)
        }}
        onSubmit={handleFormSubmit}
        rule={editingRule}
      />
    </>
  )
}

export default Rules
