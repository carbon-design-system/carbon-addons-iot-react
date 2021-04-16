const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const srcPath = resolve('package.json');
const distPath = resolve('dist/package.json');

const srcPackageJson = JSON.parse(readFileSync(srcPath));
const distPackageJson = JSON.parse(readFileSync(distPath));

distPackageJson['version'] = srcPackageJson['version'];

writeFileSync(distPath, JSON.stringify(distPackageJson, null, 2));
