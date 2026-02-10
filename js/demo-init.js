// Simple Demo Initialization
console.log('🎬 Media Hub Demo Starting...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM Loaded - Initializing Demo...');
    
    // Simple demo content
    const demoContent = {
        videos: [
            {
                id: 'demo1',
                title: 'Demo Video 1 - Web Development',
                thumbnail: 'https://picsum.photos/seed/demo1/320/180.jpg',
                duration: '10:30',
                views: 15000,
                channel: 'Demo Channel',
                uploadDate: '2024-01-15'
            },
            {
                id: 'demo2',
                title: 'Demo Video 2 - Music Tutorial',
                thumbnail: 'https://picsum.photos/seed/demo2/320/180.jpg',
                duration: '8:45',
                views: 8500,
                channel: 'Music Demo',
                uploadDate: '2024-01-10'
            }
        ],
        songs: [
            {
                id: 'song1',
                title: 'Demo Song - Electronic Mix',
                artist: 'Demo Artist',
                thumbnail: 'https://picsum.photos/seed/song1/320/180.jpg',
                duration: '3:45',
                plays: 25000
            }
        ],
        news: [
            {
                id: 'news1',
                title: 'Demo News - Tech Breakthrough',
                description: 'Amazing new technology discovered',
                thumbnail: 'https://picsum.photos/seed/news1/320/180.jpg',
                category: 'Technology',
                author: 'Demo Reporter'
            }
        ],
        profiles: [
            {
                id: 'profile1',
                name: 'Demo Creator',
                bio: 'This is a demo profile',
                avatar: 'https://picsum.photos/seed/avatar1/150/150.jpg',
                subscribers: 5000,
                verified: true
            }
        ],
        courses: [
            {
                id: 'course1',
                title: 'Demo Course - Learn Programming',
                description: 'Complete programming course',
                thumbnail: 'https://picsum.photos/seed/course1/320/180.jpg',
                instructor: 'Demo Instructor',
                price: 49.99,
                students: 1000
            }
        ]
    };

    // Simple HTML templates
    function createVideoCard(video) {
        return `
            <div class="video-card" style="background: #1a1a1a; border-radius: 8px; overflow: hidden; margin-bottom: 20px; cursor: pointer;">
                <div style="position: relative;">
                    <img src="${video.thumbnail}" alt="${video.title}" style="width: 100%; height: 180px; object-fit: cover;">
                    <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">${video.duration}</span>
                </div>
                <div style="padding: 12px;">
                    <h3 style="color: white; margin: 0 0 8px 0; font-size: 0.9rem;">${video.title}</h3>
                    <div style="color: #999; font-size: 0.8rem;">${video.channel}</div>
                    <div style="color: #999; font-size: 0.8rem;">${video.views.toLocaleString()} views • ${video.uploadDate}</div>
                </div>
            </div>
        `;
    }

    function createSongCard(song) {
        return `
            <div class="song-card" style="background: #1a1a1a; border-radius: 8px; overflow: hidden; margin-bottom: 20px; cursor: pointer;">
                <div style="position: relative;">
                    <img src="${song.thumbnail}" alt="${song.title}" style="width: 100%; height: 160px; object-fit: cover;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: rgba(0,0,0,0.8); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">▶️</div>
                </div>
                <div style="padding: 12px;">
                    <h3 style="color: white; margin: 0 0 8px 0; font-size: 0.9rem;">${song.title}</h3>
                    <div style="color: #999; font-size: 0.8rem;">${song.artist}</div>
                    <div style="color: #999; font-size: 0.8rem;">${song.plays.toLocaleString()} plays • ${song.duration}</div>
                </div>
            </div>
        `;
    }

    function createNewsCard(news) {
        return `
            <div class="news-card" style="background: #1a1a1a; border-radius: 8px; overflow: hidden; margin-bottom: 20px; cursor: pointer;">
                <div style="position: relative;">
                    <img src="${news.thumbnail}" alt="${news.title}" style="width: 100%; height: 200px; object-fit: cover;">
                    <span style="position: absolute; top: 8px; left: 8px; background: #ff0000; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">${news.category}</span>
                </div>
                <div style="padding: 12px;">
                    <h3 style="color: white; margin: 0 0 8px 0; font-size: 1rem;">${news.title}</h3>
                    <p style="color: #999; font-size: 0.85rem; margin: 0 0 8px 0;">${news.description}</p>
                    <div style="color: #999; font-size: 0.8rem;">${news.author}</div>
                </div>
            </div>
        `;
    }

    function createProfileCard(profile) {
        return `
            <div class="profile-card" style="background: #1a1a1a; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                <div style="position: relative; height: 120px; overflow: hidden;">
                    <img src="https://picsum.photos/seed/banner${profile.id}/320/120.jpg" alt="${profile.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    <img src="${profile.avatar}" alt="${profile.name}" style="position: absolute; bottom: -40px; left: 20px; width: 80px; height: 80px; border-radius: 50%; border: 4px solid #1a1a1a; object-fit: cover;">
                </div>
                <div style="padding: 50px 20px 20px;">
                    <h3 style="color: white; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px;">${profile.name} ${profile.verified ? '✅' : ''}</h3>
                    <p style="color: #999; font-size: 0.85rem; margin: 0 0 16px 0;">${profile.bio}</p>
                    <div style="display: flex; gap: 20px; margin-bottom: 16px;">
                        <div style="text-align: center;">
                            <div style="color: white; font-weight: 600; font-size: 0.9rem;">${profile.subscribers.toLocaleString()}</div>
                            <div style="color: #999; font-size: 0.75rem;">Subscribers</div>
                        </div>
                    </div>
                    <button style="background: #ff0000; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Subscribe</button>
                </div>
            </div>
        `;
    }

    function createCourseCard(course) {
        return `
            <div class="course-card" style="background: #1a1a1a; border-radius: 8px; overflow: hidden; margin-bottom: 20px; cursor: pointer;">
                <div style="position: relative;">
                    <img src="${course.thumbnail}" alt="${course.title}" style="width: 100%; height: 180px; object-fit: cover;">
                    <span style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">⭐ 4.8</span>
                </div>
                <div style="padding: 12px;">
                    <h3 style="color: white; margin: 0 0 8px 0; font-size: 0.9rem;">${course.title}</h3>
                    <p style="color: #999; font-size: 0.85rem; margin: 0 0 12px 0;">${course.description}</p>
                    <div style="color: #999; font-size: 0.8rem; margin-bottom: 12px;">${course.instructor}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #ff0000; font-weight: 600; font-size: 1.1rem;">$${course.price}</span>
                        <button style="background: #ff0000; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Enroll Now</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Load demo content
    function loadDemoContent() {
        console.log('🎯 Loading Demo Content...');

        // Load videos
        const videosContainer = document.getElementById('videos-container');
        if (videosContainer) {
            videosContainer.innerHTML = demoContent.videos.map(video => createVideoCard(video)).join('');
            console.log('✅ Videos loaded');
        }

        // Load songs
        const songsContainer = document.getElementById('songs-container');
        if (songsContainer) {
            songsContainer.innerHTML = demoContent.songs.map(song => createSongCard(song)).join('');
            console.log('✅ Songs loaded');
        }

        // Load news
        const newsContainer = document.getElementById('news-container');
        if (newsContainer) {
            newsContainer.innerHTML = demoContent.news.map(news => createNewsCard(news)).join('');
            console.log('✅ News loaded');
        }

        // Load profiles
        const profilesContainer = document.getElementById('profiles-container');
        if (profilesContainer) {
            profilesContainer.innerHTML = demoContent.profiles.map(profile => createProfileCard(profile)).join('');
            console.log('✅ Profiles loaded');
        }

        // Load courses
        const coursesContainer = document.getElementById('courses-container');
        if (coursesContainer) {
            coursesContainer.innerHTML = demoContent.courses.map(course => createCourseCard(course)).join('');
            console.log('✅ Courses loaded');
        }

        // Setup basic navigation
        setupBasicNavigation();
    }

    // Basic navigation
    function setupBasicNavigation() {
        console.log('🧭 Setting up Navigation...');

        // Sidebar navigation
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                if (section) {
                    showSection(section);
                    console.log('📍 Navigated to:', section);
                }
            });
        });

        // Menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const mainWrapper = document.getElementById('main-wrapper');

        if (menuToggle && sidebar && mainWrapper) {
            menuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('open');
                mainWrapper.classList.toggle('sidebar-open');
                console.log('📱 Sidebar toggled');
            });
        }

        // Show success message
        showDemoMessage('🎉 Media Hub Demo Loaded Successfully!', 'success');
    }

    // Show demo message
    function showDemoMessage(message, type) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : '#f44336'};
            color: white;
            padding: 16px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-size: 14px;
            max-width: 300px;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Show section function
    window.showSection = function(sectionId) {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update sidebar active state
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
    };

    // Load demo content after a short delay
    setTimeout(loadDemoContent, 1000);

    console.log('🚀 Demo Initialization Complete!');
});
