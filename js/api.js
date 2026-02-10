// API Service for Media Hub
class ApiService {
  constructor() {
    this.baseURL = '/api';
    this.token = localStorage.getItem('token');
  }

  // Helper method to make API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Clear authentication
  logout() {
    this.setToken(null);
    currentUser = null;
    isAdmin = false;
  }

  // Authentication endpoints
  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    this.setToken(data.token);
    return data;
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async updateAvatar(formData) {
    const config = {
      method: 'PUT',
      body: formData,
      headers: {} // Let browser set Content-Type for FormData
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/auth/avatar`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Avatar upload failed');
    }

    return data;
  }

  // Video endpoints
  async getVideos(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/videos?${queryString}`);
  }

  async getVideoById(id) {
    return await this.request(`/videos/${id}`);
  }

  async createVideo(formData) {
    const config = {
      method: 'POST',
      body: formData,
      headers: {}
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/videos/upload`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Video upload failed');
    }

    return data;
  }

  async updateVideo(id, videoData) {
    return await this.request(`/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(videoData)
    });
  }

  async deleteVideo(id) {
    return await this.request(`/videos/${id}`, {
      method: 'DELETE'
    });
  }

  async getUserVideos(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/videos/user/${userId}?${queryString}`);
  }

  async getTrendingVideos(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/videos/trending?${queryString}`);
  }

  // Comment endpoints
  async getComments(videoId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/comments/${videoId}?${queryString}`);
  }

  async createComment(videoId, commentData) {
    return await this.request(`/comments/${videoId}`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  async updateComment(id, commentData) {
    return await this.request(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(commentData)
    });
  }

  async deleteComment(id) {
    return await this.request(`/comments/${id}`, {
      method: 'DELETE'
    });
  }

  async likeComment(id) {
    return await this.request(`/comments/${id}/like`, {
      method: 'POST'
    });
  }

  // Like endpoints
  async toggleVideoLike(videoId, type) {
    return await this.request(`/likes/${videoId}`, {
      method: 'POST',
      body: JSON.stringify({ type })
    });
  }

  async getVideoLikeStatus(videoId) {
    return await this.request(`/likes/${videoId}/status`);
  }

  async getVideoLikes(videoId) {
    return await this.request(`/likes/${videoId}`);
  }

  // User endpoints
  async getUserProfile(userId) {
    return await this.request(`/users/${userId}`);
  }

  async toggleSubscription(channelId) {
    return await this.request(`/users/${channelId}/subscribe`, {
      method: 'POST'
    });
  }

  async getSubscriptionStatus(channelId) {
    return await this.request(`/users/${channelId}/subscribe/status`);
  }

  async getUserSubscriptions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/users/subscriptions/list?${queryString}`);
  }

  async searchUsers(query, params = {}) {
    const queryString = new URLSearchParams({ q: query, ...params }).toString();
    return await this.request(`/users/search?${queryString}`);
  }

  async getChannelSubscribers(channelId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/users/${channelId}/subscribers?${queryString}`);
  }
}

// Create global API service instance
const api = new ApiService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiService;
}
