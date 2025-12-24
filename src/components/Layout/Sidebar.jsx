import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  BookOpen,
  BarChart3,
  Calendar,
  CheckCircle2,
  Mic,
  LogOut,
  User,
  Crown,
  Edit2
} from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import { useUsageLimits } from '../../hooks/useUsageLimits'

/**
 * Sidebar navigation component
 * Displays navigation links and current role badge
 */
function Sidebar({ selectedRole, onShowLanding, onChangeRole, onClose }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { isPro, plan } = useUsageLimits()

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/roadmap', icon: Map, label: 'Roadmap' },
    { path: '/topics', icon: BookOpen, label: 'Topics' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/mock-interviews', icon: Calendar, label: 'Mock Interviews' },
    { path: '/voice-interview', icon: Mic, label: 'Voice Interview' },
  ]

  return (
    <aside className="w-full h-full bg-dark-surface border-r border-dark-border p-6 flex flex-col overflow-y-auto">
      <div className="flex-1 overflow-y-auto">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Interview Ready
          </h1>
          <p className="text-sm text-dark-muted">
            Track your preparation
          </p>
        </div>

        {/* Role Badge */}
        {selectedRole && (
          <div className="mb-6 p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">
                  {selectedRole}
                </span>
              </div>
              <button
                onClick={onChangeRole}
                className="p-1 hover:bg-blue-600/30 rounded transition-colors"
                title="Change role"
              >
                <Edit2 className="w-3 h-3 text-blue-300 hover:text-blue-200" />
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`sidebar-link ${isActive ? 'active' : 'text-dark-muted'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Info or Sign In CTA */}
      {user ? (
        <div className="mt-auto pt-6 border-t border-dark-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name || user.email}</p>
              <div className="flex items-center gap-1">
                {isPro ? (
                  <>
                    <Crown className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">Pro</span>
                  </>
                ) : (
                  <span className="text-xs text-dark-muted">Free</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              logout()
              if (onShowLanding) onShowLanding()
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-dark-muted hover:bg-dark-bg rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      ) : (
        <div className="mt-auto pt-6 border-t border-dark-border">
          <div className="mb-3">
            <p className="text-sm text-dark-muted mb-2">Sign in to sync progress</p>
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/login?signup=1"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-dark-border text-dark-muted rounded-lg hover:border-blue-600 hover:text-blue-400 transition-colors text-sm"
              >
                <Edit2 className="w-4 h-4" />
                <span>Create Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-6">
        <p className="text-xs text-dark-muted text-center">
          v1.0.0
        </p>
      </div>
    </aside>
  )
}

export default Sidebar

