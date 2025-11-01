# 🤖 Copilot Instructions for Laravel 12 + React + CoreUI + Passport

## 🏗️ Project Overview
This is a **full-stack admin dashboard** with Laravel backend API and React frontend:

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 18 + TypeScript 5 + Vite 5
- **UI Framework:** CoreUI React 5.4 (Free Admin Template)
- **Authentication:** Laravel Passport (OAuth2 + JWT)
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
│   │   ├── contexts/ (SidebarContext)
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
├── contexts/
│   └── SidebarContext.tsx (NOT Redux)
├── layouts/
│   └── DefaultLayout.tsx
├── services/
│   └── authService.ts (Passport auth)
├── views/
│   ├── dashboard/
│   └── pages/
├── App.tsx (HashRouter + SidebarProvider)
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
  }
}
```

---

## 🎨 Styling (SCSS + CoreUI)

### SCSS Structure
**Main file:** `resources/scss/style.scss`

```scss
// Use @use syntax (NOT @import)
@use "@coreui/coreui/scss/coreui" as * with (
  $enable-deprecation-messages: false,
);

@import 'simplebar-react/dist/simplebar.min.css';

// Custom styles
.wrapper {
  width: 100%;
  padding-inline: var(--cui-sidebar-occupy-start, 0) var(--cui-sidebar-occupy-end, 0);
  will-change: auto;
  @include transition(padding .15s);
}
```

### Import in App.tsx
```typescript
import '../scss/style.scss'  // NOT CSS!
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
- Axios for HTTP requests
- simplebar-react for scrolling

---

## 🗂️ State Management

**Use React Context API** (NOT Redux):
```typescript
// contexts/SidebarContext.tsx
import { createContext, useContext, useState } from 'react'

interface SidebarContextType {
  sidebarShow: boolean
  setSidebarShow: (show: boolean) => void
  sidebarUnfoldable: boolean
  setSidebarUnfoldable: (unfoldable: boolean) => void
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider = ({ children }) => {
  const [sidebarShow, setSidebarShow] = useState(true)
  const [sidebarUnfoldable, setSidebarUnfoldable] = useState(false)

  return (
    <SidebarContext.Provider value={{ 
      sidebarShow, setSidebarShow, 
      sidebarUnfoldable, setSidebarUnfoldable 
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) throw new Error('useSidebar must be used within SidebarProvider')
  return context
}
```

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
    axios.get<Item[]>('/items')
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <CCard>
      <CCardHeader>Items</CCardHeader>
      <CCardBody>
        {loading ? 'Loading...' : items.map(item => <div key={item.id}>{item.name}</div>)}
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
| Task | Expected Behavior |
|------|--------------------|
| “Buat route baru untuk `projects`” | Generate Laravel model, migration, controller, API route |
| “Tambah halaman `Projects` di React” | Create `src/views/projects/Projects.tsx` with table + CoreUI |
| “Koneksikan API Projects ke tabel” | Use Axios to call `/api/projects` and render in CoreUI Table |

---

> 🧩 This file defines how Copilot, ChatGPT, or any AI pair programmer should understand, generate, and maintain code consistency across Laravel 12 (backend) and React (frontend) layers in this project.
