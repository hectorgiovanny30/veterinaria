import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Divider, Typography } from '@mui/material';
import { Settings, Person, Logout, Help } from '@mui/icons-material';

const SidebarRight = ({ open, onClose }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 280 }} role="presentation" onClick={onClose}>
        <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="subtitle1" fontWeight="bold">Configuración</Typography>
          <Typography variant="caption" color="text.secondary">Usuario: BlackCrystal</Typography>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon><Person /></ListItemIcon>
              <ListItemText primary="Mi Perfil" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText primary="Ajustes del Sistema" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon><Help /></ListItemIcon>
              <ListItemText primary="Ayuda / Soporte" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton sx={{ color: 'error.main' }}>
              <ListItemIcon><Logout color="error" /></ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default SidebarRight;