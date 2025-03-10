import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App.jsx';
import SobreLoja from './SobreLoja.jsx';
import Carrinho from './Carrinho.jsx';
function Rotas() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<App/>}></Route>
        <Route path='/SobreLoja' element={<SobreLoja/>}></Route>
        <Route path='/Carrinho' element={<Carrinho/>}></Route>
        <Route path='*' element={<h1>Not Found</h1>}></Route>
    </Routes>
    </BrowserRouter>
  );
}


export default Rotas;
