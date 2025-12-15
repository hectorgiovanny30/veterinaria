import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import PlanCuentasPage from './pages/PlanCuentasPage';
// 1. IMPORTAR EL PROVEEDOR
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* 2. ENVOLVER TODO DENTRO DEL PROVIDER */}
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/contabilidad/plan-cuentas" element={<PlanCuentasPage />} />
              <Route path="*" element={<h2 style={{textAlign:'center', marginTop:'50px'}}>404</h2>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>

    </ThemeProvider>
  );
}

export default App;