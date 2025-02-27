import React from 'react';
import { Icon } from '@iconify/react';
import './SobreLoja.css';
import { Link } from 'react-router-dom';
import  Pix  from '../imagens/logo-pix-256.png';
import  Dinheiro  from '../imagens/dinheiro.png';
import  Cartao  from './../imagens/cartao-de-credito.png';
function SobreLoja() {
    return (
        <div className='container'>
            <div className='topo'>
                <div></div>
               <Link to={"/loja"} style={{ textDecoration: 'none' }}><div><span style={{ fontSize: "25px", color:"red"}}><Icon icon="mdi:arrow-back" /></span></div></Link>
                <div style={{fontStyle:"Arial", fontSize:"15px"}}><pre><span> Informações gerais</span></pre></div>
            </div>
            <div className='nomeLoja'>
                <div></div>
                <span>Marcelinho Lanches</span>
            </div>
            <div className='horarioAtendimentoFormaPagamento'>
                <div></div>
                <span>Endereço</span>
            </div>
            <div className='endereco'>
                <div></div>
                <span>Av. Brigadeiro Eduardo Gomes, 1111, Glória, Belo Horizonte - MG, CEP 30870100</span>
            </div>
            <div className='horarioAtendimentoFormaPagamento'>
                <div></div>
                 <span>Horário de funcionamento</span>
            </div>
            <div className='containerHorarios'>
                <div></div>
                <div className='horarios'>
                    <span>Domingo: 18h30m às 22h45m</span>
                    <span>Terça-feira: 18h30m às 22h45m</span>
                    <span>Quarta-feira: 18h30m às 22h45m</span>
                    <span>Quinta-feira: 18h30m às 22h45m</span>
                    <span>Sexta-feira: 18h30m às 23h45m</span>
                    <span>Sábado: 18h30m às 23h45m</span>
                </div>
            </div>
            <div className='horarioAtendimentoFormaPagamento'>
                <div></div>
                <span>Formas de Pagamento</span>
            </div>
            <div className='containerHorarios'>
                <div></div>
                <div className='horarios'>
                    <div style={{display:"flex",gap:"1rem",alignItems:"center"}}><img style={{width:"30px"}} src={Pix} alt="" /><span>Pix</span></div><br></br>
                    <div style={{display:"flex",gap:"1rem",alignItems:"center"}}><img style={{width:"30px"}} src={Dinheiro} alt="" /><span>Dinheiro</span></div><br></br>
                    <div style={{display:"flex",gap:"1rem",alignItems:"center"}}><img style={{width:"30px"}} src={Cartao} alt="" /><span>Cartao</span></div>
                </div>
            </div>
        </div>
    );
}


export default SobreLoja;
