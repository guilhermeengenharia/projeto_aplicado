// src/pages/home.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
        <h1>PoC KeyCloak</h1>
        <Link to="/crm"><button>Ir para CRM</button></Link>
        <Link to="/erp"><button>Ir para ERP</button></Link>
        <Link to="/areacliente"><button>Ir para Area do Cliente</button></Link>
    </div>
  );
}
