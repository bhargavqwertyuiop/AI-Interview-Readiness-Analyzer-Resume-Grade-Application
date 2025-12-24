import mongoose from 'mongoose';

const mockInterviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate',
    },
    duration: {
        type: Number,
        required: true, // in seconds
    },
    questionsAsked: Number,
    questionsAnswered: Number,
    overallScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    interviewTranscript: [
        {
            timestamp: Date,
            speaker: {
                type: String,
                enum: ['ai', 'user'],
            },
            text: String,
        },
    ],
    aiFeedback: {
        summary: String,
        strengths: [String],
        areasForImprovement: [String],
        suggestions: [String],
    },
    recordingUrl: String, // Optional: URL to stored recording
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for fast lookups by userId
mockInterviewSessionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('MockInterviewSession', mockInterviewSessionSchema);
