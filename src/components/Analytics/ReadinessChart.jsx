import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

/**
 * Readiness Score Trend Chart
 * Shows readiness score over time
 */
function ReadinessChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-dark-muted">
        <p>No data available yet. Start tracking your topics to see trends!</p>
      </div>
    )
  }

  const chartData = {
    labels: data.map((entry) => {
      const date = new Date(entry.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Readiness Score',
        data: data.map((entry) => entry.score),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
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
            return `Score: ${context.parsed.y.toFixed(1)}%`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          callback: function (value) {
            return value + '%'
          },
        },
      },
    },
  }

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default ReadinessChart

