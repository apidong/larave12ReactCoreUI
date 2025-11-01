# 🤖 Copilot Instructions for Laravel 12 + React + CoreUI + Passport

## 🏗️ Project Overview

This is a **full-stack admin dashboard** with Laravel backend API and React frontend:

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 18 + TypeScript 5 + Vite 5
- **UI Framework:** CoreUI React 5.4 (Free Admin Template)
- **Authentication:** Laravel Passport (OAuth2 + JWT)
- **State Management:** Redux Toolkit
- **Data Fetching:** React Query (TanStack Query)
- **Database:** MySQL
- **Routing:** React Router v6 (HashRouter)
- **Icons:** CoreUI Icons
- **Styling:** SCSS with CoreUI mixins

**Project structure:**

```
laravel12coreui/
├── app/
│   ├── Http/Controllers/
│   │   └── AuthController.php (Passport auth)
│   └── Models/
│       └── User.php (HasApiTokens trait)
├── config/
│   ├── auth.php (api guard: passport)
│   ├── cors.php (allow all origins)
│   └── passport.php
├── database/
│   └── migrations/
│       ├── *_create_oauth_*_table.php (Passport)
│       └── *_add_test_users_*.php (auto-create test users)
├── resources/
│   ├── js/
│   │   ├── components/ (React components)
│   │   ├── store/ (Redux store & slices)
│   │   ├── hooks/ (Custom hooks: useAppDispatch, useAppSelector)
│   │   ├── layouts/ (DefaultLayout)
│   │   ├── services/ (authService.ts)
│   │   ├── views/ (Dashboard, etc.)
│   │   ├── App.tsx
│   │   └── main.tsx (axios interceptors)
│   ├── scss/
│   │   └── style.scss (CoreUI with @use syntax)
│   └── views/
│       └── app.blade.php
├── routes/
│   ├── api.php (API endpoints)
│   └── web.php (SPA catch-all)
└── storage/
    ├── oauth-private.key
    └── oauth-public.key
```

---

## 🔐 Authentication (Laravel Passport)

### Backend Rules

- **ALL API routes** use `auth:api` middleware (Passport driver)
- User model MUST have `HasApiTokens` trait from Laravel\Passport
- Token type: **Bearer JWT**
- Login returns: `{ user, access_token, token_type: "Bearer" }`

### API Endpoints

**Public routes:**

```php
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
```

**Protected routes (require Bearer token):**

```php
Route::middleware('auth:api')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    // Add more protected routes here
});
```

### Test Users

Migration auto-creates test users (no manual seeding):

- `admin@example.com` / `password`
- `user@example.com` / `password`

---

## 🎨 Frontend (React + TypeScript + CoreUI)

### Component Rules

- **Use Functional Components** with React Hooks
- **NO class components** - use hooks: `useState`, `useEffect`, `useContext`
- **Remove React imports** - automatic JSX transform enabled
- **Use TypeScript** - all props must have interfaces
- Use **CoreUI components** from `@coreui/react`:
  - Layout: `CContainer`, `CRow`, `CCol`
  - Navigation: `CSidebar`, `CHeader`, `CFooter`
  - Forms: `CForm`, `CFormInput`, `CButton`
  - Cards: `CCard`, `CCardBody`, `CCardHeader`

### File Structure

```
resources/js/
├── components/
│   ├── AppSidebar.tsx
│   ├── AppHeader.tsx
│   ├── AppFooter.tsx
│   ├── AppContent.tsx
│   └── index.ts (barrel exports)
├── store/
│   ├── store.ts (Redux store config)
│   └── slices/
│       ├── sidebarSlice.ts
│       └── authSlice.ts
├── hooks/
│   └── useAppDispatch.ts (typed hooks)
├── layouts/
│   └── DefaultLayout.tsx
├── services/
│   └── authService.ts (Passport auth)
├── views/
│   ├── dashboard/
│   └── pages/
├── App.tsx (Provider + HashRouter)
└── main.tsx (axios interceptors)
```

### Axios Configuration

**In `main.tsx`:**

```typescript
import axios from 'axios'

// Setup defaults
axios.defaults.baseURL = 'http://localhost:8000/api'
axios.defaults.headers.common['Accept'] = 'application/json'

// Auto-add token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/#/login'
    }
    return Promise.reject(error)
  }
)
```

