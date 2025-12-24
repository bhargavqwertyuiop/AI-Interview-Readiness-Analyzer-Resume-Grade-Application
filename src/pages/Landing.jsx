import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Sparkles,
  Mic,
  BarChart3,
  FileText,
  Target,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react'

/**
 * Landing Page Component
 * Professional SaaS-style landing page
 */
function Landing({ onGetStarted }) {
  const features = [
    {
      icon: Target,
      title: 'Track Your Progress',
      description: 'Monitor your interview readiness with detailed analytics and progress tracking.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Questions',
      description: 'Generate interview questions tailored to your role and difficulty level.',
    },
    {
      icon: Mic,
      title: 'Voice Mock Interviews',
      description: 'Practice with voice-based interviews using speech recognition.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Visualize your preparation with charts and insights.',
    },
    {
      icon: FileText,
      title: 'PDF Reports',
      description: 'Export professional readiness reports for your portfolio.',
    },
    {
      icon: CheckCircle2,
      title: 'Answer Evaluation',
      description: 'Get AI feedback on your answers with detailed scoring.',
    },
  ]

  const benefits = [
    'Role-specific roadmaps for DevOps, Backend, Frontend, and Cloud roles',
    'Question bank with difficulty levels and progress tracking',
    'AI-generated questions and answer evaluations',
    'Voice-based mock interview practice',
    'Comprehensive analytics and progress visualization',
    'Exportable PDF reports for documentation',
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navigation */}
      <nav className="border-b border-dark-border bg-dark-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-base md:text-xl font-bold text-white truncate">Interview Ready</span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                to="/login"
                className="text-dark-muted hover:text-dark-text transition-colors text-sm md:text-base"
              >
                Sign In
              </Link>
              <button
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-6 py-2 rounded-lg transition-colors text-sm md:text-base"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600/20 border border-blue-600/30 rounded-full mb-4 md:mb-6 text-xs md:text-sm">
            <Zap className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
            <span className="text-blue-300">AI-Powered Interview Preparation</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Master Your Technical Interviews
          </h1>

          <p className="text-base md:text-xl text-dark-muted mb-6 md:mb-8 leading-relaxed px-2">
            Track your progress, practice with AI-generated questions, and get detailed feedback
            to ace your next technical interview.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-medium transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Free
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <Link
              to="/demo"
              className="w-full sm:w-auto bg-dark-surface hover:bg-dark-border text-dark-text px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-medium transition-colors border border-dark-border text-center"
            >
              View Demo
            </Link>
          </div>

          <p className="text-xs md:text-sm text-dark-muted mt-4 md:mt-6">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Everything You Need to Succeed</h2>
          <p className="text-base md:text-xl text-dark-muted px-2">
            Comprehensive tools for technical interview preparation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="card hover:scale-105 transition-transform duration-300"
              >
                <div className="p-3 bg-blue-600/20 rounded-lg w-fit mb-3 md:mb-4">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-dark-muted">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 bg-dark-surface/50 rounded-2xl md:rounded-3xl my-10 md:my-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
              Prepare Smarter, Not Harder
            </h2>
            <p className="text-base md:text-lg text-dark-muted mb-6 md:mb-8">
              Our platform helps you focus on what matters most - understanding concepts
              and practicing answers. Let AI handle the rest.
            </p>
            <ul className="space-y-3 md:space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 md:gap-3">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs md:text-base text-dark-muted">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="card bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30 p-6 md:p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="p-2 md:p-3 bg-blue-600/30 rounded-lg flex-shrink-0">
                    <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold">Readiness Score</h3>
                    <p className="text-xs md:text-base text-dark-muted">Track your progress</p>
                  </div>
                </div>
                <div className="text-center py-6 md:py-8">
                  <div className="text-4xl md:text-6xl font-bold text-blue-400 mb-2">85%</div>
                  <p className="text-sm md:text-base text-dark-muted">Interview Ready</p>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
                  <div className="text-center p-2 md:p-3 bg-dark-bg rounded-lg">
                    <div className="text-xl md:text-2xl font-bold text-green-400">42</div>
                    <div className="text-xs text-dark-muted">Confident</div>
                  </div>
                  <div className="text-center p-3 bg-dark-bg rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">18</div>
                    <div className="text-xs text-dark-muted">Learning</div>
                  </div>
                  <div className="text-center p-3 bg-dark-bg rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">120</div>
                    <div className="text-xs text-dark-muted">Questions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 text-center">
        <div className="card bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Ace Your Interview?</h2>
          <p className="text-xl text-dark-muted mb-8">
            Join thousands of developers preparing for their dream jobs
          </p>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-lg font-medium transition-all hover:scale-105 flex items-center gap-2 mx-auto"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-dark-muted mt-6">
            No credit card required • Start tracking your progress today
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border mt-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Interview Ready</span>
              </div>
              <p className="text-sm text-dark-muted">
                AI-powered interview preparation platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li><Link to="/pricing" className="hover:text-dark-text">Pricing</Link></li>
                <li><button onClick={onGetStarted} className="hover:text-dark-text">Demo</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li><Link to="/docs" className="hover:text-dark-text">Documentation</Link></li>
                <li><Link to="/blog" className="hover:text-dark-text">Blog</Link></li>
                <li><Link to="/support" className="hover:text-dark-text">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-dark-muted">
                <li><Link to="/about" className="hover:text-dark-text">About</Link></li>
                <li><Link to="/contact" className="hover:text-dark-text">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-border mt-8 pt-8 text-center text-sm text-dark-muted">
            <p>&copy; 2024 Interview Ready. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing

