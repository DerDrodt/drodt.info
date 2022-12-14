<script context="module" lang="ts">
  throw new Error("@migration task: Check code was safely removed (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292722)");

  // import type { Load } from "./$types";
  // export const load: Load = async function ({ fetch }) {
  //   const res = await fetch(`blog.json`);
  //   const data = await res.json();

  //   if (res.status === 200) {
  //     return { status: 200, props: { latestPost: data[0] } };
  //   } else {
  //     return { status: 500, error: data };
  //   }
  // };
</script>

<script lang="ts">
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import type { Post } from "../types/post";

  export let latestPost: Post | undefined;
</script>

<svelte:head>
  <title>Drodt.info</title>
</svelte:head>

<h1>Drodt.info</h1>

<div class="face-container">
  <img class="face" src="/pic.jpg" alt="My Face" />
</div>

<p>Welcome to my personal blog!</p>

<p>
  I am a student of Computer Science and Philosophy at Technische Universität
  Darmstadt working towards his Master. My main focus of study seems to be
  formal verification, but maybe that will change. Who knows?
</p>

<p>
  On here I write about whatever interests me. This includes politics,
  philosophy web development, computer science and open source software.
</p>

<p>
  You can also follow me on
  <a href="https://twitter.com/DerDrodtel">Twitter</a>
  or
  <a href="https://www.linkedin.com/in/daniel-drodt-95a960159/">LinkenIn</a>, if
  you want.
</p>

{#if latestPost !== undefined}
  <p>
    My latest post is
    <a href={`blog/${latestPost.slug}`}>{latestPost.metadata.title}</a>
    {#if latestPost.metadata.lang === "de"}(in German){/if}
  </p>
{/if}

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
