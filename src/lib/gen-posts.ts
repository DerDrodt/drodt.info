import fs from 'fs';
import path from 'path';
import mdIt from 'markdown-it';
import footNote from 'markdown-it-footnote';
import anchor from 'markdown-it-anchor';
import { extractFrontmatter } from './markdown';
import type { Post } from 'types/post';
import { formatTimeToRead, timeToRead as estimateTimeToRead } from './time-to-read';
import { addABS, addRABS } from './abs-prism';
import PrismJS from 'prismjs';
import { dev } from '$app/environment';

import loadLanguages from 'prismjs/components/index.js';

loadLanguages(['rust']);

addABS(PrismJS.languages);
addRABS(PrismJS.languages);

const fallbackDate = (d: string | undefined): [string, boolean] => {
	const now = new Date();
	if (d === undefined) {
		const year = now.getFullYear();
		const month = now.getMonth() + 1;
		const nMonth = month < 10 ? `0${month}` : month;
		const day = now.getUTCDate() + 1;
		const nDay = day < 10 ? `0${day}` : day;
		return [`${year}-${nMonth}-${nDay}`, true];
	} else {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) {
			throw new Error(`Invalid Date format: "${d}"`);
		}
		return [d, false];
	}
};

function getPossiblePosts(): (Post | null)[] {
	return fs.readdirSync('content/blog').map((file) => {
		if (path.extname(file) !== '.md') return null;

		const match = /^(.+)\.md$/.exec(file);
		if (!match) throw new Error(`Invalid filename '${file}'`);

		const [, slug] = match;

		const markdown = fs.readFileSync(`content/blog/${file}`, 'utf-8');

		const { content, metadata } = extractFrontmatter(markdown);

		const [pubDate, isDraft] = fallbackDate(metadata.date);

		metadata.isDraft = isDraft;

		if (isDraft && !dev) {
			console.log(`Skipping draft ${metadata.title}`);
			return null;
		}

		const date = new Date(`${pubDate} UTC+2`);
		metadata.date = pubDate;
		metadata.lang = metadata.lang ?? 'en';
		metadata.dateString = new Intl.DateTimeFormat(metadata.lang, {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
		const tagString = metadata.tags as unknown as string | undefined;
		metadata.tags = tagString?.split(', ') ?? [];

		const quotes = metadata.lang === 'de' ? `„“‚‘` : `“”‘’`;

		const md = mdIt({
			typographer: true,
			quotes,
			highlight: (source: string, lang?: string) => {
				const highlighted =
					lang && PrismJS.languages[lang]
						? PrismJS.highlight(source, PrismJS.languages[lang], lang)
						: source.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));
				return `<pre class='language-${lang}'><code>${highlighted}</code></pre>`;
			}
		})
			.use(footNote)
			.use(anchor, {
				permalink: anchor.permalink.headerLink()
			});

		customizeRules(md, slug, metadata.lang);

		const html: string = md.render(
			content.replace(/^\t+/gm, (match) => match.split('\t').join('  '))
		);

		const [wordCount, timeToRead] = estimateTimeToRead(html);
		metadata.wordCount = wordCount;
		metadata.timeToRead = timeToRead;
		metadata.timeToReadString = formatTimeToRead(timeToRead, metadata.lang);

		return {
			html,
			metadata,
			slug
		};
	});
}

export default function getPosts(): Post[] {
	const possiblePosts = getPossiblePosts();
	const posts = possiblePosts.filter((p) => p !== null) as Post[];
	return posts.sort((a, b) => (a.metadata.date < b.metadata.date ? 1 : -1));
}

const customizeRules = (md: any, slug: string, lang: string) => {
	// Customize footnotes

	md.renderer.rules.footnote_ref = (
		tokens: any[],
		idx: number,
		options: any,
		env: any,
		slf: any
	) => {
		const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
		const caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);
		let refId = id;

		if (tokens[idx].meta.subId > 0) {
			refId += ':' + tokens[idx].meta.subId;
		}

		return `<sup class="footnote-ref"><a href="blog/${slug}#fn${id}" id="fnref${refId}">${caption}</a></sup>`;
	};

	md.renderer.rules.footnote_anchor = (
		tokens: any[],
		idx: number,
		options: any,
		env: any,
		slf: any
	) => {
		let id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);

		if (tokens[idx].meta.subId > 0) {
			id += ':' + tokens[idx].meta.subId;
		}

		/* ↩ with escape code to prevent display as Apple Emoji on iOS */
		return ` <a href="blog/${slug}#fnref${id}" class="footnote-backref">↩︎</a>`;
	};

	md.renderer.rules.footnote_block_open = (tokens: any, idx: number, options: any) => {
		return `${options.xhtmlOut ? '<hr class="footnotes-sep" />' : '<hr class="footnotes-sep">'}
        <section class="footnotes">
        <h3>${lang === 'en' ? 'Footnotes' : 'Fußnoten'}</h3>
        <ol class="footnotes-list">
`;
	};

	const wrap =
		(wrapped: (...a: any) => string) =>
		(...args: any[]) => {
			const [tokens, idx] = args;
			const token = tokens[idx];

			const rawCode = wrapped(...args);

			return (
				`<!--beforebegin--><div class="language-${token.info.trim()} extra-class">` +
				`<!--afterbegin-->${rawCode}<!--beforeend--></div><!--afterend-->`
			);
		};
	const { fence, code_block: codeBlock } = md.renderer.rules;
	md.renderer.rules.fence = wrap(fence);
	md.renderer.rules.code_block = wrap(codeBlock);
};
