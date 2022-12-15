import { vitePreprocess } from '@sveltejs/kit/vite';
import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: vercel(),
		alias: {
			types: 'src/types',
			comps: 'src/components'
		}
	},
	preprocess: [vitePreprocess()]
};

export default config;
