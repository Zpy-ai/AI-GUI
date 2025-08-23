# MySQL 常用SQL语句参考手册

## 数据库操作

### 创建数据库
```sql
-- 创建基础数据库
CREATE DATABASE database_name;

-- 创建带字符集的数据库
CREATE DATABASE database_name 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS database_name;
```

### 查看数据库
```sql
-- 查看所有数据库
SHOW DATABASES;

-- 查看数据库字符集
SHOW VARIABLES LIKE 'character_set_database';

-- 查看数据库排序规则
SHOW VARIABLES LIKE 'collation_database';
```

### 删除数据库
```sql
-- 删除数据库
DROP DATABASE database_name;

-- 安全删除数据库
DROP DATABASE IF EXISTS database_name;
```

### 使用数据库
```sql
-- 选择要使用的数据库
USE aiweb_database;

-- 查看当前使用的数据库
SELECT DATABASE();
```

## 表操作

### 创建表
```sql
-- 创建用户表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建产品表
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

### 查看表结构
```sql
-- 查看所有表
SHOW TABLES;

-- 查看表结构
DESCRIBE table_name;
-- 或
SHOW COLUMNS FROM table_name;

-- 查看建表语句
SHOW CREATE TABLE table_name;
```

### 修改表
```sql
-- 添加列
ALTER TABLE table_name ADD COLUMN column_name VARCHAR(100) AFTER existing_column;

-- 修改列类型
ALTER TABLE table_name MODIFY COLUMN column_name TEXT;

-- 重命名列
ALTER TABLE table_name CHANGE old_column_name new_column_name VARCHAR(100);

-- 删除列
ALTER TABLE table_name DROP COLUMN column_name;

-- 添加索引
ALTER TABLE table_name ADD INDEX index_name (column_name);

-- 添加唯一索引
ALTER TABLE table_name ADD UNIQUE unique_index_name (column_name);

-- 删除索引
ALTER TABLE table_name DROP INDEX index_name;
```

### 删除表
```sql
-- 删除表
DROP TABLE table_name;

-- 安全删除表
DROP TABLE IF EXISTS table_name;

-- 清空表数据（保留表结构）
TRUNCATE TABLE table_name;
```

## 数据操作（CRUD）

### 插入数据
```sql
-- 插入单条数据
INSERT INTO users (username, email, password_hash) 
VALUES ('john_doe', 'john@example.com', 'hashed_password');

-- 插入多条数据
INSERT INTO users (username, email, password_hash) VALUES
('user1', 'user1@example.com', 'hash1'),
('user2', 'user2@example.com', 'hash2'),
('user3', 'user3@example.com', 'hash3');

-- 插入数据并返回自增ID
INSERT INTO users (username, email) VALUES ('test', 'test@example.com');
SELECT LAST_INSERT_ID();
```

### 查询数据
```sql
-- 查询所有数据
SELECT * FROM users;

-- 查询特定列
SELECT id, username, email FROM users;

-- 条件查询
SELECT * FROM users WHERE username = 'john_doe';
SELECT * FROM products WHERE price > 100 AND stock_quantity > 0;

-- LIKE模糊查询
SELECT * FROM users WHERE username LIKE 'john%';
SELECT * FROM users WHERE email LIKE '%@example.com';

-- IN查询
SELECT * FROM users WHERE id IN (1, 2, 3);

-- BETWEEN范围查询
SELECT * FROM products WHERE price BETWEEN 50 AND 100;

-- 排序
SELECT * FROM users ORDER BY created_at DESC;
SELECT * FROM products ORDER BY price ASC, name DESC;

-- 分页
SELECT * FROM users LIMIT 10 OFFSET 20;  -- 第3页，每页10条
SELECT * FROM users LIMIT 20, 10;        -- 同上

-- 分组统计
SELECT category_id, COUNT(*) as product_count, AVG(price) as avg_price
FROM products 
GROUP BY category_id 
HAVING product_count > 5;

-- 连接查询
SELECT users.username, orders.order_date, orders.total_amount
FROM users
INNER JOIN orders ON users.id = orders.user_id
WHERE users.id = 1;

-- 左连接
SELECT users.username, orders.order_date
FROM users
LEFT JOIN orders ON users.id = orders.user_id;

-- 子查询
SELECT * FROM products 
WHERE price > (SELECT AVG(price) FROM products);
```

### 更新数据
```sql
-- 更新单条数据
UPDATE users SET email = 'new_email@example.com' WHERE id = 1;

-- 更新多条数据
UPDATE products SET price = price * 0.9 WHERE category_id = 5;

-- 使用表达式更新
UPDATE users SET login_count = login_count + 1 WHERE id = 1;

-- 使用子查询更新
UPDATE products 
SET price = price * 1.1 
WHERE category_id IN (SELECT id FROM categories WHERE name = 'Electronics');
```

### 删除数据
```sql
-- 删除特定数据
DELETE FROM users WHERE id = 1;

-- 删除多条数据
DELETE FROM products WHERE stock_quantity = 0;

-- 使用子查询删除
DELETE FROM orders 
WHERE user_id IN (SELECT id FROM users WHERE created_at < '2023-01-01');

-- 清空表（不可恢复）
DELETE FROM table_name;  -- 逐行删除，较慢
TRUNCATE TABLE table_name; -- 快速清空，重置自增ID
```

## 高级查询

### 联合查询
```sql
-- UNION（去重）
SELECT username FROM active_users
UNION
SELECT username FROM inactive_users;

