'use strict';
import React from 'react';

const enzyme = require.requireActual('enzyme');
const Adapter = require.requireActual('enzyme-adapter-react-16');

// To support storybooks inside jest
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
registerRequireContextHook();

enzyme.configure({ adapter: new Adapter() });

// Needed to support enzyme mount
require('./setupJSDom');

// https://github.com/facebook/react/issues/14050
// Needed to support useEffect in jest tests
React.useEffect = React.useLayoutEffect;

// Needed to use d3 in tests
class SVGPathElement extends HTMLElement {}

window.SVGPathElement = SVGPathElement;

// Needed so that any component that uses sizeme can be jest tested
import sizeMe from 'react-sizeme';

sizeMe.noPlaceholders = true;

// Force the timezone to be the same everywhere
const moment = require.requireActual('moment-timezone');
moment.fn.local = moment.fn.utc; // mock the local function to return utc
jest.doMock('moment', () => {
  moment.tz.setDefault('America/Chicago');
  return moment;
});
Date.prototype.getTimezoneOffset = () => 300; // mock date offset
Date.now = jest.fn(() => 1537538254000); // mock internal date
Date.prototype.getLocaleString = () => 'Mock Date!';
