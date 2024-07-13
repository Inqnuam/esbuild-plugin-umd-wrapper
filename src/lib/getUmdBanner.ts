import { alphabet } from "./constants";
const createWrapperWithLib = ({ depsKeys, depsValKey, amdLoader, lib, defineDeps, globalDeps, requireDeps, globalIdentifier }) => {
  return `(function (g, f) {
if ("object" == typeof exports && "object" == typeof module) {
module.exports = f(${requireDeps});
} else if ("function" == typeof ${amdLoader} && ${amdLoader}.amd) {
${amdLoader}("${lib}", ${defineDeps}, f);
} else if ("object" == typeof exports) {
exports["${lib}"] = f(${requireDeps});
} else {
g["${lib}"] = f(${globalDeps});
}
}(${globalIdentifier}, (${depsKeys}) => {
var exports = {};
var module = { exports };`.replace(/\n/g, "");
};

const createWrapper = ({ depsKeys, depsValKey, amdLoader, defineDeps, globalDeps, requireDeps, globalIdentifier }) => {
  return `(function (g, f) {
var hasExports = typeof exports === 'object';
if (typeof ${amdLoader} === "function" && ${amdLoader}.amd) {
${amdLoader}(${defineDeps}, f);
} else if (typeof module === "object" && module.exports) {
module.exports = f(${requireDeps});
} else {
var m = hasExports ? f(${requireDeps}) : f(${globalDeps});
var root = hasExports ? exports : g;
for(var i in m) root[i] = m[i];
}}(${globalIdentifier}, (${depsKeys}) => {
var exports = {};
var module = { exports };`.replace(/\n/g, "");;
};

export const getUmdBanner = ({ external, amdLoader, lib, globalIdentifier }) => {
  const defineDeps = external?.length ? `['${external.join("', '")}']` : "[]";
  const globalDeps = external?.map((x) => `g["${x}"]`).join(", ") ?? "";
  const requireDeps = external?.map((x) => `require('${x}')`).join(", ") ?? "";
  let deps = [];
  if (external) {
    deps = external.map((x, i) => {
      return {
        key: alphabet[i],
        val: x,
      };
    });
  }
  const depsKeys = deps.map((x) => x.key).join(", ");
  const depsValKey = deps.map((x) => `"${x.val}": ${x.key}`).join(", ");
  let options: any = {
    depsKeys,
    depsValKey,
    amdLoader,
    defineDeps,
    globalDeps,
    requireDeps,
    globalIdentifier,
  };
  if (lib) {
    options.lib = lib;
    return createWrapperWithLib(options);
  }

  return createWrapper(options);
};
