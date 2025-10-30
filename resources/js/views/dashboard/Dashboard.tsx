import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Traffic</strong> <small>Last 7 Days</small>
            </CCardHeader>
            <CCardBody>
              <CChartLine
                data={{
                  labels: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ],
                  datasets: [
                    {
                      label: 'Visitors',
                      backgroundColor: 'rgba(220, 220, 220, 0.2)',
                      borderColor: 'rgba(220, 220, 220, 1)',
                      pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                      pointBorderColor: '#fff',
                      data: [40, 20, 12, 39, 10, 40, 39],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
