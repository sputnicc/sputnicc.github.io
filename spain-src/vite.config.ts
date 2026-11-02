import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/spain/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": resolve(root, "src") },
  },
  build: {
    outDir: "../spain",
    emptyOutDir: true,
    assetsDir: "assets",
  },
});
