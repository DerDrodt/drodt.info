import type { PageLoad } from "./$types";
export const load: PageLoad = async function ({ fetch }) {
  const res = await fetch(`blog.json`);
  const data = await res.json();

  if (res.status === 200) {
    return { latestPost: data[0] };
  } else {
    throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
    return { status: 500, error: data };
  }
};
