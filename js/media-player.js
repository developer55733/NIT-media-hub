// Complete Media Player System
class MediaPlayer {
    constructor() {
        this.currentMedia = null;
        this.currentMediaType = null; // 'video' or 'music'
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 0.7;
        this.playlists = this.loadPlaylists();
        this.currentPlaylist = null;
        this.currentTrackIndex = 0;
        this.shuffle = false;
        this.repeat = 'none'; // 'none', 'one', 'all'
        this.history = this.loadHistory();
        this.queue = [];
        this.init();
    }

    init() {
        this.createMediaPlayer();
        this.createPlaylistManager();
        this.setupEventListeners();
        this.setupKeyboardControls();
        console.log('🎵 Media Player initialized');
    }

    // Create main media player
    createMediaPlayer() {
        const playerHTML = `
            <div id="media-player" class="media-player">
                <!-- Player Header -->
                <div class="player-header">
                    <div class="player-title">
                        <h3 id="now-playing-title">No media playing</h3>
                        <p id="now-playing-artist">Select a video or song to play</p>
                    </div>
                    <button id="player-close" class="player-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Media Display -->
                <div class="media-display">
                    <div id="video-container" class="video-container" style="display: none;">
                        <video id="video-player" class="video-player">
                            <source src="" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div id="music-container" class="music-container" style="display: none;">
                        <div class="album-art">
                            <img id="album-art" src="https://picsum.photos/seed/default/300/300.jpg" alt="Album Art">
                        </div>
                        <div class="visualizer">
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                        </div>
                    </div>
                </div>

                <!-- Player Controls -->
                <div class="player-controls">
                    <div class="main-controls">
                        <button id="prev-btn" class="control-btn">
                            <i class="fas fa-backward"></i>
                        </button>
                        <button id="play-pause-btn" class="control-btn play-pause-btn">
                            <i class="fas fa-play"></i>
                        </button>
                        <button id="next-btn" class="control-btn">
                            <i class="fas fa-forward"></i>
                        </button>
                    </div>
                    
                    <div class="progress-container">
                        <span id="current-time" class="time-display">0:00</span>
                        <div class="progress-bar">
                            <div id="progress-fill" class="progress-fill"></div>
                            <input type="range" id="progress-slider" class="progress-slider" min="0" max="100" value="0">
                        </div>
                        <span id="total-time" class="time-display">0:00</span>
                    </div>
                    
                    <div class="side-controls">
                        <button id="shuffle-btn" class="control-btn">
                            <i class="fas fa-random"></i>
                        </button>
                        <button id="repeat-btn" class="control-btn">
                            <i class="fas fa-redo"></i>
                        </button>
                        <button id="volume-btn" class="control-btn">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <div id="volume-slider" class="volume-slider" style="display: none;">
                            <input type="range" id="volume-input" min="0" max="100" value="70">
                        </div>
                        <button id="playlist-btn" class="control-btn">
                            <i class="fas fa-list"></i>
                        </button>
                        <button id="fullscreen-btn" class="control-btn">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>

                <!-- Queue Section -->
                <div class="queue-section">
                    <div class="queue-header">
                        <h4>Up Next</h4>
                        <button id="clear-queue-btn" class="btn btn-small">Clear</button>
                    </div>
                    <div id="queue-list" class="queue-list">
                        <!-- Queue items will be added here -->
                    </div>
                </div>
            </div>
        `;

        // Add player to page
        const playerContainer = document.createElement('div');
        playerContainer.innerHTML = playerHTML;
        document.body.appendChild(playerContainer.firstElementChild);
    }

