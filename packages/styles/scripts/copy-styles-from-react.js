const { dirname, join, sep } = require('path');
const { copy, readFile, writeFile, ensureDir } = require('fs-extra');
const { promiseGlob, packagePath } = require('@ai-apps/monorepo-utils');

const reactPath = packagePath('carbon-addons-iot-react');

const main = async () => {
  console.log('syncing styles from react');
  const matches = await promiseGlob('src/**/*.+(scss|css)', {
    cwd: reactPath,
  });

  const filesToWrite = [];

  for (const match of matches) {
    const source = join(reactPath, match);
    const dest = join(__dirname, '../', match);
    // the depth of the file is the base path ignoring the root src directory
    // so the depth of src/components/Accordion/_accordion.scss would be 2
    // (components/Accordion being the levels we have to go up, so 2 `../` are required)
    const depth = dirname(match).split(sep).length - 1;
    // turns the depth into the right number of `../`s needed to resolve the vendor files
    let relativeTraversal = '';
    for (let i = 0; i < depth; i++) {
      relativeTraversal += '../';
    }

    await ensureDir(dirname(dest));

    const filePromise = readFile(source, { encoding: 'UTF-8' })
      .then((fileContents) => {
        return fileContents.replace(
          /(@import.*)(~)(.*)/g,
          (match, importStatement, tilde, rest) =>
            `${importStatement}${relativeTraversal}vendor/${rest}`
        );
      })
      .then((newContents) => {
        return writeFile(dest, newContents, { encoding: 'UTF-8' });
      });
    filesToWrite.push(filePromise);
  }

  await Promise.all(filesToWrite);
  console.log('done!');
};

main().catch(console.error);