### Auth Service Pattern

**In `services/authService.ts`:**

```typescript
export interface LoginCredentials {
  email: string
  password: string
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axios.post('/auth/login', credentials)
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  async logout() {
    await axios.post('/auth/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getToken() {
    return localStorage.getItem('token')
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },
}
```

---

## 🎨 Styling (SCSS + CoreUI)

### SCSS Structure

**Main file:** `resources/scss/style.scss`

```scss
// Use @use syntax (NOT @import)
@use '@coreui/coreui/scss/coreui' as * with (
  $enable-deprecation-messages: false
);

@import 'simplebar-react/dist/simplebar.min.css';

// Custom styles
.wrapper {
  width: 100%;
  padding-inline: var(--cui-sidebar-occupy-start, 0) var(--cui-sidebar-occupy-end, 0);
  will-change: auto;
  @include transition(padding 0.15s);
}
```

### Import in App.tsx

```typescript
import '../scss/style.scss' // NOT CSS!
```

---

## 🧭 Routing (React Router v6)

### Router Setup

```typescript
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <HashRouter>
      <SidebarProvider>
        <Routes>
          <Route path="*" element={<DefaultLayout />} />
        </Routes>
      </SidebarProvider>
    </HashRouter>
  )
}
```

### Route Configuration

**File:** `resources/js/routes.ts`

```typescript
import { lazy } from 'react'

const Dashboard = lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
]

export default routes
```

### NO `exact` prop in Routes!

React Router v6 doesn't use `exact` - all routes are exact by default.

---

## 🔧 Backend API Rules

### Controller Structure

```php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth_token')->accessToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}
```

### Validation Rules

- Always validate requests
- Return JSON errors with proper status codes
- Use Laravel's built-in validation

---

## 🔗 CORS Configuration

**File:** `config/cors.php`

```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['*'],  // All IPs allowed
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

---

## 📦 Key Dependencies

### Backend

- Laravel 12 (PHP 8.2+)
- Laravel Passport 13.3 (OAuth2 + JWT)
- MySQL database

### Frontend

- React 18.3.1
- TypeScript 5.6.3
- Vite 5.4.21
- CoreUI React 5.4.0
- React Router DOM 6.28.0
- Redux Toolkit 2.9.2 (State Management)
- React Redux 9.2.0
- TanStack React Query 5.90.6 (Data Fetching)
- Axios for HTTP requests
- simplebar-react for scrolling

---

## 🗂️ State Management

**Use Redux Toolkit** for global state management:

### Setup Redux Store

**File:** `resources/js/store/store.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './slices/sidebarSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### Create Slices

**File:** `resources/js/store/slices/sidebarSlice.ts`

```typescript
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
```

**File:** `resources/js/store/slices/authSlice.ts`

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: number
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
```

### Custom Hooks

**File:** `resources/js/hooks/useAppDispatch.ts`

```typescript
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

### Provider Setup

**File:** `resources/js/App.tsx`

```typescript
import { Provider } from 'react-redux'
import { store } from './store/store'
import { HashRouter } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <DefaultLayout />
      </HashRouter>
    </Provider>
  )
}

export default App
```

### Usage in Components

```typescript
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch'
import { setSidebarShow, toggleSidebar } from '../store/slices/sidebarSlice'

const MyComponent = () => {
  const dispatch = useAppDispatch()
  const { sidebarShow, sidebarUnfoldable } = useAppSelector((state) => state.sidebar)

  const handleToggle = () => {
    dispatch(toggleSidebar())
  }

  return <button onClick={handleToggle}>Toggle Sidebar</button>
}
```

### Redux DevTools

Redux Toolkit automatically includes Redux DevTools integration. Install browser extension:

- Chrome: Redux DevTools Extension
- Firefox: Redux DevTools Extension

---

## 🔄 Data Fetching (React Query)

**Use TanStack React Query** for server state management and API data fetching:

### Setup Query Client

**File:** `resources/js/main.tsx`

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App'

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
```

### Query Hooks Pattern

**File:** `resources/js/hooks/useUsers.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface User {
  id: number
  name: string
  email: string
}

// Fetch all users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get<User[]>('/users')
      return data
    },
  })
}

