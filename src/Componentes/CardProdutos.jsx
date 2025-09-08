import React, { useState, useEffect, useContext } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, IconButton, Box, Radio, RadioGroup,
  FormControlLabel, Card, CardContent, CardMedia, TextField, Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import { CarrinhoContext } from "../contexts/CarrinhoProvider";
import BotaoMaisMenos from "./BotaoMaisMenos.jsx";
import Teacher1 from "../imagens/cachoroQuente.jpg";

function CardProdutos({ produto }) {
  const [open, setOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(1);
  const [hover, setHover] = useState(true);
  const [observacoes, setObservacoes] = useState("");
  const [acrescimos, setAcrescimos] = useState([]);
  const [quantidadesAcrescimos, setQuantidadesAcrescimos] = useState({});
  const [valorTotalAcrescimos, setValorTotalAcrescimos] = useState(0);
  const [gruposDeOpcao, setGruposDeOpcao] = useState([]);
  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState({});

  const quantidadeMaximaPorProduto = produto.quantidadeMaximaAcrescimoPorProduto;
  const navigate = useNavigate();
  const imagemSrc = produto.imagemProduto ? "/imagens/1/" + produto.imagemProduto : Teacher1;
  const precoProduto = produto.preco ?? 0;
  const precoFinal = (precoProduto + valorTotalAcrescimos) * totalPrice;

  const handleClickOpen = () => {
    setOpen(true);

    fetch(`https://localhost:7039/api/Acrescimo/${produto.produtoId}`)
      .then((res) => res.json())
      .then((data) => setAcrescimos(data))
      .catch((err) => console.error("Erro ao buscar acréscimos:", err));

    fetch(`https://localhost:7039/api/GrupoDeOpcao/${produto.produtoId}/grupos-de-opcoes`)
      .then((res) => res.json())
      .then((data) => setGruposDeOpcao(data))
      .catch((err) => console.error("Erro ao buscar grupos de opção:", err));
  };

  const handleClose = () => setOpen(false);

  const atualizarQuantidade = (id, delta, maxIndividual) => {
    setQuantidadesAcrescimos((prev) => {
      const atual = prev[id] || 0;
      const totalAtual = Object.values(prev).reduce((s, q) => s + q, 0);
      const novoValor = Math.max(0, Math.min(atual + delta, maxIndividual ?? Infinity));
      if (quantidadeMaximaPorProduto && totalAtual + delta > quantidadeMaximaPorProduto) return prev;
      return { ...prev, [id]: novoValor };
    });
  };

  const atualizarOpcao = (grupoId, opcaoId, delta, maxGrupo, maxIndividual) => {
    setOpcoesSelecionadas((prev) => {
      const grupo = prev[grupoId] || {};
      const atual = grupo[opcaoId] || 0;
      const totalGrupo = Object.values(grupo).reduce((s, q) => s + q, 0);
      const novoValor = Math.max(0, Math.min(atual + delta, maxIndividual ?? Infinity));
      if (maxGrupo && totalGrupo + delta > maxGrupo) return prev;
      return { ...prev, [grupoId]: { ...grupo, [opcaoId]: novoValor } };
    });
  };

  useEffect(() => {
    const total = acrescimos.reduce((sum, a) => {
      const qtd = quantidadesAcrescimos[a.acrescimoId] || 0;
      return sum + qtd * (a.preco || 0);
    }, 0);
    setValorTotalAcrescimos(total);
  }, [quantidadesAcrescimos, acrescimos]);

  const handleAddToCart = () => {
    const acrescimosSelecionados = acrescimos
      .filter((a) => (quantidadesAcrescimos[a.acrescimoId] || 0) > 0)
      .map((a) => ({ ...a, quantidade: quantidadesAcrescimos[a.acrescimoId] }));

    const opcoesSelecionadasFormatadas = [];
    for (const grupo of gruposDeOpcao) {
      const selecionadas = opcoesSelecionadas[grupo.idGrupo] || {};
      for (const [id, qtd] of Object.entries(selecionadas)) {
        if (qtd > 0) {
          const opcao = grupo.opcoes.find((o) => o.idOpcao === parseInt(id));
          if (opcao) {
            opcoesSelecionadasFormatadas.push({
              ...opcao,
              quantidade: qtd,
              idGrupo: grupo.idGrupo,
              nomeGrupo: grupo.nomeGrupo,
            });
          }
        }
      }
    }

    const produtoRecebido = {
      idProduto: produto.produtoId,
      nomeProduto: produto.nomeProduto,
      preco: produto.preco,
      imagemProduto: produto.imagemProduto,
      quantity: totalPrice,
      observacoes,
      acrescimos: acrescimosSelecionados,
      opcoes: opcoesSelecionadasFormatadas,
    };

    navigate("/Carrinho", { state: { produto: produtoRecebido } });
  };

  return (
    <>
      {/* Card resumido */}
<Card
  onClick={handleClickOpen}
  sx={{
    minHeight: 110,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 2,
    boxShadow: 3,
    mb: 0,
    mt: 1,
    cursor: "pointer",
    overflow: "hidden",
    p: 0
  }}
>
  <CardContent
    sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between", // espaça título e preço
      height: "100%", // garante que o conteúdo ocupe toda altura do card
      p:1
    }}
  >
    {/* Título no topo */}
    <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ mb: 1 ,fontSize: "1rem"}} >
      {produto.nome}
    </Typography>

    {/* Descrição mais centralizada */}
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        display: "-webkit-box",
        WebkitLineClamp: 2, // máximo de 2 linhas
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        mb: 1, // distancia da descrição para o preço
      }}
    >
      {produto.descricao}
    </Typography>

    {/* Preço no final */}
    <Typography variant="subtitle2" fontWeight="bold" color="text.primary" sx={{ fontSize: "1rem" }}>
     R$ {produto.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </Typography>
  </CardContent>

  <CardMedia
    component="img"
    image={imagemSrc}
    alt={produto.nomeProduto}
    sx={{
      width: 100,
      height: 100,
      borderRadius: 2,
      objectFit: "cover",
      marginRight: 1,
    }}
  />
</Card>

      {/* Modal de detalhes */}
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle>
          {produto.nomeProduto}
          <IconButton onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box textAlign="center" mb={2}>
            <CardMedia
              component="img"
              image={imagemSrc}
              alt={produto.nomeProduto}
              sx={{ borderRadius: 2, maxHeight: 200, objectFit: "contain" }}
            />
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {produto.descricao}
          </Typography>

          {/* Acréscimos */}
          {acrescimos.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Acréscimos
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {quantidadeMaximaPorProduto === 1 ? (
                <RadioGroup
                  value={Object.entries(quantidadesAcrescimos).find(([_, v]) => v > 0)?.[0] || ""}
                  onChange={(e) => {
                    const idSelecionado = parseInt(e.target.value);
                    const novos = {};
                    acrescimos.forEach((a) => {
                      novos[a.acrescimoId] = a.acrescimoId === idSelecionado ? 1 : 0;
                    });
                    setQuantidadesAcrescimos(novos);
                  }}
                >
                  <FormControlLabel value="" control={<Radio />} label="Nenhum" />
                  {acrescimos.map((a) => (
                    <Box key={a.acrescimoId} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <CardMedia component="img" image={`/imagens/1/${a.imagemAcrescimo}`} sx={{ width: 40, height: 40, borderRadius: "50%" }} />
                      <Typography variant="body2">{a.nomeAcrescimo} - R$ {a.preco?.toFixed(2)}</Typography>
                      <FormControlLabel value={a.acrescimoId.toString()} control={<Radio />} />
                    </Box>
                  ))}
                </RadioGroup>
              ) : (
                acrescimos.map((a) => (
                  <Box key={a.acrescimoId} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <CardMedia component="img" image={`/imagens/1/${a.imagemAcrescimo}`} sx={{ width: 40, height: 40, borderRadius: "50%" }} />
                    <Typography variant="body2">{a.nomeAcrescimo} - R$ {a.preco?.toFixed(2)}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, border: 1, borderRadius: 5, borderColor: "lightgrey", px: 1 }}>
                      <IconButton size="small" onClick={() => atualizarQuantidade(a.acrescimoId, -1, a.quantidadeMaximaAcrescimoIndividual)}>
                        <RemoveIcon fontSize="small" color="error" />
                      </IconButton>
                      <Typography>{quantidadesAcrescimos[a.acrescimoId] || 0}</Typography>
                      <IconButton size="small" onClick={() => atualizarQuantidade(a.acrescimoId, 1, a.quantidadeMaximaAcrescimoIndividual)}>
                        <AddIcon fontSize="small" color="success" />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          )}

          {/* Grupos de opções */}
          {gruposDeOpcao.map((grupo) => (
            <Box key={grupo.idGrupo} mb={2}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {grupo.nomeGrupo}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {grupo.quantidadeMaximaEscolha === 1 ? (
                <RadioGroup
                  value={Object.entries(opcoesSelecionadas[grupo.idGrupo] || {}).find(([_, v]) => v > 0)?.[0] || ""}
                  onChange={(e) => {
                    const idSelecionado = parseInt(e.target.value);
                    const novos = {};
                    grupo.opcoes.forEach((o) => {
                      novos[o.idOpcao] = o.idOpcao === idSelecionado ? 1 : 0;
                    });
                    setOpcoesSelecionadas((prev) => ({ ...prev, [grupo.idGrupo]: novos }));
                  }}
                >
                  <FormControlLabel value="" control={<Radio />} label="Nenhum" />
                  {grupo.opcoes.map((opcao) => (
                    <Box key={opcao.idOpcao} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <CardMedia component="img" image={`/imagens/1/${opcao.imagem}`} sx={{ width: 40, height: 40, borderRadius: "50%" }} />
                      <Typography variant="body2">{opcao.nomeOpcao} - R$ {opcao.preco?.toFixed(2)}</Typography>
                      <FormControlLabel value={opcao.idOpcao.toString()} control={<Radio />} />
                    </Box>
                  ))}
                </RadioGroup>
              ) : (
                grupo.opcoes.map((opcao) => (
                  <Box key={opcao.idOpcao} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <CardMedia component="img" image={`/imagens/1/${opcao.imagem}`} sx={{ width: 40, height: 40, borderRadius: "50%" }} />
                    <Typography variant="body2">{opcao.nomeOpcao} - R$ {opcao.preco?.toFixed(2)}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, border: 1, borderRadius: 5, borderColor: "lightgrey", px: 1 }}>
                      <IconButton size="small" onClick={() => atualizarOpcao(grupo.idGrupo, opcao.idOpcao, -1, grupo.quantidadeMaximaEscolha, 1)}>
                        <RemoveIcon fontSize="small" color="error" />
                      </IconButton>
                      <Typography>{opcoesSelecionadas[grupo.idGrupo]?.[opcao.idOpcao] || 0}</Typography>
                      <IconButton size="small" onClick={() => atualizarOpcao(grupo.idGrupo, opcao.idOpcao, 1, grupo.quantidadeMaximaEscolha, 1)}>
                        <AddIcon fontSize="small" color="success" />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          ))}

          {/* Observações */}
          <Box mb={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Observações
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <TextField
              multiline
              fullWidth
              rows={4}
              placeholder="Exemplo: sem batata, sem maionese..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </Box>
        </DialogContent>

        {/* Footer do modal */}
        <DialogActions sx={{ display: "grid", gridTemplateColumns: "30% 70%", gap: 1 }}>
          <BotaoMaisMenos value={totalPrice} setValue={setTotalPrice} />
          <Box
            onClick={handleAddToCart}
            onMouseOver={() => setHover(false)}
            onMouseOut={() => setHover(true)}
            sx={{
              height: "50px",
              backgroundColor: hover ? "rgb(238, 53, 53)" : "rgb(177, 38, 38)",
              borderRadius: "6px",
              fontSize: "14px",
              color: "#ffef93",
              cursor: "pointer",
              display: "grid",
              gridTemplateRows: "40% 55%",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <Typography>Adicionar ao Carrinho</Typography>
            <Typography>R$ {precoFinal.toFixed(2)}</Typography>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CardProdutos;
