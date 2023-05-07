import { vitePreprocess } from "@sveltejs/kit/vite";
import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    outDir: ".outputs/svelte-kit",
    adapter: adapter({
      pages: ".outputs/adapter-static",
      assets: ".outputs/adapter-static",
    }),
    files: {
      hooks: {
        client: "app/hooks/client.ts",
        server: "app/hooks/server.ts",
      },
      appTemplate: "app/index.html",
      assets: "app/assets",
      errorTemplate: "app/error.html",
      lib: "app/lib",
      params: "app/params",
      routes: "app/routes",
      serviceWorker: "app/worker.ts",
    },
  },
};

export default config;

// ln -s .outputs/target/ <the path of the link to be created>
