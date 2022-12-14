import type { PageLoad } from "../$types";
import { dev, browser } from "$app/env";

export const load: PageLoad = async function ({ fetch, params }) {
  try {
    const res = await fetch(`${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { post: data };
    } else {
      throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
      return { status: 500, error: data };
    }
  } catch (e) {
    throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
    return { status: 500, error: e };
  }
};
