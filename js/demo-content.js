// Rich Demo Content for Platform Showcase
class DemoContentGenerator {
    constructor() {
        this.videos = [];
        this.songs = [];
        this.games = [];
        this.courses = [];
        this.posts = [];
        this.init();
    }

    init() {
        this.generateVideos();
        this.generateSongs();
        this.generateGames();
        this.generateCourses();
        this.generateUserPosts();
    }

    generateVideos() {
        this.videos = [
            {
                id: 'video1',
                title: 'Complete React.js Tutorial - Build Modern Web Apps',
                description: 'Learn React.js from scratch and build 5 real-world projects including e-commerce, social media, and dashboard applications.',
                thumbnail: 'https://picsum.photos/seed/react-tutorial/320/180.jpg',
                duration: '2:45:30',
                views: 452000,
                likes: 12500,
                dislikes: 234,
                uploadDate: '2024-01-20',
                category: 'Education',
                tags: ['react', 'javascript', 'web development', 'tutorial'],
                user: {
                    id: 'user1',
                    username: 'CodeMaster',
                    channelName: 'Code Master Academy',
                    avatar: 'https://picsum.photos/seed/codemaster/40/40.jpg',
                    subscribers: 125000,
                    verified: true
                },
                comments: 892,
                featured: true
            },
            {
                id: 'video2',
                title: 'Gaming Highlights: Epic Moments Compilation 2024',
                description: 'Best gaming moments from the past month! Incredible plays, funny fails, and epic wins from various games.',
                thumbnail: 'https://picsum.photos/seed/gaming-highlights/320/180.jpg',
                duration: '15:45',
                views: 890000,
                likes: 45000,
                dislikes: 567,
                uploadDate: '2024-01-18',
                category: 'Gaming',
                tags: ['gaming', 'highlights', 'compilation', 'epic moments'],
                user: {
                    id: 'user2',
                    username: 'ProGamer123',
                    channelName: 'Pro Gaming Channel',
                    avatar: 'https://picsum.photos/seed/progamer/40/40.jpg',
                    subscribers: 890000,
                    verified: true
                },
                comments: 2341,
                trending: true
            },
            {
                id: 'video3',
                title: '10 Minute Morning Yoga Routine for Beginners',
                description: 'Start your day with this gentle yoga routine. Perfect for beginners to improve flexibility and reduce stress.',
                thumbnail: 'https://picsum.photos/seed/yoga-morning/320/180.jpg',
                duration: '10:15',
                views: 234000,
                likes: 8900,
                dislikes: 123,
                uploadDate: '2024-01-15',
                category: 'Health & Fitness',
                tags: ['yoga', 'fitness', 'morning routine', 'wellness'],
                user: {
                    id: 'user3',
                    username: 'YogaLife',
                    channelName: 'Yoga Life Studio',
                    avatar: 'https://picsum.photos/seed/yoga/40/40.jpg',
                    subscribers: 45000,
                    verified: false
                },
                comments: 456
            },
            {
                id: 'video4',
                title: 'Street Food Tour: Tokyo Hidden Gems 🍜',
                description: 'Join me on an amazing street food adventure through Tokyo! Discover hidden gems and authentic Japanese cuisine.',
                thumbnail: 'https://picsum.photos/seed/tokyo-food/320/180.jpg',
                duration: '22:30',
                views: 567000,
                likes: 28000,
                dislikes: 345,
                uploadDate: '2024-01-12',
                category: 'Food & Travel',
                tags: ['tokyo', 'street food', 'travel', 'japanese cuisine'],
                user: {
                    id: 'user4',
                    username: 'FoodExplorer',
                    channelName: 'Food Explorer',
                    avatar: 'https://picsum.photos/seed/foodie/40/40.jpg',
                    subscribers: 234000,
                    verified: true
                },
                comments: 1234
            },
            {
                id: 'video5',
                title: 'iPhone 15 Pro Max Review: Is It Worth It?',
                description: 'In-depth review of Apple\'s latest flagship. Camera tests, performance benchmarks, and real-world usage.',
                thumbnail: 'https://picsum.photos/seed/iphone15-review/320/180.jpg',
                duration: '18:45',
                views: 1234000,
                likes: 67000,
                dislikes: 890,
                uploadDate: '2024-01-10',
                category: 'Technology',
                tags: ['iphone', 'apple', 'review', 'smartphone'],
                user: {
                    id: 'user5',
                    username: 'TechReviewer',
                    channelName: 'Tech Review Central',
                    avatar: 'https://picsum.photos/seed/techreview/40/40.jpg',
                    subscribers: 567000,
                    verified: true
                },
                comments: 3456,
                trending: true
            }
        ];
    }

