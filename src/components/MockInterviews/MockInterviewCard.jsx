import { useState } from 'react'
import { Calendar, Clock, MessageSquare, Trash2, CheckCircle2, XCircle } from 'lucide-react'

/**
 * Mock Interview Card component
 * Displays mock interview details and allows completion/editing
 */
function MockInterviewCard({ mock, onComplete, onDelete }) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState(mock.feedback || '')
  const [isEditing, setIsEditing] = useState(false)

  const scheduledDate = new Date(mock.scheduledDate)
  const isUpcoming = scheduledDate > new Date() && !mock.completed
  const isPast = scheduledDate < new Date() && !mock.completed
  const isCompleted = mock.completed

  const handleSaveFeedback = () => {
    onComplete(mock.id, feedback)
    setIsEditing(false)
    setShowFeedback(false)
  }

  const handleComplete = () => {
    if (!feedback.trim()) {
      setShowFeedback(true)
      setIsEditing(true)
    } else {
      onComplete(mock.id, feedback)
    }
  }

  return (
    <div className={`card ${isCompleted ? 'bg-green-500/5 border-green-500/30' : isPast ? 'bg-yellow-500/5 border-yellow-500/30' : ''}`}>
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex-1 w-full">
          {/* Header */}
          <div className="flex items-start gap-2 md:gap-3 mb-4">
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-400 flex-shrink-0 mt-0.5" />
            ) : isPast ? (
              <XCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-lg md:text-xl font-bold truncate">{mock.type || 'Mock Interview'}</h3>
              <p className="text-xs md:text-sm text-dark-muted truncate">{mock.role}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 text-xs md:text-sm">
            <div className="flex items-center gap-2 text-dark-muted">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{scheduledDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-dark-muted">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-4">
            {isCompleted ? (
              <span className="badge badge-confident">Completed</span>
            ) : isPast ? (
              <span className="badge badge-learning">Overdue</span>
            ) : (
              <span className="badge badge-not-started">Upcoming</span>
            )}
          </div>

          {/* Notes */}
          {mock.notes && (
            <div className="mb-4 p-2 md:p-3 bg-dark-bg rounded-lg border border-dark-border">
              <p className="text-xs md:text-sm text-dark-muted line-clamp-2">{mock.notes}</p>
            </div>
          )}

          {/* Feedback Section */}
          {showFeedback || isCompleted ? (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-dark-muted" />
                <span className="text-xs md:text-sm font-medium">Feedback</span>
              </div>
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Add your feedback and notes from this mock interview..."
                    rows="4"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={handleSaveFeedback}
                      className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs md:text-sm"
                    >
                      Save Feedback
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setFeedback(mock.feedback || '')
                      }}
                      className="px-3 md:px-4 py-2 bg-dark-bg hover:bg-dark-border text-dark-muted rounded-lg transition-colors text-xs md:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {feedback ? (
                    <div className="p-2 md:p-3 bg-dark-bg rounded-lg border border-dark-border">
                      <p className="text-xs md:text-sm text-dark-muted whitespace-pre-wrap line-clamp-3">{feedback}</p>
                    </div>
                  ) : (
                    <p className="text-xs md:text-sm text-dark-muted italic">No feedback added yet</p>
                  )}
                  {isCompleted && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-2 text-xs md:text-sm text-blue-400 hover:text-blue-300"
                    >
                      Edit Feedback
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
          {!isCompleted && (
            <button
              onClick={handleComplete}
              className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs md:text-sm whitespace-nowrap"
            >
              Mark Complete
            </button>
          )}
          <button
            onClick={() => onDelete(mock.id)}
            className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-xs md:text-sm flex items-center gap-2 justify-center md:justify-start"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MockInterviewCard

