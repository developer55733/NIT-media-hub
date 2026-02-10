-- Media Hub Database Schema (MySQL)
-- Complete database structure for YouTube-like media sharing platform

-- Create database
CREATE DATABASE IF NOT EXISTS media_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE media_hub;

-- Users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    channel_name VARCHAR(255),
    description TEXT,
    subscribers INT DEFAULT 0,
    total_views INT DEFAULT 0,
    video_count INT DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_channel_name (channel_name),
    INDEX idx_is_active (is_active)
);

-- Videos table
CREATE TABLE videos (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    duration VARCHAR(20),
    category VARCHAR(100) NOT NULL,
    tags JSON,
    visibility ENUM('public', 'private', 'unlisted') DEFAULT 'public',
    status ENUM('published', 'draft', 'processing') DEFAULT 'published',
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    comments INT DEFAULT 0,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    user_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_visibility (visibility),
    INDEX idx_status (status),
    INDEX idx_views (views),
    INDEX idx_upload_date (upload_date),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_search (title, description)
);

-- Comments table
CREATE TABLE comments (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    text TEXT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    user_id VARCHAR(255) NOT NULL,
    video_id VARCHAR(255) NOT NULL,
    parent_id VARCHAR(255),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_video_id (video_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at)
);

-- Likes table
CREATE TABLE likes (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    type ENUM('like', 'dislike') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    user_id VARCHAR(255) NOT NULL,
    video_id VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_video (user_id, video_id),
    INDEX idx_user_id (user_id),
    INDEX idx_video_id (video_id),
    INDEX idx_type (type)
);

-- Playlists table
CREATE TABLE playlists (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    video_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    user_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_is_public (is_public),
    INDEX idx_created_at (created_at)
);

