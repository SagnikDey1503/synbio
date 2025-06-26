const express = require('express');
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

module.exports = router;