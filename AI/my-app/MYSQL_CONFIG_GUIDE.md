# MySQL 配置指南

本文档详细说明如何在项目中配置和使用 MySQL 数据库，包含完整的安装流程、配置步骤和命令说明。

# 完整配置流程

## 1. 安装依赖包

### 前置条件：MySQL 服务

确保 MySQL 服务已安装并运行：

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# CentOS/RHEL
sudo yum install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld

# macOS (Homebrew)
brew install mysql
brew services start mysql

# Windows
# 下载 MySQL Installer 从 https://dev.mysql.com/downloads/installer/
# 安装 MySQL Server 并启动服务
```

### 设置 MySQL root 密码

```sql
-- 首次安装后运行
sudo mysql_secure_installation

-- 或者手动设置
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### 安装 Node.js 依赖

```bash
# 安装 MySQL 驱动
npm install mysql
# 或者使用 mysql2（推荐，兼容性更好）
npm install mysql2

# 安装数据库初始化工具
npm install -D tsx

# 安装 TypeScript 类型定义（如果使用 mysql2）
npm install -D @types/mysql2
```

## 2. 环境变量配置

### 创建/修改 `.env.local` 文件

在项目根目录下创建或修改 `.env.local` 文件，添加以下数据库配置：

```env
# MySQL 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=aiweb_database
DB_PORT=3306
```

### 2. 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DB_HOST` | MySQL 服务器地址 | `localhost` |
| `DB_USER` | 数据库用户名 | `root` |
| `DB_PASSWORD` | 数据库密码 | 无（必须设置） |
| `DB_DATABASE` | 数据库名称 | `aiweb_database` |
| `DB_PORT` | 数据库端口 | `3306` |

## 3. 代码配置变更

### 数据库连接配置 (`src/lib/database.ts`)

```typescript
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
```

### 2. 查询工具函数

```typescript
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
```

## 4. 数据库初始化

### 初始化脚本 (`scripts/init-db.ts`)

```typescript
import { initDatabase, closeDatabase } from '../src/lib/database';

/**
 * 数据库初始化主函数
 */
async function main() {
  try {
    console.log('🚀 开始初始化数据库表结构...');
    
    await initDatabase();
    
    console.log('✅ 数据库表初始化成功！');
    console.log('📊 表结构已创建：');
    console.log('   - conversations (对话表)');
    console.log('   - messages (消息表)');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败：', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

// 执行初始化
main().catch(console.error);
```

### Package.json 脚本配置

在 `package.json` 的 scripts 部分添加以下命令：

```json
{
  "scripts": {
    "db:init": "tsx scripts/init-db.ts",
    "db:reset": "tsx scripts/init-db.ts --reset",
    "db:status": "tsx scripts/init-db.ts --status"
  }
}
```

## 5. 表结构说明

### 1. Conversations 表（对话表）

```sql
CREATE TABLE conversations (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT '',
  model VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
);
```

### 2. Messages 表（消息表）

```sql
CREATE TABLE messages (
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
);
```

## 6. 完整操作命令

### 执行顺序和命令

```bash
# 步骤 0: 确保 MySQL 服务运行（Windows）
# 打开服务管理器，启动 MySQL 服务
# 或者使用命令：net start mysql

# 步骤 1: 安装 Node.js 依赖包
npm install mysql2
npm install -D tsx @types/mysql2

# 步骤 2: 配置环境变量
# 复制 env.example 为 .env.local（如果存在）
cp env.example .env.local
# 编辑 .env.local 文件，设置正确的数据库连接信息
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_mysql_password
# DB_DATABASE=aiweb_database
# DB_PORT=3306

# 步骤 3: 创建数据库（如果不存在）
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS aiweb_database;"

# 步骤 4: 初始化数据库表结构
npm run db:init

# 步骤 5: 启动应用验证连接
npm run dev

# 步骤 6: 发送测试消息验证数据库记录
# 在浏览器中打开 http://localhost:3000，发送聊天消息
# 检查数据库中的 conversations 和 messages 表是否有数据

# 步骤 7: 验证数据库记录
mysql -u root -p -D aiweb_database -e "SELECT * FROM conversations; SELECT * FROM messages;"
```

在 MySQL 终端中运行：

```sql
SHOW TABLES;
DESCRIBE conversations;
DESCRIBE messages;
```

## 7. 常见问题解决方案

### 问题 1: ER_NOT_SUPPORTED_AUTH_MODE (1251 错误)

**原因**: MySQL 8.0+ 默认使用 `caching_sha2_password` 认证，但 Node.js mysql 库默认支持 `mysql_native_password`。