-- Playlist videos junction table
CREATE TABLE playlist_videos (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    position INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    playlist_id VARCHAR(255) NOT NULL,
    video_id VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_playlist_video (playlist_id, video_id),
    INDEX idx_playlist_id (playlist_id),
    INDEX idx_video_id (video_id),
    INDEX idx_position (position)
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    user_id VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (channel_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_channel (user_id, channel_id),
    INDEX idx_user_id (user_id),
    INDEX idx_channel_id (channel_id),
    INDEX idx_created_at (created_at)
);

-- Video views tracking table (for analytics)
CREATE TABLE video_views (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    video_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_video_id (video_id),
    INDEX idx_user_id (user_id),
    INDEX idx_viewed_at (viewed_at),
    INDEX idx_ip_address (ip_address)
);

-- Watch history table
CREATE TABLE watch_history (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    watch_duration INT DEFAULT 0, -- seconds watched
    completed BOOLEAN DEFAULT FALSE,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    user_id VARCHAR(255) NOT NULL,
    video_id VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_video (user_id, video_id),
    INDEX idx_user_id (user_id),
    INDEX idx_video_id (video_id),
    INDEX idx_watched_at (watched_at)
);

-- Notifications table
CREATE TABLE notifications (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    type ENUM('video_upload', 'comment', 'like', 'subscription', 'mention') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    user_id VARCHAR(255) NOT NULL,
    actor_id VARCHAR(255),
    video_id VARCHAR(255),
    comment_id VARCHAR(255),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_actor_id (actor_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Reports table (for content moderation)
CREATE TABLE reports (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    reason ENUM('spam', 'inappropriate', 'copyright', 'violence', 'harassment', 'other') NOT NULL,
    description TEXT,
    status ENUM('pending', 'reviewed', 'resolved', 'dismissed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    
    reporter_id VARCHAR(255) NOT NULL,
    video_id VARCHAR(255),
    comment_id VARCHAR(255),
    user_id VARCHAR(255),
    
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_reporter_id (reporter_id),
    INDEX idx_status (status),
    INDEX idx_reason (reason),
    INDEX idx_created_at (created_at)
);

-- Settings table (for app configuration)
CREATE TABLE settings (
    id VARCHAR(255) PRIMARY KEY DEFAULT (UUID()),
    key_name VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key_name (key_name),
    INDEX idx_is_public (is_public)
);

-- Insert default settings
INSERT INTO settings (key_name, value, description, is_public) VALUES
('site_name', 'Media Hub', 'Site name displayed in header and title', TRUE),
('site_description', 'A comprehensive YouTube-like media sharing platform', 'Site description for SEO', TRUE),
('max_file_size', '104857600', 'Maximum file size in bytes (100MB)', FALSE),
('allowed_video_formats', '["mp4", "avi", "mov", "wmv", "flv", "webm"]', 'Allowed video file formats', FALSE),
('allowed_image_formats', '["jpg", "jpeg", "png", "gif"]', 'Allowed image file formats', FALSE),
('registration_enabled', 'true', 'Allow new user registration', TRUE),
('comments_enabled', 'true', 'Allow comments on videos', TRUE),
('uploads_require_approval', 'false', 'Require admin approval for video uploads', FALSE),
('default_video_visibility', 'public', 'Default visibility for new videos', FALSE);

-- Create views for common queries

-- Trending videos view (videos with high engagement in last 7 days)
CREATE VIEW trending_videos AS
SELECT 
    v.*,
    u.username,
    u.channel_name,
    u.avatar as channel_avatar,
    u.subscribers as channel_subscribers,
    (v.views + v.likes + v.comments) as engagement_score
FROM videos v
JOIN users u ON v.user_id = u.id
WHERE v.status = 'published' 
    AND v.visibility = 'public'
    AND v.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY engagement_score DESC, v.views DESC;

-- User statistics view
CREATE VIEW user_statistics AS
SELECT 
    u.id,
    u.username,
    u.channel_name,
    u.subscribers,
    u.total_views,
    u.video_count,
    COUNT(DISTINCT v.id) as actual_video_count,
    COALESCE(SUM(v.views), 0) as total_video_views,
    COALESCE(SUM(v.likes), 0) as total_video_likes,
    COALESCE(SUM(v.comments), 0) as total_video_comments
FROM users u
LEFT JOIN videos v ON u.id = v.user_id AND v.status = 'published'
GROUP BY u.id, u.username, u.channel_name, u.subscribers, u.total_views, u.video_count;

-- Video statistics view
CREATE VIEW video_statistics AS
SELECT 
    v.*,
    u.username,
    u.channel_name,
    u.avatar as channel_avatar,
    u.subscribers as channel_subscribers,
    COUNT(DISTINCT c.id) as actual_comment_count,
    COUNT(DISTINCT l.id) as actual_like_count,
    COUNT(DISTINCT CASE WHEN l.type = 'dislike' THEN l.id END) as actual_dislike_count
FROM videos v
JOIN users u ON v.user_id = u.id
LEFT JOIN comments c ON v.id = c.video_id
LEFT JOIN likes l ON v.id = l.video_id
GROUP BY v.id, u.username, u.channel_name, u.avatar, u.subscribers;

-- Create triggers for maintaining counts

-- Update video comment count
DELIMITER //
CREATE TRIGGER update_video_comment_count 
    AFTER INSERT ON comments 
    FOR EACH ROW
BEGIN
    UPDATE videos 
    SET comments = comments + 1 
    WHERE id = NEW.video_id;
END//
DELIMITER ;

-- Update video comment count on delete
DELIMITER //
CREATE TRIGGER update_video_comment_count_delete 
    AFTER DELETE ON comments 
    FOR EACH ROW
BEGIN
    UPDATE videos 
    SET comments = GREATEST(comments - 1, 0) 
    WHERE id = OLD.video_id;
END//
DELIMITER ;

-- Update user video count
DELIMITER //
CREATE TRIGGER update_user_video_count 
    AFTER INSERT ON videos 
    FOR EACH ROW
BEGIN
    UPDATE users 
    SET video_count = video_count + 1 
    WHERE id = NEW.user_id;
END//
DELIMITER ;

-- Update user video count on delete
DELIMITER //
CREATE TRIGGER update_user_video_count_delete 
    AFTER DELETE ON videos 
    FOR EACH ROW
BEGIN
    UPDATE users 
    SET video_count = GREATEST(video_count - 1, 0) 
    WHERE id = OLD.user_id;
END//
DELIMITER ;

-- Update subscription count
DELIMITER //
CREATE TRIGGER update_subscription_count 
    AFTER INSERT ON subscriptions 
    FOR EACH ROW
BEGIN
    UPDATE users 
    SET subscribers = subscribers + 1 
    WHERE id = NEW.channel_id;
END//
DELIMITER ;

-- Update subscription count on unsubscribe
DELIMITER //
CREATE TRIGGER update_subscription_count_delete 
    AFTER DELETE ON subscriptions 
    FOR EACH ROW
BEGIN
    UPDATE users 
    SET subscribers = GREATEST(subscribers - 1, 0) 
    WHERE id = OLD.channel_id;
END//
DELIMITER ;

-- Create stored procedures for common operations

-- Procedure to get trending videos with pagination
DELIMITER //
CREATE PROCEDURE GetTrendingVideos(
    IN page_offset INT,
    IN page_limit INT,
    IN time_range VARCHAR(20)
)
BEGIN
    DECLARE date_limit DATETIME;
    
    CASE time_range
        WHEN 'today' THEN SET date_limit = DATE_SUB(NOW(), INTERVAL 1 DAY);
        WHEN 'week' THEN SET date_limit = DATE_SUB(NOW(), INTERVAL 7 DAY);
        WHEN 'month' THEN SET date_limit = DATE_SUB(NOW(), INTERVAL 30 DAY);
        ELSE SET date_limit = DATE_SUB(NOW(), INTERVAL 7 DAY);
    END CASE;
    
    SELECT 
        v.*,
        u.username,
        u.channel_name,
        u.avatar as channel_avatar,
        u.subscribers as channel_subscribers
    FROM videos v
    JOIN users u ON v.user_id = u.id
    WHERE v.status = 'published' 
        AND v.visibility = 'public'
        AND v.created_at >= date_limit
    ORDER BY (v.views + v.likes + v.comments) DESC, v.created_at DESC
    LIMIT page_limit OFFSET page_offset;
END//
DELIMITER ;

-- Procedure to search videos
DELIMITER //
CREATE PROCEDURE SearchVideos(
    IN search_query TEXT,
    IN category_filter VARCHAR(100),
    IN sort_by VARCHAR(20),
    IN page_offset INT,
    IN page_limit INT
)
BEGIN
    SELECT 
        v.*,
        u.username,
        u.channel_name,
        u.avatar as channel_avatar,
        u.subscribers as channel_subscribers,
        MATCH(v.title, v.description) AGAINST(search_query IN NATURAL LANGUAGE MODE) as relevance_score
    FROM videos v
    JOIN users u ON v.user_id = u.id
    WHERE v.status = 'published' 
        AND v.visibility = 'public'
        AND (category_filter IS NULL OR v.category = category_filter)
        AND MATCH(v.title, v.description) AGAINST(search_query IN NATURAL LANGUAGE MODE)
    ORDER BY 
        CASE 
            WHEN sort_by = 'relevance' THEN relevance_score
            WHEN sort_by = 'views' THEN v.views
            WHEN sort_by = 'likes' THEN v.likes
            WHEN sort_by = 'date' THEN v.created_at
            ELSE v.created_at
        END DESC
    LIMIT page_limit OFFSET page_offset;
END//
DELIMITER ;

-- Procedure to get user recommendations
DELIMITER //
CREATE PROCEDURE GetUserRecommendations(
    IN user_id_param VARCHAR(255),
    IN limit_count INT
)
BEGIN
    -- Get videos from channels user is subscribed to
    SELECT 
        v.*,
        u.username,
        u.channel_name,
        u.avatar as channel_avatar,
        u.subscribers as channel_subscribers,
        'subscription' as recommendation_type
    FROM videos v
    JOIN users u ON v.user_id = u.id
    JOIN subscriptions s ON u.id = s.channel_id
    WHERE s.user_id = user_id_param
        AND v.status = 'published'
        AND v.visibility = 'public'
        AND v.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    
    UNION ALL
    
    -- Get popular videos in categories user watches
    SELECT 
        v.*,
        u.username,
        u.channel_name,
        u.avatar as channel_avatar,
        u.subscribers as channel_subscribers,
        'trending' as recommendation_type
    FROM videos v
    JOIN users u ON v.user_id = u.id
    JOIN watch_history wh ON v.id = wh.video_id
    WHERE wh.user_id = user_id_param
        AND v.status = 'published'
        AND v.visibility = 'public'
        AND v.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    
    ORDER BY created_at DESC
    LIMIT limit_count;
END//
DELIMITER ;

-- Create indexes for better performance
CREATE INDEX idx_videos_category_views ON videos(category, views DESC);
CREATE INDEX idx_videos_status_visibility ON videos(status, visibility);
CREATE INDEX idx_comments_video_created ON comments(video_id, created_at DESC);
CREATE INDEX idx_likes_video_type ON likes(video_id, type);
CREATE INDEX idx_subscriptions_user_created ON subscriptions(user_id, created_at DESC);
CREATE INDEX idx_watch_history_user_watched ON watch_history(user_id, watched_at DESC);

-- Final setup
-- Set foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Show table structure
SHOW TABLES;
