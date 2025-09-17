// App.jsx
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
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const { setClienteInfo } = useContext(ClienteContext);
  const { cart } = useContext(CarrinhoContext);

  const sectionRefs = useRef({}); // refs para seções
  const menuRefs = useRef({});    // refs para botões do menu

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
        const res = await fetch(
          `https://localhost:7039/api/ClienteCategorias/${cliente.id}/categorias-produtos`
        );
        const data = await res.json();
        setCategorias(data);
        if (data.length > 0) setCategoriaSelecionada(data[0]);
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

  // Marca categoria ao rolar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoriaId = entry.target.getAttribute("data-categoria-id");
            const categoria = categorias.find((c) => c.categoriaId.toString() === categoriaId);
            if (categoria) {
              setCategoriaSelecionada(categoria);
            }
          }
        });
      },
      { threshold: 0.4,
         rootMargin: "-100px 0px 0px 0px", // ajusta conforme altura do menu
       }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categorias]);

 const handleCategoriaClick = (categoriaId) => {
  const el = sectionRefs.current[categoriaId];
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY;
    const offset = 40; // altura do menu
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const target = Math.min(y - offset, maxScroll);
    
    window.scrollTo({
      top: target,
      behavior: "smooth",
    });
  }
};

useEffect(() => {
  if (!categoriaSelecionada) return;

  const el = menuRefs.current[categoriaSelecionada.categoriaId];
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      inline: "center", // centraliza no eixo X
      block: "nearest",
    });
  }
}, [categoriaSelecionada]);

  if (loading) return <Loading mensagem="Buscando dados da loja..." />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh"}}>
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
          position: "sticky",
          top: 0,
          zIndex: 999,
        }}
      >
        {categorias.map((cat) => (
          <Box
            key={cat.categoriaId}
            ref={(el) => (menuRefs.current[cat.categoriaId] = el)}
            onClick={() => handleCategoriaClick(cat.categoriaId)}
            sx={{
              display: "inline-flex",
              cursor: "pointer",
              px: 2,
              borderBottom:
                categoriaSelecionada?.categoriaId === cat.categoriaId
                  ? "2px solid #940c0c"
                  : "2px solid transparent",
              color:
                categoriaSelecionada?.categoriaId === cat.categoriaId
                  ? "#940c0c"
                  : "black",
              fontWeight: "bold",
              fontSize: "0.9rem",
              "&:hover": { transform: "scale(1.05)" },
              whiteSpace: "nowrap",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            {cat.nomeCategoria}
          </Box>
        ))}
      </Box>

      {/* Lista de categorias + produtos */}
      <Box sx={{ flex: 1, px: 1, pb: "1000px" }}>
        {categorias.map((cat) => (
          <Box
            key={cat.categoriaId}
            ref={(el) => (sectionRefs.current[cat.categoriaId] = el)}
            data-categoria-id={cat.categoriaId}
            sx={{ scrollMarginTop: "200px", mb: 5 }}
          >
            <Typography
              variant="h6"
              sx={{ ml: 2, mt: 1, fontWeight: "bold", color: "#444" }}
            >
              {cat.nomeCategoria}
            </Typography>
            <CardapioCentral produtos={cat.produtos} idCliente={cliente.id} />
          </Box>
        ))}
      </Box>

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
