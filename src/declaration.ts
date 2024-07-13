export interface UmdOptions {
  libraryName?: string;
  external?: "inherit" | string[];
  amdLoaderName?: string;
  globalIdentifier?: string;
}
