// MySQL Database Configuration
// Configuration for connecting to MySQL database

const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'media_hub',
  charset: 'utf8mb4',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT) || 60000,
  timeout: parseInt(process.env.DB_TIMEOUT) || 60000,
  reconnect: true,
  multipleStatements: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    console.log(`📊 Connected to database: ${dbConfig.database}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    return false;
  }
}

// Execute query with error handling
async function executeQuery(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('❌ Query execution failed:', error.message);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

// Execute transaction
async function executeTransaction(queries) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { sql, params } of queries) {
      const [rows] = await connection.execute(sql, params);
      results.push(rows);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    console.error('❌ Transaction failed:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Get database statistics
async function getDatabaseStats() {
  try {
    const stats = await executeQuery(`
      SELECT 
        'users' as table_name,
        COUNT(*) as record_count
      FROM users
      UNION ALL
      SELECT 
        'videos' as table_name,
        COUNT(*) as record_count
      FROM videos
      UNION ALL
      SELECT 
        'comments' as table_name,
        COUNT(*) as record_count
      FROM comments
      UNION ALL
      SELECT 
        'likes' as table_name,
        COUNT(*) as record_count
      FROM likes
      UNION ALL
      SELECT 
        'subscriptions' as table_name,
        COUNT(*) as record_count
      FROM subscriptions
    `);
    
    return stats;
  } catch (error) {
    console.error('❌ Failed to get database stats:', error.message);
    throw error;
  }
}

// Close all connections
async function closePool() {
  try {
    await pool.end();
    console.log('🔌 MySQL connection pool closed');
  } catch (error) {
    console.error('❌ Error closing connection pool:', error.message);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('📡 Received SIGINT, closing database connections...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('📡 Received SIGTERM, closing database connections...');
  await closePool();
  process.exit(0);
});

module.exports = {
  pool,
  executeQuery,
  executeTransaction,
  testConnection,
  getDatabaseStats,
  closePool,
  config: dbConfig
};
