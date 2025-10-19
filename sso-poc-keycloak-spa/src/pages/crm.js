// src/pages/page1.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Page1() {
  return (
    <div>
      <h1>CRM</h1>
      <Link to="/">Voltar para Home</Link>
    </div>
  );
}
