// Content Loader for Videos, Songs, News, Profiles, Courses
class ContentLoader {
    constructor() {
        this.videos = [];
        this.songs = [];
        this.news = [];
        this.profiles = [];
        this.courses = [];
        this.init();
    }

    init() {
        this.loadSampleContent();
    }

    loadSampleContent() {
        this.loadVideos();
        this.loadSongs();
        this.loadNews();
        this.loadProfiles();
        this.loadCourses();
    }

    loadVideos() {
        this.videos = [
            {
                id: '1',
                title: 'Web Development Complete Course 2024',
                description: 'Learn HTML, CSS, JavaScript, React, Node.js from scratch',
                thumbnail: 'https://picsum.photos/seed/webdev/320/180.jpg',
                duration: '45:30',
                views: 125000,
                uploadDate: '2024-01-15',
                category: 'education',
                user: {
                    id: 'user1',
                    username: 'TechMaster',
                    channelName: 'Tech Master Academy',
                    avatar: 'https://picsum.photos/seed/techmaster/40/40.jpg',
                    subscribers: 50000,
                    verified: true
                },
                tags: ['web development', 'javascript', 'react']
            },
            {
                id: '2',
                title: 'Amazing Nature Documentary - 4K Ultra HD',
                description: 'Explore the wonders of nature in stunning 4K quality',
                thumbnail: 'https://picsum.photos/seed/nature/320/180.jpg',
                duration: '58:20',
                views: 890000,
                uploadDate: '2024-01-10',
                category: 'documentary',
                user: {
                    id: 'user2',
                    username: 'NatureLover',
                    channelName: 'Nature Channel',
                    avatar: 'https://picsum.photos/seed/nature/40/40.jpg',
                    subscribers: 120000,
                    verified: true
                },
                tags: ['nature', 'documentary', '4k']
            }
        ];
    }

    loadSongs() {
        this.songs = [
            {
                id: '1',
                title: 'Summer Vibes - Electronic Mix',
                artist: 'DJ Sunshine',
                album: 'Beach Party 2024',
                duration: '3:45',
                thumbnail: 'https://picsum.photos/seed/music1/320/180.jpg',
                plays: 2500000,
                genre: 'Electronic',
                releaseDate: '2024-01-01',
                user: {
                    id: 'artist1',
                    username: 'DJSunshine',
                    channelName: 'DJ Sunshine Official',
                    avatar: 'https://picsum.photos/seed/dj/40/40.jpg',
                    subscribers: 100000,
                    verified: true
                }
            },
            {
                id: '2',
                title: 'Acoustic Sessions - Original Songs',
                artist: 'Sarah Johnson',
                album: 'Unplugged',
                duration: '4:20',
                thumbnail: 'https://picsum.photos/seed/music2/320/180.jpg',
                plays: 1800000,
                genre: 'Acoustic',
                releaseDate: '2024-01-05',
                user: {
                    id: 'artist2',
                    username: 'SarahMusic',
                    channelName: 'Sarah Johnson Music',
                    avatar: 'https://picsum.photos/seed/sarah/40/40.jpg',
                    subscribers: 75000,
                    verified: false
                }
            }
        ];
    }

    loadNews() {
        this.news = [
            {
                id: '1',
                title: 'Breaking: Major Tech Company Announces AI Breakthrough',
                description: 'Revolutionary AI technology promises to change how we interact with computers',
                thumbnail: 'https://picsum.photos/seed/news1/320/180.jpg',
                category: 'Technology',
                publishDate: '2024-01-20',
                readTime: '3 min',
                author: 'Tech Reporter',
                views: 50000,
                user: {
                    id: 'news1',
                    username: 'TechNews',
                    channelName: 'Tech News Network',
                    avatar: 'https://picsum.photos/seed/technews/40/40.jpg',
                    subscribers: 200000,
                    verified: true
                }
            },
            {
                id: '2',
                title: 'Sports Championship: Underdog Team Makes History',
                description: 'Incredible comeback victory shocks the sports world',
                thumbnail: 'https://picsum.photos/seed/sports/320/180.jpg',
                category: 'Sports',
                publishDate: '2024-01-19',
                readTime: '5 min',
                author: 'Sports Analyst',
                views: 75000,
                user: {
                    id: 'sports1',
                    username: 'SportsDaily',
                    channelName: 'Sports Daily',
                    avatar: 'https://picsum.photos/seed/sports/40/40.jpg',
                    subscribers: 150000,
                    verified: true
                }
            }
        ];
    }

