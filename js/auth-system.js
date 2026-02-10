// Complete Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        this.setupAuthForms();
        this.setupAuthButtons();
        this.checkExistingSession();
        console.log('🔐 Authentication system initialized');
    }

    // Load users from localStorage
    loadUsers() {
        const stored = localStorage.getItem('mediaHubUsers');
        return stored ? JSON.parse(stored) : [];
    }

    // Save users to localStorage
    saveUsers(users) {
        localStorage.setItem('mediaHubUsers', JSON.stringify(users));
    }

    // Check for existing session
    checkExistingSession() {
        const session = localStorage.getItem('mediaHubSession');
        if (session) {
            const sessionData = JSON.parse(session);
            const user = this.users.find(u => u.id === sessionData.userId);
            if (user && sessionData.token === this.generateToken(user)) {
                this.loginUser(user);
                console.log('🔓 Auto-logged in from session');
            }
        }
    }

    // Setup authentication forms
    setupAuthForms() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Switch between forms
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

    // Setup auth buttons
    setupAuthButtons() {
        // Login button in header
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.showAuthModal();
            });
        }

        // User menu
        const userMenuBtn = document.getElementById('user-menu-btn');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', () => {
                this.toggleUserMenu();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Close modal buttons
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideAuthModal();
            });
        });

        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAuthModal();
            }
        });
    }

    // Handle login
    handleLogin() {
        const email = document.getElementById('login-email')?.value.trim();
        const password = document.getElementById('login-password')?.value;
        const rememberMe = document.getElementById('remember-me')?.checked;

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Validate email format
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Find user
        const user = this.users.find(u => u.email === email);
        if (!user) {
            this.showNotification('No account found with this email', 'error');
            return;
        }

        // Check password
        if (user.password !== this.hashPassword(password)) {
            this.showNotification('Incorrect password', 'error');
            return;
        }

        // Login successful
        this.loginUser(user, rememberMe);
        this.showNotification('Login successful!', 'success');
        this.hideAuthModal();
    }

    // Handle registration
    handleRegister() {
        const username = document.getElementById('register-username')?.value.trim();
        const email = document.getElementById('register-email')?.value.trim();
        const password = document.getElementById('register-password')?.value;
        const confirmPassword = document.getElementById('register-confirm-password')?.value;
        const termsAccepted = document.getElementById('accept-terms')?.checked;

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (username.length < 3) {
            this.showNotification('Username must be at least 3 characters', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (!termsAccepted) {
            this.showNotification('Please accept the terms and conditions', 'error');
            return;
        }

        // Check if user already exists
        if (this.users.find(u => u.email === email)) {
            this.showNotification('An account with this email already exists', 'error');
            return;
        }

        if (this.users.find(u => u.username === username)) {
            this.showNotification('This username is already taken', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: this.generateId(),
            username: username,
            email: email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            profile: {
                displayName: username,
                avatar: `https://picsum.photos/seed/${username}/150/150.jpg`,
                bio: '',
                channelName: `${username}'s Channel`,
                subscribers: 0,
                verified: false
            },
            preferences: {
                theme: 'dark',
                notifications: true,
                emailNotifications: true
            },
            stats: {
                videosWatched: 0,
                songsPlayed: 0,
                gamesPlayed: 0,
                coursesEnrolled: 0,
                postsLiked: 0
            }
        };

        // Save user
        this.users.push(newUser);
        this.saveUsers(this.users);

        // Auto-login new user
        this.loginUser(newUser);
        this.showNotification('Account created successfully!', 'success');
        this.hideAuthModal();
    }

    // Login user
    loginUser(user, rememberMe = false) {
        this.currentUser = user;
        this.isLoggedIn = true;

        // Save session
        const sessionData = {
            userId: user.id,
            token: this.generateToken(user),
            expiresAt: rememberMe ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000) // 30 days or 1 day
        };
        localStorage.setItem('mediaHubSession', JSON.stringify(sessionData));

        // Update UI
        this.updateAuthUI();
    }

    // Logout user
    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;

        // Clear session
        localStorage.removeItem('mediaHubSession');

        // Update UI
        this.updateAuthUI();
        this.showNotification('Logged out successfully', 'info');
    }

    // Update authentication UI
    updateAuthUI() {
        const loginBtn = document.getElementById('login-btn');
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userAvatar = document.getElementById('user-avatar');

        if (this.isLoggedIn && this.currentUser) {
            // Show user menu
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenuBtn) userMenuBtn.style.display = 'flex';
            if (userAvatar) userAvatar.src = this.currentUser.profile.avatar;

            // Update user-specific elements
            this.updateUserSpecificContent();
        } else {
            // Show login button
            if (loginBtn) loginBtn.style.display = 'block';
            if (userMenuBtn) userMenuBtn.style.display = 'none';
        }
    }

    // Update user-specific content
    updateUserSpecificContent() {
        // Update welcome message
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${this.currentUser.profile.displayName}!`;
        }

        // Update profile links
        const profileLinks = document.querySelectorAll('[data-user-profile]');
        profileLinks.forEach(link => {
            link.href = `#profile/${this.currentUser.username}`;
        });

        // Show/hide auth-only content
        const authOnlyElements = document.querySelectorAll('.auth-only');
        const publicOnlyElements = document.querySelectorAll('.public-only');

        authOnlyElements.forEach(el => el.style.display = 'block');
        publicOnlyElements.forEach(el => el.style.display = 'none');
    }

    // Show/hide modal
    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.showLoginForm();
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const modalTitle = document.getElementById('auth-modal-title');

        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
        if (modalTitle) modalTitle.textContent = 'Sign In';
    }

    showRegisterForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const modalTitle = document.getElementById('auth-modal-title');

        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
        if (modalTitle) modalTitle.textContent = 'Create Account';
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    }

    // Utility methods
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    hashPassword(password) {
        // Simple hash for demo (in production, use proper hashing)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    generateToken(user) {
        // Generate simple token based on user data
        const data = `${user.id}:${user.email}:${Date.now()}`;
        return btoa(data);
    }

    generateId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Style notification
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
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if logged in
    isAuthenticated() {
        return this.isLoggedIn;
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.currentUser) return;

        Object.assign(this.currentUser.profile, updates);
        
        // Update in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
            this.saveUsers(this.users);
        }

        this.showNotification('Profile updated successfully!', 'success');
    }

    // Change password
    changePassword(oldPassword, newPassword) {
        if (!this.currentUser) return false;

        if (this.currentUser.password !== this.hashPassword(oldPassword)) {
            this.showNotification('Current password is incorrect', 'error');
            return false;
        }

        this.currentUser.password = this.hashPassword(newPassword);
        
        // Update in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
            this.saveUsers(this.users);
        }

        this.showNotification('Password changed successfully!', 'success');
        return true;
    }

    // Delete account
    deleteAccount(password) {
        if (!this.currentUser) return false;

        if (this.currentUser.password !== this.hashPassword(password)) {
            this.showNotification('Password is incorrect', 'error');
            return false;
        }

        // Remove user from array
        this.users = this.users.filter(u => u.id !== this.currentUser.id);
        this.saveUsers(this.users);

        // Logout
        this.logout();
        this.showNotification('Account deleted successfully', 'info');
        return true;
    }
}

