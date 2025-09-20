import React, { useState } from "react"; 
import {
  Box,
  Grid,
  TextField,
  Paper,
  Typography,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const estados = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO"
];

const diasSemana = [
  { id: 0, label: "Domingo" },
  { id: 1, label: "Segunda-feira" },
  { id: 2, label: "Terça-feira" },
  { id: 3, label: "Quarta-feira" },
  { id: 4, label: "Quinta-feira" },
  { id: 5, label: "Sexta-feira" },
  { id: 6, label: "Sábado" },
];

const formasPagamento = [
  { id: 1, label: "Dinheiro" },
  { id: 2, label: "Pix (Crédito)" },
  { id: 3, label: "Cartão (Somente Crédito)" },
  { id: 4, label: "Cartão (Somente Débito)" },
  { id: 5, label: "Cartão (Crédito e Débito)" },
];

const ConfiguracaoCliente = () => {
  const [formData, setFormData] = useState({
    Nome: "",
    Logradouro: "",
    Numero: "",
    Bairro: "",
    Cep: "",
    Uf: "",
    Cidade: "",
    NomeLoja: "",
    Telefone: "",
    Email: "",
    Status: "",
    CpfCnpj: "",
    Imagem: "",
    RazaoSocial: "",
    confirmacaoCadastro: 0,
    whatsaap: "",

    // novos campos
    horarios: diasSemana.map(dia => ({
      diaSemana: dia.id,
      ativo: false,
      horaInicio: "",
      horaFim: ""
    })),
    pagamentos: []
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0].name : value,
    });
  };

  const handleHorarioChange = (index, field, value) => {
    const novosHorarios = [...formData.horarios];
    novosHorarios[index][field] = value;
    setFormData({ ...formData, horarios: novosHorarios });
  };

  const handlePagamentoChange = (id) => {
    const { pagamentos } = formData;
    const atualizados = pagamentos.includes(id)
      ? pagamentos.filter(p => p !== id)
      : [...pagamentos, id];
    setFormData({ ...formData, pagamentos: atualizados });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do cliente:", formData);
    // aqui você envia formData para API
  };

  return (
    <Box>
      <Box  sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', // centraliza horizontalmente
          gap: 2, 
          mb: 1,
          mt:2
        }}>
        <Typography style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: "#005b8f"}}>
          Configurações da Loja
        </Typography>
        <SettingsIcon sx={{fontSize:40, color: "#005b8f"}}/>
      </Box>
    <Paper
      elevation={2}
      sx={{ p: 2, maxWidth: 1500, mx: "auto", mt: 2, borderRadius: 3 }}
    >

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Razão Social */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Razão Social"
              name="RazaoSocial"
              value={formData.RazaoSocial}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 255 }}
            />
          </Grid>

         {/* CPF/CNPJ */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="CPF/CNPJ"
              name="CpfCnpj"
              value={formData.CpfCnpj}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 20 }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Email"
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 255 }}
            />
          </Grid>

          {/* Logradouro */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Logradouro"
              name="Logradouro"
              value={formData.Logradouro}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 255 }}
            />
          </Grid>

          {/* Número */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Número"
              name="Numero"
              value={formData.Numero}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 50 }}
            />
          </Grid>

          {/* Bairro */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Bairro"
              name="Bairro"
              value={formData.Bairro}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 100 }}
            />
          </Grid>

          {/* CEP */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="CEP"
              name="Cep"
              value={formData.Cep}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 20 }}
            />
          </Grid>

          {/* UF */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="UF"
              name="Uf"
              value={formData.Uf}
              onChange={handleChange}
              fullWidth
            >
              {estados.map((uf) => (
                <MenuItem key={uf} value={uf}>
                  {uf}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Cidade */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Cidade"
              name="Cidade"
              value={formData.Cidade}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 100 }}
            />
          </Grid>

          {/* Nome */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Nome (mostrar no aplicativo)"
              name="Nome"
              value={formData.Nome}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 255 }}
            />
          </Grid>


          {/* WhatsApp */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="WhatsApp"
              name="whatsaap"
              value={formData.whatsaap}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 20 }}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6} md={4}>
           <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={1}  label="Status">
                <MenuItem value={1}>Ativo</MenuItem>
                <MenuItem value={0}>Inativo</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Imagem */}
          <Grid item xs={12} sm={6} md={4}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Imagem
              <input
                type="file"
                hidden
                name="Imagem"
                onChange={handleChange}
              />
            </Button>
            {formData.Imagem && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {formData.Imagem}
              </Typography>
            )}
          </Grid>
                 </Grid>

            {/* ===== NOVO BLOCO: Horário de funcionamento ===== */}
            <Grid item xs={12} maxWidth={400}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Horário de Funcionamento
              </Typography>
              {formData.horarios.map((h, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center",
                 justifyContent: "space-between", alignItems: "center", gap: 1, mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={h.ativo}
                        onChange={(e) => handleHorarioChange(index, "ativo", e.target.checked)}
                      />
                    }
                    label={diasSemana[index].label}
                  />
                   <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    type="time"
                    size="small"
                    label="Início"
                    value={h.horaInicio}
                    onChange={(e) => handleHorarioChange(index, "horaInicio", e.target.value)}
                    disabled={!h.ativo}
                    sx={{
                      '& input[type="time"]::-webkit-calendar-picker-indicator': {
                        display: "none"
                      }
                    }}
                  />
                  <TextField
                    type="time"
                    size="small"
                    label="Fim"
                    value={h.horaFim}
                    onChange={(e) => handleHorarioChange(index, "horaFim", e.target.value)}
                    disabled={!h.ativo}
                    sx={{
                      '& input[type="time"]::-webkit-calendar-picker-indicator': {
                        display: "none"
                      }
                    }}
                  />
                   </Box>
                </Box>
              ))}
            </Grid>

            {/* ===== NOVO BLOCO: Formas de pagamento ===== */}
            <Grid item xs={12}  sm={6} md={4}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Formas de Pagamento Aceitas
              </Typography>
              <FormGroup row>
                {formasPagamento.map(fp => (
                  <FormControlLabel
                    key={fp.id}
                    control={
                      <Checkbox
                        checked={formData.pagamentos.includes(fp.id)}
                        onChange={() => handlePagamentoChange(fp.id)}
                      />
                    }
                    label={fp.label}
                  />
                ))}
              </FormGroup>
            </Grid>

          {/* Botão */}
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button type="submit" variant="contained" color="primary">
              Salvar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConfiguracaoCliente;