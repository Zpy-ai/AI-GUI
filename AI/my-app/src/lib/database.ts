import mysql from 'mysql';

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'aiweb_database',
  port: parseInt(process.env.DB_PORT || '3306'),
  charset: 'utf8mb4',
  timezone: 'local'
};

// 创建数据库连接池
const pool = mysql.createPool({
  ...dbConfig,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
});

// 数据库查询工具函数
export const query = (sql: string, params?: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(sql, params, (error, results) => {
        connection.release();
        
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  });
};

// 初始化数据库表
export const initDatabase = async (): Promise<void> => {
  try {
    // 创建对话表
    await query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL DEFAULT '',
        model VARCHAR(50) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 创建消息表
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(36) PRIMARY KEY,
        conversation_id VARCHAR(36) NOT NULL,
        content TEXT NOT NULL,
        role ENUM('user', 'assistant') NOT NULL,
        model VARCHAR(50),
        provider VARCHAR(50),
        usage_prompt_tokens INT DEFAULT 0,
        usage_completion_tokens INT DEFAULT 0,
        usage_total_tokens INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_conversation_id (conversation_id),
        INDEX idx_created_at (created_at),
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('数据库表初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
};

// 关闭数据库连接
export const closeDatabase = (): Promise<void> => {
  return new Promise((resolve) => {
    pool.end((err) => {
      if (err) {
        console.error('关闭数据库连接时出错:', err);
      }
      resolve();
    });
  });
};

export default pool;