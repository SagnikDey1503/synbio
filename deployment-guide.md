# Free Hosting Deployment Guide for Quizzicles Contest Portal

## Quick Start - Render.com (Recommended)

### Why Render.com?
- ✅ **750 hours/month free tier** (sufficient for contests)
- ✅ **Automatic HTTPS** and custom domains
- ✅ **GitHub integration** with auto-deploy
- ✅ **Built-in database hosting** (PostgreSQL/Redis)
- ✅ **Zero configuration** for Node.js apps

### Step-by-Step Deployment

#### 1. Prepare Your Repository
```bash
# Clone/create your project
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### 2. Deploy to Render
1. **Sign up** at [render.com](https://render.com) using GitHub
2. **Create Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your contest portal

#### 3. Configure Web Service
```yaml
Name: quizzicles-contest-portal
Region: Oregon (US West) # or closest to your users
Branch: main
Runtime: Node
Build Command: npm install
Start Command: npm start
```

#### 4. Environment Variables
Add these in Render dashboard:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quizzicles
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
BCRYPT_ROUNDS=12
```

#### 5. Database Setup (MongoDB Atlas)
1. **Create free cluster** at [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Configure access**:
   - Add IP address: `0.0.0.0/0` (allow all)
   - Create database user with password
3. **Get connection string** and add to Render environment variables

#### 6. Deploy and Test
- Render will automatically build and deploy
- Your app will be available at: `https://your-app-name.onrender.com`
- Test login with default credentials from setup script

## Alternative Free Hosting Options

### Vercel (Serverless)

**Best for:** High-traffic, auto-scaling applications

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
```

**Pros:** 
- Lightning fast global CDN
- Automatic scaling
- Zero configuration

**Cons:**
- Serverless limitations (10-second timeout)
- More complex for real-time features

### Railway

**Best for:** Simple deployment with databases

1. **Connect repository** at [railway.app](https://railway.app)
2. **Add MongoDB plugin** from Railway marketplace
3. **Set environment variables** in dashboard
4. **Deploy automatically** on git push

**Pros:**
- Built-in database hosting
- Simple configuration
- Good free tier

### Fly.io

**Best for:** Global deployment with edge computing

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Launch app
fly launch

# Set secrets
fly secrets set JWT_SECRET=your-secret
fly secrets set MONGODB_URI=your-mongodb-uri

# Deploy
fly deploy
```

**Pros:**
- Global edge deployment
- Excellent performance
- Docker-based deployment

### Glitch

**Best for:** Rapid prototyping and testing

1. **Import from GitHub** at [glitch.com](https://glitch.com)
2. **Add .env file** with environment variables
3. **Auto-deploy** on code changes

**Pros:**
- Instant deployment
- Live code editing
- Great for testing

## Database Hosting Options

### MongoDB Atlas (Recommended)
- **512MB free tier** (sufficient for contests)
- **Global clusters** with automatic backups
- **Built-in security** and monitoring

### PlanetScale (MySQL Alternative)
- **10GB free tier** with branching
- **Serverless scaling**
- **Built-in analytics**

### Supabase (PostgreSQL)
- **500MB free database**
- **Built-in authentication** (optional)
- **Real-time subscriptions**

## Production Optimizations

### Performance
```javascript
// Add to server.js for production
if (process.env.NODE_ENV === 'production') {
    app.use(compression()); // Gzip compression
    app.use(express.static('public', {
        maxAge: '1d',
        etag: false
    }));
}
```

### Security
```env
# Production environment variables
NODE_ENV=production
JWT_SECRET=use-a-strong-random-string-here
MONGODB_URI=your-production-database-uri
ALLOWED_ORIGINS=https://your-domain.com
```

### Monitoring
```javascript
// Add error tracking
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```

## Custom Domain Setup

### Render.com
1. **Add custom domain** in service settings
2. **Configure DNS** records:
   ```
   Type: CNAME
   Name: @ (or subdomain)
   Value: your-app-name.onrender.com
   ```
3. **SSL certificate** automatically provisioned

### Cloudflare (Free CDN)
1. **Add site** to Cloudflare
2. **Update nameservers** at domain registrar
3. **Configure page rules** for caching
4. **Enable SSL/TLS** encryption

## Troubleshooting Common Issues

### Build Failures
```bash
# Check Node.js version compatibility
node --version  # Should be 14+

# Clear npm cache
npm cache clean --force

# Install dependencies locally first
npm install
npm start
```

### Database Connection Issues
```javascript
// Test MongoDB connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('DB Connected'))
    .catch(err => console.error('DB Error:', err));
```

### Environment Variable Problems
```bash
# Verify environment variables are set
echo $MONGODB_URI
echo $JWT_SECRET

# Check in application
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
```

## Cost Estimates

### Free Tier Limits
| Platform | Bandwidth | Storage | Database | Limitations |
|----------|-----------|---------|----------|-------------|
| Render | 100GB/month | Ephemeral | Separate | 750 hours/month |
| Vercel | 100GB/month | Ephemeral | Separate | 100GB serverless |
| Railway | 1GB/month | 1GB | 1GB | $5 credit |
| Fly.io | 160GB/month | 1GB | Separate | 2 VMs |

### Scaling Costs
- **Small contest** (< 100 users): Free tier sufficient
- **Medium contest** (< 1000 users): $5-10/month
- **Large contest** (> 1000 users): $20-50/month

## Pre-Contest Checklist

### 1 Week Before
- [ ] Deploy to production environment
- [ ] Test with sample users and questions
- [ ] Configure custom domain and SSL
- [ ] Set up monitoring and error tracking
- [ ] Prepare backup and recovery plan

### 1 Day Before
- [ ] Load actual questions and answers
- [ ] Create participant accounts
- [ ] Test real-time features (leaderboard, announcements)
- [ ] Verify mobile responsiveness
- [ ] Share portal URL with participants

### Contest Day
- [ ] Monitor server performance
- [ ] Have admin accounts ready for announcements
- [ ] Keep backup communication channels open
- [ ] Monitor error logs and user feedback

## Support Resources

### Documentation
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Node.js Deployment Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

### Community Support
- Stack Overflow: `#nodejs #mongodb #express`
- Discord: Node.js Community Server
- Reddit: r/node, r/webdev

---

**Ready to host your contest? Choose your platform and follow the guide above!** 🚀