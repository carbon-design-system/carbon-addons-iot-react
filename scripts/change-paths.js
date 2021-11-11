#!/usr/bin/env node
const fs = require('fs');

const coverage = JSON.parse(fs.readFileSync('./coverage-final.json'));

const fixedCoverage = {};
Object.keys(coverage).forEach((key) => {
  const fixedKey = key.replace('__w', 'home/runner/work');
  const value = coverage[key];
  value.path = fixedKey;
  fixedCoverage[fixedKey] = value;
});

fs.writeFileSync('coverage-final.json', JSON.stringify(fixedCoverage));
