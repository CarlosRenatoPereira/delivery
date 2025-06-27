import React, { useRef, useEffect } from 'react';
import '../App.css';
import CardProdutos from './CardProdutos.jsx';

const CardapioCentral = ({ produtos }) => {
    const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0; // para scroll vertical
    }
  }, [produtos]); // sempre que os produtos mudarem
  return (
    <div className="scroll-container"  ref={scrollRef}>
      <div className="scroll-content">
        {produtos.map((produto) => (
          <CardProdutos key={produto.produtoId  } produto={produto} />
        ))}
        <div style={{ height: '310px' }}></div>
      </div>
    </div>
  );
};

export default CardapioCentral;
