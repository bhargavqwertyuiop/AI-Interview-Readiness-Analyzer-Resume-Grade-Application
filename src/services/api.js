// API configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'APIError';
    }
}

// Helper to make authenticated requests
const makeRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include', // Include cookies for refresh token
        });

        const data = await response.json();

        if (!response.ok) {
            // If unauthorized and have refresh token, attempt refresh
            if (response.status === 401 && localStorage.getItem('refreshToken')) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    // Retry original request
                    return makeRequest(endpoint, options);
                }
            }

            throw new APIError(data.message || 'API request failed', response.status);
        }

        return data;
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError(error.message, 500);
    }
};

// Refresh access token
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return false;

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
            credentials: 'include',
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('accessToken', data.accessToken);
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }
            return true;
        }

        return false;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
    }
};

// Auth API calls
export const authAPI = {
    signup: (name, email, password) =>
        makeRequest('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        }),

    login: (email, password) =>
        makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    logout: () =>
        makeRequest('/auth/logout', {
            method: 'POST',
        }),

    refreshToken: (refreshToken) =>
        makeRequest('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        }),
};

// User API calls
export const userAPI = {
    getProfile: () => makeRequest('/user/profile'),

    getProgress: (limit = 20, skip = 0) =>
        makeRequest(`/user/progress?limit=${limit}&skip=${skip}`),

    getDashboardMetrics: () => makeRequest('/user/dashboard-metrics'),

    submitAnswer: (questionId, question, userAnswer, role, difficulty, timeSpent) =>
        makeRequest('/user/answer', {
            method: 'POST',
            body: JSON.stringify({
                questionId,
                question,
                userAnswer,
                role,
                difficulty,
                timeSpent,
            }),
        }),

    saveMockInterviewSession: (sessionData) =>
        makeRequest('/user/mock-interview', {
            method: 'POST',
            body: JSON.stringify(sessionData),
        }),

    getMockInterviews: (limit = 10, skip = 0) =>
        makeRequest(`/user/mock-interviews?limit=${limit}&skip=${skip}`),
};

// Token management utilities
export const tokenUtils = {
    setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    },

    getAccessToken: () => localStorage.getItem('accessToken'),

    getRefreshToken: () => localStorage.getItem('refreshToken'),

    clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    isTokenValid: () => {
        return !!localStorage.getItem('accessToken');
    },
};

export { APIError, refreshAccessToken };
