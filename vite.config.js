import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  define: {
    global: "window",
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  plugins: [
    nodePolyfills({
      include: ["buffer"],
    }),
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        exportType: "default",
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: "**/*.svg",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ FIXED
    },
  },
});
