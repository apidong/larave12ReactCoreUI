/**
 * Format validation errors from Laravel API response
 */
export const formatValidationErrors = (
  errors: Record<string, string[]>
): Record<string, string> => {
  const formatted: Record<string, string> = {}

  Object.keys(errors).forEach((key) => {
    formatted[key] = errors[key][0] // Get first error message
  })

  return formatted
}

/**
 * Handle API error and return user-friendly message
 */
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response

    if (status === 422 && data.errors) {
      // Validation errors
      const errors = Object.values(data.errors).flat()
      return errors[0] as string
    }

    if (data.message) {
      return data.message
    }

    switch (status) {
      case 401:
        return 'Unauthorized. Please login again.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return `An error occurred (${status})`
    }
  }

  if (error.request) {
    // Request was made but no response received
    return 'No response from server. Please check your connection.'
  }

  // Something else happened
  return error.message || 'An unexpected error occurred.'
}

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401
}

/**
 * Sleep/delay function
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
