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
      if (!e.includes('Warning: Function components cannot be given refs.')) {
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