    loadProfiles() {
        this.profiles = [
            {
                id: '1',
                username: 'TechMaster',
                displayName: 'Tech Master Academy',
                bio: 'Teaching web development and programming to millions of students worldwide',
                avatar: 'https://picsum.photos/seed/techmaster/150/150.jpg',
                banner: 'https://picsum.photos/seed/banner1/1200/300.jpg',
                subscribers: 50000,
                totalViews: 2500000,
                videoCount: 156,
                joinDate: '2020-03-15',
                location: 'San Francisco, CA',
                website: 'https://techmaster.com',
                verified: true,
                socialLinks: {
                    twitter: '@techmaster',
                    instagram: '@techmaster_academy',
                    youtube: 'TechMasterChannel'
                }
            },
            {
                id: '2',
                username: 'NatureLover',
                displayName: 'Nature Channel',
                bio: 'Exploring the beauty of our planet through stunning documentaries',
                avatar: 'https://picsum.photos/seed/nature/150/150.jpg',
                banner: 'https://picsum.photos/seed/banner2/1200/300.jpg',
                subscribers: 120000,
                totalViews: 5000000,
                videoCount: 89,
                joinDate: '2019-07-22',
                location: 'Seattle, WA',
                website: 'https://naturechannel.com',
                verified: true,
                socialLinks: {
                    twitter: '@naturechannel',
                    instagram: '@nature_lovers',
                    youtube: 'NatureChannelOfficial'
                }
            }
        ];
    }

    loadCourses() {
        this.courses = [
            {
                id: '1',
                title: 'Complete Web Development Bootcamp 2024',
                description: 'Master web development from beginner to advanced level',
                thumbnail: 'https://picsum.photos/seed/course1/320/180.jpg',
                instructor: 'Tech Master Academy',
                duration: '40 hours',
                lessons: 156,
                level: 'Beginner to Advanced',
                rating: 4.8,
                students: 15000,
                price: 89.99,
                category: 'Programming',
                tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
                user: {
                    id: 'instructor1',
                    username: 'TechMaster',
                    channelName: 'Tech Master Academy',
                    avatar: 'https://picsum.photos/seed/instructor/40/40.jpg',
                    verified: true
                }
            },
            {
                id: '2',
                title: 'Digital Marketing Masterclass',
                description: 'Learn modern digital marketing strategies and techniques',
                thumbnail: 'https://picsum.photos/seed/course2/320/180.jpg',
                instructor: 'Marketing Pro',
                duration: '25 hours',
                lessons: 98,
                level: 'Intermediate',
                rating: 4.6,
                students: 8500,
                price: 69.99,
                category: 'Marketing',
                tags: ['SEO', 'Social Media', 'Content Marketing', 'Analytics'],
                user: {
                    id: 'instructor2',
                    username: 'MarketingPro',
                    channelName: 'Marketing Pro Academy',
                    avatar: 'https://picsum.photos/seed/marketing/40/40.jpg',
                    verified: true
                }
            }
        ];
    }

    displayContent(type, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const content = this[type];
        if (!content || content.length === 0) {
            container.innerHTML = '<div class="no-content">No content available</div>';
            return;
        }

        container.innerHTML = content.map(item => this.createContentCard(item, type)).join('');
    }

    createContentCard(item, type) {
        switch(type) {
            case 'videos':
                return this.createVideoCard(item);
            case 'songs':
                return this.createSongCard(item);
            case 'news':
                return this.createNewsCard(item);
            case 'profiles':
                return this.createProfileCard(item);
            case 'courses':
                return this.createCourseCard(item);
            default:
                return '';
        }
    }

