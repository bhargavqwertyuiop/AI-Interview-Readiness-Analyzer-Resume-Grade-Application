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
 * Confidence by Category Chart
 * Shows average confidence level for each category
 */
function ConfidenceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-dark-muted">
        <p>No data available yet.</p>
      </div>
    )
  }

  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        label: 'Average Confidence',
        data: data.map((item) => item.avgConfidence),
        backgroundColor: data.map((_, index) => {
          const colors = [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(34, 197, 94, 0.8)',
          ]
          return colors[index % colors.length]
        }),
        borderColor: data.map((_, index) => {
          const colors = [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(139, 92, 246)',
            'rgb(236, 72, 153)',
            'rgb(251, 146, 60)',
            'rgb(34, 197, 94)',
          ]
          return colors[index % colors.length]
        }),
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
            return `Avg Confidence: ${context.parsed.y.toFixed(2)}/5`
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
        min: 0,
        max: 5,
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

export default ConfidenceChart

