const colors = [
  "7400b8",
  "6930c3",
  "5e60ce",
  "5390d9",
  "4ea8de",
  "48bfe3",
  "56cfe1",
  "80ffdb",
];

const mapping = new Map<string, string>();

let idx = 0;

export const color = (tag: string) => {
  if (mapping.has(tag)) return mapping.get(tag);
  let c = colors[idx];
  idx = (idx + 1) % colors.length;
  mapping.set(tag, c);
  return c;
};
