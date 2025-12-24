/**
 * Readiness Score component
 * Displays circular progress indicator with color-coded readiness level
 */
function ReadinessScore({ score }) {
  // Determine color based on score
  const getColor = () => {
    if (score >= 71) return 'text-green-500'
    if (score >= 41) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getBgColor = () => {
    if (score >= 71) return 'bg-green-500/20 border-green-500/30'
    if (score >= 41) return 'bg-yellow-500/20 border-yellow-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  const getLevel = () => {
    if (score >= 71) return 'Ready'
    if (score >= 41) return 'Getting There'
    return 'Needs Work'
  }

  // Calculate stroke-dasharray for circular progress
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className={`card ${getBgColor()}`}>
      <h2 className="text-xl font-bold mb-6">Interview Readiness Score</h2>
      
      <div className="flex items-center justify-center gap-12">
        {/* Circular Progress */}
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-48 h-48">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-dark-border"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={`${getColor()} transition-all duration-500`}
            />
          </svg>
          {/* Score text in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold ${getColor()}`}>
              {Math.round(score)}
            </span>
            <span className="text-sm text-dark-muted">%</span>
            <span className="text-xs text-dark-muted mt-1">{getLevel()}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-dark-muted mb-1">Status</p>
              <p className={`text-lg font-semibold ${getColor()}`}>
                {getLevel()}
              </p>
            </div>
            <div>
              <p className="text-sm text-dark-muted mb-1">Score Breakdown</p>
              <p className="text-sm">
                Based on your topic confidence levels and preparation status
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReadinessScore

