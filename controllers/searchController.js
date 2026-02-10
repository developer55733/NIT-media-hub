const prisma = require('../config/database');

// Global search
const globalSearch = async (req, res) => {
  try {
    const { q, type = 'all', page = 1, limit = 20, sortBy = 'relevance' } = req.query;
    const skip = (page - 1) * limit;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchQuery = q.trim();
    const offset = skip;

    let results = {
      videos: [],
      users: [],
      playlists: []
    };

    // Search videos
    if (type === 'all' || type === 'videos') {
      const videoWhere = {
        status: 'published',
        visibility: 'public',
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { tags: { has: searchQuery } }
        ]
      };

      let videoOrderBy = {};
      switch (sortBy) {
        case 'views':
          videoOrderBy = { views: 'desc' };
          break;
        case 'likes':
          videoOrderBy = { likes: 'desc' };
          break;
        case 'date':
          videoOrderBy = { createdAt: 'desc' };
          break;
        case 'relevance':
        default:
          // For relevance, we'll sort by a combination of factors
          videoOrderBy = { views: 'desc' };
          break;
      }

      results.videos = await prisma.video.findMany({
        where: videoWhere,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              channelName: true,
              avatar: true,
              subscribers: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        },
        orderBy: videoOrderBy,
        skip: offset,
        take: limit
      });
    }

    // Search users/channels
    if (type === 'all' || type === 'channels') {
      const userWhere = {
        isActive: true,
        OR: [
          { username: { contains: searchQuery, mode: 'insensitive' } },
          { channelName: { contains: searchQuery, mode: 'insensitive' } }
        ]
      };

      results.users = await prisma.user.findMany({
        where: userWhere,
        select: {
          id: true,
          username: true,
          channelName: true,
          description: true,
          avatar: true,
          subscribers: true,
          videoCount: true,
          totalViews: true
        },
        orderBy: { subscribers: 'desc' },
        skip: offset,
        take: limit
      });
    }

    // Search playlists
    if (type === 'all' || type === 'playlists') {
      const playlistWhere = {
        isPublic: true,
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } }
        ]
      };

      results.playlists = await prisma.playlist.findMany({
        where: playlistWhere,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              channelName: true,
              avatar: true
            }
          },
          videos: {
            include: {
              video: {
                select: {
                  id: true,
                  title: true,
                  thumbnail: true,
                  duration: true
                }
              }
            },
            take: 3,
            orderBy: { position: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      });
    }

    // Get total counts for pagination
    const [videoCount, userCount, playlistCount] = await Promise.all([
      type === 'all' || type === 'videos' ? prisma.video.count({
        where: {
          status: 'published',
          visibility: 'public',
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
            { tags: { has: searchQuery } }
          ]
        }
      }) : Promise.resolve(0),
      
      type === 'all' || type === 'channels' ? prisma.user.count({
        where: {
          isActive: true,
          OR: [
            { username: { contains: searchQuery, mode: 'insensitive' } },
            { channelName: { contains: searchQuery, mode: 'insensitive' } }
          ]
        }
      }) : Promise.resolve(0),
      
      type === 'all' || type === 'playlists' ? prisma.playlist.count({
        where: {
          isPublic: true,
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } }
          ]
        }
      }) : Promise.resolve(0)
    ]);

    const total = videoCount + userCount + playlistCount;
    const totalPages = Math.ceil(total / limit);

    res.json({
      results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      counts: {
        videos: videoCount,
        users: userCount,
        playlists: playlistCount
      },
      query: searchQuery,
      type
    });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search suggestions/autocomplete
const getSearchSuggestions = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchQuery = q.trim();

    // Get video title suggestions
    const videoSuggestions = await prisma.video.findMany({
      where: {
        status: 'published',
        visibility: 'public',
        title: { contains: searchQuery, mode: 'insensitive' }
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        duration: true,
        user: {
          select: {
            channelName: true
          }
        }
      },
      orderBy: { views: 'desc' },
      take: limit
    });

    // Get channel suggestions
    const channelSuggestions = await prisma.user.findMany({
      where: {
        isActive: true,
        channelName: { contains: searchQuery, mode: 'insensitive' }
      },
      select: {
        id: true,
        channelName: true,
        avatar: true,
        subscribers: true
      },
      orderBy: { subscribers: 'desc' },
      take: Math.floor(limit / 2)
    });

    // Get tag suggestions
    const tagSuggestions = await prisma.video.findMany({
      where: {
        status: 'published',
        visibility: 'public',
        tags: { has: searchQuery }
      },
      select: {
        tags: true
      },
      take: limit
    });

    // Extract unique tags
    const allTags = tagSuggestions.reduce((tags, video) => {
      return [...tags, ...video.tags];
    }, []);
    const uniqueTags = [...new Set(allTags)]
      .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, Math.floor(limit / 2));

    const suggestions = {
      videos: videoSuggestions,
      channels: channelSuggestions,
      tags: uniqueTags
    };

    res.json({ suggestions });
  } catch (error) {
    console.error('Get search suggestions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Trending searches
const getTrendingSearches = async (req, res) => {
  try {
    const { period = '24h', limit = 20 } = req.query;

    // This would typically be implemented with a search analytics table
    // For now, we'll return popular tags from recent videos
    let hoursBack = 24;
    if (period === '7d') hoursBack = 168;
    if (period === '30d') hoursBack = 720;

    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hoursBack);

    const recentVideos = await prisma.video.findMany({
      where: {
        status: 'published',
        visibility: 'public',
        createdAt: { gte: startDate }
      },
      select: {
        tags: true,
        views: true
      },
      orderBy: { views: 'desc' },
      take: 100
    });

    // Aggregate and count tags
    const tagCounts = {};
    recentVideos.forEach(video => {
      video.tags.forEach(tag => {
        if (tag) {
          tagCounts[tag] = (tagCounts[tag] || 0) + video.views;
        }
      });
    });

    // Sort by count and return top tags
    const trendingTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));

    res.json({ trendingTags });
  } catch (error) {
    console.error('Get trending searches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Advanced search with filters
const advancedSearch = async (req, res) => {
  try {
    const {
      q,
      category,
      duration,
      uploadDate,
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = req.query;

    const skip = (page - 1) * limit;

    let where = {
      status: 'published',
      visibility: 'public'
    };

    // Text search
    if (q && q.trim()) {
      where.OR = [
        { title: { contains: q.trim(), mode: 'insensitive' } },
        { description: { contains: q.trim(), mode: 'insensitive' } },
        { tags: { has: q.trim() } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      where.category = category;
    }

    // Duration filter
    if (duration) {
      switch (duration) {
        case 'short':
          // Under 4 minutes
          where.duration = { lt: '04:00' };
          break;
        case 'medium':
          // 4-20 minutes
          where.duration = { gte: '04:00', lte: '20:00' };
          break;
        case 'long':
          // Over 20 minutes
          where.duration = { gt: '20:00' };
          break;
      }
    }

    // Upload date filter
    if (uploadDate) {
      const now = new Date();
      let startDate = new Date();

      switch (uploadDate) {
        case 'hour':
          startDate.setHours(now.getHours() - 1);
          break;
        case 'today':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      where.createdAt = { gte: startDate };
    }

    // Sorting
    let orderBy = {};
    switch (sortBy) {
      case 'views':
        orderBy = { views: 'desc' };
        break;
      case 'likes':
        orderBy = { likes: 'desc' };
        break;
      case 'date':
        orderBy = { createdAt: 'desc' };
        break;
      case 'duration':
        orderBy = { duration: 'desc' };
        break;
      case 'relevance':
      default:
        // For relevance, prioritize views and recency
        orderBy = { views: 'desc' };
        break;
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              channelName: true,
              avatar: true,
              subscribers: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.video.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        q,
        category,
        duration,
        uploadDate,
        sortBy
      }
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  globalSearch,
  getSearchSuggestions,
  getTrendingSearches,
  advancedSearch
};