    createVideoCard(video) {
        return `
            <div class="video-card" data-video-id="${video.id}">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <span class="video-duration">${video.duration}</span>
                    <div class="video-play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-info">
                    <img src="${video.user.avatar}" alt="${video.user.channelName}" class="channel-avatar">
                    <div class="video-details">
                        <h3 class="video-title">${video.title}</h3>
                        <div class="video-channel ${video.user.verified ? 'verified' : ''}">
                            ${video.user.channelName}
                            ${video.user.verified ? '<i class="fas fa-check-circle verified-badge"></i>' : ''}
                        </div>
                        <div class="video-meta">
                            ${this.formatViews(video.views)} views • ${this.formatDate(video.uploadDate)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createSongCard(song) {
        return `
            <div class="song-card" data-song-id="${song.id}">
                <div class="song-thumbnail">
                    <img src="${song.thumbnail}" alt="${song.title}">
                    <div class="song-play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="song-info">
                    <h3 class="song-title">${song.title}</h3>
                    <div class="song-artist">${song.artist}</div>
                    <div class="song-meta">
                        <span class="song-plays">${this.formatViews(song.plays)} plays</span>
                        <span class="song-duration">${song.duration}</span>
                    </div>
                </div>
            </div>
        `;
    }

    createNewsCard(news) {
        return `
            <div class="news-card" data-news-id="${news.id}">
                <div class="news-thumbnail">
                    <img src="${news.thumbnail}" alt="${news.title}">
                    <div class="news-category">${news.category}</div>
                </div>
                <div class="news-info">
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-description">${news.description}</p>
                    <div class="news-meta">
                        <span class="news-author">${news.author}</span>
                        <span class="news-date">${this.formatDate(news.publishDate)}</span>
                        <span class="news-read-time">${news.readTime} read</span>
                    </div>
                </div>
            </div>
        `;
    }

    createProfileCard(profile) {
        return `
            <div class="profile-card" data-profile-id="${profile.id}">
                <div class="profile-header">
                    <img src="${profile.banner}" alt="${profile.displayName}" class="profile-banner">
                    <img src="${profile.avatar}" alt="${profile.displayName}" class="profile-avatar">
                </div>
                <div class="profile-info">
                    <h3 class="profile-name">
                        ${profile.displayName}
                        ${profile.verified ? '<i class="fas fa-check-circle verified-badge"></i>' : ''}
                    </h3>
                    <p class="profile-bio">${profile.bio}</p>
                    <div class="profile-stats">
                        <div class="stat">
                            <span class="stat-number">${this.formatViews(profile.subscribers)}</span>
                            <span class="stat-label">Subscribers</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${this.formatViews(profile.totalViews)}</span>
                            <span class="stat-label">Total Views</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${profile.videoCount}</span>
                            <span class="stat-label">Videos</span>
                        </div>
                    </div>
                    <button class="btn btn-primary subscribe-btn" data-profile-id="${profile.id}">
                        Subscribe
                    </button>
                </div>
            </div>
        `;
    }

    createCourseCard(course) {
        return `
            <div class="course-card" data-course-id="${course.id}">
                <div class="course-thumbnail">
                    <img src="${course.thumbnail}" alt="${course.title}">
                    <div class="course-rating">
                        <i class="fas fa-star"></i> ${course.rating}
                    </div>
                </div>
                <div class="course-info">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.description}</p>
                    <div class="course-meta">
                        <span class="course-instructor">${course.instructor}</span>
                        <span class="course-duration">${course.duration}</span>
                        <span class="course-lessons">${course.lessons} lessons</span>
                    </div>
                    <div class="course-stats">
                        <span class="course-students">${course.students.toLocaleString()} students</span>
                        <span class="course-level">${course.level}</span>
                    </div>
                    <div class="course-footer">
                        <span class="course-price">$${course.price}</span>
                        <button class="btn btn-primary enroll-btn" data-course-id="${course.id}">
                            Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    formatViews(views) {
        if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
        return views.toString();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return date.toLocaleDateString();
    }
}

const contentLoader = new ContentLoader();
