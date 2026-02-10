// Enhanced Interactive Functionality
class InteractionManager {
    constructor() {
        this.currentVideo = null;
        this.currentSong = null;
        this.currentGame = null;
        this.currentCourse = null;
        this.isPlaying = false;
        this.volume = 0.7;
        this.likedItems = new Set();
        this.subscribedChannels = new Set();
        this.enrolledCourses = new Set();
        this.init();
    }

    init() {
        this.setupVideoInteractions();
        this.setupMusicInteractions();
        this.setupGameInteractions();
        this.setupCourseInteractions();
        this.setupPostInteractions();
        this.setupSearchFunctionality();
        this.setupFilterFunctionality();
        this.setupModalInteractions();
        this.setupUploadFunctionality();
        this.setupProfileInteractions();
        console.log('🎮 Interactive functionality initialized');
    }

    // Video Interactions
    setupVideoInteractions() {
        document.addEventListener('click', (e) => {
            const videoCard = e.target.closest('.video-card');
            if (videoCard) {
                const videoId = videoCard.dataset.videoId;
                this.playVideo(videoId);
            }

            // Like button
            if (e.target.closest('.video-likes')) {
                e.stopPropagation();
                const videoCard = e.target.closest('.video-card');
                const videoId = videoCard.dataset.videoId;
                this.toggleVideoLike(videoId, e.target.closest('.video-likes'));
            }

            // Comment button
            if (e.target.closest('.video-comments')) {
                e.stopPropagation();
                const videoCard = e.target.closest('.video-card');
                const videoId = videoCard.dataset.videoId;
                this.openVideoComments(videoId);
            }

            // Channel subscribe
            if (e.target.closest('.video-channel')) {
                e.stopPropagation();
                const videoCard = e.target.closest('.video-card');
                const channelName = videoCard.querySelector('.video-channel').textContent.trim();
                this.toggleChannelSubscribe(channelName, e.target.closest('.video-channel'));
            }
        });
    }

    playVideo(videoId) {
        console.log('🎬 Playing video:', videoId);
        
        // Find video data
        const video = this.findVideoById(videoId);
        if (!video) return;

        this.currentVideo = video;
        this.isPlaying = true;

        // Use media player
        if (window.mediaPlayer) {
            window.mediaPlayer.playMedia(video, 'video');
        } else {
            // Fallback to modal
            this.showVideoPlayer(video);
        }

        // Update view count
        this.updateVideoViews(videoId);

        // Show notification
        this.showNotification(`Now playing: ${video.title}`, 'info');
    }

    showVideoPlayer(video) {
        // Create or update video player modal
        let playerModal = document.getElementById('video-player-modal');
        if (!playerModal) {
            playerModal = this.createVideoPlayerModal();
            document.body.appendChild(playerModal);
        }

        playerModal.innerHTML = `
            <div class="modal-content video-player-content">
                <div class="modal-header">
                    <h3>${video.title}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="video-player">
                    <video controls autoplay style="width: 100%; max-height: 500px;">
                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div class="video-info">
                    <div class="video-stats">
                        <span class="views">${this.formatViews(video.views)} views</span>
                        <span class="likes">${video.likes} likes</span>
                        <span class="comments">${video.comments || 0} comments</span>
                    </div>
                    <div class="video-actions">
                        <button class="btn btn-outline like-btn" onclick="interactionManager.toggleVideoLike('${video.id}', this)">
                            <i class="fas fa-heart"></i> Like
                        </button>
                        <button class="btn btn-outline share-btn" onclick="interactionManager.shareVideo('${video.id}')">
                            <i class="fas fa-share"></i> Share
                        </button>
                        <button class="btn btn-outline save-btn" onclick="interactionManager.saveVideo('${video.id}')">
                            <i class="fas fa-bookmark"></i> Save
                        </button>
                    </div>
                </div>
            </div>
        `;

        playerModal.style.display = 'flex';
    }

    toggleVideoLike(videoId, element) {
        const isLiked = this.likedItems.has(`video-${videoId}`);
        
        if (isLiked) {
            this.likedItems.delete(`video-${videoId}`);
            element.classList.remove('liked');
            element.innerHTML = '<i class="fas fa-heart"></i> Like';
        } else {
            this.likedItems.add(`video-${videoId}`);
            element.classList.add('liked');
            element.innerHTML = '<i class="fas fa-heart"></i> Liked';
        }

        // Update video data
        const video = this.findVideoById(videoId);
        if (video) {
            video.likes += isLiked ? -1 : 1;
        }

        this.showNotification(isLiked ? 'Video removed from likes' : 'Video liked!', 'success');
    }

