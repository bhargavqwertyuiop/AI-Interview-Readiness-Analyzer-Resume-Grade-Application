import { Navigate } from 'react-router-dom'

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ isAuthenticated, isLoading, children }) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-dark-muted">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute
