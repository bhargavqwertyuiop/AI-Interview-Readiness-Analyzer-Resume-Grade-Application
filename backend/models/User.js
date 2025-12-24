import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email',
        ],
    },
    passwordHash: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false, // Don't return password by default
    },
    subscription: {
        plan: {
            type: String,
            enum: ['free', 'pro', 'enterprise'],
            default: 'free',
        },
        startDate: Date,
        endDate: Date,
    },
    usageStats: {
        questionsAnswered: {
            type: Number,
            default: 0,
        },
        mockInterviewsCompleted: {
            type: Number,
            default: 0,
        },
        totalLearningMinutes: {
            type: Number,
            default: 0,
        },
    },
    overallReadinessScore: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    lastLoginAt: Date,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) {
        return next();
    }

    const salt = await bcryptjs.genSalt(10);
    this.passwordHash = await bcryptjs.hash(this.passwordHash, salt);
    next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.passwordHash);
};

export default mongoose.model('User', userSchema);
