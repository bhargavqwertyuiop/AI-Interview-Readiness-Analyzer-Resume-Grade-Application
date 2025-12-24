import express from 'express';
import {
    getUserProfile,
    getUserProgress,
    submitAnswer,
    saveMockInterviewSession,
    getDashboardMetrics,
    getMockInterviewSessions,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/profile', getUserProfile);
router.get('/progress', getUserProgress);
router.post('/answer', submitAnswer);
router.post('/mock-interview', saveMockInterviewSession);
router.get('/dashboard-metrics', getDashboardMetrics);
router.get('/mock-interviews', getMockInterviewSessions);

export default router;
