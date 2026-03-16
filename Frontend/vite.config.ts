import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (
            id.includes("@mediapipe") ||
            id.includes("@mui") ||
            id.includes("@emotion")
          ) {
            return "yoga-vendor";
          }

          if (id.includes("@radix-ui")) {
            return "radix-vendor";
          }

          if (id.includes("react") || id.includes("react-dom") || id.includes("scheduler")) {
            return "react-vendor";
          }

          if (id.includes("motion")) {
            return "motion-vendor";
          }

          if (id.includes("lucide-react") || id.includes("sonner") || id.includes("@vercel")) {
            return "ui-vendor";
          }

          return "vendor";
        },
      },
    },
  },
  base: "/",
})
