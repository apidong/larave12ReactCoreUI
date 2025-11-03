import { useEffect, useMemo } from 'react'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch'
import { setSidebarShow, setSidebarUnfoldable } from '../store/slices/sidebarSlice'

// sidebar nav config
import navigation from '../_nav'
import { filterNavByPermissions } from '../utils/permissions'

const AppSidebar = () => {
  const dispatch = useAppDispatch()
  const { sidebarShow, sidebarUnfoldable } = useAppSelector((state) => state.sidebar)

  // Filter navigation based on user permissions
  const filteredNavigation = useMemo(() => {
    return filterNavByPermissions(navigation)
  }, []) // Re-calculate only when component mounts (permissions loaded)

  useEffect(() => {
    // Update CSS variables untuk wrapper padding
    const root = document.documentElement

    if (!sidebarShow) {
      // Sidebar hidden
      root.style.setProperty('--cui-sidebar-occupy-start', '0px')
    } else if (sidebarUnfoldable) {
      // Sidebar narrow/unfoldable
      root.style.setProperty('--cui-sidebar-occupy-start', '64px')
    } else {
      // Sidebar normal (expanded)
      root.style.setProperty('--cui-sidebar-occupy-start', '256px')
    }

    console.log('Sidebar State:', { sidebarShow, sidebarUnfoldable })
  }, [sidebarShow, sidebarUnfoldable])

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={sidebarUnfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(setSidebarShow(visible))
      }}
      onShow={() => {
        setSidebarShow(true)
      }}
      onHide={() => {
        setSidebarShow(false)
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand href="/#/">
          <svg
            className="sidebar-brand-full"
            width="118"
            height="32"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 118 32"
            role="img"
          >
            <title>Laravel + React</title>
            <text x="0" y="24" fill="currentColor" fontSize="18" fontWeight="bold">
              Laravel
            </text>
          </svg>
          <svg
            className="sidebar-brand-narrow"
            width="32"
            height="32"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            role="img"
          >
            <title>LR</title>
            <text x="6" y="24" fill="currentColor" fontSize="18" fontWeight="bold">
              LR
            </text>
          </svg>
        </CSidebarBrand>
        <CCloseButton className="d-lg-none" dark onClick={() => dispatch(setSidebarShow(false))} />
      </CSidebarHeader>
      <AppSidebarNav items={filteredNavigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={() => dispatch(setSidebarUnfoldable(!sidebarUnfoldable))} />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default AppSidebar
