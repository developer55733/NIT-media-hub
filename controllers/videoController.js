const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

// Validation schemas
const createVideoSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  thumbnail: Joi.string().required(),
  videoUrl: Joi.string().required(),
  duration: Joi.string().optional(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  visibility: Joi.string().valid('public', 'private', 'unlisted').default('public')
});

// Get all videos with pagination and filtering
const getVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const skip = (page - 1) * limit;

    const where = {
      status: 'published',
      visibility: 'public'
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
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
        orderBy: {
          [sortBy]: sortOrder
        },
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
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get video by ID
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            channelName: true,
            avatar: true,
            subscribers: true,
            description: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Check if video is accessible
    if (video.visibility === 'private' && video.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Increment views
    if (video.userId !== req.userId) {
      await prisma.video.update({
        where: { id },
        data: { views: { increment: 1 } }
      });
      video.views += 1;
    }

    res.json({ video });
  } catch (error) {
    console.error('Get video by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new video
const createVideo = async (req, res) => {
  try {
    const { error } = createVideoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description, thumbnail, videoUrl, duration, category, tags, visibility } = req.body;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        thumbnail,
        videoUrl,
        duration,
        category,
        tags: tags || [],
        visibility,
        userId: req.userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            channelName: true,
            avatar: true,
            subscribers: true
          }
        }
      }
    });

    // Update user video count
    await prisma.user.update({
      where: { id: req.userId },
      data: { videoCount: { increment: 1 } }
    });

    res.status(201).json({
      message: 'Video created successfully',
      video
    });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update video
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail, category, tags, visibility } = req.body;

    // Check if video exists and user owns it
    const existingVideo = await prisma.video.findUnique({
      where: { id }
    });

    if (!existingVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (existingVideo.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const video = await prisma.video.update({
      where: { id },
      data: {
        title,
        description,
        thumbnail,
        category,
        tags,
        visibility
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            channelName: true,
            avatar: true,
            subscribers: true
          }
        }
      }
    });

    res.json({
      message: 'Video updated successfully',
      video
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete video
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if video exists and user owns it
    const existingVideo = await prisma.video.findUnique({
      where: { id }
    });

    if (!existingVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (existingVideo.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.video.delete({
      where: { id }
    });

    // Update user video count
    await prisma.user.update({
      where: { id: req.userId },
      data: { videoCount: { decrement: 1 } }
    });

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's videos
const getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      status: 'published'
    };

    // If not the owner, only show public videos
    if (userId !== req.userId) {
      where.visibility = 'public';
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
        orderBy: {
          createdAt: 'desc'
        },
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
      }
    });
  } catch (error) {
    console.error('Get user videos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get trending videos
const getTrendingVideos = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const videos = await prisma.video.findMany({
      where: {
        status: 'published',
        visibility: 'public',
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
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
            likes: true,
            comments: true
          }
        }
      },
      orderBy: [
        { views: 'desc' },
        { likes: 'desc' }
      ],
      take: limit
    });

    res.json({ videos });
  } catch (error) {
    console.error('Get trending videos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getUserVideos,
  getTrendingVideos
};
