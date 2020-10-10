<script context="module" lang="ts">
  import type { Preload } from "../types/sapper";

  export const preload: Preload = async function (this, { params, query }) {
    const res = await this.fetch(`blog.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { latestPost: data[0] };
    } else {
      this.error(res.status, data.message);
    }
  };
</script>

<script lang="ts">
  import type { Post } from "../types/post";

  export let latestPost: Post;
</script>

<style>
  h1 {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>Drodt.info</title>
</svelte:head>

<h1>Drodt.info</h1>

<p>Welcome to my personal blog!</p>

<p>
  On here I write about whatever interests me. This includes politics, web
  development, computer science and open source.
</p>

<p>
  My latest post is
  <a href={`blog/${latestPost.slug}`}>{latestPost.metadata.title}</a>
  {#if latestPost.metadata.lang === 'de'}(in German){/if}
</p>
