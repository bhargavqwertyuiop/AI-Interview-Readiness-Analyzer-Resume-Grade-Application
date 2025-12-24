import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

/**
 * Topics Progress Chart
 * Shows distribution of topics by status
 */
function TopicsProgressChart({ confident, learning, notStarted }) {
  const total = confident + learning + notStarted

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-dark-muted">
        <p>No topics tracked yet.</p>
      </div>
    )
  }

  const chartData = {
    labels: ['Confident', 'Learning', 'Not Started'],
    datasets: [
      {
        data: [confident, learning, notStarted],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(251, 191, 36)',
          'rgb(107, 114, 128)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#f1f5f9',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  return (
    <div style={{ height: '300px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  )
}

export default TopicsProgressChart