    generateSongs() {
        this.songs = [
            {
                id: 'song1',
                title: 'Summer Nights - Electronic Dance Mix',
                artist: 'DJ Sunshine',
                album: 'Beach Party 2024',
                duration: '4:32',
                thumbnail: 'https://picsum.photos/seed/summer-nights/320/180.jpg',
                plays: 3450000,
                likes: 89000,
                genre: 'Electronic',
                releaseDate: '2024-01-01',
                bpm: 128,
                user: {
                    id: 'artist1',
                    username: 'DJSunshine',
                    channelName: 'DJ Sunshine Official',
                    avatar: 'https://picsum.photos/seed/djsunshine/40/40.jpg',
                    subscribers: 234000,
                    verified: true
                },
                featured: true
            },
            {
                id: 'song2',
                title: 'Midnight Acoustic - Original Song',
                artist: 'Sarah Johnson',
                album: 'Unplugged Sessions',
                duration: '3:45',
                thumbnail: 'https://picsum.photos/seed/midnight-acoustic/320/180.jpg',
                plays: 1890000,
                likes: 45000,
                genre: 'Acoustic',
                releaseDate: '2024-01-05',
                bpm: 75,
                user: {
                    id: 'artist2',
                    username: 'SarahMusic',
                    channelName: 'Sarah Johnson Music',
                    avatar: 'https://picsum.photos/seed/sarah/40/40.jpg',
                    subscribers: 89000,
                    verified: false
                }
            },
            {
                id: 'song3',
                title: 'Hip Hop Beats 2024 - Instrumental Mix',
                artist: 'BeatMaker Pro',
                album: 'Producer Collection Vol. 3',
                duration: '5:12',
                thumbnail: 'https://picsum.photos/seed/hiphop-beats/320/180.jpg',
                plays: 5670000,
                likes: 123000,
                genre: 'Hip Hop',
                releaseDate: '2023-12-15',
                bpm: 95,
                user: {
                    id: 'artist3',
                    username: 'BeatMakerPro',
                    channelName: 'Beat Maker Pro Studio',
                    avatar: 'https://picsum.photos/seed/beatmaker/40/40.jpg',
                    subscribers: 456000,
                    verified: true
                },
                trending: true
            },
            {
                id: 'song4',
                title: 'Classical Piano - Moonlight Sonata Cover',
                artist: 'Maria Rodriguez',
                album: 'Classical Covers',
                duration: '6:23',
                thumbnail: 'https://picsum.photos/seed/piano-classical/320/180.jpg',
                plays: 890000,
                likes: 23000,
                genre: 'Classical',
                releaseDate: '2024-01-08',
                bpm: 60,
                user: {
                    id: 'artist4',
                    username: 'MariaPiano',
                    channelName: 'Maria Rodriguez Piano',
                    avatar: 'https://picsum.photos/seed/maria/40/40.jpg',
                    subscribers: 67000,
                    verified: false
                }
            },
            {
                id: 'song5',
                title: 'Rock Anthem 2024 - Full Band Performance',
                artist: 'Thunder Road',
                album: 'Highway to Heaven',
                duration: '4:15',
                thumbnail: 'https://picsum.photos/seed/rock-anthem/320/180.jpg',
                plays: 2340000,
                likes: 67000,
                genre: 'Rock',
                releaseDate: '2023-11-20',
                bpm: 140,
                user: {
                    id: 'artist5',
                    username: 'ThunderRoad',
                    channelName: 'Thunder Road Official',
                    avatar: 'https://picsum.photos/seed/thunder/40/40.jpg',
                    subscribers: 345000,
                    verified: true
                }
            }
        ];
    }

