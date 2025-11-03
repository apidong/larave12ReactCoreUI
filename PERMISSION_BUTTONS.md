# Permission Mapping Reference

## Button/Action Permission Requirements

### Users Page (`/users`)

| Button/Action             | Required Permission | Notes                            |
| ------------------------- | ------------------- | -------------------------------- |
| **Add User** button       | `users:create`      | Header button to create new user |
| **Edit** button (pencil)  | `users:update`      | Edit user details                |
| **Toggle Status** button  | `users:update`      | Activate/Deactivate user         |
| **Reset Password** button | `users:update`      | Reset user password              |
| **Delete** button (trash) | `users:delete`      | Delete user                      |

**Access Requirements:**

- Page access: `users:read`
- View user list: `users:read`

---

### Groups Page (`/groups`)

| Button/Action                    | Required Permission | Notes                             |
| -------------------------------- | ------------------- | --------------------------------- |
| **Add Group** button             | `groups:create`     | Header button to create new group |
| **Assign Rules** button (shield) | `groups:update`     | Navigate to assign rules page     |
| **Edit** button (pencil)         | `groups:update`     | Edit group details                |
| **Toggle Status** button         | `groups:update`     | Activate/Deactivate group         |
| **Delete** button (trash)        | `groups:delete`     | Delete group                      |

**Access Requirements:**

- Page access: `groups:read`
- View group list: `groups:read`

---

### Group Rules Page (`/groups/:id/rules`)

| Button/Action               | Required Permission | Notes                                  |
| --------------------------- | ------------------- | -------------------------------------- |
| **Page Access**             | `groups:update`     | Entire page requires update permission |
| **Select Rules** checkboxes | `groups:update`     | Select/deselect rules                  |
| **Save Rules** button       | `groups:update`     | Save rule assignments                  |

**Access Requirements:**

- Page access: `groups:update`
- Must have update permission to view and use this page

---

### Rules Page (`/rules`)

| Button/Action               | Required Permission | Notes                          |
| --------------------------- | ------------------- | ------------------------------ |
| **Edit Description** button | `rules:update`      | Only description can be edited |

**Access Requirements:**

- Page access: `rules:read`
- View rules list: `rules:read`
- Edit description: `rules:update`

**Note:** Rules cannot be created or deleted through GUI (by design)

---

## Permission Actions

### Available Actions

| Action   | Description               | Usage                       |
| -------- | ------------------------- | --------------------------- |
| `create` | Create new resources      | Add User, Add Group buttons |
| `read`   | View/list resources       | Page access, view tables    |
| `update` | Edit existing resources   | Edit, Toggle, Assign Rules  |
| `delete` | Delete resources          | Delete buttons              |
| `manage` | Full access (all actions) | Admin/Super Admin level     |

---

## Permission Examples by Group

### Super Admin

```javascript
permissions: [
  { resource: 'dashboard', action: 'read' },
  { resource: 'users', action: 'manage' }, // All user actions
  { resource: 'groups', action: 'manage' }, // All group actions
  { resource: 'rules', action: 'manage' }, // All rule actions
]
```

**Can do:**

- ✅ Everything (create, read, update, delete all resources)

---

### Admin

```javascript
permissions: [
  { resource: 'dashboard', action: 'read' },
  { resource: 'users', action: 'create' },
  { resource: 'users', action: 'read' },
  { resource: 'users', action: 'update' },
  { resource: 'groups', action: 'read' },
  { resource: 'rules', action: 'read' },
]
```

**Can do:**

- ✅ View dashboard
- ✅ Create, view, edit users (but cannot delete)
- ✅ View groups and rules
- ❌ Cannot edit/delete groups
- ❌ Cannot edit/delete rules

---

### Manager

```javascript
permissions: [
  { resource: 'dashboard', action: 'read' },
  { resource: 'users', action: 'read' },
  { resource: 'users', action: 'update' },
]
```

**Can do:**

- ✅ View dashboard
- ✅ View and edit users
- ❌ Cannot create/delete users
- ❌ Cannot access groups/rules

---

### User

```javascript
permissions: [{ resource: 'dashboard', action: 'read' }]
```

**Can do:**

- ✅ View dashboard only
- ❌ Cannot access any management features

---

## UI Behavior

### When Permission is Missing

**Button Hidden:**

