import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const SettingsPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Efecto Cristal también en el contenido */}
      <Paper 
        sx={{ 
          p: 4, 
          background: 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          Configuración
        </Typography>
        <Typography variant="body1">
          Aquí podrás gestionar los usuarios y parámetros del sistema veterinario.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SettingsPage;