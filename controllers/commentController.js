const prisma = require('../config/database');

// Validation schemas
const createCommentSchema = Joi.object({
  text: Joi.string().required().min(1).max(1000),
  parentId: Joi.string().optional()
});

const updateCommentSchema = Joi.object({
  text: Joi.string().required().min(1).max(1000)
});

// Create comment
const createComment = async (req, res) => {
  try {
    const { error } = createCommentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { videoId } = req.params;
    const { text, parentId } = req.body;

    // Check if video exists
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      });

      if (!parentComment || parentComment.videoId !== videoId) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        userId: req.userId,
        videoId,
        parentId
      },
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
      }
    });

    // Update video comment count
    await prisma.video.update({
      where: { id: videoId },
      data: { comments: { increment: 1 } }
    });

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get comments for a video
const getComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const skip = (page - 1) * limit;

    // Check if video exists
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const where = {
      videoId,
      parentId: null // Only get top-level comments
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
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
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.comment.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      comments,
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
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update comment
const updateComment = async (req, res) => {
  try {
    const { error } = updateCommentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const { text } = req.body;

    // Check if comment exists and user owns it
    const existingComment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (existingComment.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { text },
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
      }
    });

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if comment exists and user owns it
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      include: {
        video: true
      }
    });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Allow deletion if user owns comment or video
    if (existingComment.userId !== req.userId && existingComment.video.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.comment.delete({
      where: { id }
    });

    // Update video comment count
    await prisma.video.update({
      where: { id: existingComment.videoId },
      data: { comments: { decrement: 1 } }
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Like comment
const likeComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { likes: { increment: 1 } }
    });

    res.json({
      message: 'Comment liked successfully',
      likes: updatedComment.likes
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment
};
