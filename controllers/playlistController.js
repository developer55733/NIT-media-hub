const prisma = require('../config/database');
const Joi = require('joi');

// Validation schemas
const createPlaylistSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  description: Joi.string().optional().max(500),
  isPublic: Joi.boolean().default(false)
});

const addVideoToPlaylistSchema = Joi.object({
  videoIds: Joi.array().items(Joi.string()).required().min(1)
});

// Create playlist
const createPlaylist = async (req, res) => {
  try {
    const { error } = createPlaylistSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, isPublic } = req.body;

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        isPublic,
        userId: req.userId
      },
      include: {
        videos: {
          include: {
            video: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    channelName: true,
                    avatar: true
                  }
                }
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Playlist created successfully',
      playlist
    });
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user playlists
const getUserPlaylists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [playlists, total] = await Promise.all([
      prisma.playlist.findMany({
        where: {
          userId: req.userId
        },
        include: {
          videos: {
            include: {
              video: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      channelName: true,
                      avatar: true
                    }
                  }
                }
              }
            },
            orderBy: {
              position: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.playlist.count({
        where: {
          userId: req.userId
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      playlists,
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
    console.error('Get user playlists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get public playlists
const getPublicPlaylists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [playlists, total] = await Promise.all([
      prisma.playlist.findMany({
        where: {
          isPublic: true
        },
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
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      channelName: true,
                      avatar: true
                    }
                  }
                }
              }
            },
            orderBy: {
              position: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.playlist.count({
        where: {
          isPublic: true
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      playlists,
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
    console.error('Get public playlists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get playlist by ID
const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;

    const playlist = await prisma.playlist.findUnique({
      where: { id },
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
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    channelName: true,
                    avatar: true
                  }
                }
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if user has access to this playlist
    if (!playlist.isPublic && playlist.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ playlist });
  } catch (error) {
    console.error('Get playlist by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add videos to playlist
const addVideosToPlaylist = async (req, res) => {
  try {
    const { error } = addVideoToPlaylistSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const { videoIds } = req.body;

    // Check if playlist exists and user owns it
    const playlist = await prisma.playlist.findUnique({
      where: { id }
    });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get current max position
    const maxPosition = await prisma.playlistVideo.aggregate({
      where: { playlistId: id },
      _max: { position: true }
    });

    const nextPosition = (maxPosition._max.position || 0) + 1;

    // Add videos to playlist
    const playlistVideos = videoIds.map((videoId, index) => ({
      playlistId: id,
      videoId,
      position: nextPosition + index
    }));

    await prisma.playlistVideo.createMany({
      data: playlistVideos,
      skipDuplicates: true
    });

    // Update playlist video count
    await prisma.playlist.update({
      where: { id },
      data: {
        videoCount: {
          increment: videoIds.length
        }
      }
    });

    res.json({
      message: 'Videos added to playlist successfully',
      addedCount: videoIds.length
    });
  } catch (error) {
    console.error('Add videos to playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove video from playlist
const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    // Check if playlist exists and user owns it
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId }
    });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Remove video from playlist
    await prisma.playlistVideo.deleteMany({
      where: {
        playlistId,
        videoId
      }
    });

    // Update playlist video count
    await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        videoCount: {
          decrement: 1
        }
      }
    });

    res.json({
      message: 'Video removed from playlist successfully'
    });
  } catch (error) {
    console.error('Remove video from playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update playlist
const updatePlaylist = async (req, res) => {
  try {
    const { error } = createPlaylistSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const { name, description, isPublic } = req.body;

    // Check if playlist exists and user owns it
    const playlist = await prisma.playlist.findUnique({
      where: { id }
    });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedPlaylist = await prisma.playlist.update({
      where: { id },
      data: {
        name,
        description,
        isPublic
      },
      include: {
        videos: {
          include: {
            video: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    channelName: true,
                    avatar: true
                  }
                }
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    res.json({
      message: 'Playlist updated successfully',
      playlist: updatedPlaylist
    });
  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete playlist
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if playlist exists and user owns it
    const playlist = await prisma.playlist.findUnique({
      where: { id }
    });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.playlist.delete({
      where: { id }
    });

    res.json({
      message: 'Playlist deleted successfully'
    });
  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reorder playlist videos
const reorderPlaylistVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoIds } = req.body;

    if (!Array.isArray(videoIds)) {
      return res.status(400).json({ error: 'videoIds must be an array' });
    }

    // Check if playlist exists and user owns it
    const playlist = await prisma.playlist.findUnique({
      where: { id }
    });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update positions
    const updates = videoIds.map((videoId, index) => 
      prisma.playlistVideo.updateMany({
        where: {
          playlistId: id,
          videoId
        },
        data: {
          position: index + 1
        }
      })
    );

    await Promise.all(updates);

    res.json({
      message: 'Playlist reordered successfully'
    });
  } catch (error) {
    console.error('Reorder playlist videos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createPlaylist,
  getUserPlaylists,
  getPublicPlaylists,
  getPlaylistById,
  addVideosToPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist,
  reorderPlaylistVideos
};
