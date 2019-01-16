'use strict';

const enzyme = require.requireActual('enzyme');
const Adapter = require.requireActual('enzyme-adapter-react-16');

// To support storybooks inside jest
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
registerRequireContextHook();

enzyme.configure({ adapter: new Adapter() });

// Needed to support enzyme mount
require('./setupJSDom');
