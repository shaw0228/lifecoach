import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Box, Typography, Paper } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import ChatHistory from './components/ChatHistory';

// 创建主题
// 修复主题配置中的语法错误
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF97B5', // 温柔的粉色
      light: '#FFB4C9',
      dark: '#E57A98',
    },
    secondary: {
      main: '#E8D3DC', // 浅粉色
      light: '#F4E4EA',
      dark: '#D4B7C3',
    },
    background: {
      default: '#FFF5F8', // 粉白色背景
      paper: 'rgba(255, 255, 255, 0.95)'
    },
    text: {
      primary: '#4A3B3E', // 深灰褐色文字
      secondary: '#806A6F' // 浅灰褐色文字
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
    h1: {
      fontSize: '24px',
      fontWeight: 600,
      letterSpacing: '-0.021em',
      lineHeight: 1.14286
    },
    body1: {
      fontSize: '14px',
      fontWeight: 400,
      letterSpacing: '-0.016em',
      lineHeight: 1.4
    }
  },  // 添加逗号
  shape: {
    borderRadius: 16
  }
});

// 更新 API 基础 URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // 生产环境使用相对路径
  : 'http://localhost:3001';  // 开发环境使用本地地址

// 修改所有的 API 请求地址
const handleSendMessage = async (message) => {
  try {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }

    const userMessage = { role: 'user', content: message, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);

    const newEventSource = new EventSource(`${API_BASE_URL}/chat?message=${encodeURIComponent(message)}`);
    setEventSource(newEventSource);
    let aiResponse = '';

    newEventSource.onopen = () => {
      console.log('SSE连接已建立');
    };

    newEventSource.onmessage = (event) => {
      try {
        if (event.data === 'heartbeat') return;

        const data = JSON.parse(event.data);
        
        if (data.status === 'completed') {
          // 保存对话记录
          if (userId) {
            fetch(`${API_BASE_URL}/users/${userId}/conversations`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message, response: aiResponse })
            }).catch(error => console.error('保存对话记录失败:', error));
          }

          newEventSource.close();
          setEventSource(null);
          return;
        }

        if (data.content) {
          aiResponse += data.content;
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content = aiResponse;
            } else {
              newMessages.push({ role: 'assistant', content: aiResponse, timestamp: Date.now() });
            }
            return newMessages;
          });
        }
      } catch (error) {
        console.error('处理消息失败:', error);
      }
    };

    newEventSource.onerror = (error) => {
      console.error('SSE错误:', error);
      newEventSource.close();
      setEventSource(null);
    };
  } catch (error) {
    console.error('发送消息失败:', error);
  }
};

  // 修改根容器的样式
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #FFF5F8 0%, #FFE4EA 100%)',
          pt: 2,
          pb: 4
        }}
      >
        <Box
          component="img"
          src="/banner.gif"  // 修改为 GIF 文件名
          alt="AI Life Coach"
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '140px',
            objectFit: 'cover',
            mb: 3,
            borderRadius: 0  // 添加圆角效果
          }}
        />
        <Container maxWidth="md">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;