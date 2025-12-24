import { useState } from 'react'
import { CheckCircle2, Clock, Circle, Edit2, Save, X, BookOpen, FileText } from 'lucide-react'
import QuestionBank from './QuestionBank'

/**
 * Topic Card component
 * Displays and allows editing of topic status, confidence, and notes
 * Includes Questions tab for question bank management
 */
function TopicCard({ topic, role, onUpdate, isFullPage = false }) {
  const [activeTab, setActiveTab] = useState('details') // 'details' or 'questions'
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState(topic.status)
  const [confidence, setConfidence] = useState(topic.confidence)
  const [notes, setNotes] = useState(topic.notes || '')

  const handleSave = () => {
    onUpdate({
      status,
      confidence: parseInt(confidence),
      notes,
    })
    setIsEditing(false)
  }

  const handleQuestionsUpdate = (questions) => {
    onUpdate({
      questions,
    })
  }

  const handleCancel = () => {
    setStatus(topic.status)
    setConfidence(topic.confidence)
    setNotes(topic.notes || '')
    setIsEditing(false)
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'Confident':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'Learning':
        return <Clock className="w-5 h-5 text-yellow-400" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = () => {
    const baseClasses = 'badge'
    switch (status) {
      case 'Confident':
        return `${baseClasses} badge-confident`
      case 'Learning':
        return `${baseClasses} badge-learning`
      default:
        return `${baseClasses} badge-not-started`
    }
  }

  return (
    <div className={`${isFullPage ? 'bg-dark-surface rounded-xl p-8 border border-dark-border min-h-screen' : 'card hover:shadow-xl transition-shadow'}`}>
      {/* Header */}
      <div className={`${isFullPage ? 'mb-8' : 'mb-4'} flex items-start justify-between gap-4`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <h3 className={`font-bold ${isFullPage ? 'text-3xl' : 'text-lg'} break-words`}>
              {topic.name}
            </h3>
          </div>
        </div>
        {!isEditing && activeTab === 'details' && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-dark-bg rounded transition-colors"
          >
            <Edit2 className="w-4 h-4 text-dark-muted" />
          </button>
        )}
      </div>

      {/* Category */}
      <div className={`${isFullPage ? 'mb-6' : 'mb-4'}`}>
        <span className="text-xs px-3 py-1 bg-dark-bg rounded text-dark-muted">
          {topic.category}
        </span>
      </div>

      {/* Tabs */}
      <div className={`${isFullPage ? 'mb-8' : 'mb-4'} flex gap-2 border-b border-dark-border`}>
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'details'
            ? 'text-blue-400 border-b-2 border-blue-400'
            : 'text-dark-muted hover:text-dark-text'
            }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Details
          </div>
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'questions'
            ? 'text-blue-400 border-b-2 border-blue-400'
            : 'text-dark-muted hover:text-dark-text'
            }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Questions
            {topic.questions && topic.questions.length > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {topic.questions.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' ? (
        isEditing ? (
          /* Edit Mode */
          <div className={`space-y-4 ${isFullPage ? 'max-w-2xl' : ''}`}>
            {/* Status Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Not Started">Not Started</option>
                <option value="Learning">Learning</option>
                <option value="Confident">Confident</option>
              </select>
            </div>

            {/* Confidence Slider */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confidence: {confidence}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-dark-muted mt-1">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                rows="3"
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 bg-dark-bg hover:bg-dark-border text-dark-muted px-4 py-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className={`space-y-3 ${isFullPage ? 'max-w-2xl' : ''}`}>
            <div className="flex items-center justify-between">
              <span className={getStatusBadge()}>{status}</span>
              <span className="text-sm text-dark-muted">
                Confidence: {confidence}/5
              </span>
            </div>

            {/* Confidence Visual */}
            <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(confidence / 5) * 100}%` }}
              />
            </div>

            {/* Notes Preview */}
            {notes && (
              <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                <p className="text-sm text-dark-muted line-clamp-3">{notes}</p>
              </div>
            )}

            {topic.lastUpdated && (
              <p className="text-xs text-dark-muted">
                Updated: {new Date(topic.lastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>
        )
      ) : (
        /* Questions Tab */
        <div className={`${isFullPage ? 'mt-8' : 'mt-4'}`}>
          <QuestionBank
            topicId={topic.id}
            topic={topic}
            role={role}
            questions={topic.questions || []}
            onQuestionsUpdate={handleQuestionsUpdate}
          />
        </div>
      )}
    </div>
  )
}

export default TopicCard

