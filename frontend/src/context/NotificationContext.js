import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, Slide, Box, Typography } from '@mui/material';
import { CheckCircle, Error, Info, Warning } from '@mui/icons-material';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ open: false, type: 'success', message: '' });

  // Función mágica que usarás en todo el sistema
  const showNotification = (type, message) => {
    setNotification({ open: true, type, message });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  // Iconos personalizados grandes
  const getIcon = () => {
    switch(notification.type) {
      case 'success': return <CheckCircle fontSize="large" />;
      case 'error': return <Error fontSize="large" />;
      case 'warning': return <Warning fontSize="large" />;
      default: return <Info fontSize="large" />;
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Aparece arriba al centro
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
      >
        <Alert 
          onClose={handleClose} 
          severity={notification.type}
          icon={getIcon()}
          sx={{ 
            width: '100%', minWidth: '350px',
            borderRadius: '16px',
            alignItems: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            fontWeight: 600,
            fontSize: '1rem',
            // Colores Vibrantes estilo Windows 11
            ...(notification.type === 'success' && { bgcolor: '#dff6dd', color: '#107c10', border: '1px solid #107c10' }),
            ...(notification.type === 'error' && { bgcolor: '#fde7e9', color: '#c50f1f', border: '1px solid #c50f1f' }),
          }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              {notification.type === 'success' ? '¡Excelente!' : 'Atención'}
            </Typography>
            {notification.message}
          </Box>
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};