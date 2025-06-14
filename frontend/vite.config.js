import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/users": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/feedback": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/mealplan": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/recipes": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/custom": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/groq": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
