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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CInputGroup,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPencil,
  cilTrash,
  cilUserPlus,
  cilSearch,
  cilLockLocked,
  cilCheckCircle,
  cilXCircle,
} from '@coreui/icons'
import { userService, User, UserFormData } from '../../services/userService'
import UserForm from './UserForm'

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [toggling, setToggling] = useState<number | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [search])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await userService.getUsers(1, 100, search)
      setUsers(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  // Handle create user
  const handleCreate = () => {
    setEditingUser(null)
    setShowModal(true)
  }

  // Handle edit user
  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowModal(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = (user: User) => {
    setDeletingUser(user)
    setShowDeleteModal(true)
  }

  // Handle delete user
  const handleDelete = async () => {
    if (!deletingUser) return

    try {
      setDeleting(true)
      await userService.deleteUser(deletingUser.id)
      setSuccess('User deleted successfully')
      setShowDeleteModal(false)
      setDeletingUser(null)
      fetchUsers()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user')
    } finally {
      setDeleting(false)
    }
  }

  // Handle reset password confirmation
  const handleResetPasswordConfirm = (user: User) => {
    setResetPasswordUser(user)
    setNewPassword('')
    setShowResetPasswordModal(true)
  }

  // Handle reset password
  const handleResetPassword = async () => {
    if (!resetPasswordUser || !newPassword) return

    try {
      setResetting(true)
      await userService.updateUser(resetPasswordUser.id, { password: newPassword })
      setSuccess(`Password for ${resetPasswordUser.name} has been reset successfully`)
      setShowResetPasswordModal(false)
      setResetPasswordUser(null)
      setNewPassword('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setResetting(false)
    }
  }

  // Handle form submit
  const handleFormSubmit = async (formData: UserFormData) => {
    try {
      setError('')
      setSuccess('')

      if (editingUser) {
        await userService.updateUser(editingUser.id, formData)
        setSuccess('User updated successfully')
      } else {
        await userService.createUser(formData)
        setSuccess('User created successfully')
      }

      setShowModal(false)
      setEditingUser(null)
      fetchUsers()
    } catch (err: any) {
      throw err // Let UserForm handle the error
    }
  }

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  // Handle toggle user status
  const handleToggleStatus = async (user: User) => {
    try {
      setToggling(user.id)
      const response = await userService.toggleUserStatus(user.id)
      setSuccess(response.message)
      fetchUsers()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle user status')
    } finally {
      setToggling(null)
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>User Management</strong>
              <CButton color="primary" onClick={handleCreate}>
                <CIcon icon={cilUserPlus} className="me-2" />
                Add User
              </CButton>
            </CCardHeader>
            <CCardBody>
              {/* Alerts */}
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

              {/* Search */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CInputGroup>
                    <CFormInput
                      type="text"
                      placeholder="Search by name, email, or role..."
                      value={search}
                      onChange={handleSearch}
                    />
                    <CButton color="secondary" variant="outline">
                      <CIcon icon={cilSearch} />
                    </CButton>
                  </CInputGroup>
                </CCol>
              </CRow>

              {/* Table */}
              {loading ? (
                <div className="text-center p-5">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Group</CTableHeaderCell>
                      <CTableHeaderCell>Role</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={7} className="text-center">
                          No users found
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      users.map((user, index) => (
                        <CTableRow key={user.id}>
                          <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                          <CTableDataCell>{user.name}</CTableDataCell>
                          <CTableDataCell>{user.email}</CTableDataCell>
                          <CTableDataCell>
                            {user.group ? (
                              <CBadge color="primary">{user.group.name}</CBadge>
                            ) : (
                              <span className="text-muted">No Group</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={user.role === 'admin' ? 'danger' : 'info'}>
                              {user.role}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={user.is_active ? 'success' : 'secondary'}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="info"
                              variant="ghost"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(user)}
                              title="Edit User"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color={user.is_active ? 'secondary' : 'success'}
                              variant="ghost"
                              size="sm"
                              className="me-2"
                              onClick={() => handleToggleStatus(user)}
                              disabled={toggling === user.id}
                              title={user.is_active ? 'Deactivate User' : 'Activate User'}
                            >
                              <CIcon icon={user.is_active ? cilXCircle : cilCheckCircle} />
                            </CButton>
                            <CButton
                              color="warning"
                              variant="ghost"
                              size="sm"
                              className="me-2"
                              onClick={() => handleResetPasswordConfirm(user)}
                              title="Reset Password"
                            >
                              <CIcon icon={cilLockLocked} />
                            </CButton>
                            <CButton
                              color="danger"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteConfirm(user)}
                              title="Delete User"
                            >
                              <CIcon icon={cilTrash} />
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

      {/* User Form Modal */}
      <UserForm
        visible={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingUser(null)
        }}
        onSubmit={handleFormSubmit}
        user={editingUser}
      />

      {/* Delete Confirmation Modal */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete user <strong>{deletingUser?.name}</strong>?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <CSpinner size="sm" /> : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Reset Password Modal */}
      <CModal visible={showResetPasswordModal} onClose={() => setShowResetPasswordModal(false)}>
        <CModalHeader>
          <CModalTitle>Reset Password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Reset password for user: <strong>{resetPasswordUser?.name}</strong>
          </p>
          <CFormInput
            type="password"
            placeholder="Enter new password (min 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
          />
          <small className="text-muted">Minimum 8 characters</small>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowResetPasswordModal(false)}>
            Cancel
          </CButton>
          <CButton
            color="warning"
            onClick={handleResetPassword}
            disabled={resetting || newPassword.length < 8}
          >
            {resetting ? <CSpinner size="sm" /> : 'Reset Password'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Users
