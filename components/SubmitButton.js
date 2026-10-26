"use client";

// Client Component: useFormStatus solo funciona en el navegador y
// permite saber si el formulario que lo contiene se está enviando.
import { useFormStatus } from "react-dom";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export default function SubmitButton({ children, startIcon, ...props }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      startIcon={pending ? <CircularProgress size={18} color="inherit" /> : startIcon}
      {...props}
    >
      {children}
    </Button>
  );
}