-- UNION ALL（不去重）
SELECT product_name FROM current_products
UNION ALL
SELECT product_name FROM archived_products;
```

### 事务处理
```sql
-- 开始事务
START TRANSACTION;

-- 执行多个操作
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 提交事务
COMMIT;

-- 回滚事务
ROLLBACK;
```

### 视图操作
```sql
-- 创建视图
CREATE VIEW user_orders_view AS
SELECT users.username, orders.order_date, orders.total_amount
FROM users
JOIN orders ON users.id = orders.user_id;

-- 查询视图
SELECT * FROM user_orders_view;

-- 删除视图
DROP VIEW user_orders_view;
```

## 用户和权限管理

### 用户管理
```sql
-- 创建用户
CREATE USER 'new_user'@'localhost' IDENTIFIED BY 'password';

-- 修改密码
ALTER USER 'user'@'localhost' IDENTIFIED BY 'new_password';

-- 删除用户
DROP USER 'user'@'localhost';
```

### 权限管理
```sql
-- 授予权限
GRANT SELECT, INSERT, UPDATE ON database_name.* TO 'user'@'localhost';
GRANT ALL PRIVILEGES ON database_name.* TO 'user'@'localhost';

-- 查看权限
SHOW GRANTS FOR 'user'@'localhost';

-- 撤销权限
REVOKE INSERT ON database_name.* FROM 'user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
```

## 备份和恢复

### 备份数据库
```bash
# 备份单个数据库
mysqldump -h localhost -u root -p database_name > backup.sql

# 备份所有数据库
mysqldump -h localhost -u root -p --all-databases > all_backup.sql

# 备份特定表
mysqldump -h localhost -u root -p database_name table1 table2 > tables_backup.sql
```

### 恢复数据库
```bash
# 恢复数据库
mysql -h localhost -u root -p database_name < backup.sql

# 从压缩文件恢复
gunzip < backup.sql.gz | mysql -h localhost -u root -p database_name
```

## 性能优化

### 索引优化
```sql
-- 查看索引使用情况
EXPLAIN SELECT * FROM users WHERE username = 'test';

-- 强制使用索引
SELECT * FROM users FORCE INDEX (idx_username) WHERE username = 'test';

-- 分析表（更新索引统计信息）
ANALYZE TABLE table_name;

-- 优化表（整理碎片）
OPTIMIZE TABLE table_name;
```

### 查询优化
```sql
-- 使用覆盖索引
SELECT id, username FROM users WHERE username = 'test';

-- 避免SELECT *
SELECT id, username, email FROM users WHERE id = 1;

-- 使用LIMIT限制结果集
SELECT * FROM users LIMIT 100;
```

## 常用函数

### 字符串函数
```sql
-- 字符串连接
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;

-- 子字符串
SELECT SUBSTRING(email, 1, 5) FROM users;

-- 字符串长度
SELECT LENGTH(username) FROM users;

-- 大小写转换
SELECT UPPER(username), LOWER(email) FROM users;

-- 去除空格
SELECT TRIM(username) FROM users;
```

### 数值函数
```sql
-- 四舍五入
SELECT ROUND(price, 2) FROM products;

-- 绝对值
SELECT ABS(balance) FROM accounts;

-- 随机数
SELECT RAND();

-- 向上取整/向下取整
SELECT CEIL(price), FLOOR(price) FROM products;
```

### 日期函数
```sql
-- 当前日期时间
SELECT NOW(), CURDATE(), CURTIME();

-- 日期加减
SELECT DATE_ADD(created_at, INTERVAL 7 DAY) FROM users;
SELECT DATE_SUB(created_at, INTERVAL 1 MONTH) FROM users;

-- 日期格式化
SELECT DATE_FORMAT(created_at, '%Y-%m-%d') FROM users;

-- 日期差
SELECT DATEDIFF('2023-12-31', '2023-01-01');
```

## 实用技巧

### 批量操作
```sql
-- 批量插入
INSERT INTO products (name, price) VALUES
('Product 1', 10.99),
('Product 2', 20.99),
('Product 3', 30.99);

-- 批量更新（使用CASE）
UPDATE products 
SET price = CASE 
    WHEN id = 1 THEN 15.99
    WHEN id = 2 THEN 25.99
    WHEN id = 3 THEN 35.99
END
WHERE id IN (1, 2, 3);
```

### 数据导入导出
```sql
-- 导出查询结果到文件
SELECT * INTO OUTFILE '/tmp/users.csv'
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
FROM users;

-- 从文件导入数据
LOAD DATA INFILE '/tmp/users.csv'
INTO TABLE users
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

## 错误处理

### 常见错误解决
```sql
-- 查看错误信息
SHOW ERRORS;
SHOW WARNINGS;

-- 处理重复键错误
INSERT INTO users (username, email) 
VALUES ('test', 'test@example.com')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- 使用IGNORE忽略错误
INSERT IGNORE INTO users (username, email) VALUES ('test', 'test@example.com');
```

---

## 最佳实践

1. **始终使用参数化查询**防止SQL注入
2. **为频繁查询的列创建索引**
3. **避免在WHERE子句中使用函数**
4. **定期备份重要数据**
5. **使用事务保证数据一致性**
6. **监控慢查询日志优化性能**
7. **使用EXPLAIN分析查询计划**
8. **合理设计数据库范式**

## 版本说明
- 本参考手册适用于 MySQL 5.7+
- 部分语法可能因版本差异而略有不同
- 建议在生产环境使用前进行测试

---

*最后更新: 2024年*