// Media Hub - Complete YouTube-like Platform JavaScript

// Global State
let currentUser = null;
let allVideos = [];
let allUsers = [];
let currentVideo = null;
let isAdmin = false;

// DOM Elements
const elements = {
    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    userMenuBtn: document.getElementById('user-menu-btn'),
    userDropdown: document.getElementById('user-dropdown'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Sections
    sections: document.querySelectorAll('.content-section'),
    
    // Search
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    
    // Home
    featuredVideoPlayer: document.getElementById('featured-video-player'),
    featuredTitle: document.getElementById('featured-title'),
    featuredDescription: document.getElementById('featured-description'),
    featuredViews: document.getElementById('featured-views'),
    featuredDate: document.getElementById('featured-date'),
    homeVideos: document.getElementById('home-videos'),
    
    // Trending
    trendingVideos: document.getElementById('trending-videos'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    
    // Categories
    categoryCards: document.querySelectorAll('.category-card'),
    
    // Upload
    uploadForm: document.getElementById('upload-form'),
    uploadArea: document.getElementById('upload-area'),
    fileInput: document.getElementById('file-input'),
    selectFileBtn: document.getElementById('select-file-btn'),
    uploadPreview: document.getElementById('upload-preview'),
    previewVideo: document.getElementById('preview-video'),
    removePreview: document.getElementById('remove-preview'),
    
    // Profile
    profileAvatarImg: document.getElementById('profile-avatar-img'),
    channelName: document.getElementById('channel-name'),
    channelDescription: document.getElementById('channel-description'),
    subscribers: document.getElementById('subscribers'),
    totalViews: document.getElementById('total-views'),
    videoCount: document.getElementById('video-count'),
    userVideos: document.getElementById('user-videos'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Admin
    totalVideosAdmin: document.getElementById('total-videos'),
    pendingVideos: document.getElementById('pending-videos'),
    reportedVideos: document.getElementById('reported-videos'),
    totalUsers: document.getElementById('total-users'),
    activeUsers: document.getElementById('active-users'),
    newUsers: document.getElementById('new-users'),
    totalViewsAdmin: document.getElementById('total-views-admin'),
    totalLikes: document.getElementById('total-likes'),
    totalComments: document.getElementById('total-comments'),
    
    // Modal
    videoModal: document.getElementById('video-modal'),
    closeModal: document.getElementById('close-modal'),
    modalVideoPlayer: document.getElementById('modal-video-player'),
    modalVideoTitle: document.getElementById('modal-video-title'),
    modalViews: document.getElementById('modal-views'),
    modalDate: document.getElementById('modal-date'),
    modalCategory: document.getElementById('modal-category'),
    likeBtn: document.getElementById('like-btn'),
    dislikeBtn: document.getElementById('dislike-btn'),
    likeCount: document.getElementById('like-count'),
    dislikeCount: document.getElementById('dislike-count'),
    shareBtn: document.getElementById('share-btn'),
    downloadBtn: document.getElementById('download-btn'),
    playlistBtn: document.getElementById('playlist-btn'),
    modalChannelAvatar: document.getElementById('modal-channel-avatar'),
    modalChannelName: document.getElementById('modal-channel-name'),
    modalChannelSubs: document.getElementById('modal-channel-subs'),
    modalSubscribeBtn: document.getElementById('modal-subscribe-btn'),
    modalDescription: document.getElementById('modal-description'),
    commentsCount: document.getElementById('comments-count'),
    sortComments: document.getElementById('sort-comments'),
    commentInput: document.getElementById('comment-input'),
    postCommentBtn: document.getElementById('post-comment-btn'),
    commentsContainer: document.getElementById('comments-container')
};

// Initialize Application
function init() {
    setupEventListeners();
    loadMockData();
    checkAdminAccess();
    showSection('home');
    updateUI();
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // User Menu
    elements.userMenuBtn?.addEventListener('click', toggleUserDropdown);
    elements.logoutBtn?.addEventListener('click', logout);
    
    // Search
    elements.searchBtn?.addEventListener('click', performSearch);
    elements.searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    // Categories
    elements.categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            showCategoryContent(category);
        });
    });
    
    // Upload
    elements.selectFileBtn?.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput?.addEventListener('change', handleFileSelect);
    elements.uploadForm?.addEventListener('submit', handleUpload);
    elements.removePreview?.addEventListener('click', removePreviewVideo);
    
    // Drag and Drop
    elements.uploadArea?.addEventListener('dragover', handleDragOver);
    elements.uploadArea?.addEventListener('dragleave', handleDragLeave);
    elements.uploadArea?.addEventListener('drop', handleDrop);
    
    // Profile Tabs
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            showTab(tab);
        });
    });
    
    // Trending Filters
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const time = btn.getAttribute('data-time');
            setTrendingFilter(time, btn);
        });
    });
    
    // Modal
    elements.closeModal?.addEventListener('click', closeVideoModal);
    elements.likeBtn?.addEventListener('click', likeVideo);
    elements.dislikeBtn?.addEventListener('click', dislikeVideo);
    elements.shareBtn?.addEventListener('click', shareVideo);
    elements.downloadBtn?.addEventListener('click', downloadVideo);
    elements.playlistBtn?.addEventListener('click', addToPlaylist);
    elements.modalSubscribeBtn?.addEventListener('click', subscribeToChannel);
    elements.postCommentBtn?.addEventListener('click', postComment);
    
    // Close modal on outside click
    elements.videoModal?.addEventListener('click', (e) => {
        if (e.target === elements.videoModal) {
            closeVideoModal();
        }
    });
}

