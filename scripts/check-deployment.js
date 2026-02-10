#!/usr/bin/env node

// Railway Deployment Check Script
// Verifies all components are ready for Railway deployment

const fs = require('fs');
const path = require('path');

console.log('🚀 Media Hub - Railway Deployment Check\n');

// Check required files
const requiredFiles = [
  'server.js',
  'package.json',
  'railway.toml',
  'Procfile',
  'prisma/schema.prisma',
  '.env.example',
  'database/schema.sql',
  'database/seed.sql',
  'database/config.js',
  'server-mysql.js'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check controllers
const controllerFiles = [
  'controllers/authController.js',
  'controllers/videoController.js',
  'controllers/commentController.js',
  'controllers/likeController.js',
  'controllers/userController.js',
  'controllers/playlistController.js',
  'controllers/notificationController.js',
  'controllers/analyticsController.js',
  'controllers/searchController.js'
];

console.log('\n🎮 Checking controllers...');
controllerFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check routes
const routeFiles = [
  'routes/auth.js',
  'routes/videos.js',
  'routes/comments.js',
  'routes/likes.js',
  'routes/users.js',
  'routes/playlists.js',
  'routes/notifications.js',
  'routes/analytics.js',
  'routes/search.js'
];

console.log('\n🛣️  Checking routes...');
routeFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check frontend files
const frontendFiles = [
  'index.html',
  'script.js',
  'js/api.js',
  'style.css'
];

console.log('\n🎨 Checking frontend files...');
frontendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check package.json dependencies
console.log('\n📦 Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredDeps = [
    'express',
    '@prisma/client',
    'prisma',
    'mysql2',
    'bcryptjs',
    'jsonwebtoken',
    'joi',
    'cors',
    'helmet',
    'express-rate-limit',
    'multer',
    'cloudinary',
    'dotenv'
  ];

  let allDepsPresent = true;
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}@${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allDepsPresent = false;
    }
  });

  // Check scripts
  const requiredScripts = [
    'start',
    'dev',
    'db:generate',
    'db:push',
    'db:migrate',
    'db:seed',
    'start:mysql',
    'dev:mysql'
  ];

  console.log('\n🔧 Checking npm scripts...');
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ ${script}`);
    } else {
      console.log(`❌ ${script} - MISSING`);
      allDepsPresent = false;
    }
  });

} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
  allFilesExist = false;
}

// Check Railway configuration
console.log('\n🚂 Checking Railway configuration...');
try {
  const railwayToml = fs.readFileSync('railway.toml', 'utf8');
  if (railwayToml.includes('NIXPACKS') && railwayToml.includes('startCommand')) {
    console.log('✅ railway.toml - Configured for Railway');
  } else {
    console.log('❌ railway.toml - Missing Railway configuration');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ Error reading railway.toml:', error.message);
  allFilesExist = false;
}

try {
  const procfile = fs.readFileSync('Procfile', 'utf8');
  if (procfile.includes('npm start')) {
    console.log('✅ Procfile - Configured for Railway');
  } else {
    console.log('❌ Procfile - Missing Railway configuration');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ Error reading Procfile:', error.message);
  allFilesExist = false;
}

// Check environment template
console.log('\n🔐 Checking environment configuration...');
try {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'PORT',
    'NODE_ENV',
    'CORS_ORIGIN'
  ];

  let allEnvVarsPresent = true;
  requiredEnvVars.forEach(envVar => {
    if (envExample.includes(envVar)) {
      console.log(`✅ ${envVar}`);
    } else {
      console.log(`❌ ${envVar} - MISSING`);
      allEnvVarsPresent = false;
    }
  });

} catch (error) {
  console.log('❌ Error reading .env.example:', error.message);
  allFilesExist = false;
}

// Check API service
console.log('\n🔌 Checking API service...');
try {
  const apiService = fs.readFileSync('js/api.js', 'utf8');
  
  const requiredMethods = [
    'getVideos',
    'getVideoById',
    'createVideo',
    'createPlaylist',
    'getNotifications',
    'globalSearch',
    'getChannelAnalytics'
  ];

  let allMethodsPresent = true;
  requiredMethods.forEach(method => {
    if (apiService.includes(method)) {
      console.log(`✅ ${method}`);
    } else {
      console.log(`❌ ${method} - MISSING`);
      allMethodsPresent = false;
    }
  });

} catch (error) {
  console.log('❌ Error reading js/api.js:', error.message);
  allFilesExist = false;
}

// Database check
console.log('\n🗄️ Checking database files...');
const dbFiles = [
  'prisma/schema.prisma',
  'database/schema.sql',
  'database/seed.sql',
  'database/config.js'
];

dbFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Final assessment
console.log('\n' + '='.repeat(50));
console.log('📊 DEPLOYMENT READINESS ASSESSMENT');
console.log('='.repeat(50));

if (allFilesExist) {
  console.log('🎉 SUCCESS: All components are ready for Railway deployment!');
  console.log('\n📋 Next Steps:');
  console.log('1. Push code to GitHub repository');
  console.log('2. Connect repository to Railway');
  console.log('3. Configure environment variables in Railway dashboard');
  console.log('4. Deploy! 🚀');
  
  console.log('\n🔧 Railway Environment Variables Needed:');
  console.log('- DATABASE_URL (PostgreSQL or MySQL)');
  console.log('- JWT_SECRET (secure random string)');
  console.log('- NODE_ENV=production');
  console.log('- CORS_ORIGIN=https://your-app.railway.app');
  
  console.log('\n🚀 Deployment Commands:');
  console.log('git add .');
  console.log('git commit -m "Ready for Railway deployment"');
  console.log('git push origin main');
  
} else {
  console.log('❌ FAILURE: Missing components detected');
  console.log('\n🔧 Please fix the missing files before deployment');
  
  console.log('\n📋 Required Actions:');
  console.log('1. Fix missing files marked with ❌');
  console.log('2. Run: npm install');
  console.log('3. Test locally: npm run dev');
  console.log('4. Re-run this check script');
}

console.log('\n' + '='.repeat(50));
console.log('✅ Media Hub Deployment Check Complete');
console.log('='.repeat(50));
