const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = express.Router();

// Submit answer to a question
router.post('/submit', [
    auth,
    body('questionId').isInt({ min: 1, max: 43 }),
    body('answer').isInt({ min: 0, max: 9999 })
], async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ message: 'Database connection error' });
    }

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { questionId, answer } = req.body;
        const userId = req.user.userId;

        // Get question details
        const question = await Question.findOne({ id: questionId, isActive: true });
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if user has existing attempt record
        let updatedUser;
        const user = await User.findOne({ _id: userId });
        const existingAttempt = user.attempts.find(att => att.questionId === questionId);

        if (!existingAttempt) {
            // First attempt — initialize with attemptCount = 1
            updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { attempts: { questionId, attemptCount: 1 } } },
                { new: true }
            );
        } else {
            // Already attempted — increment only if under max
            if (existingAttempt.attemptCount >= question.maxAttempts) {
                return res.status(400).json({
                    message: `Maximum attempts (${question.maxAttempts}) reached for this question`
                });
            }

            updatedUser = await User.findOneAndUpdate(
                {
                    _id: userId,
                    'attempts.questionId': questionId
                },
                {
                    $inc: { 'attempts.$.attemptCount': 1 }
                },
                { new: true }
            );
        }

        // Get the updated attempt count
        const userAttempt = updatedUser.attempts.find(att => att.questionId === questionId);
        const currentAttemptCount = userAttempt.attemptCount;

        // Check if answer is correct
        const tolerance = question.tolerance || 0;
        const numericAnswer = Number(answer);
        const isCorrect = Math.abs(numericAnswer - question.correctAnswer) <= tolerance;

        let pointsAwarded = 0;

        if (isCorrect) {
            pointsAwarded = question.points || 10;

            // Atomically update user score
            await User.findByIdAndUpdate(userId, {
                $inc: { score: pointsAwarded }
            });
        }

        // Save submission
        const submission = new Submission({
            userId,
            questionId,
            submittedAnswer: numericAnswer,
            isCorrect,
            attemptNumber: currentAttemptCount,
            pointsAwarded
        });

        await submission.save();

        // Get final user state
        const finalUser = await User.findById(userId);

        // Emit real-time leaderboard update
        const io = req.app.get('io');
        if (isCorrect) {
            io.emit('leaderboard-update', {
                userId,
                username: finalUser.username,
                teamName: finalUser.teamName,
                score: finalUser.score,
                questionId
            });
        }

        res.json({
            isCorrect,
            pointsAwarded,
            totalScore: finalUser.score,
            remainingAttempts: question.maxAttempts - currentAttemptCount,
            currentAttempts: currentAttemptCount,
            message: isCorrect ? 'Correct answer!' : 'Incorrect answer. Try again.'
        });

    } catch (error) {
        console.error('Submit answer error:', error);
        res.status(500).json({ message: 'Server error during submission' });
    }
});

// Get user's attempt history for a question
router.get('/attempts/:questionId', auth, async (req, res) => {
    try {
        const questionId = parseInt(req.params.questionId);
        const userId = req.user.userId;

        const submissions = await Submission.find({ userId, questionId })
            .sort({ createdAt: -1 });

        const user = await User.findById(userId);
        const userAttempt = user.attempts.find(att => att.questionId === questionId);

        const question = await Question.findOne({ id: questionId });
        const remainingAttempts = question ? question.maxAttempts - (userAttempt?.attemptCount || 0) : 0;

        res.json({
            submissions,
            remainingAttempts,
            totalAttempts: userAttempt?.attemptCount || 0
        });
    } catch (error) {
        console.error('Get attempts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all question limits (for frontend display)
router.get('/questions/limits', auth, async (req, res) => {
    try {
        const questions = await Question.find({ isActive: true })
            .select('id maxAttempts')
            .sort({ id: 1 });

        res.json(questions);
    } catch (error) {
        console.error('Get question limits error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
