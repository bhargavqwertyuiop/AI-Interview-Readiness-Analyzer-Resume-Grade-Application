import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

/**
 * Weekly Activity Chart
 * Shows preparation activity over the last 7 days
 */
function WeeklyActivityChart({ topics }) {
  // Calculate activity for last 7 days
  const now = new Date()
  const days = []
  const activity = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    days.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
    
    // Count topics updated on this day
    const count = topics.filter((topic) => {
      if (!topic.lastUpdated) return false
      const updatedDate = new Date(topic.lastUpdated).toISOString().split('T')[0]
      return updatedDate === dateStr
    }).length
    
    activity.push(count)
  }

  const chartData = {
    labels: days,
    datasets: [
      {
        label: 'Topics Updated',
        data: activity,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
            const count = context.parsed.y
            return `${count} topic${count !== 1 ? 's' : ''} updated`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default WeeklyActivityChart

