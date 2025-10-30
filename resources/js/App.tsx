import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { SidebarProvider } from './contexts/SidebarContext'
import '../scss/style.scss'

// Containers
const DefaultLayout = lazy(() => import('./layouts/DefaultLayout'))

const App = () => {
  return (
    <HashRouter>
      <SidebarProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="*" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </SidebarProvider>
    </HashRouter>
  )
}

export default App
