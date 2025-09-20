import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App.jsx';
import SobreLoja from './SobreLoja.jsx';
import Carrinho from './Carrinho.jsx';
import AvancarCarrinhoNomeWhatsapp from './AvancarCarrinhoNomeWhatsapp.jsx';
import LoginCadastro from './Cliente/LoginCadastro.jsx';
import CadastroProduto from './Cliente/CadastroProduto.jsx';
import ConfiguracaoCliente from './Cliente/ConfiguracaoCliente.jsx';
import AvancarCarrinhoEnderecoEntrega from  './AvancarCarrinhoEnderecoEntrega.jsx';
import Layout from './../Componentes/Layout.jsx'; // importamos o layout
function Rotas() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/loja/:slug' element={<App/>}></Route>
            <Route path='/SobreLoja' element={<SobreLoja/>}></Route>
            <Route path='/logincadastro' element={<LoginCadastro/>}></Route>
            <Route path='/Carrinho' element={<Carrinho/>}></Route>
            <Route path='/nomewhatsapp' element={<AvancarCarrinhoNomeWhatsapp/>}></Route>
            <Route path='/enderecoentrega' element={<AvancarCarrinhoEnderecoEntrega/>}></Route>

            {/* Rotas que usam o menu (Layout) */}
           <Route element={<Layout />}>
              <Route path='/configuracaoCliente' element={<ConfiguracaoCliente />} />
              <Route path='/cadastroProduto' element={<CadastroProduto />} />
              {/* aqui você pode adicionar outras telas de "Gestão", "Financeiro", etc */}
          </Route>
           {/* Fallback */}
            <Route path='*' element={<h1>Not Found</h1>}></Route>
        </Routes>
    </BrowserRouter>
  );
}


export default Rotas;
