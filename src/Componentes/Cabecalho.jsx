import React from 'react';
import '../App.css';
import Logo from '../imagens/marcelinho_lanches.png';


function Cabecalho() {
  return (
    <div className="header">
      <div></div>
      <div className="round">
      <img src={Logo} className="imgHeader"/>
      </div>
      <div className='nomeEstabelecimento'><span>Marcelinho Lanches</span></div>
    </div>
  );
}

export default Cabecalho;
