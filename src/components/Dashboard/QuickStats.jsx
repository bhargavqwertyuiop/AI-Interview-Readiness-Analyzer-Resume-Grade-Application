import { BookOpen, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

/**
 * Quick Stats component
 * Shows overview statistics about topics
 */
function QuickStats({ stats }) {
  const statItems = [
    {
      label: 'Total Topics',
      value: stats.totalTopics,
      icon: BookOpen,
      bgColor: 'bg-blue-600/20',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Confident',
      value: stats.confident,
      icon: CheckCircle2,
      bgColor: 'bg-green-600/20',
      iconColor: 'text-green-400',
    },
    {
      label: 'Learning',
      value: stats.learning,
      icon: Clock,
      bgColor: 'bg-yellow-600/20',
      iconColor: 'text-yellow-400',
    },
    {
      label: 'Not Started',
      value: stats.notStarted,
      icon: AlertCircle,
      bgColor: 'bg-red-600/20',
      iconColor: 'text-red-400',
    },
  ]

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-6">Quick Stats</h2>
      <div className="space-y-4">
        {statItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="flex items-center justify-between p-3 bg-dark-bg rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <span className="text-sm text-dark-muted">{item.label}</span>
              </div>
              <span className="text-xl font-bold">{item.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default QuickStats

