// Media Hub - Complete YouTube-like Platform JavaScript
// Updated to use API endpoints instead of hardcoded data

// Global State
let currentUser = null;
let allVideos = [];
let allUsers = [];
let currentVideo = null;
let isAdmin = false;

// Toast Notification System
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Loading State Management
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    }
}

function hideLoading(elementId, content = '') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = content;
    }
}

// Enhanced Video Card Creation (YouTube-style)
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
        <div class="video-thumbnail">
            <img src="${video.thumbnail || `https://picsum.photos/seed/${video.id}/320/180.jpg`}" alt="${video.title}" loading="lazy">
            <span class="video-duration">${video.duration || '10:00'}</span>
            <div class="video-play-overlay">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="video-info">
            <img src="${video.user?.avatar || 'https://picsum.photos/seed/avatar/36/36.jpg'}" alt="${video.user?.channelName || 'Channel'}" class="channel-avatar">
            <div class="video-details">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-channel ${video.user?.verified ? 'verified' : ''}">
                    ${video.user?.channelName || 'Unknown Channel'}
                    ${video.user?.verified ? '<i class="fas fa-check-circle verified-badge"></i>' : ''}
                </div>
                <div class="video-meta">
                    ${formatViews(video.views || 0)} views • ${formatDate(video.createdAt)}
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => playVideo(video));
    return card;
}

// Sidebar Toggle Function
function toggleSidebar() {
    const sidebar = elements.sidebar;
    const mainWrapper = elements.mainWrapper;
    
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        mainWrapper.classList.remove('sidebar-open');
    } else {
        sidebar.classList.add('open');
        mainWrapper.classList.add('sidebar-open');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Sidebar Toggle
    elements.menuToggle?.addEventListener('click', toggleSidebar);
    
    // Sidebar Navigation
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            if (section) {
                showSection(section);
                // Update active states
                document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
    
    // User Menu
    elements.userMenuBtn?.addEventListener('click', toggleUserDropdown);
    elements.logoutBtn?.addEventListener('click', logout);
    elements.registerBtn?.addEventListener('click', showRegisterModal);
    elements.loginBtn?.addEventListener('click', showLoginModal);
    
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
    elements.uploadBtn?.addEventListener('click', showUploadModal);
    elements.selectFileBtn?.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput?.addEventListener('change', handleFileSelect);
    elements.uploadForm?.addEventListener('submit', handleUpload);
    elements.removePreview?.addEventListener('click', removePreviewVideo);
    
    // Drag and Drop
    elements.uploadArea?.addEventListener('dragover', handleDragOver);
    elements.uploadArea?.addEventListener('dragleave', handleDragLeave);
    elements.uploadArea?.addEventListener('drop', handleDrop);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.userMenuBtn?.contains(e.target) && !elements.userDropdown?.contains(e.target)) {
            elements.userDropdown.style.display = 'none';
        }
    });
}

// Format Views Helper
function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
}

// Format Date Helper
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

