const moment = require('moment-timezone');
const Announcement = require('../models/Announcement');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'hello123';

const examTimeGate = (startTime, endTime) => {
    return async (req, res, next) => {
        const now = moment().tz('Asia/Kolkata');
        const start = moment.tz(startTime, 'Asia/Kolkata');
        const end = moment.tz(endTime, 'Asia/Kolkata');

        const token = req.query.token;

        // If token exists, verify it
        if (token) {
            try {
                const decoded = jwt.verify(token, secret);
                if (decoded.role === 'admin') {
                    return next(); // allow access
                }
            } catch (err) {
                return res.status(401).send("Invalid or expired token.");
            }
        }

        if (now.isBefore(start)) {
            // Before exam start
            const timeLeft = start.diff(now, 'minutes');
            const hours = Math.floor(timeLeft / 60);
            const minutes = timeLeft % 60;

            try {
                const announcements = await Announcement.find({ isActive: true })
                    .sort({ createdAt: -1 })
                    .limit(5);

                const formattedAnnouncements = announcements.map(a => {
                    const obj = a.toObject();
                    return {
                        ...obj,
                        formattedDate: moment(obj.createdAt).tz('Asia/Kolkata').format('D MMM YYYY, h:mm A')
                    };
                });

                // ✅ Return the rendered page here
                return res.render('locked', {
                    unlockTimeISO: start.toISOString(),
                    hoursLeft: hours,
                    minutesLeft: minutes,
                    announcements: formattedAnnouncements,
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
            return res.render('exam-ended');
        } else {
            // Within exam time
            return next();
        }
    };
};

module.exports = examTimeGate;
