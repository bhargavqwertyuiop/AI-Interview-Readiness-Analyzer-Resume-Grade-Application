import User from '../models/User.js';
import InterviewProgress from '../models/InterviewProgress.js';
import MockInterviewSession from '../models/MockInterviewSession.js';
import mongoose from 'mongoose';

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        return res.status(200).json({
            success: true,
            user: userResponse,
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message,
        });
    }
};

// @desc    Get user progress and analytics
// @route   GET /api/user/progress
// @access  Private
export const getUserProgress = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;

        const progress = await InterviewProgress.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const totalCount = await InterviewProgress.countDocuments({ userId: req.userId });

        return res.status(200).json({
            success: true,
            progress,
            totalCount,
            limit: parseInt(limit),
            skip: parseInt(skip),
        });
    } catch (error) {
        console.error('Get progress error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching progress',
            error: error.message,
        });
    }
};

// @desc    Submit user answer for evaluation
// @route   POST /api/user/answer
// @access  Private
export const submitAnswer = async (req, res) => {
    try {
        const { questionId, question, userAnswer, role, difficulty, timeSpent } = req.body;

        if (!questionId || !question || !userAnswer) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Save the answer
        const progress = new InterviewProgress({
            userId: req.userId,
            questionId,
            question,
            userAnswer,
            role,
            difficulty,
            timeSpent,
            createdAt: new Date(),
        });

        await progress.save();

        // TODO: Call OpenAI API for evaluation and update the progress record

        return res.status(201).json({
            success: true,
            message: 'Answer submitted successfully',
            progress,
        });
    } catch (error) {
        console.error('Submit answer error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error submitting answer',
            error: error.message,
        });
    }
};

// @desc    Save mock interview session
// @route   POST /api/user/mock-interview
// @access  Private
export const saveMockInterviewSession = async (req, res) => {
    try {
        const {
            role,
            difficulty,
            duration,
            questionsAsked,
            questionsAnswered,
            overallScore,
            interviewTranscript,
            aiFeedback,
        } = req.body;

        if (!role || !duration) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        const session = new MockInterviewSession({
            userId: req.userId,
            role,
            difficulty,
            duration,
            questionsAsked,
            questionsAnswered,
            overallScore,
            interviewTranscript,
            aiFeedback,
        });

        await session.save();

        // Update user usage stats
        const user = await User.findById(req.userId);
        user.usageStats.mockInterviewsCompleted += 1;
        user.usageStats.totalLearningMinutes += Math.round(duration / 60);
        await user.save();

        return res.status(201).json({
            success: true,
            message: 'Mock interview session saved successfully',
            session,
        });
    } catch (error) {
        console.error('Save mock interview error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error saving mock interview session',
            error: error.message,
        });
    }
};

// @desc    Get dashboard metrics
// @route   GET /api/user/dashboard-metrics
// @access  Private
export const getDashboardMetrics = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        // Get recent answers
        const recentAnswers = await InterviewProgress.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(10);

        // Get recent mock interviews
        const recentMockInterviews = await MockInterviewSession.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(5);

        // Calculate average score
        const avgScoreData = await InterviewProgress.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
            { $group: { _id: null, avgScore: { $avg: '$aiScore' } } },
        ]);

        const averageScore = avgScoreData[0]?.avgScore || 0;

        // Calculate readiness score (weighted average)
        let readinessScore = 0;
        if (recentAnswers.length > 0) {
            const validScores = recentAnswers
                .filter(a => a.aiScore !== undefined && a.aiScore !== null)
                .map(a => a.aiScore);

            if (validScores.length > 0) {
                readinessScore = Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
            }
        }

        // Update user's readiness score
        user.overallReadinessScore = readinessScore;
        await user.save();

        // Get progress by week
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const weeklyProgress = await InterviewProgress.find({
            userId: req.userId,
            createdAt: { $gte: oneWeekAgo },
        });

        return res.status(200).json({
            success: true,
            metrics: {
                overallReadinessScore: readinessScore,
                totalQuestionsAnswered: user.usageStats.questionsAnswered,
                totalMockInterviews: user.usageStats.mockInterviewsCompleted,
                totalLearningMinutes: user.usageStats.totalLearningMinutes,
                averageScore,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                recentAnswers: recentAnswers.slice(0, 5),
                recentMockInterviews: recentMockInterviews.slice(0, 5),
                weeklyProgressCount: weeklyProgress.length,
            },
        });
    } catch (error) {
        console.error('Get dashboard metrics error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching dashboard metrics',
            error: error.message,
        });
    }
};

// @desc    Get mock interview sessions
// @route   GET /api/user/mock-interviews
// @access  Private
export const getMockInterviewSessions = async (req, res) => {
    try {
        const { limit = 10, skip = 0 } = req.query;

        const sessions = await MockInterviewSession.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const totalCount = await MockInterviewSession.countDocuments({ userId: req.userId });

        return res.status(200).json({
            success: true,
            sessions,
            totalCount,
            limit: parseInt(limit),
            skip: parseInt(skip),
        });
    } catch (error) {
        console.error('Get mock interviews error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching mock interviews',
            error: error.message,
        });
    }
};
