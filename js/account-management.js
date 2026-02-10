// Account Management System
class AccountManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('👤 Account manager initializing...');
        this.loadCurrentUser();
        this.setupEventListeners();
        this.setupAccountNavigation();
        this.updateProfileDisplay();
        console.log('✅ Account manager loaded');
    }

    setupEventListeners() {
        // Account login form
        const loginForm = document.getElementById('account-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e.target);
            });
        }

        // Account register form
        const registerForm = document.getElementById('account-register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration(e.target);
            });

            // Real-time validation
            const usernameInput = document.getElementById('account-register-username');
            const emailInput = document.getElementById('account-register-email');
            const passwordInput = document.getElementById('account-register-password');
            const confirmPasswordInput = document.getElementById('account-register-confirm-password');

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

        // Social login buttons
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleSocialLogin(e.target.textContent);
            });
        });

        // Profile actions
        const editProfileBtn = document.querySelector('.profile-actions .btn-primary');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => this.editProfile());
        }

        // Settings actions
        const saveSettingsBtn = document.querySelector('.settings-container .btn-primary');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }

        // Forgot password
        const forgotPasswordBtn = document.getElementById('forgot-password-btn');
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', () => this.handleForgotPassword());
        }

        // Cancel register
        const cancelRegisterBtn = document.getElementById('cancel-register');
        if (cancelRegisterBtn) {
            cancelRegisterBtn.addEventListener('click', () => this.switchToLogin());
        }
    }

    setupAccountNavigation() {
        const navButtons = document.querySelectorAll('.account-nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.switchAccountSection(section);
            });
        });
    }

    switchAccountSection(section) {
        // Update navigation
        document.querySelectorAll('.account-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.account-section-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`account-${section}`).classList.add('active');

        // Update profile when switching to profile section
        if (section === 'profile') {
            this.updateProfileDisplay();
        }
    }

    // Login functionality
    handleLogin(form) {
        const email = form.querySelector('#account-login-email').value;
        const password = form.querySelector('#account-login-password').value;
        const rememberMe = form.querySelector('#account-remember-me').checked;

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
            this.updateProfileDisplay();
            this.switchAccountSection('profile');
        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }

    // Registration functionality
    handleRegistration(form) {
        const username = form.querySelector('#account-register-username').value;
        const email = form.querySelector('#account-register-email').value;
        const password = form.querySelector('#account-register-password').value;
        const confirmPassword = form.querySelector('#account-register-confirm-password').value;
        const fullName = form.querySelector('#account-register-fullname').value;
        const bio = form.querySelector('#account-register-bio').value;
        const channelName = form.querySelector('#account-register-channel').value;
        const category = form.querySelector('#account-register-category').value;
        const acceptTerms = form.querySelector('#account-accept-terms').checked;
        const newsletter = form.querySelector('#account-newsletter').checked;

        // Validation
        if (!username || !email || !password || !confirmPassword || !fullName) {
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
            newsletter: newsletter,
            followers: 0,
            contentCount: 0,
            totalLikes: 0
        };

        // Store user
        this.storeUser(newUser);
        this.setCurrentUser(newUser);
        this.showNotification('Account created successfully!', 'success');
        this.updateProfileDisplay();
        this.switchAccountSection('profile');
    }

    // Profile management
    updateProfileDisplay() {
        const user = this.getCurrentUser();
        if (!user) return;

        // Update profile information
        const profileUsername = document.getElementById('profile-username');
        const profileEmail = document.getElementById('profile-email');
        const profileBio = document.getElementById('profile-bio');
        const profileFollowers = document.getElementById('profile-followers');
        const profileContent = document.getElementById('profile-content');
        const profileLikes = document.getElementById('profile-likes');

        if (profileUsername) profileUsername.textContent = user.username || user.fullName;
        if (profileEmail) profileEmail.textContent = user.email;
        if (profileBio) profileBio.textContent = user.bio || 'No bio provided';
        if (profileFollowers) profileFollowers.textContent = user.followers || 0;
        if (profileContent) profileContent.textContent = user.contentCount || 0;
        if (profileLikes) profileLikes.textContent = user.totalLikes || 0;
    }

    editProfile() {
        this.showNotification('Profile editing coming soon!', 'info');
    }

    // Settings management
    saveSettings() {
        const settings = {
            privacy: {
                profilePublic: document.getElementById('privacy-profile-public')?.checked || false,
                showEmail: document.getElementById('privacy-show-email')?.checked || false,
                allowMessages: document.getElementById('privacy-allow-messages')?.checked || false
            },
            notifications: {
                email: document.getElementById('notif-email')?.checked || false,
                push: document.getElementById('notif-push')?.checked || false,
                comments: document.getElementById('notif-comments')?.checked || false
            }
        };

        localStorage.setItem('mediaHubSettings', JSON.stringify(settings));
        this.showNotification('Settings saved successfully!', 'success');
    }

    // Social login
    handleSocialLogin(provider) {
        this.showNotification(`${provider} login coming soon!`, 'info');
    }

    // Forgot password
    handleForgotPassword() {
        const email = prompt('Enter your email address for password reset:');
        if (email) {
            this.showNotification('Password reset link sent to your email!', 'success');
        }
    }

    // Form validation
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

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInput = document.getElementById('account-register-email');
        
        if (!emailRegex.test(email)) {
            emailInput.setCustomValidity('Please enter a valid email address');
        } else {
            emailInput.setCustomValidity('');
        }
    }

    checkPasswordStrength(password) {
        const strengthIndicator = document.getElementById('password-strength');
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
    }

    validatePasswordMatch(password, confirmPassword) {
        const confirmInput = document.getElementById('account-register-confirm-password');
        if (!confirmInput) return;

        if (password !== confirmPassword) {
            confirmInput.setCustomValidity('Passwords do not match');
        } else {
            confirmInput.setCustomValidity('');
        }
    }

    // Navigation helpers
    switchToLogin() {
        this.switchAccountSection('login');
    }

    switchToRegister() {
        this.switchAccountSection('register');
    }

    // Storage functions
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
        this.currentUser = user;
        window.currentUser = user;
    }

    getCurrentUser() {
        if (this.currentUser) return this.currentUser;
        
        const stored = localStorage.getItem('mediaHubCurrentUser');
        this.currentUser = stored ? JSON.parse(stored) : null;
        return this.currentUser;
    }

    loadCurrentUser() {
        this.getCurrentUser();
    }

    hashPassword(password) {
        // Simple hash for demo (in production, use proper hashing)
        return btoa(password + 'salt');
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
}

// Initialize account manager
const accountManager = new AccountManager();
