<script context="module" lang="ts">
  import type { Preload } from "../types/sapper";

  export const preload: Preload = async function (this) {
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

<style lang="scss">
  h1 {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;

    @media (min-width: 480px) {
      font-size: 4em;
    }
  }

  p {
    margin: 1em auto;
  }

  .face {
    width: 200px;
    height: 200px;
    border-radius: 100px;
    border: 4px #fff solid;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    &-container {
      display: flex;
      justify-content: center;
    }
  }
</style>

<svelte:head>
  <title>Drodt.info</title>
</svelte:head>

<h1>Drodt.info</h1>

<div class="face-container">
  <img class="face" src="/pic.jpg" alt="My Face" />
</div>

<p>Welcome to my personal blog!</p>

<p>
  On here I write about whatever interests me. This includes politics,
  philosophy web development, computer science and open source software.
</p>

<p>
  My latest post is
  <a href={`blog/${latestPost.slug}`}>{latestPost.metadata.title}</a>
  {#if latestPost.metadata.lang === 'de'}(in German){/if}
</p>
