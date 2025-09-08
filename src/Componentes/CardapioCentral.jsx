import React, { useRef, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import CardProdutos from './CardProdutos.jsx';

const CardapioCentral = ({ produtos }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0; // reset scroll ao mudar produtos
    }
  }, [produtos]);

  return (
    <Box
      sx={{
        minHeight:"100%",
        border: "1px solid #ccc",
        bgcolor: "rgba(235, 231, 231, 0.911)",
        px: 1,
        flex: 1,
        overflowY: "auto",
        pb: "60px", 
      }}
    >
      <Grid container rowSpacing={0} columnSpacing={1}>
        {produtos.map((produto) => (
          <Grid item xs={12} md={6} key={produto.produtoId} sx={{ pb: 0,pt:0 }} disableEqualOverflow>
            <CardProdutos produto={produto} />
            <CardProdutos produto={produto} />
            <CardProdutos produto={produto} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardapioCentral;
