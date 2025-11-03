import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import PermissionDebugger from '../../components/PermissionDebugger'

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>

      {/* Permission Debugger - Development Only */}
      <PermissionDebugger />

      <CRow className="mt-4">
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Dashboard</strong>
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
