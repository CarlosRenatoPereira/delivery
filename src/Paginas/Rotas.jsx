import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App.jsx';
import SobreLoja from './SobreLoja.jsx';
function Rotas() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/loja' element={<App/>}></Route>
        <Route path='/informacoes' element={<SobreLoja/>}></Route>
        <Route path='*' element={<h1>Not Found</h1>}></Route>
    </Routes>
    </BrowserRouter>
  );
}


export default Rotas;
