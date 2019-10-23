import React, { useMemo, useRef, useState, useEffect } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import PropTypes from 'prop-types';
import { InlineLoading } from 'carbon-components-react';

import Hotspot, { propTypes as HotspotPropTypes } from './Hotspot';
import ImageControls from './ImageControls';

const propTypes = {
  /** source of the local image file to display */
  src: PropTypes.string,
  /** alt tag and shown on mouseover */
  alt: PropTypes.string,
  /** optional array of hotspots to render over the image */
  hotspots: PropTypes.arrayOf(PropTypes.shape(HotspotPropTypes)),
  /** optional features to enable or disable */
  hideZoomControls: PropTypes.bool,
  hideHotspots: PropTypes.bool,
  hideMinimap: PropTypes.bool,
  isHotspotDataLoading: PropTypes.bool,
  isExpanded: PropTypes.bool,
  background: PropTypes.string,
  zoomMax: PropTypes.number,
};

const defaultProps = {
  src: null,
  hotspots: [],
  alt: null,
  hideZoomControls: false,
  hideHotspots: false,
  hideMinimap: false,
  isHotspotDataLoading: false,
  isExpanded: false,
  background: '#eee',
  zoomMax: undefined,
};

const startDrag = (event, element, cursor, setCursor) => {
  const cursorX = event.clientX;
  const cursorY = event.clientY;
  if (element === 'image') {
    setCursor({
      ...cursor,
      cursorX,
      cursorY,
      dragging: true,
    });
  } else if (element === 'guide') {
    // TODO
  }
  event.preventDefault();
};

const whileDrag = (event, cursor, setCursor, image, setImage, minimap, setMinimap) => {
  const cursorX = event.clientX;
  const cursorY = event.clientY;
  const deltaX = cursorX - cursor.cursorX;
  const deltaY = cursorY - cursor.cursorY;
  const newOffsetX = image.offsetX + deltaX;
  const newOffsetY = image.offsetY + deltaY;

  setCursor({
    ...cursor,
    cursorX,
    cursorY,
  });
  setImage({
    ...image,
    offsetX: newOffsetX,
    offsetY: newOffsetY,
  });
  setMinimap({
    ...minimap,
    offsetX: -((minimap.width / image.width) * newOffsetX),
    offsetY: -((minimap.height / image.height) * newOffsetY),
  });
};

const stopDrag = (container, image, setImage, minimap, setMinimap, cursor, setCursor) => {
  const offsetXMax =
    container.orientation === image.orientation
      ? -Math.abs(image.width - container.width)
      : -Math.abs(container.width - image.width);
  const offsetYMax =
    container.orientation === image.orientation
      ? -Math.abs(container.height - image.height)
      : -Math.abs(image.height - container.height);
  const deltaX = container.width - image.width - image.offsetX;
  const deltaY = container.height - image.height - image.offsetY;

  setImage({
    ...image,
    offsetX: image.offsetX >= 0 ? 0 : deltaX >= 0 ? offsetXMax : image.offsetX,
    offsetY:
      image.offsetY >= 0
        ? container.height > image.height
          ? container.height / 2 - image.height / 2
          : 0
        : deltaY >= 0
        ? container.height > image.height
          ? container.height / 2 - image.height / 2
          : offsetYMax
        : image.offsetY,
  });
  setMinimap({
    ...minimap,
    offsetX:
      image.offsetX >= 0 || image.width < container.width
        ? 0
        : deltaX >= 0
        ? -((minimap.height / image.height) * offsetXMax)
        : -((minimap.height / image.height) * image.offsetX),
    offsetY:
      image.offsetY >= 0 || image.height < container.height
        ? 0
        : deltaY >= 0
        ? -((minimap.height / image.height) * offsetYMax)
        : -((minimap.height / image.height) * image.offsetY),
  });
  setCursor({ ...cursor, dragging: false });
};

