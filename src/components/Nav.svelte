<script lang="ts">
	export let segment: string | undefined;
</script>

<nav>
	<ul>
		<li>
			<a aria-current={segment === '' ? 'page' : undefined} href="/">home</a>
		</li>

		<li>
			<a rel="prefetch" aria-current={segment === 'blog' ? 'page' : undefined} href="/blog">blog</a>
		</li>
	</ul>
</nav>

<style lang="scss">
	nav {
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;

		&::after {
			/* clearfix */
			content: '';
			display: block;
			clear: both;
		}
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;

		&::after {
			position: absolute;
			content: '';
			width: calc(100% - 1em);
			height: 2px;
			background-color: rgb(255, 62, 0);
			display: block;
			bottom: -3px;
		}
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;

		&:visited {
			color: unset;
		}
	}
</style>
