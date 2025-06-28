const moment = require('moment-timezone');
const Announcement = require('../models/Announcement');

const examTimeGate = (startTime, endTime) => {
    return async (req, res, next) => {
        const now = moment().tz('Asia/Kolkata');
        const start = moment.tz(startTime, 'Asia/Kolkata');
        const end = moment.tz(endTime, 'Asia/Kolkata');

        if (now.isBefore(start)) {
            // Before exam start
            const timeLeft = start.diff(now, 'minutes');
            const hours = Math.floor(timeLeft / 60);
            const minutes = timeLeft % 60;

            try {
                const announcements = await Announcement.find({ isActive: true })
                    .sort({ createdAt: -1 })
                    .limit(5);

                return res.render('locked', {
                    unlockTimeISO: start.toISOString(),
                    hoursLeft: hours,
                    minutesLeft: minutes,
                    announcements,
                    message: null
                });
            } catch (err) {
                console.error('Failed to fetch announcements:', err);
                return res.render('locked', {
                    unlockTimeISO: start.toISOString(),
                    hoursLeft: hours,
                    minutesLeft: minutes,
                    announcements: [],
                    message: 'Could not fetch announcements.'
                });
            }
        } else if (now.isAfter(end)) {
            // After exam end
            return res.render('exam-ended')
        } else {
            // Within exam time
            return next();
        }
    };
};

module.exports = examTimeGate;
