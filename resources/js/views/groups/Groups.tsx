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
import { cilPencil, cilTrash, cilPlus, cilSearch, cilCheckCircle, cilXCircle } from '@coreui/icons'
import { groupService, Group, GroupFormData } from '../../services/groupService'
import GroupForm from './GroupForm'

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState<number | null>(null)

  useEffect(() => {
    fetchGroups()
  }, [search])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await groupService.getGroups(1, 100, search)
      setGroups(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch groups')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingGroup(null)
    setShowModal(true)
  }

  const handleEdit = (group: Group) => {
    setEditingGroup(group)
    setShowModal(true)
  }

  const handleDeleteConfirm = (group: Group) => {
    setDeletingGroup(group)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingGroup) return

    try {
      setDeleting(true)
      await groupService.deleteGroup(deletingGroup.id)
      setSuccess('Group deleted successfully')
      setShowDeleteModal(false)
      setDeletingGroup(null)
      fetchGroups()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete group')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleStatus = async (group: Group) => {
    try {
      setToggling(group.id)
      const response = await groupService.toggleGroupStatus(group.id)
      setSuccess(response.message)
      fetchGroups()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle group status')
    } finally {
      setToggling(null)
    }
  }

  const handleFormSubmit = async (formData: GroupFormData) => {
    try {
      setError('')
      setSuccess('')

      if (editingGroup) {
        await groupService.updateGroup(editingGroup.id, formData)
        setSuccess('Group updated successfully')
      } else {
        await groupService.createGroup(formData)
        setSuccess('Group created successfully')
      }

      setShowModal(false)
      setEditingGroup(null)
      fetchGroups()
    } catch (err: any) {
      throw err
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Group Management</strong>
              <CButton color="primary" onClick={handleCreate}>
                <CIcon icon={cilPlus} className="me-2" />
                Add Group
              </CButton>
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
                      placeholder="Search by name or description..."
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
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Description</CTableHeaderCell>
                      <CTableHeaderCell>Users</CTableHeaderCell>
                      <CTableHeaderCell>Rules</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {groups.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={7} className="text-center">
                          No groups found
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      groups.map((group, index) => (
                        <CTableRow key={group.id}>
                          <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                          <CTableDataCell>{group.name}</CTableDataCell>
                          <CTableDataCell>{group.description || '-'}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="info">{group.users_count || 0}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="primary">{group.rules_count || 0}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={group.is_active ? 'success' : 'secondary'}>
                              {group.is_active ? 'Active' : 'Inactive'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="info"
                              variant="ghost"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(group)}
                              title="Edit Group"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color={group.is_active ? 'secondary' : 'success'}
                              variant="ghost"
                              size="sm"
                              className="me-2"
                              onClick={() => handleToggleStatus(group)}
                              disabled={toggling === group.id}
                              title={group.is_active ? 'Deactivate Group' : 'Activate Group'}
                            >
                              <CIcon icon={group.is_active ? cilXCircle : cilCheckCircle} />
                            </CButton>
                            <CButton
                              color="danger"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteConfirm(group)}
                              title="Delete Group"
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

      <GroupForm
        visible={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingGroup(null)
        }}
        onSubmit={handleFormSubmit}
        group={editingGroup}
      />

      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete group <strong>{deletingGroup?.name}</strong>?
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
    </>
  )
}

export default Groups
