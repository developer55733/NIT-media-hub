// Advanced Notification System
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.settings = {
            push: true,
            email: false,
            desktop: false,
            types: {
                likes: true,
                comments: true,
                subscriptions: true,
                mentions: true,
                live: true
            }
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadNotifications();
        this.requestNotificationPermission();
    }

    setupEventListeners() {
        document.getElementById('notification-btn')?.addEventListener('click', () => this.toggleNotificationPanel());
        document.getElementById('notification-settings-btn')?.addEventListener('click', () => this.openSettings());
        document.getElementById('clear-notifications-btn')?.addEventListener('click', () => this.clearAllNotifications());
    }

    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }

    addNotification(type, title, message, data = {}) {
        const notification = {
            id: Date.now().toString(),
            type: type,
            title: title,
            message: message,
            data: data,
            read: false,
            timestamp: new Date()
        };

        this.notifications.unshift(notification);
        this.updateNotificationUI();
        this.showNotificationToast(notification);
        this.sendDesktopNotification(notification);
    }

    showNotificationToast(notification) {
        const toastContainer = document.getElementById('notification-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `notification-toast ${notification.type}`;
        toast.innerHTML = `
            <div class="notification-icon">
                ${this.getNotificationIcon(notification.type)}
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            like: '<i class="fas fa-heart"></i>',
            comment: '<i class="fas fa-comment"></i>',
            subscribe: '<i class="fas fa-bell"></i>',
            mention: '<i class="fas fa-at"></i>',
            live: '<i class="fas fa-broadcast-tower"></i>',
            upload: '<i class="fas fa-upload"></i>',
            system: '<i class="fas fa-cog"></i>'
        };
        return icons[type] || icons.system;
    }

    sendDesktopNotification(notification) {
        if (this.settings.desktop && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: notification.id
            });
        }
    }

    updateNotificationUI() {
        this.updateNotificationBadge();
        this.displayNotifications();
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notification-badge');
        if (!badge) return;

        const unreadCount = this.notifications.filter(n => !n.read).length;
        
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    displayNotifications() {
        const container = document.getElementById('notifications-list');
        if (!container) return;

        if (this.notifications.length === 0) {
            container.innerHTML = '<div class="no-notifications">No notifications</div>';
            return;
        }

        container.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon">
                    ${this.getNotificationIcon(notification.type)}
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
                </div>
                <div class="notification-actions">
                    <button class="btn btn-sm" onclick="notificationManager.markAsRead('${notification.id}')">
                        ${notification.read ? 'Unread' : 'Mark as read'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="notificationManager.removeNotification('${notification.id}')">
                        Remove
                    </button>
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

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = !notification.read;
            this.updateNotificationUI();
        }
    }

    removeNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.updateNotificationUI();
    }

    clearAllNotifications() {
        this.notifications = [];
        this.updateNotificationUI();
        showToast('All notifications cleared', 'info');
    }

    toggleNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        if (panel) {
            panel.classList.toggle('open');
        }
    }

    openSettings() {
        const modal = document.getElementById('notification-settings-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.loadSettings();
        }
    }

    loadSettings() {
        // Load settings into modal
        Object.keys(this.settings.types).forEach(type => {
            const checkbox = document.getElementById(`notification-${type}`);
            if (checkbox) {
                checkbox.checked = this.settings.types[type];
            }
        });
    }

    saveSettings() {
        Object.keys(this.settings.types).forEach(type => {
            const checkbox = document.getElementById(`notification-${type}`);
            if (checkbox) {
                this.settings.types[type] = checkbox.checked;
            }
        });
        
        showToast('Notification settings saved', 'success');
    }

    async loadNotifications() {
        // Simulate loading notifications
        this.notifications = [
            {
                id: '1',
                type: 'like',
                title: 'New Like',
                message: 'John Doe liked your video',
                read: false,
                timestamp: new Date(Date.now() - 300000)
            },
            {
                id: '2',
                type: 'comment',
                title: 'New Comment',
                message: 'Sarah commented on your video',
                read: false,
                timestamp: new Date(Date.now() - 600000)
            }
        ];
        
        this.updateNotificationUI();
    }
}

const notificationManager = new NotificationManager();
