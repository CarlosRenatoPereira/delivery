import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';


function Informacoes() {
  return (
    <div className="informacoes">
      <div></div>
      <div className='infoHorario'><span>Aberto - 18:00 às 00:00</span></div>
      <div className='infoPedidoMinimo'><span>Pedido mínimo: R$ 15,00</span></div>
      <div className='infoLoja'><span><Link to={"/informacoes"} style={{ textDecoration: 'none' }}>Sobre a Loja</Link></span></div>
    </div>
  );
}

export default Informacoes;