// Mock Data Generation
function loadMockData() {
    // Generate mock videos
    allVideos = [
        {
            id: 1,
            title: "Amazing Nature Documentary - 4K Ultra HD",
            description: "Experience the breathtaking beauty of nature in stunning 4K resolution. This documentary takes you on a journey through the world's most spectacular landscapes.",
            category: "movies",
            thumbnail: "https://picsum.photos/seed/nature1/400/225.jpg",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            duration: "12:34",
            views: 1542000,
            likes: 45600,
            dislikes: 234,
            comments: [
                { id: 1, user: "NatureLover", text: "Absolutely stunning! The cinematography is incredible.", date: "2024-01-15", likes: 45 },
                { id: 2, user: "WildlifeFan", text: "This reminds me of my trip to Yellowstone!", date: "2024-01-16", likes: 23 }
            ],
            channel: {
                name: "Nature Channel",
                avatar: "https://picsum.photos/seed/nature/50/50.jpg",
                subscribers: 1250000
            },
            uploadDate: "2024-01-10",
            tags: ["nature", "documentary", "4k", "wildlife"]
        },
        {
            id: 2,
            title: "Learn JavaScript - Complete Course for Beginners",
            description: "Start your web development journey with this comprehensive JavaScript course. Perfect for absolute beginners!",
            category: "courses",
            thumbnail: "https://picsum.photos/seed/js-course/400/225.jpg",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            duration: "45:20",
            views: 893000,
            likes: 23400,
            dislikes: 123,
            comments: [
                { id: 3, user: "CodeNewbie", text: "Best JavaScript tutorial I've found!", date: "2024-01-14", likes: 67 }
            ],
            channel: {
                name: "Code Academy",
                avatar: "https://picsum.photos/seed/code/50/50.jpg",
                subscribers: 890000
            },
            uploadDate: "2024-01-08",
            tags: ["javascript", "programming", "tutorial", "web development"]
        },
        {
            id: 3,
            title: "Epic Gaming Moments 2024 Compilation",
            description: "The most epic gaming moments of 2024! Watch incredible plays, funny fails, and amazing skills.",
            category: "gaming",
            thumbnail: "https://picsum.photos/seed/gaming1/400/225.jpg",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
            duration: "18:45",
            views: 2345000,
            likes: 89000,
            dislikes: 456,
            comments: [
                { id: 4, user: "GamerPro", text: "That last clip was insane! 🔥", date: "2024-01-13", likes: 89 },
                { id: 5, user: "CasualPlayer", text: "Love these compilations! Keep them coming!", date: "2024-01-14", likes: 34 }
            ],
            channel: {
                name: "Gaming Central",
                avatar: "https://picsum.photos/seed/gaming/50/50.jpg",
                subscribers: 2100000
            },
            uploadDate: "2024-01-12",
            tags: ["gaming", "compilation", "epic moments", "2024"]
        },
        {
            id: 4,
            title: "Relaxing Music for Study & Focus",
            description: "Beautiful instrumental music to help you study, focus, and relax. Perfect for work and meditation.",
            category: "music",
            thumbnail: "https://picsum.photos/seed/music1/400/225.jpg",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            duration: "1:02:30",
            views: 567000,
            likes: 34500,
            dislikes: 89,
            comments: [
                { id: 6, user: "StudentLife", text: "This helps me concentrate so much!", date: "2024-01-11", likes: 23 }
            ],
            channel: {
                name: "Calm Sounds",
                avatar: "https://picsum.photos/seed/music/50/50.jpg",
                subscribers: 450000
            },
            uploadDate: "2024-01-09",
            tags: ["music", "study", "focus", "relaxing"]
        },
        {
            id: 5,
            title: "Latest Sports Highlights - January 2024",
            description: "Catch up on all the best sports moments from January 2024. Goals, saves, and incredible plays!",
            category: "sports",
            thumbnail: "https://picsum.photos/seed/sports1/400/225.jpg",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            duration: "25:15",
            views: 1234000,
            likes: 67800,
            dislikes: 234,
            comments: [
                { id: 7, user: "SportsFan", text: "That goal at 15:30 was incredible!", date: "2024-01-10", likes: 56 }
            ],
            channel: {
                name: "Sports Network",
                avatar: "https://picsum.photos/seed/sports/50/50.jpg",
                subscribers: 1800000
            },
            uploadDate: "2024-01-07",
            tags: ["sports", "highlights", "january 2024", "goals"]
        },
        {
            id: 6,
            title: "Breaking News: Technology Updates",
            description: "Latest updates from the tech world. New gadgets, innovations, and industry news.",
            category: "news",
            thumbnail: "https://picsum.photos/seed/news1/400/225.jpg",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            duration: "8:45",
            views: 445000,
            likes: 12300,
            dislikes: 67,
            comments: [
                { id: 8, user: "TechEnthusiast", text: "Great coverage of the latest tech trends!", date: "2024-01-09", likes: 12 }
            ],
            channel: {
                name: "Tech News Daily",
                avatar: "https://picsum.photos/seed/news/50/50.jpg",
                subscribers: 320000
            },
            uploadDate: "2024-01-06",
            tags: ["news", "technology", "updates", "gadgets"]
        }
    ];
    
    // Generate mock users
    allUsers = [
        { id: 1, name: "Nature Channel", email: "nature@mediahub.com", role: "creator", subscribers: 1250000 },
        { id: 2, name: "Code Academy", email: "code@mediahub.com", role: "creator", subscribers: 890000 },
        { id: 3, name: "Gaming Central", email: "gaming@mediahub.com", role: "creator", subscribers: 2100000 },
        { id: 4, name: "Calm Sounds", email: "music@mediahub.com", role: "creator", subscribers: 450000 },
        { id: 5, name: "Sports Network", email: "sports@mediahub.com", role: "creator", subscribers: 1800000 },
        { id: 6, name: "Tech News Daily", email: "news@mediahub.com", role: "creator", subscribers: 320000 },
        { id: 7, name: "Admin User", email: "admin@mediahub.com", role: "admin", subscribers: 0 }
    ];
    
    // Set current user (for demo)
    currentUser = allUsers[6]; // Admin User
    isAdmin = currentUser && currentUser.role === 'admin';
}

