// Live Streaming Features
class LiveStreamingManager {
    constructor() {
        this.streams = [];
        this.currentStream = null;
        this.isStreaming = false;
        this.streamKey = null;
        this.viewerCount = 0;
        this.chatMessages = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadActiveStreams();
    }

    setupEventListeners() {
        // Start stream button
        document.getElementById('start-stream-btn')?.addEventListener('click', () => this.startStream());
        
        // End stream button
        document.getElementById('end-stream-btn')?.addEventListener('click', () => this.endStream());
        
        // Stream settings
        document.getElementById('stream-settings-btn')?.addEventListener('click', () => this.openStreamSettings());
        
        // Chat input
        document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
        
        // Send chat button
        document.getElementById('send-chat-btn')?.addEventListener('click', () => this.sendChatMessage());
    }

    async startStream() {
        try {
            const streamData = {
                title: document.getElementById('stream-title')?.value || 'Live Stream',
                description: document.getElementById('stream-description')?.value || '',
                category: document.getElementById('stream-category')?.value || 'gaming',
                visibility: document.getElementById('stream-visibility')?.value || 'public',
                tags: this.parseTags(document.getElementById('stream-tags')?.value || '')
            };

            // Start stream simulation
            this.isStreaming = true;
            this.streamKey = this.generateStreamKey();
            this.viewerCount = 0;
            
            // Update UI
            this.updateStreamingUI(true);
            
            // Show stream started notification
            showToast('Stream started successfully!', 'success');
            
            // Simulate viewer count updates
            this.simulateViewerCount();
            
            console.log('Stream started:', streamData);
            
        } catch (error) {
            console.error('Error starting stream:', error);
            showToast('Failed to start stream', 'error');
        }
    }

    async endStream() {
        try {
            this.isStreaming = false;
            this.currentStream = null;
            this.viewerCount = 0;
            
            // Update UI
            this.updateStreamingUI(false);
            
            // Show stream ended notification
            showToast('Stream ended', 'info');
            
            // Save stream data
            await this.saveStreamData();
            
        } catch (error) {
            console.error('Error ending stream:', error);
            showToast('Failed to end stream', 'error');
        }
    }

    updateStreamingUI(isStreaming) {
        const startBtn = document.getElementById('start-stream-btn');
        const endBtn = document.getElementById('end-stream-btn');
        const streamStatus = document.getElementById('stream-status');
        const viewerCount = document.getElementById('viewer-count');
        
        if (isStreaming) {
            startBtn.style.display = 'none';
            endBtn.style.display = 'block';
            streamStatus.textContent = 'LIVE';
            streamStatus.className = 'stream-status live';
            viewerCount.textContent = '0 viewers';
        } else {
            startBtn.style.display = 'block';
            endBtn.style.display = 'none';
            streamStatus.textContent = 'OFFLINE';
            streamStatus.className = 'stream-status offline';
            viewerCount.textContent = '';
        }
    }

    simulateViewerCount() {
        if (!this.isStreaming) return;
        
        const interval = setInterval(() => {
            if (!this.isStreaming) {
                clearInterval(interval);
                return;
            }
            
            // Random viewer count changes
            const change = Math.floor(Math.random() * 5) - 2;
            this.viewerCount = Math.max(0, this.viewerCount + change);
            
            const viewerElement = document.getElementById('viewer-count');
            if (viewerElement) {
                viewerElement.textContent = `${this.viewerCount} viewers`;
            }
        }, 3000);
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input?.value?.trim();
        
        if (!message || !this.isStreaming) return;
        
        const chatMessage = {
            id: Date.now(),
            user: currentUser?.username || 'Anonymous',
            message: message,
            timestamp: new Date()
        };
        
        this.chatMessages.push(chatMessage);
        this.displayChatMessage(chatMessage);
        
        // Clear input
        if (input) input.value = '';
        
        // Simulate sending to server
        console.log('Chat message sent:', chatMessage);
    }

    displayChatMessage(message) {
        const chatContainer = document.getElementById('live-chat-messages');
        if (!chatContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `
            <div class="chat-user">${message.user}</div>
            <div class="chat-text">${message.message}</div>
            <div class="chat-time">${this.formatTime(message.timestamp)}</div>
        `;
        
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    generateStreamKey() {
        return 'live_' + Math.random().toString(36).substr(2, 9);
    }

    parseTags(tagsString) {
        return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    async loadActiveStreams() {
        try {
            // Simulate loading active streams
            this.streams = [
                {
                    id: 'stream1',
                    title: 'Gaming Session - Live Now',
                    streamer: 'ProGamer123',
                    viewers: 1250,
                    category: 'gaming',
                    thumbnail: 'https://picsum.photos/seed/stream1/320/180.jpg',
                    isLive: true
                },
                {
                    id: 'stream2',
                    title: 'Music Production Tutorial',
                    streamer: 'MusicMaker',
                    viewers: 450,
                    category: 'music',
                    thumbnail: 'https://picsum.photos/seed/stream2/320/180.jpg',
                    isLive: true
                }
            ];
            
            this.displayActiveStreams();
        } catch (error) {
            console.error('Error loading streams:', error);
        }
    }

    displayActiveStreams() {
        const container = document.getElementById('live-streams-grid');
        if (!container) return;
        
        container.innerHTML = this.streams.map(stream => this.createStreamCard(stream)).join('');
    }

    createStreamCard(stream) {
        return `
            <div class="stream-card" data-stream-id="${stream.id}">
                <div class="stream-thumbnail">
                    <img src="${stream.thumbnail}" alt="${stream.title}">
                    <div class="live-indicator">
                        <span class="live-dot"></span>
                        LIVE
                    </div>
                    <div class="viewer-count">${stream.viewers}</div>
                </div>
                <div class="stream-info">
                    <h3 class="stream-title">${stream.title}</h3>
                    <div class="stream-meta">
                        <span class="streamer">${stream.streamer}</span>
                        <span class="category">${stream.category}</span>
                    </div>
                </div>
            </div>
        `;
    }

    openStreamSettings() {
        const modal = document.getElementById('stream-settings-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    async saveStreamData() {
        // Simulate saving stream data
        console.log('Stream data saved');
    }
}

// Initialize live streaming
const liveStreaming = new LiveStreamingManager();
