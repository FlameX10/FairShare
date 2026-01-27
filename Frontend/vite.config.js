import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],

  build: {
    outDir: "dist",
    sourcemap: true,
    manifest: true,
  },

  server: {
    port: 3000,
  },

  preview: {
    port: 4173,
  },
});