const onImageLoad = (
  { target: imageLoaded },
  container,
  image,
  setImage,
  minimap,
  setMinimap,
  options,
  setOptions
) => {
  const { offsetWidth: initialWidth, offsetHeight: initialHeight } = imageLoaded;
  const orientation = initialWidth > initialHeight ? 'landscape' : 'portrait'; // eslint-disable-line
  const ratio =
    orientation === 'landscape' ? initialWidth / initialHeight : initialHeight / initialWidth;

  const width = // eslint-disable-line
    container.orientation === orientation
      ? orientation === 'landscape'
        ? ratio >= container.ratio
          ? container.width // landscape image bigger than landscape container
          : container.height * ratio // landscape image smaller than landscape container
        : ratio >= container.ratio
        ? container.height / ratio // portrait image bigger than portrait container
        : container.width // portrait image smaller than portrait container
      : orientation === 'landscape'
      ? container.width // landscape image and portrait container
      : container.height / ratio; // portrait image and landscape container

  const height = //eslint-disable-line
    container.orientation === orientation
      ? orientation === 'landscape'
        ? ratio >= container.ratio
          ? container.width / ratio // landscape image bigger than landscape container
          : container.height // landscape image smaller than landscape container
        : ratio >= container.ratio
        ? container.height // portrait image bigger than portrait container
        : container.width * ratio // portrait image smaller than portrait container
      : orientation === 'landscape'
      ? container.width / ratio // landscape image and portrait container
      : container.height; // portrait image and landscape container

  const resizable = initialWidth > width || initialHeight > height;

  setImage({
    ...image,
    initialWidth,
    initialHeight,
    width,
    height,
    scale: 1,
    ratio,
    orientation,
    offsetX: 0,
    offsetY: container.height / 2 - height / 2,
  });
  setMinimap({
    ...minimap,
    width: orientation === 'landscape' ? minimap.initialSize : minimap.initialSize / ratio,
    height: orientation === 'portrait' ? minimap.initialSize : minimap.initialSize / ratio,
    guideWidth: orientation === 'landscape' ? minimap.initialSize : minimap.initialSize / ratio,
    guideHeight: orientation === 'portrait' ? minimap.initialSize : minimap.initialSize / ratio,
  });
  setOptions({
    ...options,
    hideZoomControls: options.hideZoomControls || !resizable,
    hideMinimap: options.hideMinimap || !resizable,
    resizable,
    draggable: false,
  });
};

const zoom = (
  scale,
  zoomMax,
  container,
  image,
  setImage,
  minimap,
  setMinimap,
  options,
  setOptions
) => {
  const width = //eslint-disable-line
    container.orientation === image.orientation
      ? image.orientation === 'landscape'
        ? image.ratio >= container.ratio
          ? container.width * scale // landscape image bigger than landscape container
          : container.height * image.ratio * scale // landscape image smaller than landscape container
        : image.ratio >= container.ratio
        ? (container.height / image.ratio) * scale // portrait image bigger than portrait container
        : container.width * scale // portrait image smaller than portrait container
      : image.orientation === 'landscape'
      ? container.width * scale // landscape image and portrait container
      : (container.height / image.ratio) * scale; // portrait image and landscape container

  const height = //eslint-disable-line
    container.orientation === image.orientation
      ? image.orientation === 'landscape'
        ? image.ratio >= container.ratio
          ? (container.width / image.ratio) * scale // landscape image bigger than landscape container
          : container.height * scale // landscape image smaller than landscape container
        : image.ratio >= container.ratio
        ? container.height * scale // portrait image bigger than portrait container
        : container.width * image.ratio * scale // portrait image smaller than portrait container
      : image.orientation === 'landscape'
      ? (container.width / image.ratio) * scale // landscape image and portrait container
      : container.height * scale; // portrait image and landscape container

  // Reset image position
  if (scale === 1) {
    setImage({
      ...image,
      width,
      height,
      scale: 1,
      offsetX: 0,
      offsetY: container.height / 2 - height / 2,
    });
    setMinimap({
      ...minimap,
      guideHeight: minimap.height,
      guideWidth: minimap.width,
      offsetX: 0,
      offsetY: 0,
    });
  } else if (scale > 0) {
    const guideWidth =
      container.width >= width ? minimap.width : minimap.width / (width / container.width);
    const guideHeight =
      container.height >= height ? minimap.height : minimap.height / (height / container.height);

    const deltaX = Math.round(width - image.width);
    const deltaY = Math.round(height - image.height);
    const guideDeltaX = Math.round(guideWidth - minimap.guideWidth);
    const guideDeltaY = Math.round(guideHeight - minimap.guideHeight);

    const offsetX = image.offsetX - deltaX / 2;
    const offsetY = image.offsetY - deltaY / 2;
    const guideOffsetX = Math.round(minimap.offsetX - guideDeltaX / 2);
    const guideOffsetY = Math.round(minimap.offsetY - guideDeltaY / 2);

    const offsetXMax = -Math.abs(Math.round(container.width - width));
    const offsetYMax = -Math.abs(Math.round(container.height - height));
    const guideOffsetXMax = Math.round(minimap.width - guideWidth);
    const guideOffsetYMax = Math.round(minimap.height - guideHeight);

    if (
      (zoomMax && scale < zoomMax) ||
      (image.initialWidth > width && image.initialHeight > height)
    ) {
      setImage({
        ...image,
        width,
        height,
        scale,
        offsetX:
          offsetX >= 0 || container.width > width
            ? 0
            : image.offsetX <= offsetXMax
            ? offsetXMax
            : offsetX,
        offsetY:
          container.height > height
            ? container.height / 2 - height / 2
            : offsetY >= 0
            ? 0
            : image.offsetY < offsetYMax
            ? offsetYMax
            : offsetY,
      });
      setMinimap({
        ...minimap,
        guideWidth,
        guideHeight,
        offsetX:
          guideOffsetX <= 0
            ? 0
            : minimap.offsetX < guideOffsetXMax
            ? guideOffsetX
            : guideOffsetXMax,
        offsetY:
          guideOffsetY <= 0 || height < container.height
            ? 0
            : minimap.offsetY < guideOffsetYMax
            ? guideOffsetY
            : guideOffsetYMax,
      });
      setOptions({ ...options, draggable: scale > 1 });
    }
  }
};

