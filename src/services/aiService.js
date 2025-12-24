/**
 * AI Service for generating interview questions
 * Uses OpenAI API to generate contextually relevant interview questions
 */

const OPENAI_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

/**
 * Generate interview questions using OpenAI API
 * @param {Object} params - Generation parameters
 * @param {string} params.role - Target role (e.g., "DevOps Engineer")
 * @param {string} params.topic - Topic name (e.g., "Docker Basics")
 * @param {string} params.difficulty - Difficulty level ("Easy", "Medium", "Hard")
 * @param {number} params.count - Number of questions to generate (3-10)
 * @param {string} params.apiKey - OpenAI API key
 * @returns {Promise<Array>} - Array of generated questions
 */
export async function generateInterviewQuestions({ role, topic, difficulty, count, apiKey }) {
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please set VITE_OPENAI_API_KEY in your environment variables.')
  }

  // Design the prompt for generating realistic interview questions
  const prompt = `You are an expert technical interviewer specializing in ${role} roles.

Generate exactly ${count} interview questions for the role of ${role} on the topic: "${topic}".

Difficulty Level: ${difficulty}
- Easy: Fundamental concepts, basic understanding
- Medium: Practical application, problem-solving scenarios
- Hard: Deep technical knowledge, system design, edge cases

Requirements:
1. Questions should be realistic and commonly asked in actual technical interviews
2. Questions should be specific to ${topic} within the context of ${role}
3. Questions should increase in depth and complexity based on difficulty level
4. Each question should be clear, concise, and answerable
5. Avoid overly generic questions - be specific to the topic
6. Format each question as a standalone sentence ending with a question mark

Return ONLY a JSON array of question strings, no additional text or formatting.
Example format: ["Question 1?", "Question 2?", "Question 3?"]`

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'nex-agi/deepseek-v3.1-nex-n1:free', // Using GPT-3.5 for cost efficiency, can upgrade to gpt-4 if needed
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates technical interview questions. Always respond with valid JSON arrays only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7, // Balance between creativity and consistency
        max_tokens: 1000,
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
    // Sometimes the API returns markdown code blocks, so we need to clean it
    let cleanedContent = content.trim()
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/```\n?/g, '')
    }

    let questions
    try {
      questions = JSON.parse(cleanedContent)
    } catch (parseError) {
      // If JSON parsing fails, try to extract questions from text
      // Sometimes the API returns questions in a list format
      const questionMatches = cleanedContent.match(/\d+[\.\)]\s*["']?([^"'\n]+[?])["']?/gi)
      if (questionMatches && questionMatches.length > 0) {
        questions = questionMatches.map(match => {
          const question = match.replace(/^\d+[\.\)]\s*["']?/i, '').replace(/["']?\s*$/i, '').trim()
          return question.endsWith('?') ? question : question + '?'
        })
      } else {
        throw new Error('Failed to parse questions from API response. Please try again.')
      }
    }

    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format: expected an array of questions')
    }

    // Validate and clean questions
    const validQuestions = questions
      .filter(q => typeof q === 'string' && q.trim().length > 0)
      .map(q => q.trim())
      .slice(0, count) // Ensure we don't exceed requested count

    if (validQuestions.length === 0) {
      throw new Error('No valid questions were generated')
    }

    return validQuestions
  } catch (error) {
    // Re-throw with more context if it's not already an Error object
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Failed to generate questions: ${error.message || error}`)
  }
}

/**
 * Check if OpenAI API key is configured
 * @returns {boolean}
 */
export function isAIAvailable() {
  return !!import.meta.env.VITE_OPENAI_API_KEY
}

/**
 * Get OpenAI API key from environment variables
 * @returns {string|null}
 */
export function getAPIKey() {
  return import.meta.env.VITE_OPENAI_API_KEY || null
}

