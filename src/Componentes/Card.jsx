import React from 'react';
import '../App.css';
import Teacher1 from "../imagens/bebidas.png"
import {VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

function Card({ onClick, selected, title, itemId }) {
    const { isVisible } = React.useContext(VisibilityContext);
    return (
      <div onClick={() => onClick({ itemId })}>
        <div className="card">
          <div className="imgDiv"><img src={Teacher1} className="img"></img></div>
          <div className='titulo'>{title}</div>
        </div>
      </div>
    );
  }

  export default Card;