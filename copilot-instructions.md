# 🤖 Copilot Instructions for Laravel 12 + React (Vite + TypeScript + CoreUI)

## 🏗️ Project Overview
This project is a **full-stack admin dashboard** built with:

- **Backend:** Laravel 12 (API only, JSON responses)
- **Frontend:** React + Vite + TypeScript using CoreUI Free React Admin Template
- **Communication:** Axios + REST API
- **Deployment:** Single app (React build output copied to Laravel `/public`)

**Directory structure:**
```
laravel-react-coreui/
├── backend/ (Laravel 12)
│   ├── routes/api.php
│   ├── app/
│   └── ...
└── frontend/ (React + Vite + TS)
    ├── src/
    │   ├── api/axios.ts
    │   ├── views/
    │   ├── components/
    │   ├── routes/
    │   ├── layouts/
    │   ├── context/
    │   ├── App.tsx
    │   └── main.tsx
    ├── vite.config.ts
    └── tsconfig.json
```

---

## ⚙️ Backend (Laravel 12) Rules
- Use **Laravel 12** with **API routes only** (`routes/api.php`).
- All routes must return JSON (`return response()->json([...])`).
- Authentication uses **Laravel Sanctum**.
- Controller naming convention: `UserController`, `AuthController`, `ProjectController`, etc.
- Resource naming follows REST conventions:
  - `GET /api/users` → list
  - `GET /api/users/{id}` → detail
  - `POST /api/users` → create
  - `PUT /api/users/{id}` → update
  - `DELETE /api/users/{id}` → delete
- Database migrations and seeders must be **idempotent** and safe to rerun.
- Use `php artisan install:api` for clean structure.
- Use **form request validation** and return structured JSON errors.
- Prefer `Route::apiResource()` for CRUD endpoints.

Example route (`routes/api.php`):
```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', fn() => response()->json(['name' => 'Admin', 'role' => 'Superuser']));
```

---

## ⚛️ Frontend (React + Vite + TypeScript) Rules
- Use **Functional Components** with React Hooks.
- Prefer `useEffect`, `useState`, and `useContext` over class components.
- Use **Axios** (`src/api/axios.ts`) for API calls.
- Use **CoreUI** components whenever possible for layout consistency.
- Use **TypeScript interfaces** for all data models.

Example model interface:
```ts
export interface User {
  id: number
  name: string
  email: string
  role: string
}
```

---

## 🧩 API Integration Rules
- All API endpoints are located under `http://localhost:8000/api`.
- Use the preconfigured Axios instance from `src/api/axios.ts`.
- Do not hardcode URLs; use environment variables where possible (`import.meta.env.VITE_API_URL`).
- Handle loading and error states gracefully in UI components.

Example:
```tsx
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  api.get<User[]>('/users')
    .then(res => setUsers(res.data))
    .catch(err => setError(err.message))
    .finally(() => setLoading(false))
}, [])
```

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
