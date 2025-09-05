import { useEffect, useMemo, useState } from 'react';
import {
  Tabs, Tab, Box, TextField, Button, Paper, MenuItem, Select, InputLabel, FormControl, Input,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Alert,
  Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,FormControlLabel 
} from '@mui/material';
import GradingIcon from '@mui/icons-material/Grading';
import ShoppingCartIcon from '@mui/icons-material/Fastfood';
import CategoryIcon from '@mui/icons-material/MenuBook';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ImportExportIcon from '@mui/icons-material/ImportExport';

// Dica: caso sua aplicação tenha um layout com height: 100vh e overflow: hidden no body/#root,
// remova esse overflow ou torne a área interna rolável (maxHeight + overflowY: 'auto').

export default function CadastroProduto() {
  const [tabIndex, setTabIndex] = useState(0); // abas principais
  const [produtoTabIndex, setProdutoTabIndex] = useState(0); // subabas de produto
  const [opcaoTabIndex, setOpcaoTabIndex] = useState(0); // subabas de categoria de opção
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [acaoSalvar, setAcaoSalvar] = useState(null); // aqui guardo qual botão chamou
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [categoriaFiltroOpcao, setCategoriaFiltroOpcao] = useState("");
  const [categoriaFiltroOpcaoItens, setCategoriaFiltroOpcaoItens] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [produtoSelecionadoItens, setProdutoSelecionadoItens] = useState("");
  const [itemSelecionado, setItemSelecionado] = useState("");
  // === ATUALIZAR CATEGORIAS E PRODUTOS ===
  const [atualizarCategoria, setAtualizarCategoria] = useState(0); // subabas de produto
  const [atualizarProduto, setAtualizarProduto] = useState(0); // subabas de categoria de opção
  const [atualizarItens, setAtualizarItens] = useState(0);

  // === ESTADOS ===
  const [categoria, setCategoria] = useState({ nome: '', imagem: null ,arquivo: null,preview: null});
  const [produto, setProduto] = useState({
    nome: '', descricao: '', preco: '', aPartirDe: 0,imagem: null, idCategoria: '',
    quantidadeMaximaAcrescimoPorProduto: null, status: 1,arquivo: null,preview: null, nomeCategoria: ''
  });
  const [acrescimo, setAcrescimo] = useState({
    nome: '', descricao: '', preco: '', imagem: null, quantidadeMaximaIndividual: '', status: 1,arquivo: null,preview: null
  });
  const [categoriaOpcao, setCategoriaOpcao] = useState({
    nome: '', idProduto: '', mostrarNome: true, observacao: "", quantidadeEscolhaPorProduto: '', status: 1
  });
    const [opcao, setOpcao] = useState({
    nome: '', descricao: '', idCategoriaDeOpcao:'', imagem: null, status: 1, preco:'', semPreco: false,arquivo: null,preview: null
  });

  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [itensDisponiveis,setItensDisponiveis] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);

  const [msg, setMsg] = useState(null);
  
  // Lista de categorias únicas
  const categorias = [...new Set(produtosDisponiveis.map((p) => p.nomeCategoria))];

  // Produtos filtrados pela categoria escolhida
  const produtosFiltrados = produtosDisponiveis.filter(
    (p) => p.nomeCategoria === categoriaFiltroOpcao
  );

  const produtosFiltradosItens = produtosDisponiveis.filter(
    (p) => p.nomeCategoria === categoriaFiltroOpcaoItens
  );

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg(null);
      }, 5000); // ⏱️ 3 segundos

      return () => clearTimeout(timer); // limpa se o componente desmontar
    }
  }, [msg]);

