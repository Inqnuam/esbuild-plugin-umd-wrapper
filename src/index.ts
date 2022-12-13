import path from "path";
import { readFile, stat, writeFile } from "fs/promises";
import { umdFooter, defaultOptions } from "./lib/constants";
import { getUmdBanner } from "./lib/getUmdBanner";
import type { Plugin } from "esbuild";
const fileCaches = new Map();

export interface UmdOptions {
  libraryName?: string;
  external?: "inherit" | string[];
  amdLoaderName?: string;
}
const umdWrapper = (customOptions: UmdOptions = {}) => {
  let options: UmdOptions = { ...defaultOptions, ...customOptions };

  const plugin: Plugin = {
    name: "umd-wrapper",
    setup(build) {
      const { initialOptions } = build;
      // @ts-ignore
      if (initialOptions.format !== "umd") {
        return;
      }
      const external = options.external == "inherit" ? initialOptions.external ?? [] : Array.isArray(options.external) ? options.external : [];
      const umdBannerOptions = {
        external,
        amdLoader: options.amdLoaderName,
        lib: options.libraryName,
      };
      initialOptions.format = "cjs";
      initialOptions.metafile = true;

      if (initialOptions.footer) {
        if (initialOptions.footer.js) {
          initialOptions.footer.js += umdFooter;
        } else {
          initialOptions.footer.js = umdFooter;
        }
      } else {
        initialOptions.footer = {
          js: umdFooter,
        };
      }

      const umdBanner = getUmdBanner(umdBannerOptions);
      if (initialOptions.banner) {
        if (initialOptions.banner.js) {
          initialOptions.banner.js += umdBanner;
        } else {
          initialOptions.banner.js = umdBanner;
        }
      } else {
        initialOptions.banner = {
          js: umdBanner,
        };
      }
      if (external) {
        build.onEnd(async (result) => {
          const outputs = Object.keys(result.metafile.outputs);

          for (const output of outputs) {
            const filePath = path.resolve(output);
            let cachedDate = fileCaches.get(filePath);
            const { mtimeMs } = await stat(filePath);

            if (!cachedDate || mtimeMs > cachedDate) {
              cachedDate = 0;
            }
            if (!cachedDate) {
              let fileContent = await readFile(filePath, { encoding: "utf-8" });

              for (const ext of external) {
                const regexPAt = new RegExp(`require\\("${ext}"\\)`, "g");
                fileContent = fileContent.replace(regexPAt, `_umdReq("${ext}")`);
              }
              await writeFile(filePath, fileContent);
              fileCaches.set(filePath, mtimeMs);
            }
          }
        });
      }
    },
  };

  return plugin;
};

export default umdWrapper;
