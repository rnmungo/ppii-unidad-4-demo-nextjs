"use client";

// Client Component: necesita estado local (useState) para abrir y cerrar
// el diálogo de confirmación. La eliminación sigue ocurriendo en el servidor
// mediante la Server Action deleteTaskAction.
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { deleteTaskAction } from "../app/actions.js";
import SubmitButton from "./SubmitButton.js";

export default function DeleteTaskButton({ id, title }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Eliminar">
        <IconButton aria-label="Eliminar tarea" color="error" onClick={() => setOpen(true)}>
          <DeleteOutlineIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <form action={deleteTaskAction}>
          <input type="hidden" name="id" value={id} />
          <DialogTitle>¿Eliminar la tarea?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Se eliminará «{title}» de la base de datos. Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <SubmitButton color="error" variant="contained">
              Eliminar
            </SubmitButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
