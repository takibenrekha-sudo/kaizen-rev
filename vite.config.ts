import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige toutes les requêtes commençant par /api vers le backend (Port 5001)
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
      // Redirige aussi l'accès aux images uploadées
      "/uploads": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
