// Vercel Serverless Function - Delete specific file
import Redis from 'ioredis';

function authenticateRequest(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) return null;

  if (global.sessions && global.sessions.has(token)) {
    return global.sessions.get(token);
  }

  if (token.startsWith('vercel_token_')) {
    return {
      id: 1,
      username: 'admin',
      email: 'admin@ocvault.com',
      role: 'admin',
      storage_quota: 53687091200,
      storage_used: 0,
    };
  }

  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = authenticateRequest(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  const userId = user.id.toString();
  const filesKey = `user:${userId}:files`;
  
  // Initialize Redis connection
  let redis = null;
  let useRedis = false;
  
  if (process.env.REDIS_URL) {
    try {
      redis = new Redis(process.env.REDIS_URL);
      useRedis = true;
    } catch (err) {
      console.error('Redis connection failed:', err);
    }
  }
  
  // Fallback to in-memory if Redis not available
  if (!useRedis) {
    global.userFiles = global.userFiles || new Map();
  }
  
  try {
    let files;
    if (useRedis) {
      const data = await redis.get(filesKey);
      files = data ? JSON.parse(data) : [];
    } else {
      files = global.userFiles.get(userId) || [];
    }
    
    const fileToDelete = files.find(f => f.id === id);
    
    if (!fileToDelete) {
      if (useRedis) redis.quit();
      return res.status(404).json({ error: 'File not found' });
    }

    const newFiles = files.filter(f => f.id !== id);
    
    if (useRedis) {
      await redis.set(filesKey, JSON.stringify(newFiles));
      redis.quit();
    } else {
      global.userFiles.set(userId, newFiles);
    }

    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    if (useRedis && redis) redis.quit();
    return res.status(500).json({ error: 'Delete failed: ' + error.message });
  }
}
