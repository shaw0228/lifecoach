const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const VOLC_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

app.get('/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const response = await fetch(VOLC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VOLC_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-r1-250120',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的Life Coach AI助手，可以帮助用户解决生活中的困扰，提供个性化的建议。'
          },
          {
            role: 'user',
            content: req.query.message || ''
          }
        ],
        stream: true,
        temperature: 0.7
      }),
      timeout: 60000 // 60秒超时
    });

    const reader = response.body.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = new TextDecoder().decode(value);
      res.write(`data: ${chunk}\n\n`);
    }
    
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: '抱歉，解析响应数据时出错，请稍后再试。' })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});