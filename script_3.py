# Create additional utility files and documentation

additional_files = {
    "scripts/setup-questions.js": """// Script to populate database with questions
// Run this with: node scripts/setup-questions.js

const mongoose = require('mongoose');
require('dotenv').config();

const Question = require('../models/Question');

const sampleQuestions = [
    // Questions 1-10 have 3 attempts
    { id: 1, answer: 1234, maxAttempts: 3 },
    { id: 2, answer: 5678, maxAttempts: 3 },
    { id: 3, answer: 9012, maxAttempts: 3 },
    { id: 4, answer: 3456, maxAttempts: 3 },
    { id: 5, answer: 7890, maxAttempts: 3 },
    { id: 6, answer: 2468, maxAttempts: 3 },
    { id: 7, answer: 1357, maxAttempts: 3 },
    { id: 8, answer: 8642, maxAttempts: 3 },
    { id: 9, answer: 9753, maxAttempts: 3 },
    { id: 10, answer: 1111, maxAttempts: 3 },
    
    // Questions 11-20 have 2 attempts
    { id: 11, answer: 2222, maxAttempts: 2 },
    { id: 12, answer: 3333, maxAttempts: 2 },
    { id: 13, answer: 4444, maxAttempts: 2 },
    { id: 14, answer: 5555, maxAttempts: 2 },
    { id: 15, answer: 6666, maxAttempts: 2 },
    { id: 16, answer: 7777, maxAttempts: 2 },
    { id: 17, answer: 8888, maxAttempts: 2 },
    { id: 18, answer: 9999, maxAttempts: 2 },
    { id: 19, answer: 1010, maxAttempts: 2 },
    { id: 20, answer: 2020, maxAttempts: 2 },
    
    // Questions 21-30 have 1 attempt only
    { id: 21, answer: 100, maxAttempts: 1 },
    { id: 22, answer: 200, maxAttempts: 1 },
    { id: 23, answer: 300, maxAttempts: 1 },
    { id: 24, answer: 400, maxAttempts: 1 },
    { id: 25, answer: 500, maxAttempts: 1 },
    { id: 26, answer: 600, maxAttempts: 1 },
    { id: 27, answer: 700, maxAttempts: 1 },
    { id: 28, answer: 800, maxAttempts: 1 },
    { id: 29, answer: 900, maxAttempts: 1 },
    { id: 30, answer: 999, maxAttempts: 1 }
];

async function setupQuestions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing questions
        await Question.deleteMany({});
        console.log('Cleared existing questions');

        // Insert new questions
        await Question.insertMany(sampleQuestions);
        console.log('Questions inserted successfully!');

        console.log('\\nQuestion setup complete:');
        console.log('- Questions 1-10: 3 attempts each');
        console.log('- Questions 11-20: 2 attempts each');
        console.log('- Questions 21-30: 1 attempt each');

        process.exit(0);
    } catch (error) {
        console.error('Error setting up questions:', error);
        process.exit(1);
    }
}

setupQuestions();""",

    "scripts/create-users.js": """// Script to create user accounts
// Run this with: node scripts/create-users.js

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const sampleUsers = [
    { username: 'team1', password: 'password123', teamName: 'Lightning Bolts' },
    { username: 'team2', password: 'password123', teamName: 'Brain Busters' },
    { username: 'team3', password: 'password123', teamName: 'Quiz Masters' },
    { username: 'team4', password: 'password123', teamName: 'Smart Cookies' },
    { username: 'team5', password: 'password123', teamName: 'Think Tank' },
    { username: 'admin', password: 'admin123', teamName: 'Organizers' }
];

async function createUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const userData of sampleUsers) {
            const existingUser = await User.findOne({ username: userData.username });
            if (!existingUser) {
                const user = new User(userData);
                await user.save();
                console.log(`Created user: ${userData.username} (${userData.teamName})`);
            } else {
                console.log(`User ${userData.username} already exists`);
            }
        }

        console.log('\\nUser creation complete!');
        console.log('\\nLogin credentials:');
        sampleUsers.forEach(user => {
            console.log(`${user.username} / ${user.password} (${user.teamName})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error creating users:', error);
        process.exit(1);
    }
}

createUsers();""",

    "README.md": """# Quizzicles Contest Portal

A secure, modern contest portal for quiz competitions with real-time leaderboards, answer submission tracking, and announcements system.

## Features

### 🔐 Security
- JWT-based authentication
- BCrypt password hashing (12 rounds)
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet.js security headers

### 🎯 Contest Features
- Individual question answer submission (0-9999 range)
- Configurable attempt limits per question (1-3 attempts)
- Real-time score calculation and leaderboard updates
- Live announcements and corrections system
- Question paper access links

### 📊 Real-time Features
- Live leaderboard with Socket.IO
- Instant score updates
- Real-time announcements
- Auto-refreshing public leaderboard

### 🎨 Modern UI/UX
- Responsive design for all devices
- Modern CSS with gradients and animations
- Professional contest portal aesthetics
- Intuitive navigation and user experience

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time features
- **JWT** for authentication
- **BCrypt** for password hashing
- **Express Validator** for input validation
- **Helmet** and **CORS** for security

### Frontend
- **Vanilla JavaScript** (ES6+)
- **Modern CSS** with custom properties
- **Socket.IO Client** for real-time updates
- **Font Awesome** icons
- **Inter** font family

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd quizzicles-contest-portal
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/quizzicles
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
BCRYPT_ROUNDS=12
```

### 3. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Setup questions in database
node scripts/setup-questions.js

# Create sample user accounts
node scripts/create-users.js
```

### 4. Start the Application
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## Free Hosting Options

### Recommended: Render.com
1. Create account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Choose "Web Service"
4. Configure environment variables
5. Deploy automatically

**Benefits:** 
- 750 hours/month free tier
- Automatic HTTPS
- GitHub integration
- Easy scaling

### Alternative Options

#### Vercel (Serverless)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Configure as Node.js project
4. Set environment variables in dashboard

#### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy with automatic builds

#### Fly.io
1. Install flyctl CLI
2. Run `fly launch` in project directory
3. Configure app settings
4. Deploy with `fly deploy`

### Database Hosting (Free)
- **MongoDB Atlas**: 512MB free cluster
- **Render PostgreSQL**: Free tier available
- **PlanetScale**: MySQL-compatible serverless database

## Project Structure

```
quizzicles-contest-portal/
├── models/              # Database models
│   ├── User.js         # User model with auth
│   ├── Question.js     # Question and answers
│   ├── Submission.js   # Answer submissions
│   └── Announcement.js # Contest announcements
├── routes/             # API routes
│   ├── auth.js        # Authentication endpoints
│   ├── contest.js     # Contest submission logic
│   ├── leaderboard.js # Leaderboard data
│   └── announcements.js # Announcements CRUD
├── middleware/         # Custom middleware
│   └── auth.js        # JWT authentication
├── public/            # Frontend files
│   ├── index.html     # Main HTML structure
│   ├── styles.css     # Modern CSS styling
│   └── app.js         # Frontend JavaScript
├── scripts/           # Utility scripts
│   ├── setup-questions.js # Database question setup
│   └── create-users.js    # User account creation
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
└── .env              # Environment configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create new user (admin)
- `GET /api/auth/me` - Get current user info

### Contest
- `POST /api/contest/submit` - Submit answer to question
- `GET /api/contest/attempts/:questionId` - Get user's attempts
- `GET /api/contest/questions/limits` - Get question attempt limits

### Leaderboard
- `GET /api/leaderboard` - Get public leaderboard
- `GET /api/leaderboard/rank/:userId` - Get user's rank

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (auth required)

## Default User Accounts

After running the setup script, these accounts will be available:

| Username | Password    | Team Name      |
|----------|-------------|----------------|
| team1    | password123 | Lightning Bolts|
| team2    | password123 | Brain Busters  |
| team3    | password123 | Quiz Masters   |
| team4    | password123 | Smart Cookies  |
| team5    | password123 | Think Tank     |
| admin    | admin123    | Organizers     |

## Customization

### Updating Questions and Answers
1. Modify the answers in `scripts/setup-questions.js`
2. Run `node scripts/setup-questions.js` to update database

### Styling Customization
- Edit CSS custom properties in `:root` selector
- Modify color scheme, fonts, and spacing
- All styles are in `public/styles.css`

### Adding Features
- Extend API routes in `routes/` directory
- Add frontend functionality in `public/app.js`
- Create new models in `models/` directory

## Security Features

### Production Security Checklist
- [ ] Change JWT_SECRET to a strong, unique value
- [ ] Use HTTPS in production
- [ ] Set up rate limiting rules
- [ ] Configure CORS for specific domains
- [ ] Enable MongoDB authentication
- [ ] Set up error logging and monitoring
- [ ] Regular security updates

### Anti-Cheating Measures
- Server-side answer validation
- Attempt tracking and limits
- JWT token expiration
- Input validation and sanitization
- Rate limiting on submissions

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network connectivity

**JWT Token Issues**
- Check JWT_SECRET configuration
- Verify token expiration settings
- Clear localStorage and re-login

**Socket.IO Not Working**
- Check firewall settings
- Verify CORS configuration
- Ensure proper port forwarding

### Support

For issues and questions:
1. Check the troubleshooting section
2. Review error logs in browser console
3. Verify environment variables
4. Test with sample data

## License

MIT License - feel free to use for educational and commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built for academic competitions and quiz contests worldwide** 🧠✨
""",

    "vercel.json": """{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "JWT_SECRET": "@jwt-secret"
  }
}""",

    ".gitignore": """# Dependencies
node_modules/
npm-debug.log*

# Environment variables
.env
.env.local
.env.production

# Database
*.db
*.sqlite

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo

# Build output
build/
dist/

# Temporary files
tmp/
temp/""",

    "docker-compose.yml": """version: '3.8'
services:
  mongodb:
    image: mongo:5.0
    container_name: quizzicles-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: quizzicles
    volumes:
      - mongodb_data:/data/db

  app:
    build: .
    container_name: quizzicles-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/quizzicles?authSource=admin
      - JWT_SECRET=your-production-jwt-secret-change-this
    depends_on:
      - mongodb
    volumes:
      - .:/app
      - node_modules:/app/node_modules

volumes:
  mongodb_data:
  node_modules:""",

    "Dockerfile": """FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]"""
}

# Create additional directories and files
import os
os.makedirs('scripts', exist_ok=True)

for filename, content in additional_files.items():
    with open(filename, 'w') as f:
        f.write(content)

print("✅ Additional utility files and documentation created!")
print("\nCreated files:")
for filename in additional_files.keys():
    print(f"  - {filename}")

print("\n🎉 Complete backend contest portal created successfully!")
print("\n📁 Project structure:")
print("""
quizzicles-contest-portal/
├── 📁 models/          # Database models
├── 📁 routes/          # API endpoints  
├── 📁 middleware/      # Authentication
├── 📁 public/          # Frontend files
├── 📁 scripts/         # Setup utilities
├── 🗄️ server.js        # Main server
├── 📦 package.json     # Dependencies
├── 📝 README.md        # Documentation
├── 🐳 Dockerfile       # Container setup
└── ⚙️ .env             # Configuration
""")