// Add auth modal CSS
const authStyles = document.createElement('style');
authStyles.textContent = `
    .auth-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        backdrop-filter: blur(5px);
    }

    .auth-modal-content {
        background: var(--gray-dark);
        border-radius: 12px;
        padding: 32px;
        max-width: 400px;
        width: 90%;
        position: relative;
        border: 1px solid #303030;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .auth-header {
        text-align: center;
        margin-bottom: 24px;
    }

    .auth-header h2 {
        color: var(--light-color);
        margin: 0 0 8px 0;
        font-size: 1.8rem;
    }

    .auth-header p {
        color: var(--gray-light);
        margin: 0;
        font-size: 0.9rem;
    }

    .auth-form {
        display: none;
    }

    .auth-form.active {
        display: block;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        color: var(--light-color);
        margin-bottom: 8px;
        font-weight: 500;
    }

    .form-input {
        width: 100%;
        padding: 12px 16px;
        background: var(--gray-medium);
        border: 1px solid #404040;
        border-radius: 8px;
        color: var(--light-color);
        font-size: 1rem;
        transition: var(--transition);
    }

    .form-input:focus {
        outline: none;
        border-color: var(--primary-color);
        background: #2a2a2a;
    }

    .form-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 20px;
    }

    .form-checkbox input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary-color);
    }

    .form-checkbox label {
        color: var(--gray-light);
        font-size: 0.9rem;
        cursor: pointer;
    }

    .auth-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .auth-switch {
        text-align: center;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #303030;
    }

    .auth-switch p {
        color: var(--gray-light);
        margin: 0 0 8px 0;
    }

    .auth-switch button {
        background: transparent;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        font-size: 0.9rem;
        text-decoration: underline;
    }

    .auth-switch button:hover {
        color: var(--accent-color);
    }

    .user-menu-btn {
        display: none;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: var(--transition);
    }

    .user-menu-btn:hover {
        background: var(--gray-medium);
    }

    .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
    }

    .user-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--gray-dark);
        border: 1px solid #303030;
        border-radius: 8px;
        min-width: 200px;
        display: none;
        z-index: 1000;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .user-dropdown a {
        display: block;
        padding: 12px 16px;
        color: var(--light-color);
        text-decoration: none;
        transition: var(--transition);
    }

    .user-dropdown a:hover {
        background: var(--gray-medium);
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    @media (max-width: 768px) {
        .auth-modal-content {
            margin: 20px;
            padding: 24px;
        }
    }
`;
document.head.appendChild(authStyles);

// Initialize auth system
const authSystem = new AuthSystem();
