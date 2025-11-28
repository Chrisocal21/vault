// Cloudflare Workers Functions for OC Vault (Simplified - No D1 Required)
// Uses KV or in-memory storage for testing

/**
 * API Router
 */
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Route API requests
    if (path.startsWith('/api/auth')) {
      return handleAuth(request, env, corsHeaders);
    } else if (path.startsWith('/api/files')) {
      return handleFiles(request, env, corsHeaders);
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Authentication Handlers (Simplified)
 */
async function handleAuth(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  // POST /api/auth/login
  if (path === '/api/auth/login' && request.method === 'POST') {
    const { username, password } = await request.json();
    
    // Get credentials from environment variables or use defaults
    const adminUsername = env.ADMIN_USERNAME || 'admin';
    const adminPassword = env.ADMIN_PASSWORD || '321password123';
    
    // Simple auth check
    if (username === adminUsername && password === adminPassword) {
      const user = {
        id: 1,
        username: adminUsername,
        email: `${adminUsername}@ocvault.com`,
        role: 'admin',
        storage_quota: 53687091200,
        storage_used: 0,
      };

      let token;
      
      // Store session in KV if available
      if (env.VAULT_KV) {
        token = crypto.randomUUID();
        await env.VAULT_KV.put(`session:${token}`, JSON.stringify(user), {
          expirationTtl: 604800, // 7 days
        });
      } else {
        // Use mock token when KV not available
        token = `mock_token_${crypto.randomUUID()}`;
      }

      return jsonResponse({
        token,
        user,
      }, 200, corsHeaders);
    }

    return jsonResponse({ error: 'Invalid credentials' }, 401, corsHeaders);
  }

  // POST /api/auth/logout
  if (path === '/api/auth/logout' && request.method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (token && env.VAULT_KV) {
      await env.VAULT_KV.delete(`session:${token}`);
    }

    return jsonResponse({ message: 'Logged out successfully' }, 200, corsHeaders);
  }

  // GET /api/auth/me
  if (path === '/api/auth/me' && request.method === 'GET') {
    const user = await authenticateRequest(request, env);
    
    if (!user) {
      return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders);
    }

    return jsonResponse({ user }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
}

/**
 * File Handlers (Simplified with KV)
 */
async function handleFiles(request, env, corsHeaders) {
  const user = await authenticateRequest(request, env);
  
  if (!user) {
    return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders);
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // GET /api/files - List user's files
  if (path === '/api/files' && request.method === 'GET') {
    let files = [];
    
    if (env.VAULT_KV) {
      const filesData = await env.VAULT_KV.get(`files:${user.id}`);
      files = filesData ? JSON.parse(filesData) : [];
    }

    return jsonResponse({ files }, 200, corsHeaders);
  }

  // POST /api/files - Upload file metadata
  if (path === '/api/files' && request.method === 'POST') {
    const fileData = await request.json();
    
    let files = [];
    if (env.VAULT_KV) {
      const filesData = await env.VAULT_KV.get(`files:${user.id}`);
      files = filesData ? JSON.parse(filesData) : [];
    }

    const newFile = {
      id: crypto.randomUUID(),
      userId: user.id,
      name: fileData.name,
      size: fileData.size,
      originalSize: fileData.originalSize,
      type: fileData.type,
      compressed: fileData.compressed,
      date: new Date().toISOString(),
      favorite: false,
    };

    files.push(newFile);

    if (env.VAULT_KV) {
      await env.VAULT_KV.put(`files:${user.id}`, JSON.stringify(files));
    }

    return jsonResponse({ 
      fileId: newFile.id, 
      message: 'File uploaded successfully' 
    }, 201, corsHeaders);
  }

  // DELETE /api/files/:id
  if (path.match(/\/api\/files\/[^/]+$/) && request.method === 'DELETE') {
    const fileId = path.split('/').pop();
    
    let files = [];
    if (env.VAULT_KV) {
      const filesData = await env.VAULT_KV.get(`files:${user.id}`);
      files = filesData ? JSON.parse(filesData) : [];
    }

    const fileToDelete = files.find(f => f.id === fileId);
    if (!fileToDelete) {
      return jsonResponse({ error: 'File not found' }, 404, corsHeaders);
    }

    files = files.filter(f => f.id !== fileId);

    if (env.VAULT_KV) {
      await env.VAULT_KV.put(`files:${user.id}`, JSON.stringify(files));
    }

    return jsonResponse({ message: 'File deleted successfully' }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
}

/**
 * Helper Functions
 */
async function authenticateRequest(request, env) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) return null;

  // Try to get session from KV
  if (env.VAULT_KV) {
    const userData = await env.VAULT_KV.get(`session:${token}`);
    if (userData) {
      return JSON.parse(userData);
    }
  }

  // Fallback for mock tokens
  if (token.startsWith('mock_token_')) {
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

function jsonResponse(data, status = 200, corsHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}
