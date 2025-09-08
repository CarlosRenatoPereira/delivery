import React, { useContext } from "react";
import { Card as MUICard, Box } from "@mui/material";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

function Card({ onClick, title, itemId, selected }) {
  const context = useContext(VisibilityContext);

const handleClick = () => {
  onClick(itemId);

  // Verifica se o item está registrado no contexto antes de tentar rolar
  if (context.getItemById(itemId)) {
    context.scrollToItem(itemId, "smooth", "center", "center");
  } else {
    console.warn(`Item com ID ${itemId} não encontrado no contexto`);
  }
};

  return (
    <Box
      itemId={itemId} // <- ESSENCIAL para ScrollMenu
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        minWidth: 120,
        marginLeft: "10px",
        mb: 2,
        mt: 1,
      }}
    >
      <MUICard
        elevation={selected ? 6 : 2}
        sx={{
          height: 30,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: selected ? "2px inset black" : "none",
          transition: "0.2s",
          "&:hover": { transform: "scale(1.05)" },
          px: 1,
          fontSize: "10px",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </MUICard>
    </Box>
  );
}

export default Card;
