<script context="module" lang="ts">
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`blog/${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { post: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script lang="ts">
  import type { Post } from "../../types/post";

  export let post: Post;
</script>

<style>
  .post {
    padding: var(--top-offset) var(--side-nav) 6rem var(--side-nav);
    max-width: var(--main-width);
    margin: 0 auto;
  }

  h1 {
    font-size: 4rem;
    font-weight: 400;
  }

  .standfirst {
    font-size: var(--h4);
    color: var(--second);
    margin: 0 0 1em 0;
  }

  .byline {
    margin: 0 0 6rem 0;
    padding: 1.6rem 0 0 0;
    border-top: var(--border-w) solid #6767785b;
    font-size: var(--h6);
    text-transform: uppercase;
  }

  .post h1 {
    color: var(--second);
    max-width: 20em;
    margin: 0 0 0.8rem 0;
  }
</style>

<svelte:head>
  <title>{post.metadata.title}</title>

  <meta name="twitter:title" content={post.metadata.title} />
  <meta name="twitter:description" content={post.metadata.description} />
  <meta name="Description" content={post.metadata.description} />
</svelte:head>

<article class="post listify">
  <h1>{post.metadata.title}</h1>
  <p class="standfirst">{post.metadata.description}</p>

  <p class="byline">
    <time datetime={post.metadata.pubDate}>{post.metadata.dateString}</time>
  </p>

  {@html post.html}
</article>
