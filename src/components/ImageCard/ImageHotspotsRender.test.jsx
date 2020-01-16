import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ImageHotspots from './ImageHotspots';
import Landscape from './landscape.jpg';

beforeAll(() => {
  /**
   * react-testing-library causes an error when attempting to modify read-only
   * attributes such as offsetHeight and offsetWidth. These properties need to
   * be strictly set here to mock the image correctly
   *  */

  Object.defineProperty(HTMLImageElement.prototype, 'offsetHeight', {
    writable: true,
    configurable: true,
  });
  Object.defineProperty(HTMLImageElement.prototype, 'offsetWidth', {
    writable: true,
    configurable: true,
  });
});

afterAll(() => {
  // Remove the mock image attributes
  delete HTMLImageElement.prototype.offsetHeight;
  delete HTMLImageElement.prototype.offsetWidth;
});

describe('render tests for the image hotspots component', () => {
  test('minimap rendering', () => {
    const { getByAltText, queryByAltText, getByTitle } = render(
      <div style={{ maxWidth: '50px', maxHeight: '50px', width: '50px', height: '50px' }}>
        <ImageHotspots
          src={Landscape}
          alt="landscape"
          height={300}
          width={450}
          hideZoomControls={false}
        />
      </div>
    );

    const img = getByAltText('landscape');
    const imageLoadEvent = { target: { offsetWidth: 2000, offsetHeight: 2000 } };
    // Image should appear
    expect(img).toBeTruthy();
    // Minimap should not appear before drag starts
    expect(queryByAltText('Minimap')).toBeFalsy();
    // onImageLoad event needs to be fired to initialize the image
    fireEvent.load(img, imageLoadEvent);
    // Zoom needs to be triggered one time to enable dragging
    const zoomInBtn = getByTitle('Zoom in');
    fireEvent.click(zoomInBtn);
    fireEvent.mouseDown(img);
    // Minimap should appear once drag starts
    expect(queryByAltText('Minimap')).toBeTruthy();
    fireEvent.mouseUp(img);
    // Minimap should disappear once drag ends
    expect(queryByAltText('Minimap')).toBeFalsy();
  });
});