const onWindowResize = (
  containerRef,
  zoomMax,
  container,
  setContainer,
  image,
  setImage,
  minimap,
  setMinimap,
  options,
  setOptions
) => {
  // eslint-disable-line
  const { offsetWidth: width, offsetHeight: height } = containerRef.current; // eslint-disable-line
  const orientation = width > height ? 'landscape' : 'portrait'; // eslint-disable-line
  const ratio = orientation === 'landscape' ? width / height : height / width;

  setContainer({ width, height, ratio, orientation });
  zoom(
    image.scale,
    zoomMax,
    { width, height, ratio, orientation },
    image,
    setImage,
    minimap,
    setMinimap,
    options,
    setOptions
  );
};

/** Parent smart component with local state that renders an image with its hotspots */
const ImageHotspots = ({
  hideZoomControls: hideZoomControlsProp,
  hideHotspots: hideHotspotsProp,
  hideMinimap: hideMinimapProp,
  hotspots,
  background,
  isExpanded,
  src,
  alt,
  isHotspotDataLoading,
  zoomMax,
}) => {
  const containerRef = useRef({});

  // Container needs to be stored in state because we need to calculate its size based on render
  const [container, setContainer] = useState({});
  // Image needs to be stored in state because we're dragging it around when zoomed in, and we need to keep track of when it loads
  const [image, setImage] = useState({});
  // Minimap needs to be stored in state because we're dragging it around when zoomed in
  const [minimap, setMinimap] = useState({
    initialSize: 100,
    offsetX: 0,
    offsetY: 0,
  });
  // TODO: Why do I keep track of cursor state
  const [cursor, setCursor] = useState({});
  // Options need to be stored in state because based on the zoom level they may change
  const [options, setOptions] = useState({
    hideZoomControlsProp,
    hideHotspotsProp,
    hideMinimapProp,
  });

  // Once the component mounts set up the container info
  useDeepCompareEffect(
    () => {
      // TODO: Instead of storing the container state could we just pass these from the SizeMe down in render
      // calculate the current size
      const { offsetWidth: width, offsetHeight: height } = containerRef.current;
      const orientation = width > height ? 'landscape' : 'portrait';
      setContainer({
        width,
        height,
        ratio: orientation === 'landscape' ? width / height : height / width,
        orientation,
        background: background || '#eee',
      });
      const resizeFunction = () =>
        onWindowResize(
          containerRef,
          zoomMax,
          container,
          setContainer,
          image,
          setImage,
          minimap,
          setMinimap,
          options,
          setOptions
        );
      window.addEventListener('resize', resizeFunction);
      return () => window.removeEventListener('resize', resizeFunction);
    },
    [background, container, image, minimap, options, zoomMax] // eslint-disable-line
  );

  // If the image is expanded, then trigger a window resize
  useEffect(
    () => {
      onWindowResize(
        containerRef,
        zoomMax,
        container,
        setContainer,
        image,
        setImage,
        minimap,
        setMinimap,
        options,
        setOptions
      );
    },
    [isExpanded] // eslint-disable-line
  );

  // Should I flatten cursor and get rid of?
  const { dragging } = cursor;
  const { hideZoomControls, hideHotspots, hideMinimap, draggable } = options;
  const imageLoaded = image.initialWidth && image.initialHeight;

  const containerStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
    background,
  };

  const imageStyle = {
    position: 'relative',
    left: image.offsetX,
    top: image.offsetY,
  };

  const hotspotsStyle = {
    position: 'absolute',
    top: image.offsetY,
    left: image.offsetX,
    right: image.offsetX >= 0 ? 0 : 'auto',
    margin: 'auto',
    pointerEvents: 'none',
  };

  // Performance improvement
  const cachedHotspots = useMemo(
    () =>
      hotspots.map(hotspot => {
        return (
          <Hotspot
            {...hotspot}
            key={`${hotspot.x}-${hotspot.y}`}
            style={hotspotsStyle}
            offsetX={image.offsetX}
            offsetY={image.offsetY}
          />
        );
      }),
    [hotspots, hotspotsStyle, image.offsetX, image.offsetY]
  );

  if (imageLoaded) {
    if (container.orientation === 'landscape') {
      imageStyle.height = image.height;
    } else {
      imageStyle.width = image.width;
    }

    if (image.orientation === 'landscape') {
      hotspotsStyle.width = image.width;
      hotspotsStyle.height = image.width / image.ratio;
    } else {
      hotspotsStyle.width = image.height / image.ratio;
      hotspotsStyle.height = image.height;
    }
  }
  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onMouseOut={() => {
        if (dragging) {
          stopDrag(container, image, setImage, minimap, setMinimap, cursor, setCursor);
        }
      }}
      onBlur={() => {
        if (dragging) {
          stopDrag(container, image, setImage, minimap, setMinimap, cursor, setCursor);
        }
      }}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          onLoad={event =>
            onImageLoad(event, container, image, setImage, minimap, setMinimap, options, setOptions)
          }
          style={imageStyle}
          onMouseDown={evt => {
            if (!hideZoomControls && draggable) {
              startDrag(evt, 'image', cursor, setCursor);
            }
          }}
          onMouseMove={evt => {
            if (!hideZoomControls && dragging) {
              whileDrag(evt, cursor, setCursor, image, setImage, minimap, setMinimap);
            }
          }}
          onMouseUp={() => {
            if (dragging) {
              stopDrag(container, image, setImage, minimap, setMinimap, cursor, setCursor);
            }
          }}
        />
      )}
      {isHotspotDataLoading ? (
        <InlineLoading
          style={{ position: 'absolute', top: 0 }}
          description="Loading hotspot data..."
          status="active"
        />
      ) : null}
      {!isHotspotDataLoading && !hideHotspots && hotspots && (
        <div style={hotspotsStyle}>{cachedHotspots}</div>
      )}
      {!hideZoomControls && (
        <ImageControls
          minimap={{ ...minimap, src }}
          draggable={draggable}
          dragging={dragging}
          hideMinimap={hideMinimap}
          onZoomToFit={() =>
            zoom(1, zoomMax, container, image, setImage, minimap, setMinimap, options, setOptions)
          }
          onZoomIn={() =>
            zoom(
              image.scale + 1,
              zoomMax,
              container,
              image,
              setImage,
              minimap,
              setMinimap,
              options,
              setOptions
            )
          }
          onZoomOut={() =>
            zoom(
              image.scale - 1,
              zoomMax,
              container,
              image,
              setImage,
              minimap,
              setMinimap,
              options,
              setOptions
            )
          }
        />
      )}
    </div>
  );
};

ImageHotspots.propTypes = propTypes;
ImageHotspots.defaultProps = defaultProps;

export default ImageHotspots;
