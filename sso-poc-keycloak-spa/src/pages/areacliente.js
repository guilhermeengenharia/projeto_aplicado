// src/pages/page3.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Page3() {
  return (
    <div>
      <h1>Area do Cliente</h1>
      <Link to="/">Voltar para Home</Link>
    </div>
  );
}
