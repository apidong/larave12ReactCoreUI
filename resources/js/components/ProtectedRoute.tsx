import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppDispatch'
import { canAccessRoute } from '../utils/permissions'

interface ProtectedRouteProps {
  children: React.ReactNode
  path?: string
}

const ProtectedRoute = ({ children, path }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if user has permission to access this route (if path is provided)
  if (path && !canAccessRoute(path)) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Access Denied</h4>
          <p>You don't have permission to access this page.</p>
          <hr />
          <p className="mb-0">Please contact your administrator if you believe this is an error.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
