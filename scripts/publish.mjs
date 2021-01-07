import fs from "fs";

function extractFrontmatter(markdown) {
  const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
  const frontMatter = match[1];

  const metadata = {};
  frontMatter.split("\n").forEach((pair) => {
    const colonIndex = pair.indexOf(":");
    metadata[pair.slice(0, colonIndex).trim()] = pair
      .slice(colonIndex + 1)
      .trim();
  });

  return metadata;
}

const today = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const nMonth = month < 10 ? `0${month}` : month;
  const day = now.getUTCDate();
  const nDay = day < 10 ? `0${day}` : day;
  return `${year}-${nMonth}-${nDay}`;
};

const publish = (title) => {
  const posts = fs.readdirSync("content/blog").map((file) => {
    const match = /^(.+)\.md$/.exec(file);
    if (!match) throw new Error(`Invalid filename '${file}'`);

    const [, slug] = match;

    const fileContent = fs.readFileSync(`content/blog/${file}`, "utf-8");
    const metadata = extractFrontmatter(fileContent);

    return { metadata, slug };
  });

  const drafts = posts.filter((p) => p.metadata.date === undefined);
  if (drafts.length > 0) {
    console.log(`Found drafts:
${drafts.map((d) => `${d.slug}`).join("\n")}
`);
  } else {
    console.log(`Found no drafts!`);
    process.exit(1);
  }

  const possibleResults = drafts.filter((d) => d.slug.startsWith(title));

  if (possibleResults.length === 0) {
    console.log(`Found no draft with title ${title}!`);
    process.exit(1);
  } else if (possibleResults.length > 1) {
    console.log(`Found more than one draft with title ${title}!`);
    process.exit(1);
  }

  const result = drafts[0];
  const fileContent = fs.readFileSync(
    `content/blog/${result.slug}.md`,
    "utf-8",
  );

  const replaced = fileContent.replace(
    /^\s*(---\r?\n[\s\S]+?\r?\n)---/,
    `$1date: ${today()}\n---`,
  );

  fs.writeFileSync(`content/blog/${result.slug}.md`, replaced);

  console.log("Done!");
};

const [, , ...args] = process.argv;

if (args.length !== 1) {
  console.log(`Expected exactly one arg, got ${args.length}
${args}`);
  process.exit(1);
}

publish(args[0]);
