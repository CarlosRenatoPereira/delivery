import React, { useState } from "react";
import "./BotaoMaisMenosLixeira.css";

const BotaoMaisMenosLixeira = ({ initialQuantity = 1, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increment = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const decrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const removeItem = () => {
    setQuantity(0);
    onQuantityChange(0);
  };

  return (
    <div className="quantity-control">
      {quantity > 1 ? (
        <button onClick={decrement} style={{display:"flex",backgroundColor:"#FF6347",width:"27.8px",height:"25px",justifyContent:"center", alignItems:"center"}}>-</button>
      ) : (
        <button onClick={removeItem} style={{display:"flex",backgroundColor:"#FF6347",width:"27.8px",height:"25px",justifyContent:"center", alignItems:"center",color:"white"}}>
          🗑️
        </button>
      )}
      <span className="quantity">{quantity}</span>
      <button onClick={increment} className="control-button" style={{backgroundColor:"#00FA9A"}}>+</button>
    </div>
  );
};

export default BotaoMaisMenosLixeira;
