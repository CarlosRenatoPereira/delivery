import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InputMask from "react-input-mask";

export default function Identificacao() {
  const [whatsapp, setWhatsapp] = useState("");
  const [nome, setNome] = useState("");

  const isFormValid = whatsapp.replace(/[_()-\s]/g, "").length === 11 && nome.trim() !== "";

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100vh",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 ,mb:2}}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Identifique-se</Typography>
      </Box>
      <Divider sx={{mb:2}}></Divider>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Informe o número do seu WhatsApp:
        </Typography>
        <InputMask
          mask="(99) 99999-9999"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        >
          {(inputProps) => (
            <TextField
              {...inputProps}
              fullWidth
              variant="outlined"
              error={whatsapp && !isFormValid}
            />
          )}
        </InputMask>
      </Box>

      <Box>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Informe seu nome e sobrenome:
        </Typography>
        <TextField
          placeholder="Nome e sobrenome"
          fullWidth
          variant="outlined"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        disabled={!isFormValid}
        sx={{ marginTop: 2 }}
      >
        Avançar
      </Button>

      <Typography variant="caption" sx={{ marginTop: 2, color: "text.secondary" }}>
        Precisamos das informações para realização do pedido. Estamos em um ambiente seguro!
      </Typography>
    </Box>
  );
}
