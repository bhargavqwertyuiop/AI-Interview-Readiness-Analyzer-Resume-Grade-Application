import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, LogOut, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuthNew';
import { userAPI, tokenUtils } from '../services/api';
import ReadinessScore from '../components/Dashboard/ReadinessScore';
import QuickStats from '../components/Dashboard/QuickStats';
import RoleSelector from '../components/Dashboard/RoleSelector';
import WeakAreas from '../components/Dashboard/WeakAreas';

/**
 * Dashboard Page with Backend Data Integration
 * Fetches and displays real user progress from backend
 */
function DashboardNew() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [metrics, setMetrics] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);

    // Fetch dashboard metrics on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Check if user is authenticated
            if (!tokenUtils.isTokenValid()) {
                navigate('/login');
                return;
            }

            const response = await userAPI.getDashboardMetrics();

            if (response.success) {
                setMetrics(response.metrics);

                // Extract recent activities from answers
                if (response.metrics.recentAnswers && response.metrics.recentAnswers.length > 0) {
                    setRecentActivities(
                        response.metrics.recentAnswers.map((answer) => ({
                            id: answer._id,
                            type: 'question',
                            title: answer.question,
                            score: answer.aiScore,
                            timestamp: answer.createdAt,
                        }))
                    );
                }
            } else {
                throw new Error(response.message || 'Failed to fetch dashboard data');
            }
        } catch (err) {
            console.error('Dashboard error:', err);
            setError(err.message || 'Failed to load dashboard');

            // If unauthorized, redirect to login
            if (err.status === 401) {
                tokenUtils.clearTokens();
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
            navigate('/login');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-white mb-4">Error Loading Dashboard</h2>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            fetchDashboardData();
                        }}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Welcome, {user?.name || 'User'}!
                    </h1>
                    <p className="text-slate-400">Track your interview readiness journey</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Left Column - Readiness Score and Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Readiness Score */}
                    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Overall Readiness</h2>
                        <div className="flex items-center gap-6">
                            <div className="flex-shrink-0">
                                <ReadinessScore score={metrics?.overallReadinessScore || 0} size="lg" />
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-400 text-sm mb-3">Based on your recent answers</p>
                                <p className="text-slate-300">
                                    You're making great progress! Keep practicing to improve your score.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <QuickStats stats={metrics} />

                    {/* Weak Areas */}
                    <WeakAreas selectedRole={selectedRole} />
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Role Selector */}
                    <RoleSelector selectedRole={selectedRole} onRoleSelect={setSelectedRole} />

                    {/* Recent Activity */}
                    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                        {recentActivities.length > 0 ? (
                            <div className="space-y-3">
                                {recentActivities.slice(0, 5).map((activity) => (
                                    <div key={activity.id} className="p-3 bg-slate-700/50 rounded-lg">
                                        <p className="text-slate-300 text-sm truncate">{activity.title}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-slate-500 text-xs">
                                                {new Date(activity.timestamp).toLocaleDateString()}
                                            </span>
                                            {activity.score && (
                                                <span className="text-blue-400 font-semibold">{activity.score}/100</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">No recent activity yet. Start practicing!</p>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">Account Info</h4>
                        <p className="text-blue-300 text-xs mb-1">
                            <strong>Email:</strong> {user?.email}
                        </p>
                        <p className="text-blue-300 text-xs">
                            <strong>Member Since:</strong> {new Date(user?.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Learning Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                    <p className="text-slate-500 text-sm mb-2">Questions Answered</p>
                    <p className="text-3xl font-bold text-white">{metrics?.totalQuestionsAnswered || 0}</p>
                </div>
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                    <p className="text-slate-500 text-sm mb-2">Mock Interviews</p>
                    <p className="text-3xl font-bold text-white">{metrics?.totalMockInterviews || 0}</p>
                </div>
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                    <p className="text-slate-500 text-sm mb-2">Learning Minutes</p>
                    <p className="text-3xl font-bold text-white">{metrics?.totalLearningMinutes || 0}</p>
                </div>
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                    <p className="text-slate-500 text-sm mb-2">Average Score</p>
                    <p className="text-3xl font-bold text-white">{Math.round(metrics?.averageScore || 0)}</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardNew;
