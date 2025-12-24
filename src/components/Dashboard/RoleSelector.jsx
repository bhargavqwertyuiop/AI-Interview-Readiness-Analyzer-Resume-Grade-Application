import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Server, 
  Code, 
  Cloud, 
  Settings,
  CheckCircle2
} from 'lucide-react'
import { initializeRoleData } from '../../data/roadmaps'

const ROLES = [
  { id: 'DevOps Engineer', icon: Settings, bgColor: 'bg-blue-600/20', iconColor: 'text-blue-400' },
  { id: 'Backend Engineer', icon: Server, bgColor: 'bg-green-600/20', iconColor: 'text-green-400' },
  { id: 'Frontend Engineer', icon: Code, bgColor: 'bg-purple-600/20', iconColor: 'text-purple-400' },
  { id: 'Cloud Engineer', icon: Cloud, bgColor: 'bg-orange-600/20', iconColor: 'text-orange-400' },
]

/**
 * Role selector component
 * Allows users to choose their target interview role
 */
function RoleSelector({ onSelect }) {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const handleSelect = (roleId) => {
    setSelected(roleId)
    // Initialize role data in localStorage
    initializeRoleData(roleId)
    // Set selected role
    onSelect(roleId)
    // Navigate to dashboard
    setTimeout(() => {
      navigate('/dashboard')
    }, 300)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {ROLES.map((role) => {
        const Icon = role.icon
        const isSelected = selected === role.id

        return (
          <button
            key={role.id}
            onClick={() => handleSelect(role.id)}
            className={`card text-left transition-all duration-300 hover:scale-105 ${
              isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${role.bgColor}`}>
                <Icon className={`w-8 h-8 ${role.iconColor}`} />
              </div>
              {isSelected && (
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">{role.id}</h3>
            <p className="text-dark-muted text-sm">
              Start tracking your preparation for {role.id} interviews
            </p>
          </button>
        )
      })}
    </div>
  )
}

export default RoleSelector

