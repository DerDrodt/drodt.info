<script lang="ts">
	import { dev, browser } from '$app/environment';
	import type { PageData } from './$types';

	import Tag from '../../../components/Tag.svelte';

	export let data: PageData;

	function updateLang(lang: string) {
		if (browser) document.documentElement.setAttribute('lang', lang);
	}

	updateLang(data.post.metadata.lang);
</script>

<svelte:head>
	<title>{data.post.metadata.title} | Drodt</title>

	<meta name="twitter:title" content={data.post.metadata.title} />
	<meta name="twitter:description" content={data.post.metadata.description} />
	<meta name="Description" content={data.post.metadata.description} />
</svelte:head>

<article class="post listify">
	{#if data.post.metadata.tags.length > 0}
		<div class="tags">
			{#each data.post.metadata.tags as tag}
				<Tag name={tag} />
			{/each}
		</div>
	{/if}
	<h1>{data.post.metadata.title}</h1>
	<p class="standfirst">{data.post.metadata.description}</p>

	<p class="byline">
		<time datetime={data.post.metadata.date}>{data.post.metadata.dateString}</time>
		•
		<span class="time-to-read">{data.post.metadata.timeToReadString}</span>
	</p>
	{#if dev}
		<div
			style="position: fixed; bottom: 16px; left: 16px; background-color: #fff; z-index: 999; padding: 8px; border-radius: 4px;"
		>
			{data.post.metadata.wordCount}
			words |
			{data.post.metadata.timeToRead}min
		</div>
	{/if}
	{#if data.post.metadata.isDraft}
		<div
			style="position: fixed; bottom: 16px; right: 16px; background-color: #fff; z-index: 999; padding: 8px; border-radius: 4px; color: red;"
		>
			DRAFT
		</div>
	{/if}
	<div class="content">
		{@html data.post.html}
	</div>
</article>

<style lang="scss">
	.post {
		padding: var(--top-offset) var(--side-nav) 6rem var(--side-nav);
		max-width: var(--main-width);
		margin: 0 auto;

		h1 {
			color: var(--second);
			max-width: 20em;
			margin: 0 0 0.8rem 0;
		}
	}

	h1 {
		font-weight: 400;

		@media (min-width: 800px) {
			font-size: 4rem;
		}
	}

	.standfirst {
		font-size: var(--h5);
		color: var(--second);
		margin: 0 0 1em 0;

		@media (min-width: 800px) {
			font-size: var(--h4);
		}
	}

	.byline {
		margin: 0 0 2rem 0;
		padding: 0;
		font-size: var(--h6);
		text-transform: uppercase;
	}

	.post p,
	.content {
		text-align: justify;
	}

	.tags {
		margin: 0;
		padding: 0 0 4px 0;
		overflow-x: auto;
		white-space: nowrap;
		height: 28px;

		@media (min-width: 800px) {
			margin: 0;
			overflow-x: unset;
		}
	}
</style>
