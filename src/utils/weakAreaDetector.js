/**
 * Detect weak areas automatically
 * Identifies topics that need more attention
 * 
 * @param {Array} topics - Array of topic objects
 * @returns {Array} - Array of weak area objects with suggestions
 */
export function getWeakAreas(topics) {
  if (!topics || topics.length === 0) return []

  const weakAreas = []

  // Find topics with low confidence (1-2)
  const lowConfidenceTopics = topics.filter(
    t => t.confidence <= 2 && t.status !== 'Confident'
  )

  lowConfidenceTopics.forEach((topic) => {
    weakAreas.push({
      topic: topic.name,
      category: topic.category,
      reason: 'Low confidence',
      suggestion: `Focus on ${topic.name} fundamentals. Review core concepts and practice related problems.`,
    })
  })

  // Find topics not started
  const notStartedTopics = topics.filter(t => t.status === 'Not Started')
  if (notStartedTopics.length > 0) {
    // Group by category
    const byCategory = {}
    notStartedTopics.forEach((topic) => {
      if (!byCategory[topic.category]) {
        byCategory[topic.category] = []
      }
      byCategory[topic.category].push(topic.name)
    })

    // Add suggestions for each category with multiple not-started topics
    Object.entries(byCategory).forEach(([category, topicNames]) => {
      if (topicNames.length >= 2) {
        weakAreas.push({
          topic: `${category} - Multiple Topics`,
          category: category,
          reason: 'Not started',
          suggestion: `Start learning ${topicNames.slice(0, 2).join(' and ')}. These are foundational topics for ${category}.`,
        })
      } else if (topicNames.length === 1) {
        weakAreas.push({
          topic: topicNames[0],
          category: category,
          reason: 'Not started',
          suggestion: `Begin your preparation for ${topicNames[0]}. Start with the basics and build up.`,
        })
      }
    })
  }

  // Find topics in "Learning" status with low confidence
  const learningLowConfidence = topics.filter(
    t => t.status === 'Learning' && t.confidence <= 2
  )

  learningLowConfidence.forEach((topic) => {
    weakAreas.push({
      topic: topic.name,
      category: topic.category,
      reason: 'Needs revision',
      suggestion: `Revise ${topic.name} concepts. You're learning but confidence is still low.`,
    })
  })

  // Limit to top 5 weak areas
  return weakAreas.slice(0, 5)
}