```tsx
{
  hasPermission('users', 'create') && (
    <CButton color="primary" onClick={handleCreate}>
      Add User
    </CButton>
  )
}
```

**Result:** If user doesn't have `users:create` permission, the "Add User" button will not be displayed at all.

---

### When Page Access is Denied

**Route Protection:**

```tsx
// AppContent.tsx
const hasAccess = canAccessRoute(route.path)

return hasAccess ? (
  <route.element />
) : (
  <CAlert color="danger">Access Denied - You don't have permission to access this page.</CAlert>
)
```

**Result:** User sees access denied message instead of page content.

---

### When Navigation Item Should Hide

**Sidebar Filter:**

```tsx
// AppSidebar.tsx
const filteredNavigation = useMemo(() => {
  return filterNavByPermissions(navigation)
}, [])
```

**Result:** Menu items for pages without read permission are hidden from sidebar.

---

## Testing Permission Checks

### Test Scenarios

#### Scenario 1: User with Limited Permissions

**Login as:** `user@example.com` (Group: User)

**Expected Behavior:**

- ✅ Dashboard visible in sidebar
- ✅ Can view dashboard
- ❌ Management menu not visible
- ❌ Cannot access `/users`, `/groups`, `/rules`
- ❌ Direct URL access shows "Access Denied"

---

#### Scenario 2: Manager with User Management Only

**Create user with permissions:**

```javascript
permissions: [
  { resource: 'dashboard', action: 'read' },
  { resource: 'users', action: 'read' },
  { resource: 'users', action: 'update' },
]
```

**Expected Behavior:**

- ✅ Can access `/users` page
- ✅ Can see user list
- ✅ Can see Edit, Toggle, Reset Password buttons
- ❌ "Add User" button hidden
- ❌ Delete button hidden
- ❌ Cannot access `/groups` or `/rules`

---

#### Scenario 3: Admin with Full User Access but Read-Only Groups

**Permissions:**

```javascript
permissions: [
  { resource: 'users', action: 'manage' },
  { resource: 'groups', action: 'read' },
]
```

**Expected Behavior:**

- ✅ All user buttons visible (Add, Edit, Delete, etc.)
- ✅ Can access `/groups` page
- ✅ Can see groups list
- ❌ "Add Group" button hidden
- ❌ Edit, Assign Rules, Toggle, Delete buttons hidden
- ❌ Cannot access `/groups/:id/rules`

---

## Backend Validation (TODO)

**Important:** Frontend permission checks are for UX only. Backend MUST validate permissions.

### Recommended Laravel Middleware

```php
// app/Http/Middleware/CheckPermission.php
public function handle($request, Closure $next, $resource, $action)
{
    $user = $request->user();

    if (!$user->hasPermission($resource, $action)) {
        return response()->json([
            'message' => 'Unauthorized'
        ], 403);
    }

    return $next($request);
}
```

### Usage in Routes

```php
// routes/api.php
Route::middleware(['auth:api', 'permission:users,create'])
    ->post('/users', [UserController::class, 'store']);

Route::middleware(['auth:api', 'permission:users,update'])
    ->put('/users/{user}', [UserController::class, 'update']);

Route::middleware(['auth:api', 'permission:users,delete'])
    ->delete('/users/{user}', [UserController::class, 'destroy']);
```

---

## Summary

### Security Layers

1. **Sidebar Navigation Filter** - Hide menu items
2. **Route Protection** - Show access denied on page access
3. **Button Visibility** - Hide action buttons based on permissions
4. **Backend Validation** - (TODO) Validate all API requests

### Best Practices

✅ **Do:**

- Use `hasPermission(resource, action)` for specific action checks
- Use `canAccessRoute(path)` for page-level checks
- Hide buttons when user lacks permission
- Show clear error messages for access denied
- Validate permissions on backend (CRITICAL)

❌ **Don't:**

- Rely only on frontend checks (security risk)
- Show disabled buttons (confusing for users)
- Assume frontend checks are secure
- Forget to check permissions on backend API

---

## Quick Reference

```typescript
// Check specific permission
hasPermission('users', 'create') // Can create users?
hasPermission('users', 'update') // Can edit users?
hasPermission('users', 'delete') // Can delete users?

// Check page access (requires at least 'read')
canAccessRoute('/users') // Can access users page?
canAccessRoute('/groups') // Can access groups page?

// Check any access to resource
canAccess('users') // Has any permission for users?
```
