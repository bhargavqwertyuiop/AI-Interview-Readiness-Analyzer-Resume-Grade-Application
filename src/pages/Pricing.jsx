import { Link } from 'react-router-dom'
import { CheckCircle2, Crown, ArrowRight, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useUsageLimits } from '../hooks/useUsageLimits'

/**
 * Pricing Page
 * Shows pricing plans and features
 */
function Pricing() {
  const { user, upgradeToPro, downgradeToFree } = useAuth()
  const { isPro, plan } = useUsageLimits()

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '20 AI question generations per month',
        '30 AI answer evaluations per month',
        '5 voice mock interviews per month',
        'All core features',
        'PDF report export',
        'Analytics dashboard',
        'Question bank management',
      ],
      cta: 'Current Plan',
      current: plan === 'free',
      action: null,
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'per month',
      description: 'For serious interview preparation',
      features: [
        'Unlimited AI question generations',
        'Unlimited AI answer evaluations',
        'Unlimited voice mock interviews',
        'Priority support',
        'Advanced analytics',
        'All Free features',
        'Early access to new features',
      ],
      cta: isPro ? 'Current Plan' : 'Upgrade to Pro',
      current: isPro,
      action: isPro ? null : () => upgradeToPro(),
      highlight: true,
    },
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-dark-muted hover:text-dark-text mb-6 md:mb-8 transition-colors text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Simple, Transparent Pricing</h1>
          <p className="text-base md:text-xl text-dark-muted px-2">
            Choose the plan that works best for your interview preparation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {plans.map((planItem, index) => (
            <div
              key={index}
              className={`card relative ${planItem.highlight
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : ''
                }`}
            >
              {planItem.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1 whitespace-nowrap">
                    <Crown className="w-3 h-3 md:w-4 md:h-4" />
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{planItem.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl md:text-4xl font-bold">{planItem.price}</span>
                  <span className="text-xs md:text-base text-dark-muted">/{planItem.period}</span>
                </div>
                <p className="text-xs md:text-sm text-dark-muted">{planItem.description}</p>
              </div>

              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {planItem.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 md:gap-3">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs md:text-sm text-dark-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              {planItem.current ? (
                <div className="w-full bg-green-500/20 border border-green-500/30 text-green-300 px-4 md:px-6 py-2 md:py-3 rounded-lg text-center font-medium text-sm md:text-base">
                  Current Plan
                </div>
              ) : planItem.action ? (
                <button
                  onClick={planItem.action}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {planItem.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-full bg-dark-bg border border-dark-border text-dark-muted px-4 md:px-6 py-2 md:py-3 rounded-lg text-center font-medium text-sm md:text-base">
                  {planItem.cta}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-16 text-center">
          <p className="text-dark-muted mb-3 md:mb-4 text-sm md:text-base">
            All plans include a 14-day free trial of Pro features
          </p>
          <p className="text-xs md:text-sm text-dark-muted">
            Questions? <Link to="/contact" className="text-blue-400 hover:text-blue-300">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Pricing

