// Carrinho.jsx
import React, { useRef, useEffect, useContext } from "react";
import {
  Box, Typography, Button, Divider,
  IconButton, Badge, Paper, useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useLocation, useNavigate } from "react-router-dom";
import ImagemDefault from "../imagens/generica.png"
import { ClienteContext } from "../contexts/ClienteProvider";
import { CarrinhoContext } from "../contexts/CarrinhoProvider";
import Teacher1 from "../imagens/generica.png"
import { Bold } from "lucide-react";

const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
const Carrinho = () => {
  const theme = useTheme();
  const { cart, setCart } = useContext(CarrinhoContext);
  const { clienteInfo } = useContext(ClienteContext);
  const cartEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const voltar = () => navigate(`/loja/${clienteInfo.slug}`);

  // 🔑 gera chave única do item
  const gerarChaveItem = (produto) => {
    return JSON.stringify({
      id: produto.idProduto,
      obs: produto.observacoes || "",
      acrescimos: produto.acrescimos?.map(a => `${a.acrescimoId}:${a.quantidade}`) || [],
      opcoes: produto.opcoes?.map(o => `${o.idOpcao}:${o.quantidade}`) || []
    });
  };

  // Efeito para adicionar o produto quando chega via state
  useEffect(() => {
    if (location.state?.produto) {
      const produtoRecebido = location.state.produto;
      const chaveRecebida = gerarChaveItem(produtoRecebido);
      console.log(produtoRecebido);

      setCart(prevCart => {
        const itemExistente = prevCart.find(item => item.key === chaveRecebida);

        if (itemExistente) {
          // 🔄 soma quantidade se já existir
          return prevCart.map(item =>
            item.key === chaveRecebida
              ? { ...item, quantity: item.quantity + produtoRecebido.quantity }
              : item
          );
        }

        // ➕ novo item no carrinho
        return [
          ...prevCart,
          {
            idCliente: produtoRecebido.idCliente,
            nomeCategoria: produtoRecebido.nomeCategoria,
            key: chaveRecebida,
            id: produtoRecebido.produtoId,
            name: produtoRecebido.nomeProduto,
            price: produtoRecebido.preco,
            imagem: produtoRecebido.imagemProduto,
            quantity: produtoRecebido.quantity,
            observacoes: produtoRecebido.observacoes,
            acrescimos: produtoRecebido.acrescimos,
            opcoes: produtoRecebido.opcoes
          }
        ];
      });

      // 🔹 limpa o state após adicionar
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  // Total do carrinho
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Scroll pro final sempre que mudar
  useEffect(() => {
    cartEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [cart]);

  // Remover item específico
  const removeFromCart = (key) => {
    setCart(prevCart => prevCart.filter(item => item.key !== key));
  };

  // Ajustar quantidade
  const adjustQuantity = (key, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(key);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.key === key ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", paddingTop: 1, px: 0.3 }}>
      <Paper elevation={3} sx={{ p: 0.5, borderRadius: 2 }}>
        {/* Cabeçalho */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Badge badgeContent={cart.reduce((sum, i) => sum + i.quantity, 0)} color="primary">
            <ShoppingCartIcon color="action" />
          </Badge>
          <Typography variant="h5" fontWeight="bold">
            &nbsp;&nbsp;&nbsp;Seu Carrinho
          </Typography>
        </Box>

        {/* Lista */}
        <Box sx={{ maxHeight: "60vh", overflowY: "auto", mb: 2 }}>
          {cart.length === 0 ? (
            <Box>
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                Seu carrinho está vazio
              </Typography>
              <Button variant="contained" color="inherit" fullWidth size="large" onClick={voltar}>
                Voltar à Compra
              </Button>
            </Box>
          ) : (
            cart.map(item => (
              <React.Fragment key={item.key}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1}}>
                  <img
                    src={item.imagem ? baseUrl + item.idCliente +
                                                    "/" +
                                                    item.nomeCategoria +
                                                    "/imagem/" +
                                                    item.imagem
                                                  : Teacher1}
                    style={{ width: 50, height: 50, borderRadius: "50%" }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>{item.name}</Typography>
                     {item.opcoes.length > 0 && (
  <Box>
    {(() => {
      let ultimoGrupo = null;
      return item.opcoes.map((op, idx) => {
        const mostrarGrupo = ultimoGrupo !== op.idGrupo;
        ultimoGrupo = op.idGrupo;

        return (
          <Box key={idx}>
            {mostrarGrupo && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: "bold" }}
              >
                {op.nomeGrupo}
              </Typography>
            )}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              {op.quantidade}x {op.nomeOpcao}
            </Typography>
          </Box>
        );
      });
    })()}
  </Box>
)}

                    {item.acrescimos.length >0 && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
                            Acréscimos
                        </Typography>
                        {item.acrescimos.map((ac) => (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                            {ac.quantidade}x {ac.nomeAcrescimo}
                          </Typography>
                    ))}
                    </Box>
                    )}
                     {item.observacoes && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        Obs: {item.observacoes}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                      R$ {item.price.toFixed(2)} × {item.quantity} = R$ {(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton size="small" onClick={() => adjustQuantity(item.key, item.quantity - 1)}>
                      <RemoveIcon fontSize="small" style={{ color: "red" }} />
                    </IconButton>
                    <Typography variant="body1">{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => adjustQuantity(item.key, item.quantity + 1)}>
                      <AddIcon fontSize="small" style={{ color: "darkgreen" }} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => removeFromCart(item.key)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
              </React.Fragment>
            ))
          )}
          <div ref={cartEndRef} />
        </Box>

        {/* Rodapé */}
        {cart.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" fontWeight="bold">
                R$ {totalPrice.toFixed(2)}
              </Typography>
            </Box>
            <Button variant="contained" color="inherit" fullWidth size="large" onClick={voltar}>
              Voltar à Compra
            </Button>
            <Box mt={1} />
            <Button variant="contained" color="primary" fullWidth size="large">
              Finalizar Pedido
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Carrinho;
