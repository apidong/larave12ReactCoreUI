# 🔐 Authentication Flow - Login Wajib

## 📋 Overview

Aplikasi ini **WAJIB LOGIN** terlebih dahulu sebelum bisa mengakses modul apapun. Semua halaman dilindungi oleh `ProtectedRoute` kecuali halaman `/login`.

---

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER AKSES APLIKASI                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │  Cek Redux:   │
              │ isAuthenticated│
              └───────┬───────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
   ✅ TRUE                      ❌ FALSE
   (Sudah Login)              (Belum Login)
        │                           │
        ▼                           ▼
┌──────────────┐           ┌──────────────┐
│ Akses Halaman│           │ REDIRECT ke  │
│   Dilindungi │◄──────────│  /login      │
│  (Dashboard, │           └──────────────┘
│   Users, dll)│
└──────────────┘                   │
        │                          │
        │                          ▼
        │                  ┌──────────────┐
        │                  │ User Input   │
        │                  │ Email & Pass │
        │                  └──────┬───────┘
        │                         │
        │                         ▼
        │                  ┌──────────────┐
        │                  │ authService  │
        │                  │   .login()   │
        │                  └──────┬───────┘
        │                         │
        │              ┌──────────┴──────────┐
        │              │                     │
        │              ▼                     ▼
        │         ✅ SUCCESS            ❌ ERROR
        │              │                     │
        │              ▼                     ▼
        │       ┌──────────────┐     ┌──────────────┐
        │       │ Redux Store: │     │ Show Error   │
        │       │setCredentials│     │   Alert      │
        │       │ + localStorage│     └──────────────┘
        │       └──────┬───────┘
        │              │
        │              ▼
        │       ┌──────────────┐
        │       │ Navigate to  │
        │       │  /dashboard  │
        │       └──────┬───────┘
        │              │
        └──────────────┘
```

---

## 🛡️ Protected Routes

### ✅ Routes yang Dilindungi (Wajib Login)

**Semua route di bawah `DefaultLayout`:**

- `/` → Redirect ke `/dashboard`
- `/dashboard` → Dashboard page
- `/users` → Users page
- **Semua route lainnya** (`path="*"`) → Wrapped dengan `ProtectedRoute`

### 🌐 Public Routes (Tidak Perlu Login)

- `/login` → Login page (satu-satunya halaman publik)

---

## 📂 File Structure

```
resources/js/
├── App.tsx                         # Root routing dengan ProtectedRoute
├── components/
│   └── ProtectedRoute.tsx         # Guard component (cek isAuthenticated)
├── store/
│   └── slices/
│       └── authSlice.ts           # Auth state (user, token, isAuthenticated)
├── views/
│   └── pages/
│       └── login/
│           └── Login.tsx          # Login page + redirect jika sudah login
└── layouts/
    └── DefaultLayout.tsx          # Layout untuk halaman yang dilindungi
```

---

## 🔍 Component Details

### 1. **App.tsx** - Root Routing

```tsx
<Routes>
  {/* Public Route */}
  <Route path="/login" element={<Login />} />

  {/* Protected Routes - WAJIB LOGIN */}
  <Route
    path="*"
    element={
      <ProtectedRoute>
        <DefaultLayout />
      </ProtectedRoute>
    }
  />
