import React from 'react';
import '../App.css';
import Logo from '../imagens/marcelinho_lanches.png';


function Cabecalho({nome}) {
  return (
    <div className="header">
      <div className="round">
      <img src={Logo} className="imgHeader"/>
      </div>
      <div className='nomeEstabelecimento'><span>{nome}</span></div>
    </div>
  );
}

export default Cabecalho;
