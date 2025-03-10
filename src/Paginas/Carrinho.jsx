import React, {useRef, useState,useEffect } from "react";
import "./Carrinho.css";
import BotaoMaisMenosLixeira from '../Componentes/BotaoMaisMenosLixeira.jsx'
import Logo from '../imagens/marcelinho_lanches.png';
const products = [
  { id: 1, name: "Lanche nº 1", price: 14.0 },
  { id: 2, name: "Lanche nº 2", price: 15.5 },
  // Adicione mais produtos aqui
];

const Carrinho = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    setTotalPrice(totalPrice + product.price);
  };

  return (
    <div className="app">
      <h1>Food Delivery</h1>
      <div className="products">
        {products.map((product) => (
          <div key={product.id} className="product">
            <span>{product.name}</span>
            <span>R$ {product.price.toFixed(2)}</span>
            <button onClick={() => addToCart(product)}>Adicionar ao Carrinho</button>
          </div>
        ))}
      </div>
      <div className="cart">
        <h2>Carrinho</h2>
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={Logo} style={{width:"28px", height:"28px"}}/>
            <span>{item.name}</span>
            <span>R$ {item.price.toFixed(2)}</span>
            <BotaoMaisMenosLixeira/>
          </div>
        ))}
        <h3>Total: R$ {totalPrice.toFixed(2)}</h3>
        <AlwaysScrollToBottom />
      </div>
    </div>
  );
};

export default Carrinho;
