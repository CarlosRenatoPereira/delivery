import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Typography,
  IconButton, Box, Radio, RadioGroup, FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { CarrinhoContext } from '../contexts/CarrinhoProvider';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Teacher1 from "../imagens/cachoroQuente.jpg";
import BotaoMaisMenos from './BotaoMaisMenos.jsx';

function CardProdutos({ produto }) {
  const [open, setOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(1);
  const [hover, setHover] = useState(true);
  const [observacoes, setObservacoes] = useState('');
  const [acrescimos, setAcrescimos] = useState([]);
  const [quantidadesAcrescimos, setQuantidadesAcrescimos] = useState({});
  const [valorTotalAcrescimos, setValorTotalAcrescimos] = useState(0);
  const [gruposDeOpcao, setGruposDeOpcao] = useState([]);
  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState({});

  const quantidadeMaximaPorProduto = produto.quantidadeMaximaAcrescimoPorProduto;
  const navigate = useNavigate();
  const imagemSrc = produto.imagemProduto ? '/imagens/1/' + produto.imagemProduto : Teacher1;
  const precoProduto = produto.preco ?? 0;
  const precoFinal = (precoProduto + valorTotalAcrescimos) * totalPrice;

  const handleClickOpen = () => {
    setOpen(true);

    fetch(`https://localhost:7039/api/Acrescimo/${produto.produtoId}`)
      .then(res => res.json())
      .then(data => setAcrescimos(data))
      .catch(err => console.error('Erro ao buscar acréscimos:', err));
      console.log(acrescimos)
    fetch(`https://localhost:7039/api/GrupoDeOpcao/${produto.produtoId}/grupos-de-opcoes`)
      .then(res => res.json())
      .then(data => setGruposDeOpcao(data))
      .catch(err => console.error('Erro ao buscar grupos de opção:', err));
  };

  const handleClose = () => setOpen(false);

  const atualizarQuantidade = (id, delta, maxIndividual) => {
    setQuantidadesAcrescimos(prev => {
      const atual = prev[id] || 0;
      const totalAtual = Object.values(prev).reduce((s, q) => s + q, 0);
      const novoValor = Math.max(0, Math.min(atual + delta, maxIndividual ?? Infinity));

      if (quantidadeMaximaPorProduto && totalAtual + delta > quantidadeMaximaPorProduto) {
        return prev;
      }

      return { ...prev, [id]: novoValor };
    });
  };

  const atualizarOpcao = (grupoId, opcaoId, delta, maxGrupo, maxIndividual) => {
    setOpcoesSelecionadas(prev => {
      const grupo = prev[grupoId] || {};
      const atual = grupo[opcaoId] || 0;
      const totalGrupo = Object.values(grupo).reduce((s, q) => s + q, 0);

      const novoValor = Math.max(0, Math.min(atual + delta, maxIndividual ?? Infinity));

      if (maxGrupo && totalGrupo + delta > maxGrupo) {
        return prev;
      }

      return {
        ...prev,
        [grupoId]: { ...grupo, [opcaoId]: novoValor }
      };
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
      .filter(a => (quantidadesAcrescimos[a.acrescimoId] || 0) > 0)
      .map(a => ({
        ...a,
        quantidade: quantidadesAcrescimos[a.acrescimoId]
      }));

    const opcoesSelecionadasFormatadas = [];
    for (const grupo of gruposDeOpcao) {
      const selecionadas = opcoesSelecionadas[grupo.idGrupo] || {};
      for (const [id, qtd] of Object.entries(selecionadas)) {
        if (qtd > 0) {
          const opcao = grupo.opcoes.find(o => o.idOpcao === parseInt(id));
          if (opcao) {
            opcoesSelecionadasFormatadas.push({
              ...opcao,
              quantidade: qtd,
              idGrupo: grupo.idGrupo,
              nomeGrupo: grupo.nomeGrupo
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
      opcoes: opcoesSelecionadasFormatadas
    };

    navigate('/Carrinho', { state: { produto: produtoRecebido } });
  };

  return (
    <>
      <div className="cardProduto" onClick={handleClickOpen}>
        <div className="containarDescricaoProduto">
          <div className="nomeLanche">{produto.nomeProduto}</div>
          <div className="descricaoLanche">{produto.descricao}</div>
          <div className="preco">R$ {produto.preco?.toFixed(2)}</div>
        </div>
        <div className="imgDivProduto">
          <img src={imagemSrc} alt={produto.nome} className="imgProduto" />
        </div>
      </div>

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>
          {produto.nomeProduto}
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <div className="imgDivProdutoSelecionado">
            <img src={imagemSrc} className="imgProdutoSelecionado" />
          </div>

          <div className="descricaoLancheFoco">{produto.descricao}</div>

          {/* Acréscimos */}
          {acrescimos.length > 0 && (
            <div className="observacoes">
              <div className="observacoesTitulo">Acréscimos</div>
              {quantidadeMaximaPorProduto === 1 ? (
                <RadioGroup
                  value={
                    Object.entries(quantidadesAcrescimos).find(([_, v]) => v > 0)?.[0] || ''
                  }
                  onChange={(e) => {
                    const idSelecionado = parseInt(e.target.value);
                    const novos = {};
                    acrescimos.forEach((a) => {
                      novos[a.acrescimoId] = a.acrescimoId === idSelecionado ? 1 : 0;
                    });
                    setQuantidadesAcrescimos(novos);
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: "100%", mb: 1 }}>
                    <FormControlLabel
                      value=""
                      control={<Radio />}
                      label="Nenhum"
                      labelPlacement="start"
                      sx={{ mr: 0 }}
                    />
                  </Box>
                  {acrescimos.map((a) => (
                    <Box key={a.acrescimoId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <img src={`/imagens/1/${a.imagemAcrescimo}`} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                      <div style={{ fontSize: "13px" }}>{a.nomeAcrescimo} - R$ {a.preco?.toFixed(2)}</div>
                      <FormControlLabel
                        value={a.acrescimoId.toString()}
                        control={<Radio />}
                      />
                    </Box>
                  ))}
                </RadioGroup>
              ) : (
                acrescimos.map((a) => (
                  <Box key={a.acrescimoId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1 }}>
                    <img src={`/imagens/1/${a.imagemAcrescimo}`} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                    <div style={{ fontSize: "13px" }}>{a.nomeAcrescimo} - R$ {a.preco?.toFixed(2)}</div>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, border: 1, borderRadius: 5, borderColor: "lightgrey" }}>
                      <IconButton size="small" onClick={() => atualizarQuantidade(a.acrescimoId, -1, a.quantidadeMaximaAcrescimoIndividual)}>
                        <RemoveIcon fontSize="small" style={{ color: "red" }} />
                      </IconButton>
                      <Typography>{quantidadesAcrescimos[a.acrescimoId] || 0}</Typography>
                      <IconButton size="small" onClick={() => atualizarQuantidade(a.acrescimoId, 1, a.quantidadeMaximaAcrescimoIndividual)}>
                        <AddIcon fontSize="small" style={{ color: "darkgreen" }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              )}
            </div>
          )}

          {/* Grupos de Opções */}
          {gruposDeOpcao.map(grupo => (
            <div key={grupo.idGrupo} className="observacoes">
              <div className="observacoesTitulo">{grupo.nomeGrupo}</div>
              {grupo.quantidadeMaximaEscolha === 1 ? (
                <RadioGroup
                  value={
                    Object.entries(opcoesSelecionadas[grupo.idGrupo] || {}).find(([_, v]) => v > 0)?.[0] || ''
                  }
                  onChange={(e) => {
                    const idSelecionado = parseInt(e.target.value);
                    const novos = {};
                    grupo.opcoes.forEach((o) => {
                      novos[o.idOpcao] = o.idOpcao === idSelecionado ? 1 : 0;
                    });
                    setOpcoesSelecionadas(prev => ({ ...prev, [grupo.idGrupo]: novos }));
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: "100%", mb: 1 }}>
                    <FormControlLabel
                      value=""
                      control={<Radio />}
                      label="Nenhum"
                      labelPlacement="start"
                      sx={{ mr: 0 }}
                    />
                  </Box>
                  {grupo.opcoes.map((opcao) => (
                    <Box key={opcao.idOpcao} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <img src={`/imagens/1/${opcao.imagem}`} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                      <div style={{ fontSize: "13px" }}>{opcao.nomeOpcao} - R$ {opcao.preco?.toFixed(2)}</div>
                      <FormControlLabel value={opcao.idOpcao.toString()} control={<Radio />} />
                    </Box>
                  ))}
                </RadioGroup>
              ) : (
                grupo.opcoes.map((opcao) => (
                  <Box key={opcao.idOpcao} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1 }}>
                    <img src={`/imagens/1/${opcao.imagem}`} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                    <div style={{ fontSize: "13px" }}>{opcao.nomeOpcao} - R$ {opcao.preco?.toFixed(2)}</div>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, border: 1, borderRadius: 5, borderColor: "lightgrey" }}>
                      <IconButton size="small" onClick={() => atualizarOpcao(grupo.idGrupo, opcao.idOpcao, -1, grupo.quantidadeMaximaEscolha, 1)}>
                        <RemoveIcon fontSize="small" style={{ color: "red" }} />
                      </IconButton>
                      <Typography>{(opcoesSelecionadas[grupo.idGrupo]?.[opcao.idOpcao] || 0)}</Typography>
                      <IconButton size="small" onClick={() => atualizarOpcao(grupo.idGrupo, opcao.idOpcao, 1, grupo.quantidadeMaximaEscolha, 1)}>
                        <AddIcon fontSize="small" style={{ color: "darkgreen" }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              )}
            </div>
          ))}

          {/* Observações */}
          <div className="observacoes">
            <div className="observacoesTitulo">Observações</div>
            <div className="observacoesTextBox">
              <textarea
                rows="5"
                placeholder="Exemplo: sem batata, sem maionese..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ display: "grid", gridTemplateColumns: "30% 70%" }}>
          <BotaoMaisMenos value={totalPrice} setValue={setTotalPrice} />
          <Box
            onClick={handleAddToCart}
            onMouseOver={() => setHover(false)}
            onMouseOut={() => setHover(true)}
            sx={{
              height: "50px",
              backgroundColor: hover ? 'rgb(238, 53, 53)' : 'rgb(177, 38, 38)',
              borderRadius: "6px",
              fontSize: "14px",
              color: "#ffef93",
              m: 1,
              cursor: 'pointer',
              display: 'grid',
              gridTemplateRows: "40% 55%",
              fontWeight: "bold"
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              Adicionar ao Carrinho
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              R$ {precoFinal.toFixed(2)}
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CardProdutos;
