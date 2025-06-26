const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: Number,
        required: true,
        min: 1,
        max: 30
    },
    submittedAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 9999
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    attemptNumber: {
        type: Number,
        required: true,
        min: 1
    },
    pointsAwarded: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

submissionSchema.index({ userId: 1, questionId: 1 });

module.exports = mongoose.model('Submission', submissionSchema);