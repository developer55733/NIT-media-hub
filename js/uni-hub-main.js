// UniHub Main JavaScript
class UniHubApp {
    constructor() {
        this.contentData = [];
        this.featuredData = [];
        this.activeFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.loadContent();
        this.setupEventListeners();
        this.checkTheme();
        console.log('🎓 UniHub initialized');
    }

    // Load content from demo data
    loadContent() {
        // Combine all demo content
        if (window.demoContent) {
            this.contentData = [
                ...window.demoContent.videos.map(v => ({
                    ...v,
                    category: 'Videos',
                    type: 'Video',
                    author: v.channelName || 'Unknown Channel'
                })),
                ...window.demoContent.songs.map(s => ({
                    ...s,
                    category: 'Music',
                    type: 'Song',
                    author: s.artist || 'Unknown Artist'
                })),
                ...window.demoContent.games.map(g => ({
                    ...g,
                    category: 'Games',
                    type: 'Game',
                    author: 'Game Studio'
                })),
                ...window.demoContent.courses.map(c => ({
                    ...c,
                    category: 'Courses',
                    type: 'Course',
                    author: c.instructor || 'Unknown Instructor'
                })),
                ...window.demoContent.posts.map(p => ({
                    ...p,
                    category: 'Posts',
                    type: 'Post',
                    author: p.author || 'Unknown User'
                }))
            ];

            // Set featured content (first 6 items)
            this.featuredData = this.contentData.slice(0, 6);
        }

        this.renderContent();
        this.renderFeatured();
    }

