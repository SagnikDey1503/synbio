const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get public leaderboard (no auth required)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({ isActive: true })
            .select('username fullName category score lastActivity') // Changed teamName to fullName, added category
            .sort({ score: -1, lastActivity: 1 })
            .limit(100);

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            fullName: user.fullName,           // Changed from teamName to fullName
            category: user.category,           // Added category
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

        const user = await User.findById(userId).select('score fullName category'); // Added fullName and category
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

        res.json({ 
            rank, 
            score: user.score,
            fullName: user.fullName,    // Added fullName
            category: user.category     // Added category
        });
    } catch (error) {
        console.error('Get rank error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
