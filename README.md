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
    entryPoints: ["src/input.js"],
    outdir: "dist",
    bundle: true,
    format: "umd", // or "cjs"
    plugins: [umdWrapper()],
  })
  .then((result) => console.log(result))
  .catch(() => process.exit(1));
```

### Customize the wrapper.

See [all options](https://github.com/Inqnuam/esbuild-plugin-umd-wrapper/blob/main/src/declaration.ts).

```js
esbuild.build({
  entryPoints: ["src/input.js"],
  outdir: "dist",
  bundle: true,
  format: "umd", // or "cjs"
  plugins: [umdWrapper({ libraryName: "myLibrary" })],
});
```

Wrapper options will be applied for all `entryPoints`.

---

## Notes

The plugin will be triggered only if esbuild `format` is set to "cjs" or "umd".  
Before esbuild execution the plugin will set that option to "cjs".

## Known Issues

Internally the wrapper plugin uses esbuild's `banner` and `footer` options to create UMD.  
In consequence running multiple esbuild builds concurrently reusing the same Build option object references _MAY_ produce unexpected build output
Ex:

```js
const options = {
  entryPoints: ["src/input.js"],
  outdir: "dist",
  bundle: true,
  format: "umd",
  plugins: [umdWrapper({ libraryName: "myLibrary" })],
};

// ❌ avoid this
await Promise.all([esbuild.build(options), esbuild.build({ ...options, minify: true, outdir: "dist/min" })]);
```

```js
// ❌ avoid this
esbuild.build(options);
esbuild.build({ ...options, minify: true, outdir: "dist/min" });
```

```js
// ✅ Its better
await esbuild.build(options);
await esbuild.build({ ...options, minify: true, outdir: "dist/min" });
```

---

> When I use `export default myFunc`, resulting output is not directly callable!  
> Instead it's an object `{__esModule: true, default: myFunc}`

This is not a bug, and it's not related to umd-wrapper-plugin.  
This is how esbuild transpiles `export default` to CJS.

As a workaround use `exports = myFunc`.

---

### Examples

If you are not familiar with UMD, see usage examples in [test](test) directory.
