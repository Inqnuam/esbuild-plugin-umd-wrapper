import esbuild from "esbuild";
import { execSync } from "child_process";
const shouldWatch = process.argv.includes("watch");
const finalizer = {
  name: "finalizer",
  setup(build) {
    build.onEnd((res) => {
      execSync("tsc");
    });
  },
};

const ctx = await esbuild[shouldWatch ? "context" : "build"]({
  entryPoints: ["./src/index.ts"],
  outfile: "./dist/index.js",
  platform: "node",
  target: "es6",
  format: "cjs",
  bundle: true,
  minify: !shouldWatch,
  plugins: [finalizer],
});

if (shouldWatch) {
  await ctx.watch();
}
