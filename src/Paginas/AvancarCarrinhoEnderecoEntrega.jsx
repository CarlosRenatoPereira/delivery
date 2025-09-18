import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Divider,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InputMask from "react-input-mask";

const estadosBR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO"
];

export default function EnderecoEntrega() {
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [camposLiberados, setCamposLiberados] = useState(false);

  const isFormValid =
    cep.replace(/\D/g, "").length === 8 &&
    logradouro &&
    bairro &&
    cidade &&
    estado &&
    numero;

  const handleCepBlur = async () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setLogradouro(data.logradouro || "");
          setBairro(data.bairro || "");
          setCidade(data.localidade || "");
          setEstado(data.uf || "");
        }
      } catch (error) {
        console.error("Erro ao consultar CEP:", error);
      } finally {
        setCamposLiberados(true); // libera campos mesmo que não encontre
      }
    } else {
      setCamposLiberados(true); // libera campos mesmo que CEP incompleto
    }
  };

  // Função exemplo de cálculo de distância entre dois CEPs
  const calcularDistancia = async (cepOrigem, cepDestino) => {
    const cleanOrigem = cepOrigem.replace(/\D/g, "");
    const cleanDestino = cepDestino.replace(/\D/g, "");
    // Substitua SUA_CHAVE_OPENROUTESERVICE pela sua chave
    const apiKey = "SUA_CHAVE_OPENROUTESERVICE";

    try {
      // Obter coordenadas dos CEPs via ViaCEP
      const [res1, res2] = await Promise.all([
        fetch(`https://viacep.com.br/ws/${cleanOrigem}/json/`).then(r => r.json()),
        fetch(`https://viacep.com.br/ws/${cleanDestino}/json/`).then(r => r.json()),
      ]);

      if (res1.erro || res2.erro) return null;

      const coords = [
        [parseFloat(res1.logradouro ? res1.longitude || 0 : 0), parseFloat(res1.logradouro ? res1.latitude || 0 : 0)],
        [parseFloat(res2.logradouro ? res2.longitude || 0 : 0), parseFloat(res2.logradouro ? res2.latitude || 0 : 0)]
      ];

      const body = {
        coordinates: coords
      };

      const response = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
          method: "POST",
          headers: {
            "Authorization": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      return data.features?.[0]?.properties?.summary?.distance || null; // em metros
    } catch (error) {
      console.error("Erro ao calcular distância:", error);
      return null;
    }
  };

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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Endereço para Entrega</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          CEP:
        </Typography>
        <InputMask
          mask="99999-999"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          onBlur={handleCepBlur}
        >
          {(inputProps) => (
            <TextField {...inputProps} fullWidth variant="outlined" />
          )}
        </InputMask>
      </Box>

      <TextField
        label="Logradouro"
        fullWidth
        variant="outlined"
        value={logradouro}
        onChange={(e) => setLogradouro(e.target.value)}
        disabled={!camposLiberados}
      />

      <TextField
        label="Bairro"
        fullWidth
        variant="outlined"
        value={bairro}
        onChange={(e) => setBairro(e.target.value)}
        disabled={!camposLiberados}
      />

      <TextField
        label="Cidade"
        fullWidth
        variant="outlined"
        value={cidade}
        onChange={(e) => setCidade(e.target.value)}
        disabled={!camposLiberados}
      />

      <TextField
        select
        label="Estado"
        fullWidth
        variant="outlined"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        disabled={!camposLiberados}
      >
        {estadosBR.map((uf) => (
          <MenuItem key={uf} value={uf}>
            {uf}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Número"
        fullWidth
        variant="outlined"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        disabled={!camposLiberados}
      />

      <TextField
        label="Complemento"
        fullWidth
        variant="outlined"
        value={complemento}
        onChange={(e) => setComplemento(e.target.value)}
        disabled={!camposLiberados}
      />

      <Button
        variant="contained"
        color="primary"
        disabled={!isFormValid}
        sx={{ marginTop: 2 }}
      >
        Avançar
      </Button>

      <Typography variant="caption" sx={{ marginTop: 2, color: "text.secondary" }}>
        Precisamos das informações para entrega do seu pedido. Estamos em um ambiente seguro!
      </Typography>
    </Box>
  );
}
