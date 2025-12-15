import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon, Settings as SettingsIcon } from '@mui/icons-material';

const Header = ({ onOpenLeft, onOpenRight }) => {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {/* Botón Hamburguesa Izquierdo */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onOpenLeft}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Panel de Control
        </Typography>

        {/* Botón Configuración Derecho */}
        <IconButton 
            color="inherit" 
            onClick={onOpenRight}
            sx={{ border: '1px solid rgba(255,255,255,0.3)', borderRadius: 2 }}
        >
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;