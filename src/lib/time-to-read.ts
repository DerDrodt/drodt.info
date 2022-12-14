import sanitizeHTML from 'sanitize-html';
import { words } from './words';

// After https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-transformer-remark/src/utils/time-to-read.js

export const timeToRead = (html: string) => {
	let timeToRead = 0;
	const pureText = sanitizeHTML(html, { allowedTags: [] });
	const avgWPM = 265;

	const wordCount = words(pureText).length;

	timeToRead = Math.round(wordCount / avgWPM);
	if (timeToRead === 0) {
		timeToRead = 1;
	}
	return [wordCount, timeToRead];
};

export const formatTimeToRead = (t: number, lang: string) => {
	if (lang === 'en') {
		return `${t}min read`;
	}
	return `${t}min Artikel`;
};
