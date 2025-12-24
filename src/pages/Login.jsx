import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Github, Globe } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Target, ArrowLeft } from 'lucide-react'

/**
 * Login/Signup Page
 * Simulated authentication interface
 */
function Login() {
  const navigate = useNavigate()
  const { login, signup } = useAuth()
  const location = useLocation()
  const [isLogin, setIsLogin] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search)
      return p.get('signup') !== '1'
    } catch (e) {
      return true
    }
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        if (!name.trim()) {
          setError('Please enter your name')
          setIsLoading(false)
          return
        }
        await signup(email, password, name)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const wantSignup = params.get('signup') === '1'
    setIsLogin(!wantSignup)
    // small entry animation
    const t = setTimeout(() => setAnimateIn(true), 40)
    return () => clearTimeout(t)
  }, [location.search])

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 md:px-8 py-8 md:py-0">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-dark-muted hover:text-dark-text mb-6 md:mb-8 transition-colors text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className={`card ${animateIn ? 'animate-slide-up' : 'opacity-0'}`}>
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold">Interview Ready</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs md:text-base text-dark-muted">
              {isLogin
                ? 'Sign in to continue your preparation'
                : 'Start your interview preparation journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Social login placeholders */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => alert('Social login not available in demo')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-sm hover:bg-white/10 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => alert('Social login not available in demo')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-sm hover:bg-white/10 transition-colors"
              >
                <Github className="w-4 h-4" />
                Continue with GitHub
              </button>
            </div>
            {!isLogin && (
              <div>
                <label className="block text-xs md:text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-xs md:text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-dark-muted hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs md:text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors font-medium text-sm md:text-base"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Debug panel - only visible when ?debug_auth=1 is present in URL */}
          {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug_auth') === '1' && (
            <div className="mt-4 p-3 bg-black/60 border border-dark-border rounded-lg text-xs text-left">
              <p className="text-sm font-medium text-white mb-2">Auth Debug</p>
              <div className="mb-2">
                <strong className="text-dark-muted">auth_users:</strong>
                <pre className="whitespace-pre-wrap break-words text-xs text-white mt-1">{localStorage.getItem('auth_users') || 'null'}</pre>
              </div>
              <div>
                <strong className="text-dark-muted">auth_user:</strong>
                <pre className="whitespace-pre-wrap break-words text-xs text-white mt-1">{localStorage.getItem('auth_user') || 'null'}</pre>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setError('')
                if (isLogin) {
                  navigate('/login?signup=1')
                } else {
                  navigate('/login')
                }
              }}
              className="text-xs md:text-sm text-blue-400 hover:text-blue-300"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-6 pt-4 md:pt-6 border-t border-dark-border">
            <p className="text-xs text-center text-dark-muted">
              This is a demo. Authentication is simulated for demonstration purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

