import type { Plugin } from 'unified';
import { matter } from 'vfile-matter';

/**
 * Plugin to parse YAML frontmatter and expose it at `file.data.matter`.
 */
const remarkYamlMatter: Plugin<Array<void>> = function () {
	return function (_, file) {
		matter(file);
	};
};

export default remarkYamlMatter;
