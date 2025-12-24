import User from '../models/User.js';
import { generateTokens, verifyRefreshToken } from '../middleware/auth.js';

// @desc    User signup
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        // Create user
        const user = new User({
            name,
            email,
            passwordHash: password,
        });

        await user.save();

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            accessToken,
            user: userResponse,
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message,
        });
    }
};

// @desc    User login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Check for user (include password field for comparison)
        const user = await User.findOne({ email }).select('+passwordHash');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check password match
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        return res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            accessToken,
            user: userResponse,
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message,
        });
    }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token required',
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token',
            });
        }

        // Get user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

        // Set new refresh token as httpOnly cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error refreshing token',
            error: error.message,
        });
    }
};

// @desc    User logout
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    try {
        // Clear refresh token cookie
        res.clearCookie('refreshToken');

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error logging out',
            error: error.message,
        });
    }
};
