import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import MockInterviewCard from '../components/MockInterviews/MockInterviewCard'
import ScheduleMockModal from '../components/MockInterviews/ScheduleMockModal'
import { Calendar, Clock, Plus, TrendingUp } from 'lucide-react'

/**
 * Mock Interviews page
 * Schedule and track mock interviews with countdown timer
 */
function MockInterviews({ selectedRole }) {
  const [mockInterviews, setMockInterviews] = useLocalStorage('mockInterviews', [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [timeUntilNext, setTimeUntilNext] = useState(null)

  useEffect(() => {
    // Calculate time until next mock interview
    const upcoming = mockInterviews
      .filter(m => new Date(m.scheduledDate) > new Date() && !m.completed)
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))[0]

    if (upcoming) {
      const updateTimer = () => {
        const now = new Date()
        const scheduled = new Date(upcoming.scheduledDate)
        const diff = scheduled - now

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)

          setTimeUntilNext({ days, hours, minutes, seconds })
        } else {
          setTimeUntilNext(null)
        }
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    } else {
      setTimeUntilNext(null)
    }
  }, [mockInterviews])

  const handleScheduleMock = (mockData) => {
    const newMock = {
      id: Date.now().toString(),
      role: selectedRole,
      scheduledDate: mockData.scheduledDate,
      type: mockData.type,
      notes: mockData.notes || '',
      completed: false,
      feedback: '',
      createdAt: new Date().toISOString(),
    }
    setMockInterviews(prev => [...prev, newMock])
    setIsModalOpen(false)
  }

  const handleCompleteMock = (id, feedback) => {
    setMockInterviews(prev =>
      prev.map(mock =>
        mock.id === id
          ? {
            ...mock,
            completed: true,
            feedback: feedback || mock.feedback,
            completedAt: new Date().toISOString(),
          }
          : mock
      )
    )
  }

  const handleDeleteMock = (id) => {
    setMockInterviews(prev => prev.filter(mock => mock.id !== id))
  }

  const completedCount = mockInterviews.filter(m => m.completed).length
  const upcomingCount = mockInterviews.filter(
    m => new Date(m.scheduledDate) > new Date() && !m.completed
  ).length

  return (
    <div className="w-full max-w-6xl mx-auto px-3 md:px-0">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Mock Interviews</h1>
            <p className="text-dark-muted text-sm md:text-base">
              Schedule and track your mock interview practice sessions
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Schedule Mock</span>
            <span className="sm:hidden">Schedule</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
          <div className="card bg-blue-500/10 border-blue-500/30">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 rounded-lg bg-blue-600/20 flex-shrink-0">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-dark-muted">Upcoming</p>
                <p className="text-xl md:text-2xl font-bold">{upcomingCount}</p>
              </div>
            </div>
          </div>
          <div className="card bg-green-500/10 border-green-500/30">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 rounded-lg bg-green-600/20 flex-shrink-0">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-dark-muted">Completed</p>
                <p className="text-xl md:text-2xl font-bold">{completedCount}</p>
              </div>
            </div>
          </div>
          {timeUntilNext && (
            <div className="card bg-yellow-500/10 border-yellow-500/30">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 rounded-lg bg-yellow-600/20 flex-shrink-0">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-dark-muted">Next Mock In</p>
                  <p className="text-sm md:text-lg font-bold">
                    {timeUntilNext.days}d {timeUntilNext.hours}h {timeUntilNext.minutes}m
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mock Interviews List */}
      <div className="space-y-3 md:space-y-4">
        {mockInterviews.length === 0 ? (
          <div className="card text-center py-8 md:py-12">
            <Calendar className="w-10 h-10 md:w-12 md:h-12 text-dark-muted mx-auto mb-4" />
            <p className="text-dark-muted mb-4 text-sm md:text-base">No mock interviews scheduled yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Schedule Your First Mock
            </button>
          </div>
        ) : (
          mockInterviews
            .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))
            .map((mock) => (
              <MockInterviewCard
                key={mock.id}
                mock={mock}
                onComplete={handleCompleteMock}
                onDelete={handleDeleteMock}
              />
            ))
        )}
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <ScheduleMockModal
          onClose={() => setIsModalOpen(false)}
          onSchedule={handleScheduleMock}
        />
      )}
    </div>
  )
}

export default MockInterviews