// DOM Elements
const elements = {
    // Navigation
    menuToggle: document.getElementById('menu-toggle'),
    sidebar: document.getElementById('sidebar'),
    mainWrapper: document.getElementById('main-wrapper'),
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
    uploadBtn: document.getElementById('upload-btn'),
    uploadModal: document.getElementById('upload-modal'),
    uploadForm: document.getElementById('upload-form'),
    fileInput: document.getElementById('file-input'),
    uploadArea: document.getElementById('upload-area'),
    videoPreview: document.getElementById('video-preview'),
    selectFileBtn: document.getElementById('select-file-btn'),
    removePreview: document.getElementById('remove-preview'),
    
    // Auth
    loginModal: document.getElementById('login-modal'),
    registerModal: document.getElementById('register-modal'),
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    loginBtn: document.getElementById('login-btn'),
    registerBtn: document.getElementById('register-btn'),
    switchToRegister: document.getElementById('switch-to-register'),
    switchToLogin: document.getElementById('switch-to-login'),
    
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
    commentsContainer: document.getElementById('comments-container'),
    
    // Registration and Login Modals
    registerModal: document.getElementById('register-modal'),
    registerBtn: document.getElementById('register-btn'),
    loginModal: document.getElementById('login-modal'),
    
    // Registration Form Elements
    registerEmail: document.getElementById('register-email'),
    registerUsername: document.getElementById('register-username'),
    registerChannelName: document.getElementById('register-channel-name'),
    registerDescription: document.getElementById('register-description'),
    registerPassword: document.getElementById('register-password'),
    registerConfirmPassword: document.getElementById('register-confirm-password'),
    
    // Login Form Elements
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    
    // Switch between modals
    switchToRegisterBtn: document.getElementById('switch-to-register'),
    switchToLoginBtn: document.getElementById('switch-to-login'),
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Media Hub Application Initializing...');
    
    // Initialize all components
    try {
        // Setup event listeners
        setupEventListeners();
        
        // Load initial content
        loadInitialData();
        
        // Load content for all sections
        loadAllSectionContent();
        
        // Initialize content loader
        if (typeof contentLoader !== 'undefined') {
            console.log('Content loader initialized');
        }
        
        // Initialize other modules
        console.log('Live streaming:', typeof liveStreaming !== 'undefined');
        console.log('Playlist manager:', typeof playlistManager !== 'undefined');
        console.log('Notifications:', typeof notificationManager !== 'undefined');
        console.log('Advanced search:', typeof advancedSearch !== 'undefined');
        console.log('Social features:', typeof socialFeatures !== 'undefined');
        
        showToast('Media Hub loaded successfully!', 'success');
        
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('Error loading application', 'error');
    }
});

// Load all section content
function loadAllSectionContent() {
    // Load content for each section
    setTimeout(() => {
        if (typeof contentLoader !== 'undefined') {
            contentLoader.displayContent('videos', 'videos-container');
            contentLoader.displayContent('songs', 'songs-container');
            contentLoader.displayContent('news', 'news-container');
            contentLoader.displayContent('profiles', 'profiles-container');
            contentLoader.displayContent('courses', 'courses-container');
        }
    }, 1000);
}

// Check authentication status
async function checkAuthStatus() {
    try {
        if (api.token) {
            const response = await api.getCurrentUser();
            currentUser = response.user;
            isAdmin = currentUser.isAdmin;
            updateAuthUI();
        }
    } catch (error) {
        console.log('User not authenticated');
        api.logout();
    }
}

// Load initial data from API
async function loadInitialData() {
    try {
        console.log('Loading initial data from API...');
        
        // Show loading state
        showLoading('home-videos');
        
        // Load videos
        const videosResponse = await api.getVideos({ limit: 20 });
        allVideos = videosResponse.videos || [];
        console.log('Videos loaded:', allVideos.length);
        
        // Load trending videos
        const trendingResponse = await api.getTrendingVideos({ limit: 10 });
        console.log('Trending videos loaded:', trendingResponse.videos?.length || 0);
        
        // Update UI with loaded data
        displayHomeVideos();
        displayTrendingVideos(trendingResponse.videos || []);
        
    } catch (error) {
        console.error('Error loading initial data:', error);
        showToast('Failed to load videos. Showing demo content.', 'warning');
        console.log('Falling back to demo mode...');
        
        // Fallback to demo mode if API fails
        loadDemoData();
    }
}

// Demo data fallback
function loadDemoData() {
    allVideos = [
        {
            id: 'demo-1',
            title: "Amazing Nature Documentary - 4K Ultra HD",
            description: "Experience the breathtaking beauty of nature in stunning 4K resolution.",
            thumbnail: "https://picsum.photos/seed/nature1/400/225.jpg",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            duration: "12:34",
            views: 1542000,
            likes: 45600,
            dislikes: 234,
            category: "movies",
            uploadDate: "2024-01-10",
            tags: ["nature", "documentary", "4k", "wildlife"],
            user: {
                id: 'demo-user-1',
                username: 'naturechannel',
                channelName: 'Nature Channel',
                avatar: 'https://picsum.photos/seed/nature/50/50.jpg',
                subscribers: 1250000
            }
        },
        {
            id: 'demo-2',
            title: "Learn JavaScript - Complete Course for Beginners",
            description: "Start your web development journey with this comprehensive JavaScript course.",
            thumbnail: "https://picsum.photos/seed/js-course/400/225.jpg",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            duration: "45:20",
            views: 893000,
            likes: 23400,
            dislikes: 123,
            category: "courses",
            uploadDate: "2024-01-08",
            tags: ["javascript", "programming", "tutorial", "web development"],
            user: {
                id: 'demo-user-2',
                username: 'codeacademy',
                channelName: 'Code Academy',
                avatar: 'https://picsum.photos/seed/code/50/50.jpg',
                subscribers: 890000
            }
        }
    ];
    
    displayHomeVideos();
    displayTrendingVideos(allVideos);
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
    elements.registerBtn?.addEventListener('click', showRegisterModal);
    elements.loginBtn?.addEventListener('click', showLoginModal);
    
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
    
    // Registration and Login Modal close buttons
    elements.closeRegisterModal?.addEventListener('click', closeRegisterModal);
    elements.closeLoginModal?.addEventListener('click', closeLoginModal);
}

