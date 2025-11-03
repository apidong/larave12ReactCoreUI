# 🧪 Testing Checklist - Login Wajib

## ✅ Pre-Testing Setup

- [ ] Server Laravel running: `php artisan serve` → http://127.0.0.1:8000
- [ ] Server Vite running: `npm run dev` → http://localhost:5174
- [ ] Database memiliki test user: `admin@example.com` / `password`
- [ ] Browser DevTools terbuka (untuk cek localStorage & Redux)

---

## 🧪 Test Cases

### Test 1: Akses Pertama (Belum Login)

**Steps:**

1. Clear localStorage di browser
2. Akses `http://localhost:5174`

**Expected Result:**

- ✅ Auto redirect ke `/#/login`
- ✅ Tampil halaman login dengan form
- ✅ Tampil test credentials
- ✅ Redux state: `isAuthenticated = false`

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 2: Login dengan Credentials Valid

**Steps:**

1. Di halaman login, input:
   - Email: `admin@example.com`
   - Password: `password`
2. Klik tombol "Login"

**Expected Result:**

- ✅ Loading spinner muncul
- ✅ Request ke API berhasil (cek Network tab)
- ✅ Token disimpan ke localStorage
- ✅ User data disimpan ke localStorage
- ✅ Redux state updated: `isAuthenticated = true`, `user` filled, `token` filled
- ✅ Auto redirect ke `/#/dashboard`
- ✅ Dashboard tampil dengan sidebar & header
- ✅ Avatar di header menampilkan initial nama user

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 3: Login dengan Credentials Invalid

**Steps:**

1. Logout terlebih dahulu
2. Di halaman login, input:
   - Email: `wrong@example.com`
   - Password: `wrongpassword`
3. Klik tombol "Login"

**Expected Result:**

- ✅ Loading spinner muncul
- ✅ Request ke API error (401)
- ✅ Error alert muncul (red)
- ✅ Error message: "Invalid credentials" atau sejenisnya
- ✅ Form masih di halaman login
- ✅ localStorage tetap kosong
- ✅ Redux state: `isAuthenticated = false`

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 4: Akses Route Terlindungi Tanpa Login

**Steps:**

1. Logout atau clear localStorage
2. Langsung akses URL:
   - `http://localhost:5174/#/dashboard`
   - `http://localhost:5174/#/users`
   - `http://localhost:5174/#/any-route`

**Expected Result:**

- ✅ Semua URL auto redirect ke `/#/login`
- ✅ Tidak tampil halaman yang diminta
- ✅ Redux state: `isAuthenticated = false`

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 5: Akses /login Saat Sudah Login

**Steps:**

1. Login terlebih dahulu
2. Akses `http://localhost:5174/#/login`

**Expected Result:**

- ✅ Auto redirect ke `/#/dashboard`
- ✅ Tidak tampil form login
- ✅ Redux state: `isAuthenticated = true`

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 6: Refresh Page Saat Sudah Login

**Steps:**

1. Login terlebih dahulu
2. Akses halaman dashboard
3. Tekan F5 / Ctrl+R (refresh)

**Expected Result:**

- ✅ Page reload
- ✅ Tetap di halaman dashboard (tidak redirect ke login)
- ✅ Token tetap ada di localStorage
- ✅ User data tetap ada di localStorage
- ✅ Redux state reload dari localStorage: `isAuthenticated = true`
- ✅ Sidebar & header tetap tampil normal

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 7: Sidebar Toggle (State Management)

**Steps:**

1. Login terlebih dahulu
2. Di dashboard, klik icon hamburger menu (☰) di header

**Expected Result:**

- ✅ Sidebar toggle (show/hide)
- ✅ Redux state `sidebarShow` berubah
- ✅ CSS variable `--cui-sidebar-occupy-start` berubah
- ✅ Wrapper padding adjust

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 8: Logout Functionality

**Steps:**

1. Login terlebih dahulu
2. Klik avatar di header kanan atas
3. Klik menu "Logout"

**Expected Result:**

- ✅ Request logout ke API (POST /api/auth/logout)
- ✅ localStorage cleared (token & user dihapus)
- ✅ Redux state reset: `isAuthenticated = false`, `user = null`, `token = null`
- ✅ Auto redirect ke `/#/login`
- ✅ Tampil halaman login

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 9: Token Expired (401 Response)

