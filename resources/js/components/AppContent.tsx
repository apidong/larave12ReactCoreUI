import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner, CAlert } from '@coreui/react'
import { canAccessRoute } from '../utils/permissions'

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer className="px-4" fluid>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            // Check if user has permission to access this route
            const hasAccess = canAccessRoute(route.path)

            return route.element ? (
              <Route
                key={idx}
                path={route.path}
                element={
                  hasAccess ? (
                    <route.element />
                  ) : (
                    <CAlert color="danger">
                      <h4 className="alert-heading">Access Denied</h4>
                      <p>You don't have permission to access this page.</p>
                      <hr />
                      <p className="mb-0">
                        Please contact your administrator if you believe this is an error.
                      </p>
                    </CAlert>
                  )
                }
              />
            ) : null
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default AppContent
