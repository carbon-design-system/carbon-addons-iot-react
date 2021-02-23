const { dirname, join } = require("path");
const { copy, emptyDir } = require("fs-extra");
const glob = require("glob");

const promiseGlob = (pattern, opts) => new Promise((resolve, reject) => {
  glob(pattern, opts, (err, matches) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(matches);
  });
});

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

const vendorAsync = async (options) => {
  const finalOptions = Object.assign({}, defaultOptions, options);

  const {
    packages,
    pattern,
    ignorePatterns,
    destination
  } = finalOptions;

  const packageAndPaths = packages.map(package => {
    return {
      name: package,
      path: dirname(require.resolve(`${package}/package.json`))
    }
  });

  await emptyDir(destination);

  for (const packageInfo of packageAndPaths) {
    console.log(`vendoring: ${packageInfo.name}`);
    // glob the files we actually want so we aren't shipping a huge package
    const matches = await promiseGlob(pattern, {
      cwd: packageInfo.path,
      ignore: ignorePatterns
    });

    for (const match of matches) {
      await copy(join(packageInfo.path, match), `${destination}/${packageInfo.name}/${match}`);
    }
  }
};

const vendor = (options) => {
  vendorAsync(options).catch(console.error);
};

module.exports = {
  vendor,
  vendorAsync
};
