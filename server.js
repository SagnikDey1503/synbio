const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const Announcement = require('./models/Announcement'); // adjust path as needed
const User = require('./models/User'); // adjust path as needed
const Query = require('./models/Query'); // adjust path as needed
const timeGateMiddleware = require('./middleware/time');
const timeLockMiddleware = require('./middleware/timeGateMiddleware');
const examMiddleware = require('./middleware/exam');
const startTime = '2025-07-25T18:00:00+05:30';
const endTime = '2025-07-26T18:00:00+05:30';
const end = new Date(endTime); // convert to Date object
require('dotenv').config();
// const unlockTime = '2025-06-29T19:35:00+05:30';
const closeTime = '2025-07-23T00:00:00+05:30';
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.set('view engine', 'ejs');
app.set('views', 'views');



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Make io available to routes
app.set('io', io);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contest', require('./routes/contest'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/announcements', require('./routes/announcements'));

// Serve the main HTML file for the dashboard
app.get('/', async (req, res) => {
  try {
    const registrationCount = await User.countDocuments(); // Counts all users
    res.render('index', {
      registrationCount,
      // message: null,
      // error: null
    });
  } catch (err) {
    console.error('Error fetching user count:', err);
    res.render('index', {
      registrationCount: 100,
      message: null,
      error: 'Unable to fetch user count.'
    });
  }
});
app.get('/signup', timeLockMiddleware(closeTime),(req, res) => {
    res.render('signiup_land',{error:null,success:null})
});
app.get('/login', examMiddleware(startTime, endTime), (req, res) => {
       res.render('login_land', { endTime: end.toISOString() }); // ← IMPORTANT

});
const moment = require('moment-timezone');
app.get('/ann', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });

    // Format createdAt to IST for each announcement
    const formattedAnnouncements = announcements.map(a => ({
      ...a._doc, // or a.toObject(), depending on your schema
      formattedDate: moment(a.createdAt).tz('Asia/Kolkata').format('DD MMM YYYY, hh:mm A')
    }));

    res.render('ann', { announcements: formattedAnnouncements });
  } catch (err) {
    console.error('Error loading announcements:', err);
    res.status(500).send('Something went wrong.');
  }
});
// Public leaderboard page
app.get('/public_leaderboard', async (req, res) => {
  try {
    const users = await User.find().sort({ score: -1 }); // example sorting
    res.render('public-leaderboard', { users, error:null });
  } catch (err) {
    res.render('public-leaderboard', { users: [], error: 'Error loading leaderboard' });
  }
});


app.post('/signup', async (req, res) => {
  const { username, password, fullName, category, email } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      const errorMsg = existingUser.username === username
        ? 'Username already taken. Please choose another one.'
        : 'Email already registered. Try logging in.';
      return res.render('signiup_land', { error: errorMsg, success: null });
    }

    // Create new user
    const newUser = new User({
      username,
      password,      // Will be hashed via pre-save hook
      fullName,
      category,
      email
    });

    await newUser.save();

    res.render('signiup_land', { error: null, success: "Registered successfully! Continue to Login" });

  } catch (err) {
    console.error('Signup error:', err);
    res.render('signiup_land', { error: err.message, success: null });
  }
});


// At the top of server.js

// Add this route after your other routes
app.post('/query', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = new Query({ name, email, subject, message });
     if (!name || !email || !message || !subject) {
    return res.json({ success: false, message: 'All fields are required.' });
  }
    await contact.save();
        return res.json({ success: true, message: 'Form submitted successfully!' });
  } catch (err) {
     return res.json({ success: false, message: 'Form submitted successfully!' });
  }
});




// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (data) => {
        socket.join(data.room);
        console.log(`User ${socket.id} joined room: ${data.room}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Dashboard: http://localhost:${PORT}`);
    console.log(`Public Leaderboard: http://localhost:${PORT}/public_Leaderboard`);
});

module.exports = app;