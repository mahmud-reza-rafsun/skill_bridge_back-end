import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/server.ts"],
    format: ["esm"],
    platform: "node",
    target: "node20",
    outDir: "api",
    external: ["pg-native"],
    bundle: true,
    noExternal: ["@prisma/client", "@prisma/adapter-pg"],
    shims: true,
    banner: {
        js: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
        `,
    },
    outExtension() {
        return { js: ".mjs" };
    },
    clean: true,
});