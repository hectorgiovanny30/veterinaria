import React, { useState, useMemo } from 'react';
// --- IMPORTS VISUALES ---
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, IconButton, InputBase, Button, alpha,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, 
  MenuItem, Select, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio,
  Card, CardContent, InputAdornment, Tooltip, Avatar, Backdrop, CircularProgress, LinearProgress
} from '@mui/material';

// --- IMPORTS ICONOS ---
import { 
  Search, FilterList, KeyboardArrowDown, AccountBalance, 
  Settings, Edit, Delete, Label, Numbers,
  CheckCircle, WarningAmber, AutoAwesome, 
  AddCircle, RemoveCircleOutline, CalendarMonth, Lock, LockOpen, 
  FolderOpen, InsertDriveFile, MenuBook, PostAdd, AccountTree, SubdirectoryArrowRight,
  Tag, Category, SwapVert, Adjust, CloudDownload, SaveAs, Memory
} from '@mui/icons-material';

import confetti from 'canvas-confetti';
import { useNotification } from '../context/NotificationContext';

// --- BASE DE DATOS MAESTRA PUC (Simulación Ampliada) ---
const PUC_MAESTRO_WEB = {
  '1': { nombre: 'ACTIVO', naturaleza: 'Débito' },
  '11': { nombre: 'DISPONIBLE', naturaleza: 'Débito' },
  '1105': { nombre: 'CAJA', naturaleza: 'Débito' },
  '1110': { nombre: 'BANCOS', naturaleza: 'Débito' },
  '1125': { nombre: 'FONDOS ROTATORIOS', naturaleza: 'Débito' },
  '13': { nombre: 'DEUDORES', naturaleza: 'Débito' },
  '1305': { nombre: 'CLIENTES', naturaleza: 'Débito' },
  '2': { nombre: 'PASIVO', naturaleza: 'Crédito' },
  '21': { nombre: 'OBLIGACIONES FINANCIERAS', naturaleza: 'Crédito' },
  '2120': { nombre: 'ACEPTACIONES BANCARIAS O PAGARES', naturaleza: 'Crédito' },
  '3': { nombre: 'PATRIMONIO', naturaleza: 'Crédito' },
  '4': { nombre: 'INGRESOS', naturaleza: 'Crédito' },
  '5': { nombre: 'GASTOS', naturaleza: 'Débito' },
  '6': { nombre: 'COSTOS DE VENTAS', naturaleza: 'Débito' }
};