// Update UI based on current user
function updateUI() {
    if (currentUser) {
        // Update profile
        if (elements.channelName) elements.channelName.textContent = currentUser.name;
        if (elements.subscribers) elements.subscribers.textContent = formatNumber(currentUser.subscribers || 0);
        
        // Show/hide admin elements
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => {
            el.style.display = isAdmin ? 'block' : 'none';
        });
    }
}

// Navigation
function showSection(sectionId) {
    elements.sections.forEach(section => {
        section.classList.remove('active');
    });
    
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
    
    if (targetSection) targetSection.classList.add('active');
    if (targetLink) targetLink.classList.add('active');
    
    // Load section-specific content
    switch(sectionId) {
        case 'home':
            loadHomeContent();
            break;
        case 'trending':
            loadTrendingContent();
            break;
        case 'profile':
            loadProfileContent();
            break;
        case 'admin':
            loadAdminContent();
            break;
    }
}

function toggleUserDropdown() {
    elements.userDropdown.classList.toggle('show');
}

// Search Functionality
function performSearch() {
    const query = elements.searchInput.value.toLowerCase();
    if (!query) return;
    
    const results = allVideos.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.channel.name.toLowerCase().includes(query) ||
        video.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    elements.homeVideos.innerHTML = '<h3>Search Results</h3>';
    
    if (results.length === 0) {
        elements.homeVideos.innerHTML += '<p>No videos found. Try different keywords.</p>';
        return;
    }
    
    results.forEach(video => {
        const videoCard = createVideoCard(video);
        elements.homeVideos.appendChild(videoCard);
    });
}

// Home Content
function loadHomeContent() {
    // Load featured video
    if (allVideos.length > 0) {
        const featured = allVideos[0];
        elements.featuredTitle.textContent = featured.title;
        elements.featuredDescription.textContent = featured.description;
        elements.featuredViews.innerHTML = `<i class="fas fa-eye"></i> ${formatNumber(featured.views)} views`;
        elements.featuredDate.innerHTML = `<i class="fas fa-calendar"></i> ${featured.uploadDate}`;
        elements.featuredVideoPlayer.poster = featured.thumbnail;
        elements.featuredVideoPlayer.src = featured.videoUrl;
    }
    
    // Load recommended videos
    elements.homeVideos.innerHTML = '';
    allVideos.forEach(video => {
        const videoCard = createVideoCard(video);
        elements.homeVideos.appendChild(videoCard);
    });
}

// Trending Content
function loadTrendingContent() {
    const trending = [...allVideos].sort((a, b) => b.views - a.views);
    elements.trendingVideos.innerHTML = '';
    
    trending.forEach(video => {
        const videoCard = createVideoCard(video);
        elements.trendingVideos.appendChild(videoCard);
    });
}

function setTrendingFilter(time, btn) {
    elements.filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    let filtered = [...allVideos];
    
    switch(time) {
        case 'today':
            // Filter for today's videos (mock)
            filtered = filtered.slice(0, 2);
            break;
        case 'week':
            // Filter for this week's videos (mock)
            filtered = filtered.slice(0, 4);
            break;
        case 'month':
            // Filter for this month's videos (mock)
            filtered = filtered.slice(0, 6);
            break;
        case 'all':
            // All videos
            break;
    }
    
    elements.trendingVideos.innerHTML = '';
    filtered.forEach(video => {
        const videoCard = createVideoCard(video);
        elements.trendingVideos.appendChild(videoCard);
    });
}

// Category Content
function showCategoryContent(category) {
    showSection('categories');
    const filtered = allVideos.filter(video => video.category === category);
    
    // Show category-specific content
    const categoryGrid = document.querySelector('.category-grid-full');
    categoryGrid.innerHTML = '';
    
    if (filtered.length === 0) {
        categoryGrid.innerHTML = '<p>No videos in this category yet.</p>';
        return;
    }
    
    filtered.forEach(video => {
        const videoCard = createVideoCard(video);
        categoryGrid.appendChild(videoCard);
    });
}

// Upload Functionality
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        showPreview(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    elements.uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        showPreview(file);
    }
}

function showPreview(file) {
    const url = URL.createObjectURL(file);
    elements.previewVideo.src = url;
    elements.uploadArea.style.display = 'none';
    elements.uploadPreview.style.display = 'block';
}

function removePreviewVideo() {
    elements.previewVideo.src = '';
    elements.uploadArea.style.display = 'block';
    elements.uploadPreview.style.display = 'none';
    elements.fileInput.value = '';
}

function handleUpload(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.uploadForm);
    const videoData = {
        id: Date.now(),
        title: formData.get('video-title'),
        description: formData.get('video-description'),
        category: formData.get('video-category'),
        visibility: formData.get('video-visibility'),
        tags: formData.get('video-tags').split(',').map(tag => tag.trim()),
        channel: {
            name: currentUser.name,
            avatar: "https://picsum.photos/seed/user/50/50.jpg",
            subscribers: currentUser.subscribers || 0
        },
        uploadDate: new Date().toISOString().split('T')[0],
        views: 0,
        likes: 0,
        dislikes: 0,
        comments: []
    };
    
    // In real app, this would upload to server
    console.log('Uploading video:', videoData);
    
    // Simulate successful upload
    allVideos.unshift(videoData);
    
    alert('Video uploaded successfully!');
    elements.uploadForm.reset();
    removePreviewVideo();
    
    // Refresh content
    showSection('home');
}