    // Setup event listeners
    setupEventListeners() {
        // Category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target.dataset.filter);
            });
        });

        // Sidebar navigation
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSidebarClick(e.target.closest('.sidebar-item'));
            });
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        searchBtn.addEventListener('click', () => this.performSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderContent();
        });

        // Upload button
        const uploadBtn = document.getElementById('upload-btn');
        const uploadModal = document.getElementById('upload-modal');
        const closeUploadModal = document.getElementById('close-upload-modal');
        const cancelUpload = document.getElementById('cancel-upload');
        const uploadForm = document.getElementById('upload-form');

        uploadBtn.addEventListener('click', () => this.openModal(uploadModal));
        closeUploadModal.addEventListener('click', () => this.closeModal(uploadModal));
        cancelUpload.addEventListener('click', () => this.closeModal(uploadModal));

        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUpload();
        });

        // Notification button
        const notificationBtn = document.getElementById('notification-btn');
        const notificationModal = document.getElementById('notification-modal');
        const closeNotificationModal = document.getElementById('close-notification-modal');

        notificationBtn.addEventListener('click', () => this.openModal(notificationModal));
        closeNotificationModal.addEventListener('click', () => this.closeModal(notificationModal));

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal(e.target);
            }
        });

        // User avatar (login)
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', () => {
                if (window.authSystem && !window.authSystem.isAuthenticated()) {
                    this.openAuthModal();
                }
            });
        }

        // Auth form switching
        const switchToRegister = document.getElementById('switch-to-register');
        const switchToLogin = document.getElementById('switch-to-login');

        if (switchToRegister) {
            switchToRegister.addEventListener('click', () => {
                this.showRegisterForm();
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', () => {
                this.showLoginForm();
            });
        }
    }

    // Set active filter
    setActiveFilter(filter) {
        this.activeFilter = filter;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderContent();
    }

    // Handle sidebar clicks
    handleSidebarClick(item) {
        // Remove active class from all items
        document.querySelectorAll('.sidebar-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // Add active class to clicked item
        item.classList.add('active');
        
        const section = item.dataset.section;
        this.showToast(`Navigating to ${section}`);
        
        // You can add actual navigation logic here
        if (section === 'videos' || section === 'music' || section === 'games' || section === 'courses') {
            this.setActiveFilter(section);
        }
    }

    // Perform search
    performSearch() {
        const query = document.getElementById('search-input').value.trim();
        if (query) {
            this.showToast(`Searching for "${query}"`);
        }
        this.renderContent();
    }

    // Render content grid
    renderContent() {
        const contentGrid = document.getElementById('content-grid');
        if (!contentGrid) return;

        // Filter content
        let filteredData = this.contentData;

        if (this.activeFilter !== 'all') {
            filteredData = filteredData.filter(item => 
                item.category.toLowerCase() === this.activeFilter.toLowerCase()
            );
        }

        if (this.searchTerm) {
            filteredData = filteredData.filter(item =>
                item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                item.author.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        // Show no results message
        if (filteredData.length === 0) {
            contentGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 10px;">No content found</h3>
                    <p style="color: var(--text-secondary);">Try a different search term or category</p>
                </div>
            `;
            return;
        }

        // Generate content cards
        contentGrid.innerHTML = filteredData.map(item => this.createContentCard(item)).join('');

        // Add event listeners to cards
        this.attachCardEventListeners();
    }

    // Render featured content
    renderFeatured() {
        const featuredGrid = document.getElementById('featured-grid');
        if (!featuredGrid || this.featuredData.length === 0) return;

        featuredGrid.innerHTML = this.featuredData.map(item => this.createFeaturedCard(item)).join('');
    }

    // Create content card
    createContentCard(item) {
        const initials = item.author.split(' ').map(n => n[0]).join('').toUpperCase();
        const likes = item.likes || Math.floor(Math.random() * 1000);
        
        return `
            <div class="content-card" data-id="${item.id}" data-category="${item.category.toLowerCase()}">
                <img src="${item.thumbnail}" alt="${item.title}" class="card-thumbnail">
                <div class="card-content">
                    <span class="card-category">${item.category}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-description">${item.description || 'No description available'}</p>
                    <div class="card-meta">
                        <div class="card-author">
                            <div class="author-avatar">${initials}</div>
                            <span>${item.author}</span>
                        </div>
                        <span>${item.type}</span>
                    </div>
                    <div class="card-actions">
                        <button class="card-action-btn like-btn" data-id="${item.id}">
                            <i class="far fa-heart"></i>
                            <span>${likes}</span>
                        </button>
                        <button class="card-action-btn save-btn" data-id="${item.id}">
                            <i class="far fa-bookmark"></i>
                            <span>Save</span>
                        </button>
                        <button class="card-action-btn play-btn" data-id="${item.id}" data-type="${item.category.toLowerCase()}">
                            <i class="fas fa-play"></i>
                            <span>Play</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Create featured card
    createFeaturedCard(item) {
        const initials = item.author.split(' ').map(n => n[0]).join('').toUpperCase();
        
        return `
            <div class="featured-card content-card" data-id="${item.id}" data-category="${item.category.toLowerCase()}">
                <img src="${item.thumbnail}" alt="${item.title}" class="card-thumbnail">
                <div class="card-content">
                    <span class="card-category">${item.category}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-description">${item.description || 'No description available'}</p>
                    <div class="card-meta">
                        <div class="card-author">
                            <div class="author-avatar">${initials}</div>
                            <span>${item.author}</span>
                        </div>
                        <span>${item.type}</span>
                    </div>
                    <div class="card-actions">
                        <button class="card-action-btn like-btn" data-id="${item.id}">
                            <i class="far fa-heart"></i>
                            <span>${item.likes || Math.floor(Math.random() * 1000)}</span>
                        </button>
                        <button class="card-action-btn save-btn" data-id="${item.id}">
                            <i class="far fa-bookmark"></i>
                            <span>Save</span>
                        </button>
                        <button class="card-action-btn play-btn" data-id="${item.id}" data-type="${item.category.toLowerCase()}">
                            <i class="fas fa-play"></i>
                            <span>Play</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Attach event listeners to card buttons
    attachCardEventListeners() {
        // Like buttons
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleLike(btn);
            });
        });

        // Save buttons
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleSave(btn);
            });
        });

        // Play buttons
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handlePlay(btn);
            });
        });

        // Card clicks
        document.querySelectorAll('.content-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.card-action-btn')) {
                    this.handleCardClick(card);
                }
            });
        });
    }

    // Handle like action
    handleLike(btn) {
        const isLiked = btn.classList.contains('liked');
        const likeCount = btn.querySelector('span');
        const icon = btn.querySelector('i');
        
        if (isLiked) {
            btn.classList.remove('liked');
            icon.className = 'far fa-heart';
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
            this.showToast('Removed from liked content');
        } else {
            btn.classList.add('liked');
            icon.className = 'fas fa-heart';
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
            this.showToast('Added to liked content');
        }
    }

    // Handle save action
    handleSave(btn) {
        const isSaved = btn.classList.contains('saved');
        const saveText = btn.querySelector('span');
        const icon = btn.querySelector('i');
        
        if (isSaved) {
            btn.classList.remove('saved');
            icon.className = 'far fa-bookmark';
            saveText.textContent = 'Save';
            this.showToast('Removed from saved content');
        } else {
            btn.classList.add('saved');
            icon.className = 'fas fa-bookmark';
            saveText.textContent = 'Saved';
            this.showToast('Content saved for later');
        }
    }

    // Handle play action
    handlePlay(btn) {
        const id = btn.dataset.id;
        const type = btn.dataset.type;
        
        // Find the content item
        const item = this.contentData.find(c => c.id === id);
        if (!item) return;

        // Use media player if available
        if (window.mediaPlayer) {
            const mediaType = type === 'videos' ? 'video' : 
                           type === 'music' ? 'music' : 
                           type === 'games' ? 'game' : 'video';
            window.mediaPlayer.playMedia(item, mediaType);
        } else {
            this.showToast(`Playing: ${item.title}`);
        }
    }

    // Handle card click
    handleCardClick(card) {
        const title = card.querySelector('.card-title').textContent;
        this.showToast(`Opening: ${title}`);
    }

    // Handle upload
    handleUpload() {
        const title = document.getElementById('content-title').value;
        const category = document.getElementById('content-category').value;
        const description = document.getElementById('content-description').value;
        const thumbnail = document.getElementById('content-thumbnail').value;
        const author = document.getElementById('content-author').value;

        if (!title || !category || !description || !thumbnail || !author) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        // Create new content item
        const newItem = {
            id: Date.now().toString(),
            title,
            description,
            category: category.charAt(0).toUpperCase() + category.slice(1),
            type: this.getTypeFromCategory(category),
            author,
            thumbnail,
            likes: 0
        };

        // Add to content data
        this.contentData.unshift(newItem);
        
        // Close modal and reset form
        this.closeModal(document.getElementById('upload-modal'));
        document.getElementById('upload-form').reset();
        
        // Re-render content
        this.renderContent();
        
        this.showToast(`"${title}" has been uploaded successfully!`);
    }

    // Get type from category
    getTypeFromCategory(category) {
        const typeMap = {
            videos: 'Video',
            music: 'Song',
            games: 'Game',
            courses: 'Course',
            events: 'Event',
            talent: 'Showcase',
            work: 'Opportunity',
            movies: 'Movie',
            research: 'Research',
            clubs: 'Activity'
        };
        return typeMap[category] || 'Content';
    }

    // Modal functions
    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Theme functions
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    checkTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            document.getElementById('theme-toggle').querySelector('i').className = 'fas fa-sun';
        }
    }

    // Toast notification
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        toastMessage.textContent = message;
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}

// Initialize UniHub when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.uniHubApp = new UniHubApp();
});
