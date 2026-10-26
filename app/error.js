"use client";

// Los errores lanzados en las Server Actions (por ejemplo, validación)
// llegan a este límite de error, que debe ser un Client Component.
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";

export default function Error({ error, reset }) {
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => reset()}>
            Reintentar
          </Button>
        }
      >
        <AlertTitle>Ocurrió un error</AlertTitle>
        {/* En producción Next.js oculta el mensaje real para no exponer detalles internos. */}
        {error.message}
      </Alert>
    </Container>
  );
}
