const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["./src/index.ts"],
  outfile: "./dist/index.js",
  platform: "node",
  target: "es6",
  format: "cjs",
  watch: process.env.DEV && {
    onRebuild: (error, result) => {
      console.log("Rebuild !");
    },
  },
  minify: !process.env.DEV,
});
