import { hasPermission } from '../utils/permissions'

interface CanProps {
  perform: string // Format: "resource:action" atau "resource:action1|action2"
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Permission wrapper component
 *
 * Usage:
 * <Can perform="users:create">
 *   <button>Add User</button>
 * </Can>
 *
 * <Can perform="users:update|delete" fallback={<p>No access</p>}>
 *   <button>Edit or Delete</button>
 * </Can>
 */
const Can = ({ perform, children, fallback = null }: CanProps) => {
  // Parse permission string
  const [resource, actionsStr] = perform.split(':')

  if (!resource || !actionsStr) {
    console.warn(`Invalid permission format: ${perform}. Use "resource:action"`)
    return <>{fallback}</>
  }

  // Support multiple actions with | separator
  const actions = actionsStr.split('|')

  // Check if user has at least one of the required permissions
  const hasAccess = actions.some((action) => hasPermission(resource.trim(), action.trim()))

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

export default Can