    // Music Interactions
    setupMusicInteractions() {
        document.addEventListener('click', (e) => {
            const songCard = e.target.closest('.song-card');
            if (songCard) {
                const songId = songCard.dataset.songId;
                this.playSong(songId);
            }

            // Like button
            if (e.target.closest('.song-likes')) {
                e.stopPropagation();
                const songCard = e.target.closest('.song-card');
                const songId = songCard.dataset.songId;
                this.toggleSongLike(songId, e.target.closest('.song-likes'));
            }
        });
    }

    playSong(songId) {
        console.log('🎵 Playing song:', songId);
        
        const song = this.findSongById(songId);
        if (!song) return;

        this.currentSong = song;
        this.isPlaying = true;

        // Use media player
        if (window.mediaPlayer) {
            window.mediaPlayer.playMedia(song, 'music');
        } else {
            // Fallback to modal
            this.showMusicPlayer(song);
        }

        // Update play count
        song.plays = (song.plays || 0) + 1;

        this.showNotification(`Now playing: ${song.title}`, 'info');
    }

    showMusicPlayer(song) {
        let playerModal = document.getElementById('music-player-modal');
        if (!playerModal) {
            playerModal = this.createMusicPlayerModal();
            document.body.appendChild(playerModal);
        }

        playerModal.innerHTML = `
            <div class="modal-content music-player-content">
                <div class="modal-header">
                    <h3>Now Playing</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="music-player">
                    <div class="album-art">
                        <img src="${song.thumbnail}" alt="${song.title}" style="width: 200px; height: 200px; border-radius: 8px;">
                    </div>
                    <div class="track-info">
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                        <p>${song.album}</p>
                    </div>
                    <div class="player-controls">
                        <button class="btn btn-outline" onclick="interactionManager.previousTrack()">
                            <i class="fas fa-backward"></i>
                        </button>
                        <button class="btn btn-primary play-pause-btn" onclick="interactionManager.togglePlayPause()">
                            <i class="fas fa-pause"></i>
                        </button>
                        <button class="btn btn-outline" onclick="interactionManager.nextTrack()">
                            <i class="fas fa-forward"></i>
                        </button>
                    </div>
                    <div class="volume-control">
                        <i class="fas fa-volume-up"></i>
                        <input type="range" min="0" max="100" value="70" onchange="interactionManager.setVolume(this.value)">
                    </div>
                </div>
            </div>
        `;

        playerModal.style.display = 'flex';
    }

    // Game Interactions
    setupGameInteractions() {
        document.addEventListener('click', (e) => {
            const gameCard = e.target.closest('.game-card');
            if (gameCard) {
                const gameId = gameCard.dataset.gameId;
                this.launchGame(gameId);
            }

            // Play button
            if (e.target.closest('.play-btn')) {
                e.stopPropagation();
                const gameCard = e.target.closest('.game-card');
                const gameId = gameCard.dataset.gameId;
                this.launchGame(gameId);
            }
        });
    }

    launchGame(gameId) {
        console.log('🎮 Launching game:', gameId);
        
        const game = this.findGameById(gameId);
        if (!game) return;

        this.currentGame = game;

        // Show game launcher
        this.showGameLauncher(game);

        this.showNotification(`Launching ${game.title}...`, 'info');
    }

