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
  CFormSelect,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { Rule, RuleFormData } from '../../services/ruleService'

interface RuleFormProps {
  visible: boolean
  onClose: () => void
  onSubmit: (data: RuleFormData) => Promise<void>
  rule?: Rule | null
}

const RuleForm = ({ visible, onClose, onSubmit, rule }: RuleFormProps) => {
  const [formData, setFormData] = useState<RuleFormData>({
    name: '',
    resource: '',
    action: 'read',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (visible) {
      if (rule) {
        setFormData({
          name: rule.name,
          resource: rule.resource,
          action: rule.action,
          description: rule.description || '',
        })
      } else {
        setFormData({
          name: '',
          resource: '',
          action: 'read',
          description: '',
        })
      }
      setError('')
    }
  }, [visible, rule])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Only send description for update
      await onSubmit({ description: formData.description })
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CModal visible={visible} onClose={onClose} backdrop="static">
      <CModalHeader>
        <CModalTitle>Edit Deskripsi Rule</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError('')}>
              {error}
            </CAlert>
          )}
          <div className="mb-3">
            <CFormLabel htmlFor="name">Nama</CFormLabel>
            <CFormInput type="text" id="name" name="name" value={formData.name} disabled readOnly />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="resource">Resource</CFormLabel>
            <CFormInput
              type="text"
              id="resource"
              name="resource"
              value={formData.resource}
              disabled
              readOnly
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="action">Action</CFormLabel>
            <CFormInput
              type="text"
              id="action"
              name="action"
              value={formData.action}
              disabled
              readOnly
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="description">Deskripsi</CFormLabel>
            <CFormTextarea
              id="description"
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Jelaskan apa yang diizinkan oleh rule ini..."
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </CButton>
          <CButton color="primary" type="submit" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : rule ? 'Update' : 'Create'}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default RuleForm
