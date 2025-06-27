import React from 'react';
import './Loading.css'; // estilo opcional para animação

function Loading({ mensagem = "Carregando..." }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>{mensagem}</p>
    </div>
  );
}

export default Loading;
