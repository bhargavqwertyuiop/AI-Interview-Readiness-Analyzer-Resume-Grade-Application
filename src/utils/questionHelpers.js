/**
 * Helper utilities for question management
 */

/**
 * Check if a question is a duplicate
 * @param {string} questionText - The question text to check
 * @param {Array} existingQuestions - Array of existing question objects
 * @returns {boolean} - True if duplicate exists
 */
export function isDuplicateQuestion(questionText, existingQuestions) {
  if (!existingQuestions || existingQuestions.length === 0) return false
  
  const normalizedText = questionText.toLowerCase().trim()
  return existingQuestions.some(
    q => q.question.toLowerCase().trim() === normalizedText
  )
}

/**
 * Get question statistics for a topic
 * @param {Array} questions - Array of question objects
 * @returns {Object} - Statistics object
 */
export function getQuestionStats(questions) {
  if (!questions || questions.length === 0) {
    return {
      total: 0,
      confident: 0,
      practicing: 0,
      notAttempted: 0,
      aiGenerated: 0,
      manual: 0,
      byDifficulty: {
        Easy: 0,
        Medium: 0,
        Hard: 0,
      },
    }
  }

  return {
    total: questions.length,
    confident: questions.filter(q => q.status === 'Confident').length,
    practicing: questions.filter(q => q.status === 'Practicing').length,
    notAttempted: questions.filter(q => q.status === 'Not Attempted').length,
    aiGenerated: questions.filter(q => q.source === 'AI').length,
    manual: questions.filter(q => q.source === 'manual' || !q.source).length,
    byDifficulty: {
      Easy: questions.filter(q => q.difficulty === 'Easy').length,
      Medium: questions.filter(q => q.difficulty === 'Medium').length,
      Hard: questions.filter(q => q.difficulty === 'Hard').length,
    },
  }
}

/**
 * Filter questions by various criteria
 * @param {Array} questions - Array of question objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered questions
 */
export function filterQuestions(questions, filters = {}) {
  let filtered = [...questions]

  if (filters.status) {
    filtered = filtered.filter(q => q.status === filters.status)
  }

  if (filters.difficulty) {
    filtered = filtered.filter(q => q.difficulty === filters.difficulty)
  }

  if (filters.source) {
    filtered = filtered.filter(q => q.source === filters.source)
  }

  if (filters.searchText) {
    const searchLower = filters.searchText.toLowerCase()
    filtered = filtered.filter(q =>
      q.question.toLowerCase().includes(searchLower) ||
      (q.notes && q.notes.toLowerCase().includes(searchLower))
    )
  }

  return filtered
}

