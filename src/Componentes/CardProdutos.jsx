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
import Teacher1 from "../imagens/generica.png";
import { Checkbox } from "@mui/material";

function CardProdutos({ produto, idCliente}) {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  const [open, setOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(1);
  const [hover, setHover] = useState(true);
  const [observacoes, setObservacoes] = useState("");
  const [acrescimos, setAcrescimos] = useState([]);
  const [quantidadesAcrescimos, setQuantidadesAcrescimos] = useState({});
  const [valorTotalAcrescimos, setValorTotalAcrescimos] = useState(0);
  const [gruposDeOpcao, setGruposDeOpcao] = useState([]);
  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState({});
  const [valorTotalOpcoes, setValorTotalOpcoes] = useState(0);

  const quantidadeMaximaPorProduto = produto.quantidadeMaximaAcrescimoPorProduto;
  const navigate = useNavigate();
  const imagemSrc = produto.imagem ? baseUrl + idCliente + "/" + produto.nomeCategoria + "/imagem/" + produto.imagem : Teacher1;
  //const imagemSrcItemOpcao= opcao.imagem ? baseUrl + idCliente + "/" + produto.nomeCategoria + "/imagem/" + produto.imagem : Teacher1;
  const precoProduto = (produto.aPartirDe == 1) 
    ? 0 
    : (produto.preco ?? 0);
  const precoFinal = (precoProduto + valorTotalAcrescimos + valorTotalOpcoes) * totalPrice;
  const precoFinalProduto = (precoProduto + valorTotalAcrescimos + valorTotalOpcoes)

 useEffect(() => {
  let totalOpcoes = 0;

  (gruposDeOpcao || []).forEach((grupo) => {
    const selecionadas = opcoesSelecionadas[grupo.id] || {};
    const opcoesEscolhidas = (grupo.opcao || []).filter(
      (o) => selecionadas[o.idOpcao] > 0
    );

    if (opcoesEscolhidas.length === 0) return;

    switch (grupo.descricaoTipoDeCobranca) {
      case "Sem preço (cobrar somente o valor do produto)":
        // não altera o preço
        break;

      case "Somar o valor da(s) opção(s) com o valor do produto":
        totalOpcoes += opcoesEscolhidas.reduce(
          (sum, o) => sum + o.preco * selecionadas[o.idOpcao],
          0
        );
        break;

      case "É o valor do produto e calcular a média das opções escolhidas":
        const soma = opcoesEscolhidas.reduce((sum, o) => sum + o.preco, 0);
        totalOpcoes += soma / opcoesEscolhidas.length;
        break;

      case "É o valor do produto e cobrar o maior valor das opções escolhidas":
        const maior = Math.max(...opcoesEscolhidas.map((o) => o.preco));
        totalOpcoes += maior;
        break;

      default:
        break;
    }
  });

  setValorTotalOpcoes(totalOpcoes);
}, [opcoesSelecionadas, gruposDeOpcao]);


const handleClickOpen = async () => {
  setOpen(true);

  try {
    // 🔹 Buscar acréscimos
    const responseAcrescimos = await fetch(`https://localhost:7039/api/Acrescimo/${produto.produtoId}`);

    if (!responseAcrescimos.ok) {
      if (responseAcrescimos.status === 404) {
        console.warn("Nenhum acréscimo encontrado para este produto.");
        setAcrescimos([]);
      } else {
        throw new Error(`Erro na requisição de acréscimos: ${responseAcrescimos.status}`);
      }
    } else {
      const dataAcrescimos = await responseAcrescimos.json();
      setAcrescimos(dataAcrescimos);
    }
    // 🔹 Buscar grupos de opção
    const responseGrupos = await fetch(
      `https://localhost:7039/api/GrupoDeOpcao/${produto.produtoId}/grupos-de-opcoes`
    );

    if (!responseGrupos.ok) {
      if (responseGrupos.status === 404) {
        console.warn("Nenhum grupo de opção encontrado para este produto.");
        setGruposDeOpcao([]);
      } else {
        throw new Error(`Erro na requisição de grupos de opção: ${responseGrupos.status}`);
      }
    } else {
      const dataGrupos = await responseGrupos.json();
      setGruposDeOpcao(dataGrupos);
    }

  } catch (error) {
    console.error("Erro ao buscar dados do produto:", error);
    setAcrescimos([]);
    setGruposDeOpcao([]);
  }
};


  const handleClose = () => setOpen(false);

  const atualizarQuantidade = (id, delta, maxIndividual) => {
  setQuantidadesAcrescimos((prev) => {
    const atual = prev[id] || 0;
    const totalAtual = Object.values(prev).reduce((s, q) => s + q, 0);

    const limiteProduto = quantidadeMaximaPorProduto ?? Infinity;
    const limiteIndividual = maxIndividual ?? Infinity;

    // verifica se já atingiu limite do produto
    if (totalAtual + delta > limiteProduto) return prev;

    const novoValor = Math.max(0, Math.min(atual + delta, limiteIndividual));
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
    if (acrescimos.length > 0){
    const total = acrescimos.reduce((sum, a) => {
      const qtd = quantidadesAcrescimos[a.acrescimoId] || 0;
      return sum + qtd * (a.preco || 0);
    }, 0);
    setValorTotalAcrescimos(total);
    } 
  }, [quantidadesAcrescimos, acrescimos]);

  const handleAddToCart = () => {
    const acrescimosSelecionados = acrescimos
      .filter((a) => (quantidadesAcrescimos[a.acrescimoId] || 0) > 0)
      .map((a) => ({ ...a, quantidade: quantidadesAcrescimos[a.acrescimoId] }));

    const opcoesSelecionadasFormatadas = [];
    for (const grupo of gruposDeOpcao) {
      const selecionadas = opcoesSelecionadas[grupo.id] || {};
      for (const [id, qtd] of Object.entries(selecionadas)) {
        if (qtd > 0) {
          const opcao = grupo.opcao.find((o) => o.idOpcao === parseInt(id));
          if (opcao) {
           opcoesSelecionadasFormatadas.push({
            ...opcao,
            quantidade: qtd,
            idGrupo: grupo.id,
            nomeGrupo: grupo.nome,
            descricaoTipoDeCobranca: grupo.descricaoTipoDeCobranca
            });
          }
        }
      }
    }

    const produtoRecebido = {
      idCliente: idCliente,
      nomeCategoria: produto.nomeCategoria,
      idProduto: produto.produtoId,
      nomeProduto: produto.nome,
      preco: precoFinalProduto,
      imagemProduto: produto.imagem,
      quantity: totalPrice,
      observacoes: observacoes,
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
        {produto.aPartirDe === 1 && "A partir de "}
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
      <Dialog onClose={handleClose} open={open} fullWidth fullScreen
        maxWidth="lg"
        PaperProps={{
          sx: {
            width: { xs: "100%", md: "60%" }, // 100% no mobile, 90% no desktop
            margin: "auto",
            borderRadius: 2
          }
        }}>
        <DialogTitle sx={{fontFamily:'Inter',fontWeight:'900' }}>
          {produto.nome}
          <IconButton onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8}}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers   sx={{
          p: 0,   // padding geral
          "& .MuiDialogContent-root": { padding: 0 } // força reset
        }}>
          <Box mb={2} display="flex" flexDirection="column" alignItems="center" p={1}>
            <Box mb={2}>
              <CardMedia
                component="img"
                image={imagemSrc}
                alt={produto.nomeProduto}
                sx={{
                  borderRadius: 2,
                  minHeight: 250,
                  maxWidth: "25.5rem",
                  objectFit: "fill",
                  display: "block",       // garante que se comporte como bloco
                  margin: "0 auto",       // centraliza horizontalmente
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {produto.descricao}
            </Typography>
          </Box>
          
         {acrescimos.length > 0 && (
          <Box mb={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom bgcolor={"#ebebeb"} px={1.5} py={1}>
              <div>Acréscimos </div>
               {quantidadeMaximaPorProduto && (
                <Typography fontSize={11}>Escolha até {quantidadeMaximaPorProduto} item(s)</Typography>
            )}
            </Typography>
            <Box p={1}>
            {quantidadeMaximaPorProduto === 1 ? (
              // ✅ Caso 1: só pode escolher um → RadioGroup
              <RadioGroup
                value={Object.entries(quantidadesAcrescimos).find(([_, v]) => v > 0)?.[0] || ""}
                onClick={(e) => {
                  const idSelecionado = parseInt(e.target.value);
                  const idAtual = Object.entries(quantidadesAcrescimos).find(([_, v]) => v > 0)?.[0];

                  const novos = {};
                  acrescimos.forEach((a) => {
                    // Se clicar de novo no selecionado, zera todos
                    if (idAtual === a.acrescimoId.toString() && a.acrescimoId === idSelecionado) {
                      novos[a.acrescimoId] = 0;
                    } else {
                      novos[a.acrescimoId] = a.acrescimoId === idSelecionado ? 1 : 0;
                    }
                  });

                  setQuantidadesAcrescimos(novos);
                }}
              >
                {acrescimos.map((a) => (
                  <Box mb={1}>
                    <Box
                      key={a.acrescimoId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      {/* Imagem + Nome/Preço juntos */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CardMedia
                          component="img"
                          image={
                            a.imagemAcrescimo
                              ? baseUrl +
                                idCliente +
                                "/" +
                                produto.nomeCategoria +
                                "/imagem/" +
                                a.imagemAcrescimo
                              : Teacher1
                          }
                          sx={{ width: 50, height: 50, borderRadius: "50%" }}
                        />
                        <Box display="flex" flexDirection="column">
                          <Typography variant="body2" fontWeight='bold' mb={0.5} fontSize={15}>{a.nomeAcrescimo} 
                           {a.descricao && (
                          <Typography fontSize={12}  align="justify">{a.descricao}</Typography>
                          )}
                          </Typography>
                          <Typography variant="body2" fontWeight='bold' mb={0.5} fontSize={15}>R$ {a.preco?.toFixed(2)}</Typography>
                          {a.quantidadeMaximaIndividual && (
                          <Typography fontSize={11}>Max {a.quantidadeMaximaIndividual} item(s)</Typography>
                          )}
                        </Box>
                      </Box>
                      {/* Radio sempre alinhado à direita */}
                      <FormControlLabel
                        labelPlacement="start"
                        value={a.acrescimoId.toString()}
                        control={<Radio />}
                        label=""
                      />
                    </Box>
                    <Divider/>
                  </Box>
                ))}
              </RadioGroup>

            ) : (
              // ✅ Caso 2: pode escolher vários
              acrescimos.map((a) => {
                const qtd = quantidadesAcrescimos[a.acrescimoId] || 0;
                const limiteIndividual = a.quantidadeMaximaIndividual ?? Infinity;

                if (limiteIndividual === 1) {
                  // checkbox
                  return (
                  <Box mb={1}>
                    <Box
                      key={a.acrescimoId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      {/* Imagem + Nome/Preço juntos */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CardMedia
                          component="img"
                          image={
                            a.imagemAcrescimo
                              ? baseUrl +
                                idCliente +
                                "/" +
                                produto.nomeCategoria +
                                "/imagem/" +
                                a.imagemAcrescimo
                              : Teacher1
                          }
                          sx={{ width: 50, height: 50, borderRadius: "50%" }}
                        />
                        <Box display="flex" flexDirection="column">
                          <Typography variant="body2" fontWeight='bold' mb={0.5} fontSize={15}>{a.nomeAcrescimo} 
                           {a.descricao && (
                          <Typography fontSize={12}  align="justify">{a.descricao}</Typography>
                          )}
                          </Typography>
                          <Typography variant="body2" fontWeight='bold' mb={0.5} fontSize={15}>R$ {a.preco?.toFixed(2)}</Typography>
                          {a.quantidadeMaximaIndividual && (
                          <Typography fontSize={11}>Max {a.quantidadeMaximaIndividual} item(s)</Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Checkbox no canto direito */}
                      <FormControlLabel
                        labelPlacement="start"
                        control={
                          <Checkbox
                            checked={qtd > 0}
                            onChange={(e) => {
                              const delta = e.target.checked ? 1 : -1;
                              atualizarQuantidade(
                                a.acrescimoId,
                                delta,
                                a.quantidadeMaximaIndividual
                              );
                            }}
                            size="medium"
                            sx={{
                              m: 0,
                              "& .MuiSvgIcon-root": { fontSize: 25 }, // aumenta a caixa
                            }}
                          />
                        }
                        label=""
                      />
                    </Box>
                    <Divider mb={0.5}/>
                  </Box>
                  );
                }

                  // mais/menos
                  return (
                  <Box mb={1}>
                    <Box
                    key={a.acrescimoId}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    {/* Imagem + Nome/Preço juntos */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CardMedia
                        component="img"
                        image={
                          a.imagemAcrescimo
                            ? baseUrl +
                              idCliente +
                              "/" +
                              produto.nomeCategoria +
                              "/imagem/" +
                              a.imagemAcrescimo
                            : Teacher1
                        }
                        sx={{ width: 50, height: 50, borderRadius: "50%" }}
                      />
                      <Box display="flex" flexDirection="column">
                          <Typography variant="body2" fontWeight='bold' mb={0.5} fontSize={15}>{a.nomeAcrescimo} 
                           {a.descricao && (
                          <Typography fontSize={12}  align="justify">{a.descricao}</Typography>
                          )}
                          </Typography>
                          <Typography variant="body2" fontWeight='bold' mb={0.5} fontSize={15}>R$ {a.preco?.toFixed(2)}</Typography>
                          {a.quantidadeMaximaIndividual && (
                          <Typography fontSize={11}>Max {a.quantidadeMaximaIndividual} item(s)</Typography>
                          )}
                        </Box>
                    </Box>

                    {/* Quantidade no canto direito */}
                    <Box
                      labelPlacement="start"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: 1,
                        borderRadius: 5,
                        borderColor: "lightgrey",
                        px: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                         atualizarQuantidade(
                            a.acrescimoId,
                            -1,
                            a.quantidadeMaximaIndividual
                        )
                        }
                      >
                        <RemoveIcon fontSize="small" color="error" />
                      </IconButton>
                      <Typography>{qtd}</Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                           atualizarQuantidade(
                              a.acrescimoId,
                              +1,
                              a.quantidadeMaximaIndividual
                          )
                        }
                      >
                        <AddIcon fontSize="small" color="success" />
                      </IconButton>
                    </Box>
                  </Box>
                   <Divider/>
                  </Box>
                  );
                })
              )}
            </Box>
          </Box>
          )}


          {/* Grupos de opções */}
          {gruposDeOpcao.map((grupo) => (
            <Box key={grupo.id} sx={{ mb: 2 }}>
              {grupo.mostrarNome === 1 ? (
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom bgcolor={"#ebebeb"} px={1.5} py={1}>
                  {grupo.nome}
                  {grupo.quantidadeEscolhaPorProduto && (
                <Typography fontSize={11}>Escolha até {grupo.quantidadeEscolhaPorProduto} item(s)</Typography>
            )}
                </Typography>
              ) : (
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom bgcolor={"#ebebeb"} px={1.5} py={1}> 
                  Opções
                   {grupo.quantidadeEscolhaPorProduto && (
                <Typography fontSize={11}>Escolha até {grupo.quantidadeEscolhaPorProduto} item(s)</Typography>
            )}
                </Typography>
              )}

              {/* Caso 1: RadioGroup (só pode 1 no grupo) */}
              {grupo.quantidadeEscolhaPorProduto === 1 ? (
                <RadioGroup
                  value={Object.entries(opcoesSelecionadas[grupo.id] || {}).find(([_, v]) => v > 0)?.[0] || ""}
                  onClick={(e) => {
                    const idSelecionado = parseInt(e.target.value);
                    const selecionadoAtual = Object.entries(opcoesSelecionadas[grupo.id] || {}).find(([_, v]) => v > 0)?.[0];

                    // Se clicou no mesmo já selecionado -> limpa (desmarca)
                    if (selecionadoAtual && parseInt(selecionadoAtual) === idSelecionado) {
                      setOpcoesSelecionadas((prev) => ({ ...prev, [grupo.id]: {} }));
                      return;
                    }

                    // Caso normal -> marca o novo
                    const novos = {};
                    grupo.opcao.forEach((o) => {
                      novos[o.idOpcao] = o.idOpcao === idSelecionado ? 1 : 0;
                    });
                    setOpcoesSelecionadas((prev) => ({ ...prev, [grupo.id]: novos }));
                  }}
                >
                  {grupo.opcao?.map((opcao) => (
                    <Box mb={1}>
                    <Box mr={1} e ml={1}
                      key={opcao.idOpcao}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      {/* Imagem + Nome/Preço juntos */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CardMedia
                          component="img"
                          image={
                            opcao.imagem
                              ? baseUrl +
                                idCliente +
                                "/" +
                                produto.nomeCategoria +
                                "/imagem/" +
                                opcao.imagem
                              : Teacher1
                          }
                          sx={{ width: 50, height: 50, borderRadius: "50%" }}
                        />
                        <Box display="flex" flexDirection="column">
                          <Typography variant="body2" fontWeight='bold' mb={0.5} fontSize={15}>{opcao.nomeOpcao} 
                           {opcao.descricao && (
                          <Typography fontSize={12} mt={0.5} e mb={0.5} align="justify">{opcao.descricao}</Typography>
                          )}
                          </Typography>
                          <Typography variant="body2" fontWeight='bold' mb={0.5} fontSize={15}>R$ {opcao.preco?.toFixed(2)}</Typography>
                        </Box>
                      </Box>
                      {/* Radio sempre alinhado à direita */}
                      <FormControlLabel
                        labelPlacement="start"
                        value={opcao.idOpcao.toString()}
                        control={<Radio />}
                        label=""
                      />
                    </Box>
                    <Divider/>
                  </Box>
                ))}
              </RadioGroup>
              ) : (
                /* Caso 2 e 3: Checkbox ou Mais/Menos */
                grupo.opcao?.map((opcao) => {
                  const qtd = opcoesSelecionadas[grupo.id]?.[opcao.idOpcao] || 0;

                  // Caso 2: Checkbox (maxIndividual = 1)
                  if (opcao.quantidadeMaximaIndividual === 1) {
                    return (
                    <Box mb={1} mr={1}>
                      <Box
                        key={opcao.idOpcao}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                      {/* Imagem + Nome/Preço juntos */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1,ml:0.5 }}>
                        <CardMedia
                          component="img"
                          image={
                            opcao.imargem
                              ? baseUl +
                                idCliente +
                                "/" +
                                produto.nomeCategoria +
                                "/imagem/" +
                                opcao.imargem
                              : Teacher1
                          }
                          sx={{ width: 50, height: 50, borderRadius: "50%" }}
                        />
                        <Box display="flex" flexDirection="column">
                          <Typography variant="body2" fontWeight='bold' fontSize={15} mb={0.5}>{opcao.nomeOpcao} 
                           {opcao.descricao && (
                          <Typography fontSize={12} mt={0.5} e mb={0.5} align="justify">{opcao.descricao}</Typography>
                          )}
                          </Typography>
                          <Typography variant="body2" fontWeight='bold' mb={0.5} fontSize={15}>R$ {opcao.preco?.toFixed(2)}</Typography>
                        </Box>
                      </Box>

                      {/* Checkbox no canto direito */}
                      <FormControlLabel
                        labelPlacement="start"
                        control={
                          <Checkbox
                            checked={qtd > 0}
                            onChange={(e) => {
                              const delta = e.target.checked ? 1 : -1;
                               atualizarOpcao(
                                  grupo.id,
                                  opcao.idOpcao,
                                  delta,
                                  grupo.quantidadeEscolhaPorProduto,
                                  opcao.quantidadeMaximaIndividual
                                );
                            }}
                            size="medium"
                            sx={{
                              m: 0,
                              "& .MuiSvgIcon-root": { fontSize: 25 }, // aumenta a caixa
                            }}
                          />
                        }
                        label=""
                      />
                    </Box>
                    <Divider mb={0.5}/>
                  </Box>
                    );
                  }

                  // Caso 3: Mais/Menos (maxIndividual > 1)
                  return (
                  <Box mb={1} mr={1}>
                    <Box
                    key={opcao.idOpcao
                    }
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    {/* Imagem + Nome/Preço juntos */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CardMedia
                        component="img"
                        image={
                          opcao.imagem
                            ? baseUrl +
                              idCliente +
                              "/" +
                              produto.nomeCategoria +
                              "/imagem/" +
                              opcao.imagem
                            : Teacher1
                        }
                        sx={{ width: 50, height: 50, borderRadius: "50%" }}
                      />
                      <Box display="flex" flexDirection="column">
                          <Typography variant="body2" fontWeight='bold' mb={0.5} fontSize={15}>{opcao.nomeOpcao} 
                           {opcao.descricao && (
                          <Typography fontSize={12}  align="justify">{opcao.descricao}</Typography>
                          )}
                          </Typography>
                          <Typography variant="body2" fontWeight='bold' mb={0.5} fontSize={15}>R$ {opcao.preco?.toFixed(2)}</Typography>
                          {opcao.quantidadeMaximaIndividual && (
                          <Typography fontSize={11}>Max {opcao.quantidadeMaximaIndividual} item(s)</Typography>
                          )}
                        </Box>
                    </Box>

                    {/* Quantidade no canto direito */}
                    <Box
                      labelPlacement="start"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: 1,
                        borderRadius: 5,
                        borderColor: "lightgrey",
                        px: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          atualizarOpcao(
                              grupo.id,
                              opcao.idOpcao,
                              -1,
                              grupo.quantidadeEscolhaPorProduto,
                              opcao.quantidadeMaximaIndividual
                         )
                        }
                      >
                        <RemoveIcon fontSize="small" color="error" />
                      </IconButton>
                      <Typography>{qtd}</Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          atualizarOpcao(
                            grupo.id,
                            opcao.idOpcao,
                            +1,
                            grupo.quantidadeEscolhaPorProduto,
                            opcao.quantidadeMaximaIndividual
                         )
                        }
                      >
                        <AddIcon fontSize="small" color="success" />
                      </IconButton>
                    </Box>
                  </Box>
                   <Divider/>
                  </Box>
                  );
                })
              )}
            </Box>
          ))}

          {/* Observações */}
          <Box mb={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom px={1.5} py={1} bgcolor={"#ebebeb"} >
              Observações
            </Typography>
            <Box px={1}>
            <TextField
              multiline
              fullWidth
              rows={4}
              placeholder="Exemplo: sem batata, sem maionese..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </Box>
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
