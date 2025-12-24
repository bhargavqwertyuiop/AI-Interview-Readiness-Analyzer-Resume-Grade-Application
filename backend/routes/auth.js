import express from 'express';
import { signup, login, logout, refreshToken } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);

export default router;
