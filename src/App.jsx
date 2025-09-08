import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Card as MUICard,
} from '@mui/material';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Cabecalho from './Componentes/Cabecalho.jsx';
import Informacoes from './Componentes/Informacoes.jsx';
import CardapioCentral from './Componentes/CardapioCentral.jsx';
import Loading from './Componentes/Loading.jsx';
import { ClienteContext } from './contexts/ClienteProvider';
import { CarrinhoContext } from './contexts/CarrinhoProvider';
function App() {
  const location = useLocation();
  const [categorias, setCategorias] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const { setClienteInfo } = useContext(ClienteContext);
  const { cart } = useContext(CarrinhoContext);

  // refs para scroll automático
  const cardRefs = useRef({});

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
        const res = await fetch(`https://localhost:7039/api/ClienteCategorias/${cliente.id}/categorias-produtos`);
        const data = await res.json();
        setCategorias(data);
        console.log(data)
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
    const categoria = categorias.find((c) => c.categoriaId === Number(categoriaId));
    if (categoria) {
      setProdutosSelecionados(categoria.produtos);
      setCategoriaSelecionada(categoria);

      // scroll automático
      const card = cardRefs.current[categoriaId];
      if (card) {
        card.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }
  };

  if (loading) return <Loading mensagem="Buscando dados da loja..." />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Cabeçalho e informações */}
      <Cabecalho nome={cliente.nome} />
      <Informacoes />

      {/* Menu horizontal de categorias */}
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        whiteSpace: "nowrap",
        backgroundColor: "rgba(235, 231, 231, 0.911)",
        px: 1,
        py: 1,
        gap: 1,
        position: "sticky",      // deixa o Box "grudado" no topo
        top: 0,                  // distância do topo da viewport
        zIndex: 999,        
      }}
    >
      {categorias.map((cat) => (
        <MUICard
          key={cat.categoriaId}
          ref={(el) => (cardRefs.current[cat.categoriaId] = el)}
          onClick={() => handleCategoriaClick(cat.categoriaId)}
          sx={{
            display: "inline-flex",
            cursor: "pointer",
            width: "auto",
            px: 2,
            borderBottom:
              categoriaSelecionada?.categoriaId === cat.categoriaId
                ? "2px inset black"
                : "none",
            transition: "0.2s",
            fontWeight: "bold",
            fontSize: "0.9rem",
            "&:hover": { transform: "scale(1.05)" },
            whiteSpace: "nowrap",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          {cat.nomeCategoria}
        </MUICard>
      ))}
    </Box>
      {/* Nome da categoria */}
      <Typography
        variant="h7"      
        sx={{margin: 0, ml: 1, p: 1, color: "#635e5eff", fontFamily: "Inter",fontWeight: 900}}
      >
        {categoriaSelecionada ? categoriaSelecionada.nomeCategoria : "Carregando..."}
      </Typography>

      {/* Lista de produtos */}
      <CardapioCentral produtos={produtosSelecionados} />

      {/* Rodapé fixo com carrinho */}
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <BottomNavigation showLabels>
          <BottomNavigationAction
            component={Link}
            to="/Carrinho"
            label="Carrinho"
            icon={
              <Badge
                badgeContent={cart.reduce((sum, item) => sum + item.quantity, 0)}
                color="primary"
              >
                <ShoppingCartIcon />
              </Badge>
            }
            sx={{
              color: "rgb(238, 53, 53)",
              "&.Mui-selected": { color: "rgb(177, 38, 38)" },
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default App;
