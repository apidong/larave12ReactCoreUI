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
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (visible) {
      if (group) {
        setFormData({
          name: group.name,
          description: group.description || '',
          is_active: group.is_active,
        })
      } else {
        setFormData({
          name: '',
          description: '',
          is_active: true,
        })
      }
      setError('')
    }
  }, [visible, group])

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
    <CModal visible={visible} onClose={onClose} backdrop="static">
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
            <small className="text-muted">
              Note: Assign rules to this group using the "Assign Rules" button in the groups table
            </small>
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
