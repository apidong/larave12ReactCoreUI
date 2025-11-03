import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SidebarState {
  sidebarShow: boolean
  sidebarUnfoldable: boolean
}

const initialState: SidebarState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
}

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSidebarShow: (state, action: PayloadAction<boolean>) => {
      state.sidebarShow = action.payload
    },
    setSidebarUnfoldable: (state, action: PayloadAction<boolean>) => {
      state.sidebarUnfoldable = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarShow = !state.sidebarShow
    },
  },
})

export const { setSidebarShow, setSidebarUnfoldable, toggleSidebar } = sidebarSlice.actions
export default sidebarSlice.reducer
