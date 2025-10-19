// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { keycloakCRM } from './pages/keycloak';

import Home from './pages/home';
import CRM from './pages/crm';
import ERP from './pages/erp';
import AreaCliente from './pages/areacliente';

let initialized = false; // 👈 fora do componente

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [roles, setRoles] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (initialized) return; // 👈 evita reexecução
    initialized = true;

    keycloakCRM
      .init({ onLoad: 'login-required' })
      .then(async (auth) => {
        if (auth) {
          console.log('Keycloak autenticado!');
          setAuthenticated(true);
          setToken(keycloakCRM.token);

          console.log('Recuperar Token');
          const parsed = JSON.parse(atob(keycloakCRM.token.split('.')[1]));
          setRoles(parsed.realm_access?.roles || []);

          console.log(parsed);
          
          // 🔹 Obter informações do usuário logado (nome, e-mail, etc)
          const profile = await keycloakCRM.loadUserProfile();
          console.log('Perfil do usuário:', profile);
          setUserInfo(profile);
        } else {
          setAuthenticated(false);
        }
      })
      .catch((err) => console.error('Erro ao inicializar Keycloak:', err));
  }, []);

  if (!authenticated) {
    return <div>Carregando autenticação...</div>;
  }

  return (
    <Router>
      <div style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
        {userInfo && (
          <h3>
            👋 Bem-vindo, <strong>{userInfo.firstName} {userInfo.lastName}</strong> (
            {userInfo.username})
          </h3>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/erp" element={<ERP />} />
        <Route path="/areacliente" element={<AreaCliente />} />
      </Routes>
    </Router>
  );
}

export default App;
