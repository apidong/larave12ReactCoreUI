import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Users = React.lazy(() => import('./views/users/Users'))

interface Route {
  path: string
  name: string
  element?: React.LazyExoticComponent<React.FC>
  exact?: boolean
}

const routes: Route[] = [
  { path: '/', name: 'Home', exact: true },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'Users', element: Users },
]

export default routes
