import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

/**
 * Enhanced Authentication Hook
 * Manages user authentication state with session persistence
 */
export function useAuth() {
  const [user, setUser] = useLocalStorage('auth_user', null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is logged in on mount
    if (user) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [user])

  /**
   * Login with email and password
   * Validates credentials and creates session
   */
  const login = useCallback((email, password) => {
    return new Promise((resolve, reject) => {
      try {
        console.debug('[useAuth] login called', { email })
        setError(null)

        // Validate inputs
        if (!email || !password) {
          throw new Error('Email and password are required')
        }

        if (!email.includes('@')) {
          throw new Error('Invalid email format')
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters')
        }

        // Check if user exists in local registry
        const users = JSON.parse(localStorage.getItem('auth_users') || '{}')
        console.debug('[useAuth] auth_users snapshot', users)
        const existingUser = Object.values(users).find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        )

        if (!existingUser) {
          console.debug('[useAuth] no matching user found for email', email)
          throw new Error('Invalid email or password')
        }

        // Verify password (in production, this would be server-side)
        if (existingUser.passwordHash !== btoa(password)) {
          console.debug('[useAuth] password mismatch', {
            provided: btoa(password),
            stored: existingUser.passwordHash,
          })
          throw new Error('Invalid email or password')
        }

        // Create session
        const sessionUser = {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          plan: existingUser.plan || 'free',
          lastLogin: new Date().toISOString(),
        }

        console.debug('[useAuth] creating session user', sessionUser)
        setUser(sessionUser)
        setIsAuthenticated(true)
        resolve(sessionUser)
      } catch (err) {
        setError(err.message)
        reject(err)
      }
    })
  }, [setUser])

  /**
   * Signup with email, password, and name
   * Creates new user account
   */
  const signup = useCallback((email, password, name) => {
    return new Promise((resolve, reject) => {
      try {
        console.debug('[useAuth] signup called', { email, name })
        setError(null)

        // Validate inputs
        if (!email || !password || !name) {
          throw new Error('All fields are required')
        }

        if (!email.includes('@')) {
          throw new Error('Invalid email format')
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters')
        }

        if (name.trim().length < 2) {
          throw new Error('Name must be at least 2 characters')
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('auth_users') || '{}')
        console.debug('[useAuth] auth_users before signup', users)
        const existingUser = Object.values(users).find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        )

        if (existingUser) {
          throw new Error('Email already registered')
        }

        // Create new user
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newUser = {
          id: userId,
          email: email.toLowerCase(),
          name: name.trim(),
          passwordHash: btoa(password), // Simple encoding for demo
          plan: 'free',
          createdAt: new Date().toISOString(),
        }

        // Save to registry
        users[userId] = newUser
        localStorage.setItem('auth_users', JSON.stringify(users))
        console.debug('[useAuth] auth_users after signup', users)

        // Create session
        const sessionUser = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          plan: newUser.plan,
          createdAt: newUser.createdAt,
        }

        console.debug('[useAuth] creating session for new user', sessionUser)
        setUser(sessionUser)
        setIsAuthenticated(true)
        resolve(sessionUser)
      } catch (err) {
        setError(err.message)
        reject(err)
      }
    })
  }, [setUser])

  /**
   * Logout and clear session
   */
  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }, [setUser])

  /**
   * Upgrade user to Pro plan
   */
  const upgradeToPro = useCallback(() => {
    if (!user) return Promise.reject(new Error('No user logged in'))

    try {
      const updatedUser = { ...user, plan: 'pro' }

      // Update user registry
      const users = JSON.parse(localStorage.getItem('auth_users') || '{}')
      if (users[user.id]) {
        users[user.id].plan = 'pro'
        localStorage.setItem('auth_users', JSON.stringify(users))
      }

      setUser(updatedUser)
      return Promise.resolve(updatedUser)
    } catch (err) {
      return Promise.reject(err)
    }
  }, [user, setUser])

  /**
   * Downgrade user to Free plan
   */
  const downgradeToFree = useCallback(() => {
    if (!user) return Promise.reject(new Error('No user logged in'))

    try {
      const updatedUser = { ...user, plan: 'free' }

      // Update user registry
      const users = JSON.parse(localStorage.getItem('auth_users') || '{}')
      if (users[user.id]) {
        users[user.id].plan = 'free'
        localStorage.setItem('auth_users', JSON.stringify(users))
      }

      setUser(updatedUser)
      return Promise.resolve(updatedUser)
    } catch (err) {
      return Promise.reject(err)
    }
  }, [user, setUser])

  /**
   * Update user profile
   */
  const updateProfile = useCallback((updates) => {
    if (!user) return Promise.reject(new Error('No user logged in'))

    try {
      const updatedUser = { ...user, ...updates }

      // Update user registry
      const users = JSON.parse(localStorage.getItem('auth_users') || '{}')
      if (users[user.id]) {
        users[user.id] = { ...users[user.id], ...updates }
        localStorage.setItem('auth_users', JSON.stringify(users))
      }

      setUser(updatedUser)
      return Promise.resolve(updatedUser)
    } catch (err) {
      return Promise.reject(err)
    }
  }, [user, setUser])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    upgradeToPro,
    downgradeToFree,
    updateProfile,
  }
}

