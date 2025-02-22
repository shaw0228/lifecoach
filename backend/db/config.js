import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// 数据库连接配置
const dbConfig = {
  filename: path.join(process.cwd(), 'db', 'lifecoach.db'),
  driver: sqlite3.Database
};

// 初始化数据库连接
async function initializeDatabase() {
  const db = await open(dbConfig);
  
  // 创建用户表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建对话记录表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      response TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  return db;
}

export { initializeDatabase };
