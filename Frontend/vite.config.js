// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   base: "/",    // <-- REQUIRED for Netlify / production
//   plugins: [react(), tailwindcss()],
//   server: {
//     port: 3000,
//   },
// })



import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/", // Ensure relative paths for Netlify
  plugins: [react(), tailwindcss()],

  build: {
    outDir: "dist",
    sourcemap: true,          // Helps debugging
    manifest: true,           // Ensures proper asset resolution
  },

  server: {
    port: 3000,
  },

  preview: {
    port: 4173,
  },
});
