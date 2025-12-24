import { useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, CheckCircle2, Clock, Circle, Sparkles, MessageSquare } from 'lucide-react'
import AIQuestionGenerator from './AIQuestionGenerator'
import AnswerEvaluation from './AnswerEvaluation'

/**
 * Question Bank Component
 * Manages questions for a specific topic
 */
function QuestionBank({ topicId, topic, role, questions = [], onQuestionsUpdate }) {
  const [localQuestions, setLocalQuestions] = useState(questions)
  const [editingId, setEditingId] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [expandedQuestionId, setExpandedQuestionId] = useState(null) // Track which question has evaluation expanded
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    difficulty: 'Medium',
    status: 'Not Attempted',
    notes: '',
  })

  // Update parent when questions change
  const updateQuestions = (updatedQuestions) => {
    setLocalQuestions(updatedQuestions)
    onQuestionsUpdate(updatedQuestions)
  }

  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) return

    const question = {
      id: Date.now().toString(),
      question: newQuestion.question,
      difficulty: newQuestion.difficulty,
      status: newQuestion.status,
      notes: newQuestion.notes,
      source: 'manual',
      lastUpdated: new Date().toISOString(),
    }

    updateQuestions([...localQuestions, question])
    setNewQuestion({
      question: '',
      difficulty: 'Medium',
      status: 'Not Attempted',
      notes: '',
    })
    setIsAddingNew(false)
  }

  const handleAIGeneratedQuestions = (aiQuestions) => {
    // Check for duplicates before adding
    const existingQuestionTexts = new Set(
      localQuestions.map(q => q.question.toLowerCase().trim())
    )

    const newQuestions = aiQuestions.filter(
      q => !existingQuestionTexts.has(q.question.toLowerCase().trim())
    )

    if (newQuestions.length === 0) {
      alert('All generated questions already exist in your question bank.')
      return
    }

    if (newQuestions.length < aiQuestions.length) {
      const duplicateCount = aiQuestions.length - newQuestions.length
      alert(`${duplicateCount} duplicate question(s) were skipped.`)
    }

    updateQuestions([...localQuestions, ...newQuestions])
  }

  const handleUpdateQuestion = (id, updates) => {
    const updated = localQuestions.map(q =>
      q.id === id
        ? { ...q, ...updates, lastUpdated: new Date().toISOString() }
        : q
    )
    updateQuestions(updated)
    setEditingId(null)
  }

  const handleEvaluationComplete = (evaluationData) => {
    // Update the question with evaluation data
    const updated = localQuestions.map(q => {
      if (q.id === evaluationData.questionId) {
        return {
          ...q,
          evaluation: evaluationData.evaluation,
          userAnswer: evaluationData.userAnswer,
          evaluatedAt: evaluationData.evaluatedAt,
          lastUpdated: new Date().toISOString(),
          // Auto-update status based on score
          status: evaluationData.evaluation.score >= 8
            ? 'Confident'
            : evaluationData.evaluation.score >= 6
              ? 'Practicing'
              : 'Not Attempted',
        }
      }
      return q
    })
    updateQuestions(updated)
  }

  const handleDeleteQuestion = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      updateQuestions(localQuestions.filter(q => q.id !== id))
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confident':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case 'Practicing':
        return <Clock className="w-4 h-4 text-yellow-400" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status) => {
    const baseClasses = 'badge text-xs'
    switch (status) {
      case 'Confident':
        return `${baseClasses} badge-confident`
      case 'Practicing':
        return `${baseClasses} badge-learning`
      default:
        return `${baseClasses} badge-not-started`
    }
  }

  const getDifficultyBadge = (difficulty) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium'
    switch (difficulty) {
      case 'Easy':
        return `${baseClasses} bg-green-600/20 text-green-300`
      case 'Medium':
        return `${baseClasses} bg-yellow-600/20 text-yellow-300`
      case 'Hard':
        return `${baseClasses} bg-red-600/20 text-red-300`
      default:
        return `${baseClasses} bg-gray-600/20 text-gray-300`
    }
  }

  // Calculate progress
  const confidentCount = localQuestions.filter(q => q.status === 'Confident').length
  const totalCount = localQuestions.length
  const aiGeneratedCount = localQuestions.filter(q => q.source === 'AI').length
  const manualCount = localQuestions.filter(q => q.source === 'manual' || !q.source).length

  return (
    <div className="space-y-4 w-full">
      {/* Header with Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold mb-1">Question Bank</h3>
          <div className="flex items-center gap-4 text-sm text-dark-muted">
            <span>{confidentCount} / {totalCount} confident</span>
            {totalCount > 0 && (
              <>
                <span>•</span>
                <span>{aiGeneratedCount} AI-generated</span>
                <span>•</span>
                <span>{manualCount} manual</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAIGenerator(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </button>
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>
      </div>

      {/* Add New Question Form */}
      {isAddingNew && (
        <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <textarea
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder="Enter the interview question..."
                rows="2"
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newQuestion.status}
                  onChange={(e) => setNewQuestion({ ...newQuestion, status: e.target.value })}
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Not Attempted">Not Attempted</option>
                  <option value="Practicing">Practicing</option>
                  <option value="Confident">Confident</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
              <textarea
                value={newQuestion.notes}
                onChange={(e) => setNewQuestion({ ...newQuestion, notes: e.target.value })}
                placeholder="Your answer or notes..."
                rows="2"
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddQuestion}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                Add Question
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false)
                  setNewQuestion({
                    question: '',
                    difficulty: 'Medium',
                    status: 'Not Attempted',
                    notes: '',
                  })
                }}
                className="flex items-center justify-center gap-2 bg-dark-surface hover:bg-dark-border text-dark-muted px-4 py-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {localQuestions.length === 0 ? (
          <div className="text-center py-8 text-dark-muted">
            <p>No questions added yet.</p>
            <p className="text-sm mt-2">Click "Add Question" to get started.</p>
          </div>
        ) : (
          localQuestions.map((question) => (
            <div
              key={question.id}
              className="p-4 bg-dark-bg rounded-lg border border-dark-border"
            >
              {editingId === question.id ? (
                /* Edit Mode */
                <QuestionEditForm
                  question={question}
                  onSave={(updates) => handleUpdateQuestion(question.id, updates)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                /* View Mode */
                <div>
                  <div className="flex items-start justify-between mb-2 gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium mb-2 break-words">{question.question}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusIcon(question.status)}
                        <span className={getStatusBadge(question.status)}>
                          {question.status}
                        </span>
                        <span className={getDifficultyBadge(question.difficulty)}>
                          {question.difficulty}
                        </span>
                        {question.source === 'AI' && (
                          <span className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded">
                            AI-generated
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => setEditingId(question.id)}
                        className="p-1 hover:bg-dark-surface rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-dark-muted" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-1 hover:bg-dark-surface rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                  {question.notes && (
                    <div className="mt-3 p-3 bg-dark-surface rounded border border-dark-border max-h-[200px] overflow-y-auto">
                      <p className="text-sm text-dark-muted whitespace-pre-wrap break-words">
                        {question.notes}
                      </p>
                    </div>
                  )}

                  {/* Evaluation Score Badge (if evaluated) */}
                  {question.evaluation && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-lg text-sm font-medium ${question.evaluation.score >= 8
                        ? 'bg-green-500/20 text-green-300'
                        : question.evaluation.score >= 6
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-red-500/20 text-red-300'
                        }`}>
                        Score: {question.evaluation.score.toFixed(1)}/10
                      </div>
                      {question.evaluatedAt && (
                        <span className="text-xs text-dark-muted">
                          Evaluated {new Date(question.evaluatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Answer Evaluation Section */}
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <button
                      onClick={() => setExpandedQuestionId(
                        expandedQuestionId === question.id ? null : question.id
                      )}
                      className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mb-3"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {expandedQuestionId === question.id ? 'Hide' : 'Show'} Answer Evaluation
                    </button>
                    {expandedQuestionId === question.id && (
                      <div className="bg-dark-surface rounded-lg p-4 border border-dark-border">
                        <AnswerEvaluation
                          question={question}
                          role={role}
                          difficulty={question.difficulty}
                          onEvaluationComplete={handleEvaluationComplete}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* AI Question Generator Modal */}
      {showAIGenerator && topic && role && (
        <AIQuestionGenerator
          topic={topic}
          role={role}
          onQuestionsGenerated={handleAIGeneratedQuestions}
          onClose={() => setShowAIGenerator(false)}
        />
      )}
    </div>
  )
}

/**
 * Question Edit Form Component
 */
function QuestionEditForm({ question, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    question: question.question,
    difficulty: question.difficulty,
    status: question.status,
    notes: question.notes || '',
  })

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Question</label>
        <textarea
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          rows="2"
          className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Not Attempted">Not Attempted</option>
            <option value="Practicing">Practicing</option>
            <option value="Confident">Confident</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Your answer or notes..."
          rows="3"
          className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center justify-center gap-2 bg-dark-surface hover:bg-dark-border text-dark-muted px-4 py-2 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default QuestionBank

