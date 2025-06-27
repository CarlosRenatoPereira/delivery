import React from 'react';
import '../App.css';
import Teacher1 from "../imagens/bebidas.png"
import {VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

function Card({ onClick, title, itemId,image,selected }) {
    const { isVisible } = React.useContext(VisibilityContext);
    return (
      <div onClick={() => onClick({ itemId })}>
        <div className={`card ${selected ? 'selected' : ''}`}>
          <div className="imgDiv"><img src={image} className="img"></img></div>
          <div className='titulo'>{title}</div>
        </div>
      </div>
    );
  }

  export default Card;