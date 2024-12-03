import React from 'react';
import { Icon } from '@iconify/react';
import './SobreLoja.css';
import { Link } from 'react-router-dom';

function SobreLoja() {
    return (
        <div className='container'>
            <div className='topo'>
                <div></div>
               <Link to={"/loja"} style={{ textDecoration: 'none' }}><div><span style={{ fontSize: "25px" }}><Icon icon="mdi:arrow-back" /></span></div></Link>
                <div style={{fontStyle:"Arial", fontSize:"15px"}}><pre><span> Sobre o estabelecimento</span></pre></div>
            </div>
            <div className='nomeLoja'>
                <div></div>
                <span>Marcelinho Lanches</span>
            </div>
            <div className='horarioAtendimento'>
                <div></div>
                 <span>Horário de atendimento</span>
            </div>
            <div className='horarios'>
                <div></div>
                 <span>Domingo: 18h30m às 22h45m</span>
                 <span>Terça-feira: 18h30m às 22h45m</span>
                 <span>Quarta-feira: 18h30m às 22h45m</span>
                 <span>Quinta-feira: 18h30m às 22h45m</span>
                 <span>Sexta-feira: 18h30m às 23h45m</span>
                 <span>Sábado: 18h30m às 23h45m</span>
            </div>
            <div>
                <div></div>
            </div>
            <div>
                <div></div>
            </div>
            <div>
                <div></div>
            </div>
            <div className='endereco'>

            </div>
        </div>
    );
}


export default SobreLoja;
