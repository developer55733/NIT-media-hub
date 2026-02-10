// Enhanced Media Hub Functionality
class EnhancedFunctionality {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Enhanced functionality initializing...');
        this.setupFormValidation();
        this.setupPasswordStrength();
        this.setupUsernameValidation();
        this.setupRealTimeSearch();
        this.setupContentFilters();
        this.setupNotifications();
        this.setupAnalytics();
        console.log('✅ Enhanced functionality loaded');
    }

    // Form Validation
    setupFormValidation() {
        // Login form validation
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e.target);
            });
        }

        // Register form validation
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration(e.target);
            });

            // Real-time validation
            const usernameInput = document.getElementById('register-username');
            const emailInput = document.getElementById('register-email');
            const passwordInput = document.getElementById('register-password');
            const confirmPasswordInput = document.getElementById('register-confirm-password');

            if (usernameInput) {
                usernameInput.addEventListener('input', () => this.validateUsername(usernameInput.value));
            }
            if (emailInput) {
                emailInput.addEventListener('input', () => this.validateEmail(emailInput.value));
            }
            if (passwordInput) {
                passwordInput.addEventListener('input', () => this.checkPasswordStrength(passwordInput.value));
            }
            if (confirmPasswordInput) {
                confirmPasswordInput.addEventListener('input', () => {
                    this.validatePasswordMatch(passwordInput.value, confirmPasswordInput.value);
                });
            }
        }
    }

    // Password Strength Checker
    setupPasswordStrength() {
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        });
    }

    checkPasswordStrength(password) {
        const strengthIndicator = document.querySelector('.password-strength');
        if (!strengthIndicator) return;

        let strength = 0;
        let feedback = '';

        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) {
            feedback = 'Weak';
            strengthIndicator.className = 'password-strength weak';
        } else if (strength <= 3) {
            feedback = 'Medium';
            strengthIndicator.className = 'password-strength medium';
        } else {
            feedback = 'Strong';
            strengthIndicator.className = 'password-strength strong';
        }

        // Add or update strength indicator
        let strengthDiv = document.getElementById('password-strength');
        if (!strengthDiv) {
            strengthDiv = document.createElement('div');
            strengthDiv.id = 'password-strength';
            strengthDiv.className = 'password-strength';
            passwordInput.parentNode.insertBefore(strengthDiv, passwordInput.nextSibling);
        }
    }

    // Username Validation
    setupUsernameValidation() {
        const usernameInput = document.getElementById('register-username');
        if (usernameInput) {
            let timeout;
            usernameInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.validateUsername(e.target.value);
                }, 500);
            });
        }
    }

    validateUsername(username) {
        const availabilityDiv = document.getElementById('username-availability');
        if (!availabilityDiv) return;

        if (username.length < 3) {
            availabilityDiv.textContent = 'Username must be at least 3 characters';
            availabilityDiv.className = 'username-availability unavailable';
            return;
        }

        if (username.length > 20) {
            availabilityDiv.textContent = 'Username must be 20 characters or less';
            availabilityDiv.className = 'username-availability unavailable';
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            availabilityDiv.textContent = 'Username can only contain letters, numbers, and underscores';
            availabilityDiv.className = 'username-availability unavailable';
            return;
        }

        // Simulate availability check
        const unavailableUsernames = ['admin', 'root', 'user', 'test', 'demo'];
        if (unavailableUsernames.includes(username.toLowerCase())) {
            availabilityDiv.textContent = 'Username is already taken';
            availabilityDiv.className = 'username-availability unavailable';
        } else {
            availabilityDiv.textContent = 'Username is available';
            availabilityDiv.className = 'username-availability available';
        }
    }

    // Email Validation
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInput = document.getElementById('register-email');
        
        if (!emailRegex.test(email)) {
            emailInput.setCustomValidity('Please enter a valid email address');
        } else {
            emailInput.setCustomValidity('');
        }
    }

    // Password Match Validation
    validatePasswordMatch(password, confirmPassword) {
        const confirmInput = document.getElementById('register-confirm-password');
        if (!confirmInput) return;

        if (password !== confirmPassword) {
            confirmInput.setCustomValidity('Passwords do not match');
        } else {
            confirmInput.setCustomValidity('');
        }
    }

    // Handle Login
    handleLogin(form) {
        const email = form.querySelector('#login-email').value;
        const password = form.querySelector('#login-password').value;
        const rememberMe = form.querySelector('#remember-me').checked;

        // Validation
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate authentication
        const users = this.getStoredUsers();
        const user = users.find(u => u.email === email && u.password === this.hashPassword(password));

        if (user) {
            this.setCurrentUser(user);
            if (rememberMe) {
                localStorage.setItem('rememberedUser', email);
            }
            this.showNotification('Login successful!', 'success');
            this.closeAuthModal();
            
            // Update UI for logged in user
            this.updateUIForLoggedInUser(user);
        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }

    // Handle Registration
    handleRegistration(form) {
        const username = form.querySelector('#register-username').value;
        const email = form.querySelector('#register-email').value;
        const password = form.querySelector('#register-password').value;
        const confirmPassword = form.querySelector('#register-confirm-password').value;
        const fullName = form.querySelector('#register-fullname').value;
        const bio = form.querySelector('#register-bio').value;
        const channelName = form.querySelector('#register-channel').value;
        const category = form.querySelector('#register-category').value;
        const acceptTerms = form.querySelector('#accept-terms').checked;
        const newsletter = form.querySelector('#newsletter-subscribe').checked;

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (!acceptTerms) {
            this.showNotification('Please accept the terms of service', 'error');
            return;
        }

        // Create user object
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: this.hashPassword(password),
            fullName,
            bio,
            channelName,
            category,
            createdAt: new Date().toISOString(),
            subscribers: 0,
            verified: false,
            newsletter: newsletter
        };

        // Store user
        this.storeUser(newUser);
        this.setCurrentUser(newUser);
        this.showNotification('Account created successfully!', 'success');
        this.closeAuthModal();
        
        // Update UI
        this.updateUIForLoggedInUser(newUser);
        
        // Track registration
        this.trackEvent('user_registration', {
            username,
            email,
            category,
            timestamp: new Date().toISOString()
        });
    }

    // Real-time Search
    setupRealTimeSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });
        }
    }

    performSearch(query) {
        if (!query.trim()) {
            this.showNotification('Please enter a search term', 'info');
            return;
        }

        console.log(`🔍 Searching for: ${query}`);
        
        // Simulate search results
        const results = this.searchContent(query);
        this.displaySearchResults(results, query);
        
        // Track search
        this.trackEvent('search', {
            query,
            resultsCount: results.length,
            timestamp: new Date().toISOString()
        });
    }

    searchContent(query) {
        const allContent = [];
        
        // Combine all content types
        if (window.demoContent) {
            allContent.push(...window.demoContent.videos || []);
            allContent.push(...window.demoContent.songs || []);
            allContent.push(...window.demoContent.games || []);
            allContent.push(...window.demoContent.courses || []);
            allContent.push(...window.demoContent.posts || []);
        }

        // Search in title, description, author
        const lowerQuery = query.toLowerCase();
        return allContent.filter(item => 
            item.title.toLowerCase().includes(lowerQuery) ||
            (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
            (item.author && item.author.toLowerCase().includes(lowerQuery)) ||
            (item.channelName && item.channelName.toLowerCase().includes(lowerQuery))
        );
    }

    displaySearchResults(results, query) {
        // Remove existing search results if any
        const existingResults = document.getElementById('search-results');
        if (existingResults) {
            existingResults.remove();
        }

        // Create search results section
        const searchSection = document.createElement('section');
        searchSection.id = 'search-results';
        searchSection.className = 'content-section';
        searchSection.innerHTML = `
            <div class="container">
                <h2>Search Results for "${query}"</h2>
                <div class="content-grid">
                    ${results.length > 0 ? results.map(item => this.createSearchResultCard(item)).join('') : 
                        '<div style="grid-column: 1 / -1; text-align: center; padding: 40px;">' +
                        '<p>No results found for your search.</p>' +
                        '</div>'}
                </div>
            </div>
        `;

        // Insert after category navigation
        const categoryNav = document.querySelector('.category-nav');
        if (categoryNav) {
            categoryNav.parentNode.insertBefore(searchSection, categoryNav.nextSibling);
        }
    }

    createSearchResultCard(item) {
        return `
            <div class="content-card search-result">
                <img src="${item.thumbnail || 'https://picsum.photos/seed/default/300/180.jpg'}" alt="${item.title}" class="card-thumbnail">
                <div class="card-content">
                    <span class="card-category">${item.category || 'Content'}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-description">${item.description || 'No description available'}</p>
                    <div class="card-meta">
                        <span>By ${item.author || 'Unknown'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Content Filters
    setupContentFilters() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.applyContentFilter(filter);
                
                // Update active state
                categoryBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    applyContentFilter(filter) {
        const allCards = document.querySelectorAll('.content-card:not(.search-result)');
        
        allCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = '';
            } else {
                const category = card.querySelector('.card-category')?.textContent?.toLowerCase();
                if (category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            }
        });

        // Track filter usage
        this.trackEvent('content_filter', {
            filter,
            timestamp: new Date().toISOString()
        });
    }

    // Notifications System
    setupNotifications() {
        this.notificationCount = 0;
        this.notifications = [];
        
        // Add notification styles
        this.addNotificationStyles();
        
        // Simulate some initial notifications
        if (!this.getStoredNotifications().length) {
            this.addNotification('Welcome to Media Hub!', 'success');
            this.addNotification('Complete your profile to get started', 'info');
            this.addNotification('Upload your first content to share with the community', 'info');
        }
    }

    addNotification(message, type = 'info') {
        this.notificationCount++;
        const notification = {
            id: Date.now().toString(),
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        this.notifications.unshift(notification);
        this.updateNotificationBadge();
        this.updateNotificationDropdown();
    }

    updateNotificationBadge() {
        const notificationBtn = document.getElementById('notification-btn');
        if (notificationBtn) {
            const unreadCount = this.notifications.filter(n => !n.read).length;
            if (unreadCount > 0) {
                notificationBtn.innerHTML = `<span>Notifications (${unreadCount})</span>`;
                notificationBtn.style.background = 'var(--accent)';
            } else {
                notificationBtn.innerHTML = '<span>Notifications</span>';
                notificationBtn.style.background = '';
            }
        }
    }

    updateNotificationDropdown() {
        const notificationList = document.querySelector('.notifications-list');
        if (!notificationList) return;

        notificationList.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}">
                <p>${notification.message}</p>
                <span class="notification-time">${this.formatTime(notification.timestamp)}</span>
            </div>
        `).join('');

        // Mark as read when dropdown is opened
        setTimeout(() => {
            this.notifications.forEach(n => n.read = true);
            this.updateNotificationBadge();
        }, 1000);
    }

    // Analytics
    setupAnalytics() {
        // Track page views
        this.trackEvent('page_view', {
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });

        // Track user interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.content-card')) {
                this.trackEvent('content_click', {
                    elementType: e.target.tagName,
                    elementClass: e.target.className,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    trackEvent(eventName, data) {
        console.log(`📊 Analytics Event: ${eventName}`, data);
        
        // Store analytics data (in real app, send to server)
        const analytics = this.getStoredAnalytics();
        analytics.events = analytics.events || [];
        analytics.events.push({ eventName, data, timestamp: new Date().toISOString() });
        localStorage.setItem('mediaHubAnalytics', JSON.stringify(analytics));
    }

    // Utility Functions
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

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Less than 1 minute
            return 'Just now';
        } else if (diff < 3600000) { // Less than 1 hour
            return `${Math.floor(diff / 60000)} minutes ago`;
        } else if (diff < 86400000) { // Less than 1 day
            return `${Math.floor(diff / 3600000)} hours ago`;
        } else {
            return `${Math.floor(diff / 86400000)} days ago`;
        }
    }

    closeAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    updateUIForLoggedInUser(user) {
        // Update user avatar
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            userAvatar.innerHTML = `<span>${user.username || user.email}</span>`;
            userAvatar.style.background = 'var(--primary)';
            userAvatar.style.color = 'white';
        }

        // Update user dropdown
        const userDropdown = document.querySelector('.user-dropdown');
        if (userDropdown) {
            userDropdown.innerHTML = `
                <a href="#"><span>My Channel</span></a>
                <a href="#"><span>Creator Studio</span></a>
                <a href="#"><span>Settings</span></a>
                <a href="#"><span>My Profile</span></a>
                <a href="#" onclick="enhancedFunctionality.logout()"><span>Sign Out</span></a>
            `;
        }
    }

    logout() {
        this.setCurrentUser(null);
        localStorage.removeItem('rememberedUser');
        this.showNotification('Logged out successfully', 'success');
        
        // Reset UI
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            userAvatar.innerHTML = '<span>Account</span>';
            userAvatar.style.background = '';
            userAvatar.style.color = '';
        }
        
        this.closeAuthModal();
        
        // Track logout
        this.trackEvent('user_logout', {
            timestamp: new Date().toISOString()
        });
    }

    // Storage Functions
    getStoredUsers() {
        const stored = localStorage.getItem('mediaHubUsers');
        return stored ? JSON.parse(stored) : [];
    }

    storeUser(user) {
        const users = this.getStoredUsers();
        users.push(user);
        localStorage.setItem('mediaHubUsers', JSON.stringify(users));
    }

    setCurrentUser(user) {
        localStorage.setItem('mediaHubCurrentUser', JSON.stringify(user));
        window.currentUser = user;
    }

    getCurrentUser() {
        const stored = localStorage.getItem('mediaHubCurrentUser');
        return stored ? JSON.parse(stored) : null;
    }

    getStoredNotifications() {
        const stored = localStorage.getItem('mediaHubNotifications');
        return stored ? JSON.parse(stored) : [];
    }

    getStoredAnalytics() {
        const stored = localStorage.getItem('mediaHubAnalytics');
        return stored ? JSON.parse(stored) : { events: [] };
    }

    hashPassword(password) {
        // Simple hash for demo (in production, use proper hashing)
        return btoa(password + 'salt');
    }
}

// Initialize enhanced functionality
const enhancedFunctionality = new EnhancedFunctionality();
