/**
 * Question Bank Data Structure
 * 
 * Each topic can have multiple questions with:
 * - id: unique identifier
 * - question: question text
 * - difficulty: 'Easy' | 'Medium' | 'Hard'
 * - status: 'Not Attempted' | 'Practicing' | 'Confident'
 * - notes: user notes/answer
 * - lastUpdated: ISO date string
 */

/**
 * Get default questions for a topic
 * This can be expanded with actual interview questions
 * @param {string} topicName - Name of the topic
 * @param {string} category - Category of the topic
 * @returns {Array} - Array of default questions
 */
export function getDefaultQuestionsForTopic(topicName, category) {
  // Return empty array by default - users can add their own questions
  // In a production app, you might want to pre-populate with common interview questions
  return []
}

/**
 * Calculate question bank progress for a topic
 * @param {Array} questions - Array of question objects
 * @returns {Object} - Progress statistics
 */
export function calculateQuestionProgress(questions) {
  if (!questions || questions.length === 0) {
    return {
      total: 0,
      confident: 0,
      practicing: 0,
      notAttempted: 0,
      progressPercentage: 0,
    }
  }

  const confident = questions.filter(q => q.status === 'Confident').length
  const practicing = questions.filter(q => q.status === 'Practicing').length
  const notAttempted = questions.filter(q => q.status === 'Not Attempted').length

  return {
    total: questions.length,
    confident,
    practicing,
    notAttempted,
    progressPercentage: questions.length > 0 
      ? ((confident + practicing * 0.5) / questions.length) * 100 
      : 0,
  }
}

/**
 * Calculate average question confidence for readiness score
 * @param {Array} questions - Array of question objects
 * @returns {number} - Average confidence (0-1 scale)
 */
export function getQuestionConfidenceFactor(questions) {
  if (!questions || questions.length === 0) return 0.5 // Neutral if no questions

  const statusWeights = {
    'Confident': 1.0,
    'Practicing': 0.5,
    'Not Attempted': 0.0,
  }

  const totalWeight = questions.reduce((sum, q) => {
    return sum + (statusWeights[q.status] || 0)
  }, 0)

  return totalWeight / questions.length
}