const PlanCuentasPage = () => {
  // --- ESTADOS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedBook, setSelectedBook] = useState('Local');
  const { showNotification } = useNotification(); 

  const [openConfig, setOpenConfig] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteEffect, setDeleteEffect] = useState(false);
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [newAccount, setNewAccount] = useState({
    codigo: '', nombre: '', naturaleza: 'Débito', tipo: 'Detalle', nivel: 1, padre: ''
  });
  const [creationMode, setCreationMode] = useState('manual'); 

  const levelColors = ['#0078D4', '#FF7B00', '#00CC6A', '#9C27B0', '#E91E63', '#607D8B', '#FFC107'];

  // --- DATOS SIMULADOS ---
  const dataByYear = {
    2025: {
      niveles: [
        { nivel: 1, nombre: 'Clase', digitos: 1 },
        { nivel: 2, nombre: 'Grupo', digitos: 2 },
        { nivel: 3, nombre: 'Cuenta', digitos: 4 },
        { nivel: 4, nombre: 'Subcuenta', digitos: 6 },
        { nivel: 5, nombre: 'Auxiliar', digitos: 8 }
      ],
      cuentas: [
        { codigo: '1', nombre: 'ACTIVO', naturaleza: 'Débito', nivel: 1, tipo: 'Titulo', tipo_cuenta: 'Local' },
        { codigo: '11', nombre: 'DISPONIBLE', naturaleza: 'Débito', nivel: 2, tipo: 'Titulo', tipo_cuenta: 'Local' },
        { codigo: '1105', nombre: 'CAJA', naturaleza: 'Débito', nivel: 3, tipo: 'Titulo', tipo_cuenta: 'Local' },
        { codigo: '110505', nombre: 'CAJA GENERAL', naturaleza: 'Débito', nivel: 4, tipo: 'Detalle', tipo_cuenta: 'Local' },
      ]
    },
    2024: { niveles: [{ nivel: 1, nombre: 'Clase', digitos: 1 }], cuentas: [] }
  };

  const currentData = dataByYear[selectedYear] || { niveles: [], cuentas: [] };
  const [niveles, setNiveles] = useState(currentData.niveles);
  const [cuentas, setCuentas] = useState(currentData.cuentas);

  const cuentasProcesadas = useMemo(() => {
    let filtradas = cuentas.filter(c => c.tipo_cuenta === selectedBook);
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtradas = filtradas.filter(c => 
        c.codigo.includes(lowerSearch) || c.nombre.toLowerCase().includes(lowerSearch)
      );
    }
    return filtradas.sort((a, b) => a.codigo.localeCompare(b.codigo, undefined, { numeric: true }));
  }, [cuentas, selectedBook, searchTerm]);

  const isLocked = cuentasProcesadas.length > 0;

  // --- LÓGICA ESTRUCTURA ---
  const handleChangeNivel = (index, field, value) => {
    if (isLocked && field === 'digitos') { showNotification('error', 'Integridad de datos: No se puede cambiar longitud.'); return; }
    const newNiveles = [...niveles]; newNiveles[index][field] = value; setNiveles(newNiveles);
  };
  const handleAddLevel = () => { if(isLocked) return; setNiveles([...niveles, { nivel: niveles.length+1, nombre: `Nivel ${niveles.length+1}`, digitos: 0 }]); };
  const handleRemoveLevel = () => { if(isLocked) return; if(niveles.length>1) setNiveles(niveles.slice(0, -1)); };

  // --- LÓGICA DE APERTURA DE MODAL ---
  const handleOpenManualCreate = () => {
    setIsEditing(false); 
    setCreationMode('manual');
    setNewAccount({ codigo: '', nombre: '', naturaleza: 'Débito', tipo: 'Titulo', nivel: 1, padre: '' });
    setOpenCreate(true);
  };

  const handleEditAccount = (cuenta) => {
    setIsEditing(true); 
    setCreationMode('manual'); 
    setNewAccount({ ...cuenta, padre: '' });
    setOpenCreate(true);
  };

  const handleSmartClick = (cuentaPadre) => {
    setIsEditing(false);
    if (cuentaPadre.tipo === 'Titulo') {
      const nextLevelIndex = niveles.findIndex(n => n.nivel === cuentaPadre.nivel) + 1;
      if (nextLevelIndex < niveles.length) {
         setCreationMode('child');
         const nextLevelObj = niveles[nextLevelIndex];
         setNewAccount({
           codigo: cuentaPadre.codigo, nombre: '', naturaleza: cuentaPadre.naturaleza, 
           tipo: nextLevelObj.nivel === niveles.length ? 'Detalle' : 'Titulo',
           nivel: nextLevelObj.nivel, padre: cuentaPadre.codigo
         });
         setOpenCreate(true);
      } else {
         showNotification('warning', 'Nivel máximo alcanzado.');
      }
    } else {
      setCreationMode('sibling');
      const nextCode = (parseInt(cuentaPadre.codigo) + 1).toString();
      setNewAccount({
        codigo: nextCode, nombre: '', naturaleza: cuentaPadre.naturaleza, 
        tipo: 'Detalle', nivel: cuentaPadre.nivel, padre: ''
      });
      setOpenCreate(true);
    }
  };

  // --- 🧠 MAGIA: AUTO-DETECTAR NIVEL AL ESCRIBIR ---
  const handleCodeChange = (e) => {
    const val = e.target.value;
    // Buscar qué nivel coincide con la longitud de lo escrito
    const matchingLevel = niveles.find(n => parseInt(n.digitos) === val.length);
    
    setNewAccount(prev => ({
      ...prev,
      codigo: val,
      // Si la longitud coincide con un nivel, lo seleccionamos automáticamente
      nivel: matchingLevel ? matchingLevel.nivel : prev.nivel
    }));
  };

  const handleSmartSave = async () => {
    const codigoInput = newAccount.codigo.trim();
    const nombreInput = newAccount.nombre.toUpperCase();

    // Validación
    const nivelConfig = niveles.find(n => n.nivel === newAccount.nivel);
    if (nivelConfig && codigoInput.length !== parseInt(nivelConfig.digitos)) {
        showNotification('error', `El código debe tener ${nivelConfig.digitos} dígitos para el Nivel ${newAccount.nivel}.`);
        return;
    }

    setOpenCreate(false);

    if (isEditing) {
        const cuentasActualizadas = cuentas.map(c => {
            if (c.codigo === codigoInput && c.tipo_cuenta === selectedBook) {
                return { ...c, nombre: nombreInput, naturaleza: newAccount.naturaleza, tipo: newAccount.tipo };
            }
            return c;
        });
        setCuentas(cuentasActualizadas);
        showNotification('success', 'Cuenta actualizada.');
        return;
    }

    setIsAiLoading(true);
    setLoadingText('Analizando árbol contable...');
    
    const nuevasCuentasTemp = [];
    const nivelesOrdenados = [...niveles].sort((a,b) => parseInt(a.digitos) - parseInt(b.digitos));

    for (let nivelObj of nivelesOrdenados) {
        const digitosNivel = parseInt(nivelObj.digitos);
        if (digitosNivel >= codigoInput.length) break;

        const codigoPadre = codigoInput.substring(0, digitosNivel);
        const existeEnTabla = cuentas.some(c => c.codigo === codigoPadre && c.tipo_cuenta === selectedBook);
        const existeEnTemp = nuevasCuentasTemp.some(c => c.codigo === codigoPadre);

        if (!existeEnTabla && !existeEnTemp) {
            setLoadingText(`Creando jerarquía: ${codigoPadre}...`);
            await new Promise(r => setTimeout(r, 600));

            const dataWeb = PUC_MAESTRO_WEB[codigoPadre];
            if (dataWeb) {
                nuevasCuentasTemp.push({
                    codigo: codigoPadre, nombre: dataWeb.nombre, naturaleza: dataWeb.naturaleza,
                    tipo: 'Titulo', nivel: nivelObj.nivel, tipo_cuenta: selectedBook
                });
            } else {
                nuevasCuentasTemp.push({
                    codigo: codigoPadre, nombre: `TITULO GENERADO ${codigoPadre}`, naturaleza: newAccount.naturaleza,
                    tipo: 'Titulo', nivel: nivelObj.nivel, tipo_cuenta: selectedBook
                });
            }
        }
    }

    setLoadingText('Finalizando...');
    await new Promise(r => setTimeout(r, 400));

    const cuentaFinal = { ...newAccount, codigo: codigoInput, nombre: nombreInput, tipo_cuenta: selectedBook };
    setCuentas([...cuentas, ...nuevasCuentasTemp, cuentaFinal]);

    setIsAiLoading(false);
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
    showNotification('success', nuevasCuentasTemp.length > 0 ? `Se generaron ${nuevasCuentasTemp.length} niveles faltantes.` : 'Cuenta creada.');
  };

  return (
    <Box sx={{ p: 1 }}>
      
      {/* LOADING SCREEN */}
      <Backdrop sx={{ color: '#fff', zIndex: 9999, flexDirection: 'column' }} open={isAiLoading}>
         <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={90} thickness={2} sx={{ color: '#00E5FF' }} />
            <Memory sx={{ position: 'absolute', fontSize: 45, color: 'white', animation: 'spin 2s infinite linear', '@keyframes spin': { '0%': {transform: 'rotate(0deg)'}, '100%': {transform: 'rotate(360deg)'}} }} />
         </Box>
         <Typography variant="h5" fontWeight={800} sx={{ mt: 3, letterSpacing: 1 }}>ANALIZANDO ÁRBOL...</Typography>
         <Typography variant="body1" sx={{ mt: 1, opacity: 0.8, fontStyle: 'italic' }}>{loadingText}</Typography>
         <LinearProgress sx={{ width: '300px', mt: 3, borderRadius: 5, height: 6, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#00E5FF' } }} />
      </Backdrop>

      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(0,120,212,0.1)', color: '#0078D4' }}><AccountBalance sx={{ fontSize: 30 }} /></Box>
            <Typography variant="h4" fontWeight={900} sx={{ background: 'linear-gradient(90deg, #0078D4 0%, #00B7C3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Plan de Cuentas</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">Gestión inteligente del árbol contable.</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.5, borderRadius: '12px', border: '1px solid #ddd', bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, borderRight: '1px solid #eee', pr: 3 }}>
              <CalendarMonth sx={{ color: '#0078D4', mr: 1 }} />
              <Typography variant="caption" fontWeight={700} sx={{ mr: 1, color: '#888' }}>AÑO</Typography>
              <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} variant="standard" disableUnderline sx={{ fontWeight: 800 }}><MenuItem value={2026}>2026</MenuItem><MenuItem value={2025}>2025</MenuItem><MenuItem value={2024}>2024</MenuItem></Select>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MenuBook sx={{ color: '#E91E63', mr: 1 }} />
              <Typography variant="caption" fontWeight={700} sx={{ mr: 1, color: '#888' }}>LIBRO</Typography>
              <Select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} variant="standard" disableUnderline sx={{ fontWeight: 800, color: '#E91E63' }}><MenuItem value="Local">Local</MenuItem><MenuItem value="Niif">NIIF</MenuItem><MenuItem value="Fiscal">Fiscal</MenuItem></Select>
            </Box>
          </Paper>

          <Button variant="outlined" onClick={() => setOpenConfig(true)} sx={{ borderRadius: '12px', fontWeight: 700, px: 2, borderColor: '#0078D4', color: '#0078D4', borderWidth: 2, '&:hover': { borderWidth: 2, bgcolor: 'rgba(0,120,212,0.05)', '& .gear-icon': { transform: 'rotate(180deg)' } } }}>
            <Settings className="gear-icon" sx={{ mr: 1, transition: 'transform 0.5s' }} /> Estructura
          </Button>

          <Button variant="contained" onClick={handleOpenManualCreate} startIcon={<PostAdd />} sx={{ borderRadius: '12px', fontWeight: 700, px: 3, background: 'linear-gradient(135deg, #0078D4 0%, #00B7C3 100%)', boxShadow: '0 4px 15px rgba(0, 120, 212, 0.3)', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%': { boxShadow: '0 0 0 0 rgba(0, 120, 212, 0.4)' }, '70%': { boxShadow: '0 0 0 10px rgba(0, 120, 212, 0)' }, '100%': { boxShadow: '0 0 0 0 rgba(0, 120, 212, 0)' } } }}>
            Nueva Cuenta
          </Button>
        </Box>
      </Box>

      {/* BARRA BUSCADOR */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, bgcolor: '#f5f7fa', borderRadius: '12px', px: 2, py: 1.2, transition: '0.3s', '&:focus-within': { bgcolor: 'white', boxShadow: '0 0 0 2px #0078D4' } }}>
          <Search sx={{ color: '#aaa', mr: 1 }} />
          <InputBase placeholder={`Buscar cuenta por código o nombre...`} fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </Box>
        <Button startIcon={<FilterList />} sx={{ bgcolor: 'white', color: '#555', border: '1px solid #eee', borderRadius: '12px' }}>Filtrar</Button>
      </Paper>

      {/* TABLA ORDENADA */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '24px', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(0,0,0,0.05)', py: 2.5 } }}>
              <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0078D4', fontWeight: 800, '&:hover svg': { transform: 'translateY(-3px)' } }}><Tag sx={{ fontSize: 18, transition: '0.3s' }} /> CÓDIGO</Box></TableCell>
              <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#555', fontWeight: 800, '&:hover svg': { transform: 'rotate(15deg)' } }}><Category sx={{ fontSize: 18, transition: '0.3s' }} /> NOMBRE</Box></TableCell>
              <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#555', fontWeight: 800, '&:hover svg': { transform: 'scale(1.2)' } }}><Adjust sx={{ fontSize: 18, transition: '0.3s' }} /> TIPO</Box></TableCell>
              <TableCell align="center"><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#555', fontWeight: 800, '&:hover svg': { transform: 'rotate(180deg)' } }}><SwapVert sx={{ fontSize: 18, transition: '0.3s' }} /> NAT</Box></TableCell>
              <TableCell align="center" sx={{ color: '#555', fontWeight: 800 }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cuentasProcesadas.length > 0 ? (
                cuentasProcesadas.map((row) => (
                <TableRow key={row.codigo} sx={{ transition: 'all 0.2s', '&:hover': { transform: 'scale(1.005)', boxShadow: '0 8px 25px rgba(0,0,0,0.08)', bgcolor: 'white !important', zIndex: 10, position: 'relative', borderRadius: '12px' }, bgcolor: row.tipo === 'Titulo' ? 'rgba(0, 120, 212, 0.02)' : 'transparent' }}>
                    <TableCell sx={{ borderBottom: 'none' }}>
                        <Tooltip title="Clic para crear Hija/Hermana">
                          <Box onClick={() => handleSmartClick(row)} sx={{ bgcolor: 'white', border: '1px solid #eee', borderRadius: '8px', px: 1.5, py: 0.5, fontWeight: 700, color: '#0078D4', cursor: 'pointer', display: 'inline-block' }}>{row.codigo}</Box>
                        </Tooltip>
                    </TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', pl: (row.nivel - 1) * 3 }}> 
                          {row.tipo === 'Titulo' ? <FolderOpen sx={{ color: '#FFB74D', mr: 1.5 }} /> : <InsertDriveFile sx={{ color: '#90CAF9', mr: 1.5 }} />}
                          <Typography variant="body2" fontWeight={row.tipo === 'Titulo' ? 700 : 500} color={row.tipo === 'Titulo' ? '#2c3e50' : '#555'}>{row.nombre}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: 'none' }}>
                       <Chip label={row.tipo} size="small" variant={row.tipo === 'Titulo' ? 'filled' : 'outlined'} sx={{ fontWeight: 700, borderRadius: '6px', bgcolor: row.tipo === 'Titulo' ? '#E3F2FD' : 'transparent', color: row.tipo === 'Titulo' ? '#0078D4' : '#78909c' }} />
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: 'none' }}>
                      <Tooltip title={row.naturaleza}><Avatar sx={{ width: 28, height: 28, fontSize: '0.8rem', fontWeight: 800, mx: 'auto', bgcolor: row.naturaleza === 'Débito' ? alpha('#00CC6A', 0.15) : alpha('#E91E63', 0.15), color: row.naturaleza === 'Débito' ? '#008f4a' : '#c2185b', border: `1px solid ${row.naturaleza === 'Débito' ? '#00CC6A' : '#E91E63'}` }}>{row.naturaleza.charAt(0)}</Avatar></Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: 'none' }}>
                      <IconButton onClick={() => handleEditAccount(row)} size="small" sx={{ color: '#0078D4', '&:hover': { bgcolor: alpha('#0078D4', 0.1) } }}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: '#E91E63', '&:hover': { bgcolor: alpha('#E91E63', 0.1) } }}><Delete fontSize="small" /></IconButton>
                    </TableCell>
                </TableRow>
                ))
            ) : (<TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}><Typography variant="h6" color="text.secondary">No hay cuentas</Typography></TableCell></TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- MODAL ESTRUCTURA --- */}
      <Dialog open={openConfig} onClose={() => setOpenConfig(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(25px)' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
          <Box sx={{ p: 1.5, borderRadius: '14px', background: isLocked ? '#eee' : 'linear-gradient(135deg, #0078D4 0%, #00B7C3 100%)' }}>{isLocked ? <Lock sx={{ fontSize: 26, color: '#999' }} /> : <AutoAwesome sx={{ fontSize: 26, color: 'white' }} />}</Box>
          <Box><Typography variant="h5" fontWeight={900}>{isLocked ? 'Estructura Protegida' : 'Diseño'}</Typography></Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 4 }}>
          {isLocked ? (
             <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: '16px', bgcolor: '#fff5f5', borderLeft: '6px solid #ff4d4f', display: 'flex', gap: 2, alignItems: 'center' }}><WarningAmber sx={{ color: '#ff4d4f', fontSize: 28 }} /><Typography variant="body2" fontWeight={600} color="#ff4d4f">Integridad Activa: No se puede modificar.</Typography></Paper>
          ) : (
            <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: '16px', bgcolor: '#f0f9ff', borderLeft: '6px solid #0078D4', display: 'flex', gap: 2, alignItems: 'center' }}><CheckCircle sx={{ color: '#0078D4', fontSize: 28 }} /><Typography variant="body2" fontWeight={600} color="#0078D4">Modo Diseño: Libre.</Typography></Paper>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, gap: 1 }}>
            <Button onClick={handleRemoveLevel} disabled={isLocked} color="error" startIcon={<RemoveCircleOutline />}>Quitar</Button>
            <Button onClick={handleAddLevel} disabled={isLocked} color="primary" startIcon={<AddCircle />}>Agregar</Button>
          </Box>
          <Grid container spacing={2}>
              {niveles.map((n, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'rgba(255,255,255,0.6)' }}>
                    <CardContent>
                        <Typography variant="overline" fontWeight={800} color={levelColors[index]}>NIVEL {n.nivel}</Typography>
                        <TextField fullWidth variant="standard" value={n.nombre} onChange={(e) => handleChangeNivel(index, 'nombre', e.target.value)} InputProps={{ disableUnderline: true, sx: { fontWeight: 800 } }} />
                        <Box sx={{ mt: 1, bgcolor: alpha(levelColors[index] || '#ccc', 0.1), p: 1, borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <Numbers sx={{ fontSize: 18, color: levelColors[index] }} />
                            <TextField type="number" value={n.digitos} disabled={isLocked} onChange={(e) => handleChangeNivel(index, 'digitos', e.target.value)} variant="standard" inputProps={{ style: { textAlign: 'right', fontWeight: 800 } }} InputProps={{ disableUnderline: true, sx: { width: 40 } }} />
                        </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}><Button onClick={() => setOpenConfig(false)} sx={{ fontWeight: 700 }}>Cerrar</Button></DialogActions>
      </Dialog>

      {/* --- MODAL CREAR/EDITAR --- */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '28px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(30px)' } }}>
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 5, pb: 2 }}>
           <Box sx={{ width: 60, height: 60, borderRadius: '20px', background: 'linear-gradient(135deg, #0078D4 0%, #00B7C3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
             {isEditing ? <Edit sx={{ color: 'white', fontSize: 32 }} /> : (creationMode === 'manual' ? <PostAdd sx={{ color: 'white', fontSize: 32 }} /> : <AccountTree sx={{ color: 'white', fontSize: 32 }} />)}
           </Box>
           <Typography variant="h5" fontWeight={900} sx={{ color: '#2c3e50' }}>{isEditing ? 'Editar Cuenta' : 'Nueva Cuenta'}</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 5, pb: 4 }}>
          <Grid container spacing={3}>
             <Grid item xs={12}>
                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}><Chip label={`Nivel ${newAccount.nivel}`} size="small" sx={{ bgcolor: '#E3F2FD', color: '#0078D4', fontWeight: 800, mr: 1 }} /></Box>
                <TextField 
                  fullWidth value={newAccount.codigo}
                  disabled={isEditing} 
                  onChange={handleCodeChange} // <--- AHORA SÍ CONECTADO A LA AUTO-DETECCIÓN
                  placeholder="Ej: 112505" variant="filled" label="Código Contable"
                  InputProps={{ disableUnderline: true, sx: { borderRadius: '16px', bgcolor: isEditing ? '#e0e0e0' : '#F4F6F8', fontWeight: 800, fontSize: '1.2rem' } }}
                />
             </Grid>
             <Grid item xs={12}>
                <TextField 
                  fullWidth value={newAccount.nombre}
                  onChange={(e) => setNewAccount({...newAccount, nombre: e.target.value.toUpperCase()})} 
                  placeholder="NOMBRE" variant="filled" label="Nombre"
                  InputProps={{ disableUnderline: true, sx: { borderRadius: '16px', bgcolor: '#F4F6F8', fontWeight: 600 } }}
                />
             </Grid>
             <Grid item xs={6}>
                <FormControl fullWidth variant="filled" sx={{ '& .MuiFilledInput-root': { borderRadius: '16px', bgcolor: '#F4F6F8', '&:before': {border: 'none'} } }}>
                  <InputLabel>Tipo</InputLabel>
                  <Select value={newAccount.tipo} onChange={(e) => setNewAccount({...newAccount, tipo: e.target.value})}><MenuItem value="Titulo">📁 Título</MenuItem><MenuItem value="Detalle">📄 Detalle</MenuItem></Select>
                </FormControl>
             </Grid>
             <Grid item xs={6}>
                <Box sx={{ p: 1, borderRadius: '16px', border: '1px solid #eee', display: 'flex', justifyContent: 'center' }}>
                  <RadioGroup row value={newAccount.naturaleza} onChange={(e) => setNewAccount({...newAccount, naturaleza: e.target.value})}>
                    <FormControlLabel value="Débito" control={<Radio size="small" color="success"/>} label={<Typography variant="caption" fontWeight={700}>Débito</Typography>} />
                    <FormControlLabel value="Crédito" control={<Radio size="small" color="error"/>} label={<Typography variant="caption" fontWeight={700}>Crédito</Typography>} />
                  </RadioGroup>
                </Box>
             </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0, justifyContent: 'center' }}>
          <Button onClick={() => setOpenCreate(false)} sx={{ fontWeight: 700, color: '#aaa', mr: 2 }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSmartSave} startIcon={isEditing ? <SaveAs /> : <AutoAwesome />} sx={{ borderRadius: '14px', px: 6, py: 1.5, fontWeight: 800, background: 'linear-gradient(90deg, #0078D4 0%, #00B7C3 100%)' }}>
             {isEditing ? 'ACTUALIZAR' : 'GUARDAR'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanCuentasPage;