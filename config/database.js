const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client with fallback
const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:rFGqmfUlVUcBHwqXviwmqhRazfdNjAXX@mysql.railway.internal:3306/railway';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

// Log the actual DATABASE_URL being used
console.log('🔗 DATABASE_URL:', DATABASE_URL);

module.exports = prisma;
