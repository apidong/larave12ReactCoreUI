# 🚀 Laravel 12 + React (Vite + TypeScript + CoreUI)

Integrasi modern antara **Laravel 12** dan **React + TypeScript** menggunakan **Vite** — lengkap dengan **CoreUI Free React Admin Template** untuk tampilan dashboard yang profesional.

---

## 🧱 Fitur Utama

- ⚡ **Laravel 12 + Vite** — integrasi native React bawaan Laravel
- ⚛️ **React + TypeScript** — frontend modern dan strongly-typed
- 🎨 **CoreUI React Admin Template** — tampilan admin profesional
- 🔐 **Sanctum Ready** — siap untuk API authentication
- 🧩 **Single Repository** — backend dan frontend jadi satu

---

## 📦 Persiapan

Pastikan kamu sudah menginstal:

- PHP 8.2+
- Composer
- Node.js 18+ dan npm
- MySQL / MariaDB

---

## 🧰 Instalasi

```bash
# 1️⃣ Clone atau gunakan project ini
cd laravel12coreui

# 2️⃣ Install dependency Laravel
composer install

# 3️⃣ Setup environment
cp .env.example .env
php artisan key:generate

# 4️⃣ Konfigurasi database di .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=

# 5️⃣ Jalankan migrasi database
php artisan migrate

# 6️⃣ Instal dependency frontend
npm install

# 7️⃣ Jalankan server Laravel dan React
php artisan serve
# Di terminal lain:
npm run dev
```

Buka browser di `http://localhost:8000`

---

## 📁 Struktur Folder

```
laravel12coreui/
├── app/
├── bootstrap/
├── config/
├── public/
│   └── build/         # hasil build React (otomatis dari Vite)
├── resources/
│   ├── js/
│   │   ├── App.tsx                 # Root component React
│   │   ├── main.tsx                # Entry point React
│   │   ├── api/
│   │   │   └── axios.ts           # Axios configuration
│   │   ├── layouts/
│   │   │   └── DefaultLayout.tsx  # Layout utama dengan CoreUI
│   │   └── views/
│   │       ├── dashboard/
│   │       │   └── Dashboard.tsx  # Halaman dashboard
│   │       └── users/
│   │           └── Users.tsx      # Halaman users
│   ├── css/
│   │   └── app.css                # Global styles
│   └── views/
│       └── app.blade.php          # Template utama Laravel
├── routes/
│   ├── web.php                    # Route untuk SPA
│   └── api.php                    # API endpoints
├── vite.config.ts                 # Konfigurasi Vite
├── tsconfig.json                  # Konfigurasi TypeScript
└── package.json                   # Dependencies frontend
```

---

## ⚙️ Konfigurasi Vite (vite.config.ts)

Laravel sudah menambahkan konfigurasi Vite secara otomatis, namun pastikan plugin React aktif:

```ts
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/main.tsx', 'resources/css/app.css'],
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'resources/js'),
    },
  },
})
```

---

## 🧩 Integrasi CoreUI

Project ini sudah mengintegrasikan CoreUI dengan struktur:

1. **Layout** - `resources/js/layouts/DefaultLayout.tsx` berisi sidebar dan header CoreUI
2. **Views** - `resources/js/views/` berisi halaman-halaman aplikasi
3. **Components** - Dapat ditambahkan di `resources/js/components/`
4. **CSS** - Import CoreUI di `resources/js/main.tsx`:

   ```ts
   import '@coreui/coreui/dist/css/coreui.min.css'
   import '@coreui/icons/css/all.min.css'
   import '../css/app.css'
   ```

---

## 🧠 Route React (`resources/js/App.tsx`)

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import Dashboard from './views/dashboard/Dashboard'
import Users from './views/users/Users'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

---

## 🧩 Contoh Endpoint Laravel (`routes/api.php`)

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return response()->json([
        'name' => 'Admin User',
        'role' => 'Superuser'
    ]);
});

Route::get('/users', function (Request $request) {
    return response()->json([
        [
            'id' => 1,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'role' => 'Admin',
        ],
        // ... more users
    ]);
});
```

---

## 🔌 Axios Configuration

API service sudah dikonfigurasi di `resources/js/api/axios.ts`:

```ts
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

// Auto-inject CSRF token
api.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token
  }
  return config
})

export default api
```

---

## 🚀 Build untuk Production

```bash
# Build frontend
npm run build

# Optimize Laravel
php artisan optimize
php artisan config:cache
php artisan route:cache

# Jalankan server
php artisan serve
```

Output React akan otomatis dikompilasi ke `public/build` dan disajikan oleh Laravel langsung.

---

## 🧪 Testing

- Laravel: `php artisan test`
- React: `npm run test` (jika setup Vitest/Jest)

---

## 🧭 Tips Deployment

Untuk deployment di VPS / shared hosting:

1. Upload semua file Laravel ke server
2. Jalankan `composer install --optimize-autoloader --no-dev`
3. Jalankan `npm install && npm run build`
4. Pastikan `public/build/` ikut diupload
5. Set document root ke folder `public`
6. Setup `.env` dengan konfigurasi production
7. Jalankan migrasi: `php artisan migrate --force`
8. Optimize Laravel:
   ```bash
   php artisan optimize
   php artisan config:cache
   php artisan route:cache
   ```

---

## 📚 Dokumentasi Package

- [Laravel 12](https://laravel.com/docs/12.x)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [CoreUI React](https://coreui.io/react/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)

---

## 💡 Catatan

> Laravel 12 + React + Vite sudah sepenuhnya terintegrasi.
> Tidak perlu membuat dua server terpisah — semua dijalankan dalam satu instance Laravel.

### Menambah Halaman Baru

1. Buat component baru di `resources/js/views/namahalaman/NamaHalaman.tsx`
2. Tambahkan route di `resources/js/App.tsx`
3. Tambahkan menu di `resources/js/layouts/DefaultLayout.tsx`

### Menambah API Endpoint

1. Buat controller baru atau tambahkan route di `routes/api.php`
2. Panggil dari React menggunakan `api` instance dari `@/api/axios`

---

## 🧑‍💻 Kontributor

- **Project Setup & Integration** — Laravel 12 + React + TypeScript + CoreUI
- Template UI dari [CoreUI](https://github.com/coreui/coreui-free-react-admin-template)

---

## 🪪 Lisensi

Project ini menggunakan lisensi **MIT** dan mengadaptasi [CoreUI Free React Admin Template](https://coreui.io/react/).

---

## 🆘 Troubleshooting

### Error: Module not found

Pastikan sudah menjalankan `npm install` untuk install semua dependencies.

### Error: CSRF token mismatch

Pastikan meta tag CSRF ada di `resources/views/app.blade.php`:

```html
<meta name="csrf-token" content="{{ csrf_token() }}" />
```

### Vite tidak hot reload

Restart server Vite dengan `npm run dev` dan pastikan port tidak bentrok.

### TypeScript errors

Jalankan `npm install` untuk memastikan semua type definitions terinstall.

---

**Happy Coding! 🎉**
