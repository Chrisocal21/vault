// Vercel Serverless Function - Delete specific file
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
  global.userFiles = global.userFiles || new Map();
  const userId = user.id.toString();
  
  let files = global.userFiles.get(userId) || [];
  const fileToDelete = files.find(f => f.id === id);
  
  if (!fileToDelete) {
    return res.status(404).json({ error: 'File not found' });
  }

  files = files.filter(f => f.id !== id);
  global.userFiles.set(userId, files);

  return res.status(200).json({ message: 'File deleted successfully' });
}