// Profile Content
function loadProfileContent() {
    // Load user's videos
    const userVideos = allVideos.filter(video => video.channel.name === currentUser.name);
    elements.userVideos.innerHTML = '';
    
    if (userVideos.length === 0) {
        elements.userVideos.innerHTML = '<p>No videos uploaded yet.</p>';
        return;
    }
    
    userVideos.forEach(video => {
        const videoCard = createVideoCard(video);
        elements.userVideos.appendChild(videoCard);
    });
    
    // Update stats
    const totalViews = userVideos.reduce((sum, video) => sum + video.views, 0);
    if (elements.totalViews) elements.totalViews.textContent = formatNumber(totalViews);
    if (elements.videoCount) elements.videoCount.textContent = userVideos.length;
}

function showTab(tabName) {
    elements.tabBtns.forEach(btn => btn.classList.remove('active'));
    elements.tabContents.forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`profile-${tabName}`).classList.add('active');
}

// Admin Content
function loadAdminContent() {
    if (!isAdmin) return;
    
    // Update admin stats
    const totalViews = allVideos.reduce((sum, video) => sum + video.views, 0);
    const totalLikes = allVideos.reduce((sum, video) => sum + video.likes, 0);
    const totalComments = allVideos.reduce((sum, video) => sum + video.comments.length, 0);
    
    if (elements.totalVideosAdmin) elements.totalVideosAdmin.textContent = allVideos.length;
    if (elements.pendingVideos) elements.pendingVideos.textContent = Math.floor(Math.random() * 5);
    if (elements.reportedVideos) elements.reportedVideos.textContent = Math.floor(Math.random() * 3);
    if (elements.totalUsers) elements.totalUsers.textContent = allUsers.length;
    if (elements.activeUsers) elements.activeUsers.textContent = Math.floor(Math.random() * 50) + 20;
    if (elements.newUsers) elements.newUsers.textContent = Math.floor(Math.random() * 10) + 5;
    if (elements.totalViewsAdmin) elements.totalViewsAdmin.textContent = formatNumber(totalViews);
    if (elements.totalLikes) elements.totalLikes.textContent = formatNumber(totalLikes);
    if (elements.totalComments) elements.totalComments.textContent = formatNumber(totalComments);
}

// Video Player Modal
function showVideoModal(video) {
    currentVideo = video;
    
    elements.modalVideoTitle.textContent = video.title;
    elements.modalViews.innerHTML = `<i class="fas fa-eye"></i> ${formatNumber(video.views)} views`;
    elements.modalDate.innerHTML = `<i class="fas fa-calendar"></i> ${video.uploadDate}`;
    elements.modalCategory.textContent = getCategoryName(video.category);
    elements.likeCount.textContent = formatNumber(video.likes);
    elements.dislikeCount.textContent = formatNumber(video.dislikes);
    elements.modalChannelName.textContent = video.channel.name;
    elements.modalChannelSubs.textContent = `${formatNumber(video.channel.subscribers)} subscribers`;
    elements.modalDescription.textContent = video.description;
    elements.commentsCount.textContent = video.comments.length;
    
    elements.modalVideoPlayer.src = video.videoUrl;
    elements.modalChannelAvatar.src = video.channel.avatar;
    
    loadComments(video.comments);
    
    elements.videoModal.classList.add('show');
    
    // Increment view count
    video.views++;
    elements.modalViews.innerHTML = `<i class="fas fa-eye"></i> ${formatNumber(video.views)} views`;
}

function closeVideoModal() {
    elements.videoModal.classList.remove('show');
    elements.modalVideoPlayer.pause();
    currentVideo = null;
}

// Video Interactions
function likeVideo() {
    if (!currentVideo) return;
    
    currentVideo.likes++;
    elements.likeCount.textContent = formatNumber(currentVideo.likes);
    
    // Toggle like button state
    elements.likeBtn.classList.toggle('liked');
    
    console.log('Video liked:', currentVideo.title);
}

