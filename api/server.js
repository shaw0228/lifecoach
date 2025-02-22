import { createServer } from 'http';
import app from '../backend/server.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // 处理 API 路由
  app(req, res);
}