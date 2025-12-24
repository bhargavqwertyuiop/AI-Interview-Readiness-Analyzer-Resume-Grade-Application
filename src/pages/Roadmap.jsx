import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ROADMAPS } from '../data/roadmaps'
import { ChevronDown, ChevronRight, CheckCircle2, Clock, Circle } from 'lucide-react'

/**
 * Roadmap page
 * Displays skill categories and topics in a hierarchical view
 */
function Roadmap({ selectedRole }) {
  const [topics] = useLocalStorage('topics', {})
  const [expandedCategories, setExpandedCategories] = useState({})
  const [roleTopics, setRoleTopics] = useState([])

  useEffect(() => {
    if (selectedRole) {
      const roadmap = ROADMAPS[selectedRole]
      if (roadmap) {
        // Merge with saved topic data
        const savedTopics = topics[selectedRole] || []
        const topicMap = new Map(savedTopics.map(t => [t.id, t]))

        const allTopics = []
        roadmap.categories.forEach((category) => {
          category.topics.forEach((topicName) => {
            const topicId = `${category.name}-${topicName}`.toLowerCase().replace(/\s+/g, '-')
            const savedTopic = topicMap.get(topicId)

            allTopics.push({
              id: topicId,
              name: topicName,
              category: category.name,
              status: savedTopic?.status || 'Not Started',
              confidence: savedTopic?.confidence || 1,
              notes: savedTopic?.notes || '',
              lastUpdated: savedTopic?.lastUpdated || null,
            })
          })
        })

        setRoleTopics(allTopics)

        // Expand all categories by default
        const expanded = {}
        roadmap.categories.forEach(cat => {
          expanded[cat.name] = true
        })
        setExpandedCategories(expanded)
      }
    }
  }, [selectedRole, topics])

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }))
  }

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

  const getStatusBadge = (status) => {
    const baseClasses = 'badge'
    switch (status) {
      case 'Confident':
        return `${baseClasses} badge-confident`
      case 'Learning':
        return `${baseClasses} badge-learning`
      default:
        return `${baseClasses} badge-not-started`
    }
  }

  const roadmap = ROADMAPS[selectedRole]
  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-dark-muted">No roadmap available for this role.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 md:px-0">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Learning Roadmap</h1>
        <p className="text-dark-muted text-sm md:text-base">
          Complete overview of skills and topics for {selectedRole}
        </p>
      </div>

      {/* Roadmap Categories */}
      <div className="space-y-3 md:space-y-4">
        {roadmap.categories.map((category) => {
          const categoryTopics = roleTopics.filter(t => t.category === category.name)
          const isExpanded = expandedCategories[category.name]

          // Calculate category progress
          const total = categoryTopics.length
          const confident = categoryTopics.filter(t => t.status === 'Confident').length
          const learning = categoryTopics.filter(t => t.status === 'Learning').length
          const progress = total > 0 ? ((confident + learning * 0.5) / total) * 100 : 0

          return (
            <div key={category.name} className="card">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center justify-between gap-3 mb-4"
              >
                <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-dark-muted flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-dark-muted flex-shrink-0" />
                  )}
                  <div className="flex-1 text-left min-w-0">
                    <h2 className="text-lg md:text-xl font-bold mb-1 truncate">{category.name}</h2>
                    <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-dark-muted flex-wrap">
                      <span>{total} topics</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{confident} confident</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{learning} learning</span>
                    </div>
                  </div>
                </div>
                <div className="w-20 md:w-32 flex-shrink-0">
                  <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Topics List */}
              {isExpanded && (
                <div className="space-y-2 pl-6 md:pl-9">
                  {categoryTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between gap-2 p-2 md:p-3 bg-dark-bg rounded-lg border border-dark-border flex-wrap"
                    >
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        {getStatusIcon(topic.status)}
                        <span className="font-medium text-sm md:text-base truncate">{topic.name}</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm flex-wrap justify-end">
                        <span className={getStatusBadge(topic.status)}>
                          {topic.status}
                        </span>
                        <span className="text-dark-muted hidden sm:inline">
                          {topic.confidence}/5
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Roadmap

