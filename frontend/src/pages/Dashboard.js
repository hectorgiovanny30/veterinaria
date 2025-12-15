import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bienvenido, Doctor
      </Typography>
      <Grid container spacing={3}>
        {/* Tarjeta 1 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', color: 'primary.main' }}>
            <Typography variant="h2">12</Typography>
            <Typography>Citas Hoy</Typography>
          </Paper>
        </Grid>
        {/* Tarjeta 2 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', color: 'secondary.main' }}>
            <Typography variant="h2">5</Typography>
            <Typography>Hospitalizados</Typography>
          </Paper>
        </Grid>
        {/* Tarjeta 3 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', color: 'success.main' }}>
            <Typography variant="h2">8</Typography>
            <Typography>Altas Médicas</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;