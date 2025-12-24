/**
 * AI Answer Evaluation Service
 * Evaluates user answers against ideal answers using OpenAI API
 */

const OPENAI_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

/**
 * Evaluate a user's answer to an interview question
 * @param {Object} params - Evaluation parameters
 * @param {string} params.question - The interview question
 * @param {string} params.userAnswer - User's answer
 * @param {string} params.role - Target role (e.g., "DevOps Engineer")
 * @param {string} params.difficulty - Question difficulty level
 * @param {string} params.apiKey - OpenAI API key
 * @returns {Promise<Object>} - Evaluation result with score, feedback, and ideal answer
 */
export async function evaluateAnswer({ question, userAnswer, role, difficulty, apiKey }) {
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please set VITE_OPENAI_API_KEY in your environment variables.')
  }

  if (!userAnswer || userAnswer.trim().length === 0) {
    throw new Error('Please provide an answer before evaluation.')
  }

  const prompt = `You are an expert technical interviewer specializing in ${role} roles.

Question: "${question}"
Difficulty: ${difficulty}

User's Answer:
"${userAnswer}"

Your task:
1. Generate an ideal/reference answer for this question (comprehensive, accurate, well-structured)
2. Evaluate the user's answer on a scale of 0-10
3. Identify specific strengths in the user's answer
4. Identify missing concepts or areas for improvement
5. Provide actionable improvement suggestions

Return your response as a JSON object with the following structure:
{
  "idealAnswer": "The ideal answer text here...",
  "score": 7.5,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "missingConcepts": ["Missing concept 1", "Missing concept 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}

Guidelines:
- Score should be between 0-10 (can include decimals)
- Be constructive and encouraging
- Identify at least 2-3 strengths if possible
- Be specific about missing concepts
- Provide actionable, specific suggestions
- The ideal answer should be comprehensive but concise
- Consider the difficulty level when evaluating`

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b:free',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful technical interview coach. Always respond with valid JSON only, no additional text or formatting.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error?.message ||
        `API request failed with status ${response.status}`
      )
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from API')
    }

    // Parse the JSON response
    let cleanedContent = content.trim()
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/```\n?/g, '')
    }

    const evaluation = JSON.parse(cleanedContent)

    // Validate structure
    if (!evaluation.idealAnswer || typeof evaluation.score !== 'number') {
      throw new Error('Invalid evaluation format received from API')
    }

    // Ensure score is within bounds
    evaluation.score = Math.max(0, Math.min(10, evaluation.score))

    // Ensure arrays exist
    evaluation.strengths = evaluation.strengths || []
    evaluation.missingConcepts = evaluation.missingConcepts || []
    evaluation.suggestions = evaluation.suggestions || []

    return evaluation
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Failed to evaluate answer: ${error.message || error}`)
  }
}

/**
 * Check if answer evaluation is available
 * @returns {boolean}
 */
export function isEvaluationAvailable() {
  return !!import.meta.env.VITE_OPENAI_API_KEY
}

/**
 * Get OpenAI API key from environment variables
 * @returns {string|null}
 */
export function getAPIKey() {
  return import.meta.env.VITE_OPENAI_API_KEY || null
}