    generateGames() {
        this.games = [
            {
                id: 'game1',
                title: 'Cyberpunk Racing 2077',
                description: 'High-speed racing in a neon-lit cyberpunk world. Upgrade your vehicle and dominate the streets.',
                thumbnail: 'https://picsum.photos/seed/cyberpunk-racing/320/180.jpg',
                genre: 'Racing',
                platform: 'PC, PlayStation, Xbox',
                releaseDate: '2024-01-15',
                rating: 4.8,
                players: 123000,
                price: 59.99,
                developer: 'Neon Studios',
                user: {
                    id: 'dev1',
                    username: 'NeonStudios',
                    channelName: 'Neon Studios',
                    avatar: 'https://picsum.photos/seed/neon/40/40.jpg',
                    subscribers: 89000,
                    verified: true
                },
                featured: true
            },
            {
                id: 'game2',
                title: 'Fantasy Quest: The Lost Kingdom',
                description: 'Epic RPG adventure with stunning graphics and immersive storyline. Build your hero and save the realm.',
                thumbnail: 'https://picsum.photos/seed/fantasy-quest/320/180.jpg',
                genre: 'RPG',
                platform: 'PC, Nintendo Switch',
                releaseDate: '2024-01-10',
                rating: 4.6,
                players: 89000,
                price: 49.99,
                developer: 'DreamWorks Games',
                user: {
                    id: 'dev2',
                    username: 'DreamWorks',
                    channelName: 'DreamWorks Games',
                    avatar: 'https://picsum.photos/seed/dreamworks/40/40.jpg',
                    subscribers: 234000,
                    verified: true
                },
                trending: true
            },
            {
                id: 'game3',
                title: 'Puzzle Master 3000',
                description: 'Challenging puzzle game with 1000+ levels. Test your logic and problem-solving skills.',
                thumbnail: 'https://picsum.photos/seed/puzzle-master/320/180.jpg',
                genre: 'Puzzle',
                platform: 'Mobile, PC',
                releaseDate: '2023-12-20',
                rating: 4.4,
                players: 456000,
                price: 4.99,
                developer: 'Brain Games Inc',
                user: {
                    id: 'dev3',
                    username: 'BrainGames',
                    channelName: 'Brain Games Inc',
                    avatar: 'https://picsum.photos/seed/brain/40/40.jpg',
                    subscribers: 123000,
                    verified: false
                }
            },
            {
                id: 'game4',
                title: 'Space Combat Elite',
                description: 'Intense space combat simulator. Pilot advanced spacecraft in epic multiplayer battles.',
                thumbnail: 'https://picsum.photos/seed/space-combat/320/180.jpg',
                genre: 'Action',
                platform: 'PC, PlayStation, Xbox',
                releaseDate: '2024-01-05',
                rating: 4.7,
                players: 234000,
                price: 69.99,
                developer: 'Stellar Studios',
                user: {
                    id: 'dev4',
                    username: 'StellarStudios',
                    channelName: 'Stellar Studios',
                    avatar: 'https://picsum.photos/seed/stellar/40/40.jpg',
                    subscribers: 456000,
                    verified: true
                }
            },
            {
                id: 'game5',
                title: 'Farm Life Simulator',
                description: 'Relaxing farming simulation. Build your dream farm, grow crops, and raise animals.',
                thumbnail: 'https://picsum.photos/seed/farm-simulator/320/180.jpg',
                genre: 'Simulation',
                platform: 'PC, Mobile, Switch',
                releaseDate: '2023-11-15',
                rating: 4.5,
                players: 567000,
                price: 29.99,
                developer: 'Cozy Games Studio',
                user: {
                    id: 'dev5',
                    username: 'CozyGames',
                    channelName: 'Cozy Games Studio',
                    avatar: 'https://picsum.photos/seed/cozy/40/40.jpg',
                    subscribers: 234000,
                    verified: false
                }
            }
        ];
    }

