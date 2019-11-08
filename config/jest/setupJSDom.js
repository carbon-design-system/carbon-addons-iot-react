/** optional file that can be imported if certain testcases need to manage their own JSDOM */
const { JSDOM } = require('jsdom');
const d3 = require('d3');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
const { window } = jsdom;

window.d3 = d3.select(window.document); //get d3 into the dom

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.addEventListener = () => {};
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};
copyProps(window, global);
