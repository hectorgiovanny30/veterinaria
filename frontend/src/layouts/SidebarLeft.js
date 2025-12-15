import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import { Home, Pets, CalendarMonth, LocalHospital } from '@mui/icons-material';

const SidebarLeft = ({ open, onClose }) => {
  const menuItems = [
    { text: 'Dashboard', icon: <Home /> },
    { text: 'Pacientes', icon: <Pets /> },
    { text: 'Citas', icon: <CalendarMonth /> },
    { text: 'Clínica', icon: <LocalHospital /> },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">Veterinaria App</Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SidebarLeft;