const { dirname } = require('path');

const packagePath = (packageName) => dirname(require.resolve(`${packageName}/package.json`));

module.exports = {
  packagePath,
};
