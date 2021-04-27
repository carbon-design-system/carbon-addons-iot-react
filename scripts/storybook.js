const { spawn } = require('child_process');
const { resolve } = require('path');
const arg = require('arg');

const args = arg({
  '--help': Boolean,
  '--build': Boolean,
});

if (args['--help']) {
  console.log(`
  storybook.js - monorepo helper to run storybook commands efficiently

  usage: node storybook.js [framework] [--build]

  By deafult the script will serve the react storybook.

  Flags:
  --build
    boolean flag. When passed will invoke build:storybook instead of storybook
  `);
  process.exit(0);
}

const storyPackages = ['angular', 'react'];

let packageToRun = args._[0];

if (!packageToRun) {
  console.log(`no package specified, defaulting to react`);
  packageToRun = 'react';
}

if (!storyPackages.includes(packageToRun)) {
  console.log(`package '${packageToRun}' not found in '${storyPackages}' defaulting to react`);
  packageToRun = 'react';
}

const runYarn = (command, packageToRun) => {
  const childProcess = spawn('yarn', [command], {
    stdio: 'inherit',
    cwd: resolve('packages', packageToRun),
  });
  childProcess.on('exit', () => {
    process.exit(0);
  });
};

if (args['--build']) {
  runYarn('build:storybook', packageToRun);
} else {
  runYarn('storybook', packageToRun);
}
