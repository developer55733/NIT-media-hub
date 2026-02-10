const prisma = require('../config/database');

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const unreadOnly = req.query.unreadOnly === 'true';

    const where = {
      userId: req.userId
    };

    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          actor: {
            select: {
              id: true,
              username: true,
              channelName: true,
              avatar: true
            }
          },
          video: {
            select: {
              id: true,
              title: true,
              thumbnail: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.notification.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      unreadCount: unreadOnly ? total : await prisma.notification.count({
        where: {
          userId: req.userId,
          isRead: false
        }
      })
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    res.json({
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.userId,
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.notification.delete({
      where: { id }
    });

    res.json({
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get unread notification count
const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId: req.userId,
        isRead: false
      }
    });

    res.json({
      unreadCount: count
    });
  } catch (error) {
    console.error('Get unread notification count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create notification (helper function)
const createNotification = async (userId, type, title, message, actorId, videoId, commentId) => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        actorId,
        videoId,
        commentId
      }
    });
  } catch (error) {
    console.error('Create notification error:', error);
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  createNotification
};
