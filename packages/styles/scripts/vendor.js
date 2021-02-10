const { dirname, join } = require("path");
const { copy, ensureDir } = require("fs-extra");
const glob = require("glob");
const { rejects } = require("assert");

const promiseGlob = (pattern, opts) => new Promise((resolve, reject) => {
  glob(pattern, opts, (err, matches) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(matches);
  });
});

const main = async () => {
  // list of packages we want to vendor
  const packages = [
    "@carbon/themes",
    "@carbon/charts",
    "@carbon/motion",
    "carbon-components",
    "react-grid-layout",
    "react-resizable"
  ];

  // pattern for files we want to vendor from each package
  const pattern = "**/*.+(scss|css)";

  const packageAndPaths = packages.map(package => {
    return {
      name: package,
      path: dirname(require.resolve(`${package}/package.json`))
    }
  });

  await ensureDir("src/vendor");

  for (const packageInfo of packageAndPaths) {
    console.log(`vendoring: ${packageInfo.name}`);
    // glob the files we actually want so we aren't shipping a huge package
    const matches = await promiseGlob(pattern, { cwd: packageInfo.path });

    for (const match of matches) {
      await copy(join(packageInfo.path, match), `src/vendor/${packageInfo.name}/${match}`);
    }
  }
};

main().catch(console.error);
