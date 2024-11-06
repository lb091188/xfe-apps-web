import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import ElementPlus from "unplugin-element-plus/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  server: {
    proxy: {
      "/api": {
        target: "https://www.liuziheng.top:11910",
        changeOrigin: true,
        rewrite(path) {
          return path.replace(/\/api/, "");
        },
      },
    },
  },
  plugins: [
    vue(),
    ElementPlus({
      useSource: true,
    }),
    AutoImport({
      imports: [
        "vue",
        "pinia",
        "vue-router",
        "@vueuse/core",
        {
          dayjs: [["default", "dayjs"]],
          "element-plus": ["ElAlert", "ElMessage", "ElMessageBox", "ElNotification", "ElLoading"],
        },
      ],
      dirs: ["./src/hooks", "./src/store", "./src/util"],
      dts: "src/auto-imports.d.ts",
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Noah Liu 的小应用们",
        short_name: "小应用",
        theme_color: "#ffffff",
      },
      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "./docs",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {},
      },
    },
  },
});
