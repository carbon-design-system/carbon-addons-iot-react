import React from 'react';
import ReactDOM from 'react-dom';
import { act, isDOMComponent } from 'react-dom/test-utils';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { Error32 } from '@carbon/icons-react';

import landscape from './landscape.jpg';
import portrait from './portrait.jpg';
import ImageHotspots, {
  calculateImageHeight,
  calculateImageWidth,
  startDrag,
  whileDrag,
  onImageLoad,
  zoom,
  handleMouseUp,
} from './ImageHotspots';

const commonProps = {
  height: 100,
  width: 100,
};

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
      ReactDOM.render(<ImageHotspots {...commonProps} />, container);
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

    render(<ImageHotspots {...commonProps} i18n={i18nTest} />);
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
      userEvent.click(screen.getByAltText(testImageText), {
        ctrlKey: true,
      });
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

      userEvent.click(screen.getByAltText(testImageText), {
        ctrlKey: true,
      });
      // We aren't more specific about the callback param here due to
      // difficulties setting the event.pageX & event.pageY in the test,
      // which are needed for getting the position of the click correct.
      expect(onAddHotspotPosition).toHaveBeenCalled();

      // dumb tests for branching coverage on keyUp/Down handlers
      fireEvent.keyDown(screen.getByAltText(testImageText), {
        key: 'a',
        keyCode: 65,
      });
      fireEvent.keyUp(screen.getByAltText(testImageText), {
        key: 'a',
        keyCode: 65,
      });
      fireEvent.keyDown(screen.getByAltText(testImageText), {
        key: 'Control',
        keyCode: 17,
        ctrlKey: true,
      });
      fireEvent.keyUp(screen.getByAltText(testImageText), {
        key: 'Control',
        keyCode: 17,
      });
    });

    it('calculates the proper percentage coordinates for image click', () => {
      const onAddHotspotPositionCallback = jest.fn();
      const event = {
        pageX: 100,
        pageY: 100,
        clientX: 100,
        clientY: 100,
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

      handleMouseUp({
        event,
        image,
        cursor: { imageMousedown: true },
        setCursor,
        isEditable: true,
        callback: onAddHotspotPositionCallback,
      });

      expect(onAddHotspotPositionCallback).toHaveBeenCalledWith({
        x: 30,
        y: 20,
      });
      expect(updatedCursor).toEqual({
        dragPrepared: false,
        imageMousedown: false,
      });
    });
  });

  describe('with landscape Image mocking', () => {
    beforeEach(() => {
      jest.spyOn(Image.prototype, 'offsetWidth', 'get').mockImplementation(() => 2370);
      jest.spyOn(Image.prototype, 'offsetHeight', 'get').mockImplementation(() => 1150);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fit landscape images', () => {
      render(
        <ImageHotspots
          height={1150}
          width={2370}
          src={landscape}
          alt="landscape-test-image"
          displayOption="fit"
        />
      );

      const img = screen.getByAltText('landscape-test-image');
      act(() => {
        fireEvent.load(img);
      });
      expect(img).toHaveStyle({
        height: '100%',
      });
    });

    it('should show whole landscape images when no displayOption', () => {
      render(
        <ImageHotspots height={1150} width={2370} src={landscape} alt="landscape-test-image" />
      );

      const img = screen.getByAltText('landscape-test-image');
      act(() => {
        fireEvent.load(img);
      });
      expect(img).toHaveStyle({
        height: '1150px',
      });
    });
  });

  describe('with portrait Image mocking', () => {
    beforeEach(() => {
      jest.spyOn(Image.prototype, 'offsetWidth', 'get').mockImplementation(() => 1536);
      jest.spyOn(Image.prototype, 'offsetHeight', 'get').mockImplementation(() => 2048);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fit portrait images', () => {
      render(
        <ImageHotspots
          height={2048}
          width={1536}
          src={portrait}
          alt="portrait-test-image"
          displayOption="fit"
        />
      );

      const img = screen.getByAltText('portrait-test-image');
      act(() => {
        fireEvent.load(img);
      });
      expect(img).toHaveStyle({
        width: '100%',
      });
    });

    it('should show whole portrait images when no displayOption', () => {
      render(<ImageHotspots height={2048} width={1536} src={portrait} alt="portrait-test-image" />);

      const img = screen.getByAltText('portrait-test-image');
      act(() => {
        fireEvent.load(img);
      });
      expect(img).toHaveStyle({
        width: '1536px',
      });
    });

    it('should zoom in/out properly', () => {
      render(
        <ImageHotspots
          height={683}
          width={512}
          src={portrait}
          alt="portrait-test-image"
          hideHotspots
        />
      );

      const img = screen.getByAltText('portrait-test-image');
      act(() => {
        fireEvent.load(img);
      });
      expect(img).toHaveStyle({
        width: '512px',
      });
      userEvent.click(screen.getByTitle('Zoom in'));
      expect(img).toHaveStyle({ width: '1024px' });
      userEvent.click(screen.getByTitle('Zoom out'));
      expect(img).toHaveStyle({ width: '512px' });
      userEvent.click(screen.getByTitle('Zoom in'));
      expect(img).toHaveStyle({ width: '1024px' });
      userEvent.click(screen.getByLabelText('Zoom to fit'));
      expect(img).toHaveStyle({ width: '512px' });
    });

    it('should allow dragging the image around', () => {
      render(
        <ImageHotspots
          height={683}
          width={512}
          src={portrait}
          alt="portrait-test-image"
          hideHotspots
        />
      );

      const img = screen.getByAltText('portrait-test-image');
      act(() => {
        fireEvent.load(img);
      });

      userEvent.click(screen.getByTitle('Zoom in'));
      expect(img).toHaveStyle({
        top: '-341.3333333333333px',
        left: '-256px',
        width: '1024px',
      });

      let clientX = 256;
      let clientY = 341.5;
      fireEvent.mouseDown(img, {
        clientX,
        clientY,
      });
      let distance = 100;
      while (distance >= 0) {
        clientX -= 10;
        clientY -= 10;
        fireEvent.mouseMove(img, {
          clientX,
          clientY,
        });
        distance -= 10;
      }
      fireEvent.mouseUp(img, {
        clientX,
        clientY,
      });
      expect(img).toHaveStyle({
        top: '-441.3333333333333px',
        left: '-356px',
      });
      // clientX = 256;
      // clientY = 341.5;
      // fireEvent.mouseDown(img, {
      //   clientX,
      //   clientY,
      // });
      // distance = 1000;
      // while (distance >= 0) {
      //   clientX -= 10;
      //   clientY -= 10;
      //   fireEvent.mouseMove(img, {
      //     clientX,
      //     clientY,
      //   });
      //   distance -= 10;
      // }
      // fireEvent.mouseUp(img, {
      //   clientX,
      //   clientY,
      // });
      // expect(img).toHaveStyle({
      //   top: '-682px',
      //   left: '-512px',
      // });
    });

    it('should stop dragging if we leave the container', () => {
      render(
        <ImageHotspots
          height={683}
          width={512}
          src={portrait}
          alt="portrait-test-image"
          hideHotspots
        />
      );

      const img = screen.getByAltText('portrait-test-image');
      act(() => {
        fireEvent.load(img);
      });

      userEvent.click(screen.getByTitle('Zoom in'));
      expect(img).toHaveStyle({
        top: '-341.3333333333333px',
        left: '-256px',
        width: '1024px',
      });

      let clientX = 256;
      let clientY = 341.5;
      fireEvent.mouseDown(img, {
        clientX,
        clientY,
      });
      let distance = 1000;
      while (distance >= 0) {
        clientX -= 10;
        clientY -= 10;
        fireEvent.mouseMove(img, {
          clientX,
          clientY,
        });
        distance -= 10;
      }
      fireEvent.mouseLeave(img);
      expect(img).toHaveStyle({
        top: '-682px',
        left: '-512px',
      });
    });

    it('should stop dragging if we blur the container', () => {
      render(
        <ImageHotspots
          height={683}
          width={512}
          src={portrait}
          alt="portrait-test-image"
          hideHotspots
        />
      );

      const img = screen.getByAltText('portrait-test-image');
      act(() => {
        fireEvent.load(img);
      });

      userEvent.click(screen.getByTitle('Zoom in'));
      expect(img).toHaveStyle({
        top: '-341.3333333333333px',
        left: '-256px',
        width: '1024px',
      });

      let clientX = 256;
      let clientY = 341.5;
      fireEvent.mouseDown(img, {
        clientX,
        clientY,
      });
      let distance = 1000;
      while (distance >= 0) {
        clientX -= 10;
        clientY -= 10;
        fireEvent.mouseMove(img, {
          clientX,
          clientY,
        });
        distance -= 10;
      }
      fireEvent.blur(img);
      expect(img).toHaveStyle({
        top: '-682px',
        left: '-512px',
      });
    });
  });

  it('should show loading when isHotspotDataLoading is true', () => {
    render(
      <ImageHotspots
        height={2048}
        width={1536}
        src={portrait}
        alt="portrait-test-image"
        isHotspotDataLoading
        hotspots={getHotspots()}
      />
    );

    expect(screen.getByText('Loading hotspot data...')).toBeInTheDocument();
    expect(screen.getByText('Loading hotspot data...')).toBeVisible();
  });

  it('should show default HotspotContent element when hotspot.content is not a react element', () => {
    render(
      <ImageHotspots
        height={2048}
        width={1536}
        src={portrait}
        alt="portrait-test-image"
        hotspots={[
          {
            x: 35,
            y: 65,
            icon: 'User',
            color: 'purple',
            content: {
              title: 'My Device',
              description: 'Description',
              values: { deviceid: '73000', temperature: 35.05 },
              attributes: [
                {
                  dataSourceId: 'temperature',
                  label: 'Temp',
                  precision: 2,
                  thresholds: [
                    {
                      comparison: '>',
                      value: 0,
                      icon: 'Error filled',
                      color: 'purple',
                    },
                  ],
                },
              ],
            },
          },
          {
            x: 50,
            y: 60,
            content: 'Hotspot4',
            color: 'green',
          },
        ]}
      />
    );
    const hotspot = screen.getByTestId('hotspot-50-60');
    expect(hotspot).toBeVisible();
  });

  it('should show matching threshold icons and colors', () => {
    render(
      <ImageHotspots
        height={2048}
        width={1536}
        src={portrait}
        alt="portrait-test-image"
        hotspots={[
          {
            x: 35,
            y: 65,
            icon: 'User',
            color: 'purple',
            content: {
              title: 'My Device',
              description: 'Description',
              values: { deviceid: '73000', temperature: 35.05 },
              attributes: [
                {
                  dataSourceId: 'temperature',
                  label: 'Temp',
                  precision: 2,
                  thresholds: [
                    {
                      comparison: '>',
                      value: 0,
                      icon: 'Error',
                      color: 'purple',
                    },
                  ],
                },
              ],
            },
          },
        ]}
      />
    );
    const hotspot = screen.getByTestId('hotspot-35-65');
    expect(hotspot).toBeVisible();
    expect(hotspot).toHaveAttribute('icon', 'Error');
    const errorIcon = within(hotspot).getByRole('button').firstChild;
    expect(errorIcon).toBeVisible();
    expect(errorIcon).toHaveAttribute('fill', 'purple');
  });

  it('should render custom icons from an array', () => {
    render(
      <ImageHotspots
        height={683}
        width={512}
        src={portrait}
        alt="portrait-test-image"
        hotspots={[
          {
            x: 10,
            y: 20,
            content: <span>Hotspot1</span>,
            icon: 'CustomError',
            color: 'red',
            width: 20,
            height: 20,
          },
        ]}
        icons={[
          {
            id: 'CustomError',
            icon: Error32,
            text: 'CustomError',
          },
        ]}
      />
    );
    const hotspot = screen.getByTestId('hotspot-10-20');
    expect(hotspot).toBeVisible();
    expect(hotspot).toHaveAttribute('icon', 'CustomError');
  });

  it('should return no icon if not found in the array', () => {
    const originalDEV = global.__DEV__;
    const originalError = console.error;

    global.__DEV__ = true;
    console.error = jest.fn();

    render(
      <ImageHotspots
        height={683}
        width={512}
        src={portrait}
        alt="portrait-test-image"
        hotspots={[
          {
            x: 10,
            y: 20,
            content: <span>Hotspot1</span>,
            icon: 'invalid_icon_name', // missing from icons array
            color: 'red',
            width: 20,
            height: 20,
          },
        ]}
        icons={[
          {
            id: 'CustomError',
            icon: Error32,
            text: 'CustomError',
          },
        ]}
      />
    );
    const hotspot = screen.getByTestId('hotspot-10-20');
    expect(hotspot).toBeVisible();
    expect(hotspot).toHaveAttribute('icon', 'invalid_icon_name');
    expect(console.error).toHaveBeenCalledWith(
      `Warning: An array of available icons was provided to the ImageHotspots but a hotspot was trying to use an icon with name 'invalid_icon_name' that was not found in that array.`
    );
    console.error = originalError;
    global.__DEV__ = originalDEV;
  });

  it("should allow editing a text hotspot title that's editable and selected", () => {
    render(
      <ImageHotspots
        height={683}
        width={512}
        src={portrait}
        alt="portrait-test-image"
        hotspots={[
          {
            x: 10,
            y: 20,
            icon: 'Error',
            color: 'red',
            width: 20,
            height: 20,
            type: 'text',
            content: {
              title: '',
            },
          },
        ]}
        selectedHotspots={[
          {
            x: 10,
            y: 20,
          },
        ]}
        isEditable
      />
    );
    const hotspot = screen.getByTestId('hotspot-10-20');
    const editableHotspotTitle = screen.getByTestId('hotspot-content-10-20-title-test');
    expect(hotspot).toBeVisible();
    userEvent.click(hotspot);
    const hotspotTitle = within(hotspot).getByTitle('Click to edit label');
    expect(hotspotTitle).toBeVisible();
    fireEvent.focus(hotspotTitle);
    userEvent.click(hotspotTitle);
    expect(editableHotspotTitle).toBeVisible();
  });
});