**解决方案**:

```sql
-- 修改用户认证方式
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

或者安装 `mysql2` 库：

```bash
npm install mysql2
```

然后修改导入：

```typescript
import mysql from 'mysql2';
```

### 问题 2: ER_NO_SUCH_TABLE (1146 错误)

**原因**: 数据库表尚未创建。

**解决方案**: 执行数据库初始化脚本。

### 问题 3: ER_ACCESS_DENIED_ERROR (1045 错误)

**原因**: 数据库连接信息错误。

**解决方案**: 检查 `.env.local` 中的数据库配置是否正确。

## 8. 配置变更总结

### 1. 依赖包安装
- 新增 `mysql2` 作为数据库驱动（替代 `mysql`）
- 新增 `tsx` 用于执行 TypeScript 脚本
- 新增 `@types/mysql2` 类型定义

### 2. 环境变量配置
- 创建 `.env.local` 文件存储数据库连接信息
- 使用标准的环境变量命名：DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT

### 3. 代码配置变更
- 在 `src/lib/database.ts` 中创建数据库连接池
- 实现查询工具函数 `query()`
- 添加数据库初始化函数 `initDatabase()`

### 4. 初始化脚本
- 创建 `scripts/init-db.ts` 数据库初始化脚本
- 在 package.json 中添加相关命令：db:init, db:reset, db:status

### 5. 表结构设计
- 创建 `conversations` 表存储对话信息
- 创建 `messages` 表存储消息记录
- 添加适当的索引和外键约束

### 6. 数据库记录功能修复
- 增强 ChatResponse 接口添加 provider 字段
- 修复流式和非流式 API 路由的数据库记录逻辑
- 更新所有 AI 提供者实现确保返回完整的响应信息

### 2. 认证协议兼容性

如果遇到认证问题，可以考虑：

1. 修改 MySQL 用户认证方式
2. 或者使用 `mysql2` 库替代 `mysql` 库

### 3. 数据库记录功能修复

修复了数据库记录为空的问题，主要修改包括：

1. **ChatResponse接口增强**：添加 `provider?: string` 字段

2. **流式API路由修复**：确保所有流式提供者返回完整的响应信息

3. **非流式API路由修复**：正确传递provider信息给数据库记录函数

4. **所有AI提供者更新**：确保返回的ChatResponse包含provider信息

涉及的修改文件：
- `src/lib/api.ts` - 接口定义更新
- `src/app/api/chat/route.ts` - 非流式API修复
- `src/app/api/chat/stream/route.ts` - 流式API修复  
- `src/lib/providers/*.ts` - 所有AI提供者实现更新

## 9. 最佳实践

1. **安全性**: 不要在代码中硬编码数据库密码
2. **连接池**: 使用连接池管理数据库连接
3. **错误处理**: 添加适当的错误处理和日志记录
4. **环境分离**: 为不同环境（开发、测试、生产）使用不同的数据库配置
5. **数据一致性**: 确保API响应对象包含所有必要的字段（如provider）以支持数据库记录
6. **类型安全**: 使用TypeScript接口确保数据库操作的类型一致性

## 10. 故障排除

### 常见问题诊断命令

```bash
# 检查 MySQL 服务状态
sudo systemctl status mysql      # Linux/macOS
net start mysql                 # Windows

# 检查数据库连接
mysql -u root -p -e "SHOW DATABASES;"

# 检查表结构
mysql -u root -p -D aiweb_database -e "SHOW TABLES;"
mysql -u root -p -D aiweb_database -e "DESCRIBE conversations;"
mysql -u root -p -D aiweb_database -e "DESCRIBE messages;"

# 检查数据库用户权限
mysql -u root -p -e "SELECT user, host FROM mysql.user;"

# 查看应用程序日志
npm run dev 2>&1 | grep -i error

# 检查环境变量配置
cat .env.local
echo $DB_HOST $DB_USER $DB_DATABASE
```

### 常见问题解决方案

1. **MySQL 服务未启动**
   ```bash
   sudo systemctl start mysql    # Linux/macOS
   net start mysql              # Windows
   ```

2. **数据库连接拒绝**
   - 检查 `.env.local` 文件中的数据库配置
   - 验证 MySQL 用户权限
   - 检查防火墙设置

3. **表不存在错误**
   ```bash
   npm run db:init
   ```

4. **认证协议错误 (1251)**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
   FLUSH PRIVILEGES;
   ```

5. **权限不足错误**
   ```sql
   GRANT ALL PRIVILEGES ON aiweb_database.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

通过以上配置，您的应用程序应该能够正常连接和使用 MySQL 数据库。