#!/usr/bin/env node

const fs = require('fs');

const coverage = JSON.parse(fs.readFileSync('./coverage-final.json'));

const fixedCoverage = {};
Object.keys(coverage).forEach((key) => {
  // /home/runner/work/carbon-addons-iot-react/carbon-addons-iot-react/packages/react/src/components/BarChartCard/BarChartCard.jsx
  // /__w/carbon-addons-iot-react/carbon-addons-iot-react/packages/react/src/components/BarChartCard/BarChartCard.jsx
  const fixedKey = key.replace('__w', 'home/runner/work');

  const value = coverage[key];
  value.path = fixedKey;
  fixedCoverage[fixedKey] = value;
});

fs.writeFileSync('coverage-final-fixed.json', JSON.stringify(fixedCoverage));
