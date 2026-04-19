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
    shims: true, // এটি খুবই গুরুত্বপূর্ণ
    banner: {
        // ESM এ require সাপোর্ট করার জন্য এটি যোগ করুন
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