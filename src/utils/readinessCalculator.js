import { getQuestionConfidenceFactor } from '../data/questionBank'

/**
 * Calculate interview readiness score (0-100)
 * Based on:
 * - Topics marked as "Confident" (weight: 30%)
 * - Average confidence levels (weight: 30%)
 * - Question bank confidence (weight: 20%)
 * - Preparation consistency (weight: 20%)
 * 
 * @param {Array} topics - Array of topic objects
 * @returns {number} - Readiness score (0-100)
 */
export function calculateReadinessScore(topics) {
  if (!topics || topics.length === 0) return 0

  // 1. Percentage of topics marked as "Confident" (30% weight)
  const confidentCount = topics.filter(t => t.status === 'Confident').length
  const confidentPercentage = (confidentCount / topics.length) * 100
  const confidentScore = (confidentPercentage / 100) * 30

  // 2. Average confidence level (30% weight)
  // Confidence is 1-5, normalize to 0-100
  const totalConfidence = topics.reduce((sum, t) => sum + (t.confidence || 1), 0)
  const avgConfidence = totalConfidence / topics.length
  const normalizedConfidence = ((avgConfidence - 1) / 4) * 100 // Convert 1-5 to 0-100
  const confidenceScore = (normalizedConfidence / 100) * 30

  // 3. Question bank confidence (15% weight) + Answer evaluations (5% weight)
  // Calculate average question confidence across all topics
  let totalQuestionFactor = 0
  let topicsWithQuestions = 0
  let totalEvaluationScore = 0
  let evaluatedQuestionsCount = 0
  
  topics.forEach(topic => {
    if (topic.questions && topic.questions.length > 0) {
      const questionFactor = getQuestionConfidenceFactor(topic.questions)
      totalQuestionFactor += questionFactor
      topicsWithQuestions++

      // Calculate evaluation scores for this topic's questions
      topic.questions.forEach(question => {
        if (question.evaluation && question.evaluation.score !== undefined) {
          totalEvaluationScore += question.evaluation.score
          evaluatedQuestionsCount++
        }
      })
    }
  })
  
  // If some topics have questions, use their average; otherwise use neutral 0.5
  const avgQuestionFactor = topicsWithQuestions > 0 
    ? totalQuestionFactor / topicsWithQuestions 
    : 0.5 // Neutral if no questions
  
  const questionScore = (avgQuestionFactor * 100) * 0.15

  // Answer evaluation score (5% weight)
  // Average evaluation score normalized to 0-100 (scores are 0-10, so multiply by 10)
  const avgEvaluationScore = evaluatedQuestionsCount > 0
    ? (totalEvaluationScore / evaluatedQuestionsCount) * 10 // Convert 0-10 to 0-100
    : 0
  
  const evaluationScore = (avgEvaluationScore / 100) * 0.05

  // 4. Preparation consistency (20% weight)
  // Check how many topics have been updated recently (within last 7 days)
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const recentlyUpdated = topics.filter(t => {
    if (!t.lastUpdated) return false
    const updatedDate = new Date(t.lastUpdated)
    return updatedDate >= sevenDaysAgo
  }).length
  
  const consistencyPercentage = (recentlyUpdated / topics.length) * 100
  const consistencyScore = (consistencyPercentage / 100) * 20

  // Total score
  const totalScore = confidentScore + confidenceScore + questionScore + evaluationScore + consistencyScore

  return Math.min(100, Math.max(0, totalScore))
}

