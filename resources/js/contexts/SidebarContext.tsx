import React, { createContext, useState, useContext, ReactNode } from 'react'

interface SidebarContextType {
  sidebarShow: boolean
  setSidebarShow: (show: boolean) => void
  sidebarUnfoldable: boolean
  setSidebarUnfoldable: (unfoldable: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarShow, setSidebarShow] = useState(true)
  const [sidebarUnfoldable, setSidebarUnfoldable] = useState(false)

  return (
    <SidebarContext.Provider
      value={{ sidebarShow, setSidebarShow, sidebarUnfoldable, setSidebarUnfoldable }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
