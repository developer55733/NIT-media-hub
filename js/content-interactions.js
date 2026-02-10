// Content Interactions with Account Requirements
class ContentInteractions {
    constructor() {
        this.userLikes = new Set(); // Track user's likes
        this.userComments = new Set(); // Track user's comments
        this.userShares = new Set(); // Track user's shares
        this.init();
    }

    init() {
        this.setupInteractionHandlers();
        this.loadUserInteractions();
        console.log('👍 Content interactions initialized with account requirements');
    }

    // Setup interaction handlers
    setupInteractionHandlers() {
        document.addEventListener('click', (e) => {
            // Like button
            if (e.target.closest('.like-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.handleLike(e.target.closest('.like-btn'));
            }

            // Comment button
            if (e.target.closest('.comment-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.handleComment(e.target.closest('.comment-btn'));
            }

            // Share button
            if (e.target.closest('.share-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.handleShare(e.target.closest('.share-btn'));
            }
        });
    }

    // Load user interactions from localStorage
    loadUserInteractions() {
        if (window.authSystem && window.authSystem.isAuthenticated()) {
            const userId = window.authSystem.currentUser?.id;
            if (userId) {
                const stored = localStorage.getItem(`userInteractions_${userId}`);
                if (stored) {
                    const interactions = JSON.parse(stored);
                    this.userLikes = new Set(interactions.likes || []);
                    this.userComments = new Set(interactions.comments || []);
                    this.userShares = new Set(interactions.shares || []);
                }
                this.updateInteractionUI();
            }
        }
    }

    // Save user interactions to localStorage
    saveUserInteractions() {
        if (window.authSystem && window.authSystem.isAuthenticated()) {
            const userId = window.authSystem.currentUser?.id;
            if (userId) {
                const interactions = {
                    likes: Array.from(this.userLikes),
                    comments: Array.from(this.userComments),
                    shares: Array.from(this.userShares)
                };
                localStorage.setItem(`userInteractions_${userId}`, JSON.stringify(interactions));
            }
        }
    }

    // Handle like action
    handleLike(button) {
        // Check if user is authenticated
        if (!this.isUserAuthenticated()) {
            this.showAuthRequired('like content');
            return;
        }

        const contentId = button.dataset.contentId;
        if (!contentId) return;

        const isLiked = this.userLikes.has(contentId);
        
        if (isLiked) {
            // Unlike - remove from likes
            this.userLikes.delete(contentId);
            button.classList.remove('liked');
            button.innerHTML = '<i class="far fa-heart"></i> <span class="like-count">' + (parseInt(button.querySelector('.like-count')?.textContent || 0) - 1) + '</span>';
            this.showNotification('Removed from liked content', 'info');
        } else {
            // Like - add to likes
            this.userLikes.add(contentId);
            button.classList.add('liked');
            button.innerHTML = '<i class="fas fa-heart"></i> <span class="like-count">' + (parseInt(button.querySelector('.like-count')?.textContent || 0) + 1) + '</span>';
            this.showNotification('Added to liked content', 'success');
        }

        this.saveUserInteractions();
        this.updateGlobalLikeCount(contentId, !isLiked);
    }

    // Handle comment action
    handleComment(button) {
        // Check if user is authenticated
        if (!this.isUserAuthenticated()) {
            this.showAuthRequired('comment on content');
            return;
        }

        const contentId = button.dataset.contentId;
        if (!contentId) return;

        // Check if user has already commented
        if (this.userComments.has(contentId)) {
            this.showNotification('You have already commented on this content', 'info');
            return;
        }

        // Open comment modal
        this.openCommentModal(contentId);
    }

    // Handle share action
    handleShare(button) {
        // Check if user is authenticated
        if (!this.isUserAuthenticated()) {
            this.showAuthRequired('share content');
            return;
        }

        const contentId = button.dataset.contentId;
        if (!contentId) return;

        // Add to shares
        this.userShares.add(contentId);
        this.saveUserInteractions();

        // Copy link to clipboard
        this.copyShareLink(contentId);
        this.showNotification('Content link copied to clipboard!', 'success');
    }

    // Check if user is authenticated
    isUserAuthenticated() {
        return window.authSystem && window.authSystem.isAuthenticated();
    }

    // Show authentication required modal
    showAuthRequired(action) {
        const modal = document.createElement('div');
        modal.className = 'auth-required-modal';
        modal.innerHTML = `
            <div class="auth-required-content">
                <div class="auth-required-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h3>Authentication Required</h3>
                <p>You need to create an account or sign in to ${action}.</p>
                <div class="auth-required-actions">
                    <button class="btn btn-primary" onclick="this.closest('.auth-required-modal').remove(); window.authSystem?.showAuthModal();">
                        <i class="fas fa-user-plus"></i> Create Account
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.auth-required-modal').remove(); window.authSystem?.showAuthModal();">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </button>
                    <button class="btn btn-outline" onclick="this.closest('.auth-required-modal').remove();">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `;

        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            backdrop-filter: blur(5px);
        `;

        document.body.appendChild(modal);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
    }

    // Open comment modal
    openCommentModal(contentId) {
        const modal = document.createElement('div');
        modal.className = 'comment-modal';
        modal.innerHTML = `
            <div class="comment-modal-content">
                <div class="comment-modal-header">
                    <h3>Add Comment</h3>
                    <button class="close-btn" onclick="this.closest('.comment-modal').remove();">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="comment-modal-body">
                    <textarea id="comment-text" placeholder="Share your thoughts..." maxlength="500"></textarea>
                    <div class="comment-char-count">
                        <span id="char-count">0</span>/500
                    </div>
                </div>
                <div class="comment-modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.comment-modal').remove();">Cancel</button>
                    <button class="btn btn-primary" onclick="window.contentInteractions.submitComment('${contentId}', this);">Post Comment</button>
                </div>
            </div>
        `;

        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            backdrop-filter: blur(5px);
        `;

        document.body.appendChild(modal);

        // Setup character counter
        const textarea = modal.querySelector('#comment-text');
        const charCount = modal.querySelector('#char-count');
        
        textarea.addEventListener('input', () => {
            charCount.textContent = textarea.value.length;
        });

        // Focus textarea
        setTimeout(() => textarea.focus(), 100);
    }

    // Submit comment
    submitComment(contentId, buttonElement) {
        const modal = buttonElement.closest('.comment-modal');
        const textarea = modal.querySelector('#comment-text');
        const commentText = textarea.value.trim();

        if (!commentText) {
            this.showNotification('Please enter a comment', 'error');
            return;
        }

        // Add to user comments
        this.userComments.add(contentId);
        this.saveUserInteractions();

        // Here you would normally send the comment to the server
        console.log('Comment submitted:', { contentId, commentText });

        // Update UI
        this.updateCommentCount(contentId, 1);
        this.showNotification('Comment posted successfully!', 'success');

        // Close modal
        modal.remove();
    }

    // Copy share link
    copyShareLink(contentId) {
        const shareUrl = `${window.location.origin}/content/${contentId}`;
        
        // Create temporary input to copy to clipboard
        const tempInput = document.createElement('input');
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    // Update global like count (for demo purposes)
    updateGlobalLikeCount(contentId, increment) {
        // This would normally update the database
        console.log(`Updated like count for ${contentId}: ${increment ? '+1' : '-1'}`);
    }

    // Update comment count
    updateCommentCount(contentId, increment) {
        const commentBtn = document.querySelector(`.comment-btn[data-content-id="${contentId}"]`);
        if (commentBtn) {
            const countElement = commentBtn.querySelector('.comment-count');
            if (countElement) {
                const currentCount = parseInt(countElement.textContent) || 0;
                countElement.textContent = currentCount + increment;
            }
        }
    }

    // Update interaction UI based on user state
    updateInteractionUI() {
        // Update like buttons
        document.querySelectorAll('.like-btn').forEach(btn => {
            const contentId = btn.dataset.contentId;
            if (contentId && this.userLikes.has(contentId)) {
                btn.classList.add('liked');
                btn.innerHTML = '<i class="fas fa-heart"></i> <span class="like-count">' + (btn.querySelector('.like-count')?.textContent || 0) + '</span>';
            }
        });

        // Update comment buttons
        document.querySelectorAll('.comment-btn').forEach(btn => {
            const contentId = btn.dataset.contentId;
            if (contentId && this.userComments.has(contentId)) {
                btn.classList.add('commented');
                btn.innerHTML = '<i class="fas fa-comment"></i> <span class="comment-count">' + (btn.querySelector('.comment-count')?.textContent || 0) + '</span>';
            }
        });

        // Update share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            const contentId = btn.dataset.contentId;
            if (contentId && this.userShares.has(contentId)) {
                btn.classList.add('shared');
                btn.innerHTML = '<i class="fas fa-share"></i> Shared';
            }
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        if (window.interactionManager) {
            window.interactionManager.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `content-notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            `;
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
                z-index: 10003;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease-out;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    // Clear user interactions (for logout)
    clearUserInteractions() {
        this.userLikes.clear();
        this.userComments.clear();
        this.userShares.clear();
    }
}

// Add CSS for modals
const interactionStyles = document.createElement('style');
interactionStyles.textContent = `
    .auth-required-modal {
        font-family: 'Inter', sans-serif;
    }

    .auth-required-content {
        background: var(--card-bg);
        border-radius: 12px;
        padding: 32px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .auth-required-icon {
        font-size: 3rem;
        color: var(--primary);
        margin-bottom: 20px;
    }

    .auth-required-content h3 {
        color: var(--text-primary);
        margin: 0 0 16px 0;
        font-size: 1.5rem;
    }

    .auth-required-content p {
        color: var(--text-secondary);
        margin: 0 0 24px 0;
        line-height: 1.5;
    }

    .auth-required-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .comment-modal {
        font-family: 'Inter', sans-serif;
    }

    .comment-modal-content {
        background: var(--card-bg);
        border-radius: 12px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .comment-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .comment-modal-header h3 {
        color: var(--text-primary);
        margin: 0;
        font-size: 1.3rem;
    }

    .close-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: var(--transition);
    }

    .close-btn:hover {
        color: var(--text-primary);
        background: rgba(0, 0, 0, 0.05);
    }

    .comment-modal-body {
        margin-bottom: 20px;
    }

    .comment-modal-body textarea {
        width: 100%;
        min-height: 100px;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--light-bg);
        color: var(--text-primary);
        font-family: inherit;
        font-size: 1rem;
        resize: vertical;
    }

    .comment-char-count {
        text-align: right;
        color: var(--text-secondary);
        font-size: 0.85rem;
        margin-top: 8px;
    }

    .comment-modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }

    .like-btn.liked {
        color: var(--accent) !important;
    }

    .comment-btn.commented {
        color: var(--primary) !important;
    }

    .share-btn.shared {
        color: var(--primary) !important;
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
        .auth-required-content,
        .comment-modal-content {
            margin: 20px;
            max-width: calc(100vw - 40px);
        }
    }
`;
document.head.appendChild(interactionStyles);

// Initialize content interactions
const contentInteractions = new ContentInteractions();
