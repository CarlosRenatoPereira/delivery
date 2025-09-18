import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';


function Informacoes() {
  return (
    <div className="informacoes">
      <div className='infoHorario'><span>Aberto - 18:00 às 00:00</span></div>
      <div className='infoPedidoMinimo'><span>Pedido mínimo: R$ 15,00</span></div>
      <div className='infoLoja'><span><Link to={"/SobreLoja"} style={{ textDecoration: 'none' }}>Sobre a Loja</Link></span></div>
    </div>
  );
}

export default Informacoes;
