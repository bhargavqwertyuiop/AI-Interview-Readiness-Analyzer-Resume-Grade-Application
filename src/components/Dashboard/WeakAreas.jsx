import { AlertTriangle, ArrowRight } from 'lucide-react'

/**
 * Weak Areas component
 * Displays automatically detected weak areas with suggestions
 */
function WeakAreas({ areas }) {
  if (areas.length === 0) {
    return (
      <div className="card bg-green-500/10 border-green-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-600/20">
            <AlertTriangle className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-green-300">Great Progress!</h3>
            <p className="text-sm text-dark-muted">
              No weak areas detected. Keep up the excellent work!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-red-500/10 border-red-500/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-red-600/20">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Focus Areas</h2>
          <p className="text-sm text-dark-muted">
            Topics that need more attention
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {areas.map((area, index) => (
          <div
            key={index}
            className="p-4 bg-dark-bg rounded-lg border border-dark-border flex items-start justify-between"
          >
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{area.topic}</h3>
              <p className="text-sm text-dark-muted">{area.suggestion}</p>
              {area.category && (
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-dark-surface rounded">
                  {area.category}
                </span>
              )}
            </div>
            <ArrowRight className="w-5 h-5 text-dark-muted ml-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeakAreas

