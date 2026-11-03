import "server-only";
import pg from "pg";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const { Pool } = pg;

// Durante `next build` (por ejemplo, dentro del Dockerfile) la variable no existe:
// Render la inyecta recién al ejecutar el contenedor. El Pool no se conecta hasta
// la primera consulta, así que solo se exige DATABASE_URL en tiempo de ejecución.
if (!process.env.DATABASE_URL && process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
  throw new Error("Falta configurar DATABASE_URL");
}

const globalForPg = globalThis;
const pool = globalForPg.pgPool ??
  new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}

export default pool;
