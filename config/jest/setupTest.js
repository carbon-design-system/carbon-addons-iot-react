import 'jest-styled-components';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

let aChecker;

async function toBeAccessible(node, label) {
  // We defer initialization of AAT as it seems to have a race condition if
  // we are running a test suite in node instead of jsdom. As a result, we only
  // initialize it if this matcher is called
  if (!aChecker) {
    aChecker = require('accessibility-checker');
  }

  let results = await aChecker.getCompliance(node, label);
  if (aChecker.assertCompliance(results.report) === 0) {
    return {
      pass: true,
    };
  } else {
    return {
      pass: false,
      message: () => aChecker.stringifyResults(results.report),
    };
  }
}

expect.extend({ toBeAccessible });

beforeEach(() => {
  // Every test we write should have at least one assertion. If this fails, we need to look at the invoking test to ensure there's not a promise being swallowed or something.
  // Review this for more context: https://github.com/IBM/carbon-addons-iot-react/issues/1143#issuecomment-623577505
  expect.hasAssertions();
});
