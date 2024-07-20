const createGlobalRequire = (knownDepNames: string) => {
  if (!knownDepNames) {
    return "";
  }
  return `
var gN={${knownDepNames}},
gReq=function(r){var mod = r in gN ? g[gN[r]] : g[r]; return mod };`;
};

const createAmdRequire = ({ depsValKey }) => {
  return `var d={${depsValKey}},
r=function(m){
if(m in d) return d[m];
if(typeof require=="function") return require(m);
throw new Error("Cannot find module '"+m+"'")
};
return f(r)`;
};

const createAmdFactoryWrapper = ({ hasDependencies, depsKeys, depsValKey }) => {
  if (!hasDependencies) {
    return "f";
  }
  return `function(${depsKeys}){${createAmdRequire({ depsValKey })}}`;
};

const createWrapperWithLib = ({ depsKeys, depsValKey, amdLoader, lib, defineDeps, globalIdentifier, knownDepNames, amdId }) => {
  const gReq = createGlobalRequire(knownDepNames);
  const hasDependencies = defineDeps != "[]";
  const argRequireIdentifer = !hasDependencies ? "" : "require";
  const amdDeps = hasDependencies ? `${defineDeps},` : "";
  let amdIdentifier = "";

  if (amdId) {
    amdIdentifier = `"${amdId}",`;
  } else if (lib && amdId !== false) {
    amdIdentifier = `"${lib}",`;
  }

  return `(function(g,f){
if(typeof exports=="object"&&typeof module<"u"){
module.exports=f(${argRequireIdentifer})
}else if("function"==typeof ${amdLoader} && ${amdLoader}.amd){
${amdLoader}(${amdIdentifier}${amdDeps}${createAmdFactoryWrapper({ hasDependencies, depsValKey, depsKeys })})
}else {
${gReq}
g["${lib}"]=f(${gReq == "" ? "" : "gReq"})
}
}(${globalIdentifier},function(${argRequireIdentifer}){
var exports={};
var __exports=exports;
var module={exports};`;
};

const createWrapper = ({ depsKeys, depsValKey, amdLoader, defineDeps, globalIdentifier, knownDepNames, amdId }) => {
  const gReq = createGlobalRequire(knownDepNames);
  const hasDependencies = defineDeps != "[]";
  const argRequireIdentifer = !hasDependencies ? "" : "require";
  const amdDeps = hasDependencies ? `${defineDeps},` : "";
  const amdIdentifier = amdId ? `"${amdId}",` : "";

  return `(function(g,f){
if(typeof ${amdLoader}=="function"&&${amdLoader}.amd){
${amdLoader}(${amdIdentifier}${amdDeps}${createAmdFactoryWrapper({ hasDependencies, depsKeys, depsValKey })})
}else if(typeof exports=="object" && typeof module<"u"){module.exports=f(${argRequireIdentifer})}else{
${gReq}
var m=f(${gReq == "" ? "" : "gReq"});
for(var i in m) g[i]=m[i]
}}(${globalIdentifier},function(${argRequireIdentifer}){
var exports={};
var __exports=exports;
var module={exports};`;
};

export const getUmdBanner = ({ external, amdLoader, lib, globalIdentifier, dependencyNames, amdId }) => {
  const defineDeps = external?.length ? `["${external.join('","')}"]` : "[]";
  let deps = [];

  let depNames = {};
  if (external) {
    deps = external.map((x, i) => {
      depNames[x] = x;
      return {
        key: `_d_${i}`,
        val: x,
      };
    });
  }
  depNames = { ...depNames, ...dependencyNames };

  const depsKeys = deps.map((x) => x.key).join(",");
  const depsValKey = deps.map((x) => `"${x.val}": ${x.key}`).join(",");

  const knownDepNames = Object.keys(depNames)
    .filter((x) => external.includes(x))
    .map((x) => `"${x}":"${depNames[x]}"`)
    .join(",");

  const options: any = {
    depsKeys,
    depsValKey,
    amdLoader,
    defineDeps,
    globalIdentifier,
    knownDepNames,
    amdId,
  };
  if (lib) {
    options.lib = lib;
    return createWrapperWithLib(options).replace(/\n/g, "");
  }

  return createWrapper(options).replace(/\n/g, "");
};
