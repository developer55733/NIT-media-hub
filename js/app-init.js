// Unified Application Initialization
class AppInitializer {
    constructor() {
        this.isLoaded = false;
        this.loadAttempts = 0;
        this.maxRetries = 3;
        this.init();
    }

    async init() {
        console.log('🚀 Media Hub Application Starting...');
        
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await this.waitForDOMReady();
            }

            // Initialize core systems
            await this.initializeCore();
            
            // Load content
            await this.loadContent();
            
            // Setup interactions
            await this.setupInteractions();
            
            // Finalize
            this.finalizeInitialization();
            
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    // Wait for DOM to be ready
    waitForDOMReady() {
        return new Promise((resolve) => {
            if (document.readyState === 'interactive' || document.readyState === 'complete') {
                resolve();
            } else {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            }
        });
    }

    // Initialize core systems
    async initializeCore() {
        console.log('🔧 Initializing core systems...');
        
        // Initialize theme
        this.initializeTheme();
        
        // Wait for auth system to be ready
        await this.waitForAuthSystem();
        
        // Initialize navigation
        this.initializeNavigation();
        
        // Initialize modals
        this.initializeModals();
        
        console.log('✅ Core systems initialized');
    }

    // Initialize theme
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.querySelector('i').className = 'fas fa-sun';
            }
        }
    }

    // Wait for auth system
    waitForAuthSystem() {
        return new Promise((resolve) => {
            const checkAuth = () => {
                if (window.authSystem) {
                    resolve();
                } else {
                    setTimeout(checkAuth, 100);
                }
            };
            checkAuth();
        });
    }

    // Initialize navigation
    initializeNavigation() {
        // Setup sidebar navigation
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(item);
            });
        });

        // Setup category filters
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryFilter(e.target);
            });
        });

        console.log('✅ Navigation initialized');
    }

    // Initialize modals
    initializeModals() {
        // Setup modal close handlers
        const modals = document.querySelectorAll('.modal-overlay, .auth-modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Setup close buttons
        const closeButtons = document.querySelectorAll('.modal-close, .close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const modal = btn.closest('.modal-overlay, .auth-modal');
                if (modal) {
                    this.closeModal(modal);
                }
            });
        });

        console.log('✅ Modals initialized');
    }

    // Load content
    async loadContent() {
        console.log('📦 Loading content...');
        
        try {
            // Wait for demo content to be available
            await this.waitForDemoContent();
            
            // Load content based on available systems
            if (window.demoContent) {
                // Use rich demo content
                this.loadRichContent();
            } else {
                // Fallback to simple demo
                this.loadSimpleDemo();
            }
            
            console.log('✅ Content loaded successfully');
        } catch (error) {
            console.error('❌ Content loading failed:', error);
            this.showFallbackContent();
        }
    }

    // Wait for demo content
    waitForDemoContent() {
        return new Promise((resolve) => {
            const checkContent = () => {
                if (window.demoContent) {
                    resolve();
                } else {
                    setTimeout(checkContent, 100);
                }
            };
            checkContent();
        });
    }

    // Load rich content
    loadRichContent() {
        const sections = ['videos', 'music', 'games', 'courses', 'posts'];
        
        sections.forEach(section => {
            const container = document.getElementById(section);
            if (container && window.demoContent[section]) {
                if (section === 'videos') {
                    container.innerHTML = window.demoContent.videos
                        .map(video => window.demoContent.createVideoCard(video))
                        .join('');
                } else if (section === 'music') {
                    container.innerHTML = window.demoContent.songs
                        .map(song => window.demoContent.createSongCard(song))
                        .join('');
                } else if (section === 'games') {
                    container.innerHTML = window.demoContent.games
                        .map(game => window.demoContent.createGameCard(game))
                        .join('');
                } else if (section === 'courses') {
                    container.innerHTML = window.demoContent.courses
                        .map(course => window.demoContent.createCourseCard(course))
                        .join('');
                } else if (section === 'posts') {
                    container.innerHTML = window.demoContent.posts
                        .map(post => window.demoContent.createPostCard(post))
                        .join('');
                }
            }
        });

        // Update interaction UI
        if (window.contentInteractions) {
            window.contentInteractions.updateInteractionUI();
        }
    }

    // Load simple demo (fallback)
    loadSimpleDemo() {
        console.log('🔄 Loading fallback demo content...');
        
        const simpleContent = {
            videos: [
                {
                    id: 'simple1',
                    title: 'Welcome to Media Hub',
                    thumbnail: 'https://picsum.photos/seed/welcome/320/180.jpg',
                    duration: '5:00',
                    views: 1000,
                    channelName: 'Media Hub Team',
                    likes: 50
                }
            ]
        };

        const videosContainer = document.getElementById('videos');
        if (videosContainer) {
            videosContainer.innerHTML = simpleContent.videos.map(video => `
                <div class="video-card">
                    <div class="video-thumbnail">
                        <img src="${video.thumbnail}" alt="${video.title}">
                        <div class="video-play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">${video.title}</h3>
                        <p class="video-channel">${video.channelName}</p>
                        <div class="video-stats">
                            <span>${video.views} views</span>
                            <span>${video.likes} likes</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Setup interactions
    async setupInteractions() {
        console.log('🎮 Setting up interactions...');
        
        // Wait for interaction systems
        await this.waitForInteractionSystems();
        
        // Setup user avatar click
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', () => {
                if (window.authSystem) {
                    if (window.authSystem.isAuthenticated()) {
                        this.showUserMenu();
                    } else {
                        window.authSystem.showAuthModal();
                    }
                }
            });
        }

        // Setup upload button
        const uploadBtn = document.getElementById('upload-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                if (window.authSystem && window.authSystem.isAuthenticated()) {
                    this.showUploadModal();
                } else {
                    this.showAuthRequired('upload content');
                }
            });
        }

        console.log('✅ Interactions setup complete');
    }

    // Wait for interaction systems
    waitForInteractionSystems() {
        return new Promise((resolve) => {
            const checkSystems = () => {
                if (window.contentInteractions && window.mediaPlayer) {
                    resolve();
                } else {
                    setTimeout(checkSystems, 100);
                }
            };
            checkSystems();
        });
    }

    // Handle navigation
    handleNavigation(item) {
        // Remove active class from all items
        document.querySelectorAll('.sidebar-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // Add active class to clicked item
        item.classList.add('active');
        
        const section = item.dataset.section;
        this.showSection(section);
    }

    // Handle category filter
    handleCategoryFilter(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.dataset.filter;
        this.applyFilter(filter);
    }

    // Apply filter
    applyFilter(filter) {
        const allCards = document.querySelectorAll('.video-card, .song-card, .game-card, .course-card, .post-card');
        
        allCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = '';
            } else {
                // Check if card matches filter
                const category = card.dataset.category || card.className;
                if (category.toLowerCase().includes(filter.toLowerCase())) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    // Show section
    showSection(sectionId) {
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
    }

    // Close modal
    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Show user menu
    showUserMenu() {
        console.log('👤 Showing user menu');
        // Implementation would go here
    }

    // Show upload modal
    showUploadModal() {
        const uploadModal = document.getElementById('upload-modal');
        if (uploadModal) {
            uploadModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Show auth required
    showAuthRequired(action) {
        if (window.contentInteractions) {
            window.contentInteractions.showAuthRequired(action);
        } else {
            this.showNotification(`Please sign in to ${action}`, 'info');
        }
    }

    // Show fallback content
    showFallbackContent() {
        console.log('🔄 Showing fallback content');
        const mainContent = document.querySelector('.content-area');
        if (mainContent) {
            mainContent.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 10px;">Loading Error</h3>
                    <p style="color: var(--text-secondary);">Some content failed to load. Please refresh the page.</p>
                    <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 20px;">
                        <i class="fas fa-refresh"></i> Refresh Page
                    </button>
                </div>
            `;
        }
    }

    // Handle initialization error
    handleInitializationError(error) {
        this.loadAttempts++;
        console.error(`Initialization attempt ${this.loadAttempts} failed:`, error);
        
        if (this.loadAttempts < this.maxRetries) {
            console.log(`🔄 Retrying initialization... (${this.loadAttempts}/${this.maxRetries})`);
            setTimeout(() => this.init(), 2000);
        } else {
            console.error('❌ Maximum initialization attempts reached');
            this.showFallbackContent();
        }
    }

    // Finalize initialization
    finalizeInitialization() {
        this.isLoaded = true;
        
        // Remove any existing loading indicators
        const loadingElements = document.querySelectorAll('.loading, .spinner');
        loadingElements.forEach(el => el.remove());
        
        // Show success message
        this.showNotification('Media Hub loaded successfully!', 'success');
        
        // Initialize any remaining systems
        if (window.uniHubApp) {
            console.log('🎓 UniHub system detected');
        }
        
        console.log('🎉 Application initialization complete!');
    }

    // Show notification
    showNotification(message, type = 'info') {
        if (window.interactionManager) {
            window.interactionManager.showNotification(message, type);
        } else {
            // Fallback notification
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                z-index: 10000;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
            `;
            
            document.body.appendChild(toast);
            
            // Animate in
            setTimeout(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            }, 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }
}

// Initialize the application
const appInitializer = new AppInitializer();
