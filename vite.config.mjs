import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  // Mantiene el build en /build y ajusta el warning de tamaño
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },

  // Orden de plugins compatible con Vite 7
  plugins: [tsconfigPaths(), react(), tagger()],

  // Dev server
  server: {
    port: 4028,                 // número (no string) en Vite 7
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: [".amazonaws.com", ".builtwithrocket.new"],
  },

  // Preview del build (vite preview)
  preview: {
    port: 4173,
    host: "0.0.0.0",
    allowedHosts: [".amazonaws.com", ".builtwithrocket.new"],
  },
});