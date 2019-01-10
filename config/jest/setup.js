'use strict';

require('../polyfills');

const enzyme = require.requireActual('enzyme');
const Adapter = require.requireActual('enzyme-adapter-react-16');

// To support storybooks inside jest
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
registerRequireContextHook();

jest.unmock('promise');
jest.unmock('whatwg-fetch');
jest.unmock('object-assign');

enzyme.configure({ adapter: new Adapter() });

/*const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(
      prop =>
        typeof target[prop] === 'undefined' &&
        (prop !== 'localStorage' && prop !== 'sessionStorage') // skip these so we can really set them
    )
    .reduce(
      (result, prop) => ({
        ...result,
        [prop]: Object.getOwnPropertyDescriptor(src, prop),
      }),
      {}
    );
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

let store = {};
const mockLocalStorage = {
  getItem: key => store[key],
  setItem: (key, value) => {
    store[key] = value;
  },
  clear: () => {
    store = {};
  },
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

let sessionStore = {};
const mockSessionStorage = {
  getItem: key => sessionStore[key],
  setItem: (key, value) => {
    sessionStore[key] = value;
  },
  clear: () => {
    sessionStore = {};
  },
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

enzyme.configure({ adapter: new Adapter() });
global.fetch = require('jest-fetch-mock');

ReactDOM.createPortal = node => node; // needed for this issue: https://github.com/reactjs/react-modal/issues/553

// https://gist.github.com/bbshih/1cac2e30e5884102a66a07fbe464b50c
const moment = require.requireActual('moment-timezone');
moment.fn.local = moment.fn.utc; // mock the local function to return utc
jest.doMock('moment', () => {
  moment.tz.setDefault('America/Chicago');
  return moment;
});
Date.prototype.getTimezoneOffset = () => 300; // mock date offset
Date.now = jest.fn(() => 1537538254000); // mock internal date
Date.prototype.getLocaleString = () => 'Mock Date!';

*/
