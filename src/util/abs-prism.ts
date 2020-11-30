import type { Languages } from "prismjs";

export const addABS = (langs: Languages) => {
  langs.abs = langs.extend("clike", {
    keyword: /\b(?:adds|after|assert|await|builtin|case|catch|class|core|data|def|delta|die|else|exception|export|extends|features|finally|from|get|hasField|hasInterface|hasMethod|if|implements|import|interface|in|let|local|modifies|module|new|null|original|product|productline|recover|removes|return|skip|suspend|this|throw|trait|try|type|uses)\b/,
    "class-name": /\b[A-Z]\w*\b/,
  });
};

export const addRABS = (langs: Languages) => {
  langs.rabs = langs.extend("abs", {
    keyword: [langs.abs.keyword as RegExp, /\b(?:struct|impl|for)\b/],
  });
};
