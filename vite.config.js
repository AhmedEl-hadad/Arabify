import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["react-syntax-highlighter", "highlight.js"],
  },
  build: {
    outDir: "build", // Keeps the same output folder as CRA
  },
  server: {
    port: 3001, // Keeps your dev server on port 3000
    open: true,
  },
});
