import React from 'react';
import '../App.css';
import CardProdutos from './CardProdutos.jsx';

const CardapioCentral = () => {
  return (
    <div className="scroll-container">
      <div className="scroll-content">
      <CardProdutos/>
      <CardProdutos/>
      <CardProdutos/>
      <CardProdutos/>
      <CardProdutos/>
      <CardProdutos/>
      <CardProdutos/>
      <CardProdutos/>
      <CardProdutos/>
      <CardProdutos/>
      </div>
    </div>
  );
};

export default CardapioCentral;