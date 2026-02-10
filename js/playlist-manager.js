// Playlist Management Features
class PlaylistManager {
    constructor() {
        this.playlists = [];
        this.currentPlaylist = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPlaylists();
    }

    setupEventListeners() {
        document.getElementById('create-playlist-btn')?.addEventListener('click', () => this.createPlaylist());
        document.getElementById('save-playlist-btn')?.addEventListener('click', () => this.savePlaylist());
        document.getElementById('add-to-playlist-btn')?.addEventListener('click', () => this.showPlaylistModal());
    }

    async createPlaylist() {
        const name = document.getElementById('playlist-name')?.value;
        const description = document.getElementById('playlist-description')?.value;
        
        if (!name) {
            showToast('Please enter a playlist name', 'warning');
            return;
        }

        const playlist = {
            id: Date.now().toString(),
            name: name,
            description: description || '',
            videos: [],
            createdAt: new Date(),
            isPublic: document.getElementById('playlist-public')?.checked || false
        };

        this.playlists.push(playlist);
        this.displayPlaylists();
        showToast('Playlist created successfully!', 'success');
        
        // Clear form
        document.getElementById('playlist-name').value = '';
        document.getElementById('playlist-description').value = '';
    }

    displayPlaylists() {
        const container = document.getElementById('playlists-container');
        if (!container) return;

        container.innerHTML = this.playlists.map(playlist => `
            <div class="playlist-card" data-playlist-id="${playlist.id}">
                <div class="playlist-thumbnail">
                    <img src="${this.getPlaylistThumbnail(playlist)}" alt="${playlist.name}">
                    <div class="video-count">${playlist.videos.length} videos</div>
                </div>
                <div class="playlist-info">
                    <h3 class="playlist-title">${playlist.name}</h3>
                    <p class="playlist-description">${playlist.description}</p>
                    <div class="playlist-actions">
                        <button class="btn btn-sm btn-primary" onclick="playlistManager.openPlaylist('${playlist.id}')">Open</button>
                        <button class="btn btn-sm btn-outline" onclick="playlistManager.editPlaylist('${playlist.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="playlistManager.deletePlaylist('${playlist.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getPlaylistThumbnail(playlist) {
        if (playlist.videos.length > 0) {
            return playlist.videos[0].thumbnail || 'https://picsum.photos/seed/playlist/320/180.jpg';
        }
        return 'https://picsum.photos/seed/empty/320/180.jpg';
    }

    async loadPlaylists() {
        // Simulate loading playlists
        this.playlists = [
            {
                id: '1',
                name: 'My Favorites',
                description: 'Best videos collection',
                videos: [],
                createdAt: new Date(),
                isPublic: false
            }
        ];
        this.displayPlaylists();
    }
}

const playlistManager = new PlaylistManager();
