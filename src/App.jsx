import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Sidebar from './components/Layout/Sidebar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Pricing from './pages/Pricing'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import Topics from './pages/Topics'
import Analytics from './pages/Analytics'
import MockInterviews from './pages/MockInterviews'
import VoiceMockInterview from './pages/VoiceMockInterview'
import ProtectedRoute from './components/ProtectedRoute'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAuth } from './hooks/useAuth'
import { useUserData } from './hooks/useUserData'
import { Menu, X } from 'lucide-react'

function App() {
  const [selectedRole, setSelectedRole] = useLocalStorage('selectedRole', null)
  const { isAuthenticated, isLoading, user } = useAuth()
  const { initializeUserData } = useUserData()
  const [showLanding, setShowLanding] = useState(!selectedRole && !isAuthenticated)

  // Initialize user data when user logs in
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      initializeUserData(user)
    }
  }, [isAuthenticated, user, isLoading, initializeUserData])

  const handleGetStarted = () => {
    setShowLanding(false)
  }

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg">
        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              showLanding ? (
                <Landing onGetStarted={handleGetStarted} />
              ) : isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Login Page - Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Pricing Page */}
          <Route path="/pricing" element={<Pricing />} />

          {/* App Routes (with sidebar) - Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <AppLayout
                  selectedRole={selectedRole}
                  setSelectedRole={setSelectedRole}
                  onShowLanding={() => setShowLanding(true)}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

function AppLayout({ selectedRole, setSelectedRole, onShowLanding }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleChangeRole = () => {
    setSelectedRole(null)
  }

  return (
    <div className="flex">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${isMobile
          ? `fixed left-0 top-0 h-screen w-64 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`
          : 'fixed left-0 top-0 h-screen w-64'
          }`}
      >
        <Sidebar
          selectedRole={selectedRole}
          onShowLanding={onShowLanding}
          onChangeRole={handleChangeRole}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <main className={`flex-1 ${isMobile ? 'ml-0' : 'ml-64'} p-4 md:p-8`}>
        {/* Mobile Header with Menu Button */}
        {isMobile && (
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-dark-surface rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-2xl font-bold">Interview Ready</h1>
          </div>
        )}
        <Routes>
          <Route
            path="/dashboard"
            element={
              selectedRole ? (
                <Dashboard selectedRole={selectedRole} onRoleSelect={setSelectedRole} />
              ) : (
                <Dashboard onRoleSelect={setSelectedRole} />
              )
            }
          />
          <Route
            path="/roadmap"
            element={
              selectedRole ? (
                <Roadmap selectedRole={selectedRole} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/topics"
            element={
              selectedRole ? (
                <Topics selectedRole={selectedRole} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/analytics"
            element={
              selectedRole ? (
                <Analytics selectedRole={selectedRole} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/mock-interviews"
            element={
              selectedRole ? (
                <MockInterviews selectedRole={selectedRole} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/voice-interview"
            element={
              selectedRole ? (
                <VoiceMockInterview selectedRole={selectedRole} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App

