import React from 'react';
import ReactDOM from 'react-dom';
import { act, isDOMComponent } from 'react-dom/test-utils';

import ImageHotspots, { calculateImageHeight, calculateImageWidth } from './ImageHotspots';

describe('ImageHotspots', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('shows loading', () => {
    act(() => {
      ReactDOM.render(<ImageHotspots />, container);
    });
    const image = container.querySelector('img');
    expect(isDOMComponent(image)).toBe(false);
  });
  test('calculateImageHeight', () => {
    // landscape test where image is bigger picks container height
    expect(
      calculateImageHeight(
        { orientation: 'landscape', ratio: 2, width: 300, height: 200 },
        'landscape',
        3
      )
    ).toEqual(100);
    // landscape container is bigger
    expect(
      calculateImageHeight(
        { orientation: 'landscape', ratio: 2, width: 300, height: 200 },
        'landscape',
        1
      )
    ).toEqual(200);
  });
  test('calculateImageWidth', () => {
    // landscape test where image is bigger picks container height
    expect(
      calculateImageWidth(
        { orientation: 'landscape', ratio: 2, width: 300, height: 200 },
        'landscape',
        3
      )
    ).toEqual(300);
    // landscape container is bigger
    expect(
      calculateImageWidth(
        { orientation: 'landscape', ratio: 2, width: 300, height: 200 },
        'landscape',
        1
      )
    ).toEqual(200);
  });
});
