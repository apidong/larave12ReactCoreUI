# Development Guide

## Project Structure

```
laravel12coreui/
├── app/                    # Laravel application logic
│   ├── Http/
│   │   ├── Controllers/   # API Controllers
│   │   └── Middleware/    # Custom middleware
│   └── Models/            # Eloquent models
├── resources/
│   ├── js/                # React application
│   │   ├── api/          # API services
│   │   ├── components/   # Reusable React components
│   │   ├── layouts/      # Layout components
│   │   ├── views/        # Page components
│   │   ├── types/        # TypeScript type definitions
│   │   ├── config/       # Frontend configuration
│   │   ├── App.tsx       # Root React component
│   │   └── main.tsx      # React entry point
│   ├── css/              # Global styles
│   └── views/            # Blade templates
├── routes/
│   ├── web.php           # Web routes (SPA fallback)
│   ├── api.php           # API routes
│   └── console.php       # Artisan commands
└── public/               # Public assets
```

## Adding New Features

### 1. Creating a New Page

**Step 1: Create the React Component**

```tsx
// resources/js/views/products/Products.tsx
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

function Products() {
  return (
    <CCard>
      <CCardHeader>Products</CCardHeader>
      <CCardBody>
        <p>Product list goes here</p>
      </CCardBody>
    </CCard>
  )
}

export default Products
```

**Step 2: Add Route in React**

```tsx
// resources/js/App.tsx
import Products from './views/products/Products'

// Add to Routes:
;<Route path="products" element={<Products />} />
```

**Step 3: Add Menu Item**

```tsx
// resources/js/layouts/DefaultLayout.tsx
<CNavItem href="#/products">
  <CIcon customClassName="nav-icon" icon={cilCart} />
  Products
</CNavItem>
```

### 2. Creating an API Endpoint

**Step 1: Create a Controller**

```bash
php artisan make:controller ProductController
```

**Step 2: Define the Route**

```php
// routes/api.php
use App\Http\Controllers\ProductController;

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
```

**Step 3: Implement the Controller**

```php
// app/Http/Controllers/ProductController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Product::all()
        ]);
    }
}
```

### 3. Calling API from React

**Step 1: Create API Service**

```ts
// resources/js/api/productService.ts
import api from './axios'

export const getProducts = async () => {
  const response = await api.get('/products')
  return response.data
}

export const createProduct = async (data: any) => {
  const response = await api.post('/products', data)
  return response.data
}
```

**Step 2: Use in Component**

```tsx
// resources/js/views/products/Products.tsx
import { useEffect, useState } from 'react'
import { getProducts } from '@/api/productService'

function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getProducts().then(data => setProducts(data))
  }, [])

  return (
    // Component JSX
  )
}
```

## TypeScript Best Practices

### Define Types

```ts
// resources/js/types/product.ts
export interface Product {
  id: number
  name: string
  price: number
  description: string
}
```

### Use Types in Components

```tsx
import { Product } from '@/types/product'

function ProductCard({ product }: { product: Product }) {
  return <div>{product.name}</div>
}
```

## Styling with CoreUI

### Using CoreUI Components

```tsx
import { CButton, CCard, CCardBody } from '@coreui/react'

function MyComponent() {
  return (
    <CCard>
      <CCardBody>
        <CButton color="primary">Click Me</CButton>
      </CCardBody>
    </CCard>
  )
}
```

### Custom CSS

Add custom styles in `resources/css/app.css` or create component-specific CSS modules.

## Testing

### Laravel Tests

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=ProductTest
```

### React Tests

```bash
# Run frontend tests (if configured)
npm run test
```

## Debugging

### Laravel Debugging

- Use `dd()` or `dump()` for debugging
- Check `storage/logs/laravel.log` for errors
- Install Laravel Debugbar: `composer require barryvdh/laravel-debugbar --dev`

### React Debugging

- Use browser DevTools React extension
- Use `console.log()` for debugging
- Check Network tab for API calls

## Code Quality

### PHP Code Standards

```bash
# Format code with Laravel Pint
./vendor/bin/pint
```

### TypeScript Linting

```bash
# Add ESLint (optional)
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## Git Workflow

1. Create a feature branch

   ```bash
   git checkout -b feature/new-feature
   ```

2. Make changes and commit

   ```bash
   git add .
   git commit -m "Add new feature"
   ```

3. Push to remote

   ```bash
   git push origin feature/new-feature
   ```

4. Create a Pull Request

## Environment Variables

Frontend environment variables must be prefixed with `VITE_`:

```env
VITE_APP_NAME="My App"
VITE_API_URL="https://api.example.com"
```

Access in React:

```ts
const appName = import.meta.env.VITE_APP_NAME
```

## Performance Optimization

### Laravel

- Enable opcache in production
- Use Redis for caching and sessions
- Optimize autoloader: `composer install --optimize-autoloader --no-dev`

### React

- Use lazy loading for routes
- Optimize images
- Use production build: `npm run build`

## Security Best Practices

1. Never commit `.env` file
2. Use CSRF protection for forms
3. Validate all user inputs
4. Use prepared statements for database queries
5. Keep dependencies up to date
6. Use HTTPS in production
7. Implement rate limiting for APIs

## Useful Commands

```bash
# Laravel
php artisan migrate:fresh --seed    # Reset database with seeders
php artisan route:list               # List all routes
php artisan tinker                   # Interactive shell

# Node/NPM
npm run build                        # Build for production
npm run dev                          # Development mode with HMR
npm list                             # List installed packages

# Composer
composer dump-autoload               # Regenerate autoload files
composer update                      # Update dependencies
```
