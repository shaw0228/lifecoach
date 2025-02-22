import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, Stack, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import PetsIcon from '@mui/icons-material/Pets';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MusicPlayer from './MusicPlayer';

function ChatInterface({ messages, onSendMessage }) {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio('/healing-music.mp3'));
  const messagesEndRef = useRef(null);

  // 添加音频初始化
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.3;  // 设置初始音量
    
    // 清理函数
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // 处理浏览器自动播放限制
  useEffect(() => {
    const handleInteraction = () => {
      const audio = audioRef.current;
      audio.load();  // 预加载音频
    };

    window.addEventListener('click', handleInteraction, { once: true });
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  // 删除多余的音频初始化代码，只保留一个
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.3;
    
    // 预加载音频
    const handleCanPlay = () => {
      console.log('音频已加载完成');
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.load();  // 确保音频预加载
    
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // 修改音乐控制函数
  const toggleMusic = async () => {
    try {
      const audio = audioRef.current;
      if (isPlaying) {
        await audio.pause();
      } else {
        audio.loop = true;
        await audio.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('音乐控制失败:', error);
    }
  };

  // 处理消息发送
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <>
      <Paper elevation={0} sx={{ 
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        border: '1px solid rgba(255, 151, 181, 0.1)',
        boxShadow: '0 8px 32px rgba(255, 151, 181, 0.08)'
      }}>
        <Box sx={{ 
          p: 2.5,
          borderBottom: '1px solid rgba(179, 155, 123, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
          <Avatar sx={{ 
            bgcolor: 'primary.light',
            width: 36,
            height: 36
          }}>
            <PetsIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography variant="h6" sx={{ 
            color: 'primary.main',
            fontWeight: 600,
            fontSize: '1.1rem'
          }}>
            Life Coach AI 助手
          </Typography>
        </Box>

        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 151, 181, 0.3)',
            borderRadius: '3px',
            '&:hover': {
              background: 'rgba(255, 151, 181, 0.5)'
            }
          }
        }}>
          {messages.map((message, index) => (
            <Stack
              key={index}
              direction="row"
              spacing={2}
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              sx={{ maxWidth: '80%' }}
            >
              {message.role === 'assistant' && (
                <Avatar 
                  sx={{ 
                    bgcolor: 'rgba(255, 151, 181, 0.15)',
                    width: 36,
                    height: 36
                  }}
                >
                  <PetsIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                </Avatar>
              )}
              <Box
                sx={{
                  background: message.role === 'user' 
                    ? 'linear-gradient(135deg, #FFB4C9 0%, #FF97B5 100%)' 
                    : '#FFFFFF',
                  color: message.role === 'user' ? '#FFF' : theme.palette.text.primary,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: message.role === 'user'
                    ? '0 4px 12px rgba(255, 151, 181, 0.2)'
                    : '0 2px 8px rgba(255, 151, 181, 0.08)',
                  border: message.role === 'assistant' ? '1px solid rgba(255, 151, 181, 0.1)' : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: message.role === 'user'
                      ? '0 6px 16px rgba(255, 151, 181, 0.25)'
                      : '0 4px 12px rgba(255, 151, 181, 0.12)'
                  }
                }}
              >
                <Typography variant="body1">
                  {message.content}
                </Typography>
              </Box>
            </Stack>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        
        <Paper 
          component="form" 
          onSubmit={handleSubmit}
          elevation={0}
          sx={{ 
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderTop: '1px solid rgba(255, 151, 181, 0.1)',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="和 AI 助手聊聊吧..."  // 更新占位符文本
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  '& > fieldset': {
                    borderColor: 'primary.main',
                  }
                },
                '&.Mui-focused': {
                  '& > fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px'
                  }
                }
              }
            }}
          />
          <IconButton 
            type="submit" 
            disabled={!input.trim()}
            sx={{
              p: '12px',
              bgcolor: 'rgba(255, 151, 181, 0.9)',
              borderRadius: 2.5,
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 151, 181, 1)',
                transform: 'scale(1.05)'
              },
              '&:disabled': {
                bgcolor: 'rgba(255, 151, 181, 0.3)'
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </Paper>
      <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} />
    </>
  );
}

export default ChatInterface;