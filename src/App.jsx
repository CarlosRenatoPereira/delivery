import React, { useEffect, useState, useContext } from 'react';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { Link, useParams } from 'react-router-dom';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import './App.css';
import Card from './Componentes/Card.jsx';
import Cabecalho from './Componentes/Cabecalho.jsx';
import Informacoes from './Componentes/Informacoes.jsx';
import CardapioCentral from './Componentes/CardapioCentral.jsx';
import Loading from './Componentes/Loading.jsx';
import { ClienteContext } from './contexts/ClienteProvider';
import { CarrinhoContext  } from './contexts/CarrinhoProvider';
import { Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const [categorias, setCategorias] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const imagemSrc = '/imagens/1/';
  const { clienteInfo, setClienteInfo } = useContext(ClienteContext);
  const { cart, setCart } = useContext(CarrinhoContext);

  useEffect(() => {
    async function fetchCliente() {
      try {
        const res = await fetch(`https://localhost:7039/api/cliente/por-slug/${slug}`);
        const data = await res.json();
        setCliente(data);
      } catch (err) {
        console.error('Erro ao buscar cliente:', err);
      }
    }
    fetchCliente();
  }, [slug]);

  useEffect(() => {
    if (!cliente) return;

    async function fetchCategorias() {
      try {
        const res = await fetch(`https://localhost:7039/api/clientes/${cliente.id}/categorias-produtos`);
        const data = await res.json();
        setCategorias(data);
        if (data.length > 0) {
          setProdutosSelecionados(data[0].produtos);
          setCategoriaSelecionada(data[0]);
        }
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      } finally {
        setLoading(false);
      }
    }
      setClienteInfo({
      idCliente: cliente.id,
      slug: slug,
    });
    fetchCategorias();
  }, [cliente]);

  const handleCategoriaClick = (categoriaId) => {
    const categoria = categorias.find((c) => c.categoriaId === categoriaId);
    if (categoria) {
      setProdutosSelecionados(categoria.produtos);
      setCategoriaSelecionada(categoria);
    }
  };

  if (loading) return <Loading mensagem="Buscando dados da loja..." />;

  return (
    <div>
      <Cabecalho nome={cliente.nome} />
      <Informacoes />

      <ScrollMenu>
        {categorias.map((cat) => (
          <Card
            key={cat.categoriaId}
            itemId={cat.categoriaId}
            title={cat.nomeCategoria}
            image={imagemSrc + cat.imagemCategoria}
            onClick={() => handleCategoriaClick(cat.categoriaId)}
            selected={categoriaSelecionada?.categoriaId === cat.categoriaId}
          />
        ))}
      </ScrollMenu>

      <div className='nomeProduto'>
        {categoriaSelecionada ? categoriaSelecionada.nomeCategoria : 'Carregando...'}
      </div>

      <CardapioCentral produtos={produtosSelecionados} />

      <div className='footer'>
        <div style={{ textAlign: 'center', color: 'rgb(238, 53, 53)' }}>
        <Link to="/Carrinho" style={{ textDecoration: 'none' ,color: 'rgb(238, 53, 53)'}}>
          <Badge badgeContent={cart.reduce((sum, item) => sum + item.quantity, 0)} color="primary">
              <ShoppingCartIcon color="action" />
          </Badge>
          <div style={{ fontSize:'15px' }}>Carrinho</div>
         </Link>
        </div>
        <div style={{ width: '5%' }}></div>
      </div>
    </div>
  );
}

export default App;
