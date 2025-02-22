import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import userService from './services/userService.js';

dotenv.config();

// 环境变量配置
const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = process.env.DEEPSEEK_API_URL;
const port = process.env.PORT || 3001;

const app = express();

// 配置CORS，允许特定来源访问
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Connection', 'Cache-Control', 'Content-Encoding']
}));
app.use(express.json());

// 添加全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 系统提示词，定义AI助手的角色
const SYSTEM_PROMPT = `你是一位专业的Life Coach，拥有丰富的个人成长和心理辅导经验。你的目标是：
1. 通过倾听和提问，深入理解用户的困扰和需求
2. 提供具体、可行的建议和解决方案
3. 鼓励用户进行自我反思和成长
4. 保持积极、专业且富有同理心的沟通方式
5. 在必要时给出适当的督促和提醒

请记住：你的建议应该是实用的、循序渐进的，并且要考虑到用户的具体情况和接受能力。`;

// DeepSeek R1 API配置
// 删除这部分重复声明
// const API_KEY = '52755a88-238a-4adf-ace1-98f8f0f19261';
// const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// 创建新用户
app.post('/users', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: '用户名不能为空' });
    }
    const user = await userService.createUser(name);
    res.status(201).json(user);
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json({ error: '创建用户失败' });
  }
});

// 获取用户信息
app.get('/users/:id', async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json(user);
  } catch (error) {
    console.error('获取用户失败:', error);
    res.status(500).json({ error: '获取用户失败' });
  }
});

// 获取用户的对话历史
app.get('/users/:id/conversations', async (req, res) => {
  try {
    const conversations = await userService.getUserConversations(req.params.id);
    res.json(conversations);
  } catch (error) {
    console.error('获取对话历史失败:', error);
    res.status(500).json({ error: '获取对话历史失败' });
  }
});

// 处理聊天请求的路由
app.get('/chat', async (req, res) => {
  const userMessage = req.query.message;
  if (!userMessage) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // 发送连接成功事件
  res.write('data: {"status":"connected"}\n\n');

  let fullResponse = '';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-r1-250120',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        stream: true,
        temperature: 0.6
      })
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    // 处理流式响应
    for await (const chunk of response.body) {
      const lines = chunk.toString().split('\n');
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.includes('data:')) {
          const jsonData = line.replace('data:', '').trim();
          
          if (jsonData === '[DONE]') {
            res.write('data: {"status":"completed"}\n\n');
            continue;
          }

          try {
            const data = JSON.parse(jsonData);
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (error) {
            console.error('解析数据出错:', error);
          }
        }
      }
    }

    res.end();
  } catch (error) {
    console.error('处理请求出错:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});