    showGameLauncher(game) {
        let launcherModal = document.getElementById('game-launcher-modal');
        if (!launcherModal) {
            launcherModal = this.createGameLauncherModal();
            document.body.appendChild(launcherModal);
        }

        launcherModal.innerHTML = `
            <div class="modal-content game-launcher-content">
                <div class="modal-header">
                    <h3>${game.title}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="game-launcher">
                    <div class="game-preview">
                        <img src="${game.thumbnail}" alt="${game.title}" style="width: 100%; max-height: 400px; border-radius: 8px;">
                    </div>
                    <div class="game-info">
                        <p>${game.description}</p>
                        <div class="game-meta">
                            <span>Genre: ${game.genre}</span>
                            <span>Platform: ${game.platform}</span>
                            <span>Rating: ⭐ ${game.rating}</span>
                        </div>
                        <div class="game-actions">
                            <button class="btn btn-primary" onclick="interactionManager.startGame('${game.id}')">
                                <i class="fas fa-play"></i> Start Game
                            </button>
                            <button class="btn btn-outline" onclick="interactionManager.addToWishlist('${game.id}')">
                                <i class="fas fa-heart"></i> Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        launcherModal.style.display = 'flex';
    }

    // Course Interactions
    setupCourseInteractions() {
        document.addEventListener('click', (e) => {
            const courseCard = e.target.closest('.course-card');
            if (courseCard) {
                const courseId = courseCard.dataset.courseId;
                this.viewCourse(courseId);
            }

            // Enroll button
            if (e.target.closest('.enroll-btn')) {
                e.stopPropagation();
                const courseCard = e.target.closest('.course-card');
                const courseId = courseCard.dataset.courseId;
                this.enrollInCourse(courseId);
            }
        });
    }

    viewCourse(courseId) {
        console.log('📚 Viewing course:', courseId);
        
        const course = this.findCourseById(courseId);
        if (!course) return;

        this.currentCourse = course;

        // Show course details
        this.showCourseDetails(course);
    }

    showCourseDetails(course) {
        let detailsModal = document.getElementById('course-details-modal');
        if (!detailsModal) {
            detailsModal = this.createCourseDetailsModal();
            document.body.appendChild(detailsModal);
        }

        detailsModal.innerHTML = `
            <div class="modal-content course-details-content">
                <div class="modal-header">
                    <h3>${course.title}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="course-details">
                    <div class="course-preview">
                        <img src="${course.thumbnail}" alt="${course.title}" style="width: 100%; max-height: 300px; border-radius: 8px;">
                    </div>
                    <div class="course-info">
                        <p>${course.description}</p>
                        <div class="course-meta">
                            <span>Instructor: ${course.instructor}</span>
                            <span>Duration: ${course.duration}</span>
                            <span>Lessons: ${course.lessons}</span>
                            <span>Level: ${course.level}</span>
                            <span>Students: ${course.students.toLocaleString()}</span>
                            <span>Rating: ⭐ ${course.rating}</span>
                        </div>
                        <div class="course-tags">
                            ${course.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <div class="course-actions">
                            <button class="btn btn-primary" onclick="interactionManager.enrollInCourse('${course.id}')">
                                <i class="fas fa-graduation-cap"></i> Enroll Now - $${course.price}
                            </button>
                            <button class="btn btn-outline" onclick="interactionManager.previewCourse('${course.id}')">
                                <i class="fas fa-eye"></i> Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        detailsModal.style.display = 'flex';
    }

    enrollInCourse(courseId) {
        const course = this.findCourseById(courseId);
        if (!course) return;

        if (this.enrolledCourses.has(courseId)) {
            this.showNotification('You are already enrolled in this course', 'info');
            return;
        }

        this.enrolledCourses.add(courseId);
        course.students = (course.students || 0) + 1;

        this.showNotification(`Successfully enrolled in ${course.title}!`, 'success');
        
        // Close modal
        const modal = document.querySelector('.modal[style*="flex"]');
        if (modal) modal.remove();
    }

    // Post Interactions
    setupPostInteractions() {
        document.addEventListener('click', (e) => {
            // Like post
            if (e.target.closest('.post-action.like-btn')) {
                const postCard = e.target.closest('.post-card');
                const postId = postCard.dataset.postId;
                this.togglePostLike(postId, e.target.closest('.post-action'));
            }

            // Comment on post
            if (e.target.closest('.post-action.comment-btn')) {
                const postCard = e.target.closest('.post-card');
                const postId = postCard.dataset.postId;
                this.openPostComments(postId);
            }

            // Share post
            if (e.target.closest('.post-action.share-btn')) {
                const postCard = e.target.closest('.post-card');
                const postId = postCard.dataset.postId;
                this.sharePost(postId);
            }
        });
    }

    togglePostLike(postId, element) {
        const isLiked = this.likedItems.has(`post-${postId}`);
        
        if (isLiked) {
            this.likedItems.delete(`post-${postId}`);
            element.classList.remove('liked');
        } else {
            this.likedItems.add(`post-${postId}`);
            element.classList.add('liked');
        }

        // Update like count
        const likeCount = element.querySelector('i').nextSibling;
        if (likeCount) {
            const currentCount = parseInt(likeCount.textContent) || 0;
            likeCount.textContent = isLiked ? currentCount - 1 : currentCount + 1;
        }

        this.showNotification(isLiked ? 'Post unliked' : 'Post liked!', 'success');
    }

    // Search Functionality
    setupSearchFunctionality() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearch();
            });

            // Live search suggestions
            searchInput.addEventListener('input', (e) => {
                this.showSearchSuggestions(e.target.value);
            });
        }
    }

    performSearch() {
        const query = document.getElementById('search-input')?.value.trim();
        if (!query) return;

        console.log('🔍 Searching for:', query);
        this.showSearchResults(query);
        this.showNotification(`Searching for "${query}"...`, 'info');
    }

    showSearchResults(query) {
        // Simulate search results
        const results = this.searchContent(query);
        
        // Navigate to search results section
        this.showSection('search');
        
        // Display results
        const container = document.getElementById('search-results');
        if (container) {
            container.innerHTML = `
                <div class="search-header">
                    <h3>Search results for "${query}"</h3>
                    <p>${results.length} results found</p>
                </div>
                <div class="search-results-grid">
                    ${results.map(item => this.createSearchResultCard(item)).join('')}
                </div>
            `;
        }
    }

    searchContent(query) {
        const allContent = [
            ...(window.demoContent?.videos || []),
            ...(window.demoContent?.songs || []),
            ...(window.demoContent?.games || []),
            ...(window.demoContent?.courses || [])
        ];

        return allContent.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase()) ||
            item.artist?.toLowerCase().includes(query.toLowerCase()) ||
            item.instructor?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);
    }

    // Filter Functionality
    setupFilterFunctionality() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const filter = e.target.dataset.filter;
                const section = e.target.closest('.content-section');
                const sectionId = section.id;
                
                this.applyFilter(sectionId, filter);
                
                // Update active tab
                e.target.parentElement.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });
    }

    applyFilter(sectionId, filter) {
        console.log(`🔍 Applying filter ${filter} to section ${sectionId}`);
        
        // Get all items in the section
        const items = document.querySelectorAll(`#${sectionId} [data-${sectionId.slice(0, -1)}-id]`);
        
        items.forEach(item => {
            if (filter === 'all') {
                item.style.display = '';
            } else {
                // Apply filter logic based on section
                const shouldShow = this.shouldShowItem(item, filter, sectionId);
                item.style.display = shouldShow ? '' : 'none';
            }
        });

        this.showNotification(`Filter applied: ${filter}`, 'info');
    }

    shouldShowItem(item, filter, sectionId) {
        // Simplified filtering logic
        const text = item.textContent.toLowerCase();
        return text.includes(filter.toLowerCase());
    }

    // Modal Interactions
    setupModalInteractions() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.remove();
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal[style*="flex"]');
                if (modal) modal.remove();
            }
        });
    }

    // Upload Functionality
    setupUploadFunctionality() {
        const uploadBtn = document.getElementById('upload-btn');
        const fileInput = document.getElementById('file-input');
        const uploadArea = document.getElementById('upload-area');

        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.showUploadModal());
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        if (uploadArea) {
            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                this.handleFileDrop(e);
            });
        }
    }

    showUploadModal() {
        const modal = document.getElementById('upload-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        this.processFiles(files);
    }

    handleFileDrop(e) {
        const files = e.dataTransfer.files;
        this.processFiles(files);
    }

    processFiles(files) {
        Array.from(files).forEach(file => {
            console.log('📁 Processing file:', file.name);
            this.showNotification(`File selected: ${file.name}`, 'info');
        });
    }

    // Profile Interactions
    setupProfileInteractions() {
        document.addEventListener('click', (e) => {
            // Subscribe button
            if (e.target.closest('.subscribe-btn')) {
                const profileCard = e.target.closest('.profile-card');
                const profileId = profileCard.dataset.profileId;
                this.toggleSubscribe(profileId, e.target.closest('.subscribe-btn'));
            }
        });
    }

    toggleSubscribe(profileId, button) {
        const isSubscribed = this.subscribedChannels.has(profileId);
        
        if (isSubscribed) {
            this.subscribedChannels.delete(profileId);
            button.textContent = 'Subscribe';
            button.classList.remove('subscribed');
            this.showNotification('Unsubscribed', 'info');
        } else {
            this.subscribedChannels.add(profileId);
            button.textContent = 'Subscribed';
            button.classList.add('subscribed');
            this.showNotification('Subscribed successfully!', 'success');
        }
    }

    // Helper Methods
    findVideoById(id) {
        return window.demoContent?.videos?.find(v => v.id === id);
    }

    findSongById(id) {
        return window.demoContent?.songs?.find(s => s.id === id);
    }

    findGameById(id) {
        return window.demoContent?.games?.find(g => g.id === id);
    }

    findCourseById(id) {
        return window.demoContent?.courses?.find(c => c.id === id);
    }

    formatViews(views) {
        if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
        return views.toString();
    }

    showSection(sectionId) {
        if (window.showSection) {
            window.showSection(sectionId);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Modal creation methods
    createVideoPlayerModal() {
        const modal = document.createElement('div');
        modal.id = 'video-player-modal';
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        return modal;
    }

    createMusicPlayerModal() {
        const modal = document.createElement('div');
        modal.id = 'music-player-modal';
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        return modal;
    }

    createGameLauncherModal() {
        const modal = document.createElement('div');
        modal.id = 'game-launcher-modal';
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        return modal;
    }

    createCourseDetailsModal() {
        const modal = document.createElement('div');
        modal.id = 'course-details-modal';
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        return modal;
    }

    // Player controls
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        const btn = document.querySelector('.play-pause-btn i');
        if (btn) {
            btn.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }

    setVolume(value) {
        this.volume = value / 100;
        console.log('🔊 Volume set to:', this.volume);
    }

    previousTrack() {
        console.log('⏮️ Previous track');
        this.showNotification('Previous track', 'info');
    }

    nextTrack() {
        console.log('⏭️ Next track');
        this.showNotification('Next track', 'info');
    }

    startGame(gameId) {
        console.log('🎮 Starting game:', gameId);
        this.showNotification('Game starting...', 'success');
    }

    addToWishlist(gameId) {
        console.log('❤️ Added to wishlist:', gameId);
        this.showNotification('Added to wishlist!', 'success');
    }

    previewCourse(courseId) {
        console.log('👁️ Previewing course:', courseId);
        this.showNotification('Course preview loading...', 'info');
    }

    shareVideo(videoId) {
        console.log('🔗 Sharing video:', videoId);
        this.showNotification('Video link copied to clipboard!', 'success');
    }

    saveVideo(videoId) {
        console.log('📚 Saving video:', videoId);
        this.showNotification('Video saved to your library!', 'success');
    }

    sharePost(postId) {
        console.log('🔗 Sharing post:', postId);
        this.showNotification('Post link copied to clipboard!', 'success');
    }

    updateVideoViews(videoId) {
        const video = this.findVideoById(videoId);
        if (video) {
            video.views = (video.views || 0) + 1;
        }
    }

    toggleSongLike(songId, element) {
        const isLiked = this.likedItems.has(`song-${songId}`);
        
        if (isLiked) {
            this.likedItems.delete(`song-${songId}`);
            element.classList.remove('liked');
        } else {
            this.likedItems.add(`song-${songId}`);
            element.classList.add('liked');
        }

        const song = this.findSongById(songId);
        if (song) {
            song.likes = (song.likes || 0) + (isLiked ? -1 : 1);
        }

        this.showNotification(isLiked ? 'Song removed from likes' : 'Song liked!', 'success');
    }

    toggleChannelSubscribe(channelName, element) {
        const isSubscribed = this.subscribedChannels.has(channelName);
        
        if (isSubscribed) {
            this.subscribedChannels.delete(channelName);
            element.classList.remove('subscribed');
        } else {
            this.subscribedChannels.add(channelName);
            element.classList.add('subscribed');
        }

        this.showNotification(isSubscribed ? 'Unsubscribed' : 'Subscribed successfully!', 'success');
    }

    openVideoComments(videoId) {
        console.log('💬 Opening comments for video:', videoId);
        this.showNotification('Comments loading...', 'info');
    }

    openPostComments(postId) {
        console.log('💬 Opening comments for post:', postId);
        this.showNotification('Comments loading...', 'info');
    }

    showSearchSuggestions(query) {
        if (query.length < 2) return;
        
        // Simulate search suggestions
        const suggestions = [
            `${query} tutorial`,
            `${query} review`,
            `${query} 2024`,
            `${query} explained`,
            `how to ${query}`
        ];

        console.log('💡 Search suggestions:', suggestions);
    }

    createSearchResultCard(item) {
        return `
            <div class="search-result-card" style="background: #1a1a1a; border-radius: 8px; padding: 16px; margin-bottom: 16px; cursor: pointer;">
                <h4 style="color: white; margin: 0 0 8px 0;">${item.title}</h4>
                <p style="color: #999; margin: 0 0 8px 0;">${item.description || item.artist || item.instructor}</p>
                <span style="color: #666; font-size: 0.8rem;">Type: ${item.constructor.name.toLowerCase().replace('generator', '')}</span>
            </div>
        `;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .modal-content {
        background: #1a1a1a;
        border-radius: 12px;
        padding: 24px;
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .modal-header h3 {
        color: white;
        margin: 0;
    }
    
    .close-btn {
        background: transparent;
        border: none;
        color: #999;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 4px;
    }
    
    .close-btn:hover {
        color: white;
    }
    
    .btn.liked {
        background: #ff0000 !important;
        color: white !important;
    }
    
    .subscribe-btn.subscribed {
        background: #666 !important;
        color: white !important;
    }
    
    .drag-over {
        border-color: #ff0000 !important;
        background: rgba(255, 0, 0, 0.1) !important;
    }
`;
document.head.appendChild(style);

// Initialize interaction manager
const interactionManager = new InteractionManager();
