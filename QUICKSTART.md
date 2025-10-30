# Quick Start Guide

## 🚀 Cara Cepat Memulai

### 1. Install Dependencies

```bash
# Install Laravel dependencies
composer install

# Install Node.js dependencies
npm install
```

### 2. Setup Environment

```bash
# Copy .env file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Configure Database

Edit file `.env`:

```env
DB_DATABASE=laravel12coreui
DB_USERNAME=root
DB_PASSWORD=
```

Buat database baru:

```sql
CREATE DATABASE laravel12coreui;
```

### 4. Run Migrations

```bash
php artisan migrate
```

### 5. Start Development Servers

**Terminal 1 - Backend:**

```bash
php artisan serve
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

### 6. Open Browser

Kunjungi: **http://localhost:8000**

---

## 📝 Cara Menambah Halaman Baru

### 1. Buat Component React

```tsx
// resources/js/views/about/About.tsx
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

function About() {
  return (
    <>
      <h1>About</h1>
      <CCard>
        <CCardHeader>About Us</CCardHeader>
        <CCardBody>
          <p>This is the about page.</p>
        </CCardBody>
      </CCard>
    </>
  )
}

export default About
```

### 2. Tambahkan Route

```tsx
// resources/js/App.tsx
import About from './views/about/About'

// Dalam <Routes>:
;<Route path="about" element={<About />} />
```

### 3. Tambahkan Menu

```tsx
// resources/js/layouts/DefaultLayout.tsx
import { cilInfo } from '@coreui/icons'

// Dalam CSidebarNav:
;<CNavItem href="#/about">
  <CIcon customClassName="nav-icon" icon={cilInfo} />
  About
</CNavItem>
```

---

## 🔌 Cara Menambah API Endpoint

### 1. Buat Controller

```bash
php artisan make:controller Api/PostController
```

### 2. Definisikan Route API

```php
// routes/api.php
use App\Http\Controllers\Api\PostController;

Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);
```

### 3. Implement Controller

```php
// app/Http/Controllers/Api/PostController.php
public function index()
{
    return response()->json([
        'data' => Post::all()
    ]);
}

public function store(Request $request)
{
    $post = Post::create($request->all());
    return response()->json(['data' => $post], 201);
}
```

### 4. Panggil dari React

```tsx
// resources/js/views/posts/Posts.tsx
import { useEffect, useState } from 'react'
import api from '@/api/axios'

function Posts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    api.get('/posts').then((res) => setPosts(res.data.data))
  }, [])

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

---

## 🎨 Menggunakan CoreUI Components

```tsx
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
} from '@coreui/react'

function MyForm() {
  return (
    <CCard>
      <CCardHeader>Form Example</CCardHeader>
      <CCardBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel>Email address</CFormLabel>
            <CFormInput type="email" placeholder="name@example.com" />
          </div>
          <CButton type="submit" color="primary">
            Submit
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}
```

---

## 📦 Build untuk Production

```bash
# Build frontend
npm run build

# Optimize Laravel
php artisan optimize
php artisan config:cache
php artisan route:cache
```

Upload ke server dan pastikan document root mengarah ke folder `public`.

---

## 🐛 Troubleshooting

### Error: npm install gagal

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Error: Vite tidak jalan

```bash
# Pastikan tidak ada proses Vite yang jalan
# Restart:
npm run dev
```

### Error: Database connection

- Pastikan MySQL/MariaDB sudah jalan
- Cek kredensial di file `.env`
- Pastikan database sudah dibuat

### Error: CSRF Token Mismatch

Pastikan ada meta tag di `resources/views/app.blade.php`:

```html
<meta name="csrf-token" content="{{ csrf_token() }}" />
```

---

## 📚 Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [CoreUI React Components](https://coreui.io/react/docs/components/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Selamat Coding! 🎉**
