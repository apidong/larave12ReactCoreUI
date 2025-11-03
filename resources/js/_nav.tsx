import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilUser, cilGroup, cilShieldAlt, cilSettings } from '@coreui/icons'
import { CNavItem, CNavGroup } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Management',
    to: '/management',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Users',
        to: '/users',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Groups',
        to: '/groups',
        icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Rules',
        to: '/rules',
        icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
      },
    ],
  },
]

export default _nav
