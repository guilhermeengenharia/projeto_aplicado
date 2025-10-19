// src/pages/keycloak.js

import Keycloak from 'keycloak-js';

const keycloakCRM = new Keycloak({
    url: 'http://localhost:8080/',
    realm: 'produtos',
    clientId: 'CRM',
  });

  const keycloakERP = new Keycloak({
    url: 'http://localhost:8080/',
    realm: 'produtos',
    clientId: 'ERP',
  });

  const keycloakAreaCliente = new Keycloak({
    url: 'http://localhost:8080/',
    realm: 'produtos',
    clientId: 'AreaCliente',
  });
  
  export { keycloakCRM, keycloakERP, keycloakAreaCliente };