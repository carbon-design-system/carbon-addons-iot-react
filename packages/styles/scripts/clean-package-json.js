const { readJSON, writeJSON } = require('fs-extra');

const main = async () => {
  const packageJson = await readJSON('package.json');
  packageJson.scripts = {};
  await writeJSON('package.json', packageJson, { spaces: 2 });
};

main().catch(console.error);