    generateCourses() {
        this.courses = [
            {
                id: 'course1',
                title: 'Full Stack Web Development Bootcamp 2024',
                description: 'Master modern web development from frontend to backend. Build 10 real-world projects and launch your career.',
                thumbnail: 'https://picsum.photos/seed/webdev-bootcamp/320/180.jpg',
                instructor: 'Tech Master Academy',
                duration: '60 hours',
                lessons: 245,
                level: 'Beginner to Advanced',
                rating: 4.9,
                students: 25000,
                price: 89.99,
                category: 'Programming',
                tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
                certificate: true,
                user: {
                    id: 'instructor1',
                    username: 'TechMaster',
                    channelName: 'Tech Master Academy',
                    avatar: 'https://picsum.photos/seed/techmaster/40/40.jpg',
                    verified: true
                },
                featured: true
            },
            {
                id: 'course2',
                title: 'Digital Marketing Mastery 2024',
                description: 'Complete digital marketing course covering SEO, social media, content marketing, and analytics.',
                thumbnail: 'https://picsum.photos/seed/marketing-mastery/320/180.jpg',
                instructor: 'Marketing Pro Institute',
                duration: '35 hours',
                lessons: 128,
                level: 'Intermediate',
                rating: 4.7,
                students: 15000,
                price: 69.99,
                category: 'Marketing',
                tags: ['SEO', 'Social Media', 'Content Marketing', 'Google Ads', 'Analytics'],
                certificate: true,
                user: {
                    id: 'instructor2',
                    username: 'MarketingPro',
                    channelName: 'Marketing Pro Institute',
                    avatar: 'https://picsum.photos/seed/marketing/40/40.jpg',
                    verified: true
                },
                trending: true
            },
            {
                id: 'course3',
                title: 'UI/UX Design Complete Course',
                description: 'Learn user interface and user experience design from scratch. Create beautiful, functional designs.',
                thumbnail: 'https://picsum.photos/seed/uiux-design/320/180.jpg',
                instructor: 'Design School Online',
                duration: '40 hours',
                lessons: 156,
                level: 'Beginner',
                rating: 4.8,
                students: 18000,
                price: 79.99,
                category: 'Design',
                tags: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
                certificate: true,
                user: {
                    id: 'instructor3',
                    username: 'DesignSchool',
                    channelName: 'Design School Online',
                    avatar: 'https://picsum.photos/seed/design/40/40.jpg',
                    verified: false
                }
            },
            {
                id: 'course4',
                title: 'Data Science and Machine Learning',
                description: 'Comprehensive data science course with Python, machine learning, and deep learning fundamentals.',
                thumbnail: 'https://picsum.photos/seed/datascience-ml/320/180.jpg',
                instructor: 'Data Science Academy',
                duration: '80 hours',
                lessons: 320,
                level: 'Intermediate',
                rating: 4.6,
                students: 12000,
                price: 99.99,
                category: 'Data Science',
                tags: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'Pandas'],
                certificate: true,
                user: {
                    id: 'instructor4',
                    username: 'DataScience',
                    channelName: 'Data Science Academy',
                    avatar: 'https://picsum.photos/seed/datascience/40/40.jpg',
                    verified: true
                }
            },
            {
                id: 'course5',
                title: 'Photography Masterclass: From Beginner to Pro',
                description: 'Complete photography course covering camera basics, composition, lighting, and post-processing.',
                thumbnail: 'https://picsum.photos/seed/photography-course/320/180.jpg',
                instructor: 'Photography School',
                duration: '25 hours',
                lessons: 98,
                level: 'Beginner to Intermediate',
                rating: 4.7,
                students: 22000,
                price: 59.99,
                category: 'Photography',
                tags: ['Camera Basics', 'Composition', 'Lighting', 'Photoshop', 'Lightroom'],
                certificate: true,
                user: {
                    id: 'instructor5',
                    username: 'PhotoSchool',
                    channelName: 'Photography School',
                    avatar: 'https://picsum.photos/seed/photo/40/40.jpg',
                    verified: false
                }
            }
        ];
    }

    generateUserPosts() {
        this.posts = [
            {
                id: 'post1',
                type: 'video',
                content: 'Just uploaded my new React tutorial! 🚀 Check it out and let me know what you think!',
                user: {
                    username: 'CodeMaster',
                    avatar: 'https://picsum.photos/seed/codemaster/40/40.jpg'
                },
                timestamp: '2 hours ago',
                likes: 234,
                comments: 45,
                shares: 12,
                mediaId: 'video1'
            },
            {
                id: 'post2',
                type: 'music',
                content: 'New track just dropped! 🎵 Summer Nights is now available on all platforms. Turn up the volume!',
                user: {
                    username: 'DJSunshine',
                    avatar: 'https://picsum.photos/seed/djsunshine/40/40.jpg'
                },
                timestamp: '5 hours ago',
                likes: 567,
                comments: 89,
                shares: 34,
                mediaId: 'song1'
            },
            {
                id: 'post3',
                type: 'game',
                content: 'Finally released Cyberpunk Racing 2077! 🏎️ Who\'s ready to race through neon streets?',
                user: {
                    username: 'NeonStudios',
                    avatar: 'https://picsum.photos/seed/neon/40/40.jpg'
                },
                timestamp: '1 day ago',
                likes: 890,
                comments: 123,
                shares: 56,
                mediaId: 'game1'
            },
            {
                id: 'post4',
                type: 'course',
                content: '🎓 New course alert! Full Stack Web Development Bootcamp is now live. 50% off for first 100 students!',
                user: {
                    username: 'TechMaster',
                    avatar: 'https://picsum.photos/seed/techmaster/40/40.jpg'
                },
                timestamp: '3 days ago',
                likes: 456,
                comments: 78,
                shares: 23,
                mediaId: 'course1'
            }
        ];
    }

    // Display methods
    displayVideos(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.videos.map(video => this.createVideoCard(video)).join('');
    }

    displaySongs(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.songs.map(song => this.createSongCard(song)).join('');
    }

    displayGames(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.games.map(game => this.createGameCard(game)).join('');
    }

    displayCourses(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.courses.map(course => this.createCourseCard(course)).join('');
    }

    displayPosts(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.posts.map(post => this.createPostCard(post)).join('');
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
                    ${video.featured ? '<div class="featured-badge">FEATURED</div>' : ''}
                    ${video.trending ? '<div class="trending-badge">TRENDING</div>' : ''}
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
                        <div class="video-stats">
                            <span class="video-likes"><i class="fas fa-thumbs-up"></i> ${this.formatViews(video.likes)}</span>
                            <span class="video-comments"><i class="fas fa-comment"></i> ${video.comments}</span>
                        </div>
                        <div class="video-actions">
                            <button class="video-action like-btn" data-content-id="${video.id}">
                                <i class="far fa-heart"></i>
                                <span class="like-count">${video.likes}</span>
                            </button>
                            <button class="video-action comment-btn" data-content-id="${video.id}">
                                <i class="far fa-comment"></i>
                                <span class="comment-count">${video.comments || 0}</span>
                            </button>
                            <button class="video-action share-btn" data-content-id="${video.id}">
                                <i class="far fa-share"></i>
                                Share
                            </button>
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
                    ${song.featured ? '<div class="featured-badge">FEATURED</div>' : ''}
                    ${song.trending ? '<div class="trending-badge">TRENDING</div>' : ''}
                </div>
                <div class="song-info">
                    <h3 class="song-title">${song.title}</h3>
                    <div class="song-artist">${song.artist}</div>
                    <div class="song-album">${song.album}</div>
                    <div class="song-meta">
                        <span class="song-plays">${this.formatViews(song.plays)} plays</span>
                        <span class="song-duration">${song.duration}</span>
                        <span class="song-bpm">${song.bpm} BPM</span>
                    </div>
                    <div class="song-stats">
                        <span class="song-likes"><i class="fas fa-heart"></i> ${this.formatViews(song.likes)}</span>
                    </div>
                    <div class="song-actions">
                        <button class="song-action like-btn" data-content-id="${song.id}">
                            <i class="far fa-heart"></i>
                            <span class="like-count">${song.likes}</span>
                        </button>
                        <button class="song-action comment-btn" data-content-id="${song.id}">
                            <i class="far fa-comment"></i>
                            <span class="comment-count">${song.comments || 0}</span>
                        </button>
                        <button class="song-action share-btn" data-content-id="${song.id}">
                            <i class="far fa-share"></i>
                            Share
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createGameCard(game) {
        return `
            <div class="game-card" data-game-id="${game.id}">
                <div class="game-thumbnail">
                    <img src="${game.thumbnail}" alt="${game.title}">
                    <div class="game-rating">
                        <i class="fas fa-star"></i> ${game.rating}
                    </div>
                    ${game.featured ? '<div class="featured-badge">FEATURED</div>' : ''}
                    ${game.trending ? '<div class="trending-badge">TRENDING</div>' : ''}
                </div>
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="game-meta">
                        <span class="game-genre">${game.genre}</span>
                        <span class="game-platform">${game.platform}</span>
                    </div>
                    <div class="game-stats">
                        <span class="game-players">${this.formatViews(game.players)} players</span>
                        <span class="game-price">$${game.price}</span>
                    </div>
                    <div class="game-actions">
                        <button class="game-action like-btn" data-content-id="${game.id}">
                            <i class="far fa-heart"></i>
                            <span class="like-count">${game.likes || 0}</span>
                        </button>
                        <button class="game-action comment-btn" data-content-id="${game.id}">
                            <i class="far fa-comment"></i>
                            <span class="comment-count">${game.comments || 0}</span>
                        </button>
                        <button class="game-action share-btn" data-content-id="${game.id}">
                            <i class="far fa-share"></i>
                            Share
                        </button>
                    </div>
                    <div class="game-footer">
                        <span class="game-developer">${game.developer}</span>
                        <button class="btn btn-primary play-btn">Play Now</button>
                    </div>
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
                    ${course.certificate ? '<div class="certificate-badge">CERTIFICATE</div>' : ''}
                    ${course.featured ? '<div class="featured-badge">FEATURED</div>' : ''}
                    ${course.trending ? '<div class="trending-badge">TRENDING</div>' : ''}
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
                    <div class="course-tags">
                        ${course.tags.slice(0, 3).map(tag => `<span class="course-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="course-actions">
                        <button class="course-action like-btn" data-content-id="${course.id}">
                            <i class="far fa-heart"></i>
                            <span class="like-count">${course.likes || 0}</span>
                        </button>
                        <button class="course-action comment-btn" data-content-id="${course.id}">
                            <i class="far fa-comment"></i>
                            <span class="comment-count">${course.comments || 0}</span>
                        </button>
                        <button class="course-action share-btn" data-content-id="${course.id}">
                            <i class="far fa-share"></i>
                            Share
                        </button>
                    </div>
                    <div class="course-footer">
                        <span class="course-price">$${course.price}</span>
                        <button class="btn btn-primary enroll-btn">Enroll Now</button>
                    </div>
                </div>
            </div>
        `;
    }

    createPostCard(post) {
        return `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <img src="${post.user.avatar}" alt="${post.user.username}" class="post-avatar">
                    <div class="post-info">
                        <div class="post-username">${post.user.username}</div>
                        <div class="post-timestamp">${post.timestamp}</div>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                </div>
                <div class="post-actions">
                    <button class="post-action like-btn" data-content-id="${post.id}">
                        <i class="far fa-heart"></i>
                        <span class="like-count">${post.likes}</span>
                    </button>
                    <button class="post-action comment-btn" data-content-id="${post.id}">
                        <i class="far fa-comment"></i>
                        <span class="comment-count">${post.comments}</span>
                    </button>
                    <button class="post-action share-btn" data-content-id="${post.id}">
                        <i class="far fa-share"></i>
                        <span class="share-count">${post.shares}</span>
                    </button>
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

// Initialize demo content
const demoContent = new DemoContentGenerator();
