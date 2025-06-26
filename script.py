# Let me create the backend structure with all necessary files for a secure quiz contest portal

import os
import json

# Create project structure
project_structure = {
    "package.json": {
        "name": "quizzicles-contest-portal",
        "version": "1.0.0",
        "description": "Secure contest portal for Quizzicles competition",
        "main": "server.js",
        "scripts": {
            "start": "node server.js",
            "dev": "nodemon server.js"
        },
        "dependencies": {
            "express": "^4.18.2",
            "mongoose": "^7.5.0",
            "jsonwebtoken": "^9.0.2",
            "bcryptjs": "^2.4.3",
            "cors": "^2.8.5",
            "dotenv": "^16.3.1",
            "socket.io": "^4.7.2",
            "helmet": "^7.0.0",
            "express-rate-limit": "^6.8.1",
            "express-validator": "^7.0.1"
        },
        "devDependencies": {
            "nodemon": "^3.0.1"
        }
    },
    
    ".env": """PORT=3000
MONGODB_URI=mongodb://localhost:27017/quizzicles
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
BCRYPT_ROUNDS=12""",

    "server.js": """const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contestRoutes = require('./routes/contest');
const leaderboardRoutes = require('./routes/leaderboard');
const announcementRoutes = require('./routes/announcements');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts, please try again later.'
});

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.IO for real-time leaderboard
io.on('connection', (socket) => {
    console.log('Client connected to real-time updates');
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/contest', contestRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/announcements', announcementRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});""",

    "models/User.js": """const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    teamName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    isActive: {
        type: Boolean,
        default: true
    },
    score: {
        type: Number,
        default: 0
    },
    attempts: [{
        questionId: Number,
        attemptCount: {
            type: Number,
            default: 0
        }
    }],
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);""",

    "models/Question.js": """const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        max: 30
    },
    answer: {
        type: Number,
        required: true,
        min: 0,
        max: 9999
    },
    maxAttempts: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
        max: 3
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);""",

    "models/Submission.js": """const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: Number,
        required: true,
        min: 1,
        max: 30
    },
    submittedAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 9999
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    attemptNumber: {
        type: Number,
        required: true,
        min: 1
    },
    pointsAwarded: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

submissionSchema.index({ userId: 1, questionId: 1 });

module.exports = mongoose.model('Submission', submissionSchema);""",

    "models/Announcement.js": """const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    type: {
        type: String,
        enum: ['general', 'correction', 'urgent'],
        default: 'general'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);"""
}

# Write package.json
with open('package.json', 'w') as f:
    json.dump(project_structure['package.json'], f, indent=2)

# Write other files
for filename, content in project_structure.items():
    if filename != 'package.json':
        # Create directories if needed
        if '/' in filename:
            directory = os.path.dirname(filename)
            os.makedirs(directory, exist_ok=True)
        
        with open(filename, 'w') as f:
            f.write(content)

print("✅ Backend project structure created successfully!")
print("\nCreated files:")
for filename in project_structure.keys():
    print(f"  - {filename}")