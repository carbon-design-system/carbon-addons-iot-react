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
