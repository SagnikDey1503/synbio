const moment = require('moment-timezone');
const Announcement = require('../models/Announcement');

const timeGateMiddleware = (unlockTime) => {
    return async (req, res, next) => {
        const now = moment().tz('Asia/Kolkata');
        const unlockMoment = moment.tz(unlockTime, 'Asia/Kolkata');

        if (now.isBefore(unlockMoment)) {
            try {
                const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 }).limit(5);
                const timeLeft = unlockMoment.diff(now, 'minutes');

                const hours = Math.floor(timeLeft / 60);
                const minutes = timeLeft % 60;

                res.render('locked', {
                    unlockTimeISO: unlockMoment.toISOString(),
                    hoursLeft: hours,
                    minutesLeft: minutes,
                    announcements, message:null
                });
            } catch (err) {
                console.error('Failed to fetch announcements:', err);
                res.render('locked', {
                    // unlockTimeISO: unlockMoment.format('MMMM Do YYYY, h:mm A'),
                    unlockTimeISO: unlockMoment.toISOString(),
                    hoursLeft: 0,
                    minutesLeft: 0,
                    announcements: [],
                    message:null
                });
            }
        } else {
            next();
        }
    };
};

module.exports = timeGateMiddleware;
