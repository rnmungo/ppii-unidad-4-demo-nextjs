import { Roboto } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme.js";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata = {
  title: "Lista de tareas",
  description: "Ejemplo CRUD con Next.js, Material UI y PostgreSQL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={roboto.variable}>
      <body>
        {/* AppRouterCacheProvider inyecta los estilos de MUI (Emotion) en el HTML del servidor. */}
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
