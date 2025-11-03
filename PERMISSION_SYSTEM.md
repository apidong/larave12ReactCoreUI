# Permission System Documentation

## Overview

Sistem permission berbasis **Group-Based Access Control (GBAC)** di mana:

- User memiliki **Group**
- Group memiliki banyak **Rules** (permissions)
- Rules menentukan akses ke **resource** dengan **action** tertentu

## Database Structure

### Rules Table

```
id | name              | resource  | action | description
---|-------------------|-----------|--------|-------------
1  | Read Dashboard    | dashboard | read   | Can view dashboard
2  | Create Users      | users     | create | Can create users
3  | Read Users        | users     | read   | Can view users
4  | Update Users      | users     | update | Can edit users
5  | Delete Users      | users     | delete | Can delete users
6  | Manage Users      | users     | manage | Full access to users
```

### Groups Table

```
id | name         | description           | is_active
---|--------------|----------------------|----------
1  | Super Admin  | Full system access   | true
2  | Admin        | Limited admin access | true
3  | Manager      | User management only | true
4  | User         | Basic user access    | true
```

### Group-Rule (Pivot Table)

```
group_id | rule_id
---------|--------
1        | 1,2,3,4,5,6,7,8,9,10,11,12,13  (all rules)
2        | 1,2,3,4,6,7,10                   (some rules)
3        | 1,2,3,4                          (limited rules)
4        | 1                                (dashboard only)
```

## Actions

- `read` - View/list resources
- `create` - Create new resources
- `update` - Edit existing resources
- `delete` - Delete resources
- `manage` - Full access (grants all actions)

## Frontend Implementation

### 1. Login Flow

```typescript
// AuthController.php (Backend)
public function login(Request $request) {
    $user = User::with(['group.rules'])->where('email', $email)->first();

    // Get permissions from group rules
    $permissions = $user->group->rules->map(function ($rule) {
        return [
            'resource' => $rule->resource,
            'action' => $rule->action,
            'name' => $rule->name,
        ];
    });

    return [
        'user' => $user,
        'permissions' => $permissions,
        'access_token' => $token,
    ];
}
```

```typescript
// authService.ts (Frontend)
async login(credentials: LoginCredentials) {
    const response = await axios.post('/auth/login', credentials)

    // Save to localStorage
    localStorage.setItem('token', response.data.access_token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    localStorage.setItem('permissions', JSON.stringify(response.data.permissions))

    return response.data
}
```

### 2. Permission Checking Functions

```typescript
// utils/permissions.ts

// Check specific permission
hasPermission(resource: string, action: string): boolean {
    const permissions = getPermissions()
    return permissions.some(p =>
        p.resource === resource &&
        (p.action === action || p.action === 'manage')
    )
}

// Check any access to resource
canAccess(resource: string): boolean {
    const permissions = getPermissions()
    return permissions.some(p => p.resource === resource)
}

// Check route access (requires at least 'read' permission)
canAccessRoute(path: string): boolean {
    const resource = getResourceFromPath(path)
    return hasPermission(resource, 'read') || hasPermission(resource, 'manage')
}
```

### 3. Navigation Filtering

```typescript
// AppSidebar.tsx
const filteredNavigation = useMemo(() => {
    return filterNavByPermissions(navigation)
}, [])

// utils/permissions.ts
filterNavByPermissions(navItems: any[]): any[] {
    return navItems
        .map(item => {
            // Filter children (CNavGroup)
            if (item.items) {
                const filteredItems = filterNavByPermissions(item.items)
                return filteredItems.length > 0 ? { ...item, items: filteredItems } : null
            }

            // Check route permission
            if (item.to) {
                return canAccessRoute(item.to) ? item : null
            }

            return item
        })
        .filter(Boolean)
}
```

### 4. Route Protection

```typescript
// AppContent.tsx
{
  routes.map((route, idx) => {
    const hasAccess = canAccessRoute(route.path)

    return (
      <Route
        key={idx}
        path={route.path}
        element={hasAccess ? <route.element /> : <AccessDeniedAlert />}
      />
    )
  })
}
```

## Usage Examples

### Check if user can create users

```typescript
import { hasPermission } from '../utils/permissions'

if (hasPermission('users', 'create')) {
  // Show "Add User" button
}
```

### Check if user can access dashboard

```typescript
import { canAccessRoute } from '../utils/permissions'

if (canAccessRoute('/dashboard')) {
  // Allow navigation
}
```

### Hide UI elements based on permission

```tsx
{
  hasPermission('users', 'delete') && (
    <CButton color="danger" onClick={handleDelete}>
      Delete
    </CButton>
  )
}
```

## Testing

### Test Users (from GroupsAndRulesSeeder)

**Super Admin** (admin@example.com / password)

- Group: Super Admin
- Permissions: All (13 rules)
- Can access: All features

**Regular User** (user@example.com / password)

- Group: User
- Permissions: Dashboard Read only
- Can access: Dashboard only

### Manual Testing

1. Login as `user@example.com`
2. Check sidebar - should only show Dashboard
3. Try accessing `/users` - should show Access Denied
4. Login as `admin@example.com`
5. Check sidebar - should show all menus
6. Can access all routes

## Security Notes

1. **Backend validation is REQUIRED** - Frontend checks are for UX only
2. All API endpoints must use middleware to verify permissions
3. Never trust frontend permission checks alone
4. Always validate on server side before executing actions

## Future Enhancements

1. Add middleware to check permissions on API routes
2. Implement real-time permission updates
3. Add permission caching
4. Create permission management UI
5. Add audit logging for permission changes
