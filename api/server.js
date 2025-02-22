import { createServer } from 'http';
import app from '../backend/server.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // 动态导入 server.js
    const { default: app } = await import('../backend/server.js');
    // 处理 API 路由
    app(req, res);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}