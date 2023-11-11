## Description

> An esbuild plugin to wrap your js into UMD format.

# Installation

```bash
yarn add -D esbuild-plugin-umd-wrapper
# or
npm install -D esbuild-plugin-umd-wrapper
```

## Usage

```js
const esbuild = require("esbuild");
const { umdWrapper } = require("esbuild-plugin-umd-wrapper");

esbuild
  .build({
    entryPoints: ["input.js"],
    outdir: "public",
    format: "umd", // or "cjs"
    bundle: true,
    plugins: [umdWrapper()],
  })
  .then((result) => console.log(result))
  .catch(() => process.exit(1));
```

### Customize the wrapper.

```js
const umdWrapperOptions = {
  libraryName: "myLib", // default is unset
  external: "inherit", // <= default
  amdLoaderName: "define" // <= default
}

// usual esbuild config
{
 ...
 plugins: [umdWrapper(umdWrapperOptions)],
 ...
}

```

---

## Notes

The plugin will be triggered only if esbuild `format` is set to "cjs" or "umd".
Before esbuild execution the plugin will set that option to "cjs".
By default `external` is inherited from your esbuild options. If you know what are you doing you can change that value to an array of strings. Ex:

```js
const umdWrapperOptions = {
  external: ["react", "react-dom", "classnames"],
};
```
