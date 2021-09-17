import React from 'react';
import addons, { mockChannel } from '@storybook/addons';
import MockDate from 'mockdate';

// To support storybooks inside jest
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';

// Needed so that any component that uses sizeme can be jest tested
import sizeMe from 'react-sizeme';

import dayjs from '../../src/utils/dayjs';

addons.setChannel(mockChannel());

const enzyme = require.requireActual('enzyme');
const Adapter = require.requireActual('enzyme-adapter-react-16');

registerRequireContextHook();

enzyme.configure({ adapter: new Adapter() });

// https://github.com/facebook/react/issues/14050
// Needed to support useEffect in jest tests
React.useEffect = React.useLayoutEffect;

if (typeof window !== 'undefined') {
  // Needed to use d3 in tests
  class SVGPathElement extends HTMLElement {}

  window.SVGPathElement = SVGPathElement;

  window.Element.prototype.getComputedTextLength = function () {
    return 200;
  };
  // Needed to mock resize observer
  class ResizeObserver {
    observe() {
      // do nothing
    }

    unobserve() {
      // do nothing
    }
  }

  window.ResizeObserver = ResizeObserver;
  // Mock the scroll function as its not implemented in jsdom
  // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
}

sizeMe.noPlaceholders = true;

// Force the timezone to be the same everywhere
dayjs.tz.setDefault('America/Chicago');
Date.prototype.getTimezoneOffset = () => 300; // mock date offset
MockDate.set(1537538254000);
Date.prototype.getLocaleString = () => 'Mock Date!';

// must check for window first or SSR tests will fail
if (typeof window !== 'undefined' && typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: function noop() {} });
}
