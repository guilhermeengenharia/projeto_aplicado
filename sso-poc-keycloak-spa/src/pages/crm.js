import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { keycloakCRM } from './keycloak';

export default function CRM() {
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const chamarAPI = async () => {
      try {
        // Atualiza o token se estiver próximo de expirar
        await keycloakCRM.updateToken(30);

        const token = keycloakCRM.token;
        console.log("Usando token JWT:", token);

        const resp = await fetch('http://localhost:7007/v1/simulacao-protegido', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!resp.ok) {
          throw new Error(`Erro HTTP: ${resp.status}`);
        }

        const data = await resp.json();
        console.log("Resposta da API:", data);
        setResultado(data);
      } catch (error) {
        console.error("Erro ao chamar API protegida:", error);
        setErro(error.message);
      }
    };

    chamarAPI();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>CRM</h1>
      <Link to="/">⬅️ Voltar para Home</Link>

      <div style={{ marginTop: '2rem' }}>
        {erro && <p style={{ color: 'red' }}>Erro: {erro}</p>}
        {resultado ? (
          <pre>{JSON.stringify(resultado, null, 2)}</pre>
        ) : (
          <p>Chamando API protegida...</p>
        )}
      </div>
    </div>
  );
}
