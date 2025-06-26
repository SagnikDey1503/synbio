# Quizzicles Contest Portal

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
