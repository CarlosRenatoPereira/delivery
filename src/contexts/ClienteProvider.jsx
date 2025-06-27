// src/contexts/ClienteProvider.js
import React, { createContext, useState } from 'react';

export const ClienteContext = createContext();

export const ClienteProvider = ({ children }) => {
  const [clienteInfo, setClienteInfo] = useState({
    idCliente: null,
    slug: null,
  });

  return (
    <ClienteContext.Provider value={{ clienteInfo, setClienteInfo }}>
      {children}
    </ClienteContext.Provider>
  );
};
