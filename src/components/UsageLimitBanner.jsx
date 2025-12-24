import { AlertCircle, Crown, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

/**
 * Usage Limit Banner Component
 * Shows when user is approaching or has reached usage limits
 */
function UsageLimitBanner({ feature, usageInfo, onDismiss }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !usageInfo || usageInfo.allowed) return null

  const handleDismiss = () => {
    setDismissed(true)
    if (onDismiss) onDismiss()
  }

  return (
    <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg relative">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-yellow-500/20 rounded transition-colors"
      >
        <X className="w-4 h-4 text-yellow-400" />
      </button>
      
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-300 mb-1">
            Usage Limit Reached
          </p>
          <p className="text-xs text-dark-muted mb-3">
            You've used {usageInfo.used} of {usageInfo.limit} {feature} this month. 
            Upgrade to Pro for unlimited access.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Crown className="w-3 h-3" />
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UsageLimitBanner

