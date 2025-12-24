import { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, CheckCircle2, X, MessageSquare, TrendingUp, Target } from 'lucide-react'
import { evaluateAnswer, isEvaluationAvailable, getAPIKey } from '../../services/answerEvaluationService'
import { useUsageLimits } from '../../hooks/useUsageLimits'
import UsageLimitBanner from '../UsageLimitBanner'

/**
 * Answer Evaluation Component
 * Allows users to type answers and get AI evaluation
 */
function AnswerEvaluation({ question, role, difficulty, onEvaluationComplete }) {
  const [userAnswer, setUserAnswer] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [error, setError] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [showComparison, setShowComparison] = useState(false)

  const apiKey = getAPIKey()
  const evaluationAvailable = isEvaluationAvailable()
  const { canUseFeature, recordUsage } = useUsageLimits()
  const usageInfo = canUseFeature('aiEvaluations')

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) {
      setError('Please enter an answer before evaluation.')
      return
    }

    if (!evaluationAvailable) {
      setError('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your environment variables.')
      return
    }

    if (!usageInfo.allowed) {
      setError(`You've reached your monthly limit of ${usageInfo.limit} AI evaluations. Upgrade to Pro for unlimited access.`)
      return
    }

    setIsEvaluating(true)
    setError(null)
    setEvaluation(null)

    try {
      const result = await evaluateAnswer({
        question: question.question,
        userAnswer: userAnswer.trim(),
        role,
        difficulty: question.difficulty || difficulty,
        apiKey,
      })

      setEvaluation(result)
      setShowComparison(true)

      // Record usage
      recordUsage('aiEvaluations')

      // Notify parent component
      if (onEvaluationComplete) {
        onEvaluationComplete({
          questionId: question.id,
          userAnswer: userAnswer.trim(),
          evaluation: result,
          evaluatedAt: new Date().toISOString(),
        })
      }
    } catch (err) {
      setError(err.message || 'Failed to evaluate answer. Please try again.')
      console.error('Evaluation error:', err)
    } finally {
      setIsEvaluating(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBadgeColor = (score) => {
    if (score >= 8) return 'bg-green-500/20 border-green-500/30 text-green-300'
    if (score >= 6) return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
    return 'bg-red-500/20 border-red-500/30 text-red-300'
  }

  return (
    <div className="space-y-4 mt-4 max-h-[600px] overflow-y-auto">
      {/* Usage Limit Banner */}
      {!usageInfo.allowed && (
        <UsageLimitBanner
          feature="AI answer evaluations"
          usageInfo={usageInfo}
        />
      )}

      {/* Answer Input Section */}
      <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h4 className="font-semibold">Your Answer</h4>
        </div>
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows="4"
          className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
          disabled={isEvaluating}
        />
        <button
          onClick={handleEvaluate}
          disabled={isEvaluating || !evaluationAvailable || !userAnswer.trim() || !usageInfo.allowed}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm"
        >
          {isEvaluating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Evaluate Answer with AI
            </>
          )}
        </button>
        {!evaluationAvailable && (
          <p className="text-xs text-yellow-400 mt-2">
            AI evaluation requires OpenAI API key configuration
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-300 mb-1">Evaluation Failed</p>
              <p className="text-xs text-dark-muted">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Results */}
      {evaluation && (
        <div className="space-y-4">
          {/* Score Badge */}
          <div className={`p-4 rounded-lg border ${getScoreBadgeColor(evaluation.score)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6" />
                <div>
                  <p className="text-sm text-dark-muted">Your Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(evaluation.score)}`}>
                    {evaluation.score.toFixed(1)}/10
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-dark-muted mb-1">Performance</p>
                <p className="text-sm font-medium">
                  {evaluation.score >= 8 ? 'Excellent' :
                    evaluation.score >= 6 ? 'Good' :
                      evaluation.score >= 4 ? 'Needs Improvement' : 'Poor'}
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          {showComparison && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Answer */}
              <div className="p-4 bg-dark-bg rounded-lg border border-dark-border flex flex-col">
                <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <h5 className="font-semibold text-sm">Your Answer</h5>
                </div>
                <div className="p-3 bg-dark-surface rounded border border-dark-border overflow-y-auto max-h-[250px] flex-1">
                  <p className="text-sm text-dark-muted whitespace-pre-wrap break-words">{userAnswer}</p>
                </div>
              </div>

              {/* Ideal Answer */}
              <div className="p-4 bg-dark-bg rounded-lg border border-green-500/30 flex flex-col">
                <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <h5 className="font-semibold text-sm">Ideal Answer</h5>
                </div>
                <div className="p-3 bg-green-500/5 rounded border border-green-500/20 overflow-y-auto max-h-[250px] flex-1">
                  <p className="text-sm text-dark-muted whitespace-pre-wrap break-words">
                    {evaluation.idealAnswer}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Cards */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {/* Strengths */}
            {evaluation.strengths && evaluation.strengths.length > 0 && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h5 className="font-semibold text-green-300">Strengths</h5>
                </div>
                <ul className="space-y-2">
                  {evaluation.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-dark-muted">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="break-words">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Concepts */}
            {evaluation.missingConcepts && evaluation.missingConcepts.length > 0 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <h5 className="font-semibold text-yellow-300">Missing Concepts</h5>
                </div>
                <ul className="space-y-2">
                  {evaluation.missingConcepts.map((concept, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-dark-muted">
                      <span className="text-yellow-400 flex-shrink-0">•</span>
                      <span className="break-words">{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {evaluation.suggestions && evaluation.suggestions.length > 0 && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-blue-400" />
                  <h5 className="font-semibold text-blue-300">Improvement Suggestions</h5>
                </div>
                <ul className="space-y-2">
                  {evaluation.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-dark-muted">
                      <span className="text-blue-400 flex-shrink-0">→</span>
                      <span className="break-words">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Toggle Comparison Button */}
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="w-full text-sm text-blue-400 hover:text-blue-300 text-center py-2"
          >
            {showComparison ? 'Hide' : 'Show'} Answer Comparison
          </button>
        </div>
      )}
    </div>
  )
}

export default AnswerEvaluation

