import esbuild from "esbuild";
import { umdWrapper } from "../dist/index.js";

await esbuild.build({
  entryPoints: ["./src/app.tsx", "./src/component.tsx", "./pages/*"],
  assetNames: "[name]",
  entryNames: "[name]",
  loader: { ".html": "copy" },
  resolveExtensions: [".html"],
  outdir: "dist",
  bundle: true,

  // doing UMD
  external: ["react", "react-dom/client"],
  format: "umd", // could also be "cjs"
  plugins: [umdWrapper()],
});

await esbuild.build({
  entryPoints: ["./src/anotherApp.tsx"],
  entryNames: "[name]",
  outdir: "dist",
  bundle: true,
  external: ["react", "react-dom/client", "./component"],
  format: "umd",
  plugins: [umdWrapper()],
});

await esbuild.build({
  entryPoints: ["./src/myLib.ts"],
  entryNames: "[name]",
  outdir: "dist",
  bundle: true,
  format: "umd",
  plugins: [umdWrapper({ libraryName: "libraryForGlobalScope", amdId: "libraryForAmdLoader" })],
});

await esbuild.build({
  entryPoints: ["./src/myLib.ts"],
  entryNames: "[name]-no-amdId",
  outdir: "dist",
  bundle: true,
  format: "umd",
  plugins: [umdWrapper({ libraryName: "libraryForGlobalScope", amdId: false })],
});

// Rebuild UMD output + minify
await esbuild.build({
  entryPoints: ["dist/*.js"],
  outdir: "dist/min",
  bundle: true,
  allowOverwrite: true,
  minify: true,
  format: "cjs",
  platform: "browser",
  external: ["react", "react-dom/client", "./component"],
});

const options = {
  entryPoints: ["./src/concurrent.ts"],
  entryNames: "[name]",
  outdir: "dist",
  bundle: true,
  format: "umd",
  plugins: [umdWrapper()],
};

// Not recommanded but still works
await Promise.all([esbuild.build(options), esbuild.build({ ...options, minify: true, outdir: "dist/min" })]);
