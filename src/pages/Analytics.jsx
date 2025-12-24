import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { calculateReadinessScore } from '../utils/readinessCalculator'
import { calculateQuestionProgress } from '../data/questionBank'
import ReadinessChart from '../components/Analytics/ReadinessChart'
import ConfidenceChart from '../components/Analytics/ConfidenceChart'
import TopicsProgressChart from '../components/Analytics/TopicsProgressChart'
import WeeklyActivityChart from '../components/Analytics/WeeklyActivityChart'
import { BarChart3, TrendingUp, Target, Calendar, BookOpen } from 'lucide-react'

/**
 * Analytics Dashboard page
 * Visualizes readiness trends, confidence levels, and progress
 */
function Analytics({ selectedRole }) {
  const [topics] = useLocalStorage('topics', {})
  const [analyticsHistory, setAnalyticsHistory] = useLocalStorage('analyticsHistory', {})
  const [currentScore, setCurrentScore] = useState(0)
  const [scoreTrend, setScoreTrend] = useState([])

  useEffect(() => {
    if (selectedRole) {
      const roleTopics = topics[selectedRole] || []
      const score = calculateReadinessScore(roleTopics)
      setCurrentScore(score)

      // Get historical scores for this role
      const history = analyticsHistory[selectedRole] || []
      setScoreTrend(history)
    }
  }, [selectedRole, topics, analyticsHistory])

  // Save current score to history (once per day)
  useEffect(() => {
    if (selectedRole && currentScore > 0) {
      const today = new Date().toISOString().split('T')[0]
      const history = analyticsHistory[selectedRole] || []
      const lastEntry = history[history.length - 1]

      // Only add if it's a new day or score changed significantly
      if (!lastEntry || lastEntry.date !== today) {
        const newHistory = [
          ...history,
          {
            date: today,
            score: currentScore,
          },
        ].slice(-30) // Keep last 30 days

        const updatedHistory = {
          ...analyticsHistory,
          [selectedRole]: newHistory,
        }
        setAnalyticsHistory(updatedHistory)
      }
    }
  }, [selectedRole, currentScore])

  const roleTopics = topics[selectedRole] || []
  const confidentCount = roleTopics.filter(t => t.status === 'Confident').length
  const learningCount = roleTopics.filter(t => t.status === 'Learning').length
  const notStartedCount = roleTopics.filter(t => t.status === 'Not Started').length

  // Calculate average confidence
  const avgConfidence =
    roleTopics.length > 0
      ? roleTopics.reduce((sum, t) => sum + (t.confidence || 1), 0) / roleTopics.length
      : 0

  // Calculate question bank statistics
  let totalQuestions = 0
  let confidentQuestions = 0
  let topicsWithQuestions = 0
  roleTopics.forEach(topic => {
    if (topic.questions && topic.questions.length > 0) {
      topicsWithQuestions++
      const progress = calculateQuestionProgress(topic.questions)
      totalQuestions += progress.total
      confidentQuestions += progress.confident
    }
  })

  // Group topics by category for confidence chart
  const categoryConfidence = {}
  roleTopics.forEach((topic) => {
    if (!categoryConfidence[topic.category]) {
      categoryConfidence[topic.category] = {
        total: 0,
        sum: 0,
      }
    }
    categoryConfidence[topic.category].total++
    categoryConfidence[topic.category].sum += topic.confidence || 1
  })

  const categoryData = Object.entries(categoryConfidence).map(([category, data]) => ({
    category,
    avgConfidence: data.sum / data.total,
  }))

  return (
    <div className="w-full max-w-7xl mx-auto px-3 md:px-0">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-dark-muted text-sm md:text-base">
          Detailed insights into your interview preparation progress
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="card bg-blue-500/10 border-blue-500/30">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 flex-shrink-0">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-dark-muted">Readiness Score</p>
              <p className="text-xl md:text-2xl font-bold">{Math.round(currentScore)}%</p>
            </div>
          </div>
        </div>
        <div className="card bg-green-500/10 border-green-500/30">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-green-600/20 flex-shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-dark-muted">Avg Confidence</p>
              <p className="text-xl md:text-2xl font-bold">{avgConfidence.toFixed(1)}/5</p>
            </div>
          </div>
        </div>
        <div className="card bg-purple-500/10 border-purple-500/30">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-purple-600/20 flex-shrink-0">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-dark-muted">Question Coverage</p>
              <p className="text-xl md:text-2xl font-bold">
                {totalQuestions > 0
                  ? `${Math.round((confidentQuestions / totalQuestions) * 100)}%`
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-yellow-500/10 border-yellow-500/30">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 rounded-lg bg-yellow-600/20 flex-shrink-0">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-dark-muted">In Progress</p>
              <p className="text-xl md:text-2xl font-bold">{learningCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Readiness Score Over Time */}
        <div className="card">
          <h2 className="text-lg md:text-xl font-bold mb-4">Readiness Score Trend</h2>
          <ReadinessChart data={scoreTrend} />
        </div>

        {/* Topics Progress */}
        <div className="card">
          <h2 className="text-lg md:text-xl font-bold mb-4">Topics Progress</h2>
          <TopicsProgressChart
            confident={confidentCount}
            learning={learningCount}
            notStarted={notStartedCount}
          />
        </div>
      </div>

      {/* Confidence by Category */}
      <div className="card mb-6">
        <h2 className="text-lg md:text-xl font-bold mb-4">Confidence by Category</h2>
        <ConfidenceChart data={categoryData} />
      </div>

      {/* Weekly Activity */}
      <div className="card">
        <h2 className="text-lg md:text-xl font-bold mb-4">Weekly Activity</h2>
        <WeeklyActivityChart topics={roleTopics} />
      </div>
    </div>
  )
}

export default Analytics

