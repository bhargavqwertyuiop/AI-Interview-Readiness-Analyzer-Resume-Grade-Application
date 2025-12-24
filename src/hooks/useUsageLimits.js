import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useAuth } from './useAuth'

/**
 * Usage Limits Hook
 * Tracks AI feature usage and enforces limits based on plan
 */
export function useUsageLimits() {
  const { user } = useAuth()
  const [usage, setUsage] = useLocalStorage('usage_limits', {
    aiQuestionsGenerated: 0,
    aiEvaluations: 0,
    voiceInterviews: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
  })

  // Reset usage monthly for free plan
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    if (usage.lastResetDate !== today) {
      const lastReset = new Date(usage.lastResetDate)
      const now = new Date(today)
      const daysDiff = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24))
      
      // Reset monthly (every 30 days)
      if (daysDiff >= 30) {
        setUsage({
          aiQuestionsGenerated: 0,
          aiEvaluations: 0,
          voiceInterviews: 0,
          lastResetDate: today,
        })
      }
    }
  }, [usage.lastResetDate])

  const plan = user?.plan || 'free'
  const limits = {
    free: {
      aiQuestionsGenerated: 20, // per month
      aiEvaluations: 30, // per month
      voiceInterviews: 5, // per month
    },
    pro: {
      aiQuestionsGenerated: Infinity,
      aiEvaluations: Infinity,
      voiceInterviews: Infinity,
    },
  }

  const currentLimits = limits[plan]

  const canUseFeature = (feature) => {
    if (plan === 'pro') return { allowed: true, remaining: Infinity }
    
    const featureMap = {
      aiQuestions: 'aiQuestionsGenerated',
      aiEvaluations: 'aiEvaluations',
      voiceInterviews: 'voiceInterviews',
    }
    
    const usageKey = featureMap[feature]
    const used = usage[usageKey] || 0
    const limit = currentLimits[usageKey]
    const remaining = Math.max(0, limit - used)
    
    return {
      allowed: used < limit,
      remaining,
      limit,
      used,
    }
  }

  const recordUsage = (feature) => {
    if (plan === 'pro') return // No limits for pro
    
    const featureMap = {
      aiQuestions: 'aiQuestionsGenerated',
      aiEvaluations: 'aiEvaluations',
      voiceInterviews: 'voiceInterviews',
    }
    
    const usageKey = featureMap[feature]
    if (usageKey) {
      setUsage(prev => ({
        ...prev,
        [usageKey]: (prev[usageKey] || 0) + 1,
      }))
    }
  }

  return {
    plan,
    usage,
    limits: currentLimits,
    canUseFeature,
    recordUsage,
    isPro: plan === 'pro',
  }
}

