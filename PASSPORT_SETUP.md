# Laravel Passport Authentication

## Setup Complete ✅

Laravel Passport telah berhasil diinstal dan dikonfigurasi dengan detail berikut:

### Database

- ✅ OAuth tables migrated
- ✅ Personal Access Client created
- ✅ Password Grant Client created
- ✅ Test users automatically created via migration (no manual seeding needed)

### Configuration

- ✅ User model updated dengan `HasApiTokens` trait
- ✅ Auth guard `api` menggunakan driver `passport`
- ✅ AuthController created untuk handle authentication
- ✅ API routes configured

---

## Test Users

Test users dibuat otomatis saat menjalankan migration `2025_10_30_161502_add_test_users_to_users_table.php`:

1. **Admin User**

   - Email: `admin@example.com`
   - Password: `password`

2. **Test User**
   - Email: `user@example.com`
   - Password: `password`

> **Note:** Jika Anda menjalankan `php artisan migrate:fresh`, test users akan otomatis dibuat kembali.
> Tidak perlu menjalankan seeder secara manual.

---

## API Endpoints

### 1. Register (Public)

```bash
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "Bearer"
}
```

### 2. Login (Public)

```bash
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "Bearer"
}
```

### 3. Get User (Protected)

```bash
GET http://localhost:8000/api/user
Authorization: Bearer {access_token}
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

### 4. Logout (Protected)

```bash
POST http://localhost:8000/api/auth/logout
Authorization: Bearer {access_token}
```

**Response:**

```json
{
  "message": "Successfully logged out"
}
```

---

## Testing dengan cURL

### 1. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"password\"}"
```

### 2. Get User dengan Token

```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## Testing dengan Postman

1. **Import Collection**

   - Create new collection "Laravel Passport"
   - Add environment variable `base_url` = `http://localhost:8000`
   - Add environment variable `token` untuk menyimpan access token

2. **Login Request**

   - Method: POST
   - URL: `{{base_url}}/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@example.com",
       "password": "password"
     }
     ```
   - Test Script (auto save token):
     ```javascript
     pm.test('Login successful', function () {
       var jsonData = pm.response.json()
       pm.environment.set('token', jsonData.access_token)
     })
     ```

3. **Protected Requests**
   - Add header: `Authorization: Bearer {{token}}`

---

## Frontend Integration (React)

### 1. Create Auth Service

Create `resources/js/services/authService.ts`:

```typescript
import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials)
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  async register(data: RegisterData) {
    const response = await axios.post(`${API_URL}/auth/register`, data)
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  async logout() {
    const token = localStorage.getItem('token')
    if (token) {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  async getUser() {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data.user
  },

  getToken() {
    return localStorage.getItem('token')
  },

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },
}
```

### 2. Setup Axios Interceptor

Update `resources/js/main.tsx`:

```typescript
import axios from 'axios'

// Setup axios defaults
axios.defaults.baseURL = 'http://localhost:8000/api'

// Add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle 401 responses
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

## OAuth Clients Info

**Password Grant Client:**

- Client ID: `019a35e1-a7be-72da-8447-911e1672e7a2`
- Client Secret: `A07KuVXDtnZD0EZMtjsyKoESfA7VGoCfxxLLir2i`

⚠️ **Important:** Simpan client secret dengan aman. Jangan commit ke repository!

---

## Security Best Practices

1. **Token Storage**

   - Store tokens di localStorage atau sessionStorage
   - Jangan simpan di cookies untuk menghindari CSRF attacks

2. **HTTPS**

   - Gunakan HTTPS di production
   - Jangan kirim credentials via HTTP

3. **Token Expiration**

   - Default token lifetime bisa diatur di `config/passport.php`
   - Implement refresh token mechanism untuk production

4. **CORS**

   - Configure CORS di `config/cors.php` untuk allow frontend domain
   - Update `allowed_origins` untuk production domain

5. **Environment Variables**
   - Simpan sensitive data di `.env`
   - Jangan commit `.env` ke repository

---

## Next Steps

1. ✅ Create Login page component
2. ✅ Create Register page component
3. ✅ Implement auth context/provider
4. ✅ Add protected route wrapper
5. ✅ Update navigation to show user info
6. ✅ Add logout functionality

---

## Troubleshooting

### Token tidak bekerja

```bash
# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Reinstall Passport keys
php artisan passport:install --force
```

### CORS errors

Update `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5174'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### Database errors

```bash
# Reset database (test users will be auto-created)
php artisan migrate:fresh
php artisan passport:install

# Or keep data and just run pending migrations
php artisan migrate
```

---

## Migration File for Test Users

File: `database/migrations/2025_10_30_161502_add_test_users_to_users_table.php`

Migration ini otomatis membuat 2 test users saat dijalankan:

- `admin@example.com` / `password`
- `user@example.com` / `password`

Migration akan check apakah user sudah ada sebelum insert, sehingga aman untuk dijalankan berkali-kali.

**Rollback:**

```bash
php artisan migrate:rollback
```

Akan menghapus test users yang dibuat oleh migration ini.
