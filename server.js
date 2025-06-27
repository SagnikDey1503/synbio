const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const User = require('./models/User'); // adjust path as needed
const Query = require('./models/Query'); // adjust path as needed

require('dotenv').config();

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
app.get('/', (req, res) => {
    res.render('index',{message:null,error:null});
});
app.get('/signup', (req, res) => {
    res.render('signiup_land',{error:null,success:null})
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login_land.html'));
});

// Public leaderboard page
app.get('/public-leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'public-leaderboard.html'));
});

app.post('/signup', async (req, res) => {
  const { username, password, teamName } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('signiup_land', { error: 'Username already taken. Please choose another one.',success:null });
    }

    const newUser = new User({
      username,
      password,      // Will be hashed by the pre-save hook
      teamName
    });

    await newUser.save();


   res.render('signiup_land', { error: null,success:"Registered succesfully! Continue to Login" });
  } catch (err) {
    res.render('signiup_land', { error: err.message,success:null });
  }
});
// At the top of server.js
app.get('/query', async (req, res) => {
    console.log("get accesw");
});
// Add this route after your other routes
app.post('/query', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    console.log("gg");
    const contact = new Query({ name, email, subject, message });
    await contact.save();
      res.render('index',{message:"The query has been updated! Will get back to you soon",error:null});
  } catch (err) {
      res.render('index',{message:null,error:"Failed to submit"});
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
    console.log(`Public Leaderboard: http://localhost:${PORT}/public-leaderboard`);
});

module.exports = app;