const { spawn } = require('child_process');
const { resolve } = require('path');

const storyPackages = ['angular', 'react'];

let packageToRun = process.argv[2];

if (!packageToRun) {
  console.log(`no package specified, defaulting to react`);
  packageToRun = 'react';
}

if (!storyPackages.includes(packageToRun)) {
  console.log(`package '${packageToRun}' not found in '${storyPackages}' defaulting to react`);
  packageToRun = 'react';
}

spawn('yarn', ['storybook'], { stdio: 'inherit', cwd: resolve('packages', packageToRun) });
