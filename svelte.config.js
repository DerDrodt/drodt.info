import { vitePreprocess } from '@sveltejs/kit/vite';
import netlify from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: netlify(),
		alias: {
			types: 'src/types',
			comps: 'src/components'
		}
	},
	preprocess: [vitePreprocess()]
};

export default config;
