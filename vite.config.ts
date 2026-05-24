import fs from "node:fs"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import VueRouter from "vue-router/vite"
import tailwindcss from "@tailwindcss/vite"
import "dotenv/config"

// @ts-expect-error commonjs module
import { define, raw } from "./define.config.mjs"
import { dirname, relative } from "node:path"

const IS_DEV = process.env.NODE_ENV === "development"
const PORT = Number(process.env.PORT) || 5174

const getImmediateDirectories = (path: string) =>
  fs
    .readdirSync(path, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

export default defineConfig({
  base: IS_DEV ? `/` : "",

  build: {
    watch: IS_DEV ? {} : undefined,
    sourcemap: IS_DEV ? "inline" : false,
    rollupOptions: {
      input: {},
    },
    terserOptions: {
      mangle: false,
    },
  },

  define,

  optimizeDeps: {
    include: ["vue", "@vueuse/core", "webextension-polyfill"],
    exclude: ["vue-demi"],
  },

  plugins: [
    {
      name: "ensure-output-dir",
      buildStart() {
        ;["dist/chrome"].forEach((dir) => {
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        })
      },
    },

    VueRouter({
      dts: "src/types/typed-router.d.ts",
      routesFolder: getImmediateDirectories("src/ui").map((dir) => ({
        src: `src/ui/${dir}/pages`,
        path: `${dir}/`,
      })),
    }),

    vue(),

    tailwindcss(),

    {
      name: "html-define-plugin",
      enforce: "post",
      transformIndexHtml(html) {
        return html.replace(
          /%+\s*(\w+)\s*%+/g,
          (_, key) => raw[key] ?? `%${key}%`,
        )
      },
    },

    // rewrite assets to use relative path
    {
      name: "assets-rewrite",
      enforce: "post",
      apply: "build",
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), "/assets")}/`,
        )
      },
    },
  ],

  server: {
    port: PORT,
    hmr: {
      host: "localhost",
      port: PORT,
    },
    origin: `http://localhost:${PORT}`,
  },

  resolve: {
    alias: {
      "~": fileURLToPath(new URL(".", import.meta.url)),
      "@": fileURLToPath(new URL("src", import.meta.url)),
      src: fileURLToPath(new URL("src", import.meta.url)),
      "@assets": fileURLToPath(new URL("src/assets", import.meta.url)),
    },
  },
})