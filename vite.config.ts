import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { devtools } from "@tanstack/devtools-vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    react(),
    netlify(),
  ],
});
