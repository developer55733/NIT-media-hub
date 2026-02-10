const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mediahub.com' },
    update: {},
    create: {
      email: 'admin@mediahub.com',
      username: 'admin',
      password: adminPassword,
      channelName: 'Media Hub Admin',
      description: 'Official Media Hub administrator',
      isAdmin: true,
      isActive: true
    }
  });

  console.log('✅ Admin user created:', admin.username);

  // Create sample users
  const users = [
    {
      email: 'nature@mediahub.com',
      username: 'naturechannel',
      password: 'password123',
      channelName: 'Nature Channel',
      description: 'Amazing nature documentaries and wildlife content',
      subscribers: 1250000
    },
    {
      email: 'code@mediahub.com',
      username: 'codeacademy',
      password: 'password123',
      channelName: 'Code Academy',
      description: 'Learn programming and web development',
      subscribers: 890000
    },
    {
      email: 'gaming@mediahub.com',
      username: 'gamingcentral',
      password: 'password123',
      channelName: 'Gaming Central',
      description: 'Epic gaming moments and compilations',
      subscribers: 2100000
    }
  ];

  const createdUsers = [];
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
        isActive: true
      }
    });
    createdUsers.push(user);
    console.log('✅ User created:', user.channelName);
  }

  // Create sample videos
  const videos = [
    {
      title: "Amazing Nature Documentary - 4K Ultra HD",
      description: "Experience the breathtaking beauty of nature in stunning 4K resolution.",
      thumbnail: "https://picsum.photos/seed/nature1/400/225.jpg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      duration: "12:34",
      category: "movies",
      tags: ["nature", "documentary", "4k", "wildlife"],
      views: 1542000,
      likes: 45600,
      dislikes: 234,
      userId: createdUsers[0].id
    },
    {
      title: "Learn JavaScript - Complete Course for Beginners",
      description: "Start your web development journey with this comprehensive JavaScript course.",
      thumbnail: "https://picsum.photos/seed/js-course/400/225.jpg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
      duration: "45:20",
      category: "courses",
      tags: ["javascript", "programming", "tutorial", "web development"],
      views: 893000,
      likes: 23400,
      dislikes: 123,
      userId: createdUsers[1].id
    },
    {
      title: "Epic Gaming Moments 2024 Compilation",
      description: "The most epic gaming moments of 2024! Watch incredible plays, funny fails, and amazing skills.",
      thumbnail: "https://picsum.photos/seed/gaming1/400/225.jpg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
      duration: "18:45",
      category: "gaming",
      tags: ["gaming", "compilation", "epic moments", "2024"],
      views: 2345000,
      likes: 89000,
      dislikes: 456,
      userId: createdUsers[2].id
    },
    {
      title: "Relaxing Music for Study and Focus",
      description: "Calm instrumental music perfect for studying, reading, or concentration.",
      thumbnail: "https://picsum.photos/seed/music1/400/225.jpg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_3mb.mp4",
      duration: "1:02:15",
      category: "music",
      tags: ["music", "relaxing", "study", "focus", "instrumental"],
      views: 567000,
      likes: 12300,
      dislikes: 89,
      userId: createdUsers[0].id
    },
    {
      title: "Web Development Full Course - HTML, CSS, JavaScript",
      description: "Complete web development course covering everything from basics to advanced concepts.",
      thumbnail: "https://picsum.photos/seed/webdev/400/225.jpg",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_4mb.mp4",
      duration: "2:15:30",
      category: "courses",
      tags: ["web development", "html", "css", "javascript", "full course"],
      views: 1234000,
      likes: 45600,
      dislikes: 234,
      userId: createdUsers[1].id
    }
  ];

  for (const videoData of videos) {
    const video = await prisma.video.create({
      data: videoData
    });
    console.log('✅ Video created:', video.title);
  }

  // Create sample comments
  const natureVideo = await prisma.video.findFirst({
    where: { title: { contains: "Nature Documentary" } }
  });

  if (natureVideo) {
    const comments = [
      {
        text: "Absolutely stunning! The cinematography is incredible.",
        userId: createdUsers[2].id,
        videoId: natureVideo.id,
        likes: 45
      },
      {
        text: "This reminds me of my trip to Yellowstone!",
        userId: createdUsers[1].id,
        videoId: natureVideo.id,
        likes: 23
      }
    ];

    for (const commentData of comments) {
      const comment = await prisma.comment.create({
        data: commentData
      });
      console.log('✅ Comment created:', comment.text.substring(0, 30) + '...');
    }
  }

  // Create some likes
  const allVideos = await prisma.video.findMany({ take: 3 });
  for (let i = 0; i < allVideos.length; i++) {
    const video = allVideos[i];
    const user = createdUsers[i];
    
    await prisma.like.create({
      data: {
        type: 'like',
        userId: user.id,
        videoId: video.id
      }
    });
    console.log('✅ Like created for video:', video.title.substring(0, 30) + '...');
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
