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
  CFormSelect,
  CFormCheck,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { User, UserFormData } from '../../services/userService'
import { groupService, Group } from '../../services/groupService'

interface UserFormProps {
  visible: boolean
  onClose: () => void
  onSubmit: (data: UserFormData) => Promise<void>
  user?: User | null
}

const UserForm = ({ visible, onClose, onSubmit, user }: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'user',
    is_active: true,
    group_id: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [groups, setGroups] = useState<Group[]>([])
  const [loadingGroups, setLoadingGroups] = useState(false)

  // Fetch groups when modal opens
  useEffect(() => {
    if (visible) {
      fetchGroups()

      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          password: '',
          role: user.role,
          is_active: user.is_active,
          group_id: user.group_id || null,
        })
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'user',
          is_active: true,
          group_id: null,
        })
      }
      setError('')
    }
  }, [visible, user])

  const fetchGroups = async () => {
    setLoadingGroups(true)
    try {
      // Fetch all active groups (no pagination, no search)
      const response = await groupService.getGroups(1, 100, '')
      setGroups(response.data.filter((g) => g.is_active))
    } catch (err) {
      console.error('Failed to fetch groups:', err)
      setGroups([])
    } finally {
      setLoadingGroups(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (!formData.email.trim()) throw new Error('Email is required')
      if (!user && !formData.password) throw new Error('Password is required for new users')
      if (formData.password && formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters')
      }

      const submitData: UserFormData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active,
        group_id: formData.group_id,
      }

      if (formData.password) {
        submitData.password = formData.password
      }

      await onSubmit(submitData)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CModal visible={visible} onClose={onClose} backdrop="static">
      <CModalHeader>
        <CModalTitle>{user ? 'Edit User' : 'Add New User'}</CModalTitle>
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
            <CFormLabel htmlFor="email">Email *</CFormLabel>
            <CFormInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="password">
              Password {user ? '(leave blank to keep current)' : '*'}
            </CFormLabel>
            <CFormInput
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!user}
              minLength={8}
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="group_id">Role (Group)</CFormLabel>
            <CFormSelect
              id="group_id"
              name="group_id"
              value={formData.group_id || ''}
              onChange={handleChange}
              disabled={loadingGroups}
            >
              <option value="">-- No Group --</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </CFormSelect>
            {loadingGroups && <small className="text-muted">Loading groups...</small>}
            {!loadingGroups && groups.length === 0 && (
              <small className="text-muted">No active groups available</small>
            )}
          </div>
          <div className="mb-3">
            <CFormCheck
              id="is_active"
              name="is_active"
              label="Active User"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <small className="text-muted">Inactive users cannot login to the system</small>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </CButton>
          <CButton color="primary" type="submit" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : user ? 'Update' : 'Create'}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default UserForm
