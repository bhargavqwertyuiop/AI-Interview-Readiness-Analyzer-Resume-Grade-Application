import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { authAPI, tokenUtils } from '../services/api';

// Auth context
const AuthContext = createContext(null);

/**
 * Enhanced Authentication Hook
 * Manages user authentication state with backend integration
 */
export function useAuth() {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from tokens on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = tokenUtils.getAccessToken();
                if (token) {
                    // Token exists, set as authenticated
                    // Could optionally fetch user profile here
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                tokenUtils.clearTokens();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    /**
     * Login with email and password
     * Communicates with backend API
     */
    const login = useCallback(async (email, password) => {
        try {
            setError(null);
            setIsLoading(true);

            // Validate inputs
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            if (!email.includes('@')) {
                throw new Error('Invalid email format');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            // Call backend API
            const response = await authAPI.login(email, password);

            if (response.success) {
                // Store tokens
                tokenUtils.setTokens(response.accessToken);

                // Store user info
                setUser(response.user);
                setIsAuthenticated(true);

                return response.user;
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (err) {
            const errorMessage = err.message || 'Login failed';
            setError(errorMessage);
            setIsAuthenticated(false);
            setUser(null);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Signup with name, email, and password
     * Creates new user account on backend
     */
    const signup = useCallback(async (name, email, password) => {
        try {
            setError(null);
            setIsLoading(true);

            // Validate inputs
            if (!name || !email || !password) {
                throw new Error('Name, email, and password are required');
            }

            if (!email.includes('@')) {
                throw new Error('Invalid email format');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            // Call backend API
            const response = await authAPI.signup(name, email, password);

            if (response.success) {
                // Store tokens
                tokenUtils.setTokens(response.accessToken);

                // Store user info
                setUser(response.user);
                setIsAuthenticated(true);

                return response.user;
            } else {
                throw new Error(response.message || 'Signup failed');
            }
        } catch (err) {
            const errorMessage = err.message || 'Signup failed';
            setError(errorMessage);
            setIsAuthenticated(false);
            setUser(null);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Logout user
     * Clears tokens and user data
     */
    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Call backend logout endpoint
            try {
                await authAPI.logout();
            } catch (err) {
                console.warn('Backend logout failed:', err);
                // Continue with local cleanup even if backend fails
            }

            // Clear local state
            tokenUtils.clearTokens();
            setUser(null);
            setIsAuthenticated(false);
        } catch (err) {
            console.error('Logout error:', err);
            // Force clear state
            tokenUtils.clearTokens();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Clear error message
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        logout,
        clearError,
    };
}

/**
 * Provider component for Auth context
 */
export function AuthProvider({ children }) {
    const auth = useAuth();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use Auth context
 */
export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
}