// Fetch single user
export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const { data } = await axios.get<User>(`/users/${id}`)
      return data
    },
    enabled: !!id, // Only fetch if id exists
  })
}

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newUser: Omit<User, 'id'>) => {
      const { data } = await axios.post<User>('/users', newUser)
      return data
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<User> & { id: number }) => {
      const { data } = await axios.put<User>(`/users/${id}`, updates)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', data.id] })
    },
  })
}

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/users/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

### Usage in Components

```typescript
import { useUsers, useCreateUser, useDeleteUser } from '../hooks/useUsers'
import { CCard, CCardBody, CButton, CSpinner } from '@coreui/react'

const UsersPage = () => {
  const { data: users, isLoading, error } = useUsers()
  const createUser = useCreateUser()
  const deleteUser = useDeleteUser()

  const handleCreate = () => {
    createUser.mutate({
      name: 'New User',
      email: 'new@example.com',
    })
  }

  const handleDelete = (id: number) => {
    deleteUser.mutate(id)
  }

  if (isLoading) return <CSpinner />
  if (error) return <div>Error: {error.message}</div>

  return (
    <CCard>
      <CCardBody>
        <CButton onClick={handleCreate} disabled={createUser.isPending}>
          {createUser.isPending ? 'Creating...' : 'Create User'}
        </CButton>

        {users?.map((user) => (
          <div key={user.id}>
            {user.name} - {user.email}
            <CButton onClick={() => handleDelete(user.id)} disabled={deleteUser.isPending}>
              Delete
            </CButton>
          </div>
        ))}
      </CCardBody>
    </CCard>
  )
}
```

### Query Key Patterns

**Recommended query key structure:**

```typescript
// All users
;['users'][
  // Single user
  ('users', userId)
][
  // Users with filters
  ('users', { status: 'active', page: 1 })
][
  // User posts
  ('users', userId, 'posts')
][
  // Single post
  ('posts', postId)
]
```

### React Query DevTools

React Query DevTools included automatically in development mode:

- View all queries and their states
- Manually trigger refetch
- Clear cache
- Inspect query details

---

## 🎯 Database Migrations

### Migration Best Practices

- **Auto-create test data** in migrations (not seeders)
- Check if data exists before insert
- Provide proper `down()` method for rollback

Example:

```php
public function up(): void
{
    $users = [
        ['name' => 'Admin', 'email' => 'admin@example.com', 'password' => Hash::make('password')],
    ];

    foreach ($users as $userData) {
        if (!DB::table('users')->where('email', $userData['email'])->exists()) {
            DB::table('users')->insert($userData);
        }
    }
}

public function down(): void
{
    DB::table('users')->whereIn('email', ['admin@example.com'])->delete();
}
```

---

## 🛠️ Development Workflow

### Starting Dev Servers

```bash
# Terminal 1: Laravel
php artisan serve
# Runs on http://localhost:8000

# Terminal 2: Vite (React)
npm run dev
# Runs on http://localhost:5174
```

### Common Commands

```bash
# Laravel
php artisan migrate              # Run migrations
php artisan migrate:fresh        # Fresh migration (drops all)
php artisan passport:install     # Setup Passport
php artisan config:clear         # Clear config cache
php artisan route:list           # Show all routes

# React
npm run dev                      # Dev server
npm run build                    # Production build
npm run preview                  # Preview build
```

---

## 🧪 Testing

### API Testing

Test users auto-created by migration:

- Email: `admin@example.com` / Password: `password`
- Email: `user@example.com` / Password: `password`

PowerShell test:

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"admin@example.com","password":"password"}'
```

Expected response:

```json
{
  "message": "Login successful",
  "user": { "id": 1, "name": "Admin User", "email": "admin@example.com" },
  "access_token": "eyJ0eXAiOiJKV1Qi...",
  "token_type": "Bearer"
}
```

---

## 🚨 Common Issues & Solutions

### "Token not working"

```bash
php artisan config:clear
php artisan cache:clear
php artisan passport:install --force
```

### "CORS error"

Check `config/cors.php` - should allow `*` origins for development

### "Sidebar not full width"

Check CSS variables in `resources/scss/style.scss`:

```scss
.wrapper {
  padding-inline: var(--cui-sidebar-occupy-start, 0) var(--cui-sidebar-occupy-end, 0);
}
```

### "React Router not working"

Use `HashRouter` (not BrowserRouter) for Laravel SPA:

```typescript
import { HashRouter } from 'react-router-dom'
```

---

## 💡 AI Copilot Guidelines

When generating code:

### For Laravel Controllers

```php
// Always use this pattern
public function index()
{
    $items = Model::all();
    return response()->json($items);
}

public function store(Request $request)
{
    $validated = $request->validate([...]);
    $item = Model::create($validated);
    return response()->json($item, 201);
}
```

### For React Components

```typescript
// Always use this pattern
import { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import axios from 'axios'

interface Item {
  id: number
  name: string
}

const MyComponent = () => {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get<Item[]>('/items')
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <CCard>
      <CCardHeader>Items</CCardHeader>
      <CCardBody>
        {loading ? 'Loading...' : items.map((item) => <div key={item.id}>{item.name}</div>)}
      </CCardBody>
    </CCard>
  )
}

export default MyComponent
```

### For New Features

1. **Backend**: Create migration → model → controller → routes
2. **Frontend**: Create interface → service → component → route
3. **Connect**: Use axios with Bearer token

---

## ✅ Quality Checklist

Before committing code:

**Backend:**

- [ ] All routes return JSON
- [ ] Validation implemented
- [ ] Uses `auth:api` middleware where needed
- [ ] Migration has proper `down()` method
- [ ] No hardcoded credentials

**Frontend:**

- [ ] TypeScript interfaces defined
- [ ] No `any` types
- [ ] Axios interceptors handle 401
- [ ] CoreUI components used
- [ ] Responsive design
- [ ] Loading states handled
- [ ] Error handling implemented

---

## 🎓 Learning Resources

- [Laravel 12 Docs](https://laravel.com/docs/12.x)
- [Laravel Passport](https://laravel.com/docs/12.x/passport)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [CoreUI React](https://coreui.io/react/docs/getting-started/introduction/)
- [React Router v6](https://reactrouter.com/en/main)

---

> 🤖 **This copilot-instructions.md defines the complete coding standards, architecture patterns, and best practices for AI-assisted development in this Laravel + React + CoreUI + Passport project.**

---

## 🧱 Architecture Guidelines

- All reusable UI logic goes into `src/components/`.
- Page-level components (views) go in `src/views/`.
- Routing defined in `src/routes/`.
- Layouts (navbar, sidebar, etc.) in `src/layouts/`.
- Global contexts (auth, theme, etc.) in `src/context/`.
- Use absolute imports (`@/components/...`) based on `tsconfig.json` paths.

---

## 🧰 Coding Standards

- Follow **SOLID principles** for both Laravel and React code.
- Use **camelCase** for variables and functions, **PascalCase** for components and types.
- All functions and components must have clear typing (no `any`).
- Write clean, self-documenting code. Avoid magic numbers or strings.

---

## 🧪 Testing

- Laravel: use `php artisan test` (Feature + Unit tests)
- React: use Vitest and React Testing Library (`npm run test`)

---

## 🚀 Build and Deploy

1. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Copy to Laravel public folder:
   ```bash
   cp -r dist/* ../backend/public/
   ```
3. Serve Laravel:
   ```bash
   cd ../backend
   php artisan serve
   ```

---

## 💡 Copilot Hints

When writing new code, **follow these patterns**:

- For new Laravel API: suggest full CRUD controller, migration, and model.
- For new React page: generate `tsx` file inside `src/views/` using CoreUI cards and tables.
- For API calls: always import `api` from `src/api/axios.ts`.
- For new layout: extend from existing CoreUI layout pattern.
- For authentication: use Sanctum login/logout endpoints.

---

## ✅ Example Tasks

| Task                                 | Expected Behavior                                            |
| ------------------------------------ | ------------------------------------------------------------ |
| “Buat route baru untuk `projects`”   | Generate Laravel model, migration, controller, API route     |
| “Tambah halaman `Projects` di React” | Create `src/views/projects/Projects.tsx` with table + CoreUI |
| “Koneksikan API Projects ke tabel”   | Use Axios to call `/api/projects` and render in CoreUI Table |

---

> 🧩 This file defines how Copilot, ChatGPT, or any AI pair programmer should understand, generate, and maintain code consistency across Laravel 12 (backend) and React (frontend) layers in this project.
