import { useState, useEffect, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useNavigate } from 'react-router-dom'
import {
  Mic,
  MicOff,
  Play,
  Square,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import {
  speakText,
  stopSpeech,
  isTTSAvailable,
  isSTTAvailable,
  SpeechRecognitionService
} from '../utils/speechService'
import { evaluateAnswer, getAPIKey } from '../services/answerEvaluationService'
import { getTopicsByRole } from '../data/roadmaps'

/**
 * Voice Mock Interview Page
 * Conducts voice-based mock interviews with TTS and STT
 */
function VoiceMockInterview({ selectedRole }) {
  const navigate = useNavigate()
  const [topics] = useLocalStorage('topics', {})
  const [voiceInterviews, setVoiceInterviews] = useLocalStorage('voiceInterviews', [])

  const [difficulty, setDifficulty] = useState('Medium')
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [interviewState, setInterviewState] = useState('setup') // 'setup' | 'in-progress' | 'completed'
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [timer, setTimer] = useState(0)
  const [evaluations, setEvaluations] = useState([])
  const [interviewSummary, setInterviewSummary] = useState(null)

  const recognitionRef = useRef(null)
  const timerIntervalRef = useRef(null)

  // Check browser support
  const ttsAvailable = isTTSAvailable()
  const sttAvailable = isSTTAvailable()

  // Load questions on mount and when difficulty changes
  useEffect(() => {
    if (selectedRole) {
      loadQuestions()
    }
  }, [selectedRole, difficulty])

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopSpeech()
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (interviewState === 'in-progress') {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [interviewState])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const loadQuestions = () => {
    if (!selectedRole) return

    const roleTopics = topics[selectedRole] || []
    const allQuestions = []

    roleTopics.forEach(topic => {
      if (topic.questions && topic.questions.length > 0) {
        topic.questions.forEach(q => {
          if (q.difficulty === difficulty || difficulty === 'All') {
            allQuestions.push({
              ...q,
              topicName: topic.name,
              topicCategory: topic.category,
            })
          }
        })
      }
    })

    // Shuffle and select 5-8 questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5)
    setSelectedQuestions(shuffled.slice(0, Math.min(8, shuffled.length)))
  }

  const startInterview = () => {
    if (selectedQuestions.length === 0) {
      alert('No questions available for the selected difficulty. Please add questions first.')
      return
    }

    if (!ttsAvailable || !sttAvailable) {
      alert('Voice features are not available in your browser. Please use Chrome or Edge.')
      return
    }

    setInterviewState('in-progress')
    setCurrentQuestionIndex(0)
    setTimer(0)
    setEvaluations([])
    askQuestion(0)
  }

  const askQuestion = async (index) => {
    if (index >= selectedQuestions.length) {
      endInterview()
      return
    }

    const question = selectedQuestions[index]
    setIsSpeaking(true)

    try {
      await speakText(`Question ${index + 1}. ${question.question}`)
      setIsSpeaking(false)

      // Start listening for answer
      startListening()
    } catch (error) {
      console.error('Error speaking:', error)
      setIsSpeaking(false)
    }
  }

  const startListening = () => {
    try {
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognitionService()

        recognitionRef.current.onTranscriptUpdate = (text) => {
          setTranscript(text)
        }

        recognitionRef.current.onFinalTranscript = async (finalText) => {
          if (finalText.trim()) {
            await handleAnswer(finalText.trim())
          }
        }

        recognitionRef.current.onError = (error) => {
          console.error('Recognition error:', error)
          setIsListening(false)
        }
      }

      setTranscript('')
      setIsListening(true)
      recognitionRef.current.start()
    } catch (error) {
      console.error('Error starting recognition:', error)
      alert('Failed to start speech recognition. Please check your microphone permissions.')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleAnswer = async (answerText) => {
    stopListening()

    const currentQuestion = selectedQuestions[currentQuestionIndex]

    // Evaluate answer using AI
    try {
      const apiKey = getAPIKey()
      if (!apiKey) {
        throw new Error('OpenAI API key is required for evaluation')
      }

      const evaluation = await evaluateAnswer({
        question: currentQuestion.question,
        userAnswer: answerText,
        role: selectedRole,
        difficulty: currentQuestion.difficulty,
        apiKey,
      })

      const evaluationData = {
        question: currentQuestion,
        userAnswer: answerText,
        evaluation,
        timestamp: new Date().toISOString(),
      }

      setEvaluations(prev => [...prev, evaluationData])

      // Move to next question after a short delay
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1
        setCurrentQuestionIndex(nextIndex)
        setTranscript('')
        if (nextIndex < selectedQuestions.length) {
          askQuestion(nextIndex)
        } else {
          endInterview()
        }
      }, 2000)
    } catch (error) {
      console.error('Evaluation error:', error)
      // Continue even if evaluation fails
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      setTranscript('')
      if (nextIndex < selectedQuestions.length) {
        askQuestion(nextIndex)
      } else {
        endInterview()
      }
    }
  }

  const endInterview = () => {
    stopSpeech()
    stopListening()
    setInterviewState('completed')

    // Calculate summary
    const avgScore = evaluations.length > 0
      ? evaluations.reduce((sum, e) => sum + (e.evaluation?.score || 0), 0) / evaluations.length
      : 0

    const summary = {
      role: selectedRole,
      difficulty,
      totalQuestions: selectedQuestions.length,
      answeredQuestions: evaluations.length,
      averageScore: avgScore,
      evaluations,
      duration: timer,
      completedAt: new Date().toISOString(),
    }

    setInterviewSummary(summary)

    // Save to LocalStorage
    const newInterview = {
      id: Date.now().toString(),
      ...summary,
    }
    setVoiceInterviews(prev => [...prev, newInterview])
  }

  const resetInterview = () => {
    stopSpeech()
    stopListening()
    setInterviewState('setup')
    setCurrentQuestionIndex(0)
    setTimer(0)
    setTranscript('')
    setEvaluations([])
    setInterviewSummary(null)
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex]

  return (
    <div className="w-full max-w-6xl mx-auto px-3 md:px-0">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => navigate('/mock-interviews')}
          className="flex items-center gap-2 text-dark-muted hover:text-dark-text mb-4 transition-colors text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Mock Interviews
        </button>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Voice Mock Interview</h1>
        <p className="text-dark-muted text-sm md:text-base">
          Practice answering interview questions using voice
        </p>
      </div>

      {/* Browser Support Check */}
      {(!ttsAvailable || !sttAvailable) && (
        <div className="mb-6 p-3 md:p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-start gap-2 md:gap-3">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs md:text-sm font-medium text-yellow-300 mb-1">
                Browser Compatibility
              </p>
              <p className="text-xs text-dark-muted">
                Voice features work best in Chrome or Edge browsers.
                {!ttsAvailable && ' Text-to-Speech is not available.'}
                {!sttAvailable && ' Speech-to-Text is not available.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Setup Screen */}
      {interviewState === 'setup' && (
        <div className="card">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Interview Setup</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value)
                  loadQuestions()
                }}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 md:py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="All">All Levels</option>
              </select>
            </div>

            <div className="p-3 md:p-4 bg-dark-bg rounded-lg border border-dark-border">
              <p className="text-xs md:text-sm text-dark-muted mb-2">
                Available Questions: {selectedQuestions.length}
              </p>
              <p className="text-xs text-dark-muted">
                The interview will include 5-8 questions based on your question bank.
              </p>
            </div>

            <button
              onClick={() => {
                loadQuestions()
                if (selectedQuestions.length === 0) {
                  alert('No questions found. Please add questions to your topics first.')
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
            >
              Load Questions
            </button>

            {selectedQuestions.length > 0 && (
              <button
                onClick={startInterview}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Mic className="w-4 h-4 md:w-5 md:h-5" />
                Start Voice Interview
              </button>
            )}
          </div>
        </div>
      )}

      {/* Interview In Progress */}
      {interviewState === 'in-progress' && currentQuestion && (
        <div className="space-y-4 md:space-y-6">
          {/* Timer and Controls */}
          <div className="card">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  <span className="text-lg md:text-xl font-bold">{formatTime(timer)}</span>
                </div>
                <div className="text-xs md:text-sm text-dark-muted">
                  Question {currentQuestionIndex + 1} of {selectedQuestions.length}
                </div>
              </div>
              <button
                onClick={endInterview}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Square className="w-4 h-4" />
                End Interview
              </button>
            </div>
          </div>

          {/* Current Question */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Current Question</h3>
            <div className="p-4 bg-dark-bg rounded-lg border border-dark-border mb-4">
              <p className="text-lg">{currentQuestion.question}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-300 rounded">
                  {currentQuestion.difficulty}
                </span>
                <span className="text-xs text-dark-muted">
                  {currentQuestion.topicCategory} • {currentQuestion.topicName}
                </span>
              </div>
            </div>

            {/* Speaking Indicator */}
            {isSpeaking && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span className="text-sm text-blue-300">Asking question...</span>
                </div>
              </div>
            )}

            {/* Listening Indicator */}
            {isListening && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-green-400 animate-pulse" />
                  <span className="text-sm text-green-300">Listening...</span>
                </div>
              </div>
            )}

            {/* Live Transcript */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Your Answer (Live Transcript)</label>
              <div className="p-4 bg-dark-bg rounded-lg border border-dark-border min-h-[100px]">
                {transcript ? (
                  <p className="text-sm text-dark-muted whitespace-pre-wrap">{transcript}</p>
                ) : (
                  <p className="text-sm text-dark-muted italic">
                    {isListening ? 'Speak your answer...' : 'Waiting for question...'}
                  </p>
                )}
              </div>
            </div>

            {/* Manual Controls */}
            <div className="flex gap-3">
              {!isListening && !isSpeaking && (
                <button
                  onClick={() => askQuestion(currentQuestionIndex)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Replay Question
                </button>
              )}
              {isListening && (
                <button
                  onClick={stopListening}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <MicOff className="w-4 h-4" />
                  Stop Recording
                </button>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="card">
            <h4 className="text-sm font-medium mb-2">Progress</h4>
            <div className="space-y-2">
              {selectedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded ${idx < currentQuestionIndex
                      ? 'bg-green-500/20 border border-green-500/30'
                      : idx === currentQuestionIndex
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : 'bg-dark-bg border border-dark-border'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {idx < currentQuestionIndex && <CheckCircle2 className="w-4 h-4 text-green-400 inline mr-2" />}
                      Question {idx + 1}
                    </span>
                    {idx < currentQuestionIndex && evaluations[idx] && (
                      <span className="text-xs text-dark-muted">
                        Score: {evaluations[idx].evaluation?.score?.toFixed(1)}/10
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interview Summary */}
      {interviewState === 'completed' && interviewSummary && (
        <InterviewSummary
          summary={interviewSummary}
          onReset={resetInterview}
          onBack={() => navigate('/mock-interviews')}
        />
      )}
    </div>
  )
}

/**
 * Interview Summary Component
 */
function InterviewSummary({ summary, onReset, onBack }) {
  const avgScore = summary.averageScore

  return (
    <div className="space-y-6">
      <div className="card bg-green-500/10 border-green-500/30">
        <div className="text-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Interview Completed!</h2>
          <p className="text-dark-muted">
            Duration: {Math.floor(summary.duration / 60)}m {summary.duration % 60}s
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-dark-bg rounded-lg">
            <p className="text-2xl font-bold">{summary.answeredQuestions}</p>
            <p className="text-sm text-dark-muted">Questions Answered</p>
          </div>
          <div className="text-center p-4 bg-dark-bg rounded-lg">
            <p className={`text-2xl font-bold ${avgScore >= 8 ? 'text-green-400' : avgScore >= 6 ? 'text-yellow-400' : 'text-red-400'
              }`}>
              {avgScore.toFixed(1)}/10
            </p>
            <p className="text-sm text-dark-muted">Average Score</p>
          </div>
          <div className="text-center p-4 bg-dark-bg rounded-lg">
            <p className="text-2xl font-bold">{summary.difficulty}</p>
            <p className="text-sm text-dark-muted">Difficulty Level</p>
          </div>
        </div>
      </div>

      {/* Detailed Evaluations */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Question-by-Question Feedback</h3>
        <div className="space-y-4">
          {summary.evaluations.map((evalData, idx) => (
            <div key={idx} className="p-4 bg-dark-bg rounded-lg border border-dark-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium mb-1">Question {idx + 1}</p>
                  <p className="text-sm text-dark-muted mb-2">
                    {evalData.question.question}
                  </p>
                  <p className="text-sm text-dark-muted italic mb-2">
                    Your Answer: "{evalData.userAnswer}"
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-lg text-sm font-medium ${evalData.evaluation.score >= 8
                    ? 'bg-green-500/20 text-green-300'
                    : evalData.evaluation.score >= 6
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                  {evalData.evaluation.score.toFixed(1)}/10
                </div>
              </div>

              {evalData.evaluation.strengths && evalData.evaluation.strengths.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-green-300 mb-1">Strengths:</p>
                  <ul className="text-xs text-dark-muted space-y-1">
                    {evalData.evaluation.strengths.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evalData.evaluation.suggestions && evalData.evaluation.suggestions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-blue-300 mb-1">Suggestions:</p>
                  <ul className="text-xs text-dark-muted space-y-1">
                    {evalData.evaluation.suggestions.map((s, i) => (
                      <li key={i}>→ {s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-dark-surface hover:bg-dark-border text-dark-muted px-6 py-3 rounded-lg transition-colors"
        >
          Back to Mock Interviews
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Start New Interview
        </button>
      </div>
    </div>
  )
}

export default VoiceMockInterview