// Authentication Functions
async function login(email, password) {
    try {
        const response = await api.login({ email, password });
        currentUser = response.user;
        isAdmin = currentUser.isAdmin;
        updateAuthUI();
        showNotification('Login successful!', 'success');
        return true;
    } catch (error) {
        showNotification('Login failed: ' + error.message, 'error');
        return false;
    }
}

async function register(userData) {
    try {
        const { error } = registerSchema.validate(userData);
        if (error) {
            showNotification('Registration failed: ' + error.details[0].message, 'error');
            return false;
        }

        const response = await api.register(userData);
        currentUser = response.user;
        isAdmin = currentUser.isAdmin;
        updateAuthUI();
        closeRegisterModal();
        showNotification('Registration successful!', 'success');
        return true;
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed: ' + error.message, 'error');
        return false;
    }
}

async function handleRegisterForm(e) {
    e.preventDefault();
    
    const formData = {
        email: elements.registerEmail?.value || '',
        username: elements.registerUsername?.value || '',
        channelName: elements.registerChannelName?.value || '',
        description: elements.registerDescription?.value || '',
        password: elements.registerPassword?.value || '',
        confirmPassword: elements.registerConfirmPassword?.value || ''
    };

    if (formData.password !== formData.confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    await register(formData);
}

async function handleLoginForm(e) {
    e.preventDefault();
    
    const formData = {
        email: elements.loginEmail?.value || '',
        password: elements.loginPassword?.value || ''
    };

    await login(formData);
    closeLoginModal();
}

function logout() {
    api.logout();
    currentUser = null;
    isAdmin = false;
    updateAuthUI();
    showNotification('Logged out successfully', 'info');
    showSection('home');
}

function updateAuthUI() {
    if (currentUser) {
        // Show authenticated UI
        document.querySelectorAll('.auth-required').forEach(el => {
            el.style.display = 'block';
        });
        document.querySelectorAll('.auth-hidden').forEach(el => {
            el.style.display = 'none';
        });
        
        if (isAdmin) {
            document.querySelectorAll('.admin-only').forEach(el => {
                el.style.display = 'block';
            });
        }
        
        // Update user menu
        if (elements.userMenuBtn) {
            elements.userMenuBtn.innerHTML = `
                <img src="${currentUser.avatar || 'https://picsum.photos/seed/user/40/40.jpg'}" 
                     alt="${currentUser.channelName}" 
                     class="user-avatar">
            `;
        }
    } else {
        // Show unauthenticated UI
        document.querySelectorAll('.auth-required').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('.auth-hidden').forEach(el => {
            el.style.display = 'block';
        });
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }
}

// Video Functions
function displayHomeVideos() {
    if (!elements.homeVideos) return;
    
    const featuredVideo = allVideos[0];
    if (featuredVideo) {
        displayFeaturedVideo(featuredVideo);
    }
    
    const otherVideos = allVideos.slice(1, 9); // Show 8 more videos
    displayVideoGrid(elements.homeVideos, otherVideos);
}

function displayFeaturedVideo(video) {
    if (!elements.featuredVideoPlayer) return;
    
    elements.featuredVideoPlayer.src = video.videoUrl;
    elements.featuredTitle.textContent = video.title;
    elements.featuredDescription.textContent = video.description;
    elements.featuredViews.textContent = formatNumber(video.views) + ' views';
    elements.featuredDate.textContent = formatDate(video.uploadDate);
}

function displayTrendingVideos(videos) {
    if (!elements.trendingVideos) return;
    displayVideoGrid(elements.trendingVideos, videos);
}

function displayVideoGrid(container, videos) {
    if (!container) return;
    
    // Hide loading spinner
    hideLoading(container.id);
    
    // Create video cards using the enhanced function
    const videoCards = videos.map(video => createVideoCard(video));
    
    // Clear container and append new cards
    container.innerHTML = '';
    videoCards.forEach(card => container.appendChild(card));
    
    // Show success message if videos loaded
    if (videos.length > 0) {
        showToast(`Loaded ${videos.length} videos`, 'success');
    }
}

// Play Video Function
function playVideo(video) {
    currentVideo = video;
    
    // Update featured video
    if (elements.featuredVideoPlayer) {
        displayFeaturedVideo(video);
    }
    
    // Show video player modal or navigate to video page
    showToast(`Now playing: ${video.title}`, 'info');
    
    // Scroll to featured video
    elements.featuredVideoPlayer?.scrollIntoView({ behavior: 'smooth' });
}

async function openVideoModal(videoId) {
    try {
        const response = await api.getVideoById(videoId);
        currentVideo = response.video;
        displayVideoInModal(currentVideo);
        elements.videoModal.style.display = 'flex';
    } catch (error) {
        showNotification('Failed to load video: ' + error.message, 'error');
    }
}

function displayVideoInModal(video) {
    if (!elements.modalVideoPlayer) return;
    
    elements.modalVideoPlayer.src = video.videoUrl;
    elements.modalVideoTitle.textContent = video.title;
    elements.modalViews.textContent = formatNumber(video.views) + ' views';
    elements.modalDate.textContent = formatDate(video.uploadDate);
    elements.modalCategory.textContent = video.category;
    elements.modalDescription.textContent = video.description;
    
    // Channel info
    elements.modalChannelAvatar.src = video.user.avatar;
    elements.modalChannelName.textContent = video.user.channelName;
    elements.modalChannelSubs.textContent = formatNumber(video.user.subscribers) + ' subscribers';
    
    // Like counts
    elements.likeCount.textContent = formatNumber(video.likes);
    elements.dislikeCount.textContent = formatNumber(video.dislikes || 0);
    
    // Comments
    elements.commentsCount.textContent = video._count?.comments || 0;
    loadComments(video.id);
    
    // Check if user is subscribed
    if (currentUser) {
        checkSubscriptionStatus(video.user.id);
    }
}

async function loadComments(videoId) {
    try {
        const response = await api.getComments(videoId);
        displayComments(response.comments || []);
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

function displayComments(comments) {
    if (!elements.commentsContainer) return;
    
    elements.commentsContainer.innerHTML = comments.map(comment => `
        <div class="comment">
            <img src="${comment.user.avatar}" alt="${comment.user.username}" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${comment.user.username}</span>
                    <span class="comment-date">${formatDate(comment.createdAt)}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions">
                    <button class="comment-like-btn" data-comment-id="${comment.id}">
                        <i class="fas fa-thumbs-up"></i> ${comment.likes}
                    </button>
                    <button class="comment-reply-btn">Reply</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function postComment() {
    if (!currentUser || !currentVideo || !elements.commentInput) return;
    
    const text = elements.commentInput.value.trim();
    if (!text) return;
    
    try {
        await api.createComment(currentVideo.id, { text });
        elements.commentInput.value = '';
        loadComments(currentVideo.id);
        showNotification('Comment posted!', 'success');
    } catch (error) {
        showNotification('Failed to post comment: ' + error.message, 'error');
    }
}

async function likeVideo() {
    if (!currentUser || !currentVideo) return;
    
    try {
        await api.toggleVideoLike(currentVideo.id, 'like');
        // Update UI
        const currentLikes = parseInt(elements.likeCount.textContent.replace(/,/g, ''));
        elements.likeCount.textContent = formatNumber(currentLikes + 1);
        showNotification('Video liked!', 'success');
    } catch (error) {
        showNotification('Failed to like video: ' + error.message, 'error');
    }
}

async function dislikeVideo() {
    if (!currentUser || !currentVideo) return;
    
    try {
        await api.toggleVideoLike(currentVideo.id, 'dislike');
        // Update UI
        const currentDislikes = parseInt(elements.dislikeCount.textContent.replace(/,/g, ''));
        elements.dislikeCount.textContent = formatNumber(currentDislikes + 1);
        showNotification('Video disliked!', 'info');
    } catch (error) {
        showNotification('Failed to dislike video: ' + error.message, 'error');
    }
}

async function subscribeToChannel() {
    if (!currentUser || !currentVideo) return;
    
    try {
        await api.toggleSubscription(currentVideo.user.id);
        // Update button text
        const btn = elements.modalSubscribeBtn;
        btn.textContent = btn.textContent === 'Subscribe' ? 'Subscribed' : 'Subscribe';
        showNotification('Subscription updated!', 'success');
    } catch (error) {
        showNotification('Failed to update subscription: ' + error.message, 'error');
    }
}

// Upload Functions
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        previewVideoFile(file);
    }
}

function previewVideoFile(file) {
    if (!elements.previewVideo || !elements.uploadPreview) return;
    
    const url = URL.createObjectURL(file);
    elements.previewVideo.src = url;
    elements.uploadPreview.style.display = 'block';
}

function removePreviewVideo() {
    if (elements.previewVideo && elements.uploadPreview) {
        elements.previewVideo.src = '';
        elements.uploadPreview.style.display = 'none';
        if (elements.fileInput) {
            elements.fileInput.value = '';
        }
    }
}

async function handleUpload(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login to upload videos', 'error');
        return;
    }
    
    const formData = new FormData(elements.uploadForm);
    
    try {
        await api.createVideo(formData);
        showNotification('Video uploaded successfully!', 'success');
        removePreviewVideo();
        elements.uploadForm.reset();
        showSection('profile');
        // Reload user videos
        await loadUserVideos();
    } catch (error) {
        showNotification('Upload failed: ' + error.message, 'error');
    }
}

// Search Functions
async function performSearch() {
    const query = elements.searchInput?.value.trim();
    if (!query) return;
    
    try {
        const response = await api.getVideos({ search: query });
        allVideos = response.videos || [];
        displayVideoGrid(elements.homeVideos, allVideos);
        showSection('home');
    } catch (error) {
        showNotification('Search failed: ' + error.message, 'error');
    }
}

// Load Section Content
function loadSectionContent(sectionId) {
    switch(sectionId) {
        case 'videos':
            contentLoader.displayContent('videos', 'videos-container');
            break;
        case 'music':
            contentLoader.displayContent('songs', 'songs-container');
            break;
        case 'news':
            contentLoader.displayContent('news', 'news-container');
            break;
        case 'profiles':
            contentLoader.displayContent('profiles', 'profiles-container');
            break;
        case 'courses':
            contentLoader.displayContent('courses', 'courses-container');
            break;
        case 'live':
            // Live streaming content is already loaded by live-streaming.js
            break;
        case 'playlists':
            // Playlist content is already loaded by playlist-manager.js
            break;
        case 'notifications':
            // Notification content is already loaded by notifications.js
            break;
    }
}

// UI Helper Functions
function showSection(sectionId) {
    elements.sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load content for the section
        loadSectionContent(sectionId);
    }
    
    // Update nav links
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
    
    // Load section-specific data
    if (sectionName === 'profile' && currentUser) {
        loadUserProfile();
    } else if (sectionName === 'admin' && isAdmin) {
        loadAdminData();
    }
}

function toggleUserDropdown() {
    if (elements.userDropdown) {
        elements.userDropdown.style.display = 
            elements.userDropdown.style.display === 'block' ? 'none' : 'block';
    }
}

function closeVideoModal() {
    if (elements.videoModal) {
        elements.videoModal.style.display = 'none';
        if (elements.modalVideoPlayer) {
            elements.modalVideoPlayer.pause();
            elements.modalVideoPlayer.src = '';
        }
        currentVideo = null;
    }
}

// Modal Functions
function showRegisterModal() {
    if (elements.registerModal) {
        elements.registerModal.style.display = 'flex';
    }
}

function showLoginModal() {
    if (elements.loginModal) {
        elements.loginModal.style.display = 'flex';
    }
}

function closeRegisterModal() {
    if (elements.registerModal) {
        elements.registerModal.style.display = 'none';
    }
}

function closeLoginModal() {
    if (elements.loginModal) {
        elements.loginModal.style.display = 'none';
    }
}

function showTab(tabName) {
    // Hide all tab contents
    elements.tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Show target tab
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Update tab buttons
    elements.tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });
}

function showCategoryContent(category) {
    // Filter videos by category
    const filteredVideos = allVideos.filter(video => video.category === category);
    displayVideoGrid(elements.homeVideos, filteredVideos);
    showSection('home');
}

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('video/')) {
            previewVideoFile(file);
        } else {
            showNotification('Please upload a video file', 'error');
        }
    }
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return '1 day ago';
    } else if (diffDays < 7) {
        return diffDays + ' days ago';
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks + ' week' + (weeks > 1 ? 's' : '') + ' ago';
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return months + ' month' + (months > 1 ? 's' : '') + ' ago';
    } else {
        const years = Math.floor(diffDays / 365);
        return years + ' year' + (years > 1 ? 's' : '') + ' ago';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateUI() {
    updateAuthUI();
    // Add any other UI updates here
}

// Profile Functions
async function loadUserProfile() {
    if (!currentUser) return;
    
    try {
        const response = await api.getUserVideos(currentUser.id);
        const videos = response.videos || [];
        
        // Update profile UI
        if (elements.profileAvatarImg) {
            elements.profileAvatarImg.src = currentUser.avatar || 'https://picsum.photos/seed/user/100/100.jpg';
        }
        if (elements.channelName) {
            elements.channelName.textContent = currentUser.channelName;
        }
        if (elements.channelDescription) {
            elements.channelDescription.textContent = currentUser.description || 'No description';
        }
        if (elements.subscribers) {
            elements.subscribers.textContent = formatNumber(currentUser.subscribers);
        }
        if (elements.totalViews) {
            elements.totalViews.textContent = formatNumber(currentUser.totalViews);
        }
        if (elements.videoCount) {
            elements.videoCount.textContent = currentUser.videoCount;
        }
        
        // Display user's videos
        displayVideoGrid(elements.userVideos, videos);
        
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

async function loadUserVideos() {
    if (!currentUser) return;
    
    try {
        const response = await api.getUserVideos(currentUser.id);
        displayVideoGrid(elements.userVideos, response.videos || []);
    } catch (error) {
        console.error('Error loading user videos:', error);
    }
}

// Admin Functions
async function loadAdminData() {
    if (!isAdmin) return;
    
    try {
        // This would require admin-specific API endpoints
        // For now, just show the admin section
        console.log('Admin section loaded');
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

// Share and other functions
function shareVideo() {
    if (!currentVideo) return;
    
    const url = window.location.href + '?video=' + currentVideo.id;
    
    if (navigator.share) {
        navigator.share({
            title: currentVideo.title,
            text: currentVideo.description,
            url: url
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url);
        showNotification('Link copied to clipboard!', 'success');
    }
}

function downloadVideo() {
    if (!currentVideo) return;
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = currentVideo.videoUrl;
    link.download = currentVideo.title + '.mp4';
    link.click();
    
    showNotification('Download started!', 'info');
}

function addToPlaylist() {
    if (!currentUser) {
        showNotification('Please login to save to playlist', 'error');
        return;
    }
    
    if (!currentVideo) return;
    
    // This would require playlist API endpoints
    showNotification('Added to playlist!', 'success');
}

// Trending filter
function setTrendingFilter(timeFilter, button) {
    // Update active button
    elements.filterBtns.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Load trending videos with filter
    loadTrendingVideos(timeFilter);
}

async function loadTrendingVideos(timeFilter = 'week') {
    try {
        const response = await api.getTrendingVideos();
        displayTrendingVideos(response.videos || []);
    } catch (error) {
        console.error('Error loading trending videos:', error);
    }
}

async function checkSubscriptionStatus(channelId) {
    if (!currentUser) return;
    
    try {
        const response = await api.getSubscriptionStatus(channelId);
        const btn = elements.modalSubscribeBtn;
        if (btn) {
            btn.textContent = response.subscribed ? 'Subscribed' : 'Subscribe';
            btn.classList.toggle('subscribed', response.subscribed);
        }
    } catch (error) {
        console.error('Error checking subscription status:', error);
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu') && elements.userDropdown) {
        elements.userDropdown.style.display = 'none';
    }
});

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
