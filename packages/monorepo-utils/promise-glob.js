const glob = require('glob');

const promiseGlob = (pattern, opts) =>
  new Promise((resolve, reject) => {
    glob(pattern, opts, (err, matches) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(matches);
    });
  });

module.exports = {
  promiseGlob,
};
