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
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (visible) {
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          password: '',
          role: user.role,
          is_active: user.is_active,
        })
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'user',
          is_active: true,
        })
      }
      setError('')
    }
  }, [visible, user])

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
            <CFormLabel htmlFor="role">Role *</CFormLabel>
            <CFormSelect
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </CFormSelect>
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
