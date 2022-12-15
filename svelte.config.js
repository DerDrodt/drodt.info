import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			types: 'src/types',
			comps: 'src/components'
		}
	},
	preprocess: [vitePreprocess()]
};

export default config;
