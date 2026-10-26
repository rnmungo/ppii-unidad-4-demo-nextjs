"use client";

// El tema se crea en un Client Component: contiene funciones que no pueden
// serializarse desde el servidor hacia el navegador.
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1e3a5f" },
    secondary: { main: "#2e7d32" },
    background: { default: "#f4f6f9" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "var(--font-roboto), Roboto, Arial, sans-serif",
  },
});

export default theme;
