import { sveltekit } from "@sveltejs/kit/vite";
import * as path from "path";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],

  resolve: {
    alias: {
      $img: path.resolve("src/images"),
    },
  },

  server: {
    fs: {
      strict: false,
    },
  },
};

export default config;
