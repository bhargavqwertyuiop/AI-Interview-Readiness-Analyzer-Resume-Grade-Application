import jwt from 'jsonwebtoken';

// Middleware to protect routes - verify JWT token
export const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};

// Generate JWT tokens
export const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || '15m',
    });

    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    });

    return { accessToken, refreshToken };
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
};
