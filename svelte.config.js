import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";
import netlify from "@sveltejs/adapter-netlify";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: netlify(),
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
