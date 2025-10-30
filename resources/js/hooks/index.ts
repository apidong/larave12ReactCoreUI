import { useState, useEffect } from 'react'

interface UseAsyncOptions<T> {
  immediate?: boolean
  initialData?: T
}

interface UseAsyncReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  execute: (...args: any[]) => Promise<void>
  reset: () => void
}

/**
 * Hook for handling async operations
 */
export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> {
  const { immediate = false, initialData = null } = options
  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<Error | null>(null)

  const execute = async (...args: any[]) => {
    setLoading(true)
    setError(null)

    try {
      const response = await asyncFunction(...args)
      setData(response)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(initialData)
    setLoading(false)
    setError(null)
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, execute, reset }
}

/**
 * Hook for form state management
 */
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const setFieldError = (name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldError,
    setValues,
    setErrors,
    reset,
  }
}

/**
 * Hook for localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}

/**
 * Hook for debouncing values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for media queries
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}
