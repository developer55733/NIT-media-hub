# Media Hub - MySQL Database Version

A comprehensive YouTube-like media sharing platform using MySQL database instead of PostgreSQL.

## 🗄️ Database Setup

### Prerequisites
- MySQL Server 8.0+ or MariaDB 10.5+
- Node.js 14+
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Database**
   ```bash
   # Copy MySQL environment template
   cp .env.mysql .env
   
   # Edit .env with your MySQL credentials
   nano .env
   ```

3. **Create Database**
   ```bash
   # Login to MySQL
   mysql -u root -p
   
   # Create database (optional, schema.sql does this)
   CREATE DATABASE media_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **Initialize Database Schema**
   ```bash
   # Import schema
   npm run mysql:init
   
   # Or manually:
   mysql -u root -p < database/schema.sql
   ```

5. **Seed Sample Data**
   ```bash
   # Import sample data
   npm run mysql:seed
   
   # Or manually:
   mysql -u root -p media_hub < database/seed.sql
   ```

6. **Start Server**
   ```bash
   # Development with auto-reload
   npm run dev:mysql
   
   # Production
   npm run start:mysql
   ```

## 📁 Database Structure

### Core Tables

- **users** - User accounts and profiles
- **videos** - Video metadata and content
- **comments** - Nested comments with threading
- **likes** - Video likes/dislikes
- **subscriptions** - Channel subscriptions
- **playlists** - User video collections
- **playlist_videos** - Playlist-video relationships

### Analytics Tables

- **video_views** - View tracking for analytics
- **watch_history** - User viewing history
- **notifications** - User notifications
- **reports** - Content moderation

### Configuration

- **settings** - Application configuration

## 🔧 Database Features

### Advanced Indexing
- Full-text search on video titles and descriptions
- Composite indexes for common query patterns
- Optimized for pagination and sorting

### Triggers
- Automatic count updates for comments, likes, subscriptions
- Maintains data consistency across related tables

### Stored Procedures
- `GetTrendingVideos()` - Trending content with time filtering
- `SearchVideos()` - Full-text search with relevance scoring
- `GetUserRecommendations()` - Personalized content recommendations

### Views
- `trending_videos` - Pre-computed trending content
- `user_statistics` - User analytics dashboard
- `video_statistics` - Video performance metrics

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user profile

### Videos
- `GET /api/videos` - List videos with pagination/filtering
- `GET /api/videos/:id` - Get single video details
- `POST /api/videos` - Upload new video (authenticated)
- `GET /api/videos/trending` - Get trending videos

### Comments
- `GET /api/comments/:videoId` - Get video comments
- `POST /api/comments/:videoId` - Add comment (authenticated)

### Likes
- `POST /api/likes/:videoId` - Toggle like/dislike (authenticated)

### Health Check
- `GET /api/health` - Server and database status

## 📊 Sample Data

The seed file includes:

- **5 Sample Users**: Including admin account
- **10 Sample Videos**: Various categories (movies, courses, gaming, music)
- **Sample Comments**: Realistic comment threads
- **Likes & Subscriptions**: User interaction data
- **Playlists & Watch History**: User engagement data

### Default Accounts
```
Email: admin@mediahub.com
Password: admin123
Role: Admin

Email: nature@mediahub.com
Password: password123
Role: Creator

Email: code@mediahub.com
Password: password123
Role: Creator
```

## 🔍 Query Examples

### Get Trending Videos
```sql
SELECT * FROM trending_videos LIMIT 10;
```

### Search Videos
```sql
CALL SearchVideos('javascript tutorial', 'courses', 'relevance', 0, 20);
```

### User Statistics
```sql
SELECT * FROM user_statistics WHERE username = 'codeacademy';
```

### Video Analytics
```sql
SELECT * FROM video_statistics WHERE id = 'video-002';
```

## 🛠️ Development Commands

```bash
# Database operations
npm run mysql:init      # Create database schema
npm run mysql:seed      # Insert sample data
npm run mysql:console   # Open MySQL console

# Server operations
npm run dev:mysql       # Development with nodemon
npm run start:mysql     # Production server

# View database
mysql -u root -p media_hub
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=media_hub

# Server
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key
BCRYPT_ROUNDS=12

# File Upload
MAX_FILE_SIZE=104857600  # 100MB
```

## 📈 Performance Optimization

### Database Indexes
- Primary keys on all tables
- Foreign key constraints with indexes
- Composite indexes for common queries
- Full-text search indexes

### Connection Pooling
- Configurable connection limits
- Automatic connection recovery
- Query timeout handling

### Caching Strategy
- View pre-computation for trending content
- Materialized views for statistics
- Query result caching

## 🔒 Security Features

### Database Security
- Prepared statements to prevent SQL injection
- Input validation and sanitization
- Role-based access control
- Password hashing with bcrypt

### Application Security
- JWT authentication with expiration
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js security headers

## 📝 Migration from PostgreSQL

If migrating from the PostgreSQL version:

1. **Export existing data** (if any)
2. **Update environment variables** to use MySQL
3. **Run MySQL schema**: `npm run mysql:init`
4. **Migrate data** manually or with custom scripts
5. **Update start command**: `npm run start:mysql`

## 🐛 Troubleshooting

### Common Issues

1. **Connection Failed**
   ```bash
   # Check MySQL service
   sudo systemctl status mysql
   
   # Check credentials in .env
   mysql -u root -p -h localhost
   ```

2. **Schema Import Errors**
   ```bash
   # Check MySQL version compatibility
   mysql --version
   
   # Import manually for error details
   mysql -u root -p < database/schema.sql
   ```

3. **Permission Errors**
   ```sql
   -- Grant privileges
   GRANT ALL PRIVILEGES ON media_hub.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Debug Mode
Enable detailed logging:
```bash
DEBUG=app:* npm run dev:mysql
```

## 📊 Monitoring

### Database Health
```sql
-- Check connection count
SHOW STATUS LIKE 'Threads_connected';

-- Check slow queries
SHOW VARIABLES LIKE 'slow_query_log';

-- Analyze query performance
EXPLAIN SELECT * FROM videos WHERE category = 'courses';
```

### Application Health
```bash
# Health check endpoint
curl http://localhost:3000/api/health

# Database statistics
curl http://localhost:3000/api/health | jq '.database'
```

## 🚀 Production Deployment

### Railway (MySQL Add-on)
1. Add MySQL database from Railway marketplace
2. Update environment variables with Railway MySQL URL
3. Deploy using `server-mysql.js`
4. Run migrations: `npm run mysql:init`

### Docker MySQL
```dockerfile
FROM mysql:8.0
COPY database/schema.sql /docker-entrypoint-initdb.d/
```

### Traditional Hosting
- Install MySQL server
- Create database and user
- Import schema and seed data
- Configure connection in .env
- Start application

## 📚 API Documentation

### Response Format
```json
{
  "videos": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Handling
```json
{
  "error": "Error message description"
}
```

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

---

**Note**: This MySQL version provides the same functionality as the PostgreSQL version but uses native MySQL syntax and features. Choose the version that best fits your infrastructure and expertise.
