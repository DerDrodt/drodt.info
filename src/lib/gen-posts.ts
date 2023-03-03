import fs from 'fs';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkSmartypants from 'remark-smartypants';
import remarkPrism from 'remark-prism';
import type { Metadata, Post } from 'types/post';
import { formatTimeToRead, timeToRead as estimateTimeToRead } from './time-to-read';
import { addABS, addRABS } from './abs-prism';
import PrismJS from 'prismjs';
import { dev } from '$app/environment';

import loadLanguages from 'prismjs/components/index.js';
import remarkYamlMatter from './frontmatter';

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

		const input = fs.readFileSync(`content/blog/${file}`, 'utf-8');

		// Process the first time to get language
		const lang = (
			unified()
				.use(remarkParse)
				.use(remarkFrontmatter)
				.use(remarkYamlMatter)
				.use(remarkRehype)
				.use(rehypeStringify)
				.processSync(input).data.matter as { lang: 'en' | 'de' }
		).lang;

		const quotes =
			lang === 'de'
				? { opening: { single: '‚', double: '„' }, closing: { single: '‘', double: '“' } }
				: { opening: { single: '‘', double: '“' }, closing: { single: '’', double: '”' } };

		const mdProcessor = unified()
			.use(remarkParse)
			.use(remarkFrontmatter)
			.use(remarkYamlMatter)
			.use(remarkGfm)
			.use(remarkSmartypants, {
				dashes: 'oldschool',
				openingQuotes: quotes.opening,
				closingQuotes: quotes.closing
			})
			.use(remarkPrism)
			.use(remarkRehype)
			.use(rehypeStringify);

		const vFile = mdProcessor.processSync(input);

		const html = String(vFile);

		const metadata = vFile.data.matter as Metadata;

		const content = '';

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
