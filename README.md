# TODO List · Next.js + Material UI + PostgreSQL

Ejemplo didáctico basado en `docs/Material_Complementario_NextJS_PostgreSQL_TODO_List.pdf`.
Sigue la misma arquitectura del material (App Router, Server Components, Server Actions,
SQL parametrizado con `pg`), pero la interfaz usa **Material UI** y la base de datos
corre en **Docker**.

## Requisitos

- [Node.js](https://nodejs.org/) 20.9 o superior
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (con Docker Compose)

## Puesta en marcha (en cualquier computadora)

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de entorno (los valores ya coinciden con docker-compose.yml)
cp .env.example .env.local        # en PowerShell: Copy-Item .env.example .env.local

# 3. Levantar PostgreSQL en Docker (crea la tabla y 2 tareas de ejemplo)
npm run db:up

# 4. Iniciar Next.js en modo desarrollo
npm run dev
```

Abrir http://localhost:3000 (si el puerto está ocupado, Next.js muestra en la terminal cuál usa).

## Scripts útiles

| Script             | Qué hace                                                        |
| ------------------ | --------------------------------------------------------------- |
| `npm run dev`      | Servidor de desarrollo de Next.js.                              |
| `npm run db:up`    | Levanta el contenedor de PostgreSQL.                            |
| `npm run db:down`  | Detiene el contenedor (los datos se conservan en el volumen).   |
| `npm run db:reset` | Borra el volumen y recrea la base desde `db/init/01-schema.sql`. |
| `npm run db:psql`  | Abre una consola `psql` dentro del contenedor.                  |

Para comprobar en clase que una mutación llegó a la base:

```bash
npm run db:psql
todo_app=# SELECT * FROM tasks;
```

## Estructura

```
app/
├── actions.js       Server Actions: validan y llaman a la capa de datos ("use server")
├── error.js         Límite de error (Client Component) que muestra errores de validación
├── layout.js        Layout raíz: HTML, tema de MUI y AppRouterCacheProvider
├── page.js          Página principal (Server Component): lee tareas y arma los formularios
└── theme.js         Tema de Material UI (Client Component)
components/
├── DeleteTaskButton.js  Client Component: diálogo de confirmación (useState)
└── SubmitButton.js      Client Component: estado "enviando" con useFormStatus
lib/
├── db.js            Pool de conexiones PostgreSQL (server-only)
└── tasks.js         Consultas SQL parametrizadas (CRUD)
db/init/
└── 01-schema.sql    Tabla tasks + datos de ejemplo (se ejecuta al crear el contenedor)
docker-compose.yml   Servicio PostgreSQL 17
```

## Conceptos que muestra

- **Server Components** (`app/page.js`): consultan la base con `await getTasks()` sin `useEffect` ni `fetch`.
- **Client Components** (`"use client"`): solo donde hace falta estado o APIs del navegador
  (diálogo de borrado, botón con indicador de carga, límite de error, tema de MUI).
- **Server Actions** (`app/actions.js`): reciben `FormData`, validan en servidor, ejecutan SQL y llaman a `revalidatePath("/")`.
- **SQL parametrizado** (`$1, $2, $3`) en `lib/tasks.js`.
- **Material UI con App Router**: `AppRouterCacheProvider` (de `@mui/material-nextjs`) inyecta los estilos en el HTML del servidor.

> Detalle de MUI con Server Components: los componentes que clonan a su hijo y leen sus props
> (`FormControlLabel`, `Tooltip`) fallan si el hijo se crea en un Server Component.
> Por eso `page.js` usa un `<label>` nativo para el checkbox y el atributo `title` en lugar de `Tooltip`.

## Diagnóstico

| Síntoma                                | Qué revisar                                                                                     |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `port is already allocated` al levantar Docker | Otro servicio usa el puerto 5433. Cambiarlo con la variable `DB_PORT` (ej. `DB_PORT=5434 npm run db:up`) y ajustar `DATABASE_URL`. |
| `ECONNREFUSED`                         | Que el contenedor esté corriendo (`docker ps`) y que el puerto de `DATABASE_URL` sea 5433.      |
| `Falta configurar DATABASE_URL`        | Que exista `.env.local` en la raíz y reiniciar `npm run dev`.                                   |
| La tabla no existe                     | El script de `db/init` solo corre con el volumen vacío: ejecutar `npm run db:reset`.            |

> El contenedor expone PostgreSQL en el puerto **5433** del host (no 5432) para no chocar con
> un PostgreSQL instalado localmente.

## Despliegue en Render (Docker)

Basado en `docs/Material_Complementario_Despliegue_NextJS_Render_Vercel.pdf`. El proyecto ya incluye:

- `next.config.mjs` con `output: "standalone"` (genera `.next/standalone/server.js`).
- `Dockerfile` multi-etapa (`deps` → `builder` → `runner`) con `node:22-alpine`.
- `.dockerignore` que excluye `node_modules`, `.next`, `.git` y los archivos `.env*` (salvo `.env.example`).

Pasos en el panel de Render:

1. **New → PostgreSQL** (por ejemplo `todo-postgres`, plan Free). Elegir una región.
2. Conectarse con la **External Database URL** (o el SQL Editor) y ejecutar el `CREATE TABLE`
   de `db/init/01-schema.sql`.
3. **New → Web Service**, conectar este repositorio de GitHub, **misma región** que la base,
   runtime **Docker**, plan Free.
4. En **Environment** del Web Service, agregar `DATABASE_URL` con la **Internal Database URL**.
   Guardar y volver a desplegar si no se inicia solo.
5. Abrir la URL pública y probar el CRUD; recargar para verificar que los datos persisten.

> `DATABASE_URL` solo se exige en tiempo de ejecución: durante `next build` (dentro del
> Dockerfile) no existe, y `lib/db.js` omite la validación en esa fase. Nunca usar el prefijo
> `NEXT_PUBLIC_` para esta variable ni incluirla en la imagen o en el repositorio.
>
> El servidor standalone escucha en `0.0.0.0` y respeta la variable `PORT` que asigna Render.
> Plan Free: el servicio se suspende tras 15 min sin tráfico y la base Free vence a los 30 días.

## Despliegue en Vercel + Neon

Alternativa administrada descrita en el mismo material. **No requiere cambios en el código**:
Vercel detecta Next.js y usa su propia plataforma de build (no ejecuta el `Dockerfile`), y
`lib/db.js` sigue leyendo `DATABASE_URL`.

1. **Neon**: crear un proyecto (por ejemplo `todo-vercel`) en una región cercana a la de Vercel.
   En **Connect**, copiar la cadena **pooled** (host con `-pooler`), recomendada para serverless.
   Conservar los parámetros que incluye (`sslmode=require`, etc.).
2. En el **SQL Editor** de Neon, ejecutar el `CREATE TABLE` de `db/init/01-schema.sql`.
3. **Vercel → Add New → Project**: importar este repositorio, verificar que el Framework Preset
   sea Next.js y mantener los comandos detectados.
4. **Settings → Environment Variables**: agregar `DATABASE_URL` con la cadena de Neon, al menos
   en **Production** (opcionalmente Preview y Development). Si se usa la integración de Neon del
   Marketplace, comprobar el nombre de la variable que crea: el código espera `DATABASE_URL`.
5. Generar un nuevo deployment después de guardar o cambiar la variable.
6. Abrir la URL pública, probar el CRUD y recargar para verificar que los datos persisten en Neon.
   Ante errores, revisar **Build Logs** y **Runtime Logs**.

> Vercel Hobby está orientado a proyectos personales y no comerciales; Neon Free tiene cuotas
> (hasta 1 GB por proyecto según el plan vigente).
