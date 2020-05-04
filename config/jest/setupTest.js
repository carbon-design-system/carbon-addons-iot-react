import 'jest-styled-components';

afterEach(() => {
  //   if (global.gc) global.gc()
});

beforeEach(() => {
  // Every test we write should have at least one assertion. If this fails, we need to look at the invoking test to ensure there's not a promise being swallowed or something.
  // Review this for more context: https://github.com/IBM/carbon-addons-iot-react/issues/1143#issuecomment-623577505
  expect.hasAssertions();
});
