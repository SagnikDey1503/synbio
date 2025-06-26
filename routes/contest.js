const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');

const router = express.Router();

// Submit answer to a question
router.post('/submit', [
    auth,
    body('questionId').isInt({ min: 1, max: 30 }),
    body('answer').isInt({ min: 0, max: 9999 })
], async (req, res) => {
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

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check attempt count for this question
        let userAttempt = user.attempts.find(att => att.questionId === questionId);
        if (!userAttempt) {
            userAttempt = { questionId, attemptCount: 0 };
            user.attempts.push(userAttempt);
        }

        if (userAttempt.attemptCount >= question.maxAttempts) {
            return res.status(400).json({ 
                message: `Maximum attempts (${question.maxAttempts}) reached for this question` 
            });
        }

        // Increment attempt count
        userAttempt.attemptCount += 1;

        // Check if answer is correct
        const isCorrect = answer === question.answer;
        let pointsAwarded = 0;

        if (isCorrect) {
            pointsAwarded = 10; // Base points
            // Bonus for first attempt
            if (userAttempt.attemptCount === 1) {
                pointsAwarded += 5;
            }

            // Add points to user score
            user.score += pointsAwarded;
        }

        // Save submission
        const submission = new Submission({
            userId,
            questionId,
            submittedAnswer: answer,
            isCorrect,
            attemptNumber: userAttempt.attemptCount,
            pointsAwarded
        });

        await submission.save();
        await user.save();

        // Emit real-time leaderboard update
        const io = req.app.get('io');
        if (isCorrect) {
            io.emit('leaderboard-update', {
                userId,
                username: user.username,
                teamName: user.teamName,
                score: user.score,
                questionId
            });
        }

        res.json({
            isCorrect,
            pointsAwarded,
            totalScore: user.score,
            remainingAttempts: question.maxAttempts - userAttempt.attemptCount,
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