function dislikeVideo() {
    if (!currentVideo) return;
    
    currentVideo.dislikes++;
    elements.dislikeCount.textContent = formatNumber(currentVideo.dislikes);
    
    // Toggle dislike button state
    elements.dislikeBtn.classList.toggle('disliked');
    
    console.log('Video disliked:', currentVideo.title);
}

function shareVideo() {
    if (!currentVideo) return;
    
    const shareData = {
        title: currentVideo.title,
        text: `Check out this video: ${currentVideo.title}`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback: copy link to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
}

function downloadVideo() {
    if (!currentVideo) return;
    
    // In real app, this would trigger download
    alert('Download started! (This would download the video file)');
    console.log('Downloading video:', currentVideo.title);
}

function addToPlaylist() {
    if (!currentVideo) return;
    
    alert('Video added to your playlist!');
    console.log('Added to playlist:', currentVideo.title);
}

function subscribeToChannel() {
    if (!currentVideo) return;
    
    const isSubscribed = elements.modalSubscribeBtn.classList.contains('subscribed');
    
    if (isSubscribed) {
        currentVideo.channel.subscribers--;
        elements.modalSubscribeBtn.textContent = 'Subscribe';
        elements.modalSubscribeBtn.classList.remove('subscribed');
        elements.modalChannelSubs.textContent = `${formatNumber(currentVideo.channel.subscribers)} subscribers`;
    } else {
        currentVideo.channel.subscribers++;
        elements.modalSubscribeBtn.textContent = 'Subscribed';
        elements.modalSubscribeBtn.classList.add('subscribed');
        elements.modalChannelSubs.textContent = `${formatNumber(currentVideo.channel.subscribers)} subscribers`;
    }
    
    console.log('Subscription toggled for:', currentVideo.channel.name);
}

// Comments
function loadComments(comments) {
    elements.commentsContainer.innerHTML = '';
    
    if (comments.length === 0) {
        elements.commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        return;
    }
    
    comments.forEach(comment => {
        const commentEl = createCommentElement(comment);
        elements.commentsContainer.appendChild(commentEl);
    });
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
        <img src="https://picsum.photos/seed/${comment.user}/40/40.jpg" alt="${comment.user}" class="comment-avatar">
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-author">${comment.user}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-actions">
                <button class="comment-action" onclick="likeComment(${comment.id})">
                    <i class="fas fa-thumbs-up"></i> ${comment.likes || 0}
                </button>
                <button class="comment-action" onclick="replyToComment(${comment.id})">
                    <i class="fas fa-reply"></i> Reply
                </button>
            </div>
        </div>
    `;
    return commentDiv;
}

function postComment() {
    const commentText = elements.commentInput.value.trim();
    if (!commentText) return;
    
    const comment = {
        id: Date.now(),
        user: currentUser.name,
        text: commentText,
        date: new Date().toISOString().split('T')[0],
        likes: 0
    };
    
    if (currentVideo) {
        currentVideo.comments.push(comment);
        loadComments(currentVideo.comments);
        elements.commentsCount.textContent = currentVideo.comments.length;
    }
    
    elements.commentInput.value = '';
    console.log('Comment posted:', comment);
}

function likeComment(commentId) {
    console.log('Liked comment:', commentId);
    // In real app, this would update the comment's likes
}

function replyToComment(commentId) {
    console.log('Replying to comment:', commentId);
    // In real app, this would open a reply form
}

// Helper Functions
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
        <div class="video-thumbnail">
            <img src="${video.thumbnail}" alt="${video.title}">
            <span class="video-duration">${video.duration}</span>
        </div>
        <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
            <div class="video-meta">
                <a href="#" class="channel-name">${video.channel.name}</a>
                <span>${formatNumber(video.views)} views</span>
                <span>${video.uploadDate}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => showVideoModal(video));
    return card;
}

function getCategoryName(category) {
    const names = {
        music: '🎵 Music',
        movies: '🎬 Movies',
        courses: '🎓 Courses',
        gaming: '🎮 Gaming',
        sports: '⚽ Sports',
        news: '📰 News'
    };
    return names[category] || category;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function checkAdminAccess() {
    // Simple admin check - in real app, this would be server-side
    isAdmin = currentUser && currentUser.role === 'admin';
}

function logout() {
    currentUser = null;
    isAdmin = false;
    alert('Logged out successfully!');
    showSection('home');
    updateUI();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
