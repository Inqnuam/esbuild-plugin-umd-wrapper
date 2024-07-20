import type { UmdOptions } from "../declaration";
export const globalIdentifier = `typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : this`;

export const knownDepNames = {
  react: "React",
  "react-dom": "ReactDOM",
  "react-dom/client": "ReactDOM",
  jquery: "jQuery",
  lodash: "_",
  underscore: "_",
  cropperjs: "Cropper",
  "@popperjs/core": "Popper",
  backbone: "Backbone",
};

export const defaultOptions: UmdOptions = {
  external: "inherit",
  libraryName: "",
  amdLoaderName: "define",
  globalIdentifier,
  globals: knownDepNames,
};

export const umdFooter = `\nif(__exports != exports)module.exports = exports;return module.exports}));`;

export const supportedFormats = ["umd", "cjs"];
