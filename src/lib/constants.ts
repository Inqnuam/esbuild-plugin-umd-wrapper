import type { UmdOptions } from "../declaration";
export const defaultOptions: UmdOptions = {
  external: "inherit",
  libraryName: "",
  amdLoaderName: "define",
};
export const alphabet = [
  "__da",
  "__db",
  "__dc",
  "__dd",
  "__de",
  "__df",
  "__dg",
  "__dh",
  "__di",
  "__dj",
  "__dk",
  "__dl",
  "__dm",
  "__dn",
  "__do",
  "__dp",
  "__dq",
  "__dr",
  "__ds",
  "__dt",
  "__du",
  "__dv",
  "__dw",
  "__dx",
  "__dy",
  "__dz",
];

export const umdFooter = `if (typeof module.exports == "object" && typeof exports == "object") {
  module.exports = __copyProps(module.exports, exports);
}
return module.exports;
}))`;
