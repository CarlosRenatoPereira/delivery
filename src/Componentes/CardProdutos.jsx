import React from 'react';
import '../App.css';
import Teacher1 from "../imagens/cachoroQuente.jpg"

function CardProdutos() {
    return (
        <div className="cardProduto">
          <div>
            <div>
              <div>
                <div>
                </div>  
              </div>            
            </div>
          </div>
          <div className="imgDivProduto"><img src={Teacher1} className="imgProduto"></img></div>
        </div>
    );
  }

  export default CardProdutos;