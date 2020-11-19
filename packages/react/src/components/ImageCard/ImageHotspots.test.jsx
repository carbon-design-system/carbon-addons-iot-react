import React from 'react';
import ReactDOM from 'react-dom';
import { act, isDOMComponent } from 'react-dom/test-utils';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

import landscape from './landscape.jpg';
import ImageHotspots, {
  calculateImageHeight,
  calculateImageWidth,
  startDrag,
  whileDrag,
  onImageLoad,
  zoom,
  onAddHotspotPosition,
} from './ImageHotspots';

const getHotspots = () => {
  return [
    {
      x: 10,
      y: 20,
      content: <span>Hotspot1</span>,
      icon: 'warning',
      color: 'white',
      width: 20,
      height: 20,
    },
    {
      x: 50,
      y: 10,
      content: <span>Hotspot2</span>,
      icon: 'warning',
    },
    {
      x: 30,
      y: 40,
      content: <span>Hotspot3</span>,
    },
    {
      x: 50,
      y: 60,
      content: <span>Hotspot4</span>,
      color: 'green',
    },
  ];
};
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
    expect(mockSetCursor).toHaveBeenCalledWith({
      cursorX: 200,
      cursorY: 300,
      dragPrepared: false,
      dragging: true,
    });
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
    expect(mockSetImage).toHaveBeenCalledWith({
      ...currentImage,
      offsetX: 100,
      offsetY: 100,
    });
    // Because the image is two times wider and taller than the minimap, the offset is reduced in ratio
    expect(mockSetMinimap).toHaveBeenCalledWith({
      ...currentMinimap,
      offsetX: -50,
      offsetY: -50,
    });
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
  it('calculateImageHeight', () => {
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
  it('calculateImageWidth', () => {
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
  it('zoom', () => {
    const image = {
      initialWidth: 5000,
      width: 200,
      initialHeight: 5000,
      height: 200,
    };
    const minimap = {
      height: 10,
      width: 10,
    };
    const mockSetImage = jest.fn();
    const mockSetMinimap = jest.fn();
    const mockSetOptions = jest.fn();
    zoom(10, 10, {}, image, mockSetImage, minimap, mockSetMinimap, {}, mockSetOptions);
    // Since we're already at max zoom, the component shouldn't be updated at all
    expect(mockSetImage).not.toHaveBeenCalled();
    expect(mockSetMinimap).not.toHaveBeenCalled();
    expect(mockSetOptions).not.toHaveBeenCalled();
    // Reset the zoom level to 1 (i.e. fit to view)
    zoom(1, 10, {}, image, mockSetImage, minimap, mockSetMinimap, {}, mockSetOptions);
    expect(mockSetImage).toHaveBeenCalledWith(expect.objectContaining({ scale: 1, offsetX: 0 }));
    expect(mockSetMinimap).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 10,
        height: 10,
        offsetX: 0,
        offsetY: 0,
        guideHeight: 10,
        guideWidth: 10,
      })
    );
    expect(mockSetOptions).toHaveBeenCalledWith(expect.objectContaining({ draggable: false }));

    // Finally a real zoom request, we've waited long enough
    zoom(2, 10, {}, image, mockSetImage, {}, mockSetMinimap, {}, mockSetOptions);
    // TODO: perform assertions on the image/minimap positioning calculations at zoom time
    expect(mockSetImage).toHaveBeenCalled();
    expect(mockSetMinimap).toHaveBeenCalled();
    expect(mockSetOptions).toHaveBeenCalledWith(expect.objectContaining({ draggable: true }));
  });
  it('i18n string tests', () => {
    const i18nTest = {
      zoomIn: 'zoom-in',
      zoomOut: 'zoom-out',
      zoomToFit: 'zoom-to-fit',
    };

    const i18nDefault = ImageHotspots.defaultProps.i18n;

    render(<ImageHotspots i18n={i18nTest} />);
    expect(screen.getByTitle(i18nTest.zoomIn)).toBeInTheDocument();
    expect(screen.getByTitle(i18nTest.zoomOut)).toBeInTheDocument();
    expect(screen.queryByTitle(i18nDefault.zoomIn)).not.toBeInTheDocument();
    expect(screen.queryByTitle(i18nDefault.zoomOut)).not.toBeInTheDocument();
  });
  describe('isEditable', () => {
    it('triggers onSelectHotspot callback when hotspot is clicked', () => {
      const onSelectHotspot = jest.fn();

      const { rerender } = render(
        <ImageHotspots
          onAddHotspotPosition={() => {}}
          onSelectHotspot={onSelectHotspot}
          src={landscape}
          height={300}
          width={450}
          hotspots={getHotspots()}
          selectedHotspots={[]}
        />
      );
      const aHotspot = screen.getByTestId('hotspot-10-20');
      expect(aHotspot).toBeVisible();
      userEvent.click(within(aHotspot).getByRole('button'));
      expect(onSelectHotspot).not.toHaveBeenCalled();

      rerender(
        <ImageHotspots
          isEditable
          onAddHotspotPosition={() => {}}
          onSelectHotspot={onSelectHotspot}
          src={landscape}
          height={300}
          width={450}
          hotspots={getHotspots()}
          selectedHotspots={[]}
        />
      );
      const sameHotspot = screen.getByTestId('hotspot-10-20');
      expect(sameHotspot).toBeVisible();
      userEvent.click(within(sameHotspot).getByRole('button'));
      expect(onSelectHotspot).toHaveBeenCalledWith({ x: 10, y: 20 });
    });
    it('triggers callback when the image is clicked', () => {
      const onAddHotspotPosition = jest.fn();
      const testImageText = 'test-image';

      const { rerender } = render(
        <ImageHotspots
          alt={testImageText}
          onAddHotspotPosition={onAddHotspotPosition}
          onSelectHotspot={() => {}}
          src={landscape}
          height={300}
          width={450}
          hotspots={getHotspots()}
          selectedHotspots={[]}
        />
      );

      userEvent.click(screen.getByAltText(testImageText));
      expect(onAddHotspotPosition).not.toHaveBeenCalled();

      rerender(
        <ImageHotspots
          alt={testImageText}
          isEditable
          onAddHotspotPosition={onAddHotspotPosition}
          onSelectHotspot={() => {}}
          src={landscape}
          height={300}
          width={450}
          hotspots={getHotspots()}
          selectedHotspots={[]}
        />
      );

      userEvent.click(screen.getByAltText(testImageText));
      // We aren't more specific about the callback param here due to
      // difficulties setting the event.pageX & event.pageY in the test,
      // which are needed for getting the position of the click correct.
      expect(onAddHotspotPosition).toHaveBeenCalled();
    });
    it('calculates the proper percentage coordinates for image click', () => {
      const onAddHotspotPositionCallback = jest.fn();
      const event = {
        pageX: 100,
        pageY: 100,
        currentTarget: {
          offsetTop: 5,
          offsetLeft: 5,
          offsetParent: { offsetTop: 5, offsetLeft: 5 },
        },
      };
      const image = { width: 300, height: 450 };
      let updatedCursor;
      const setCursor = jest.fn().mockImplementation((func) => {
        updatedCursor = func({});
      });

      onAddHotspotPosition({
        event,
        image,
        setCursor,
        isEditable: true,
        callback: onAddHotspotPositionCallback,
      });

      expect(onAddHotspotPositionCallback).toHaveBeenCalledWith({
        x: 30,
        y: 20,
      });
      expect(updatedCursor).toEqual({ dragPrepared: false });
    });
  });
});
