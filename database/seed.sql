-- Media Hub Database Seed Data (MySQL)
-- Sample data for testing and demonstration

USE media_hub;

-- Insert sample users
INSERT INTO users (id, email, username, password, channel_name, description, avatar, subscribers, total_views, video_count, is_admin, is_active) VALUES
('admin-001', 'admin@mediahub.com', 'admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'Media Hub Admin', 'Official Media Hub administrator account', 'https://picsum.photos/seed/admin/100/100.jpg', 0, 0, 0, TRUE, TRUE),
('user-001', 'nature@mediahub.com', 'naturechannel', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'Nature Channel', 'Amazing nature documentaries and wildlife content from around the world', 'https://picsum.photos/seed/nature/100/100.jpg', 1250000, 5000000, 45, FALSE, TRUE),
('user-002', 'code@mediahub.com', 'codeacademy', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'Code Academy', 'Learn programming and web development with our comprehensive tutorials', 'https://picsum.photos/seed/code/100/100.jpg', 890000, 3000000, 32, FALSE, TRUE),
('user-003', 'gaming@mediahub.com', 'gamingcentral', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'Gaming Central', 'Epic gaming moments, walkthroughs, and gaming news', 'https://picsum.photos/seed/gaming/100/100.jpg', 2100000, 8000000, 67, FALSE, TRUE),
('user-004', 'music@mediahub.com', 'musicbeats', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'Music Beats', 'Discover new music and artists from around the globe', 'https://picsum.photos/seed/music/100/100.jpg', 567000, 2000000, 28, FALSE, TRUE);

-- Insert sample videos
INSERT INTO videos (id, title, description, thumbnail, video_url, duration, category, tags, visibility, status, views, likes, dislikes, comments, upload_date, user_id) VALUES
('video-001', 'Amazing Nature Documentary - 4K Ultra HD', 'Experience the breathtaking beauty of nature in stunning 4K resolution. This documentary takes you on a journey through the world\'s most spectacular landscapes, from mountains to oceans, forests to deserts.', 'https://picsum.photos/seed/nature1/400/225.jpg', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', '12:34', 'movies', '["nature", "documentary", "4k", "wildlife", "landscape"]', 'public', 'published', 1542000, 45600, 234, 89, '2024-01-10', 'user-001'),

('video-002', 'Learn JavaScript - Complete Course for Beginners', 'Start your web development journey with this comprehensive JavaScript course. Perfect for absolute beginners who want to learn programming from scratch.', 'https://picsum.photos/seed/js-course/400/225.jpg', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', '45:20', 'courses', '["javascript", "programming", "tutorial", "web development", "beginner"]', 'public', 'published', 893000, 23400, 123, 156, '2024-01-08', 'user-002'),

('video-003', 'Epic Gaming Moments 2024 Compilation', 'The most epic gaming moments of 2024! Watch incredible plays, funny fails, and amazing skills from top gamers around the world.', 'https://picsum.photos/seed/gaming1/400/225.jpg', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4', '18:45', 'gaming', '["gaming", "compilation", "epic moments", "2024", "funny"]', 'public', 'published', 2345000, 89000, 456, 234, '2024-01-12', 'user-003'),

('video-004', 'Relaxing Music for Study and Focus', 'Calm instrumental music perfect for studying, reading, or concentration. Let these peaceful melodies help you focus and relax.', 'https://picsum.photos/seed/music1/400/225.jpg', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_3mb.mp4', '1:02:15', 'music', '["music", "relaxing", "study", "focus", "instrumental", "ambient"]', 'public', 'published', 567000, 12300, 89, 67, '2024-01-15', 'user-004'),

('video-005', 'Web Development Full Course - HTML, CSS, JavaScript', 'Complete web development course covering everything from basics to advanced concepts. Learn HTML5, CSS3, and JavaScript ES6+.', 'https://picsum.photos/seed/webdev/400/225.jpg', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_4mb.mp4', '2:15:30', 'courses', '["web development", "html", "css", "javascript", "full course", "tutorial"]', 'public', 'published', 1234000, 45600, 234, 189, '2024-01-05', 'user-002'),

('video-006', 'Wildlife Safari Adventure', 'Join us on an incredible wildlife safari through the African savanna. See lions, elephants, giraffes, and more in their natural habitat.', 'https://picsum.photos/seed/safari/400/225.jpg', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_6mb.mp4', '25:18', 'movies', '["wildlife", "safari", "africa", "animals", "nature"]', 'public', 'published', 890000, 34500, 123, 78, '2024-01-18', 'user-001'),

('video-007', 'React.js Tutorial - Build Modern Web Apps', 'Learn React.js from scratch and build modern, interactive web applications. This tutorial covers components, state, hooks, and more.', 'https://picsum.photos/seed/react/400/225.jpg', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_7mb.mp4', '1:45:20', 'courses', '["react", "javascript", "web development", "tutorial", "frontend"]', 'public', 'published', 678000, 28900, 156, 145, '2024-01-20', 'user-002'),

('video-008', 'Best Gaming Fails of 2024', 'Watch the funniest gaming fails and moments that will make you laugh out loud. From glitches to embarrassing mistakes, we\'ve got it all!', 'https://picsum.photos/seed/fails/400/225.jpg', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_8mb.mp4', '15:30', 'gaming', '["gaming", "fails", "funny", "compilation", "moments"]', 'public', 'published', 3456000, 123000, 567, 289, '2024-01-22', 'user-003'),

('video-009', 'Electronic Music Mix 2024', 'The best electronic music tracks of 2024 mixed into one amazing playlist. Perfect for parties, workouts, or just vibing.', 'https://picsum.photos/seed/electronic/400/225.jpg', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_9mb.mp4', '58:45', 'music', '["electronic", "music", "mix", "2024", "party", "workout"]', 'public', 'published', 234000, 8900, 45, 34, '2024-01-25', 'user-004'),

('video-010', 'Python Programming for Beginners', 'Start your programming journey with Python. This comprehensive course covers basics, data structures, and practical applications.', 'https://picsum.photos/seed/python/400/225.jpg', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4', '3:12:45', 'courses', '["python", "programming", "tutorial", "beginner", "coding"]', 'public', 'published', 1567000, 56700, 289, 234, '2024-01-28', 'user-002');

-- Insert sample comments
INSERT INTO comments (id, text, likes, created_at, user_id, video_id) VALUES
('comment-001', 'Absolutely stunning! The cinematography is incredible. I felt like I was right there in nature.', 45, '2024-01-11 10:30:00', 'user-003', 'video-001'),
('comment-002', 'This reminds me of my trip to Yellowstone! The memories are flooding back. Thank you for sharing this beautiful content.', 23, '2024-01-11 14:15:00', 'user-002', 'video-001'),
('comment-003', 'Best JavaScript tutorial I\'ve found! You explain everything so clearly. Keep up the great work!', 67, '2024-01-09 09:20:00', 'user-001', 'video-002'),
('comment-004', 'Finally found a tutorial that actually makes sense! I\'ve been struggling with JavaScript for months.', 34, '2024-01-09 16:45:00', 'user-004', 'video-002'),
('comment-005', 'That last clip was insane! 🔥 How did they even do that?', 89, '2024-01-13 11:00:00', 'user-001', 'video-003'),
('comment-006', 'Love these compilations! Keep them coming! This is my favorite content on the platform.', 34, '2024-01-13 18:30:00', 'user-002', 'video-003'),
('comment-007', 'This music helps me focus so much when I\'m studying. Thank you for creating such peaceful content!', 56, '2024-01-16 12:00:00', 'user-002', 'video-004'),
('comment-008', 'Perfect background music for work. The tempo and melody are just right for concentration.', 23, '2024-01-16 15:20:00', 'user-003', 'video-004'),
('comment-009', 'This course is exactly what I needed! You cover everything from HTML to JavaScript in a way that\'s easy to understand.', 78, '2024-01-06 08:30:00', 'user-001', 'video-005'),
('comment-010', 'I\'ve learned more from this video than from my entire college course. Thank you!', 45, '2024-01-06 13:15:00', 'user-004', 'video-005');

-- Insert sample likes
INSERT INTO likes (id, type, user_id, video_id) VALUES
('like-001', 'like', 'user-002', 'video-001'),
('like-002', 'like', 'user-003', 'video-001'),
('like-003', 'like', 'user-004', 'video-001'),
('like-004', 'dislike', 'user-001', 'video-001'),
('like-005', 'like', 'user-001', 'video-002'),
('like-006', 'like', 'user-003', 'video-002'),
('like-007', 'like', 'user-004', 'video-002'),
('like-008', 'dislike', 'user-002', 'video-002'),
('like-009', 'like', 'user-001', 'video-003'),
('like-010', 'like', 'user-002', 'video-003'),
('like-011', 'like', 'user-004', 'video-003'),
('like-012', 'like', 'user-001', 'video-004'),
('like-013', 'like', 'user-002', 'video-004'),
('like-014', 'like', 'user-003', 'video-004'),
('like-015', 'dislike', 'user-004', 'video-004');

-- Insert sample subscriptions
INSERT INTO subscriptions (id, user_id, channel_id, created_at) VALUES
('sub-001', 'user-001', 'user-002', '2024-01-01 10:00:00'),
('sub-002', 'user-001', 'user-003', '2024-01-02 14:30:00'),
('sub-003', 'user-002', 'user-001', '2024-01-03 09:15:00'),
('sub-004', 'user-002', 'user-003', '2024-01-04 16:45:00'),
('sub-005', 'user-003', 'user-001', '2024-01-05 11:20:00'),
('sub-006', 'user-003', 'user-002', '2024-01-06 13:10:00'),
('sub-007', 'user-004', 'user-001', '2024-01-07 15:30:00'),
('sub-008', 'user-004', 'user-002', '2024-01-08 10:45:00'),
('sub-009', 'user-004', 'user-003', '2024-01-09 12:00:00'),
('sub-010', 'user-001', 'user-004', '2024-01-10 17:20:00');

-- Insert sample playlists
INSERT INTO playlists (id, name, description, is_public, video_count, user_id) VALUES
('playlist-001', 'My Favorite Nature Videos', 'A collection of the most beautiful nature documentaries I\'ve found', TRUE, 3, 'user-001'),
('playlist-002', 'Programming Tutorials', 'All the best programming tutorials for learning web development', TRUE, 5, 'user-002'),
('playlist-003', 'Gaming Best Moments', 'Epic gaming moments that I want to watch again and again', FALSE, 4, 'user-003'),
('playlist-004', 'Study Music Collection', 'Perfect music for studying and concentration', TRUE, 6, 'user-004'),
('playlist-005', 'Web Development Journey', 'My journey learning web development from scratch', FALSE, 8, 'user-001');

-- Insert sample playlist videos
INSERT INTO playlist_videos (id, position, playlist_id, video_id) VALUES
('pv-001', 1, 'playlist-001', 'video-001'),
('pv-002', 2, 'playlist-001', 'video-006'),
('pv-003', 3, 'playlist-001', 'video-003'),
('pv-004', 1, 'playlist-002', 'video-002'),
('pv-005', 2, 'playlist-002', 'video-005'),
('pv-006', 3, 'playlist-002', 'video-007'),
('pv-007', 4, 'playlist-002', 'video-010'),
('pv-008', 5, 'playlist-002', 'video-003'),
('pv-009', 1, 'playlist-003', 'video-003'),
('pv-010', 2, 'playlist-003', 'video-008'),
('pv-011', 3, 'playlist-003', 'video-001'),
('pv-012', 4, 'playlist-003', 'video-006');

-- Insert sample watch history
INSERT INTO watch_history (id, watch_duration, completed, watched_at, user_id, video_id) VALUES
('wh-001', 456, TRUE, '2024-01-15 10:30:00', 'user-001', 'video-001'),
('wh-002', 234, FALSE, '2024-01-15 14:20:00', 'user-001', 'video-002'),
('wh-003', 678, TRUE, '2024-01-16 09:15:00', 'user-002', 'video-003'),
('wh-004', 123, FALSE, '2024-01-16 16:45:00', 'user-002', 'video-004'),
('wh-005', 890, TRUE, '2024-01-17 11:00:00', 'user-003', 'video-005'),
('wh-006', 345, FALSE, '2024-01-17 18:30:00', 'user-003', 'video-006'),
('wh-007', 567, TRUE, '2024-01-18 12:15:00', 'user-004', 'video-007'),
('wh-008', 234, FALSE, '2024-01-18 15:20:00', 'user-004', 'video-008');

-- Insert sample notifications
INSERT INTO notifications (id, type, title, message, is_read, created_at, user_id, actor_id, video_id) VALUES
('notif-001', 'video_upload', 'New Video Uploaded', 'Nature Channel uploaded "Amazing Nature Documentary - 4K Ultra HD"', FALSE, '2024-01-10 10:00:00', 'user-002', 'user-001', 'video-001'),
('notif-002', 'comment', 'New Comment on Your Video', 'GamerPro commented: "That last clip was insane! 🔥"', FALSE, '2024-01-13 11:00:00', 'user-003', 'user-001', 'video-003'),
('notif-003', 'subscription', 'New Subscriber', 'Code Academy subscribed to your channel', TRUE, '2024-01-03 09:15:00', 'user-001', 'user-002', NULL),
('notif-004', 'like', 'Your Video Was Liked', 'Your video "Learn JavaScript" received 50 new likes', FALSE, '2024-01-09 12:00:00', 'user-002', 'user-001', 'video-002'),
('notif-005', 'video_upload', 'New Video from Subscribed Channel', 'Gaming Central uploaded "Epic Gaming Moments 2024 Compilation"', TRUE, '2024-01-12 14:30:00', 'user-001', 'user-003', 'video-003');

-- Insert sample video views for analytics
INSERT INTO video_views (id, ip_address, user_agent, viewed_at, video_id, user_id) VALUES
('vv-001', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-01-15 10:30:00', 'video-001', 'user-001'),
('vv-002', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2024-01-15 11:00:00', 'video-001', NULL),
('vv-003', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2024-01-15 11:30:00', 'video-001', NULL),
('vv-004', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '2024-01-15 12:00:00', 'video-002', 'user-002'),
('vv-005', '192.168.1.104', 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0', '2024-01-15 12:30:00', 'video-002', NULL);

-- Update user statistics based on inserted data
UPDATE users SET 
    video_count = (SELECT COUNT(*) FROM videos WHERE user_id = users.id AND status = 'published'),
    total_views = (SELECT COALESCE(SUM(views), 0) FROM videos WHERE user_id = users.id AND status = 'published'),
    subscribers = (SELECT COUNT(*) FROM subscriptions WHERE channel_id = users.id);

-- Update video statistics
UPDATE videos SET 
    comments = (SELECT COUNT(*) FROM comments WHERE video_id = videos.id),
    likes = (SELECT COUNT(*) FROM likes WHERE video_id = videos.id AND type = 'like'),
    dislikes = (SELECT COUNT(*) FROM likes WHERE video_id = videos.id AND type = 'dislike');

-- Display summary of seeded data
SELECT 'Users seeded:' as info, COUNT(*) as count FROM users;
SELECT 'Videos seeded:' as info, COUNT(*) as count FROM videos;
SELECT 'Comments seeded:' as info, COUNT(*) as count FROM comments;
SELECT 'Likes seeded:' as info, COUNT(*) as count FROM likes;
SELECT 'Subscriptions seeded:' as info, COUNT(*) as count FROM subscriptions;
SELECT 'Playlists seeded:' as info, COUNT(*) as count FROM playlists;
SELECT 'Notifications seeded:' as info, COUNT(*) as count FROM notifications;

-- Display sample queries for testing
SELECT 'Sample query - Top 5 most viewed videos:' as query_info;
SELECT v.title, v.views, u.channel_name 
FROM videos v 
JOIN users u ON v.user_id = u.id 
ORDER BY v.views DESC 
LIMIT 5;

SELECT 'Sample query - Users with most subscribers:' as query_info;
SELECT u.channel_name, u.subscribers, u.video_count 
FROM users u 
WHERE u.is_admin = FALSE 
ORDER BY u.subscribers DESC 
LIMIT 5;

SELECT 'Sample query - Recent comments:' as query_info;
SELECT c.text, u.channel_name, v.title, c.created_at 
FROM comments c 
JOIN users u ON c.user_id = u.id 
JOIN videos v ON c.video_id = v.id 
ORDER BY c.created_at DESC 
LIMIT 5;

-- Seed data insertion complete
SELECT 'Database seeding completed successfully!' as status;
