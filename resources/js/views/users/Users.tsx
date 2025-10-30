import { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import api from '@/api/axios'

interface User {
  id: number
  name: string
  email: string
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/demo/users')
      .then((response) => {
        setUsers(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching users:', error)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <h1>Users</h1>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>User List</strong>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users.map((user) => (
                      <CTableRow key={user.id}>
                        <CTableHeaderCell scope="row">{user.id}</CTableHeaderCell>
                        <CTableDataCell>{user.name}</CTableDataCell>
                        <CTableDataCell>{user.email}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
