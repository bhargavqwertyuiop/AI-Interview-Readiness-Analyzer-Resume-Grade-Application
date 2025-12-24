import mongoose from 'mongoose';

const interviewProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    questionId: {
        type: String,
        required: true,
    },
    role: String,
    difficulty: String,
    question: {
        type: String,
        required: true,
    },
    userAnswer: {
        type: String,
        required: true,
    },
    aiScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    strengths: [String],
    gaps: [String],
    suggestions: [String],
    feedback: String,
    timeSpent: Number, // seconds
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for fast lookups by userId
interviewProgressSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('InterviewProgress', interviewProgressSchema);
