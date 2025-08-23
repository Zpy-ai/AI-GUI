#!/usr/bin/env tsx

/**
 * 数据库初始化脚本
 * 用于手动初始化数据库表结构
 */

import { initDatabase, closeDatabase } from '../src/lib/database';

/**
 * 主初始化函数
 */
async function main() {
  console.log('🚀 开始初始化数据库表结构...');
  
  try {
    // 初始化数据库表
    await initDatabase();
    console.log('✅ 数据库表初始化成功！');
    
    console.log('📊 表结构已创建：');
    console.log('   - conversations (对话表)');
    console.log('   - messages (消息表)');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败：', error);
    process.exit(1);
  } finally {
    // 关闭数据库连接
    await closeDatabase();
  }
}

// 执行初始化
main()
  .then(() => {
    console.log('🎉 数据库初始化完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 初始化过程出现错误：', error);
    process.exit(1);
  });