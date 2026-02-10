// Playlist and Saved Interactions Management
class PlaylistManager {
    constructor() {
        this.playlists = [];
        this.likedContent = [];
        this.commentedContent = [];
        this.sharedContent = [];
        this.init();
    }

    init() {
        console.log('🎵 Playlist manager initializing...');
        this.loadStoredData();
        this.setupEventListeners();
        this.loadUserContentExamples();
        this.loadPlaylists();
        this.loadSavedInteractions();
        console.log('✅ Playlist manager loaded');
    }

    setupEventListeners() {
        // Playlist creation
        const createPlaylistBtn = document.getElementById('create-playlist-btn');
        if (createPlaylistBtn) {
            createPlaylistBtn.addEventListener('click', () => this.openPlaylistModal());
        }

        // Playlist form
        const playlistForm = document.getElementById('playlist-form');
        if (playlistForm) {
            playlistForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createPlaylist(e.target);
            });
        }

        // Modal close buttons
        const closePlaylistBtn = document.getElementById('close-playlist-modal');
        const cancelPlaylistBtn = document.getElementById('cancel-playlist');
        
        if (closePlaylistBtn) closePlaylistBtn.addEventListener('click', () => this.closePlaylistModal());
        if (cancelPlaylistBtn) cancelPlaylistBtn.addEventListener('click', () => this.closePlaylistModal());

        // Interaction tabs
        const interactionTabs = document.querySelectorAll('.interaction-tab');
        interactionTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchInteractionTab(e.target.dataset.tab);
            });
        });
    }

    // Playlist Management
    openPlaylistModal() {
        const modal = document.getElementById('playlist-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closePlaylistModal() {
        const modal = document.getElementById('playlist-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Reset form
            const form = document.getElementById('playlist-form');
            if (form) form.reset();
        }
    }

    createPlaylist(form) {
        const name = form.querySelector('#playlist-name').value;
        const description = form.querySelector('#playlist-description').value;
        const privacy = form.querySelector('#playlist-privacy').value;
        const collaborative = form.querySelector('#playlist-collaborative').checked;

        if (!name) {
            this.showNotification('Please enter a playlist name', 'error');
            return;
        }

        const playlist = {
            id: Date.now().toString(),
            name,
            description,
            privacy,
            collaborative,
            createdAt: new Date().toISOString(),
            createdBy: this.getCurrentUser()?.username || 'Anonymous',
            items: [],
            itemCount: 0
        };

        this.playlists.push(playlist);
        this.savePlaylists();
        this.renderPlaylists();
        this.closePlaylistModal();
        this.showNotification(`Playlist "${name}" created successfully!`, 'success');
    }

    renderPlaylists() {
        const container = document.getElementById('playlists-grid');
        if (!container) return;

        container.innerHTML = this.playlists.map(playlist => `
            <div class="playlist-card">
                <div class="playlist-thumbnail">
                    ${playlist.privacy === 'private' ? '🔒' : 
                      playlist.privacy === 'unlisted' ? '🔗' : '🌍'}
                </div>
                <div class="playlist-content">
                    <h3 class="playlist-title">${playlist.name}</h3>
                    <p class="playlist-description">${playlist.description || 'No description'}</p>
                    <div class="playlist-meta">
                        <span class="playlist-privacy ${playlist.privacy}">
                            ${playlist.privacy.charAt(0).toUpperCase() + playlist.privacy.slice(1)}
                        </span>
                        <span>${playlist.itemCount} items</span>
                    </div>
                    <div class="user-stats">
                        <div class="user-stat">
                            <span>Created</span>
                            <strong>${this.formatDate(playlist.createdAt)}</strong>
                        </div>
                        <div class="user-stat">
                            <span>By</span>
                            <strong>${playlist.createdBy}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // User Content Examples
    loadUserContentExamples() {
        const container = document.getElementById('user-content-grid');
        if (!container) return;

        const userExamples = [
            {
                id: 'user1',
                title: 'My First Video Tutorial',
                description: 'Learn how to create amazing content with this step-by-step tutorial on video production and editing.',
                thumbnail: 'https://images.pexels.com/photos/238622/pexels-photo-238622.jpeg',
                category: 'Videos',
                author: 'CurrentUser',
                views: 1250,
                likes: 89,
                comments: 12,
                duration: '15:30',
                createdAt: new Date().toISOString()
            },
            {
                id: 'user2',
                title: 'Original Music Composition',
                description: 'A beautiful ambient track perfect for studying and relaxation. Created with professional audio software.',
                thumbnail: 'https://picsum.photos/seed/music-user/300/180.jpg',
                category: 'Music',
                author: 'CurrentUser',
                plays: 567,
                likes: 45,
                comments: 8,
                duration: '4:20',
                createdAt: new Date().toISOString()
            },
            {
                id: 'user3',
                title: 'Web Development Course Preview',
                description: 'Introduction to modern web development with React, Node.js, and MongoDB. Perfect for beginners.',
                thumbnail: 'https://picsum.photos/seed/course-user/300/180.jpg',
                category: 'Courses',
                author: 'CurrentUser',
                students: 234,
                likes: 67,
                comments: 19,
                duration: '2:45:30',
                createdAt: new Date().toISOString()
            }
        ];

        container.innerHTML = userExamples.map(item => `
            <div class="content-card user-posted">
                <div class="user-badge">YOUR CONTENT</div>
                <img src="${item.thumbnail}" alt="${item.title}" class="card-thumbnail">
                <div class="card-content">
                    <span class="card-category">${item.category}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-description">${item.description}</p>
                    <div class="card-meta">
                        <span>By ${item.author}</span>
                        <span>${this.formatDate(item.createdAt)}</span>
                    </div>
                    <div class="user-stats">
                        <div class="user-stat">
                            <span>Views</span>
                            <strong>${this.formatNumber(item.views || item.students || item.plays)}</strong>
                        </div>
                        <div class="user-stat">
                            <span>Likes</span>
                            <strong>${item.likes}</strong>
                        </div>
                        <div class="user-stat">
                            <span>Comments</span>
                            <strong>${item.comments}</strong>
                        </div>
                    </div>
                    <div class="video-actions">
                        <button class="video-action like-btn" data-content-id="${item.id}">
                            <span>Like</span>
                            <span class="like-count">${item.likes}</span>
                        </button>
                        <button class="video-action comment-btn" data-content-id="${item.id}">
                            <span>Comment</span>
                            <span class="comment-count">${item.comments}</span>
                        </button>
                        <button class="video-action share-btn" data-content-id="${item.id}">
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Saved Interactions
    loadSavedInteractions() {
        this.loadLikedContent();
        this.loadCommentedContent();
        this.loadSharedContent();
    }

    switchInteractionTab(tab) {
        // Update tab states
        document.querySelectorAll('.interaction-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update content visibility
        document.querySelectorAll('.interaction-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-content`).classList.add('active');
    }

    loadLikedContent() {
        const container = document.querySelector('#liked-content .content-grid');
        if (!container) return;

        // Get liked content from storage
        const liked = this.getStoredLikedContent();
        
        if (liked.length === 0) {
            container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p>No liked content yet. Start exploring and like content you enjoy!</p></div>';
            return;
        }

        container.innerHTML = liked.map(item => this.createInteractionCard(item, 'liked')).join('');
    }

    loadCommentedContent() {
        const container = document.querySelector('#commented-content .content-grid');
        if (!container) return;

        const commented = this.getStoredCommentedContent();
        
        if (commented.length === 0) {
            container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p>No commented content yet. Share your thoughts on content!</p></div>';
            return;
        }

        container.innerHTML = commented.map(item => this.createInteractionCard(item, 'commented')).join('');
    }

    loadSharedContent() {
        const container = document.querySelector('#shared-content .content-grid');
        if (!container) return;

        const shared = this.getStoredSharedContent();
        
        if (shared.length === 0) {
            container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p>No shared content yet. Share content with your friends!</p></div>';
            return;
        }

        container.innerHTML = shared.map(item => this.createInteractionCard(item, 'shared')).join('');
    }

    createInteractionCard(item, type) {
        return `
            <div class="content-card">
                <img src="${item.thumbnail}" alt="${item.title}" class="card-thumbnail">
                <div class="card-content">
                    <span class="card-category">${item.category}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-description">${item.description}</p>
                    <div class="card-meta">
                        <span>By ${item.author}</span>
                        <span>${this.formatDate(item.interactionDate)}</span>
                    </div>
                    <div class="user-stats">
                        <div class="user-stat">
                            <span>Type</span>
                            <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                        </div>
                        <div class="user-stat">
                            <span>Date</span>
                            <strong>${this.formatDate(item.interactionDate)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Storage Functions
    savePlaylists() {
        localStorage.setItem('mediaHubPlaylists', JSON.stringify(this.playlists));
    }

    loadPlaylists() {
        const stored = localStorage.getItem('mediaHubPlaylists');
        this.playlists = stored ? JSON.parse(stored) : this.getDefaultPlaylists();
        this.renderPlaylists();
    }

    getDefaultPlaylists() {
        return [
            {
                id: 'default1',
                name: 'My Favorites',
                description: 'All my favorite content in one place',
                privacy: 'private',
                collaborative: false,
                createdAt: new Date().toISOString(),
                createdBy: this.getCurrentUser()?.username || 'Anonymous',
                items: [],
                itemCount: 0
            },
            {
                id: 'default2',
                name: 'Watch Later',
                description: 'Content to watch when I have time',
                privacy: 'private',
                collaborative: false,
                createdAt: new Date().toISOString(),
                createdBy: this.getCurrentUser()?.username || 'Anonymous',
                items: [],
                itemCount: 0
            }
        ];
    }

    getStoredLikedContent() {
        const stored = localStorage.getItem('mediaHubLikedContent');
        return stored ? JSON.parse(stored) : [];
    }

    getStoredCommentedContent() {
        const stored = localStorage.getItem('mediaHubCommentedContent');
        return stored ? JSON.parse(stored) : [];
    }

    getStoredSharedContent() {
        const stored = localStorage.getItem('mediaHubSharedContent');
        return stored ? JSON.parse(stored) : [];
    }

    getCurrentUser() {
        const stored = localStorage.getItem('mediaHubCurrentUser');
        return stored ? JSON.parse(stored) : null;
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
        return date.toLocaleDateString();
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 16px;
            border-radius: 8px;
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            font-size: 14px;
            max-width: 300px;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    loadStoredData() {
        this.loadPlaylists();
        this.likedContent = this.getStoredLikedContent();
        this.commentedContent = this.getStoredCommentedContent();
        this.sharedContent = this.getStoredSharedContent();
    }
}

// Initialize playlist manager
const playlistManager = new PlaylistManager();
