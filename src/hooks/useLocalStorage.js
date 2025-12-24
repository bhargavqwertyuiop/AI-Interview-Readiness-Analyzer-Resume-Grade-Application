import { useState, useEffect } from 'react'

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, function]} - [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
      // Dispatch a custom event so other hook instances in the same
      // tab can react to the change (native 'storage' only fires across tabs)
      try {
        window.dispatchEvent(new CustomEvent('local-storage', { detail: { key } }))
      } catch (e) {
        // ignore if dispatch fails for any reason
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Listen for changes to localStorage from other tabs/windows
  // and for our custom 'local-storage' event within the same tab.
  useEffect(() => {
    const handleStorageChange = (e) => {
      try {
        // For native storage events, e.key is set; for custom events we check detail
        if (e && e.key && e.key !== key) return
        if (e && e.detail && e.detail.key && e.detail.key !== key) return

        const item = window.localStorage.getItem(key)
        setStoredValue(item ? JSON.parse(item) : initialValue)
      } catch (err) {
        console.error(`Error syncing localStorage key "${key}":`, err)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('local-storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage', handleStorageChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [storedValue, setValue]
}

