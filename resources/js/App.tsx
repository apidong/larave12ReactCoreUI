import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import ProtectedRoute from './components/ProtectedRoute'
import '../scss/style.scss'

// Containers
const DefaultLayout = lazy(() => import('./layouts/DefaultLayout'))

// Pages
const Login = lazy(() => import('./views/pages/login/Login'))

const App = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <DefaultLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </HashRouter>
    </Provider>
  )
}

export default App
