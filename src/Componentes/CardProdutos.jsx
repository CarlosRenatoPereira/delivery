import BotaoMaisMenos from './BotaoMaisMenos.jsx'
import '../App.css';
import Teacher1 from "../imagens/cachoroQuente.jpg"
import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import BootstrapDialog from '@mui/material/Dialog';

function CardProdutos() {
   const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <React.Fragment>
        <div className="cardProduto" onClick={handleClickOpen}>
          <div className='containarDescricaoProduto'>
            <div className='nomeLanche'>Lanche nº 1</div>
              <div className='descricaoLanche'>1 salsicha, 1 ovo de codorna, batata palha, milho, uva passas</div>  
                <div className='preco'>R$ 14,00</div>            
          </div>
          <div className="imgDivProduto"><img src={Teacher1} className="imgProduto"></img></div>
        </div>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Lanche nº 1
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers style={{padding:"4px"}}>
            <Typography gutterBottom>
            <div className="imgDivProdutoSelecionado"><img src={Teacher1} className="imgProdutoSelecionado"></img></div>
            </Typography>
            <Typography gutterBottom>
            <div className='descricaoLanche'>1 salsicha, 1 ovo de codorna, batata palha, milho, uva passas, bacon, molhos especiais</div>
            <div className='adicionais'>
              <div className='adicionaisTitulo'>

              </div>
              <div className='adicionaisConteudo'>
                
              </div>
            </div>
            <div className='observacoes'>
              <div className='observacoesTitulo'>
                Observações
              </div>
              <div className='observacoesTextBox'>
                <textarea rows="5" placeholder='Exemplo: sem batata, sem maionese...'>
                </textarea>
              </div>
            </div>
            </Typography>
          </DialogContent>
          <DialogActions>
            <BotaoMaisMenos></BotaoMaisMenos>
            <div style={{width:"30%",height:"70px",backgroundColor:"rgb(238, 53, 53)",display:"grid",gridTemplateRows:"40% 55%",fontFamily:"Verdana",borderRadius:"6px",fontSize:"14px",color:"#ffef93"}}>
              <div style={{justifyContent:"center", alignItems:"center",  display: 'flex',fontWeight:"bold"}}><span>Adicionar</span></div>
              <div style={{justifyContent:"center", alignItems:"center",  display: 'flex',fontWeight:"bold"}}><span>R$ 14,00</span></div>
            </div>
          </DialogActions>
        </BootstrapDialog>
      </React.Fragment>
    );
  }

  export default CardProdutos;