**Steps:**

1. Login terlebih dahulu
2. Di DevTools → Application → Local Storage → Ganti token dengan string random
3. Lakukan action yang call API (misal: akses /users atau refresh dashboard)

**Expected Result:**

- ✅ API return 401 Unauthorized
- ✅ Axios interceptor catch error
- ✅ localStorage cleared
- ✅ Auto redirect ke `/#/login`
- ✅ Redux state reset

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 10: Multiple Tabs (Logout dari Tab 1)

**Steps:**

1. Login di Tab 1
2. Buka Tab 2 dengan URL yang sama
3. Logout dari Tab 1
4. Refresh Tab 2

**Expected Result:**

- ✅ Tab 1: Redirect ke login setelah logout
- ✅ Tab 2: Redirect ke login saat refresh (karena localStorage cleared)
- ✅ Tidak ada session yang tersisa

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 11: Direct URL Access (Sudah Login)

**Steps:**

1. Login terlebih dahulu
2. Copy URL dashboard: `http://localhost:5174/#/dashboard`
3. Buka browser baru (atau private/incognito window)
4. Paste URL

**Expected Result di Browser Baru:**

- ✅ Auto redirect ke `/#/login` (karena localStorage berbeda per browser)
- ✅ Tidak bisa akses dashboard tanpa login

**Expected Result di Browser Sama:**

- ✅ Langsung tampil dashboard (karena token ada di localStorage)

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 12: Network Offline (No API Connection)

**Steps:**

1. Logout terlebih dahulu
2. Di DevTools → Network → Set to "Offline"
3. Coba login

**Expected Result:**

- ✅ Loading spinner muncul
- ✅ Request failed (network error)
- ✅ Error alert muncul
- ✅ Error message: "Network error" atau "Failed to fetch"
- ✅ Tetap di halaman login

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 13: Redux DevTools Check

**Steps:**

1. Install Redux DevTools extension
2. Login terlebih dahulu
3. Buka Redux DevTools

**Expected Result:**

- ✅ Extension terdeteksi
- ✅ State tree tampil:
  ```
  {
    auth: {
      user: { id, name, email, ... },
      token: "eyJ0eXAi...",
      isAuthenticated: true
    },
    sidebar: {
      sidebarShow: true,
      sidebarUnfoldable: false
    }
  }
  ```
- ✅ Action history tampil (setCredentials, setSidebarShow, dll)

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 14: Form Validation (Empty Fields)

**Steps:**

1. Logout terlebih dahulu
2. Di halaman login, klik "Login" tanpa isi form

**Expected Result:**

- ✅ Browser native validation muncul
- ✅ Email field: "Please fill out this field"
- ✅ Tidak submit form
- ✅ Tetap di halaman login

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

### Test 15: Form Validation (Invalid Email Format)

**Steps:**

1. Logout terlebih dahulu
2. Input:
   - Email: `notanemail` (tanpa @)
   - Password: `password`
3. Klik "Login"

**Expected Result:**

- ✅ Browser native validation muncul
- ✅ Email field: "Please include an '@' in the email address"
- ✅ Tidak submit form
- ✅ Tetap di halaman login

**Actual Result:**

- [ ] PASS
- [ ] FAIL - Note: ************\_\_\_************

---

## 📊 Test Summary

**Total Tests:** 15

**Results:**

- ✅ Passed: **\_** / 15
- ❌ Failed: **\_** / 15
- ⏭️ Skipped: **\_** / 15

**Pass Rate:** **\_**%

---

## 🐛 Bugs Found

| Test # | Bug Description | Severity | Status |
| ------ | --------------- | -------- | ------ |
|        |                 |          |        |
|        |                 |          |        |
|        |                 |          |        |

---

## 📝 Notes

### Environment

- Laravel Version: 12.x
- React Version: 18.3.1
- Redux Toolkit: 2.9.2
- CoreUI React: 5.4.0
- Browser: ******\_\_\_******
- Date: ******\_\_\_******

### Additional Observations

-
-
-

---

## ✅ Final Approval

- [ ] All critical tests passed
- [ ] No blocking bugs
- [ ] Performance acceptable
- [ ] Security checks passed
- [ ] Ready for production

**Tested by:** ******\_\_\_******  
**Date:** ******\_\_\_******  
**Signature:** ******\_\_\_******
