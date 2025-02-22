import { createServer } from 'http';
import app from '../backend/server.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const userMessage = req.query.message;
  if (!userMessage) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const response = await fetch(process.env.DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-r1-250120',
        messages: [
          { role: 'user', content: userMessage }
        ],
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    // 发送连接成功事件
    res.write('data: {"status":"connected"}\n\n');

    // 处理流式响应
    for await (const chunk of response.body) {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.trim() && line.includes('data:')) {
          res.write(`${line}\n\n`);
        }
      }
    }

    res.end();
  } catch (error) {
    console.error('API error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
}