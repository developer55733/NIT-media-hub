# 🚀 Media Hub - Railway Deployment Guide

## ✅ **DEPLOYMENT STATUS: READY**

All components have been verified and are ready for Railway deployment!

---

## 📋 **Pre-Deployment Checklist**

### ✅ **Files Verified**
- [x] Server files (server.js, server-mysql.js)
- [x] Package configuration (package.json)
- [x] Railway configuration (railway.toml, Procfile)
- [x] Database schemas (Prisma + MySQL)
- [x] Environment template (.env.example)
- [x] All controllers and routes
- [x] Frontend files (HTML, CSS, JS)

### ✅ **Dependencies Verified**
- [x] Express.js framework
- [x] Database clients (Prisma + MySQL2)
- [x] Authentication (JWT, bcrypt)
- [x] Validation (Joi)
- [x] Security (Helmet, CORS, rate limiting)
- [x] File handling (Multer, Cloudinary)

### ✅ **API Endpoints Verified**
- [x] Authentication (register, login, profile)
- [x] Video management (CRUD operations)
- [x] Comments system (threaded comments)
- [x] Likes system (like/dislike)
- [x] User management (profiles, subscriptions)
- [x] Playlists (create, manage, share)
- [x] Notifications (real-time alerts)
- [x] Analytics (channel, video, platform)
- [x] Search (global, advanced, suggestions)

---

## 🚀 **Deployment Steps**

### **1. Push to GitHub**
```bash
git add .
git commit -m "Ready for Railway deployment - Complete media sharing platform"
git push origin main
```

### **2. Deploy to Railway**

#### **Option A: Railway Dashboard**
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `NIT-media-hub` repository
4. Railway will automatically detect Node.js app

#### **Option B: Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

### **3. Configure Environment Variables**

In your Railway project settings, add these environment variables:

#### **Database Configuration**
```env
# Choose ONE database option:

# Option 1: PostgreSQL (Recommended)
DATABASE_URL=postgresql://username:password@host:port/database

# Option 2: MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=username
DB_PASSWORD=password
DB_NAME=media_hub
```

#### **Application Configuration**
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-app-name.railway.app
```

#### **Security Configuration**
```env
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### **File Upload Configuration**
```env
MAX_FILE_SIZE=104857600
UPLOAD_DIR=uploads
```

#### **Cloudinary (Optional - Recommended)**
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### **4. Database Setup**

#### **For PostgreSQL (Prisma)**
```bash
# Run migrations (Railway will provide DATABASE_URL)
railway run npm run db:migrate
railway run npm run db:seed
```

#### **For MySQL**
```bash
# Initialize database
railway run npm run mysql:init
railway run npm run mysql:seed
```

### **5. Start the Application**

Railway will automatically start your application with:
```bash
npm start  # For PostgreSQL
# or
npm run start:mysql  # For MySQL
```

---

## 🔧 **Database Choice**

### **PostgreSQL (Recommended)**
- **Pros**: Modern ORM, better performance, Railway native support
- **Use**: `npm start` command
- **Schema**: `prisma/schema.prisma`

### **MySQL**
- **Pros**: Familiar SQL syntax, widespread hosting support
- **Use**: `npm run start:mysql` command
- **Schema**: `database/schema.sql`

---

## 🌐 **Accessing Your Application**

Once deployed, your app will be available at:
```
https://your-app-name.railway.app
```

### **API Endpoints**
```
https://your-app-name.railway.app/api/health
```

### **Admin Access**
Default admin account:
```
Email: admin@mediahub.com
Password: admin123
```

---

## 🔍 **Testing & Verification**

### **Health Check**
```bash
curl https://your-app-name.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-10T12:00:00.000Z",
  "uptime": 3600
}
```

### **API Testing**
```bash
# Test video endpoint
curl https://your-app-name.railway.app/api/videos

# Test authentication
curl -X POST https://your-app-name.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mediahub.com","password":"admin123"}'
```

---

## 📊 **Monitoring**

### **Railway Dashboard**
- View deployment logs
- Monitor resource usage
- Check database status
- Track performance metrics

### **Application Logs**
```bash
# View real-time logs
railway logs

# View specific service logs
railway logs web
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Database Connection**
```bash
# Check database URL format
# Verify database is running
# Check Railway database status
```

#### **Build Failures**
```bash
# Check package.json dependencies
# Verify Node.js version compatibility
# Review build logs in Railway dashboard
```

#### **Runtime Errors**
```bash
# Check environment variables
# Review application logs
# Verify file permissions
```

### **Debug Mode**
Enable debug logging:
```env
DEBUG=app:*
NODE_ENV=development
```

---

## 🔄 **Post-Deployment**

### **Domain Configuration**
1. Go to Railway project settings
2. Add custom domain (optional)
3. Configure SSL (automatic)

### **Scaling**
1. Enable auto-scaling in Railway settings
2. Configure resource limits
3. Set up monitoring alerts

### **Backup Strategy**
1. Enable Railway automatic backups
2. Configure database backups
3. Set up disaster recovery

---

## 📞 **Support**

### **Documentation**
- [FEATURES.md](./FEATURES.md) - Complete feature list
- [README-RAILWAY.md](./README-RAILWAY.md) - Railway-specific guide
- [README-MYSQL.md](./README-MYSQL.md) - MySQL setup guide

### **Common Commands**
```bash
# Local development
npm run dev              # PostgreSQL
npm run dev:mysql         # MySQL

# Database operations
npm run db:studio         # Prisma Studio
npm run mysql:console      # MySQL console

# Deployment
railway up               # Deploy via CLI
git push origin main     # Deploy via GitHub
```

---

## 🎉 **Success Criteria**

Your deployment is successful when:

- [x] Application starts without errors
- [x] Health check returns 200 OK
- [x] Database connection established
- [x] API endpoints respond correctly
- [x] Frontend loads and functions
- [x] File uploads work properly
- [x] Authentication system works

---

## 🚀 **Ready to Launch!**

Your Media Hub is now a **production-ready, enterprise-grade** media sharing platform with:

- ✅ Complete YouTube-like functionality
- ✅ Advanced analytics and insights
- ✅ Real-time notifications
- ✅ Comprehensive search
- ✅ Playlist management
- ✅ Security-first architecture
- ✅ Railway deployment ready

**🎯 Deploy now and start your media platform!**

---

*Last Updated: 2024-01-10*  
*Version: 2.0.0*  
*Status: Production Ready*
