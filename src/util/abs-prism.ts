import type { Languages } from "prismjs";

export const addABS = (langs: Languages) => {
  langs.abs = langs.extend("clike", {
    keyword: /(?:adds|after|assert|await|builtin|case|catch|class|core|data|def|delta|die|else|exception|export|extends|features|finally|from|get|hasField|hasInterface|hasMethod|if|implements|import|in|interface|let|local|modifies|module|new|null|original|product|productline|recover|removes|return|skip|suspend|this|throw|trait|try|type|uses)/,
  });
};
