import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 存储用户数据
const users = new Map();

// 创建新用户
router.post('/', (req, res) => {
  const userId = uuidv4();
  users.set(userId, {
    id: userId,
    createdAt: new Date()
  });
  res.json({ userId });
});

// 获取用户信息
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

export default router;