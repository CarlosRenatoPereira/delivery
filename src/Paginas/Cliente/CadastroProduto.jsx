import { useEffect, useMemo, useState } from 'react';
import {
  Tabs, Tab, Box, TextField, Button, Paper, MenuItem, Select, InputLabel, FormControl, Input,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Alert
} from '@mui/material';

// Dica: caso sua aplicação tenha um layout com height: 100vh e overflow: hidden no body/#root,
// remova esse overflow ou torne a área interna rolável (maxHeight + overflowY: 'auto').

export default function CadastroProduto() {
  const [tabIndex, setTabIndex] = useState(0); // abas principais
  const [produtoTabIndex, setProdutoTabIndex] = useState(0); // subabas de produto
  const [opcaoTabIndex, setOpcaoTabIndex] = useState(0); // subabas de categoria de opção

  // === ESTADOS ===
  const [categoria, setCategoria] = useState({ nome: '', imagem: null });
  const [produto, setProduto] = useState({
    nome: '', descricao: '', preco: '', imagem: null, categoriaId: '',
    quantidadeMaximaAcrescimoPorProduto: '', quantidadeOpcoesAEscolher: '', status: 1
  });
  const [acrescimo, setAcrescimo] = useState({
    nome: '', descricao: '', preco: '', imagem: null, quantidadeMaximaIndividual: '', status: 1
  });
  const [categoriaOpcao, setCategoriaOpcao] = useState({
    nome: '', imagem: null, quantidadeEscolhaPorProduto: '', status: 1
  });

  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState({});

  const [msg, setMsg] = useState(null);

  useEffect(() => {
    // Simula carregamento de categorias e produtos
    setCategoriasDisponiveis([
      { id: 1, nome: 'Bebidas' },
      { id: 2, nome: 'Lanches' }
    ]);
    setProdutosDisponiveis([
      { id: 1, nome: 'Coca-Cola' },
      { id: 2, nome: 'Cheeseburger' },
      { id: 3, nome: 'Batata Frita' }
    ]);
  }, []);

  const handleTabChange = (_, newValue) => setTabIndex(newValue);
  const handleProdutoTabChange = (_, newValue) => setProdutoTabIndex(newValue);

  const handleImageChange = (event, setter, field = 'imagem') => {
    const file = event.target.files[0];
    if (file && file.size > 1024 * 1024) {
      alert('A imagem deve ter no máximo 1MB');
    } else {
      setter(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleCheckboxChange = (produtoId) => {
    setProdutosSelecionados(prev => ({ ...prev, [produtoId]: !prev[produtoId] }));
  };

  const selectedProdutoIds = useMemo(() =>
    Object.entries(produtosSelecionados)
      .filter(([, v]) => !!v)
      .map(([k]) => Number(k)),
  [produtosSelecionados]);

  // === VALIDAÇÕES SIMPLES ===
  const req = (v) => v !== undefined && v !== null && String(v).trim() !== '';
  const isNumber = (v) => v === '' || /^\d+(,\d{1,2}|\.\d{1,2})?$/.test(String(v));

  // === HANDLERS DE SALVAR (mock) ===
  const salvarCategoria = () => {
    if (!req(categoria.nome)) return setMsg({ type: 'error', text: 'Informe o nome da categoria.' });
    setMsg({ type: 'success', text: 'Categoria salva (mock).' });
  };

  const salvarProduto = () => {
    if (!req(produto.nome)) return setMsg({ type: 'error', text: 'Informe o nome do produto.' });
    if (!req(produto.categoriaId)) return setMsg({ type: 'error', text: 'Selecione a categoria do produto.' });
    if (!isNumber(produto.preco)) return setMsg({ type: 'error', text: 'Preço inválido.' });
    setMsg({ type: 'success', text: 'Produto salvo (mock).' });
  };

  const salvarAcrescimo = () => {
    if (!req(acrescimo.nome)) return setMsg({ type: 'error', text: 'Informe o nome do acréscimo.' });
    if (!isNumber(acrescimo.preco)) return setMsg({ type: 'error', text: 'Preço do acréscimo inválido.' });
    if (selectedProdutoIds.length === 0) return setMsg({ type: 'error', text: 'Selecione ao menos um produto para vincular.' });
    setMsg({ type: 'success', text: `Acréscimo salvo (mock). Produtos vinculados: ${selectedProdutoIds.join(', ')}` });
  };

  const salvarCategoriaOpcao = () => {
    if (!req(categoriaOpcao.nome)) return setMsg({ type: 'error', text: 'Informe o nome da categoria de opção.' });
    setMsg({ type: 'success', text: 'Categoria de opção salva (mock).' });
  };

  // === ÁREA ROLÁVEL REUTILIZÁVEL ===
  const ScrollArea = ({ children }) => (
    <Paper
      sx={{
        p: 3,
        mt: 2,
        maxHeight: { xs: 'calc(100vh - 210px)', md: 'calc(100vh - 240px)' },
        overflowY: 'auto',
      }}
    >
      {children}
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 2, px: 1 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Cadastro de Produtos</h1>

      {msg && (
        <Alert severity={msg.type} onClose={() => setMsg(null)} sx={{ mb: 1 }}>
          {msg.text}
        </Alert>
      )}

      <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
        <Tab label="Categoria" />
        <Tab label="Produto" />
      </Tabs>

      {/* ABA CATEGORIA */}
      {tabIndex === 0 && (
        <Paper sx={{
            p: 3,
            mt: 2,
            maxHeight: { xs: 'calc(100vh - 210px)', md: 'calc(100vh - 240px)' },
            overflowY: 'auto',
         }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome da Categoria"
              value={categoria.nome}
              onChange={(e) => setCategoria({ ...categoria, nome: e.target.value })}
              fullWidth
            />
            <Button variant="outlined" component="label">
              Selecionar Imagem (máx. 1MB)
              <input hidden accept="image/*" type="file"
                     onChange={(e) => handleImageChange(e, setCategoria)} />
            </Button>
            {categoria.imagem && <p>Imagem selecionada: {categoria.imagem.name}</p>}
            <Button variant="contained" onClick={salvarCategoria}>Salvar Categoria</Button>
          </Box>
        </Paper>
      )}

      {/* ABA PRODUTO */}
      {tabIndex === 1 && (
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Tabs value={produtoTabIndex} onChange={handleProdutoTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Dados" />
            <Tab label="Acréscimos" />
            <Tab label="Opções" />
          </Tabs>

          {/* Subaba Dados */}
          {produtoTabIndex === 0 && (
            <Paper sx={{
                p: 3,
                mt: 2,
                maxHeight: { xs: 'calc(100vh - 210px)', md: 'calc(100vh - 240px)' },
                overflowY: 'auto',
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={produto.categoriaId}
                    onChange={(e) => setProduto({ ...produto, categoriaId: e.target.value })}
                    label="Categoria"
                  >
                    {categoriasDisponiveis.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.nome}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField label="Nome do Produto" value={produto.nome}
                  onChange={(e) => setProduto({ ...produto, nome: e.target.value })} fullWidth />

                <TextField label="Descrição" multiline minRows={3} value={produto.descricao}
                  onChange={(e) => setProduto({ ...produto, descricao: e.target.value })} fullWidth />

                <TextField label="Preço" type="text" value={produto.preco}
                  onChange={(e) => setProduto({ ...produto, preco: e.target.value })} fullWidth helperText="Use ponto ou vírgula para centavos" />

                <TextField label="Qtd Máx de Acréscimos por Produto" type="number"
                  value={produto.quantidadeMaximaAcrescimoPorProduto}
                  onChange={(e) => setProduto({ ...produto, quantidadeMaximaAcrescimoPorProduto: e.target.value })} fullWidth />

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={produto.status} onChange={(e) => setProduto({ ...produto, status: e.target.value })} label="Status">
                    <MenuItem value={1}>Ativo</MenuItem>
                    <MenuItem value={0}>Inativo</MenuItem>
                  </Select>
                </FormControl>

                <Button variant="outlined" component="label">
                  Selecionar Imagem (máx. 1MB)
                  <input hidden accept="image/*" type="file"
                         onChange={(e) => handleImageChange(e, setProduto)} />
                </Button>
                {produto.imagem && <p>Imagem selecionada: {produto.imagem.name}</p>}

                <Button variant="contained" onClick={salvarProduto}>Salvar Produto</Button>
              </Box>
            </Paper>
          )}

          {/* Subaba Acréscimos */}
          {produtoTabIndex === 1 && (
            <Paper sx={{
                p: 3,
                mt: 2,
                maxHeight: { xs: 'calc(100vh - 210px)', md: 'calc(100vh - 240px)' },
                overflowY: 'auto',
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Nome do Acréscimo" value={acrescimo.nome} onChange={(e) => setAcrescimo({ ...acrescimo, nome: e.target.value })} fullWidth />
                <TextField label="Descrição" multiline value={acrescimo.descricao} onChange={(e) => setAcrescimo({ ...acrescimo, descricao: e.target.value })} fullWidth />
                <TextField label="Preço" type="number" value={acrescimo.preco} onChange={(e) => setAcrescimo({ ...acrescimo, preco: e.target.value })} fullWidth />
                <TextField label="Qtd Máx Individual" type="number" value={acrescimo.quantidadeMaximaIndividual} onChange={(e) => setAcrescimo({ ...acrescimo, quantidadeMaximaIndividual: e.target.value })} fullWidth />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={acrescimo.status} onChange={(e) => setAcrescimo({ ...acrescimo, status: e.target.value })} label="Status">
                    <MenuItem value={1}>Ativo</MenuItem>
                    <MenuItem value={0}>Inativo</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="outlined" component="label">
                  Selecionar Imagem
                  <input hidden accept="image/*" type="file" onChange={(e) => handleImageChange(e, setAcrescimo)} />
                </Button>
                {acrescimo.imagem && <p>Imagem selecionada: {acrescimo.imagem.name}</p>}

                <h3>Vincular a Produtos</h3>
                <TableContainer sx={{ maxHeight: 200 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Selecionar</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Produto</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {produtosDisponiveis.map((prod) => (
                        <TableRow key={prod.id}>
                          <TableCell>
                            <Checkbox
                              checked={!!produtosSelecionados[prod.id]}
                              onChange={() => handleCheckboxChange(prod.id)}
                            />
                          </TableCell>
                          <TableCell>{prod.id}</TableCell>
                          <TableCell>{prod.nome}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button variant="contained" sx={{ mt: 2 }} onClick={salvarAcrescimo}>Salvar Acréscimo</Button>
              </Box>
            </Paper>
          )}

          {/* Subaba Categorias de Opção */}
          {produtoTabIndex === 2 && (
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Tabs value={opcaoTabIndex} onChange={(_, v) => setOpcaoTabIndex(v)} variant="scrollable" scrollButtons="auto">
                <Tab label="Categoria" />
                <Tab label="Itens" />
              </Tabs>

              {/* Subaba Categoria de Opção */}
              {opcaoTabIndex === 0 && (
                <Paper sx={{
                    p: 3,
                    mt: 2,
                    maxHeight: { xs: 'calc(100vh - 210px)', md: 'calc(100vh - 240px)' },
                    overflowY: 'auto',
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Nome da Categoria" value={categoriaOpcao.nome} onChange={(e) => setCategoriaOpcao({ ...categoriaOpcao, nome: e.target.value })} fullWidth />
                    <TextField label="Quantidade de Escolhas por Produto" type="number" value={categoriaOpcao.quantidadeEscolhaPorProduto} onChange={(e) => setCategoriaOpcao({ ...categoriaOpcao, quantidadeEscolhaPorProduto: e.target.value })} fullWidth />
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select value={categoriaOpcao.status} onChange={(e) => setCategoriaOpcao({ ...categoriaOpcao, status: e.target.value })} label="Status">
                        <MenuItem value={1}>Ativo</MenuItem>
                        <MenuItem value={0}>Inativo</MenuItem>
                      </Select>
                    </FormControl>
                    {categoriaOpcao.imagem && <p>Imagem selecionada: {categoriaOpcao.imagem.name}</p>}
                    <Button variant="contained" onClick={salvarCategoriaOpcao}>Salvar Categoria de Opção</Button>
                  </Box>
                </Paper>
              )}

              {/* Subaba Opção */}
              {opcaoTabIndex === 1 && (
                <Paper sx={{
                    p: 3,
                    mt: 2,
                    maxHeight: { xs: 'calc(100vh - 210px)', md: 'calc(100vh - 240px)' },
                    overflowY: 'auto',
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Nome da Opção" fullWidth />
                    <TextField label="Descrição" fullWidth multiline minRows={2} />
                    <TextField label="Preço" type="text" helperText="Use ponto ou vírgula para centavos" fullWidth />
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select defaultValue={1}>
                        <MenuItem value={1}>Ativo</MenuItem>
                        <MenuItem value={0}>Inativo</MenuItem>
                      </Select>
                    </FormControl>
                    <Button variant="outlined" component="label">
                      Selecionar Imagem (máx. 1MB)
                      <input hidden accept="image/*" type="file" />
                    </Button>
                    <Button variant="contained">Salvar Opção</Button>
                  </Box>
                </Paper>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
