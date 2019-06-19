import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots';
import ReactDOM from 'react-dom';
// Needed to give more information about the styled component differences in the jest snapshots
import 'jest-styled-components';

const realFindDOMNode = ReactDOM.findDOMNode;
const RealDate = Date;
function mockDate(isoDate) {
  global.Date = class extends RealDate {
    constructor() {
      super();
      return new RealDate(isoDate);
    }
  };
}

describe(`Storybook Snapshot tests and console checks`, () => {
  const spy = {};
  beforeAll(done => {
    ReactDOM.findDOMNode = jest.fn(); // needed for this issue: https://github.com/facebook/react/issues/7371
    // TODO: remove once carbon PR is merged
    spy.console = jest.spyOn(console, 'error').mockImplementation(e => {
      if (
        !e.includes(
          'The pseudo class ":first-child" is potentially unsafe when doing server-side rendering. Try changing it to ":first-of-type".'
        ) &&
        !e.includes('Warning: Received `true` for a non-boolean attribute `loading`.') &&
        !e.includes('Warning: Function components cannot be given refs.') &&
        !e.includes(
          // workaround storybook console error with styled components
          'Warning: Failed prop type: Invalid prop `type` of type `object` supplied to `PropTable`, expected `function'
        ) &&
        !e.includes(
          // workaround storybook console error with styled components
          'prop type `element` is invalid; it must be a function, usually from the `prop-types` package, but received `undefined`'
        ) &&
        !e.includes(
          // workaround storybook console error with styled components
          'Warning: Failed prop type: Invalid prop `type` of type `object` supplied to `TableComponent`, expected `function`'
        ) &&
        !e.includes(
          // workaround storybook console error with styled components
          'Warning: Failed prop type: The prop `children` is marked as required in `Td`, but its value is `null`.'
        )
      ) {
        done.fail(e);
      }
    });

    done();
  });

  beforeEach(() => {
    mockDate('2018-10-28T12:34:56z');
    jest.setTimeout(15000);
  });
  initStoryshots({
    storyKindRegex: /^((?!.*?Experimental).)*$/,
    test: snapshotWithOptions({
      createNodeMock: () =>
        // fallback is to mock something, otherwise our refs are invalid
        document.createElement('div'),
    }),
  });

  afterAll(() => {
    spy.console.mockRestore();
    ReactDOM.findDOMNode = realFindDOMNode;
  });
  afterEach(() => {
    global.Date = RealDate;
  });
});
