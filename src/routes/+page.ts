import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async function ({ fetch }) {
	const res = await fetch(`blog.json`);
	const data = await res.json();

	if (res.status === 200) {
		return { latestPost: data[0] };
	} else {
		throw error(500, data);
	}
};
