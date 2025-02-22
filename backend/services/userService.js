import { initializeDatabase } from '../db/config.js';

class UserService {
  constructor() {
    this.initDB();
  }

  async initDB() {
    this.db = await initializeDatabase();
  }

  // 创建新用户
  async createUser(name) {
    try {
      const result = await this.db.run('INSERT INTO users (name) VALUES (?)', [name]);
      return { id: result.lastID, name };
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  }

  // 获取用户信息
  async getUser(id) {
    try {
      return await this.db.get('SELECT * FROM users WHERE id = ?', [id]);
    } catch (error) {
      console.error('获取用户失败:', error);
      throw error;
    }
  }

  // 保存对话记录
  async saveConversation(userId, message, response) {
    try {
      const result = await this.db.run(
        'INSERT INTO conversations (user_id, message, response) VALUES (?, ?, ?)',
        [userId, message, response]
      );
      return { id: result.lastID, userId, message, response };
    } catch (error) {
      console.error('保存对话记录失败:', error);
      throw error;
    }
  }

  // 获取用户的对话历史
  async getUserConversations(userId) {
    try {
      return await this.db.all(
        'SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
    } catch (error) {
      console.error('获取对话历史失败:', error);
      throw error;
    }
  }
}

export default new UserService();