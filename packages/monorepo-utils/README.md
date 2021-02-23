# @ai-apps/monorepo-utils

As the monorepo grows a variety of custom tools and integrations are required. This (private!) package can be included in `devDependencies` and allows us to centralize and de-duplicate our utility tooling.

## Tools

[#](#vendor) **`vendor`/`vendorAsync`**

Vendors packages. `vendorAsync` returns a promise that will resolve when complete, `vendor` has no return value. Takes a config object that looks like:

```javascript
const defaultOptions = {
  // pattern for files we want to vendor from each package
  pattern: "**/*.+(scss|css)",
  // pattern(s) for files we want to ignore from the set of files matched by the `pattern`
  ignorePatterns: ["**/node_modules/**"],
  // list of packages we want to vendor
  packages: [],
  // where we want to store the packages we vendor
  destination: "src/vendor"
};
```

By using a pattern/file based vendoring strategy we can reduce the number of files we copy and ship. By default we only vendor css/scss files, a pattern of `**/*` would select every file.

Example usage:

```javascript
const { vendor } = require("@ai-apps/monorepo-utils");

vendor({
	packages: [
		"@ai-apps/styles"
	]
});
```
