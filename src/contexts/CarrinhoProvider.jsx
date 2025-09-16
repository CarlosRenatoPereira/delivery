// src/context/CarrinhoProvider.js
import React, { createContext, useState, useEffect } from 'react';

export const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = sessionStorage.getItem('carrinho');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('carrinho', JSON.stringify(cart));
  }, [cart]);

  const clearCart = () => {
    setCart([]); // limpa o estado
    sessionStorage.removeItem('carrinho'); // limpa o storage
  };

  return (
    <CarrinhoContext.Provider value={{ cart, setCart, clearCart }}>
      {children}
    </CarrinhoContext.Provider>
  );
};
