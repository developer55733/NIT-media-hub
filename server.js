const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|wmv|flv|webm|mp3|wav|ogg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, videos, and audio files are allowed.'));
        }
    }
});

// Mock data (in real app, this would come from database)
let allVideos = [
    {
        id: 1,
        title: "Amazing Nature Documentary - 4K Ultra HD",
        description: "Experience the breathtaking beauty of nature in stunning 4K resolution.",
        category: "movies",
        thumbnail: "https://picsum.photos/seed/nature1/400/225.jpg",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        duration: "12:34",
        views: 1542000,
        likes: 45600,
        dislikes: 234,
        comments: [
            { id: 1, user: "NatureLover", text: "Absolutely stunning! The cinematography is incredible.", date: "2024-01-15", likes: 45 },
            { id: 2, user: "WildlifeFan", text: "This reminds me of my trip to Yellowstone!", date: "2024-01-16", likes: 23 }
        ],
        channel: {
            name: "Nature Channel",
            avatar: "https://picsum.photos/seed/nature/50/50.jpg",
            subscribers: 1250000
        },
        uploadDate: "2024-01-10",
        tags: ["nature", "documentary", "4k", "wildlife"],
        visibility: "public"
    },
    {
        id: 2,
        title: "Learn JavaScript - Complete Course for Beginners",
        description: "Start your web development journey with this comprehensive JavaScript course.",
        category: "courses",
        thumbnail: "https://picsum.photos/seed/js-course/400/225.jpg",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        duration: "45:20",
        views: 893000,
        likes: 23400,
        dislikes: 123,
        comments: [
            { id: 3, user: "CodeNewbie", text: "Best JavaScript tutorial I've found!", date: "2024-01-14", likes: 67 }
        ],
        channel: {
            name: "Code Academy",
            avatar: "https://picsum.photos/seed/code/50/50.jpg",
            subscribers: 890000
        },
        uploadDate: "2024-01-08",
        tags: ["javascript", "programming", "tutorial", "web development"],
        visibility: "public"
    },
    {
        id: 3,
        title: "Epic Gaming Moments 2024 Compilation",
        description: "The most epic gaming moments of 2024! Watch incredible plays, funny fails, and amazing skills.",
        category: "gaming",
        thumbnail: "https://picsum.photos/seed/gaming1/400/225.jpg",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
        duration: "18:45",
        views: 2345000,
        likes: 89000,
        dislikes: 456,
        comments: [
            { id: 4, user: "GamerPro", text: "That last clip was insane! 🔥", date: "2024-01-13", likes: 89 },
            { id: 5, user: "CasualPlayer", text: "Love these compilations! Keep them coming!", date: "2024-01-14", likes: 34 }
        ],
        channel: {
            name: "Gaming Central",
            avatar: "https://picsum.photos/seed/gaming/50/50.jpg",
            subscribers: 2100000
        },
        uploadDate: "2024-01-12",
        tags: ["gaming", "compilation", "epic moments", "2024"],
        visibility: "public"
    }
];

let allUsers = [
    { id: 1, name: "Nature Channel", email: "nature@mediahub.com", role: "creator", subscribers: 1250000 },
    { id: 2, name: "Code Academy", email: "code@mediahub.com", role: "creator", subscribers: 890000 },
    { id: 3, name: "Gaming Central", email: "gaming@mediahub.com", role: "creator", subscribers: 2100000 },
    { id: 4, name: "Admin User", email: "admin@mediahub.com", role: "admin", subscribers: 0 }
];

// API Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all videos
app.get('/api/videos', (req, res) => {
    const { category, search, sort, limit = 20, offset = 0 } = req.query;
    let filtered = allVideos;
    
    // Filter by category
    if (category) {
        filtered = filtered.filter(video => video.category === category);
    }
    
    // Filter by search
    if (search) {
        filtered = filtered.filter(video => 
            video.title.toLowerCase().includes(search.toLowerCase()) ||
            video.description.toLowerCase().includes(search.toLowerCase()) ||
            video.channel.name.toLowerCase().includes(search.toLowerCase()) ||
            video.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );
    }
    
    // Sort videos
    if (sort) {
        switch(sort) {
            case 'views':
                filtered.sort((a, b) => b.views - a.views);
                break;
            case 'likes':
                filtered.sort((a, b) => b.likes - a.likes);
                break;
            case 'date':
                filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                break;
            case 'trending':
                filtered.sort((a, b) => (b.views + b.likes) - (a.views + a.likes));
                break;
        }
    }
    
    // Pagination
    const paginated = filtered.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
        success: true,
        data: paginated,
        total: filtered.length,
        hasMore: parseInt(offset) + parseInt(limit) < filtered.length
    });
});

// Get single video
app.get('/api/videos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const video = allVideos.find(v => v.id === id);
    
    if (!video) {
        return res.status(404).json({
            success: false,
            error: 'Video not found'
        });
    }
    
    // Increment view count
    video.views++;
    
    res.json({
        success: true,
        data: video
    });
});

