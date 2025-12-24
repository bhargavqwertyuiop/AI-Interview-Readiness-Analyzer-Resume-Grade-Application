import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getTopicsByRole, initializeRoleData } from '../data/roadmaps'
import TopicCard from '../components/Topics/TopicCard'
import { ChevronLeft, CheckCircle2, Clock, Circle } from 'lucide-react'

/**
 * Topics page
 * Allows users to track readiness for each topic
 */
function Topics({ selectedRole }) {
  const [topics, setTopics] = useLocalStorage('topics', {})
  const [roleTopics, setRoleTopics] = useState([])
  const [filter, setFilter] = useState('all') // all, not-started, learning, confident
  const [selectedTopic, setSelectedTopic] = useState(null) // Track selected topic for full-page view

  useEffect(() => {
    if (selectedRole) {
      // Initialize if needed
      if (!topics[selectedRole]) {
        initializeRoleData(selectedRole)
      }

      // Load topics for this role
      const savedTopics = topics[selectedRole] || []
      if (savedTopics.length === 0) {
        // Initialize with default topics
        const defaultTopics = getTopicsByRole(selectedRole)
        setTopics(prev => ({
          ...prev,
          [selectedRole]: defaultTopics,
        }))
        setRoleTopics(defaultTopics)
      } else {
        setRoleTopics(savedTopics)
      }
    }
  }, [selectedRole])

  // Update roleTopics when topics change
  useEffect(() => {
    if (selectedRole && topics[selectedRole]) {
      setRoleTopics(topics[selectedRole])
    }
  }, [topics, selectedRole])

  const handleTopicUpdate = (topicId, updates) => {
    setTopics(prev => {
      const roleTopics = prev[selectedRole] || []
      const updatedTopics = roleTopics.map(topic => {
        if (topic.id === topicId) {
          // Preserve questions if they exist and aren't being updated
          const updatedTopic = {
            ...topic,
            ...updates,
            lastUpdated: new Date().toISOString(),
          }
          // If questions are being updated, merge them properly
          if (updates.questions !== undefined) {
            updatedTopic.questions = updates.questions
          }
          return updatedTopic
        }
        return topic
      })
      return {
        ...prev,
        [selectedRole]: updatedTopics,
      }
    })
  }

  const filteredTopics = roleTopics.filter(topic => {
    if (filter === 'all') return true
    if (filter === 'not-started') return topic.status === 'Not Started'
    if (filter === 'learning') return topic.status === 'Learning'
    if (filter === 'confident') return topic.status === 'Confident'
    return true
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confident':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'Learning':
        return <Clock className="w-5 h-5 text-yellow-400" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  // If a topic is selected, show full-page view
  if (selectedTopic) {
    return (
      <div className="w-full">
        {/* Back Button */}
        <button
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 md:mb-6 transition-colors text-sm md:text-base"
        >
          <ChevronLeft className="w-4 md:w-5 h-4 md:h-5" />
          Back to Topics
        </button>

        {/* Full Page Topic View */}
        <TopicCard
          topic={selectedTopic}
          role={selectedRole}
          onUpdate={(updates) => {
            handleTopicUpdate(selectedTopic.id, updates)
            setSelectedTopic(prev => ({ ...prev, ...updates }))
          }}
          isFullPage={true}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Topics</h1>
        <p className="text-dark-muted text-sm md:text-base">
          Track your readiness and confidence for each topic
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2 md:gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm font-medium ${filter === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-dark-surface text-dark-muted hover:bg-dark-border'
            }`}
        >
          All ({roleTopics.length})
        </button>
        <button
          onClick={() => setFilter('not-started')}
          className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm font-medium ${filter === 'not-started'
            ? 'bg-blue-600 text-white'
            : 'bg-dark-surface text-dark-muted hover:bg-dark-border'
            }`}
        >
          <span className="hidden sm:inline">Not Started</span>
          <span className="sm:hidden">Not Started</span> ({roleTopics.filter(t => t.status === 'Not Started').length})
        </button>
        <button
          onClick={() => setFilter('learning')}
          className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm font-medium ${filter === 'learning'
            ? 'bg-blue-600 text-white'
            : 'bg-dark-surface text-dark-muted hover:bg-dark-border'
            }`}
        >
          Learning ({roleTopics.filter(t => t.status === 'Learning').length})
        </button>
        <button
          onClick={() => setFilter('confident')}
          className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm font-medium ${filter === 'confident'
            ? 'bg-blue-600 text-white'
            : 'bg-dark-surface text-dark-muted hover:bg-dark-border'
            }`}
        >
          Confident ({roleTopics.filter(t => t.status === 'Confident').length})
        </button>
      </div>

      {/* Topics List */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-muted text-sm md:text-base">No topics found for the selected filter.</p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="w-full text-left p-4 md:p-6 card hover:shadow-lg hover:border-blue-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3 md:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    {getStatusIcon(topic.status)}
                    <h3 className="font-bold text-base md:text-xl group-hover:text-blue-400 transition-colors break-words">
                      {topic.name}
                    </h3>
                  </div>
                  <p className="text-dark-muted text-xs md:text-sm mb-2 md:mb-3 break-words line-clamp-2">
                    {topic.description || 'Master this essential skill for your role'}
                  </p>
                  <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    <span className="text-xs px-2 md:px-3 py-1 bg-dark-bg rounded text-dark-muted">
                      {topic.category}
                    </span>
                    <span className="text-xs text-dark-muted">
                      Confidence: {topic.confidence}/5
                    </span>
                    {topic.questions && topic.questions.length > 0 && (
                      <span className="text-xs px-2 md:px-3 py-1 bg-blue-600/20 text-blue-300 rounded">
                        {topic.questions.length} Q
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-2 md:ml-4 flex-shrink-0">
                  <div className="h-2 w-16 md:w-20 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${(topic.confidence / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-dark-muted text-right mt-1 md:mt-2">
                    {topic.status}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default Topics

