import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Users = React.lazy(() => import('./views/users/Users'))
const Groups = React.lazy(() => import('./views/groups/Groups'))
const Rules = React.lazy(() => import('./views/rules/Rules'))

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
  { path: '/groups', name: 'Groups', element: Groups },
  { path: '/rules', name: 'Rules', element: Rules },
]

export default routes
