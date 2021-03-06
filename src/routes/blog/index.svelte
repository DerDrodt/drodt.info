<script context="module" lang="ts">
  import type { Preload } from "../../types/sapper";

  export const preload: Preload = async function (this, { query }) {
    return this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts: Post[]) => {
        return { posts, tag: query.tag };
      });
  };
</script>

<script lang="ts">
  import Tag from "../../components/Tag.svelte";
  import type { Post } from "../../types/post";
  export let posts: Post[];
  export let tag: string | undefined;
</script>

<style lang="scss">
  .posts {
    grid-template-columns: 1fr 1fr;
    grid-gap: 1em;
    min-height: calc(100vh - var(--nav-h));
    padding: var(--top-offset) var(--side-nav) 6rem var(--side-nav);
    max-width: var(--main-width);
    margin: 0 auto;

    a:hover,
    a:hover > h2 {
      color: var(--flash);
    }
  }

  h2 {
    display: inline-block;
    margin: 1rem 0 0.4rem 0;
    color: var(--text);
    max-width: 18em;
    font-size: var(--h3);
    font-weight: 400;
  }

  .post {
    &:first-child {
      margin: 0 0 2rem 0;
      padding: 0 0 1rem 0;
      border-bottom: var(--border-w) solid #6767785b; /* based on --second */

      h2 {
        font-size: 3rem;
        font-weight: 400;
        color: var(--second);
      }
    }

    &:first-child::before,
    &:nth-child(2)::before {
      content: "Latest post • " attr(data-pubdate);
      color: var(--text);
      font-size: var(--h6);
      font-weight: 400;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    &:nth-child(2)::before {
      content: "Older posts";
    }

    p {
      font-size: var(--h5);
      max-width: 30em;
      color: var(--second);
    }

    & > a {
      display: block;
    }
  }

  .tags {
    margin: 0;
  }

  .current-tag {
    padding: 0 var(--side-nav);
  }
</style>

<svelte:head>
  <title>Blog | Drodt</title>

  <meta name="twitter:title" content="Drodt.info" />
  <meta name="twitter:description" content="Articles by Daniel Drodt" />
  <meta name="Description" content="Articles by Daniel Drodt" />
</svelte:head>

{#if tag !== undefined}
  <p class="current-tag">
    Showing all articles for
    <Tag name={tag} />
    <a href="/blog">Show all</a>
  </p>
{/if}

<div class="posts stretch">
  {#each posts.filter((p) => tag === undefined || p.metadata.tags.includes(tag)) as post}
    <!-- we're using the non-standard `rel=prefetch` attribute to
				tell Sapper to load the data for the page as soon as
				the user hovers over the link or taps it, instead of
				waiting for the 'click' event -->
    <article class="post" data-pubdate={post.metadata.dateString}>
      <a
        class="no-underline"
        rel="prefetch"
        href="blog/{post.slug}"
        title="Read the article »">
        <h2>{post.metadata.title}</h2>
        <p class="tags">
          {#each post.metadata.tags as tag}
            <Tag name={tag} />
          {/each}
        </p>
        <p>{post.metadata.description}</p>
      </a>
    </article>
  {/each}
</div>
