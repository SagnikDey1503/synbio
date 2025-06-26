# Quick Start Guide: Deploying Your Secure Contest Portal

## 🚀 5-Minute Deployment to Render.com

### Step 1: Prepare Your Code (2 minutes)
```bash
# Clone or download the project files
git init
git add .
git commit -m "Contest portal initial setup"

# Push to GitHub (create repository first)
git remote add origin https://github.com/yourusername/quizzicles-portal.git
git push -u origin main
```

### Step 2: Setup Database (1 minute)
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create **FREE** cluster (512MB - sufficient for contests)
3. Create database user and get connection string
4. Copy connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/`)

### Step 3: Deploy to Render (2 minutes)
1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure service:
   - **Name**: `quizzicles-contest`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add environment variables:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=change-this-to-a-random-secure-string
   NODE_ENV=production
   ```

### Step 4: Initialize Contest Data
After deployment, run setup scripts via Render shell or locally:
```bash
# Setup questions (modify answers in scripts/setup-questions.js first)
node scripts/setup-questions.js

# Create user accounts  
node scripts/create-users.js
```

### Step 5: Test Your Portal
1. Visit your deployed URL: `https://your-app-name.onrender.com`
2. Login with default credentials:
   - Username: `team1` / Password: `password123`
   - Or admin: `admin` / Password: `admin123`

## 🔧 Customization Checklist

### Before Your Contest:
- [ ] **Update Questions**: Edit `scripts/setup-questions.js` with real answers
- [ ] **Create User Accounts**: Modify `scripts/create-users.js` with participant credentials  
- [ ] **Test All Features**: Submissions, leaderboard, announcements
- [ ] **Configure Attempts**: Set question attempt limits (1-3 per question)
- [ ] **Verify Security**: Test that answers can't be found via inspect element

### Essential Changes:
```javascript
// In scripts/setup-questions.js - UPDATE THESE:
const sampleQuestions = [
    { id: 1, answer: YOUR_ANSWER_1, maxAttempts: 3 },
    { id: 2, answer: YOUR_ANSWER_2, maxAttempts: 3 },
    // ... up to 30 questions
];
```

### Security Verification:
1. Open browser developer tools
2. Try to find answers in Network, Sources, or Console tabs
3. Verify you only see "correct/incorrect" responses, never actual answers

## 📱 Features Your Participants Get:

### ✅ Secure Answer Submission
- 30 individual questions (0-9999 range)
- Configurable attempt limits per question
- Immediate feedback on correctness
- Real-time score updates

### ✅ Live Leaderboard  
- Real-time rankings
- Auto-refresh every 30 seconds
- Public view (no login required)
- Rank tracking and score display

### ✅ Contest Management
- Real-time announcements
- Question paper links
- Mobile-responsive design
- Professional contest aesthetics

### ✅ Anti-Cheating Security
- **Server-side answer validation** (answers NEVER sent to browser)
- JWT authentication with token expiration
- Rate limiting to prevent spam
- Complete submission audit trail

## 🆘 Troubleshooting

### Common Issues:

**"Login Failed"**
- Check if users are created: run `node scripts/create-users.js`
- Verify MongoDB connection in environment variables

**"Questions Not Loading"**  
- Run setup script: `node scripts/setup-questions.js`
- Check MongoDB Atlas IP whitelist (use `0.0.0.0/0` for all IPs)

**"Answers Visible in Browser"**
- This should be IMPOSSIBLE with the backend version
- If you see answers, you're using the old frontend-only version

### Need Help?
1. Check the full `README.md` for detailed documentation
2. Review `deployment-guide.md` for alternative hosting options
3. Test locally first: `npm install && npm start`

## 💡 Pro Tips

### For Large Contests:
- Monitor Render dashboard for performance metrics
- Upgrade to paid tier if you exceed 750 hours/month
- Consider multiple database replicas for backup

### For Extra Security:
- Change JWT_SECRET to a complex random string
- Enable MongoDB authentication in production
- Set up monitoring and error logging

### For Better Performance:
- Use Render's closest region to your participants
- Enable compression for faster loading
- Monitor database query performance

---

**Your secure contest portal is now live! 🎉**

**Default Login**: `team1` / `password123`  
**Admin Access**: `admin` / `admin123`

**Remember**: Update questions and user accounts before your actual contest!