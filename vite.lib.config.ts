import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/lib/index.ts"),
      name: "Soditor",
      fileName: (format) => `soditor.${format}.js`,
    },
    rollupOptions: {
      external: [], // list dependencies here to avoid bundling them
      output: {
        assetFileNames: (assetInfo) => {
          // Put all CSS into a single file
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "soditor.css";
          }
          return assetInfo.name!;
        },
      },
    },
  },
});
