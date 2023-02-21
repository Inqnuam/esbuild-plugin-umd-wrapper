import { alphabet } from "./constants";
const createWrapperWithLib = ({ depsKeys, depsValKey, amdLoader, lib, defineDeps, globalDeps, requireDeps }) => {
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
  }(this, (${depsKeys}) => {
var exports = {};
var module = { exports };
var __deps = {${depsValKey}};
var _umdReq = (mod)=> typeof require == "undefined" ? __deps[mod] : require(mod);`;
};

const createWrapper = ({ depsKeys, depsValKey, amdLoader, defineDeps, globalDeps, requireDeps }) => {
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
  }}(typeof self !== 'undefined' ? self : this, (${depsKeys}) => {
var exports = {};
var module = { exports };
var __deps = {${depsValKey}};
var _umdReq = (mod)=> typeof require == "undefined" ? __deps[mod] : require(mod);`;
};

export const getUmdBanner = ({ external, amdLoader, lib }) => {
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
  };
  if (lib) {
    options.lib = lib;
    return createWrapperWithLib(options);
  }

  return createWrapper(options);
};
