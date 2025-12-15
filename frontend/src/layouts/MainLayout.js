import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Container, Box, Button, IconButton, Avatar, Badge, InputBase,
  Drawer, ListItemButton, ListItemIcon, ListItemText, Paper, alpha, useMediaQuery, useTheme
} from '@mui/material';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  Pets, Settings, Search, Notifications, Close, ArrowForwardIos,
  AccountBalance, Store, Group, CompareArrows, RequestQuote, 
  ReceiptLong, ViewList, Tune, LocalHospital,
  AddCircle, ListAlt, Assessment, History, Description,
  Map, RemoveCircle, FindInPage, CloudUpload,
  MonitorHeart, Biotech, Medication, FolderShared
} from '@mui/icons-material';
import Footer from '../components/Footer';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  // Detectar si es pantalla móvil (menos de 600px)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [openRightMenu, setOpenRightMenu] = useState(false);
  const [openLeftMenu, setOpenLeftMenu] = useState(false);
  const [activeModule, setActiveModule] = useState(null); 

  const toggleRightMenu = () => setOpenRightMenu(!openRightMenu);
  const closeLeftMenu = () => setOpenLeftMenu(false);

  // --- DATA: SUB-MENÚS ---
  const moduleSubOptions = {
    'Pacientes': {
      color: '#D32F2F', 
      icon: <LocalHospital />,
      options: [
        { name: 'Hoja de Vida', icon: <FolderShared />, desc: 'Mascota y/o Paciente', path: '/pacientes/hoja-vida' },
        { name: 'Laboratorios', icon: <Biotech />, desc: 'Exámenes y resultados', path: '/pacientes/laboratorios' },
        { name: 'Consultas Médicas', icon: <MonitorHeart />, desc: 'Historial clínico', path: '/pacientes/consultas' },
        { name: 'Hospitalización', icon: <LocalHospital />, desc: 'Control de internados', path: '/pacientes/hospitalizacion' },
        { name: 'Productos/Servicios', icon: <Medication />, desc: 'Vacunas y procedimientos', path: '/pacientes/servicios' }
      ]
    },
    'Contabilidad': {
      color: '#0078D4', icon: <AccountBalance />,
      options: [
        { name: 'Asientos Contables', icon: <AddCircle />, desc: 'Registrar movimientos', path: '/contabilidad/asientos' },
        { name: 'Plan de Cuentas', icon: <ListAlt />, desc: 'Catálogo PUC', path: '/contabilidad/plan-cuentas' },
        { name: 'Libros Oficiales', icon: <Description />, desc: 'Diario y Mayor', path: '/contabilidad/libros' },
        { name: 'Balances', icon: <Assessment />, desc: 'Estado financiero', path: '/contabilidad/balances' },
        { name: 'Certificados', icon: <History />, desc: 'Retenciones e Iva', path: '/contabilidad/certificados' }
      ]
    },
    'Almacén': {
      color: '#FF7B00', icon: <Store />,
      options: [
        { name: 'Productos', icon: <ListAlt />, desc: 'Catálogo general' },
        { name: 'Categorías', icon: <ViewList />, desc: 'Líneas y grupos' },
        { name: 'Bodegas', icon: <Store />, desc: 'Ubicaciones físicas' },
        { name: 'Ajustes', icon: <Tune />, desc: 'Entradas/Salidas manuales' },
        { name: 'Etiquetas', icon: <Description />, desc: 'Códigos de barras' }
      ]
    },
    'Terceros': {
      color: '#00CC6A', icon: <Group />,
      options: [
        { name: 'Clientes', icon: <Group />, desc: 'Gestión de cartera' },
        { name: 'Proveedores', icon: <Store />, desc: 'Compras y pagos' },
        { name: 'Vendedores', icon: <Badge />, desc: 'Comisiones' },
        { name: 'Zonas', icon: <Map />, desc: 'Rutas y logística' }
      ]
    },
    'Movimientos': {
      color: '#9C27B0', icon: <CompareArrows />,
      options: [
        { name: 'Entradas', icon: <AddCircle />, desc: 'Compras e ingresos' },
        { name: 'Salidas', icon: <RemoveCircle />, desc: 'Ventas y bajas' },
        { name: 'Traslados', icon: <CompareArrows />, desc: 'Entre bodegas' },
        { name: 'Devoluciones', icon: <History />, desc: 'Garantías' }
      ]
    },
    'Cuentas por Pagar': {
      color: '#E91E63', icon: <RequestQuote />,
      options: [
        { name: 'Facturas Compra', icon: <Description />, desc: 'Radicación' },
        { name: 'Pagos / Egresos', icon: <ReceiptLong />, desc: 'Giros bancarios' },
        { name: 'Notas Débito', icon: <Description />, desc: 'Ajustes a proveedores' },
        { name: 'Estado Cuenta', icon: <Assessment />, desc: 'Deudas pendientes' }
      ]
    },
    'Cuentas por Cobrar': {
      color: '#00B7C3', icon: <ReceiptLong />,
      options: [
        { name: 'Facturación', icon: <Description />, desc: 'Venta POS/Electrónica' },
        { name: 'Recibos Caja', icon: <ReceiptLong />, desc: 'Abonos de clientes' },
        { name: 'Notas Crédito', icon: <Description />, desc: 'Devoluciones venta' },
        { name: 'Cartera', icon: <Assessment />, desc: 'Edades y mora' }
      ]
    },
    'Kardex': {
      color: '#607D8B', icon: <ViewList />,
      options: [
        { name: 'Consulta General', icon: <Search />, desc: 'Búsqueda rápida' },
        { name: 'Kardex Valorizado', icon: <Assessment />, desc: 'Costos promedio' },
        { name: 'Lotes', icon: <History />, desc: 'Vencimientos' },
        { name: 'Rastreo', icon: <FindInPage />, desc: 'Trazabilidad' }
      ]
    },
    'Configuración': {
      color: '#424242', icon: <Tune />,
      options: [
        { name: 'Empresa', icon: <Store />, desc: 'Datos generales' },
        { name: 'Usuarios', icon: <Group />, desc: 'Roles y accesos' },
        { name: 'Consecutivos', icon: <ListAlt />, desc: 'Numeración documentos' },
        { name: 'Backups', icon: <CloudUpload />, desc: 'Respaldos de seguridad' }
      ]
    }
  };

  const handleModuleOpen = (moduleName) => {
    setActiveModule(moduleName);
    setOpenLeftMenu(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'transparent' }}>
      
      {/* HEADER RESPONSIVE */}
      <AppBar position="sticky" elevation={0} sx={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.5)', zIndex: 1100 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
           
           {/* LOGO (Ahora visible siempre, pero ajustado) */}
           <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ background: 'linear-gradient(135deg, #0078D4 0%, #00B7C3 100%)', borderRadius: '12px', p: 0.8, mr: 1, boxShadow: '0 4px 10px rgba(0, 120, 212, 0.3)' }}>
                <Pets sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
              </Box>
              <Typography variant="h6" fontWeight={800} color="#333" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Veterinaria<span style={{ color: '#0078D4' }}>App</span>
              </Typography>
           </Box>

           {/* BARRA DE BÚSQUEDA (Oculta en móviles para ahorrar espacio) */}
           <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: '50px', px: 2, py: 0.5, mx: 2,
                width: '300px', transition: '0.3s',
                '&:hover, &:focus-within': { backgroundColor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '320px' }
              }}>
              <Search sx={{ color: '#aaa', mr: 1 }} />
              <InputBase placeholder="Buscar..." sx={{ width: '100%', fontSize: '0.9rem' }} />
            </Box>

           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Botón Ajustes: En móvil solo icono, en PC texto+icono */}
              {isMobile ? (
                 <IconButton onClick={toggleRightMenu} sx={{ color: '#0078D4' }}><Settings /></IconButton>
              ) : (
                 <Button onClick={toggleRightMenu} startIcon={<Settings />}>Ajustes</Button>
              )}

              <IconButton sx={{ color: '#555' }}><Badge variant="dot" color="error"><Notifications /></Badge></IconButton>
              <Avatar alt="Dr. Hector" src="/broken-image.jpg" sx={{ width: { xs: 32, md: 38 }, height: { xs: 32, md: 38 }, bgcolor: '#0078D4', border: '2px solid white' }}>H</Avatar>
            </Box>
        </Toolbar>
      </AppBar>

      {/* --- MENU IZQUIERDO (RESPONSIVE) --- */}
      <Drawer
        anchor="left"
        open={openLeftMenu}
        onClose={closeLeftMenu}
        sx={{
          '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
          '& .MuiDrawer-paper': {
            // ANCHO DINÁMICO: 100% en celular, 340px en PC
            width: { xs: '100%', sm: 340 }, 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(40px)', 
            borderRight: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '20px 0 60px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        {activeModule && moduleSubOptions[activeModule] ? (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* CABECERA */}
            <Box sx={{ p: 4, pb: 6, position: 'relative', background: `linear-gradient(135deg, ${moduleSubOptions[activeModule].color} 0%, ${alpha(moduleSubOptions[activeModule].color, 0.7)} 100%)`, color: 'white', clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.25)', borderRadius: '16px', display: 'inline-flex', backdropFilter: 'blur(5px)', mb: 2 }}>
                    {React.cloneElement(moduleSubOptions[activeModule].icon, { sx: { fontSize: 32 } })}
                  </Box>
                  <Typography variant="h5" fontWeight={900}>{activeModule}</Typography>
                </Box>
                <IconButton onClick={closeLeftMenu} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}><Close /></IconButton>
              </Box>
            </Box>

            {/* LISTA DE OPCIONES */}
            <Box sx={{ p: 2, mt: -2, overflowY: 'auto' }}>
              {moduleSubOptions[activeModule].options.map((opt, index) => (
                <ListItemButton 
                  key={index}
                  onClick={() => {
                    if (opt.path) { navigate(opt.path); closeLeftMenu(); }
                  }}
                  sx={{ 
                    mb: 1.5, borderRadius: '16px', border: '1px solid transparent', transition: 'all 0.3s ease',
                    '&:hover': { 
                      bgcolor: alpha(moduleSubOptions[activeModule].color, 0.08), transform: 'translateX(5px)', borderColor: alpha(moduleSubOptions[activeModule].color, 0.2),
                      '& .MuiListItemIcon-root': { color: moduleSubOptions[activeModule].color, transform: 'scale(1.1)' }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 45 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: alpha(moduleSubOptions[activeModule].color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: moduleSubOptions[activeModule].color }}>
                      {React.cloneElement(opt.icon, { fontSize: 'small' })}
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={opt.name} secondary={opt.desc} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.95rem' }} secondaryTypographyProps={{ fontSize: '0.75rem' }} />
                  <ArrowForwardIos sx={{ fontSize: 14, color: moduleSubOptions[activeModule].color }} />
                </ListItemButton>
              ))}
            </Box>
          </Box>
        ) : null}
      </Drawer>

      {/* MENU DERECHO (AJUSTES RESPONSIVE) */}
      <Drawer anchor="right" open={openRightMenu} onClose={toggleRightMenu} 
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 360 }, background: 'rgba(243, 243, 243, 0.9)', backdropFilter: 'blur(30px)' } }}
      >
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Ajustes</Typography>
                <IconButton onClick={toggleRightMenu}><Close /></IconButton>
            </Box>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }}>
               <ListItemButton><ListItemText primary="Configuración General" /></ListItemButton>
            </Paper>
        </Box>
      </Drawer>

      <Container component="main" sx={{ mt: { xs: 2, md: 4 }, mb: 4, flexGrow: 1 }}>
        <Box sx={{ animation: 'fadeInUp 0.8s ease-out' }}>
          <Outlet context={{ handleModuleOpen }} />
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout;