import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async function ({ fetch, params }) {
  try {
    const res = await fetch(`${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { post: data };
    } else {
      throw error(500, data);
    }
  } catch (e) {
    throw error(500, e);
  }
};
