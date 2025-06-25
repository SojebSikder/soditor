import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/lib/editor/index.ts"),
      name: "Soditor",
      fileName: (format) => `soditor.${format}.js`,
    },
    rollupOptions: {
      external: [], // list dependencies here to avoid bundling them
    },
  },
});
