// Vercel Serverless Function - Login
// In-memory storage for sessions (resets on cold start)
const sessions = new Map();
const userFiles = new Map();

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Get credentials from environment variables
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || '321password123';

  if (username === adminUsername && password === adminPassword) {
    // Generate token
    const token = `vercel_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const user = {
      id: 1,
      username: adminUsername,
      email: `${adminUsername}@ocvault.com`,
      role: 'admin',
      storage_quota: 53687091200,
      storage_used: 0,
    };

    // Store session in memory
    global.sessions = global.sessions || new Map();
    global.sessions.set(token, user);

    return res.status(200).json({
      token,
      user,
    });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
}
