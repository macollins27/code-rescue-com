import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://code-rescue.com",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
    inlineStylesheets: "auto",
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  integrations: [preact({ compat: true }), sitemap()],
  vite: {
    build: {
      sourcemap: false,
      cssMinify: "lightningcss",
    },
    optimizeDeps: {
      exclude: ["@astrojs/preact"],
    },
    ssr: {
      noExternal: ["@astrojs/preact"],
    },
  },
});
