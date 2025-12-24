import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuthNew';

/**
 * Login/Signup Page with Backend Authentication
 */
function LoginPage() {
    const navigate = useNavigate();
    const { login, signup, isAuthenticated, isLoading: authLoading, error: authError } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                // Login flow
                if (!email.trim() || !password.trim()) {
                    throw new Error('Email and password are required');
                }
                await login(email, password);
                navigate('/dashboard');
            } else {
                // Signup flow
                if (!name.trim()) {
                    throw new Error('Name is required');
                }
                if (!email.trim() || !password.trim()) {
                    throw new Error('Email and password are required');
                }
                await signup(name, email, password);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || (isLogin ? 'Login failed' : 'Signup failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setEmail('');
        setPassword('');
        setName('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">InterviewOS</h1>
                    <p className="text-slate-400">AI-Powered Interview Readiness Platform</p>
                </div>

                {/* Auth Card */}
                <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
                    {/* Header */}
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>

                    {/* Error Message */}
                    {(error || authError) && (
                        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-500 text-sm">{error || authError}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field (Signup only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    disabled={isLoading || authLoading}
                                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                />
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                disabled={isLoading || authLoading}
                                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={isLogin ? '••••••••' : 'Min. 6 characters'}
                                    disabled={isLoading || authLoading}
                                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading || authLoading}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 disabled:opacity-50"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || authLoading}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading || authLoading ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    {isLogin ? 'Signing in...' : 'Creating account...'}
                                </>
                            ) : (
                                <>{isLogin ? 'Sign In' : 'Create Account'}</>
                            )}
                        </button>
                    </form>

                    {/* Toggle Mode Link */}
                    <div className="mt-6 text-center text-slate-400">
                        <p>
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                            <button
                                onClick={toggleMode}
                                disabled={isLoading || authLoading}
                                className="ml-2 text-blue-500 hover:text-blue-400 font-semibold disabled:opacity-50"
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="mt-8 grid grid-cols-1 gap-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-blue-400 text-sm">
                            🔒 <strong>Secure:</strong> Your data is encrypted and stored securely on our servers.
                        </p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <p className="text-green-400 text-sm">
                            ☁️ <strong>Cross-Device:</strong> Access your progress from any device, anytime.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
