const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const User = require('./models/User'); // adjust path as needed
const Query = require('./models/Query'); // adjust path as needed
const sendEmail = require('./utils/sendEmail'); // Create a helper to send email
// const timeGateMiddleware = require('./middleware/time');
// const timeLockMiddleware = require('./middleware/timeGateMiddleware');
// const examMiddleware = require('./middleware/exam');
// const startTime = '2025-07-25T18:00:00+05:30';
// const endTime = '2025-07-26T18:00:00+05:30';
// const end = new Date(endTime); // convert to Date object
require('dotenv').config();
// const unlockTime = '2025-06-29T19:35:00+05:30';
// const closeTime = '2025-07-24T00:00:00+05:30'; //changed
const app = express();
const server = http.createServer(app);
// const io = socketIo(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });
app.set('view engine', 'ejs');
app.set('views', 'views');



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));



// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


// Serve the main HTML file for the dashboard
app.get('/', async (req, res) => {
  try {
    const registrationCount = await User.countDocuments(); // Counts all users
    res.render('index', {
      registrationCount,
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
app.get('/signup',(req, res) => {
    res.render('signiup_land',{error:null,success:null})
});



app.post('/signup', async (req, res) => {
  const { email, fullName, phoneNumber } = req.body;

  try {
    // Validate required fields
    if (!email || !fullName || !phoneNumber) {
      return res.render('signiup_land', {
        error: 'All fields are required.',
        success: null
      });
    }

    // Check if email or phone already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      const errorMsg =
        existingUser.email === email
          ? 'Email already registered.'
          : 'Phone number already registered.';

      return res.render('signiup_land', {
        error: errorMsg,
        success: null
      });
    }

    // Create new user
    const newUser = new User({
      email,
      fullName,
      phoneNumber
    });

    await newUser.save();

    res.render('signiup_land', {
      error: null,
      success: 'Registered successfully!'
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.render('signiup_land', {
      error: 'Something went wrong. Please try again.',
      success: null
    });
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
});

module.exports = app;