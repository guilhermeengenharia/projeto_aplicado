// src/pages/page2.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Page2() {
  return (
    <div>
      <h1>ERP</h1>
      <Link to="/">Voltar para Home</Link>
    </div>
  );
}
