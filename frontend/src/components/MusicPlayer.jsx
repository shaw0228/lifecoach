import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

function MusicPlayer({ isPlaying, onToggle }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: '17rem',
        top: '3rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
        p: 1.2,
        borderRadius: 2,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 151, 181, 0.15)',
        boxShadow: '0 4px 16px rgba(255, 151, 181, 0.06)',
        transition: 'all 0.3s ease',
        zIndex: 1000,
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.9)',
          transform: 'translateX(-4px)',
          boxShadow: '0 6px 20px rgba(255, 151, 181, 0.1)',
        }
      }}
    >
      <IconButton
        onClick={onToggle}
        sx={{
          width: 32,
          height: 32,
          bgcolor: isPlaying ? 'rgba(255, 151, 181, 0.15)' : 'transparent',
          border: '1.5px solid',
          borderColor: isPlaying ? 'primary.main' : 'rgba(255, 151, 181, 0.3)',
          color: 'primary.main',
          padding: '6px',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'rgba(255, 151, 181, 0.25)',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)'
          }
        }}
      >
        {isPlaying ? 
          <PauseIcon sx={{ fontSize: 16 }} /> : 
          <PlayArrowIcon sx={{ fontSize: 16 }} />
        }
      </IconButton>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <MusicNoteIcon sx={{ 
          fontSize: 14,
          color: 'primary.main',
          opacity: isPlaying ? 1 : 0.5 
        }} />
        <Typography
          variant="caption"
          sx={{
            color: 'primary.main',
            fontWeight: 500,
            fontSize: '0.75rem',
            opacity: isPlaying ? 1 : 0.7
          }}
        >
          音乐
        </Typography>
      </Box>
    </Box>
  );
}

export default MusicPlayer;