<script context="module" lang="ts">
  import type { Preload } from "../../types/sapper";

  export const preload: Preload = async function (this, { params, query }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`blog/${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { post: data };
    } else {
      this.error(res.status, data.message);
    }
  };
</script>

<script lang="ts">
  import Tag from "../../components/Tag.svelte";
  import type { Post } from "../../types/post";

  export let post: Post;

  function updateLang(lang: string) {
    if ((process as any).browser)
      document.documentElement.setAttribute("lang", lang);
  }

  updateLang(post.metadata.lang);
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
    margin: 0 0 2rem 0;
    padding: 0;
    border-top: var(--border-w) solid #6767785b;
    font-size: var(--h6);
    text-transform: uppercase;
  }

  .post h1 {
    color: var(--second);
    max-width: 20em;
    margin: 0 0 0.8rem 0;
  }

  .tags {
    margin: 0;
  }
</style>

<svelte:head>
  <title>{post.metadata.title}</title>

  <meta name="twitter:title" content={post.metadata.title} />
  <meta name="twitter:description" content={post.metadata.description} />
  <meta name="Description" content={post.metadata.description} />
</svelte:head>

<article class="post listify">
  <p class="tags">
    {#each post.metadata.tags as tag}
      <Tag name={tag} />
    {/each}
  </p>
  <h1>{post.metadata.title}</h1>
  <p class="standfirst">{post.metadata.description}</p>

  <p class="byline">
    <time datetime={post.metadata.pubDate}>{post.metadata.dateString}</time>
    •
    <span class="time-to-read">{post.metadata.timeToReadString}</span>
  </p>
  {#if process.env.NODE_ENV === 'development'}
    <div style="position: fixed; bottom: 16px; left: 16px;">
      {post.metadata.wordCount}
      words |
      {post.metadata.timeToRead}min
    </div>
  {/if}
  {@html post.html}
</article>
