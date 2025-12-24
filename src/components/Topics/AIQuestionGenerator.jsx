import { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, CheckCircle2, X, Save } from 'lucide-react'
import { generateInterviewQuestions, isAIAvailable, getAPIKey } from '../../services/aiService'
import { useUsageLimits } from '../../hooks/useUsageLimits'
import UsageLimitBanner from '../UsageLimitBanner'

/**
 * AI Question Generator Modal
 * Allows users to generate interview questions using AI
 */
function AIQuestionGenerator({ topic, role, onQuestionsGenerated, onClose }) {
  const [difficulty, setDifficulty] = useState('Medium')
  const [count, setCount] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [generatedQuestions, setGeneratedQuestions] = useState([])
  const [selectedQuestions, setSelectedQuestions] = useState(new Set())

  const apiKey = getAPIKey()
  const aiAvailable = isAIAvailable()
  const { canUseFeature, recordUsage } = useUsageLimits()
  const usageInfo = canUseFeature('aiQuestions')

  const handleGenerate = async () => {
    if (!aiAvailable) {
      setError('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your environment variables.')
      return
    }

    if (!usageInfo.allowed) {
      setError(`You've reached your monthly limit of ${usageInfo.limit} AI question generations. Upgrade to Pro for unlimited access.`)
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedQuestions([])
    setSelectedQuestions(new Set())

    try {
      const questions = await generateInterviewQuestions({
        role,
        topic: topic.name,
        difficulty,
        count,
        apiKey,
      })

      setGeneratedQuestions(questions)
      // Auto-select all questions by default
      setSelectedQuestions(new Set(questions.map((_, index) => index)))

      // Record usage
      recordUsage('aiQuestions')
    } catch (err) {
      setError(err.message || 'Failed to generate questions. Please try again.')
      console.error('AI generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleQuestionSelection = (index) => {
    const newSelected = new Set(selectedQuestions)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedQuestions(newSelected)
  }

  const handleSaveSelected = () => {
    const questionsToSave = generatedQuestions
      .filter((_, index) => selectedQuestions.has(index))
      .map((question, index) => ({
        id: `ai-${Date.now()}-${index}`,
        question,
        difficulty,
        status: 'Not Attempted',
        notes: '',
        source: 'AI',
        lastUpdated: new Date().toISOString(),
      }))

    if (questionsToSave.length > 0) {
      onQuestionsGenerated(questionsToSave)
      onClose()
    }
  }

  const getDifficultyBadge = (diff) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium'
    switch (diff) {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600/20">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Question Generator</h2>
              <p className="text-sm text-dark-muted">
                Generate interview questions for: <span className="font-medium">{topic.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-muted" />
          </button>
        </div>

        {/* Usage Limit Banner */}
        {!usageInfo.allowed && (
          <UsageLimitBanner
            feature="AI question generations"
            usageInfo={usageInfo}
          />
        )}

        {/* Configuration */}
        {!aiAvailable && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-300 mb-1">
                  AI Feature Not Available
                </p>
                <p className="text-xs text-dark-muted">
                  To use AI question generation, please set <code className="bg-dark-bg px-1 py-0.5 rounded">VITE_OPENAI_API_KEY</code> in your environment variables.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isGenerating && generatedQuestions.length === 0 && (
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={!aiAvailable}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Questions: {count}
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                disabled={!aiAvailable}
                className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-dark-muted mt-1">
                <span>3</span>
                <span>10</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!aiAvailable || isGenerating || !usageInfo.allowed}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Generate Questions with AI
            </button>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
            <p className="text-dark-muted">Generating questions with AI...</p>
            <p className="text-xs text-dark-muted mt-2">This may take a few seconds</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-300 mb-1">Generation Failed</p>
                <p className="text-xs text-dark-muted mb-3">{error}</p>
                <button
                  onClick={handleGenerate}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generated Questions */}
        {generatedQuestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Select questions to add ({selectedQuestions.size} / {generatedQuestions.length} selected)
              </p>
              <button
                onClick={() => {
                  const allSelected = selectedQuestions.size === generatedQuestions.length
                  if (allSelected) {
                    setSelectedQuestions(new Set())
                  } else {
                    setSelectedQuestions(new Set(generatedQuestions.map((_, i) => i)))
                  }
                }}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {selectedQuestions.size === generatedQuestions.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {generatedQuestions.map((question, index) => {
                const isSelected = selectedQuestions.has(index)
                return (
                  <div
                    key={index}
                    onClick={() => toggleQuestionSelection(index)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                      ? 'bg-blue-500/10 border-blue-500'
                      : 'bg-dark-bg border-dark-border hover:border-dark-text'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${isSelected ? 'text-blue-400' : 'text-dark-muted'}`}>
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-dark-border rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-2 break-words">{question}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={getDifficultyBadge(difficulty)}>
                            {difficulty}
                          </span>
                          <span className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded">
                            AI-generated
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3 pt-4 border-t border-dark-border">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-dark-bg hover:bg-dark-border text-dark-muted rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSelected}
                disabled={selectedQuestions.size === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Selected ({selectedQuestions.size})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIQuestionGenerator

