const prisma = require('../config/database');
const Joi = require('joi');

// Validation schema
const toggleLikeSchema = Joi.object({
  type: Joi.string().valid('like', 'dislike').required()
});

// Toggle like/dislike on video
const toggleVideoLike = async (req, res) => {
  try {
    const { error } = toggleLikeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { videoId } = req.params;
    const { type } = req.body;

    // Check if video exists
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Check if user already liked/disliked this video
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_videoId: {
          userId: req.userId,
          videoId
        }
      }
    });

    let updateData = {};
    let message = '';

    if (existingLike) {
      if (existingLike.type === type) {
        // Remove the like/dislike
        await prisma.like.delete({
          where: {
            userId_videoId: {
              userId: req.userId,
              videoId
            }
          }
        });

        if (type === 'like') {
          updateData = { likes: { decrement: 1 } };
          message = 'Like removed successfully';
        } else {
          updateData = { dislikes: { decrement: 1 } };
          message = 'Dislike removed successfully';
        }
      } else {
        // Change from like to dislike or vice versa
        await prisma.like.update({
          where: {
            userId_videoId: {
              userId: req.userId,
              videoId
            }
          },
          data: { type }
        });

        if (type === 'like') {
          updateData = { likes: { increment: 1 }, dislikes: { decrement: 1 } };
          message = 'Changed to like successfully';
        } else {
          updateData = { likes: { decrement: 1 }, dislikes: { increment: 1 } };
          message = 'Changed to dislike successfully';
        }
      }
    } else {
      // Add new like/dislike
      await prisma.like.create({
        data: {
          type,
          userId: req.userId,
          videoId
        }
      });

      if (type === 'like') {
        updateData = { likes: { increment: 1 } };
        message = 'Video liked successfully';
      } else {
        updateData = { dislikes: { increment: 1 } };
        message = 'Video disliked successfully';
      }
    }

    // Update video counts
    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: updateData,
      select: {
        likes: true,
        dislikes: true
      }
    });

    res.json({
      message,
      likes: updatedVideo.likes,
      dislikes: updatedVideo.dislikes
    });
  } catch (error) {
    console.error('Toggle video like error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's like status for a video
const getVideoLikeStatus = async (req, res) => {
  try {
    const { videoId } = req.params;

    const like = await prisma.like.findUnique({
      where: {
        userId_videoId: {
          userId: req.userId,
          videoId
        }
      }
    });

    res.json({
      liked: like ? like.type === 'like' : false,
      disliked: like ? like.type === 'dislike' : false
    });
  } catch (error) {
    console.error('Get video like status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get video likes and dislikes count
const getVideoLikes = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: {
        likes: true,
        dislikes: true
      }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      likes: video.likes,
      dislikes: video.dislikes
    });
  } catch (error) {
    console.error('Get video likes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  toggleVideoLike,
  getVideoLikeStatus,
  getVideoLikes
};
