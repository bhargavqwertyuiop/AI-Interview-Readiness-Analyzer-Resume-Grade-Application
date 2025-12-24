# Interview Readiness Analyzer

A comprehensive web application to help you measure, track, and improve your technical interview preparedness using data, analytics, and insights.

![Interview Readiness Analyzer](https://img.shields.io/badge/React-18.2-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8) ![Vite](https://img.shields.io/badge/Vite-5.0-646cff)

## 🎯 Features

### Core Functionality

- **Role-Based Roadmaps**: Choose from 4 target roles (DevOps, Backend, Frontend, Cloud Engineer) with predefined skill roadmaps
- **Topic Readiness Tracker**: Track your preparation status (Not Started, Learning, Confident) for each topic
- **Confidence Scoring**: Rate your confidence level (1-5) for each topic
- **Interview Readiness Score**: Automatic calculation of overall readiness (0-100%) based on:
  - Topics marked as "Confident" (30% weight)
  - Average confidence levels (30% weight)
  - Question bank confidence (20% weight)
  - Preparation consistency (20% weight)
- **Question Bank**: Add and track interview questions per topic with difficulty levels and status
- **AI-Powered Question Generation**: Generate interview questions using OpenAI API
  - Select difficulty (Easy/Medium/Hard)
  - Choose number of questions (3-10)
  - Preview and select questions before saving
  - Automatic duplicate detection
- **Weak Area Detection**: Automatically identifies topics needing more attention
- **Mock Interview Planner**: Schedule and track mock interviews with countdown timers
- **Analytics Dashboard**: Visualize your progress with interactive charts:
  - Readiness score trends over time
  - Confidence levels by category
  - Topics progress distribution
  - Weekly activity tracking
- **PDF Export**: Generate professional interview readiness reports

### Technical Features

- **Dark Theme UI**: Professional, developer-friendly interface
- **LocalStorage Persistence**: All data persists across browser sessions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant feedback and score recalculation

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- OpenAI API key (optional, for AI question generation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd interview-readiness-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up OpenAI API key for AI question generation:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
   - Get your API key from: https://platform.openai.com/api-keys
   - Note: The app works without this, but AI question generation will be disabled

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## 🌐 Deployment

This application is compatible with:

- **Netlify**: Connect your repository and deploy automatically
- **Vercel**: Import your project and deploy with zero configuration
- **Azure Static Web Apps**: Deploy via GitHub Actions or Azure CLI

### Netlify Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

## 📁 Project Structure

```
interview-readiness-analyzer/
├── src/
│   ├── components/
│   │   ├── Analytics/          # Chart components
│   │   ├── Dashboard/          # Dashboard widgets
│   │   ├── Layout/             # Sidebar, navigation
│   │   ├── MockInterviews/     # Mock interview components
│   │   └── Topics/             # Topic tracking components
│   ├── data/
│   │   └── roadmaps.js         # Role roadmaps and topics
│   ├── hooks/
│   │   └── useLocalStorage.js  # LocalStorage hook
│   ├── pages/
│   │   ├── Analytics.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MockInterviews.jsx
│   │   ├── Roadmap.jsx
│   │   └── Topics.jsx
│   ├── utils/
│   │   ├── readinessCalculator.js
│   │   └── weakAreaDetector.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Tech Stack

- **Frontend Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router DOM 6.20
- **Charts**: Chart.js 4.4 + react-chartjs-2 5.2
- **Icons**: Lucide React
- **AI Integration**: OpenAI API (GPT-3.5-turbo)
- **PDF Generation**: jsPDF 2.5
- **Storage**: LocalStorage (browser)

## 📊 Data Models

### Topics Structure
```javascript
{
  id: string,
  name: string,
  category: string,
  status: 'Not Started' | 'Learning' | 'Confident',
  confidence: number (1-5),
  notes: string,
  questions: Array<Question>, // Optional question bank
  lastUpdated: ISO string
}
```

### Question Structure
```javascript
{
  id: string,
  question: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  status: 'Not Attempted' | 'Practicing' | 'Confident',
  notes: string,
  source: 'manual' | 'AI', // Indicates if question was AI-generated
  lastUpdated: ISO string
}
```

### Mock Interview Structure
```javascript
{
  id: string,
  role: string,
  scheduledDate: ISO string,
  type: string,
  notes: string,
  completed: boolean,
  feedback: string,
  createdAt: ISO string,
  completedAt: ISO string (optional)
}
```

## 🎯 Usage Guide

1. **Select Your Role**: Choose your target interview role on the dashboard
2. **Review Roadmap**: Explore the complete skill roadmap for your role
3. **Track Topics**: Update status and confidence for each topic as you prepare
4. **Schedule Mocks**: Plan mock interviews to practice
5. **Monitor Progress**: Use the Analytics page to track your improvement
6. **Focus on Weak Areas**: Review suggestions for topics needing attention

## 🤖 AI Question Generation

The app includes AI-powered question generation using OpenAI's API. To use this feature:

1. **Get an OpenAI API Key**:
   - Sign up at https://platform.openai.com
   - Navigate to API Keys section
   - Create a new secret key

2. **Configure the API Key**:
   - Create a `.env` file in the project root
   - Add: `VITE_OPENAI_API_KEY=your_key_here`
   - Restart the dev server

3. **Use AI Generation**:
   - Go to Topics page
   - Select a topic
   - Click "Questions" tab
   - Click "Generate with AI"
   - Select difficulty and number of questions
   - Review and select questions to save

**Note**: AI generation uses GPT-3.5-turbo for cost efficiency. The feature gracefully degrades if no API key is configured.

## 🔧 Customization

### Adding New Roles

Edit `src/data/roadmaps.js` to add new roles and their skill categories:

```javascript
export const ROADMAPS = {
  'Your Role': {
    categories: [
      {
        name: 'Category Name',
        topics: ['Topic 1', 'Topic 2', ...]
      }
    ]
  }
}
```

### Modifying Score Calculation

Edit `src/utils/readinessCalculator.js` to adjust the scoring algorithm weights.

### Customizing AI Prompts

Edit `src/services/aiService.js` to modify the prompt used for generating questions.

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for job seekers preparing for technical interviews**

