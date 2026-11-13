import { defineConfig } from "vite";

// Demo site (GitHub Pages). Built into its own folder so it never overwrites the library build in dist/.
export default defineConfig({
  base: "/soditor/", // <-- repo name here
  build: {
    outDir: "dist-site",
  },
});
