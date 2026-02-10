# Media Hub - Railway Deployment Guide

A comprehensive YouTube-like media sharing platform deployed on Railway with MySQL database.

## 🚀 Railway Deployment

### Prerequisites
- Railway account
- GitHub repository with this code
- MySQL database on Railway

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push origin main
   ```

2. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect the Node.js app

3. **Configure Environment Variables**
   In your Railway project settings, add these environment variables:

   ```env
   # Server Configuration
   NODE_ENV=production
   PORT=3000

   # Database (Railway provides this automatically)
   DATABASE_URL=postgresql://username:password@host:port/database

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # File Upload Configuration
   MAX_FILE_SIZE=104857600
   UPLOAD_DIR=uploads

   # CORS Configuration
   CORS_ORIGIN=https://your-app-name.railway.app

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # Security
   BCRYPT_ROUNDS=12

   # Cloudinary (Optional - for file storage)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Database Setup**
   - Railway will automatically create a MySQL database
   - The `DATABASE_URL` will be provided automatically
   - Run database migrations:
     ```bash
     railway run npm run db:migrate
     railway run npm run db:seed
     ```

5. **Deploy**
   - Railway will automatically deploy when you push changes
   - Monitor deployment logs in Railway dashboard

## 📁 Project Structure

```
media-hub/
├── controllers/          # API controllers
│   ├── authController.js
│   ├── videoController.js
│   ├── commentController.js
│   ├── likeController.js
│   └── userController.js
├── middleware/           # Express middleware
│   ├── auth.js
│   └── upload.js
├── routes/              # API routes
│   ├── auth.js
│   ├── videos.js
│   ├── comments.js
│   ├── likes.js
│   └── users.js
├── prisma/              # Database schema and migrations
│   ├── schema.prisma
│   └── seed.js
├── js/                  # Frontend JavaScript
│   └── api.js          # API service
├── uploads/             # Local file storage (if not using Cloudinary)
├── server.js            # Main server file
├── index.html           # Frontend
├── script.js            # Frontend logic
├── style.css            # Styles
├── package.json         # Dependencies
├── railway.toml         # Railway configuration
├── Procfile            # Process definition
├── .env.example        # Environment variables template
└── README-RAILWAY.md   # This file
```

## 🗄️ Database Schema

The application uses MySQL with the following main models:

- **Users**: Authentication, profiles, channels
- **Videos**: Video metadata, storage, statistics
- **Comments**: User interactions with videos
- **Likes**: User reactions to content
- **Playlists**: User-curated content collections
- **Subscriptions**: Channel following system

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/avatar` - Update avatar

### Videos
- `GET /api/videos` - Get videos with pagination/filtering
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Create video (authenticated)
- `PUT /api/videos/:id` - Update video (owner only)
- `DELETE /api/videos/:id` - Delete video (owner only)
- `GET /api/videos/trending` - Get trending videos
- `POST /api/videos/upload` - Upload video with file

### Comments
- `GET /api/comments/:videoId` - Get video comments
- `POST /api/comments/:videoId` - Create comment
- `PUT /api/comments/:id` - Update comment (owner only)
- `DELETE /api/comments/:id` - Delete comment (owner/video owner)
- `POST /api/comments/:id/like` - Like comment

### Likes
- `POST /api/likes/:videoId` - Toggle video like/dislike
- `GET /api/likes/:videoId/status` - Get user's like status
- `GET /api/likes/:videoId` - Get video like counts

### Users
- `GET /api/users/:userId` - Get user profile
- `POST /api/users/:channelId/subscribe` - Toggle subscription
- `GET /api/users/:channelId/subscribe/status` - Check subscription status
- `GET /api/users/search` - Search users
- `GET /api/users/subscriptions/list` - Get user subscriptions

## 📦 File Storage

### Options:
1. **Cloudinary** (Recommended for production)
   - Configure environment variables
   - Automatic image/video optimization
   - CDN delivery

2. **Local Storage** (Default fallback)
   - Files stored in `/uploads` directory
   - Not persistent across deployments
   - Good for development

## 🔒 Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js for security headers
- Input validation with Joi
- SQL injection prevention with Prisma

## 🚀 Performance Features

- Database connection pooling
- Efficient queries with Prisma
- Pagination for large datasets
- Caching headers for static assets
- Optimized file uploads

## 📊 Monitoring

### Health Check
- `GET /api/health` - Application health status

### Railway Dashboard
- View deployment logs
- Monitor resource usage
- Database metrics
- Error tracking

## 🔄 Development Workflow

1. **Local Development**
   ```bash
   npm install
   cp .env.example .env
   # Configure .env with local database
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

2. **Database Management**
   ```bash
   npm run db:studio    # Open Prisma Studio
   npm run db:push      # Push schema changes
   npm run db:migrate   # Run migrations
   ```

3. **Deploy to Railway**
   ```bash
   git add .
   git commit -m "Update for deployment"
   git push origin main
   ```

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection**
   - Ensure `DATABASE_URL` is correct
   - Check Railway database status
   - Run migrations manually if needed

2. **File Upload Issues**
   - Check file size limits
   - Verify Cloudinary credentials (if used)
   - Ensure proper MIME types

3. **Authentication Problems**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser localStorage

4. **Deployment Failures**
   - Check Railway build logs
   - Verify all dependencies in package.json
   - Ensure proper start script

## 📝 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Required for production
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key

# Optional but recommended
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Performance tuning
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Scaling

### Railway Auto-scaling:
- Automatic horizontal scaling
- Load balancing
- Database connection pooling

### Recommendations:
- Use Cloudinary for file storage
- Enable Railway's automatic scaling
- Monitor database performance
- Consider Redis for caching (future enhancement)

## 📞 Support

For issues with:
- **Railway**: Check Railway docs/support
- **Database**: Review Prisma documentation
- **Application**: Check GitHub issues or create new one

---

**Note**: This application is production-ready with proper security, database integration, and deployment configuration. Replace placeholder values with your actual credentials before deploying to production.
