import React, { useState, useRef, useEffect,useContext} from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  Badge,
  Paper,
  useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useLocation } from "react-router-dom";
import ImagemDefault from "/imagens/default.jpg";
import { ClienteContext  } from '../contexts/ClienteProvider';
import { CarrinhoContext  } from '../contexts/CarrinhoProvider';
import { useNavigate } from 'react-router-dom';

  const imagemSrc = '/imagens/1/';
  const Carrinho = () => {
  const theme = useTheme();
  const { cart, setCart } = useContext(CarrinhoContext);
  const { clienteInfo, setClienteInfo } = useContext(ClienteContext);
  const cartEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const voltar = () => {
    navigate(`/loja/${clienteInfo.slug}`);
  };
  // Efeito para adicionar o produto quando chega via state
  useEffect(() => {
    if (location.state?.produto) {
      const produtoRecebido = location.state.produto;
      
      setCart(prevCart => {
        // Verifica se o produto já está no carrinho (mesmo ID e mesmas observações)
        const itemExistente = prevCart.find(item => 
          item.id === produtoRecebido.idProduto && 
          item.observacoes === produtoRecebido.observacoes
        );

        if (itemExistente) {
          return prevCart.map(item =>
            item.id === produtoRecebido.idProduto && item.observacoes === produtoRecebido.observacoes
              ? { ...item, quantity: item.quantity + produtoRecebido.quantity }
              : item
          );
        }

        // Adiciona novo item ao carrinho
        return [
          ...prevCart,
          {
            id: produtoRecebido.idProduto,
            name: produtoRecebido.nomeProduto,
            price: produtoRecebido.preco,
            image: produtoRecebido.imagemProduto || ImagemDefault,
            quantity: produtoRecebido.quantity,
            observacoes: produtoRecebido.observacoes
          }
        ];
      });

      // Limpa o state após a adição
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  // Calcula o total do carrinho
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Rolar para o final do carrinho
  useEffect(() => {
    cartEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [cart]);


  // Remover item do carrinho
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Ajustar quantidade
  const adjustQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", paddingTop:1, paddingLeft:1, paddingRight:1}}>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Badge badgeContent={cart.reduce((sum, item) => sum + item.quantity, 0)} color="primary">
            <ShoppingCartIcon color="action" />
          </Badge>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            &nbsp;&nbsp;&nbsp;Seu Carrinho
          </Typography>
        </Box>

        <Box sx={{ maxHeight: "60vh", overflowY: "auto", mb: 2 }}>
          {cart.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              Seu carrinho está vazio
            </Typography>
          ) : (
            cart.map((item) => (
              <React.Fragment key={`${item.id}-${item.observacoes || 'no-obs'}`}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
                  <img src={imagemSrc + item.image}  style={{ width: 50, height: 50, borderRadius: "50%" }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1">{item.name}</Typography>
                    {item.observacoes && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Obs: {item.observacoes}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      R$ {item.price.toFixed(2)} × {item.quantity} = R$ {(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton size="small" onClick={() => adjustQuantity(item.id, item.quantity - 1)}>
                      <RemoveIcon fontSize="small" style={{color:"red"}}/>
                    </IconButton>
                    <Typography variant="body1">{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => adjustQuantity(item.id, item.quantity + 1)}>
                      <AddIcon fontSize="small" style={{color:"darkgreen"}}/>
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}>
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

        {cart.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                R$ {totalPrice.toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="inherit"
              fullWidth
              size="large"
              disabled={cart.length === 0}
              onClick={voltar}
            >
              Voltar à Compra
            </Button>
            <div style={{width:"100%",marginTop:"7px"}} />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={cart.length === 0}
            >
              Finalizar Pedido
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Carrinho;