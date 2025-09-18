// CardapioCentral.jsx
import React from 'react';
import { Box, Grid } from '@mui/material';
import CardProdutos from './CardProdutos.jsx';

const CardapioCentral = ({ produtos, idCliente }) => {
  return (
    <Box>
      <Grid container rowSpacing={0} columnSpacing={1}>
        {produtos.map((produto) => (
          <Grid item xs={12} md={6} key={produto.produtoId} sx={{ p:0,m:0 }}>
            <CardProdutos produto={produto} idCliente={idCliente} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardapioCentral;
