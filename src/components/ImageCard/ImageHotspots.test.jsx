import React from 'react';
import ReactDOM from 'react-dom';
import { act, isDOMComponent } from 'react-dom/test-utils';

import ImageHotspots, {
  calculateImageHeight,
  calculateImageWidth,
  startDrag,
  whileDrag,
  onImageLoad,
} from './ImageHotspots';

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

  it('start drag', () => {
    const mockSetCursor = jest.fn();
    startDrag(
      { clientX: 200, clientY: 300, preventDefault: jest.fn() },
      'image',
      {},
      mockSetCursor
    );
    expect(mockSetCursor).toHaveBeenCalledWith({ cursorX: 200, cursorY: 300, dragging: true });
  });
  it('while drag', () => {
    // Move the cursor 100 pixels in both the x and y directions
    const currentCursor = { cursorX: 100, cursorY: 100 };
    const dragEvent = { clientX: 200, clientY: 200, preventDefault: jest.fn() };
    const currentImage = { offsetX: 0, offsetY: 0, width: 2, height: 2 };
    const currentMinimap = { offsetX: 0, offsetY: 0, width: 1, height: 1 };
    const mockSetCursor = jest.fn();
    const mockSetImage = jest.fn();
    const mockSetMinimap = jest.fn();
    whileDrag(
      dragEvent,
      currentCursor,
      mockSetCursor,
      currentImage,
      mockSetImage,
      currentMinimap,
      mockSetMinimap
    );

    expect(mockSetCursor).toHaveBeenCalledWith({ cursorX: 200, cursorY: 200 });
    expect(mockSetImage).toHaveBeenCalledWith({ ...currentImage, offsetX: 100, offsetY: 100 });
    // Because the image is two times wider and taller than the minimap, the offset is reduced in ratio
    expect(mockSetMinimap).toHaveBeenCalledWith({ ...currentMinimap, offsetX: -50, offsetY: -50 });
  });
  it('onImageLoad', () => {
    const imageLoadEvent = { target: { offsetWidth: 200, offsetHeight: 100 } };
    // The container is 1/4 of the size of the image so it should be resizable
    const container = { orientation: 'landscape', width: 50, height: 25 };
    // No image, options, or minimap data
    const image = {};
    const minimap = { initialSize: 100 };
    const options = {};
    const mockSetImage = jest.fn();
    const mockSetMinimap = jest.fn();
    const mockSetOptions = jest.fn();
    onImageLoad(
      imageLoadEvent,
      container,
      image,
      mockSetImage,
      minimap,
      mockSetMinimap,
      options,
      mockSetOptions
    );
    expect(mockSetImage).toHaveBeenCalledWith(
      expect.objectContaining({
        scale: 1,
        ratio: 2,
        offsetX: 0,
        initialWidth: 200,
        initialHeight: 100,
        width: 50,
        height: 25,
      })
    );
    expect(mockSetMinimap).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 100,
        guideWidth: 100,
        height: 50,
        guideHeight: 50,
      })
    );
    expect(mockSetOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        draggable: false,
        resizable: true,
        hideZoomControls: false,
        hideMinimap: false,
      })
    );
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
