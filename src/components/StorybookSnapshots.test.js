import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
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
        ) &&
        !e.includes(
          // Carbon issue - https://github.com/carbon-design-system/carbon/issues/3656
          'The prop `small` for Button has been deprecated in favor of `size`. Please use `size="small"` instead.'
        ) &&
        !e.includes(
          // Carbon issue - https://github.com/carbon-design-system/carbon/issues/3658, should be fixed in 10.4.2
          'Warning: Failed prop type: Invalid prop `aria-hidden` of type `boolean` supplied to `Icon`, expected `string`.'
        ) &&
        !e.includes(
          // https://github.com/carbon-design-system/carbon/pull/3933
          'The prop `success` for InlineLoading has been deprecated in favor of `status`. Please use `status="finished"` instead.'
        ) &&
        !e.includes(
          'Warning: The Toolbar component has been deprecated and will be removed in the next major release of `carbon-components-react`'
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
    storyKindRegex: /^(?!.*Experimental).*Watson\sIoT|.*Getting\sStarted/,
    test: multiSnapshotWithOptions(story => ({
      createNodeMock: element => {
        // https://github.com/storybookjs/storybook/tree/next/addons/storyshots/storyshots-core#using-createnodemock-to-mock-refs
        // fallback is to mock something, otherwise our refs are invalid

        // these stories require an input be nested within the ref, for compatibility with Carbon's TableToolbarSearch component
        const storiesNeedingNestedInputRefs = [
          'Watson IoT|Table.minitable',
          'Watson IoT|Table.with simple search',
          'Watson IoT|Table.Stateful Example with row nesting',
          'Watson IoT|Table.Stateful Example with expansion',
          'Watson IoT|TileCatalog.with search',
          'Watson IoT|TableCard',
        ];
        if (
          storiesNeedingNestedInputRefs.includes(story.kind) ||
          storiesNeedingNestedInputRefs.includes(`${story.kind}.${story.name}`)
        ) {
          const div = document.createElement('div');
          div.className = 'from-initStoryshots-createNodeMock'; // to assist in debugging
          div.innerHTML = "<input type='text'></input>";
          return div;
        }

        // Needed for DatePicker refererence in carbon-components-react
        if (story.kind === 'Watson IoT|Dashboard Header') {
          const fragment = document.createDocumentFragment();
          const div = document.createElement('div');
          div.className = 'from-initStoryshots-createNodeMock'; // to assist in debugging
          fragment.appendChild(div);
          return fragment.childNodes;
        }

        if (element.type === 'input') {
          return document.createElement('input');
        }

        return document.createElement('div');
      },
    })),
  });

  afterAll(() => {
    spy.console.mockRestore();
    ReactDOM.findDOMNode = realFindDOMNode;
  });
  afterEach(() => {
    global.Date = RealDate;
  });
});
