const moment = require('moment-timezone');
const Announcement = require('../models/Announcement');
const User = require('../models/User');

const timeGateMiddleware = (lockTime) => {
    return async (req, res, next) => {
        const now = moment().tz('Asia/Kolkata');
        const lockMoment = moment.tz(lockTime, 'Asia/Kolkata');

        // If current time is after lock time, redirect to home
        if (now.isAfter(lockMoment)) {
            try {
                const registrationCount = await User.countDocuments(); // optional if you need it on the home page

                // Redirect to home with optional query params or flash messages
                return res.redirect('/login'); // or res.redirect('/?locked=true')
            } catch (err) {
                console.error('Redirect after lock failed:', err);
                return res.redirect('/login');
            }
        } else {
            next(); // portal still open
        }
    };
};

module.exports = timeGateMiddleware;
