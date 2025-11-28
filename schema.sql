-- OC Vault Database Schema for Cloudflare D1

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    storage_quota INTEGER DEFAULT 5368709120, -- 5GB in bytes
    storage_used INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_login TEXT
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY, -- UUID
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    size INTEGER NOT NULL,
    original_size INTEGER NOT NULL,
    type TEXT NOT NULL,
    path TEXT NOT NULL, -- R2 path
    thumbnail_path TEXT,
    compressed INTEGER DEFAULT 0,
    favorite INTEGER DEFAULT 0,
    folder_path TEXT,
    is_deleted INTEGER DEFAULT 0,
    deleted_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Shared links table
CREATE TABLE IF NOT EXISTS shared_links (
    id TEXT PRIMARY KEY, -- UUID
    file_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    share_token TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    expires_at TEXT,
    max_downloads INTEGER,
    download_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL, -- upload, download, delete, share, etc.
    file_id TEXT,
    details TEXT, -- JSON string with additional info
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY, -- UUID
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);
CREATE INDEX IF NOT EXISTS idx_files_is_deleted ON files(is_deleted);
CREATE INDEX IF NOT EXISTS idx_files_favorite ON files(favorite);
CREATE INDEX IF NOT EXISTS idx_shared_links_token ON shared_links(share_token);
CREATE INDEX IF NOT EXISTS idx_shared_links_expires ON shared_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert default admin user (password: 321password123)
-- Password hash using bcrypt format (you'll need to generate this properly in production)
INSERT OR IGNORE INTO users (id, username, email, password_hash, role, storage_quota) 
VALUES (1, 'admin', 'admin@ocvault.com', '$2a$10$placeholder_hash_replace_in_production', 'admin', 53687091200); -- 50GB for admin
