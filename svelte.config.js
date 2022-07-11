import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";
import vercel from "@sveltejs/adapter-vercel";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: vercel({
      includePaths: ["content"],
    }),
  },
  preprocess: sveltePreprocess({
    scss: {
      includePaths: ["src"],
    },
    postcss: {
      plugins: [autoprefixer],
    },
  }),
};

export default config;
