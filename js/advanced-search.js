// Advanced Search and Filtering System
class AdvancedSearchManager {
    constructor() {
        this.filters = {
            query: '',
            category: '',
            duration: '',
            uploadDate: '',
            sortBy: 'relevance',
            viewCount: '',
            quality: ''
        };
        this.searchHistory = [];
        this.suggestions = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSearchHistory();
        this.setupSearchSuggestions();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const advancedSearchBtn = document.getElementById('advanced-search-btn');
        const clearFiltersBtn = document.getElementById('clear-filters-btn');

        searchInput?.addEventListener('input', (e) => this.handleSearchInput(e.target.value));
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        searchBtn?.addEventListener('click', () => this.performSearch());
        advancedSearchBtn?.addEventListener('click', () => this.openAdvancedSearch());
        clearFiltersBtn?.addEventListener('click', () => this.clearFilters());

        // Filter controls
        document.getElementById('filter-category')?.addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('filter-duration')?.addEventListener('change', (e) => {
            this.filters.duration = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('filter-sort')?.addEventListener('change', (e) => {
            this.filters.sortBy = e.target.value;
            this.applyFilters();
        });
    }

    handleSearchInput(query) {
        this.filters.query = query;
        
        if (query.length > 2) {
            this.showSearchSuggestions(query);
        } else {
            this.hideSearchSuggestions();
        }
    }

    async showSearchSuggestions(query) {
        try {
            // Simulate API call for suggestions
            this.suggestions = [
                `${query} tutorial`,
                `${query} review`,
                `${query} 2024`,
                `${query} explained`,
                `how to ${query}`
            ];
            
            this.displaySuggestions();
        } catch (error) {
            console.error('Error loading suggestions:', error);
        }
    }

    displaySuggestions() {
        const container = document.getElementById('search-suggestions');
        if (!container) return;

        container.innerHTML = this.suggestions.map(suggestion => `
            <div class="search-suggestion" onclick="advancedSearch.selectSuggestion('${suggestion}')">
                <i class="fas fa-search"></i>
                <span>${suggestion}</span>
            </div>
        `).join('');

        container.classList.add('show');
    }

    hideSearchSuggestions() {
        const container = document.getElementById('search-suggestions');
        if (container) {
            container.classList.remove('show');
        }
    }

    selectSuggestion(suggestion) {
        document.getElementById('search-input').value = suggestion;
        this.filters.query = suggestion;
        this.hideSearchSuggestions();
        this.performSearch();
    }

    async performSearch() {
        const query = this.filters.query.trim();
        if (!query) return;

        // Add to search history
        this.addToSearchHistory(query);

        // Show loading state
        this.showSearchLoading();

        try {
            // Simulate API call
            const results = await this.searchVideos(query);
            this.displaySearchResults(results);
            
            // Update URL
            this.updateURL(query);
            
        } catch (error) {
            console.error('Search error:', error);
            showToast('Search failed. Please try again.', 'error');
        } finally {
            this.hideSearchLoading();
        }
    }

    async searchVideos(query) {
        // Simulate search API
        return [
            {
                id: '1',
                title: `${query} - Complete Guide`,
                description: `Learn everything about ${query}`,
                thumbnail: `https://picsum.photos/seed/${query}1/320/180.jpg`,
                duration: '15:30',
                views: 125000,
                uploadDate: '2024-01-15',
                channel: 'Tutorial Master'
            },
            {
                id: '2',
                title: `${query} for Beginners`,
                description: `Start learning ${query} today`,
                thumbnail: `https://picsum.photos/seed/${query}2/320/180.jpg`,
                duration: '8:45',
                views: 89000,
                uploadDate: '2024-01-10',
                channel: 'Learn Easy'
            }
        ];
    }

    displaySearchResults(results) {
        const container = document.getElementById('search-results');
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try different keywords or check your spelling</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="search-header">
                <h2>Search results for "${this.filters.query}"</h2>
                <div class="result-count">${results.length} results</div>
            </div>
            <div class="search-filters">
                ${this.getFilterHTML()}
            </div>
            <div class="video-grid">
                ${results.map(video => this.createVideoCard(video)).join('')}
            </div>
        `;
    }

    getFilterHTML() {
        return `
            <div class="filter-group">
                <select id="filter-category" class="filter-select">
                    <option value="">All Categories</option>
                    <option value="music">Music</option>
                    <option value="gaming">Gaming</option>
                    <option value="education">Education</option>
                    <option value="sports">Sports</option>
                </select>
                
                <select id="filter-duration" class="filter-select">
                    <option value="">Any Duration</option>
                    <option value="short">Under 4 minutes</option>
                    <option value="medium">4-20 minutes</option>
                    <option value="long">Over 20 minutes</option>
                </select>
                
                <select id="filter-sort" class="filter-select">
                    <option value="relevance">Relevance</option>
                    <option value="date">Upload date</option>
                    <option value="views">View count</option>
                    <option value="rating">Rating</option>
                </select>
                
                <button id="clear-filters-btn" class="btn btn-outline">Clear Filters</button>
            </div>
        `;
    }

    createVideoCard(video) {
        return `
            <div class="video-card">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <span class="video-duration">${video.duration}</span>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <div class="video-channel">${video.channel}</div>
                    <div class="video-meta">${this.formatViews(video.views)} views • ${video.uploadDate}</div>
                </div>
            </div>
        `;
    }

    formatViews(views) {
        if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
        return views.toString();
    }

    applyFilters() {
        // Apply filters to current results
        this.performSearch();
    }

    clearFilters() {
        this.filters = {
            query: this.filters.query,
            category: '',
            duration: '',
            uploadDate: '',
            sortBy: 'relevance',
            viewCount: '',
            quality: ''
        };
        
        // Reset filter controls
        document.getElementById('filter-category').value = '';
        document.getElementById('filter-duration').value = '';
        document.getElementById('filter-sort').value = 'relevance';
        
        this.performSearch();
    }

    openAdvancedSearch() {
        const modal = document.getElementById('advanced-search-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    addToSearchHistory(query) {
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            this.searchHistory = this.searchHistory.slice(0, 10); // Keep only 10 recent searches
        }
    }

    loadSearchHistory() {
        // Load from localStorage
        const saved = localStorage.getItem('searchHistory');
        if (saved) {
            this.searchHistory = JSON.parse(saved);
        }
    }

    saveSearchHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    updateURL(query) {
        const url = new URL(window.location);
        url.searchParams.set('q', query);
        window.history.pushState({}, '', url);
    }

    showSearchLoading() {
        const container = document.getElementById('search-results');
        if (container) {
            container.innerHTML = '<div class="search-loading"><div class="spinner"></div></div>';
        }
    }

    hideSearchLoading() {
        // Loading will be replaced by results
    }

    setupSearchSuggestions() {
        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            const searchContainer = document.querySelector('.search-container');
            if (!searchContainer?.contains(e.target)) {
                this.hideSearchSuggestions();
            }
        });
    }
}

const advancedSearch = new AdvancedSearchManager();
