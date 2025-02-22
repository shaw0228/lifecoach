import { createServer } from 'http';
import app from '../backend/server.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    const serverModule = await import('../backend/server.js');
    const app = serverModule.default;
    await app(req, res);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}