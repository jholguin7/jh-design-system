import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      // Windows-safe: fileURLToPath strips the leading `/C:/...` slash that .pathname gives.
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url))),
    },
  },
});
