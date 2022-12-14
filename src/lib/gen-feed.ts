import { Feed } from 'feed';
import posts from './gen-posts';

const feed = new Feed({
	title: 'Drodt.info Feed',
	description: 'Personal blog by Daniel Drodt',
	id: 'https://drodt.info',
	link: 'https://drodt.info',
	language: 'en',
	image: 'https://drodt.info/logo-512.png',
	favicon: 'https://drodt.info/favicon.png',
	copyright: `All rights reserved 2020-${new Date().getFullYear()}`,
	updated: new Date(), // TODO
	feedLinks: {
		json: 'https://drodt.info/feed?type=json',
		atom: 'https://drodt.info/feed?type=atom',
		rss: 'https://drodt.info/feed?type=rss'
	},
	author: {
		name: 'Daniel Drodt',
		email: 'daniel@drodt.info',
		link: 'https://drodt.info'
	}
});

for (const post of posts()) {
	if (post.metadata.isDraft) continue;
	const link = `https://drodt.info/blog/${post.slug}`;
	feed.addItem({
		title: post.metadata.title,
		link,
		id: link,
		date: new Date(`${post.metadata.date} UTC+2`),
		description: post.metadata.description,
		content: post.html
	});
}

export default feed;