useEffect(() => {
  const fetchCategorias = async () => {
    try {
      const response = await fetch("https://localhost:7039/api/Categoria", {
        method: "GET",
        credentials: "include" // <- ESSENCIAL para enviar cookies
      });
      const data = await response.json();
      setCategoriasDisponiveis(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  fetchCategorias();
}, [atualizarCategoria]);

useEffect(() => {
  const fetchProdutos = async () => {
    try {
      const response = await fetch("https://localhost:7039/api/Produto", {
        method: "GET",
        credentials: "include" // <- ESSENCIAL para enviar cookies
      });
      const data = await response.json();
      setProdutosDisponiveis(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  fetchProdutos();
}, [atualizarProduto]);

useEffect(() => {
  if (!produtoSelecionadoItens) return; // só roda se tiver produto selecionado

  const fetchProdutos = async () => {
    try {
      const response = await fetch(
        "https://localhost:7039/api/GrupoDeOpcao/" + produtoSelecionadoItens,
        {
          method: "GET",
          credentials: "include" // mantém cookies/sessão
        }
      );
      const data = await response.json();
      console.log(data);
      setItensDisponiveis(data);
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
    }
  };

  fetchProdutos();
}, [produtoSelecionadoItens]); // dispara quando o produto muda


const handleTabChange = (_, newValue) => {
  setTabIndex(newValue);
  setProdutoTabIndex(0); // sempre que muda a aba principal, resetar subaba
};

const handleProdutoTabChange = (_, newValue) => {
  setProdutoTabIndex(newValue);
  setOpcaoTabIndex(0)
};

const handleTabChangeOpcao = (_, newValue) => {
  setOpcaoTabIndex(newValue);
};
const handleImageChange = (event, setter, field = 'imagem') => {
  const file = event.target.files[0];

  if (!file) return;
  const previewUrl = URL.createObjectURL(file);
  setter(prev => ({ ...prev, arquivo: file, preview: previewUrl})); 

  if (file.size <= 100 * 1024 || file.size >= 600 * 1024)  {
    alert('A imagem deve ter no mínimo 100 KB e no máximo 600KB');
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    // o resultado vem como base64
    setter(prev => ({ ...prev, [field]: reader.result.split(",")[1] })); 
    // split(",")[1] -> remove o prefixo "data:image/png;base64,"
  };
  reader.readAsDataURL(file);
};

const handleCheckboxChange = (produto) => {
  setProdutosSelecionados((prev) => {
    const exists = prev.find((p) => p.id=== produto.id);
    if (exists) {
      // Se já existe, remove
      return prev.filter((p) => p.id !== produto.id);
    } else {
      // Se não existe, adiciona
      return [...prev, { id: produto.id, nomeCategoria: produto.nomeCategoria }];
    }
  });
};

  // === VALIDAÇÕES SIMPLES ===
  const req = (v) => v !== undefined && v !== null && String(v).trim() !== '';
  const isNumber = (v) => v === '' || /^\d+(,\d{1,2}|\.\d{1,2})?$/.test(String(v));

  // === HANDLERS DE SALVAR (mock) ===
const salvarCategoria = async () => {
  if (!req(categoria.nome)) {
    return setMsg({ type: 'error', text: 'Informe o nome da categoria.' });
  }
  try {
    const response = await fetch("https://localhost:7039/api/Categoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: categoria.nome,
        imagem: categoria.imagem
      }),
      credentials: "include" // ✅ envia cookies HTTP-only
    });

    if (response.ok) {
      const data = await response.json();
       setCategoria({
        nome: '',
        imagem: null,
        arquivo: null,
        preview: null
      });
      setMsg({ type: "success", text: "Categoria salva com sucesso!" });
      setAtualizarCategoria(atualizarCategoria + 1);
    } else {
      const error = await response.json();
      setMsg({ type: "error", text: "Erro ao salvar categoria: " + error.message });
    }
  } catch (err) {
    setMsg({ type: "error", text: "Erro de conexão com servidor." });
  }
};

const confirmarSalvar = () => {
  setConfirmOpen(false);
  if (acaoSalvar === "produto") salvarProduto();
  if (acaoSalvar === "categoria") salvarCategoria();
  if (acaoSalvar === "acrescimo") salvarAcrescimo();
  if (acaoSalvar === "categoriaDeOpcao") salvarCategoriaOpcao();
  if (acaoSalvar === "opcao") salvarOpcao();
};

  const salvarProduto = async () => {
    if (!req(produto.nome)) return setMsg({ type: 'error', text: 'Informe o nome do produto.' });
    if (!req(produto.idCategoria)) return setMsg({ type: 'error', text: 'Selecione a categoria do produto.' });
    if (!isNumber(produto.preco) || produto.preco =="") return setMsg({ type: 'error', text: 'Preço inválido.' });
    try {
    const response = await fetch("https://localhost:7039/api/Produto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: produto.nome,
        idCategoria: produto.idCategoria,
        nomeCategoria: produto.nomeCategoria,
        descricao: produto.descricao,
        quantidadeMaximaAcrescimoPorProduto: Number(produto.quantidadeMaximaAcrescimoPorProduto) || null,
        preco: produto.preco.replace(",", "."),
        aPartirDe: produto.aPartirDe ? 1 : 0,
        status: produto.status,
        imagem: produto.imagem
      }),
      credentials: "include" // ✅ envia cookies HTTP-only
    });

    if (response.ok) {
      const data = await response.json();
       setProduto({
          nome: '', descricao: '', preco: '', imagem: null, idCategoria: '',
          quantidadeMaximaAcrescimoPorProduto: '', status: 1,arquivo: null,preview: null,nomeCategoria:''
      });
      setMsg({ type: "success", text: "Produto salva com sucesso!" });
      setAtualizarProduto(atualizarProduto + 1);
    } else {
      const error = await response.json();
      setMsg({ type: "error", text: "Erro ao salvar Produto: " + error.message });
    }
  } catch (err) {
    setMsg({ type: "error", text: "Erro de conexão com servidor." });
  }
  };

  const salvarAcrescimo = async () =>{
    if (!req(acrescimo.nome)) return setMsg({ type: 'error', text: 'Informe o nome do acréscimo.' });
    if (!isNumber(acrescimo.preco) || acrescimo.preco =="") return setMsg({ type: 'error', text: 'Preço do acréscimo inválido.' });
    if (produtosSelecionados.length === 0) return setMsg({ type: 'error', text: 'Selecione ao menos um produto para vincular.' });

    try {
    const response = await fetch("https://localhost:7039/api/Acrescimo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: acrescimo.nome,
        produtos: produtosSelecionados,
        descricao: acrescimo.descricao,
        quantidadeMaximaAcrescimoPorProduto: Number(acrescimo.quantidadeMaximaAcrescimoPorProduto) || null,
        preco: acrescimo.preco.replace(",", "."),
        status: acrescimo.status,
        imagem: acrescimo.imagem,

      }),
      credentials: "include" // ✅ envia cookies HTTP-only
    });

    if (response.ok) {
      const data = await response.json();
      setProdutosSelecionados([]);
      setAcrescimo({
        nome: '', descricao: '', preco: '', imagem: null, quantidadeMaximaIndividual: '', status: 1,arquivo: null,preview: null
      });
      setMsg({ type: "success", text: "Acréscimo salvo com sucesso!" });
      setAtualizarProduto(atualizarProduto + 1);
    } else {
      const error = await response.json();
      setMsg({ type: "error", text: "Erro ao salvar Produto: " + error.message });
    }
  } catch (err) {
    setMsg({ type: "error", text: "Erro de conexão com servidor." });
  }
  };

   const salvarCategoriaOpcao = async () => {
    if (!req(categoriaFiltroOpcao)) return setMsg({ type: 'error', text: 'Selecione a Categoria.' });
    if (!req(produtoSelecionado)) return setMsg({ type: 'error', text: 'Selecione o produto.' });
    if (!req(categoriaOpcao.nome)) return setMsg({ type: 'error', text: 'Informe o nome do grupo de opçoão.' });
    if (!req(categoriaOpcao.quantidadeEscolhaPorProduto)) return setMsg({ type: 'error', text: 'Informe a quantidade de escolha de itens desta opção.' });
    if (categoriaOpcao.quantidadeEscolhaPorProduto == 0) return setMsg({ type: 'error', text: 'Informe a quantidade de escolha de itens não pode ser 0 (zero).' });
    try {
    const response = await fetch("https://localhost:7039/api/GrupoDeOpcao", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: categoriaOpcao.nome,
        idproduto: produtoSelecionado,
        mostrarNome: categoriaOpcao.mostrarNome ? 1 : 0,
        observacao: categoriaOpcao.observacao,
        quantidadeEscolhaPorProduto: Number(categoriaOpcao.quantidadeEscolhaPorProduto) || null,
        status: categoriaOpcao.status,
      }),
      credentials: "include" // ✅ envia cookies HTTP-only
    });

    if (response.ok) {
      const data = await response.json();
       setCategoriaOpcao({
          nome: '', observacao: '', idProduto: '',
          quantidadeEscolhaPorProduto: '', status: 1,mostrarNome: true
      });
      setAtualizarItens(atualizarItens + 1)
      setMsg({ type: "success", text: "Grupo de Opção salvo com sucesso!" });
    } else {
      const error = await response.json();
      setMsg({ type: "error", text: "Erro ao salvar Grupo de Opção: " + error.message });
    }
  } catch (err) {
    setMsg({ type: "error", text: "Erro de conexão com servidor." });
  }
  };

  const salvarOpcao = async () => {
    if (!req(itemSelecionado)) return setMsg({ type: 'error', text: 'Selecione o Grupo de Opção.' });
    if (!req(opcao.nome)) return setMsg({ type: 'error', text: 'Informe o nome do item da opção.' });
    if (!opcao.semPreco && (!isNumber(opcao.preco) || opcao.preco =="")) return setMsg({ type: 'error', text: 'Favor informar um preço válido para este item de opção ou marcar "sem preço".' });
    try {
    const response = await fetch("https://localhost:7039/api/Opcao", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: opcao.nome,
        idCategoriaDeOpcao: itemSelecionado,
        nomeCategoria: categoriaFiltroOpcaoItens,
        descricao: opcao.descricao,
        imagem: opcao.imagem,
        status: opcao.status,
        preco: opcao.semPreco ? null : opcao.preco,
        semPreco: opcao.semPreco ? 1 : 0
      }),
      credentials: "include" // ✅ envia cookies HTTP-only
    });

    if (response.ok) {
      const data = await response.json();
      setOpcao({
         nome: '', descricao: '', idCategoriaDeOpcao:'', imagem: null, status: 1, preco:'', semPreco: false,arquivo: null,preview: null
      });
      setMsg({ type: "success", text: "Item de Opção salvo com sucesso!" });
    } else {
      const error = await response.json();
      setMsg({ type: "error", text: "Erro ao salvar Item de Opção: " + error.message });
    }
  } catch (err) {
    setMsg({ type: "error", text: "Erro de conexão com servidor." });
  }
  };

  return (
    <><Box 
          sx={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 1000, 
            backgroundColor: 'white', // importante para não "sumir" ao rolar
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'initial', 
            gap: 2, 
            py: 1,
            boxShadow: 1,
            paddingLeft: 2
          }}
        >
        <img 
          src="/imagens/baratíssimo.png" 
          alt="Logo" 
          style={{ width: 40, height: 40, objectFit: 'contain' }} 
        />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Cadastro de Produtos</h1>
      </Box>
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 2, px: 1 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', // centraliza horizontalmente
          gap: 2, 
          mb: 1 
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Cardápio</h1>
        <img 
          src="/imagens/cardapio.png" 
          alt="Logo" 
          style={{ width: 40, height: 40, objectFit: 'contain' }} 
      />
    </Box>
      <Tabs value={tabIndex} onChange={handleTabChange}  variant="scrollable" scrollButtons="auto">
        <Tab iconPosition="start" icon={<CategoryIcon />} label="Categoria" />
        <Tab iconPosition="start" icon={<ShoppingCartIcon />} label="Produto" />
      </Tabs>

      {/* ABA CATEGORIA */}
      {tabIndex === 0 && (
        <Paper sx={{
            p: 3,
            mt: 2,
            maxHeight: { xs: 'calc(100vh - 210px)', md: 'calc(100vh - 240px)' },
            
         }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
            label="Nome da Categoria"
            value={categoria.nome}
            onChange={(e) => setCategoria({ ...categoria, nome: e.target.value })}
            fullWidth
            inputProps={{ maxLength: 50 }} 
            helperText={`${categoria.nome.length}/50`} // 👈 contador de caracteres
            />
            <Button variant="outlined" component="label">
              Selecionar Imagem (min. 100KB e máx. 600KB)
              <input hidden accept="image/*" type="file"
                     onChange={(e) => handleImageChange(e, setCategoria)} />
            </Button>
           {categoria.arquivo && (
              <div style={{ marginTop: "1rem" }}>
                <p>Imagem selecionada: {categoria.arquivo.name}</p>
                <img
                  src={categoria.preview}
                  alt="Pré-visualização"
                  style={{ maxWidth: "200px", borderRadius: "8px", maxHeight:"100px" }}
                />
              </div>
            )}
            <Button variant="contained" onClick={() => { setAcaoSalvar("categoria"); setConfirmOpen(true); }}>Salvar Categoria</Button>
          </Box>
        </Paper>
      )}

      {/* ABA PRODUTO */}
      {tabIndex === 1 && (
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Tabs value={produtoTabIndex} onChange={handleProdutoTabChange} variant="scrollable" scrollButtons="auto">
            <Tab iconPosition="start" icon={<GradingIcon />} label="Dados" />
            <Tab iconPosition="start" icon={<AddCircleOutlineIcon/>} label="Acréscimos" />
            <Tab iconPosition="start" icon={<ImportExportIcon/>} label="Opções" />
          </Tabs>

          {/* Subaba Dados */}
          {produtoTabIndex === 0 && (
            <Paper sx={{
                p: 3,
                mt: 2,
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Selecione a Categoria</InputLabel>
                  <Select
                    value={produto.idCategoria || ""}
                    onChange={(e) => {
                      const categoriaSelecionada = categoriasDisponiveis.find(
                        (cat) => cat.id === e.target.value
                      );
                      setProduto({
                        ...produto,
                        idCategoria: e.target.value,
                        nomeCategoria: categoriaSelecionada ? categoriaSelecionada.nome : "",
                      });
                    }}
                    label="Selecione a Categoria"
                  >
                    {categoriasDisponiveis.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField label="Nome do Produto" value={produto.nome}
                  onChange={(e) => setProduto({ ...produto, nome: e.target.value })} fullWidth 
                  inputProps={{ maxLength: 50 }} 
                  helperText={`${produto.nome.length}/50`} />

                <TextField label="Descrição" multiline minRows={3} value={produto.descricao}
                  onChange={(e) => setProduto({ ...produto, descricao: e.target.value })} fullWidth 
                  inputProps={{ maxLength: 255 }} 
                  helperText={`${produto.descricao.length}/255`} />

                <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Box display="flex" flexDirection='column' gap={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={produto.aPartirDe}
                          onChange={(e) =>
                            setProduto({ ...produto, aPartirDe: e.target.checked })
                          }
                        />
                      }
                      label="A partir de (preços nas opções)"
                    />
                    <TextField
                      label="Preço"
                      value={produto.preco}
                      onChange={(e) => {
                        let raw = e.target.value.replace(/\D/g, "");

                        if (!raw) {
                          setProduto({ ...produto, preco: "" });
                          return;
                        }

                        if (raw.length === 1) raw = "0" + raw;
                        if (raw.length === 2) raw = "0" + raw;

                        const reais = raw.slice(0, -2);
                        const centavos = raw.slice(-2);
                        const valorFormatado = `${parseInt(reais, 10)},${centavos}`;

                        setProduto({ ...produto, preco: valorFormatado });
                      }}
                      fullWidth
                      inputProps={{ maxLength: 15 }}
                    />
                  </Box>
                </Paper>

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
                  Selecionar Imagem (min. 100KB e máx. 600KB)
                  <input hidden accept="image/*" type="file"
                         onChange={(e) => handleImageChange(e, setProduto)} />
                </Button>
                {produto.arquivo && (
                  <div style={{ marginTop: "1rem" }}>
                    <p>Imagem selecionada: {produto.arquivo.name}</p>
                    <img
                      src={produto.preview}
                      alt="Pré-visualização"
                      style={{ maxWidth: "200px", borderRadius: "8px", maxHeight:"100px" }}
                    />
                  </div>
                )}
                <Button variant="contained" onClick={() => { setAcaoSalvar("produto"); setConfirmOpen(true); }}>Salvar Produto</Button>
              </Box>
            </Paper>
          )}

          {/* Subaba Acréscimos */}
          {produtoTabIndex === 1 && (
           <Paper sx={{
                p: 3,
                mt: 2,
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Nome do Acréscimo" value={acrescimo.nome} onChange={(e) => setAcrescimo({ ...acrescimo, nome: e.target.value })} fullWidth
                  inputProps={{ maxLength: 50 }} 
                  helperText={`${produto.descricao.length}/50`} />
                <TextField label="Descrição" multiline value={acrescimo.descricao} onChange={(e) => setAcrescimo({ ...acrescimo, descricao: e.target.value })} fullWidth 
                  inputProps={{ maxLength: 255 }} 
                  helperText={`${produto.descricao.length}/255`} />
                <TextField
                  label="Preço"
                  value={acrescimo.preco}
                  onChange={(e) => {
                    // Mantém apenas números
                    let raw = e.target.value.replace(/\D/g, "");

                    // Se não digitar nada, zera
                    if (!raw) {
                    setAcrescimo({ ...acrescimo, preco: "" });
                    return;
                    }

                    // Garante ao menos 3 dígitos para conseguir separar reais e centavos
                    if (raw.length === 1) raw = "0" + raw;
                    if (raw.length === 2) raw = "0" + raw;

                    // Formata: últimos 2 dígitos = centavos
                    const reais = raw.slice(0, -2);
                    const centavos = raw.slice(-2);
                    const valorFormatado = `${parseInt(reais, 10)},${centavos}`;

                    setAcrescimo({ ...acrescimo, preco: valorFormatado });
                }}
                fullWidth
                inputProps={{ maxLength: 15 }} // evita números absurdamente grandes
                />
                <TextField label="Qtd Máx Individual" type="number" value={acrescimo.quantidadeMaximaIndividual} onChange={(e) => setAcrescimo({ ...acrescimo, quantidadeMaximaIndividual: e.target.value })} fullWidth />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={acrescimo.status} onChange={(e) => setAcrescimo({ ...acrescimo, status: e.target.value })} label="Status">
                    <MenuItem value={1}>Ativo</MenuItem>
                    <MenuItem value={0}>Inativo</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="outlined" component="label">
                  Selecionar Imagem (min. 100KB e máx. 600KB)
                  <input hidden accept="image/*" type="file"
                         onChange={(e) => handleImageChange(e, setAcrescimo)} />
                </Button>
                {acrescimo.arquivo && (
                  <div style={{ marginTop: "1rem" }}>
                    <p>Imagem selecionada: {acrescimo.arquivo.name}</p>
                    <img
                      src={acrescimo.preview}
                      alt="Pré-visualização"
                      style={{ maxWidth: "200px", borderRadius: "8px", maxHeight:"100px" }}
                    />
                  </div>
                )}

                <h3>Selecione um ou mais produtos para este acréscimo</h3>

                {/* Filtro de Categoria */}
                <FormControl sx={{ mb: 2, minWidth: 200 }} size="small">
                  <InputLabel>Filtrar por Categoria</InputLabel>
                  <Select
                    value={categoriaFiltro}
                    label="Filtrar por Categoria"
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {[...new Set(produtosDisponiveis.map((p) => p.nomeCategoria))].map(
                      (cat, idx) => (
                        <MenuItem key={idx} value={cat}>
                          {cat}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>

                <TableContainer sx={{ maxHeight: 200 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Selecionar</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Produto</TableCell>
                        <TableCell>Categoria</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {produtosDisponiveis
                        .filter((prod) =>
                          categoriaFiltro ? prod.nomeCategoria === categoriaFiltro : true
                        )
                        .map((prod) => (
                          <TableRow key={prod.id}>
                            <TableCell>
                              <Checkbox
                                checked={produtosSelecionados.some((p) => p.id === prod.id)}
                                onChange={() => handleCheckboxChange(prod)}
                              />
                            </TableCell>
                            <TableCell>{prod.id}</TableCell>
                            <TableCell>{prod.nome}</TableCell>
                            <TableCell>{prod.nomeCategoria}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => { setAcaoSalvar("acrescimo"); setConfirmOpen(true); }}>Salvar Acréscimo</Button>
              </Box>
           </Paper>
          )}

          {/* Subaba Categorias de Opção */}
          {produtoTabIndex === 2 && (
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Tabs value={opcaoTabIndex} onChange={handleTabChangeOpcao} variant="scrollable" scrollButtons="auto">
                <Tab label="Grupo de Opção" />
                <Tab label="Itens Do Grupo de Opção" />
              </Tabs>

              {/* Subaba Categoria de Opção */}
              {opcaoTabIndex === 0 && (
              <Paper sx={{
                p: 3,
                mt: 2,
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Combo de Categorias */}
                    <FormControl sx={{ mb: 2, minWidth: 200 }} size="small">
                      <InputLabel>Selecionar a Categoria</InputLabel>
                      <Select
                        value={categoriaFiltroOpcao}
                        label="Selecionar a Categoria"
                        onChange={(e) => {
                          setCategoriaFiltroOpcao(e.target.value);
                          setProdutoSelecionado(""); // limpa produto quando muda categoria
                        }}
                      >
                        {categorias.map((cat, idx) => (
                          <MenuItem key={idx} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Combo de Produtos (aparece só se tiver categoria escolhida) */}
                    {categoriaFiltroOpcao && (
                      <FormControl sx={{ mb: 2, minWidth: 200 }} size="small">
                        <InputLabel>Selecionar o Produto</InputLabel>
                        <Select
                          value={produtoSelecionado}
                          label="Selecionar o Produto"
                          onChange={(e) => setProdutoSelecionado(e.target.value)}
                        >
                          {produtosFiltrados.map((prod) => (
                            <MenuItem key={prod.id} value={prod.id}>
                              {prod.nome}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                      <Box display="flex" flexDirection= 'column' gap={2}>
                      <TextField label="Nome" value={categoriaOpcao.nome} onChange={(e) => setCategoriaOpcao({ ...categoriaOpcao, nome: e.target.value })} fullWidth
                      inputProps={{ maxLength: 50 }} 
                      helperText={`${categoriaOpcao.nome.length}/50`} />
                            <FormControlLabel
                            control={
                              <Checkbox
                                checked={categoriaOpcao.mostrarNome}
                                onChange={(e) =>
                                  setCategoriaOpcao({ ...categoriaOpcao, mostrarNome: e.target.checked })
                                }
                              />
                            }
                            label="Mostrar nome no menu"
                          />
                        </Box>
                    </Paper>
                    <TextField label="Observação" value={categoriaOpcao.observacao} onChange={(e) => setCategoriaOpcao({ ...categoriaOpcao, observacao: e.target.value })} fullWidth
                     inputProps={{ maxLength: 50 }} 
                     helperText={`${categoriaOpcao.observacao.length}/50`} />
                    <TextField label="Quantidade de itens poderá escolher" type="number" value={categoriaOpcao.quantidadeEscolhaPorProduto} onChange={(e) => setCategoriaOpcao({ ...categoriaOpcao, quantidadeEscolhaPorProduto: e.target.value })} fullWidth />
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select value={categoriaOpcao.status} onChange={(e) => setCategoriaOpcao({ ...categoriaOpcao, status: e.target.value })} label="Status">
                        <MenuItem value={1}>Ativo</MenuItem>
                        <MenuItem value={0}>Inativo</MenuItem>
                      </Select>
                    </FormControl>
                    {categoriaOpcao.imagem && <p>Imagem selecionada: {categoriaOpcao.imagem.name}</p>}
                    <Button variant="contained" onClick={() => { setAcaoSalvar("categoriaDeOpcao"); setConfirmOpen(true); }}>Salvar Grupo de Opção</Button>
                  </Box>
                </Paper>
              )}

              {/* Subaba Opção */}
              {opcaoTabIndex === 1 && (
                <Paper sx={{
                    p: 3,
                    mt: 2,                  
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
                  {/* Combo de Categorias */}
                    <FormControl sx={{ mb: 2, minWidth: 200 }} size="small">
                      <InputLabel>Selecionar a Categoria</InputLabel>
                      <Select
                        value={categoriaFiltroOpcaoItens}
                        label="Filtrar por Categoria"
                        onChange={(e) => {
                          setCategoriaFiltroOpcaoItens(e.target.value);
                          setProdutoSelecionadoItens(""); // limpa produto quando muda categoria
                        }}
                      >
                        {categorias.map((cat, idx) => (
                          <MenuItem key={idx} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Combo de Produtos (aparece só se tiver categoria escolhida) */}
                    {categoriaFiltroOpcaoItens && (
                      <FormControl sx={{ mb: 2, minWidth: 200 }} size="small">
                        <InputLabel>Selecionar o Produto</InputLabel>
                        <Select
                          value={produtoSelecionadoItens}
                          label="Selecionar o Produto"
                          onChange={(e) => {setProdutoSelecionadoItens(e.target.value)
                             setItemSelecionado(""); 
                          }}
                        >
                          {produtosFiltradosItens.map((prod) => (
                            <MenuItem key={prod.id} value={prod.id}>
                              {prod.nome}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    {/* Combo de grupo de opção (aparece só se tiver produto escolhido) */}
                    {produtoSelecionadoItens && (
                      <FormControl sx={{ mb: 2, minWidth: 200 }} size="small">
                        <InputLabel>Selecionar o Grupo de Opções</InputLabel>
                        <Select
                          value={itemSelecionado}
                          label="Selecionar o Grupo de Opções"
                          onChange={(e) => setItemSelecionado(e.target.value)}
                        >
                          {itensDisponiveis.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.nome}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    <TextField label="Nome" fullWidth value={opcao.nome} onChange={(e) => setOpcao({ ...opcao, nome: e.target.value })}
                     inputProps={{ maxLength: 50 }} 
                     helperText={`${opcao.nome.length}/50`} />
                    <TextField label="Descrição" fullWidth multiline minRows={2}
                      value={opcao.descricao} onChange={(e) => setOpcao({ ...opcao, descricao: e.target.value })}
                      inputProps={{ maxLength: 255 }} 
                      helperText={`${opcao.descricao.length}/255`} />
                    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                      <Box display="flex" flexDirection='column' gap={1}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={opcao.semPreco}
                              onChange={(e) =>
                                setOpcao({ ...opcao, semPreco: e.target.checked })
                              }
                            />
                          }
                          label="Sem preço (preço no Produto)"
                        />
                        <TextField
                          label="Preço"
                          disabled={opcao.semPreco} 
                          value={opcao.preco}
                          onChange={(e) => {
                            let raw = e.target.value.replace(/\D/g, "");

                            if (!raw) {
                              setProduto({ ...opcao, preco: "" });
                              return;
                            }

                            if (raw.length === 1) raw = "0" + raw;
                            if (raw.length === 2) raw = "0" + raw;

                            const reais = raw.slice(0, -2);
                            const centavos = raw.slice(-2);
                            const valorFormatado = `${parseInt(reais, 10)},${centavos}`;

                            setProduto({ ...produto, preco: valorFormatado });
                          }}
                          fullWidth
                          inputProps={{ maxLength: 15 }}
                        />
                      </Box>
                    </Paper>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select defaultValue={1} value={opcao.status} onChange={(e) => setCategoriaOpcao({ ...opcao, status: e.target.value })}  label="Status">
                        <MenuItem value={1}>Ativo</MenuItem>
                        <MenuItem value={0}>Inativo</MenuItem>
                      </Select>
                    </FormControl>
                    <Button variant="outlined" component="label">
                      Selecionar Imagem (min. 100KB e máx. 600KB)
                      <input hidden accept="image/*" type="file"
                            onChange={(e) => handleImageChange(e, setOpcao)} />
                    </Button>
                    {opcao.arquivo && (
                      <div style={{ marginTop: "1rem" }}>
                        <p>Imagem selecionada: {opcao.arquivo.name}</p>
                        <img
                          src={opcao.preview}
                          alt="Pré-visualização"
                          style={{ maxWidth: "200px", borderRadius: "8px", maxHeight:"100px" }}
                        />
                      </div>
                    )}
                    <Button variant="contained" onClick={() => { setAcaoSalvar("opcao"); setConfirmOpen(true); }}>Salvar Opção</Button>
                  </Box>
                </Paper>
              )}
            </Box>
          )}
        </Box>
      )}
      
      {msg && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            width: { xs: "90%", sm: "400px", md: "500px" }, // responsivo por breakpoint
            maxWidth: "800px", // não ultrapassa 90% da tela
          }}
        >
          <Alert
            severity={msg.type}
            onClose={() => setMsg(null)}
            variant="filled"
          >
            {msg.text}
          </Alert>
        </Box>
      )}
       
      {/* Diálogo de confirmação */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Confirmar salvamento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente realizar esta ação?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmarSalvar} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
</>
  );
}
