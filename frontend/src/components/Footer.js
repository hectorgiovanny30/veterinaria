import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';
import { 
  Pets,           // Para el nombre
  VerifiedUser,   // Para la versión
  PhoneInTalk,    // Para el teléfono
  Schedule,       // Para la hora
  CalendarMonth   // Para la fecha
} from '@mui/icons-material';

const Footer = () => {
  // --- LÓGICA DEL RELOJ EN TIEMPO REAL ---
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000 * 60); // Actualiza cada minuto
    return () => clearInterval(timer); // Limpieza al desmontar
  }, []);

  // Formatos de fecha y hora
  const formattedDate = dateTime.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  const formattedTime = dateTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  // --- ESTILOS REUTILIZABLES PARA ANIMACIONES ---
  const hoverItemSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    padding: '8px 16px',
    borderRadius: '16px', // Bordes muy redondeados estilo moderno
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Animación con rebote suave
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.5)', // Fondo se ilumina
      transform: 'translateY(-4px) scale(1.02)', // Se eleva y crece ligeramente
      boxShadow: '0 10px 20px -10px rgba(0, 0, 0, 0.2)', // Sombra suave al elevarse
      '& .MuiSvgIcon-root': { // Animación específica para el icono
        transform: 'scale(1.1) rotate(5deg)', // El icono crece y rota un poco
        filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' // Efecto de resplandor
      }
    },
    // Efecto de "brillo" que pasa por encima
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '50%',
      height: '100%',
      background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
      transform: 'skewX(-25deg)',
      transition: 'all 0.6s ease',
    },
    '&:hover::after': {
      left: '150%', // El brillo cruza el elemento al hacer hover
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 1.5,
        // --- ESTILO CRISTAL INTENSO (TIPO BARRA DE TAREAS) ---
        background: 'rgba(240, 242, 255, 0.25)', // Base más clara
        backdropFilter: 'blur(16px) saturate(180%)', // Mucho desenfoque y saturación para colores vibrantes
        borderTop: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        zIndex: 10,
        // ----------------------------------------------------
      }}
    >
      <Container maxWidth="xl"> {/* xl para que ocupe más ancho */}
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          justifyContent="space-between" 
          alignItems="center"
          spacing={2}
        >
          
          {/* ZONA IZQUIERDA: MARCA (Color Azul Principal) */}
          <Box sx={{ ...hoverItemSx, '& .MuiSvgIcon-root': { color: '#0078D4' } }}> {/* Azul Windows */}
            <Pets fontSize="medium" sx={{ transition: '0.4s' }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
                Veterinaria<span style={{ color: '#0078D4' }}>App</span>
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', lineHeight: 1 }}>
                Sistema Gestor
              </Typography>
            </Box>
          </Box>

          {/* ZONA CENTRAL: INFO TÉCNICA Y SOPORTE (Separados por divisor) */}
          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center" 
            sx={{ 
              background: 'rgba(255,255,255,0.15)', // Un fondo sutil para agruparlos
              borderRadius: '20px', 
              p: 0.5 
            }}
          >
            {/* Versión (Color Verde Azulado) */}
            <Box sx={{ ...hoverItemSx, py: 1, '& .MuiSvgIcon-root': { color: '#00CC6A' } }}>
              <VerifiedUser fontSize="small" sx={{ transition: '0.4s' }} />
              <Typography variant="caption" fontWeight={600}>v1.2.0 Stable</Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center', opacity: 0.3 }} />

            {/* Teléfono (Color Naranja/Coral) */}
            <Box sx={{ ...hoverItemSx, py: 1, '& .MuiSvgIcon-root': { color: '#FF7B00' } }}>
              <PhoneInTalk fontSize="small" sx={{ transition: '0.4s' }} />
              <Typography variant="caption" fontWeight={600}>Soporte: 300 123 4567</Typography>
            </Box>
          </Stack>

          {/* ZONA DERECHA: FECHA Y HORA (Color Morado/Rosado) */}
          <Stack direction="row" spacing={2}>
            <Box sx={{ ...hoverItemSx, '& .MuiSvgIcon-root': { color: '#9C27B0' } }}> {/* Morado */}
              <CalendarMonth fontSize="small" sx={{ transition: '0.4s' }} />
              <Typography variant="body2" fontWeight={500}>{formattedDate}</Typography>
            </Box>
            
            <Box sx={{ ...hoverItemSx, '& .MuiSvgIcon-root': { color: '#E91E63' } }}> {/* Rosa */}
              <Schedule fontSize="small" sx={{ transition: '0.4s' }} />
              <Typography variant="body2" fontWeight={700}>{formattedTime}</Typography>
            </Box>
          </Stack>

        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;