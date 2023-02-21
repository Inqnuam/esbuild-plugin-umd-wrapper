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
  var __cp = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
      for (let key of Object.getOwnPropertyNames(from)) {
        if (!Object.prototype.hasOwnProperty.call(to, key) && key !== except)
        Object.defineProperty(to, key, {
          get: () => from[key],
          enumerable: !(desc = Object.getOwnPropertyDescriptor(from, key)) || desc.enumerable,
        });
      }
    }
    return to;
  };
  module.exports = __cp(module.exports, exports);
}
return module.exports;
}))`;
