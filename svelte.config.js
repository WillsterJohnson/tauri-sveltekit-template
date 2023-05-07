import { vitePreprocess } from "@sveltejs/kit/vite";
import aStatic from "@sveltejs/adapter-static";
// TODO
import aVercel from "@sveltejs/adapter-vercel";

function adapter() {
  const npm_lifecycle_event = process.env.npm_lifecycle_event;
  if (npm_lifecycle_event === "app-build" || npm_lifecycle_event === "sk-dev")
    return aStatic({
      pages: ".outputs/adapter-static",
      assets: ".outputs/adapter-static",
    });
  // TODO
  if (npm_lifecycle_event === "web-build") return aVercel();
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    outDir: ".outputs/svelte-kit",
    adapter: adapter(),
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
