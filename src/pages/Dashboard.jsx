import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from '../hooks/useAuth'
import { useUserData } from '../hooks/useUserData'
import { calculateReadinessScore } from '../utils/readinessCalculator'
import { getWeakAreas } from '../utils/weakAreaDetector'
import { generateInterviewReadinessReport } from '../utils/pdfGenerator'
import ReadinessScore from '../components/Dashboard/ReadinessScore'
import WeakAreas from '../components/Dashboard/WeakAreas'
import RoleSelector from '../components/Dashboard/RoleSelector'
import QuickStats from '../components/Dashboard/QuickStats'
import { getTopicsByRole } from '../data/roadmaps'
import { Download } from 'lucide-react'

/**
 * Main Dashboard page
 * Shows overview, readiness score, weak areas, and quick stats
 * Integrated with user-scoped data management
 */
function Dashboard({ selectedRole, onRoleSelect }) {
  const { user } = useAuth()
  const { userData, loadUserData, updateTopicProgress, getReadinessScore } = useUserData()
  const [topics] = useLocalStorage('topics', {})
  const [mockInterviews] = useLocalStorage('mockInterviews', [])
  const [readinessScore, setReadinessScore] = useState(0)
  const [weakAreas, setWeakAreas] = useState([])
  const [quickStats, setQuickStats] = useState({
    totalTopics: 0,
    confident: 0,
    learning: 0,
    notStarted: 0,
  })

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      loadUserData(user.id)
    }
  }, [user, loadUserData])

  useEffect(() => {
    if (selectedRole) {
      // Calculate readiness score
      const roleTopics = topics[selectedRole] || []
      const score = calculateReadinessScore(roleTopics)
      setReadinessScore(score)

      // Get weak areas
      const weak = getWeakAreas(roleTopics)
      setWeakAreas(weak)

      // Calculate quick stats
      const stats = {
        totalTopics: roleTopics.length,
        confident: roleTopics.filter(t => t.status === 'Confident').length,
        learning: roleTopics.filter(t => t.status === 'Learning').length,
        notStarted: roleTopics.filter(t => t.status === 'Not Started').length,
      }
      setQuickStats(stats)
    }
  }, [selectedRole, topics])

  // If no role selected, show role selector
  if (!selectedRole) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Interview Readiness Analyzer
          </h1>
          <p className="text-xl text-dark-muted">
            Select your target role to get started
          </p>
        </div>
        <RoleSelector onSelect={onRoleSelect} />
      </div>
    )
  }

  const handleExportReport = () => {
    const roleTopics = topics[selectedRole] || []
    const roleMocks = mockInterviews.filter(m => m.role === selectedRole) || []

    generateInterviewReadinessReport({
      role: selectedRole,
      topics: roleTopics,
      mockInterviews: roleMocks,
    })
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* User Welcome Header */}
      {user && (
        <div className="mb-6 md:mb-8 p-4 md:p-6 bg-blue-600/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm md:text-base">
            Welcome back, <span className="font-semibold">{user.name}</span>! 👋
          </p>
          <p className="text-dark-muted text-xs md:text-sm mt-1">
            Continue your interview preparation journey
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-dark-muted text-sm md:text-base">
            Overview of your interview preparation progress
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors shadow-lg text-sm md:text-base"
        >
          <Download className="w-4 md:w-5 h-4 md:h-5" />
          <span className="hidden sm:inline">Export Report (PDF)</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Readiness Score - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <ReadinessScore score={readinessScore} />
        </div>

        {/* Quick Stats */}
        <div>
          <QuickStats stats={quickStats} />
        </div>
      </div>

      {/* Weak Areas */}
      <div className="mb-6">
        <WeakAreas areas={weakAreas} />
      </div>
    </div>
  )
}

export default Dashboard

