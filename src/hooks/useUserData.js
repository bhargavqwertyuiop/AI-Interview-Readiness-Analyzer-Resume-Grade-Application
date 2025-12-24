import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

/**
 * User Data Management Hook
 * Handles user-scoped data persistence for authenticated users
 */
export function useUserData() {
    const [userId, setUserId] = useLocalStorage('auth_user_id', null)
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    /**
     * Initialize user data structure
     */
    const initializeUserData = useCallback((user) => {
        const userDataKey = `user_data_${user.id}`

        // Check if user data already exists
        const existingData = localStorage.getItem(userDataKey)
        if (existingData) {
            setUserData(JSON.parse(existingData))
            return
        }

        // Create new user data structure
        const newUserData = {
            userId: user.id,
            profile: {
                name: user.name,
                email: user.email,
                avatarUrl: null,
                createdAt: new Date().toISOString(),
            },
            progress: {
                selectedRole: null,
                answeredQuestions: [],
                aiEvaluations: [],
                voiceInterviews: [],
                readinessScoreHistory: [],
                topicProgress: {}, // role -> { topicId -> { status, confidence, lastUpdated } }
                lastActiveAt: new Date().toISOString(),
            },
            preferences: {
                theme: 'dark',
                notifications: true,
                language: 'en',
            },
        }

        localStorage.setItem(userDataKey, JSON.stringify(newUserData))
        setUserData(newUserData)
    }, [])

    /**
     * Load user data for authenticated user
     */
    const loadUserData = useCallback((userId) => {
        setIsLoading(true)
        try {
            const userDataKey = `user_data_${userId}`
            const data = localStorage.getItem(userDataKey)
            if (data) {
                setUserData(JSON.parse(data))
                setUserId(userId)
            }
        } catch (error) {
            console.error('Error loading user data:', error)
        } finally {
            setIsLoading(false)
        }
    }, [setUserId])

    /**
     * Save user data to localStorage
     */
    const saveUserData = useCallback((newData) => {
        if (!userId) return

        try {
            const userDataKey = `user_data_${userId}`
            const updatedData = {
                ...userData,
                ...newData,
                progress: {
                    ...userData?.progress,
                    ...newData.progress,
                    lastActiveAt: new Date().toISOString(),
                },
            }
            localStorage.setItem(userDataKey, JSON.stringify(updatedData))
            setUserData(updatedData)
            return updatedData
        } catch (error) {
            console.error('Error saving user data:', error)
        }
    }, [userId, userData])

    /**
     * Update topic progress for selected role
     */
    const updateTopicProgress = useCallback((role, topicId, status, confidence) => {
        if (!userData) return

        const updatedData = {
            progress: {
                ...userData.progress,
                topicProgress: {
                    ...userData.progress.topicProgress,
                    [role]: {
                        ...(userData.progress.topicProgress[role] || {}),
                        [topicId]: {
                            status,
                            confidence,
                            lastUpdated: new Date().toISOString(),
                        },
                    },
                },
            },
        }

        saveUserData(updatedData)
    }, [userData, saveUserData])

    /**
     * Add answered question
     */
    const addAnsweredQuestion = useCallback((question, answer, evaluation) => {
        if (!userData) return

        const answeredQuestion = {
            id: `${Date.now()}_${Math.random()}`,
            question,
            answer,
            evaluation,
            timestamp: new Date().toISOString(),
        }

        const updatedData = {
            progress: {
                ...userData.progress,
                answeredQuestions: [
                    answeredQuestion,
                    ...userData.progress.answeredQuestions,
                ],
            },
        }

        saveUserData(updatedData)
        return answeredQuestion
    }, [userData, saveUserData])

    /**
     * Add AI evaluation result
     */
    const addEvaluation = useCallback((evaluation) => {
        if (!userData) return

        const evaluationRecord = {
            id: `${Date.now()}_${Math.random()}`,
            ...evaluation,
            timestamp: new Date().toISOString(),
        }

        const updatedData = {
            progress: {
                ...userData.progress,
                aiEvaluations: [evaluationRecord, ...userData.progress.aiEvaluations],
            },
        }

        saveUserData(updatedData)
        return evaluationRecord
    }, [userData, saveUserData])

    /**
     * Add voice interview session
     */
    const addVoiceInterview = useCallback((session) => {
        if (!userData) return

        const interviewRecord = {
            id: `${Date.now()}_${Math.random()}`,
            ...session,
            timestamp: new Date().toISOString(),
        }

        const updatedData = {
            progress: {
                ...userData.progress,
                voiceInterviews: [interviewRecord, ...userData.progress.voiceInterviews],
            },
        }

        saveUserData(updatedData)
        return interviewRecord
    }, [userData, saveUserData])

    /**
     * Update readiness score history
     */
    const updateReadinessScore = useCallback((score) => {
        if (!userData) return

        const scoreEntry = {
            score,
            date: new Date().toISOString(),
        }

        const updatedData = {
            progress: {
                ...userData.progress,
                readinessScoreHistory: [
                    scoreEntry,
                    ...userData.progress.readinessScoreHistory,
                ].slice(0, 90), // Keep last 90 days
            },
        }

        saveUserData(updatedData)
    }, [userData, saveUserData])

    /**
     * Update selected role
     */
    const setSelectedRole = useCallback((role) => {
        if (!userData) return

        const updatedData = {
            progress: {
                ...userData.progress,
                selectedRole: role,
            },
        }

        saveUserData(updatedData)
    }, [userData, saveUserData])

    /**
     * Get readiness score for selected role
     */
    const getReadinessScore = useCallback((role) => {
        if (!userData || !userData.progress.topicProgress[role]) {
            return 0
        }

        const topicProgress = userData.progress.topicProgress[role]
        const topics = Object.values(topicProgress)

        if (topics.length === 0) return 0

        const confidentCount = topics.filter(t => t.status === 'Confident').length
        const learningCount = topics.filter(t => t.status === 'Learning').length
        const notStartedCount = topics.filter(t => t.status === 'Not Started').length

        const score = ((confidentCount * 100 + learningCount * 50) / (topics.length * 100)) * 100
        return Math.round(score)
    }, [userData])

    /**
     * Clear all user data (logout)
     */
    const clearUserData = useCallback(() => {
        if (userId) {
            const userDataKey = `user_data_${userId}`
            localStorage.removeItem(userDataKey)
        }
        setUserData(null)
        setUserId(null)
    }, [userId, setUserId])

    return {
        userData,
        userId,
        isLoading,
        initializeUserData,
        loadUserData,
        saveUserData,
        updateTopicProgress,
        addAnsweredQuestion,
        addEvaluation,
        addVoiceInterview,
        updateReadinessScore,
        setSelectedRole,
        getReadinessScore,
        clearUserData,
    }
}
