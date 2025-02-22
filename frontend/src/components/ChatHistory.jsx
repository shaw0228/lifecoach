import React from 'react';
import { Box, Paper, Typography, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ChatHistory = ({ messages }) => {
  // 按日期对消息进行分组
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp || Date.now()).toLocaleDateString('zh-CN');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>对话历史</Typography>
      {Object.entries(messageGroups).map(([date, messages], index) => (
        <Accordion key={date} defaultExpanded={index === 0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: 'primary.light', color: 'white' }}
          >
            <Typography>{date}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {messages.map((message, msgIndex) => (
                <Paper
                  key={msgIndex}
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                    bgcolor: message.role === 'user' ? 'primary.light' : 'white',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                    ml: message.role === 'user' ? 'auto' : 0
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ChatHistory;