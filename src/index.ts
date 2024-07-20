import { umdFooter, defaultOptions, knownDepNames, supportedFormats } from "./lib/constants";
import { getUmdBanner } from "./lib/getUmdBanner";
import type { Plugin } from "esbuild";
import type { UmdOptions } from "./declaration";

const invalidAmdId = new Error(`Boolean true is not a valid value for "amdId" option.\nOnly a string or boolean false is accepted.`);

const umdWrapper = (customOptions: UmdOptions = {}) => {
  let options: UmdOptions = { ...defaultOptions, ...customOptions };

  const plugin: Plugin = {
    name: "umd-wrapper",
    setup(build) {
      const { initialOptions } = build;

      // @ts-expect-error
      if (options.amdId === true) {
        throw invalidAmdId;
      }

      if (!supportedFormats.includes(initialOptions.format)) {
        return;
      }
      const external = options.external == "inherit" ? initialOptions.external ?? [] : Array.isArray(options.external) ? options.external : [];
      const umdBannerOptions = {
        external,
        amdLoader: options.amdLoaderName,
        lib: options.libraryName,
        globalIdentifier: options.globalIdentifier,
        dependencyNames: { ...knownDepNames, ...options.globals },
        amdId: options.amdId,
      };
      initialOptions.format = "cjs";

      let needsFooter = true;

      const umdBanner = getUmdBanner(umdBannerOptions);
      if (initialOptions.banner) {
        if (initialOptions.banner.js) {
          if (initialOptions.banner.js.startsWith(umdBanner) || initialOptions.banner.js.endsWith(umdBanner)) {
            needsFooter = false;
          } else {
            initialOptions.banner.js += umdBanner;
          }
        } else {
          initialOptions.banner.js = umdBanner;
        }
      } else {
        initialOptions.banner = {
          js: umdBanner,
        };
      }

      if (needsFooter) {
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
      }

      build.onEnd(() => {
        if (initialOptions.banner?.js?.includes(umdBanner)) {
          initialOptions.banner.js = initialOptions.banner.js.replace(umdBanner, "");
        }

        if (initialOptions.footer?.js?.includes(umdFooter)) {
          initialOptions.footer.js = initialOptions.footer.js.replace(umdFooter, "");
        }
      });
    },
  };

  return plugin;
};

export default umdWrapper;
export { umdWrapper };
