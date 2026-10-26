import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { getTasks } from "../lib/tasks.js";
import {
  createTaskAction,
  updateTaskAction,
  toggleTaskAction,
} from "./actions.js";
import SubmitButton from "../components/SubmitButton.js";
import DeleteTaskButton from "../components/DeleteTaskButton.js";

// La página consulta la base en cada petición: no se genera como HTML estático
// durante `next build` (cuando la base podría no estar disponible).
export const dynamic = "force-dynamic";

function formatDate(date) {
  return new Date(date).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

export default async function HomePage() {
  const tasks = await getTasks();
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <ChecklistIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" component="h1">
            Lista de tareas
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Las tareas se almacenan en PostgreSQL.
        </Typography>

        {/* CREATE: formulario que invoca una Server Action */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box
            component="form"
            action={createTaskAction}
            sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
          >
            <TextField
              id="new-title"
              name="title"
              label="Nueva tarea"
              required
              fullWidth
              size="small"
              slotProps={{ htmlInput: { maxLength: 200 } }}
            />
            <SubmitButton variant="contained" startIcon={<AddIcon />} sx={{ flexShrink: 0 }}>
              Agregar
            </SubmitButton>
          </Box>
        </Paper>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label={`Total: ${tasks.length}`} />
          <Chip label={`Pendientes: ${tasks.length - completedCount}`} color="warning" variant="outlined" />
          <Chip label={`Completadas: ${completedCount}`} color="success" variant="outlined" />
        </Stack>

        {/* READ: los datos llegan ya resueltos desde el servidor */}
        {tasks.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Todavía no hay tareas.</Typography>
          </Paper>
        ) : (
          <Stack component="ul" spacing={1.5} sx={{ listStyle: "none", p: 0, m: 0 }}>
            {tasks.map((task) => (
              <Paper
                component="li"
                key={task.id}
                variant="outlined"
                sx={{ p: 2, bgcolor: task.completed ? "action.hover" : "background.paper" }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  {/* UPDATE rápido: cambia solo el estado */}
                  <form action={toggleTaskAction}>
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="title" value={task.title} />
                    <input type="hidden" name="completed" value={String(!task.completed)} />
                    <IconButton
                      type="submit"
                      color={task.completed ? "success" : "default"}
                      title={task.completed ? "Marcar pendiente" : "Marcar completada"}
                      aria-label={task.completed ? "Marcar pendiente" : "Marcar completada"}
                    >
                      {task.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                    </IconButton>
                  </form>

                  {/* UPDATE completo: título y estado.
                      defaultValue/defaultChecked solo se aplican al montar el campo;
                      la key cambia cuando cambian los datos y fuerza a re-montarlo. */}
                  <Box
                    key={`${task.title}-${task.completed}`}
                    component="form"
                    action={updateTaskAction}
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <input type="hidden" name="id" value={task.id} />
                    <TextField
                      name="title"
                      label="Tarea"
                      defaultValue={task.title}
                      required
                      fullWidth
                      size="small"
                      slotProps={{ htmlInput: { maxLength: 200 } }}
                      sx={{
                        "& input": {
                          textDecoration: task.completed ? "line-through" : "none",
                        },
                      }}
                    />
                    {/* Se usa un <label> nativo: FormControlLabel clona su "control"
                        y eso no funciona con elementos creados en un Server Component. */}
                    <Box
                      component="label"
                      sx={{ display: "flex", alignItems: "center", flexShrink: 0, cursor: "pointer" }}
                    >
                      <Checkbox name="completed" defaultChecked={task.completed} />
                      <Typography component="span">Completada</Typography>
                    </Box>
                    <SubmitButton variant="outlined" size="small" startIcon={<SaveIcon />} sx={{ flexShrink: 0 }}>
                      Guardar
                    </SubmitButton>
                  </Box>

                  {/* DELETE: Client Component con confirmación */}
                  <DeleteTaskButton id={String(task.id)} title={task.title} />
                </Stack>

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, ml: 6 }}>
                  #{task.id} · creada el {formatDate(task.created_at)}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Container>
    </>
  );
}
