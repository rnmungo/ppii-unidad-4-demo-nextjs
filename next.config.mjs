/** @type {import('next').NextConfig} */
const nextConfig = {
  // Genera .next/standalone con un server.js mínimo para ejecutarlo en Docker (Render).
  output: "standalone",
};

export default nextConfig;