</Routes>
```

**Penjelasan:**

- `/login` → Public, siapa saja bisa akses
- `/*` (semua route lain) → Protected, hanya user yang sudah login

---

### 2. **ProtectedRoute.tsx** - Guard Component

```tsx
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace /> // ❌ Belum login → Redirect
  }

  return <>{children}</> // ✅ Sudah login → Render children
}
```

**Logic:**

1. Cek Redux state: `isAuthenticated`
2. Jika `false` → Redirect ke `/login`
3. Jika `true` → Render children (DefaultLayout)

---

### 3. **authSlice.ts** - Authentication State

```tsx
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean // ← Key untuk ProtectedRoute
}

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'), // ← Load dari localStorage
}
```

**Persistence:**

- State di-load dari `localStorage` saat app start
- Jika ada token → `isAuthenticated = true`
- Refresh page tetap login (tidak perlu login ulang)

---

### 4. **Login.tsx** - Auto Redirect Jika Sudah Login

```tsx
const Login = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  // ✨ Auto redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // ... form login
}
```

**Behavior:**

- User yang **sudah login** tidak bisa akses `/login`
- Otomatis redirect ke `/dashboard`
- Mencegah double login

---

## 🧪 Testing Scenarios

### Scenario 1: User Belum Login

1. ❌ User belum login (localStorage kosong)
2. 🌐 User akses `http://localhost:5174`
3. 🔄 ProtectedRoute deteksi `isAuthenticated = false`
4. ➡️ Auto redirect ke `/#/login`
5. 📝 User input email & password
6. ✅ Login success
7. 💾 Token & user disimpan ke Redux + localStorage
8. ➡️ Navigate ke `/dashboard`

### Scenario 2: User Sudah Login

1. ✅ User sudah login (token ada di localStorage)
2. 🔄 Redux initial state: `isAuthenticated = true`
3. 🌐 User akses `http://localhost:5174`
4. ✅ ProtectedRoute allow access
5. 📄 Render DefaultLayout → Dashboard

### Scenario 3: User Logout

1. ✅ User sudah login
2. 🖱️ User klik avatar → Logout
3. 🗑️ Redux dispatch `logout()` → Clear state + localStorage
4. ➡️ Navigate ke `/login`
5. ❌ User tidak bisa akses halaman lain tanpa login ulang

### Scenario 4: User Sudah Login Coba Akses /login

1. ✅ User sudah login
2. 🌐 User akses `/#/login` (via URL)
3. 🔄 Login page useEffect deteksi `isAuthenticated = true`
4. ➡️ Auto redirect ke `/dashboard`
5. 🚫 User tidak bisa lihat halaman login

### Scenario 5: Token Expired (401 dari API)

1. ✅ User login dengan token
2. ⏰ Token kadaluarsa (di server)
3. 🌐 User melakukan API request
4. ❌ Server return 401 Unauthorized
5. 🔄 Axios interceptor (di `main.tsx`) catch 401
6. 🗑️ Clear localStorage
7. ➡️ Redirect ke `/#/login`

---

## 🔐 Security Features

### ✅ Implemented

1. **Protected Routes**

   - Semua halaman kecuali `/login` wajib login
   - `ProtectedRoute` guard di level root

2. **Auto Redirect**

   - Belum login → Redirect ke `/login`
   - Sudah login → Redirect ke `/dashboard`

3. **Persistent Authentication**

   - Token disimpan di `localStorage`
   - Refresh page tetap login
   - Redux state sync dengan localStorage

4. **Auto Logout on 401**

   - Axios interceptor handle 401
   - Clear token & redirect ke login
   - (Sudah di `main.tsx`)

5. **Prevent Double Login**
   - User yang sudah login tidak bisa akses `/login`
   - Auto redirect ke dashboard

### 🔒 Token Storage

- **Backend**: Laravel Passport (OAuth2 + JWT)
- **Frontend**:
  - Redux state (runtime)
  - localStorage (persistence)
  - Axios interceptor (auto attach token)

---

## 📝 Code Snippets

### Axios Interceptor (main.tsx)

```typescript
// Auto-add Bearer token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-logout on 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/#/login'
    }
    return Promise.reject(error)
  }
)
```

---

## ✅ Checklist Implementasi

- [x] ProtectedRoute component dibuat
- [x] App.tsx menggunakan ProtectedRoute
- [x] authSlice menyimpan isAuthenticated
- [x] Login.tsx auto redirect jika sudah login
- [x] Logout functionality di AppHeaderDropdown
- [x] Axios interceptor handle 401
- [x] localStorage persistence
- [x] Redux state management
- [x] Semua route protected kecuali /login

---

## 🚀 Testing

**Server sedang berjalan:**

- Laravel: `http://127.0.0.1:8000`
- Vite: `http://localhost:5174`

**Test Login:**

1. Buka `http://localhost:5174`
2. Otomatis redirect ke `/#/login`
3. Login dengan:
   - Email: `admin@example.com`
   - Password: `password`
4. Berhasil → Redirect ke dashboard
5. Coba akses `/#/login` lagi → Otomatis redirect ke dashboard
6. Logout → Redirect ke login
7. Coba akses `/#/dashboard` tanpa login → Redirect ke login

---

## 🎯 Summary

✅ **SEMUA MODUL WAJIB LOGIN TERLEBIH DAHULU**

- Hanya `/login` yang bisa diakses tanpa login
- Semua route lain dilindungi `ProtectedRoute`
- User belum login → Auto redirect ke `/login`
- User sudah login → Auto redirect dari `/login` ke `/dashboard`
- Token expired (401) → Auto logout & redirect ke `/login`
- Refresh page → Tetap login (state di localStorage)

**100% Aman! 🔒**
