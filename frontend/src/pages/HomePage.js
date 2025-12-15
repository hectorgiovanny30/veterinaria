import React from 'react';
import { Typography, Box, Grid, Paper, Container, alpha } from '@mui/material';
import { 
  AccountBalance, Store, Group, CompareArrows, 
  RequestQuote, ReceiptLong, ViewList, Tune,
  LocalHospital
} from '@mui/icons-material';
import { useOutletContext } from 'react-router-dom';

const HomePage = () => {
  const { handleModuleOpen } = useOutletContext();

  const modules = [
    { title: 'Pacientes', icon: <LocalHospital fontSize="large" />, color: '#D32F2F', desc: 'Historias, Hospitalización y Labs' },
    { title: 'Contabilidad', icon: <AccountBalance fontSize="large" />, color: '#0078D4', desc: 'Asientos, Libros y Balances' },
    { title: 'Almacén', icon: <Store fontSize="large" />, color: '#FF7B00', desc: 'Inventario, Bodegas y Productos' },
    { title: 'Terceros', icon: <Group fontSize="large" />, color: '#00CC6A', desc: 'Clientes, Proveedores y Vendedores' },
    { title: 'Movimientos', icon: <CompareArrows fontSize="large" />, color: '#9C27B0', desc: 'Entradas, Salidas y Traslados' },
    { title: 'Cuentas por Pagar', icon: <RequestQuote fontSize="large" />, color: '#E91E63', desc: 'Facturas de Compra y Egresos' },
    { title: 'Cuentas por Cobrar', icon: <ReceiptLong fontSize="large" />, color: '#00B7C3', desc: 'Facturación y Recibos de Caja' },
    { title: 'Kardex', icon: <ViewList fontSize="large" />, color: '#607D8B', desc: 'Rastreo y Costos por Lote' },
    { title: 'Configuración', icon: <Tune fontSize="large" />, color: '#424242', desc: 'Parámetros y Seguridad' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
        {/* TÍTULO RESPONSIVE: En celular 2rem, en PC 3rem */}
        <Typography variant="h3" fontWeight={900} sx={{ 
          fontSize: { xs: '2rem', md: '3rem' }, // <--- AQUÍ ESTÁ EL AJUSTE
          background: 'linear-gradient(135deg, #0078D4 0%, #00B7C3 50%, #9C27B0 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px', mb: 1, textShadow: '0px 4px 10px rgba(0, 120, 212, 0.2)'
        }}>
          Panel Principal
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Seleccione un módulo operativo
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, md: 4 }}> {/* Espaciado menor en celular */}
        {modules.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              onClick={() => handleModuleOpen(item.title)}
              sx={{
                p: 3, height: '100%', cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&::before': {
                  content: '""', position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
                  background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent)',
                  transition: 'all 0.7s ease-in-out', zIndex: 1
                },
                '&:hover': {
                  transform: 'translateY(-12px) scale(1.02)',
                  boxShadow: `0 25px 50px -12px ${alpha(item.color, 0.5)}, inset 0 0 0 2px ${item.color}`,
                  background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, ${alpha(item.color, 0.1)} 100%)`,
                  borderColor: 'transparent', '&::before': { left: '100%' }
                },
                '&:hover .icon-box': {
                  transform: 'scale(1.1) rotate(-10deg)', background: item.color, color: '#fff',
                  boxShadow: `0 10px 20px -5px ${alpha(item.color, 0.6)}`
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, alignItems: 'center', gap: 2 }}>
                <Box className="icon-box" sx={{
                    width: { xs: 50, md: 60 }, height: { xs: 50, md: 60 }, borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: { xs: 0, md: 2 },
                    background: alpha(item.color, 0.15), color: item.color, transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}>
                  {item.icon}
                </Box>
                <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                    <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: '#2c3e50', fontSize: '1.1rem', mb: 0 }}>
                    {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.4, display: 'block' }}>
                    {item.desc}
                    </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;