const prisma = require('../config/database');

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        channelName: true,
        description: true,
        avatar: true,
        subscribers: true,
        totalViews: true,
        videoCount: true,
        createdAt: true,
        videos: {
          where: {
            status: 'published',
            visibility: 'public'
          },
          include: {
            _count: {
              select: {
                likes: true,
                comments: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Subscribe/Unsubscribe to channel
const toggleSubscription = async (req, res) => {
  try {
    const { channelId } = req.params;

    // Check if channel exists
    const channel = await prisma.user.findUnique({
      where: { id: channelId }
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Check if already subscribed
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        userId_channelId: {
          userId: req.userId,
          channelId
        }
      }
    });

    if (existingSubscription) {
      // Unsubscribe
      await prisma.subscription.delete({
        where: {
          userId_channelId: {
            userId: req.userId,
            channelId
          }
        }
      });

      await prisma.user.update({
        where: { id: channelId },
        data: { subscribers: { decrement: 1 } }
      });

      res.json({ message: 'Unsubscribed successfully', subscribed: false });
    } else {
      // Subscribe
      await prisma.subscription.create({
        data: {
          userId: req.userId,
          channelId
        }
      });

      await prisma.user.update({
        where: { id: channelId },
        data: { subscribers: { increment: 1 } }
      });

      res.json({ message: 'Subscribed successfully', subscribed: true });
    }
  } catch (error) {
    console.error('Toggle subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check subscription status
const getSubscriptionStatus = async (req, res) => {
  try {
    const { channelId } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_channelId: {
          userId: req.userId,
          channelId
        }
      }
    });

    res.json({ subscribed: !!subscription });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's subscriptions
const getUserSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: {
          userId: req.userId
        },
        include: {
          channel: {
            select: {
              id: true,
              username: true,
              channelName: true,
              avatar: true,
              subscribers: true,
              videoCount: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.subscription.count({
        where: {
          userId: req.userId
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      subscriptions,
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
    console.error('Get user subscriptions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: q, mode: 'insensitive' } },
            { channelName: { contains: q, mode: 'insensitive' } }
          ],
          isActive: true
        },
        select: {
          id: true,
          username: true,
          channelName: true,
          description: true,
          avatar: true,
          subscribers: true,
          videoCount: true
        },
        orderBy: {
          subscribers: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.user.count({
        where: {
          OR: [
            { username: { contains: q, mode: 'insensitive' } },
            { channelName: { contains: q, mode: 'insensitive' } }
          ],
          isActive: true
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      users,
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
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get channel subscribers
const getChannelSubscribers = async (req, res) => {
  try {
    const { channelId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Check if user is the channel owner
    if (channelId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: {
          channelId
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.subscription.count({
        where: {
          channelId
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      subscribers: subscriptions.map(sub => sub.user),
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
    console.error('Get channel subscribers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUserProfile,
  toggleSubscription,
  getSubscriptionStatus,
  getUserSubscriptions,
  searchUsers,
  getChannelSubscribers
};
