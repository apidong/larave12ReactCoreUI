import { authService } from '../services/authService'

/**
 * Permission utility functions
 */

export const hasPermission = (resource: string, action: string): boolean => {
  return authService.hasPermission(resource, action)
}

export const canAccess = (resource: string): boolean => {
  return authService.canAccess(resource)
}

/**
 * Map route paths to resource names
 */
export const getResourceFromPath = (path: string): string | null => {
  const routes: Record<string, string> = {
    '/dashboard': 'dashboard',
    '/users': 'users',
    '/groups': 'groups',
    '/rules': 'rules',
  }

  // Handle dynamic routes like /groups/:id/rules
  if (path.startsWith('/groups/') && path.endsWith('/rules')) {
    return 'groups' // Requires groups permission to manage group rules
  }

  return routes[path] || null
}

/**
 * Check if user can access a specific route
 */
export const canAccessRoute = (path: string): boolean => {
  const resource = getResourceFromPath(path)

  if (!resource) {
    return true // Allow access to unknown routes (like home, login, etc.)
  }

  // Check if user has at least 'read' permission for the resource
  return hasPermission(resource, 'read') || hasPermission(resource, 'manage')
}

/**
 * Filter navigation items based on user permissions
 */
export const filterNavByPermissions = (navItems: any[]): any[] => {
  return navItems
    .map((item) => {
      // If item has children (CNavGroup)
      if (item.items && Array.isArray(item.items)) {
        const filteredItems = filterNavByPermissions(item.items)

        // If no children are accessible, hide the parent
        if (filteredItems.length === 0) {
          return null
        }

        return {
          ...item,
          items: filteredItems,
        }
      }

      // For single nav items
      if (item.to) {
        const canAccess = canAccessRoute(item.to)
        return canAccess ? item : null
      }

      // Default: show item
      return item
    })
    .filter(Boolean) // Remove null items
}
