import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";

const ResponsiveMenu = () => {
  const [open, setOpen] = useState(false);
  const [openCardapio, setOpenCardapio] = useState(false);
  const isDesktop = useMediaQuery("(min-width:900px)");

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  const handleCardapioClick = () => {
    setOpenCardapio(!openCardapio);
  };

  const menuList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {/* Início */}
        <ListItemButton
          component={Link}
          to="/"
          onClick={!isDesktop ? toggleDrawer(false) : undefined}
        >
          <ListItemIcon sx={{ color: "#005b8f" }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Início" />
        </ListItemButton>

        {/* Configurações */}
        <ListItemButton
          component={Link}
          to="/configuracaoCliente"
          onClick={!isDesktop ? toggleDrawer(false) : undefined}
        >
          <ListItemIcon sx={{ color: "#005b8f" }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configurações da Loja" />
        </ListItemButton>

        {/* Gestão do Cardápio com submenu */}
        <ListItemButton onClick={handleCardapioClick}>
          <ListItemIcon sx={{ color: "#005b8f" }}>
            <RestaurantMenuIcon />
          </ListItemIcon>
          <ListItemText primary="Gestão do Cardápio" />
          {openCardapio ? <ExpandLess sx={{ color: "#005b8f" }} /> : <ExpandMore sx={{ color: "#005b8f" }} />}
        </ListItemButton>
        <Collapse in={openCardapio} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to="/cadastroProduto"
              onClick={!isDesktop ? toggleDrawer(false) : undefined}
            >
              <ListItemText primary="Cadastro" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to="/atualizacaoProduto"
              onClick={!isDesktop ? toggleDrawer(false) : undefined}
            >
              <ListItemText primary="Atualização" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Financeiro */}
        <ListItemButton
          component={Link}
          to="/financeiro"
          onClick={!isDesktop ? toggleDrawer(false) : undefined}
        >
          <ListItemIcon sx={{ color: "#005b8f" }}>
            <AttachMoneyIcon />
          </ListItemIcon>
          <ListItemText primary="Financeiro" />
        </ListItemButton>

        {/* Sair */}
        <ListItemButton
          component={Link}
          to="/logout"
          onClick={!isDesktop ? toggleDrawer(false) : undefined}
        >
          <ListItemIcon sx={{ color: "#005b8f" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Header com botão */}
      {!isDesktop && (
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 1,
            }}
            >
            <img 
                src="/imagens/baratíssimo.png" 
                alt="Logo" 
                style={{ width: 40, height: 40, objectFit: 'contain', borderRadius:'50%' }} 
            />
                <Typography fontWeight='bold'>
                 Baratíssimo App
                </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer mobile */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {menuList}
      </Drawer>

      {/* Menu fixo no desktop */}
      {isDesktop && (
        <Box
          sx={{
            width: 250,
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            bgcolor: "background.paper",
            boxShadow: 3,
            p: 2,
          }}
        >
            <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 1,
            }}
            >
            <img 
                src="/imagens/baratíssimo.png" 
                alt="Logo" 
                style={{ width: 60, height: 60, objectFit: 'contain', borderRadius:'50%' }} 
            />
                <Typography fontWeight='bold' fontSize={19} sx={{ color: "#005b8f" }}>
                 Baratíssimo App
                </Typography>
            </Box>
          {menuList}
        </Box>
      )}
    </>
  );
};

export default ResponsiveMenu;
