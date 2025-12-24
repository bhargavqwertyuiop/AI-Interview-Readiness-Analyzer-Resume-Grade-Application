import { useState } from 'react'
import { X } from 'lucide-react'

/**
 * Schedule Mock Interview Modal
 * Allows users to schedule a new mock interview
 */
function ScheduleMockModal({ onClose, onSchedule }) {
  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    type: 'Technical',
    notes: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Combine date and time
    const dateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
    
    if (dateTime < new Date()) {
      alert('Please select a future date and time')
      return
    }

    onSchedule({
      scheduledDate: dateTime.toISOString(),
      type: formData.type,
      notes: formData.notes,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Schedule Mock Interview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-muted" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              required
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Interview Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Technical">Technical</option>
              <option value="System Design">System Design</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Coding Challenge">Coding Challenge</option>
              <option value="Full Interview">Full Interview</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes or preparation reminders..."
              rows="3"
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-dark-bg hover:bg-dark-border text-dark-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScheduleMockModal

