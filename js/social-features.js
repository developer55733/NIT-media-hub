// Social Features - Comments, Likes, User Interactions
class SocialFeaturesManager {
    constructor() {
        this.comments = [];
        this.likes = [];
        this.subscriptions = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSocialData();
    }

    setupEventListeners() {
        // Like/Dislike buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.like-btn')) {
                this.handleLike(e.target.closest('[data-video-id]')?.dataset.videoId);
            }
            if (e.target.matches('.dislike-btn')) {
                this.handleDislike(e.target.closest('[data-video-id]')?.dataset.videoId);
            }
            if (e.target.matches('.subscribe-btn')) {
                this.handleSubscribe(e.target.closest('[data-channel-id]')?.dataset.channelId);
            }
        });

        // Comment form
        document.getElementById('comment-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.postComment();
        });

        // Reply buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.reply-btn')) {
                this.showReplyForm(e.target.closest('.comment'));
            }
        });
    }

    async handleLike(videoId) {
        if (!currentUser) {
            showToast('Please sign in to like videos', 'warning');
            return;
        }

        try {
            const existingLike = this.likes.find(like => 
                like.videoId === videoId && like.userId === currentUser.id
            );

            if (existingLike) {
                // Remove like
                this.likes = this.likes.filter(like => like.id !== existingLike.id);
                this.updateLikeUI(videoId, 'remove');
                showToast('Like removed', 'info');
            } else {
                // Add like
                const like = {
                    id: Date.now().toString(),
                    videoId: videoId,
                    userId: currentUser.id,
                    type: 'like',
                    timestamp: new Date()
                };
                this.likes.push(like);
                this.updateLikeUI(videoId, 'add');
                showToast('Video liked!', 'success');
            }

        } catch (error) {
            console.error('Error liking video:', error);
            showToast('Failed to like video', 'error');
        }
    }

    async handleDislike(videoId) {
        if (!currentUser) {
            showToast('Please sign in to dislike videos', 'warning');
            return;
        }

        // Similar to like but for dislikes
        console.log('Dislike video:', videoId);
    }

    updateLikeUI(videoId, action) {
        const likeBtn = document.querySelector(`[data-video-id="${videoId}"] .like-btn`);
        const likeCount = document.querySelector(`[data-video-id="${videoId}"] .like-count`);
        
        if (likeBtn && likeCount) {
            const currentCount = parseInt(likeCount.textContent) || 0;
            const newCount = action === 'add' ? currentCount + 1 : currentCount - 1;
            
            likeCount.textContent = newCount.toLocaleString();
            likeBtn.classList.toggle('liked', action === 'add');
        }
    }

    async handleSubscribe(channelId) {
        if (!currentUser) {
            showToast('Please sign in to subscribe', 'warning');
            return;
        }

        try {
            const existingSubscription = this.subscriptions.find(sub => 
                sub.channelId === channelId && sub.userId === currentUser.id
            );

            if (existingSubscription) {
                // Unsubscribe
                this.subscriptions = this.subscriptions.filter(sub => sub.id !== existingSubscription.id);
                this.updateSubscribeUI(channelId, false);
                showToast('Unsubscribed', 'info');
            } else {
                // Subscribe
                const subscription = {
                    id: Date.now().toString(),
                    channelId: channelId,
                    userId: currentUser.id,
                    timestamp: new Date()
                };
                this.subscriptions.push(subscription);
                this.updateSubscribeUI(channelId, true);
                showToast('Subscribed successfully!', 'success');
            }

        } catch (error) {
            console.error('Error subscribing:', error);
            showToast('Failed to subscribe', 'error');
        }
    }

    updateSubscribeUI(channelId, isSubscribed) {
        const subscribeBtn = document.querySelector(`[data-channel-id="${channelId}"] .subscribe-btn`);
        
        if (subscribeBtn) {
            subscribeBtn.textContent = isSubscribed ? 'Subscribed' : 'Subscribe';
            subscribeBtn.classList.toggle('subscribed', isSubscribed);
            subscribeBtn.classList.toggle('btn-primary', !isSubscribed);
            subscribeBtn.classList.toggle('btn-secondary', isSubscribed);
        }
    }

    async postComment() {
        const input = document.getElementById('comment-input');
        const videoId = document.getElementById('comment-video-id')?.value;
        
        if (!currentUser) {
            showToast('Please sign in to comment', 'warning');
            return;
        }

        const content = input?.value?.trim();
        if (!content || !videoId) return;

        try {
            const comment = {
                id: Date.now().toString(),
                videoId: videoId,
                userId: currentUser.id,
                content: content,
                likes: 0,
                replies: [],
                timestamp: new Date()
            };

            this.comments.push(comment);
            this.displayComment(comment);
            
            // Clear input
            if (input) input.value = '';
            
            showToast('Comment posted!', 'success');

        } catch (error) {
            console.error('Error posting comment:', error);
            showToast('Failed to post comment', 'error');
        }
    }

    displayComment(comment) {
        const container = document.getElementById('comments-container');
        if (!container) return;

        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.dataset.commentId = comment.id;
        commentElement.innerHTML = `
            <div class="comment-avatar">
                <img src="${currentUser?.avatar || 'https://picsum.photos/seed/user/40/40.jpg'}" alt="${currentUser?.username}">
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${currentUser?.username || 'Anonymous'}</span>
                    <span class="comment-time">${this.formatTime(comment.timestamp)}</span>
                </div>
                <div class="comment-text">${comment.content}</div>
                <div class="comment-actions">
                    <button class="btn btn-sm comment-like-btn">
                        <i class="fas fa-thumbs-up"></i> ${comment.likes}
                    </button>
                    <button class="btn btn-sm reply-btn">Reply</button>
                    <button class="btn btn-sm">Share</button>
                </div>
                <div class="reply-form" style="display: none;">
                    <textarea placeholder="Write a reply..." class="reply-input"></textarea>
                    <div class="reply-actions">
                        <button class="btn btn-primary post-reply-btn">Reply</button>
                        <button class="btn btn-outline cancel-reply-btn">Cancel</button>
                    </div>
                </div>
                <div class="replies"></div>
            </div>
        `;

        container.insertBefore(commentElement, container.firstChild);
    }

    showReplyForm(commentElement) {
        const replyForm = commentElement.querySelector('.reply-form');
        if (replyForm) {
            replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
            
            if (replyForm.style.display === 'block') {
                const input = replyForm.querySelector('.reply-input');
                input?.focus();
            }
        }
    }

    async loadComments(videoId) {
        try {
            // Simulate loading comments
            const comments = [
                {
                    id: '1',
                    videoId: videoId,
                    userId: 'user1',
                    username: 'John Doe',
                    avatar: 'https://picsum.photos/seed/john/40/40.jpg',
                    content: 'Great video! Really helpful content.',
                    likes: 15,
                    replies: [],
                    timestamp: new Date(Date.now() - 3600000)
                },
                {
                    id: '2',
                    videoId: videoId,
                    userId: 'user2',
                    username: 'Jane Smith',
                    avatar: 'https://picsum.photos/seed/jane/40/40.jpg',
                    content: 'Can you make a follow-up video on this topic?',
                    likes: 8,
                    replies: [],
                    timestamp: new Date(Date.now() - 7200000)
                }
            ];

            this.displayComments(comments);

        } catch (error) {
            console.error('Error loading comments:', error);
        }
    }

    displayComments(comments) {
        const container = document.getElementById('comments-container');
        if (!container) return;

        container.innerHTML = comments.map(comment => `
            <div class="comment" data-comment-id="${comment.id}">
                <div class="comment-avatar">
                    <img src="${comment.avatar}" alt="${comment.username}">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.username}</span>
                        <span class="comment-time">${this.formatTime(comment.timestamp)}</span>
                    </div>
                    <div class="comment-text">${comment.content}</div>
                    <div class="comment-actions">
                        <button class="btn btn-sm comment-like-btn">
                            <i class="fas fa-thumbs-up"></i> ${comment.likes}
                        </button>
                        <button class="btn btn-sm reply-btn">Reply</button>
                        <button class="btn btn-sm">Share</button>
                    </div>
                    <div class="reply-form" style="display: none;">
                        <textarea placeholder="Write a reply..." class="reply-input"></textarea>
                        <div class="reply-actions">
                            <button class="btn btn-primary post-reply-btn">Reply</button>
                            <button class="btn btn-outline cancel-reply-btn">Cancel</button>
                        </div>
                    </div>
                    <div class="replies"></div>
                </div>
            </div>
        `).join('');
    }

    formatTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        return time.toLocaleDateString();
    }

    async loadSocialData() {
        // Load user's social data
        if (currentUser) {
            try {
                // Load user's likes, subscriptions, etc.
                console.log('Loading social data for user:', currentUser.id);
            } catch (error) {
                console.error('Error loading social data:', error);
            }
        }
    }
}

const socialFeatures = new SocialFeaturesManager();
