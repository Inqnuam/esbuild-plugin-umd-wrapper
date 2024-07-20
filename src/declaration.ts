export interface UmdOptions {
  /** Module identifier used for both AMD loader and Global scope.
   *
   * This option attachs your module to global (ex: `window.myAwsomeLibrary`) and provides an id to AMD loader.
   *
   * If you need to define different identifier for AMD loader, use `amdId` option.
   */
  libraryName?: string;
  /**
   * External dependencies
   *
   * By default this value is inherited from your esbuild `external` option if provided.
   *
   * If you are using esbuild's `{packages: "external"}`, use this option to indicate external dependencies for your module.
   *
   * If you are using wildcard in your esbuild `external` option (ex: `{external: ["@aws-sdk/*"]}`), default `inherit` value may not produce expected output. 
   * Use this option to provide external dependency full path/name, example:
   * ```js
    esbuild.build({
      entryPoints: ["./src/app.ts"],
      outdir: "dist",
      format: "umd",
      external: ["@aws-sdk/*"],
      plugins: [umdWrapper({external: ["@aws-sdk/client-dynamodb", "@aws-sdk/client-sns"]})]
    })
   * ```
   * Another case when this option is useful is when you define an external dependecy in esbuild `external` but its never used in the code, example:
   * ```js
    esbuild.build({
      entryPoints: ["./src/app.ts", "./src/utils.ts"],
      outdir: "dist",
      format: "umd",
      external: ["react", "react-dom/client", "express", "ts-node"], // where "express" and "ts-node" are never used for your UMD output
      plugins: [umdWrapper({external: ["react", "react-dom/client"]})]
    })
   * ```
   * @see https://github.com/amdjs/amdjs-api/blob/master/AMD.md#dependencies-
   * @default "inherit"
   * */
  external?: "inherit" | string[];
  /** @default "define" */
  amdLoaderName?: string;
  /**
   * If `amdId` is not provided, `libraryName` will be used when provided.
   *
   * If `libraryName` is provided AND `amdId` is `false`, your module will not have AMD id
   * but will still be accessible from global scope using `libraryName`.
   *
   * @see https://github.com/amdjs/amdjs-api/blob/master/AMD.md#id-
   * @default undefined
   */
  amdId?: string | false | undefined;
  /**
   * `this` value in Global Context.
   * Default value should work in all JS runtimes
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this#global_context
   * @example "window"
   *
   */
  globalIdentifier?: string;
  /**
   * Help UMD wrapper to map external dependency paths to global scope variables
   * @default
   * ```json
   * {
   *    "react": "React",
   *    "react-dom": "ReactDOM",
   *    "react-dom/client": "ReactDOM",
   *    "jquery": "jQuery",
   *    "lodash": "_",
   *    "underscore": "_",
   *    "cropperjs": "Cropper",
   *    "@popperjs/core": "Popper",
   *    "backbone": "Backbone",
   * }
   * ``` */
  globals?: {
    [packagePath: string]: string;
  };
}
