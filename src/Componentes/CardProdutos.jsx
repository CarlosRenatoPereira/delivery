import React from 'react';
import '../App.css';
import Teacher1 from "../imagens/cachoroQuente.jpg"

function CardProdutos() {
    return (
        <div className="cardProduto">
          <div className='containarDescricaoProduto'>
            <div className='nomeLanche'>Lanche nº 1</div>
              <div className='descricaoLanche'>1 salsicha, 1 ovo de codorna, batata palha, milho, uva passas</div>  
                <div className='preco'>R$ 14,00</div>            
          </div>
          <div className="imgDivProduto"><img src={Teacher1} className="imgProduto"></img></div>
        </div>
    );
  }

  export default CardProdutos;