// Upload video
app.post('/api/videos/upload', upload.single('video'), (req, res) => {
    try {
        const { title, description, category, visibility, tags } = req.body;
        
        if (!title || !category) {
            return res.status(400).json({
                success: false,
                error: 'Title and category are required'
            });
        }
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Video file is required'
            });
        }
        
        const newVideo = {
            id: Date.now(),
            title,
            description: description || '',
            category,
            visibility: visibility || 'public',
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            videoUrl: `/uploads/${req.file.filename}`,
            thumbnail: `/uploads/thumbnail-${req.file.filename}`, // Would be generated in real app
            duration: '00:00', // Would be extracted in real app
            views: 0,
            likes: 0,
            dislikes: 0,
            comments: [],
            channel: {
                name: "Current User", // Would come from authentication
                avatar: "https://picsum.photos/seed/user/50/50.jpg",
                subscribers: 0
            },
            uploadDate: new Date().toISOString().split('T')[0]
        };
        
        allVideos.unshift(newVideo);
        
        res.json({
            success: true,
            message: 'Video uploaded successfully',
            data: newVideo
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Upload failed'
        });
    }
});

// Like video
app.post('/api/videos/:id/like', (req, res) => {
    const id = parseInt(req.params.id);
    const video = allVideos.find(v => v.id === id);
    
    if (!video) {
        return res.status(404).json({
            success: false,
            error: 'Video not found'
        });
    }
    
    video.likes++;
    
    res.json({
        success: true,
        message: 'Video liked',
        data: {
            likes: video.likes,
            dislikes: video.dislikes
        }
    });
});

// Dislike video
app.post('/api/videos/:id/dislike', (req, res) => {
    const id = parseInt(req.params.id);
    const video = allVideos.find(v => v.id === id);
    
    if (!video) {
        return res.status(404).json({
            success: false,
            error: 'Video not found'
        });
    }
    
    video.dislikes++;
    
    res.json({
        success: true,
        message: 'Video disliked',
        data: {
            likes: video.likes,
            dislikes: video.dislikes
        }
    });
});

// Add comment
app.post('/api/videos/:id/comments', (req, res) => {
    const id = parseInt(req.params.id);
    const { text, user } = req.body;
    
    if (!text || !user) {
        return res.status(400).json({
            success: false,
            error: 'Comment text and user are required'
        });
    }
    
    const video = allVideos.find(v => v.id === id);
    
    if (!video) {
        return res.status(404).json({
            success: false,
            error: 'Video not found'
        });
    }
    
    const comment = {
        id: Date.now(),
        user,
        text,
        date: new Date().toISOString().split('T')[0],
        likes: 0
    };
    
    video.comments.push(comment);
    
    res.json({
        success: true,
        message: 'Comment added',
        data: comment
    });
});

// Get comments for video
app.get('/api/videos/:id/comments', (req, res) => {
    const id = parseInt(req.params.id);
    const { sort = 'newest' } = req.query;
    
    const video = allVideos.find(v => v.id === id);
    
    if (!video) {
        return res.status(404).json({
            success: false,
            error: 'Video not found'
        });
    }
    
    let comments = [...video.comments];
    
    // Sort comments
    if (sort === 'popular') {
        comments.sort((a, b) => b.likes - a.likes);
    } else {
        comments.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    res.json({
        success: true,
        data: comments
    });
});

// Subscribe to channel
app.post('/api/channels/:name/subscribe', (req, res) => {
    const channelName = req.params.name;
    const { action } = req.body; // 'subscribe' or 'unsubscribe'
    
    const channel = allUsers.find(u => u.name === channelName);
    
    if (!channel) {
        return res.status(404).json({
            success: false,
            error: 'Channel not found'
        });
    }
    
    if (action === 'subscribe') {
        channel.subscribers++;
    } else if (action === 'unsubscribe') {
        channel.subscribers = Math.max(0, channel.subscribers - 1);
    }
    
    res.json({
        success: true,
        message: action === 'subscribe' ? 'Subscribed successfully' : 'Unsubscribed successfully',
        data: {
            subscribers: channel.subscribers
        }
    });
});

// Get categories
app.get('/api/categories', (req, res) => {
    const categories = [
        { id: 'music', name: 'Music', icon: '🎵', count: allVideos.filter(v => v.category === 'music').length },
        { id: 'movies', name: 'Movies', icon: '🎬', count: allVideos.filter(v => v.category === 'movies').length },
        { id: 'courses', name: 'Courses', icon: '🎓', count: allVideos.filter(v => v.category === 'courses').length },
        { id: 'gaming', name: 'Gaming', icon: '🎮', count: allVideos.filter(v => v.category === 'gaming').length },
        { id: 'sports', name: 'Sports', icon: '⚽', count: allVideos.filter(v => v.category === 'sports').length },
        { id: 'news', name: 'News', icon: '📰', count: allVideos.filter(v => v.category === 'news').length }
    ];
    
    res.json({
        success: true,
        data: categories
    });
});

// Admin routes
app.get('/api/admin/stats', (req, res) => {
    const totalViews = allVideos.reduce((sum, video) => sum + video.views, 0);
    const totalLikes = allVideos.reduce((sum, video) => sum + video.likes, 0);
    const totalComments = allVideos.reduce((sum, video) => sum + video.comments.length, 0);
    
    res.json({
        success: true,
        data: {
            totalVideos: allVideos.length,
            totalUsers: allUsers.length,
            totalViews,
            totalLikes,
            totalComments,
            activeUsers: Math.floor(Math.random() * 100) + 50,
            newUsers: Math.floor(Math.random() * 20) + 5,
            pendingVideos: Math.floor(Math.random() * 5),
            reportedVideos: Math.floor(Math.random() * 3)
        }
    });
});

app.get('/api/admin/users', (req, res) => {
    res.json({
        success: true,
        data: allUsers
    });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Media Hub server running on http://localhost:${PORT}`);
    console.log(`📺 Open http://localhost:${PORT} to access the platform`);
    console.log(`🔧 Admin panel: http://localhost:${PORT}/admin`);
});
