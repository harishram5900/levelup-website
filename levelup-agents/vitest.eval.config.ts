import { defineConfig } from "vitest/config";
import path from "path";

/** Persona evaluation (not part of the fast unit suite). */
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: { include: ["tests/eval/**/*.eval.ts"], environment: "node" },
});
