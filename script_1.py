# Create the route files for the backend

routes_files = {
    "routes/auth.js": """const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register new user (admin only - for creating participant accounts)
router.post('/register', [
    body('username').isLength({ min: 3, max: 20 }).trim().escape(),
    body('password').isLength({ min: 6 }),
    body('teamName').isLength({ min: 1, max: 50 }).trim().escape()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, teamName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        const user = new User({
            username,
            password,
            teamName
        });

        await user.save();

        res.status(201).json({ 
            message: 'User created successfully',
            username: user.username,
            teamName: user.teamName
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login
router.post('/login', [
    body('username').trim().escape(),
    body('password').exists()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username, isActive: true });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last activity
        user.lastActivity = new Date();
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                teamName: user.teamName,
                score: user.score
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Get current user info
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;""",

    "routes/contest.js": """const express = require('express');
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

module.exports = router;""",

    "routes/leaderboard.js": """const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get public leaderboard (no auth required)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({ isActive: true })
            .select('username teamName score lastActivity')
            .sort({ score: -1, lastActivity: 1 })
            .limit(100);

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            teamName: user.teamName,
            score: user.score,
            lastActivity: user.lastActivity
        }));

        res.json(leaderboard);
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's rank
router.get('/rank/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const user = await User.findById(userId).select('score');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const rank = await User.countDocuments({
            isActive: true,
            $or: [
                { score: { $gt: user.score } },
                { 
                    score: user.score,
                    lastActivity: { $lt: user.lastActivity }
                }
            ]
        }) + 1;

        res.json({ rank, score: user.score });
    } catch (error) {
        console.error('Get rank error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;""",

    "routes/announcements.js": """const express = require('express');
const { body, validationResult } = require('express-validator');
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all active announcements (public)
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find({ isActive: true })
            .populate('authorId', 'username')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(announcements);
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new announcement (authenticated users only)
router.post('/', [
    auth,
    body('title').isLength({ min: 1, max: 100 }).trim().escape(),
    body('content').isLength({ min: 1, max: 1000 }).trim().escape(),
    body('type').optional().isIn(['general', 'correction', 'urgent'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, type = 'general' } = req.body;

        const announcement = new Announcement({
            title,
            content,
            type,
            authorId: req.user.userId
        });

        await announcement.save();
        await announcement.populate('authorId', 'username');

        // Emit real-time announcement
        const io = req.app.get('io');
        io.emit('new-announcement', announcement);

        res.status(201).json(announcement);
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;""",

    "middleware/auth.js": """const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Token verification failed' });
    }
};

module.exports = auth;"""
}

# Create routes directory and files
import os
os.makedirs('routes', exist_ok=True)
os.makedirs('middleware', exist_ok=True)

for filename, content in routes_files.items():
    with open(filename, 'w') as f:
        f.write(content)

print("✅ Backend routes and middleware created successfully!")
print("\nCreated files:")
for filename in routes_files.keys():
    print(f"  - {filename}")