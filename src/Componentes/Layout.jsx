import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import ResponsiveMenu from "./ResponsiveMenu";

function Layout() {
  return (
    <>
      <ResponsiveMenu />
      <Box sx={{ ml: { md: "250px" }, p: 2 }}>
        {/* Outlet renderiza o conteúdo da rota filha */}
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;
