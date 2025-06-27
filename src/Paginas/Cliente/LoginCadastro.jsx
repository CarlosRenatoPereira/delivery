import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import axios from 'axios';

  export default function LoginCadastro() {
  const [tabValue, setTabValue] = useState(0);
  const [formLogin, setFormLogin] = useState({ nome_usuario: '', senha: '' });
  const [formCadastro, setFormCadastro] = useState({
    nome: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    uf: '',
    cidade: '',
    nome_loja: '',
    telefone: '',
    email: '',
    cpf_cnpj: '',
    nome_usuario: '',
    senha: '',
    repetir_senha: ''
  });
  const [mensagem, setMensagem] = useState('');
  const [erros, setErros] = useState({});

const handleLogin = async () => {
  setMensagem('');
  try {
    const payload = {
      nomeUsuario: formLogin.nome_usuario,
      senha: formLogin.senha,
    };

    if (!formLogin.nome_usuario || !formLogin.senha) {
      setMensagem('Preencha todos os campos de login.');
      return;
    }
    const response = await axios.post('https://localhost:7039/api/Auth/login', payload);

    const { token, nomeUsuario, tipoAcesso } = response.data;

    // Armazene o token no localStorage (ou outro método desejado)
    sessionStorage.setItem('token', token);

    setMensagem(`Login bem-sucedido! Bem-vindo(a), ${nomeUsuario} (${tipoAcesso}).`);

    // Aqui você pode redirecionar para o painel ou outra página
    // Exemplo: navigate('/dashboard'); — se estiver usando react-router

  } catch (error) {
    if (error.response && error.response.status === 401) {
      setMensagem(error.response.data.mensagem || 'Usuário ou senha inválidos.');
    } else {
      setMensagem('Erro ao realizar login. Tente novamente mais tarde.');
    }
  }
};

  const validarCampos = () => {
    const novosErros = {};
    for (const [key, value] of Object.entries(formCadastro)) {
      if (!value.trim()) {
        novosErros[key] = 'Campo obrigatório';
      }
    }
    if (formCadastro.senha !== formCadastro.repetir_senha) {
      novosErros.repetir_senha = 'As senhas não coincidem';
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const buscarEnderecoPorCep = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.data.erro) {
        setFormCadastro((prev) => ({
          ...prev,
          logradouro: response.data.logradouro || '',
          bairro: response.data.bairro || '',
          cidade: response.data.localidade || '',
          uf: response.data.uf || ''
        }));
        setMensagem('');
      } else {
        setFormCadastro((prev) => ({
          ...prev,
          logradouro: '',
          bairro: '',
          cidade:'',
          uf: ''
        }));
        setMensagem('CEP não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setFormCadastro((prev) => ({
          ...prev,
          logradouro: '',
          bairro: '',
          cidade:'',
          uf: ''
        }));
      setMensagem('Erro ao buscar CEP.');
    }
  };

  const handleCadastro = async () => {
    if (!validarCampos()) return;

    try {
      const { repetir_senha, ...dadosEnvio } = formCadastro;
      const response = await axios.post('https://localhost:7039/api/cliente/cadastro', dadosEnvio);
      setMensagem(response.data.mensagem || 'Cadastro realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setMensagem('Erro ao realizar cadastro.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setMensagem('');
    setErros({});
  };

  return (
    <Box
      sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', p: 2 }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Bem-vindo
        </Typography>

        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 3 }}>
          <Tab label="Login" />
          <Tab label="Cadastro" />
        </Tabs>

        {tabValue === 0 && (
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Nome de Usuário"
              margin="normal"
              value={formLogin.nome_usuario}
              onChange={(e) => setFormLogin({ ...formLogin, nome_usuario: e.target.value })}
            />
            <TextField
              fullWidth
              type="password"
              label="Senha"
              margin="normal"
              value={formLogin.senha}
              onChange={(e) => setFormLogin({ ...formLogin, senha: e.target.value })}
            />
            <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleLogin}>
              Entrar
            </Button>
            {mensagem && (
              <Typography color="primary" sx={{ mt: 2 }}>
                {mensagem}
              </Typography>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={2}>
              {Object.entries(formCadastro).map(([key, value]) => (
                <Grid item xs={12} sm={key === 'senha' || key === 'nome_usuario' || key === 'repetir_senha' ? 6 : 12} key={key}>
                  <TextField
                    fullWidth
                    label={key === 'nome' ? 'Nome da Empresa' : key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    type={key.includes('senha') ? 'password' : 'text'}
                    value={value}
                    onChange={(e) => setFormCadastro({ ...formCadastro, [key]: e.target.value })}
                    onBlur={key === 'cep' ? () => buscarEnderecoPorCep(formCadastro.cep) : undefined}
                    error={Boolean(erros[key])}
                    helperText={erros[key] || ''}
                  />
                </Grid>
              ))}
            </Grid>
            {mensagem && (
              <Typography color="primary" sx={{ mt: 2 }}>
                {mensagem}
              </Typography>
            )}
            <Button fullWidth variant="contained" color="success" sx={{ mt: 3 }} onClick={handleCadastro}>
              Cadastrar
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
