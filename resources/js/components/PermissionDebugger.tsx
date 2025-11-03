import { CCard, CCardBody, CCardHeader, CBadge, CRow, CCol, CAlert } from '@coreui/react'
import { authService, Permission } from '../services/authService'

const PermissionDebugger = () => {
  const user = authService.getCurrentUser()
  const permissions = authService.getPermissions()

  if (!user) {
    return <CAlert color="warning">No user logged in</CAlert>
  }

  return (
    <CRow>
      <CCol md={6}>
        <CCard>
          <CCardHeader>
            <strong>Current User</strong>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Group:</strong> {user.group?.name || 'No Group'}
            </p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={6}>
        <CCard>
          <CCardHeader>
            <strong>Permissions ({permissions.length})</strong>
          </CCardHeader>
          <CCardBody>
            {permissions.length === 0 ? (
              <p className="text-muted">No permissions assigned</p>
            ) : (
              <div>
                {permissions.map((perm: Permission, idx: number) => (
                  <div key={idx} className="mb-2">
                    <CBadge color="primary" className="me-2">
                      {perm.resource}
                    </CBadge>
                    <CBadge color="success">{perm.action}</CBadge>
                    <small className="ms-2 text-muted">{perm.name}</small>
                  </div>
                ))}
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PermissionDebugger
