<script>
	import Nav from '../components/Nav.svelte';

	import { page } from '$app/stores';
</script>

<header>
	<Nav segment={$page.url.pathname.split('/')[1]} />
	<div class="spacer" />
	<div class="social">
		<a href="https://twitter.com/DerDrodtel" target="_blank" rel="noreferrer"
			><img src="/twitter.svg" width="36" alt="Twitter" /></a
		>
		<a href="https://github.com/DerDrodt" target="_blank" rel="noreferrer"
			><img src="/github.png" width="32" alt="GitHub" /></a
		>
	</div>
</header>

<main>
	<slot />
</main>

<style lang="scss">
	:global() {
		@import '../style/global.scss';
	}

	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 0;
		margin: 0 auto;
		box-sizing: border-box;

		@media (min-width: 800px) {
			padding: 2em;
		}
	}

	header {
		display: flex;
		border-bottom: 1px solid rgba(255, 62, 0, 0.1);
	}

	.spacer {
		flex-grow: 1;
	}

	.social {
		display: flex;
		align-items: center;
		margin-right: 16px;
	}

	.social > * {
		margin: 8px;
	}
</style>
