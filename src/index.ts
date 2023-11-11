import { umdFooter, defaultOptions } from "./lib/constants";
import { getUmdBanner } from "./lib/getUmdBanner";
import type { Plugin } from "esbuild";
import type { UmdOptions } from "./declaration";

const umdWrapper = (customOptions: UmdOptions = {}) => {
  let options: UmdOptions = { ...defaultOptions, ...customOptions };

  const plugin: Plugin = {
    name: "umd-wrapper",
    setup(build) {
      const { initialOptions } = build;
      // @ts-ignore
      if (!["umd", "cjs"].includes(initialOptions.format)) {
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
    },
  };

  return plugin;
};

export default umdWrapper;
export { umdWrapper };
