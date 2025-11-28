// Vercel Serverless Function - Get/Upload/Delete Files
function authenticateRequest(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) return null;

  // Check in-memory sessions
  if (global.sessions && global.sessions.has(token)) {
    return global.sessions.get(token);
  }

  // Fallback for vercel tokens
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const user = authenticateRequest(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Initialize global storage
  global.userFiles = global.userFiles || new Map();
  const userId = user.id.toString();

  // GET /api/files - List files
  if (req.method === 'GET') {
    const files = global.userFiles.get(userId) || [];
    return res.status(200).json({ files });
  }

  // POST /api/files - Upload file metadata
  if (req.method === 'POST') {
    const fileData = req.body;
    const files = global.userFiles.get(userId) || [];

    const newFile = {
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: user.id,
      name: fileData.name,
      size: fileData.size,
      originalSize: fileData.originalSize,
      type: fileData.type,
      compressed: fileData.compressed,
      compressionRatio: fileData.compressionRatio,
      data: fileData.data,
      thumbnail: fileData.thumbnail,
      date: new Date().toISOString(),
      favorite: false,
    };

    files.push(newFile);
    global.userFiles.set(userId, files);

    return res.status(201).json({
      fileId: newFile.id,
      message: 'File uploaded successfully',
    });
  }

  // DELETE /api/files/:id
  if (req.method === 'DELETE') {
    const fileId = req.url.split('/').pop();
    let files = global.userFiles.get(userId) || [];
    
    const fileToDelete = files.find(f => f.id === fileId);
    if (!fileToDelete) {
      return res.status(404).json({ error: 'File not found' });
    }

    files = files.filter(f => f.id !== fileId);
    global.userFiles.set(userId, files);

    return res.status(200).json({ message: 'File deleted successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