    // Create playlist manager
    createPlaylistManager() {
        const playlistHTML = `
            <div id="playlist-manager" class="playlist-manager" style="display: none;">
                <div class="playlist-header">
                    <h3>Playlists</h3>
                    <button id="create-playlist-btn" class="btn btn-primary">
                        <i class="fas fa-plus"></i> New Playlist
                    </button>
                </div>
                
                <div class="playlist-content">
                    <div class="playlist-tabs">
                        <button class="playlist-tab active" data-tab="my-playlists">My Playlists</button>
                        <button class="playlist-tab" data-tab="create-new">Create New</button>
                        <button class="playlist-tab" data-tab="history">History</button>
                    </div>
                    
                    <div class="playlist-panels">
                        <!-- My Playlists Panel -->
                        <div id="my-playlists-panel" class="playlist-panel active">
                            <div id="playlists-list" class="playlists-list">
                                <!-- Playlists will be loaded here -->
                            </div>
                        </div>
                        
                        <!-- Create New Panel -->
                        <div id="create-new-panel" class="playlist-panel">
                            <form id="new-playlist-form">
                                <div class="form-group">
                                    <label for="playlist-name">Playlist Name</label>
                                    <input type="text" id="playlist-name" placeholder="Enter playlist name" required>
                                </div>
                                <div class="form-group">
                                    <label for="playlist-description">Description</label>
                                    <textarea id="playlist-description" placeholder="Enter playlist description"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="playlist-privacy">Privacy</label>
                                    <select id="playlist-privacy">
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="unlisted">Unlisted</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary">Create Playlist</button>
                            </form>
                        </div>
                        
                        <!-- History Panel -->
                        <div id="history-panel" class="playlist-panel">
                            <div id="history-list" class="history-list">
                                <!-- History will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add playlist manager to page
        const playlistContainer = document.createElement('div');
        playlistContainer.innerHTML = playlistHTML;
        document.body.appendChild(playlistContainer.firstElementChild);
    }

    // Setup event listeners
    setupEventListeners() {
        // Play/Pause button
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }

        // Previous/Next buttons
        document.getElementById('prev-btn')?.addEventListener('click', () => this.playPrevious());
        document.getElementById('next-btn')?.addEventListener('click', () => this.playNext());

        // Progress slider
        const progressSlider = document.getElementById('progress-slider');
        if (progressSlider) {
            progressSlider.addEventListener('input', (e) => this.seekTo(e.target.value));
        }

        // Volume controls
        document.getElementById('volume-btn')?.addEventListener('click', () => this.toggleVolumeSlider());
        document.getElementById('volume-input')?.addEventListener('input', (e) => this.setVolume(e.target.value));

        // Shuffle/Repeat buttons
        document.getElementById('shuffle-btn')?.addEventListener('click', () => this.toggleShuffle());
        document.getElementById('repeat-btn')?.addEventListener('click', () => this.toggleRepeat());

        // Playlist button
        document.getElementById('playlist-btn')?.addEventListener('click', () => this.togglePlaylistManager());

        // Fullscreen button
        document.getElementById('fullscreen-btn')?.addEventListener('click', () => this.toggleFullscreen());

        // Player close button
        document.getElementById('player-close')?.addEventListener('click', () => this.closePlayer());

        // Clear queue button
        document.getElementById('clear-queue-btn')?.addEventListener('click', () => this.clearQueue());

        // Create playlist form
        const newPlaylistForm = document.getElementById('new-playlist-form');
        if (newPlaylistForm) {
            newPlaylistForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createPlaylist();
            });
        }

        // Playlist tabs
        document.querySelectorAll('.playlist-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchPlaylistTab(e.target.dataset.tab));
        });

        // Media events for video
        const videoPlayer = document.getElementById('video-player');
        if (videoPlayer) {
            videoPlayer.addEventListener('timeupdate', () => this.updateProgress());
            videoPlayer.addEventListener('loadedmetadata', () => this.onMediaLoaded());
            videoPlayer.addEventListener('ended', () => this.onMediaEnded());
        }
    }

    // Setup keyboard controls
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.currentMedia) return;

            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowLeft':
                    this.playPrevious();
                    break;
                case 'ArrowRight':
                    this.playNext();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.setVolume(Math.min(100, this.volume + 5));
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.setVolume(Math.max(0, this.volume - 5));
                    break;
                case 'KeyF':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'KeyM':
                    e.preventDefault();
                    this.toggleMute();
                    break;
            }
        });
    }

    // Play media
    playMedia(media, type = 'video') {
        this.currentMediaType = type;
        this.currentMedia = media;
        
        // Update player UI
        this.updatePlayerUI(media, type);
        
        // Show appropriate container
        document.getElementById('video-container').style.display = type === 'video' ? 'block' : 'none';
        document.getElementById('music-container').style.display = type === 'music' ? 'block' : 'none';
        
        if (type === 'video') {
            this.playVideo(media);
        } else {
            this.playMusic(media);
        }

        // Add to history
        this.addToHistory(media, type);
        
        // Show player
        document.getElementById('media-player').style.display = 'block';
    }

    // Play video
    playVideo(video) {
        const videoPlayer = document.getElementById('video-player');
        if (videoPlayer) {
            // Use demo video URL or actual video URL
            videoPlayer.src = video.url || 'https://www.w3schools.com/html/mov_bbb.mp4';
            videoPlayer.play();
            this.isPlaying = true;
            this.updatePlayPauseButton();
        }
    }

    // Play music
    playMusic(song) {
        // For demo, we'll simulate music playing
        this.isPlaying = true;
        this.updatePlayPauseButton();
        this.startMusicVisualizer();
        
        // Update album art
        const albumArt = document.getElementById('album-art');
        if (albumArt && song.thumbnail) {
            albumArt.src = song.thumbnail;
        }
    }

    // Toggle play/pause
    togglePlayPause() {
        if (!this.currentMedia) return;

        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    }

    pause() {
        if (this.currentMediaType === 'video') {
            const videoPlayer = document.getElementById('video-player');
            if (videoPlayer) videoPlayer.pause();
        }
        
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.stopMusicVisualizer();
    }

    resume() {
        if (this.currentMediaType === 'video') {
            const videoPlayer = document.getElementById('video-player');
            if (videoPlayer) videoPlayer.play();
        }
        
        this.isPlaying = true;
        this.updatePlayPauseButton();
        this.startMusicVisualizer();
    }

    // Play previous/next
    playPrevious() {
        if (this.queue.length > 0) {
            this.currentTrackIndex = (this.currentTrackIndex - 1 + this.queue.length) % this.queue.length;
            this.playFromQueue();
        } else if (this.currentPlaylist) {
            this.currentTrackIndex = (this.currentTrackIndex - 1 + this.currentPlaylist.tracks.length) % this.currentPlaylist.tracks.length;
            this.playFromPlaylist();
        }
    }

    playNext() {
        if (this.queue.length > 0) {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.queue.length;
            this.playFromQueue();
        } else if (this.currentPlaylist) {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.currentPlaylist.tracks.length;
            this.playFromPlaylist();
        }
    }

    // Update player UI
    updatePlayerUI(media, type) {
        document.getElementById('now-playing-title').textContent = media.title || 'Unknown Title';
        document.getElementById('now-playing-artist').textContent = 
            type === 'video' ? media.channelName || 'Unknown Channel' : 
            media.artist || 'Unknown Artist';
    }

    // Update progress
    updateProgress() {
        if (this.currentMediaType === 'video') {
            const videoPlayer = document.getElementById('video-player');
            if (videoPlayer) {
                this.currentTime = videoPlayer.currentTime;
                this.duration = videoPlayer.duration;
                
                const progress = (this.currentTime / this.duration) * 100;
                document.getElementById('progress-fill').style.width = progress + '%';
                document.getElementById('progress-slider').value = progress;
                
                document.getElementById('current-time').textContent = this.formatTime(this.currentTime);
                document.getElementById('total-time').textContent = this.formatTime(this.duration);
            }
        } else {
            // Simulate progress for music
            if (this.isPlaying && this.currentTime < this.duration) {
                this.currentTime += 0.1;
                const progress = (this.currentTime / this.duration) * 100;
                document.getElementById('progress-fill').style.width = progress + '%';
                document.getElementById('progress-slider').value = progress;
                
                document.getElementById('current-time').textContent = this.formatTime(this.currentTime);
                document.getElementById('total-time').textContent = this.formatTime(this.duration);
            }
        }
    }

    // Seek to position
    seekTo(percentage) {
        if (this.currentMediaType === 'video') {
            const videoPlayer = document.getElementById('video-player');
            if (videoPlayer) {
                videoPlayer.currentTime = (percentage / 100) * this.duration;
            }
        } else {
            this.currentTime = (percentage / 100) * this.duration;
        }
    }

    // Volume controls
    setVolume(value) {
        this.volume = value / 100;
        
        if (this.currentMediaType === 'video') {
            const videoPlayer = document.getElementById('video-player');
            if (videoPlayer) videoPlayer.volume = this.volume;
        }
        
        document.getElementById('volume-input').value = value;
    }

    toggleVolumeSlider() {
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            volumeSlider.style.display = volumeSlider.style.display === 'none' ? 'block' : 'none';
        }
    }

    toggleMute() {
        this.setVolume(this.volume > 0 ? 0 : 70);
    }

    // Shuffle and repeat
    toggleShuffle() {
        this.shuffle = !this.shuffle;
        document.getElementById('shuffle-btn').classList.toggle('active');
    }

    toggleRepeat() {
        const modes = ['none', 'one', 'all'];
        const currentIndex = modes.indexOf(this.repeat);
        this.repeat = modes[(currentIndex + 1) % modes.length];
        
        const repeatBtn = document.getElementById('repeat-btn');
        repeatBtn.classList.remove('repeat-none', 'repeat-one', 'repeat-all');
        repeatBtn.classList.add(`repeat-${this.repeat}`);
    }

    // Fullscreen
    toggleFullscreen() {
        if (this.currentMediaType === 'video') {
            const videoPlayer = document.getElementById('video-player');
            if (videoPlayer) {
                if (videoPlayer.requestFullscreen) {
                    videoPlayer.requestFullscreen();
                } else if (videoPlayer.webkitRequestFullscreen) {
                    videoPlayer.webkitRequestFullscreen();
                }
            }
        } else {
            // Music player fullscreen
            const player = document.getElementById('media-player');
            if (player.requestFullscreen) {
                player.requestFullscreen();
            }
        }
    }

    // Close player
    closePlayer() {
        this.pause();
        document.getElementById('media-player').style.display = 'none';
        this.currentMedia = null;
        this.currentMediaType = null;
    }

    // Playlist management
    togglePlaylistManager() {
        const playlistManager = document.getElementById('playlist-manager');
        if (playlistManager) {
            playlistManager.style.display = playlistManager.style.display === 'none' ? 'block' : 'none';
        }
    }

    switchPlaylistTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.playlist-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Update panels
        document.querySelectorAll('.playlist-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`${tab}-panel`).classList.add('active');
        
        // Load content for tab
        if (tab === 'my-playlists') {
            this.loadPlaylists();
        } else if (tab === 'history') {
            this.loadHistory();
        }
    }

    createPlaylist() {
        const name = document.getElementById('playlist-name').value.trim();
        const description = document.getElementById('playlist-description').value.trim();
        const privacy = document.getElementById('playlist-privacy').value;
        
        if (!name) {
            this.showNotification('Please enter a playlist name', 'error');
            return;
        }
        
        const newPlaylist = {
            id: this.generateId(),
            name: name,
            description: description,
            privacy: privacy,
            tracks: [],
            createdAt: new Date().toISOString(),
            coverImage: `https://picsum.photos/seed/${name}/300/300.jpg`
        };
        
