import React from 'react';
import { ScrollMenu} from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import './App.css';
import Card from './Componentes/Card.jsx';
import Cabecalho from './Componentes/Cabecalho.jsx';
import Informacoes from './Componentes/Informacoes.jsx';
import Carrinho from './imagens/carrinho-de-compras.png';
import CardapioCentral from './Componentes/CardapioCentral.jsx';
const getItems = () => Array(7).fill(0).map((_, ind) => ({ id: `Sanduíches` }));

function App() {
  const [items, setItems] = React.useState(getItems);
  const [selected, setSelected] = React.useState([]);

  const isItemSelected = (id) => !!selected.find((el) => el === id);

  const handleClick = (id) => ({ getItemById, scrollToItem }) => {
    const itemSelected = isItemSelected(id);
    setSelected((currentSelected) =>
      itemSelected ? currentSelected.filter((el) => el !== id) : currentSelected.concat(id)
    );
  };

  return (
    <div>
      <Cabecalho></Cabecalho>
      <Informacoes></Informacoes>
      <ScrollMenu>
        {items.map(({ id }) => (
          <Card
            itemId={id} // itemId é necessário para rastrear itens
            title={id}
            key={id}
            onClick={handleClick(id)}
            selected={isItemSelected(id)}
          />
        ))}
      </ScrollMenu>
      <div className='nomeProduto'>Sanduíches</div>
      <CardapioCentral/>
      <div className='footer'>
        <div style={{textAlign:"center", fontWeight:"bold", color:"darkcyan"}}>
           <img style={{width:"20px"}} src={Carrinho} alt="" />
           <div><span>Carrinho</span></div>
        </div>
        <div style={{width:"5%"}} ></div>
     </div>
     </div>
  );
}


export default App;
