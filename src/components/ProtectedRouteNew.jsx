import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthNew';
import { Loader } from 'lucide-react';

/**
 * Protected Route Component
 * Ensures user is authenticated before accessing protected pages
 */
function ProtectedRouteNew({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRouteNew;