        this.playlists.push(newPlaylist);
        this.savePlaylists();
        this.showNotification(`Playlist "${name}" created successfully!`, 'success');
        
        // Clear form
        document.getElementById('new-playlist-form').reset();
        
        // Switch to my playlists tab
        this.switchPlaylistTab('my-playlists');
    }

    loadPlaylists() {
        const playlistsList = document.getElementById('playlists-list');
        if (playlistsList) {
            playlistsList.innerHTML = this.playlists.map(playlist => this.createPlaylistCard(playlist)).join('');
        }
    }

    createPlaylistCard(playlist) {
        return `
            <div class="playlist-card" data-playlist-id="${playlist.id}">
                <div class="playlist-cover">
                    <img src="${playlist.coverImage}" alt="${playlist.name}">
                    <div class="playlist-overlay">
                        <button class="play-playlist-btn" onclick="mediaPlayer.playPlaylist('${playlist.id}')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="playlist-info">
                    <h4>${playlist.name}</h4>
                    <p>${playlist.description || 'No description'}</p>
                    <div class="playlist-meta">
                        <span>${playlist.tracks.length} tracks</span>
                        <span>${playlist.privacy}</span>
                    </div>
                </div>
            </div>
        `;
    }

    playPlaylist(playlistId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (playlist && playlist.tracks.length > 0) {
            this.currentPlaylist = playlist;
            this.currentTrackIndex = 0;
            this.playFromPlaylist();
        }
    }

    playFromPlaylist() {
        if (this.currentPlaylist && this.currentPlaylist.tracks.length > 0) {
            const track = this.currentPlaylist.tracks[this.currentTrackIndex];
            this.playMedia(track, track.type);
        }
    }

    // Queue management
    addToQueue(media, type) {
        this.queue.push({ ...media, type: type });
        this.updateQueueUI();
    }

    clearQueue() {
        this.queue = [];
        this.updateQueueUI();
    }

    updateQueueUI() {
        const queueList = document.getElementById('queue-list');
        if (queueList) {
            queueList.innerHTML = this.queue.map((item, index) => `
                <div class="queue-item ${index === this.currentTrackIndex ? 'playing' : ''}" data-queue-index="${index}">
                    <img src="${item.thumbnail}" alt="${item.title}" class="queue-thumbnail">
                    <div class="queue-info">
                        <h5>${item.title}</h5>
                        <p>${item.artist || item.channelName}</p>
                    </div>
                    <button class="queue-remove-btn" onclick="mediaPlayer.removeFromQueue(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    removeFromQueue(index) {
        this.queue.splice(index, 1);
        this.updateQueueUI();
    }

    // History management
    loadHistory() {
        const stored = localStorage.getItem('mediaHistory');
        return stored ? JSON.parse(stored) : [];
    }

    saveHistory() {
        localStorage.setItem('mediaHistory', JSON.stringify(this.history));
    }

    addToHistory(media, type) {
        // Remove if already exists
        this.history = this.history.filter(item => 
            !(item.id === media.id && item.type === type)
        );
        
        // Add to beginning
        this.history.unshift({
            ...media,
            type: type,
            playedAt: new Date().toISOString()
        });
        
        // Keep only last 50 items
        this.history = this.history.slice(0, 50);
        this.saveHistory();
    }

    loadHistory() {
        const historyList = document.getElementById('history-list');
        if (historyList) {
            historyList.innerHTML = this.history.map(item => this.createHistoryItem(item)).join('');
        }
    }

    createHistoryItem(item) {
        return `
            <div class="history-item" data-history-id="${item.id}">
                <img src="${item.thumbnail}" alt="${item.title}" class="history-thumbnail">
                <div class="history-info">
                    <h5>${item.title}</h5>
                    <p>${item.artist || item.channelName}</p>
                    <span class="history-time">${this.formatRelativeTime(item.playedAt)}</span>
                </div>
                <button class="history-play-btn" onclick="mediaPlayer.playMedia(${JSON.stringify(item).replace(/"/g, '&quot;')}, '${item.type}')">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
    }

    // Music visualizer
    startMusicVisualizer() {
        const bars = document.querySelectorAll('.visualizer .bar');
        bars.forEach((bar, index) => {
            setInterval(() => {
                if (this.isPlaying && this.currentMediaType === 'music') {
                    const height = Math.random() * 40 + 10;
                    bar.style.height = height + 'px';
                } else {
                    bar.style.height = '4px';
                }
            }, 100 + (index * 50));
        });
    }

    stopMusicVisualizer() {
        const bars = document.querySelectorAll('.visualizer .bar');
        bars.forEach(bar => {
            bar.style.height = '4px';
        });
    }

    // Update play/pause button
    updatePlayPauseButton() {
        const btn = document.getElementById('play-pause-btn');
        if (btn) {
            btn.innerHTML = this.isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        }
    }

    // Utility methods
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    generateId() {
        return 'playlist_' + Math.random().toString(36).substr(2, 9);
    }

    loadPlaylists() {
        const stored = localStorage.getItem('playlists');
        return stored ? JSON.parse(stored) : [];
    }

    savePlaylists() {
        localStorage.setItem('playlists', JSON.stringify(this.playlists));
    }

    showNotification(message, type = 'info') {
        // Create notification (reuse existing notification system)
        if (window.interactionManager) {
            window.interactionManager.showNotification(message, type);
        }
    }

    onMediaLoaded() {
        // Called when media metadata is loaded
        console.log('📽 Media loaded:', this.currentMedia);
    }

    onMediaEnded() {
        // Called when media finishes playing
        console.log('📽 Media ended, playing next...');
        this.playNext();
    }
}

// Initialize media player
const mediaPlayer = new MediaPlayer();
