const prisma = require('../config/database');

// Get channel analytics
const getChannelAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = '30d' } = req.query;

    // Check if user owns the channel or is admin
    if (userId !== req.userId && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Calculate date range based on period
    let daysBack = 30;
    if (period === '7d') daysBack = 7;
    if (period === '1d') daysBack = 1;
    if (period === '90d') daysBack = 90;
    if (period === '1y') daysBack = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Get channel stats
    const [
      totalViews,
      totalVideos,
      totalSubscribers,
      recentSubscribers,
      topVideos,
      viewsOverTime,
      subscriberGrowth
    ] = await Promise.all([
      // Total views
      prisma.video.aggregate({
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        _sum: { views: true }
      }),
      // Total videos
      prisma.video.count({
        where: {
          userId,
          status: 'published'
        }
      }),
      // Total subscribers
      prisma.user.findUnique({
        where: { id: userId },
        select: { subscribers: true }
      }),
      // Recent subscribers
      prisma.subscription.count({
        where: {
          channelId: userId,
          createdAt: { gte: startDate }
        }
      }),
      // Top videos
      prisma.video.findMany({
        where: {
          userId,
          status: 'published',
          createdAt: { gte: startDate }
        },
        orderBy: { views: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          views: true,
          likes: true,
          comments: true,
          thumbnail: true,
          createdAt: true
        }
      }),
      // Views over time (daily aggregation)
      prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          SUM(views) as views
        FROM videos 
        WHERE userId = ${userId} 
          AND createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
        LIMIT ${daysBack}
      `,
      // Subscriber growth
      prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as subscribers
        FROM subscriptions 
        WHERE channelId = ${userId} 
          AND createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
        LIMIT ${daysBack}
      `
    ]);

    const analytics = {
      overview: {
        totalViews: totalViews._sum.views || 0,
        totalVideos,
        totalSubscribers: totalSubscribers.subscribers || 0,
        recentSubscribers
      },
      topVideos,
      viewsOverTime: viewsOverTime.reverse(), // Reverse to show chronological order
      subscriberGrowth: subscriberGrowth.reverse(),
      period
    };

    res.json({ analytics });
  } catch (error) {
    console.error('Get channel analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get video analytics
const getVideoAnalytics = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Get video with owner info
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        user: {
          select: { id: true, username: true }
        }
      }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Check if user owns the video or is admin
    if (video.user.id !== req.userId && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get video analytics
    const [
      viewDetails,
      engagement,
      demographics,
      retention
    ] = await Promise.all([
      // View details
      prisma.videoView.groupBy({
        by: ['viewedAt'],
        where: { videoId },
        _count: { id: true },
        orderBy: { viewedAt: 'desc' },
        take: 30
      }),
      // Engagement metrics
      prisma.video.findUnique({
        where: { id: videoId },
        select: {
          views: true,
          likes: true,
          dislikes: true,
          comments: true
        }
      }),
      // Demographics (if available)
      prisma.videoView.groupBy({
        by: ['userAgent'],
        where: { videoId },
        _count: { id: true },
        take: 10
      }),
      // Retention (watch history)
      prisma.watchHistory.aggregate({
        where: { videoId },
        _avg: { watchDuration: true },
        _count: { id: true }
      })
    ]);

    const analytics = {
      video: {
        id: video.id,
        title: video.title,
        duration: video.duration
      },
      metrics: {
        totalViews: engagement.views,
        totalLikes: engagement.likes,
        totalDislikes: engagement.dislikes,
        totalComments: engagement.comments,
        engagementRate: engagement.views > 0 ? ((engagement.likes + engagement.comments) / engagement.views * 100).toFixed(2) : 0,
        averageWatchDuration: retention._avg.watchDuration || 0,
        completionRate: video.duration ? ((retention._avg.watchDuration || 0) / parseDuration(video.duration) * 100).toFixed(2) : 0
      },
      viewDetails,
      demographics,
      retention
    };

    res.json({ analytics });
  } catch (error) {
    console.error('Get video analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get platform analytics (admin only)
const getPlatformAnalytics = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { period = '30d' } = req.query;
    let daysBack = 30;
    if (period === '7d') daysBack = 7;
    if (period === '1d') daysBack = 1;
    if (period === '90d') daysBack = 90;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const [
      totalUsers,
      activeUsers,
      totalVideos,
      totalViews,
      newUsers,
      topChannels,
      recentActivity
    ] = await Promise.all([
      // Total users
      prisma.user.count({
        where: { isActive: true }
      }),
      // Active users (users who uploaded or watched recently)
      prisma.user.count({
        where: {
          isActive: true,
          OR: [
            {
              videos: {
                some: {
                  createdAt: { gte: startDate }
                }
              }
            },
            {
              watchHistory: {
                some: {
                  watchedAt: { gte: startDate }
                }
              }
            }
          ]
        }
      }),
      // Total videos
      prisma.video.count({
        where: { status: 'published' }
      }),
      // Total views
      prisma.video.aggregate({
        where: { status: 'published' },
        _sum: { views: true }
      }),
      // New users
      prisma.user.count({
        where: {
          isActive: true,
          createdAt: { gte: startDate }
        }
      }),
      // Top channels
      prisma.user.findMany({
        where: { isActive: true },
        orderBy: { subscribers: 'desc' },
        take: 10,
        select: {
          id: true,
          username: true,
          channelName: true,
          avatar: true,
          subscribers: true,
          videoCount: true,
          totalViews: true
        }
      }),
      // Recent activity
      prisma.video.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        include: {
          user: {
            select: {
              username: true,
              channelName: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ]);

    const analytics = {
      overview: {
        totalUsers,
        activeUsers,
        totalVideos,
        totalViews: totalViews._sum.views || 0,
        newUsers,
        userGrowthRate: totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(2) : 0
      },
      topChannels,
      recentActivity,
      period
    };

    res.json({ analytics });
  } catch (error) {
    console.error('Get platform analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to parse duration string to seconds
function parseDuration(duration) {
  const parts = duration.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  } else if (parts.length === 3) {
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }
  return 0;
}

module.exports = {
  getChannelAnalytics,
  getVideoAnalytics,
  getPlatformAnalytics
};
