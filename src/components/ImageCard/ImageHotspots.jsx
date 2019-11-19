import React, { useMemo, useState } from 'react';
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
  /** Background color to display around the image */
  background: PropTypes.string,
  /** Current height in pixels */
  height: PropTypes.number.isRequired,
  /** Current width in pixels */
  width: PropTypes.number.isRequired,
  zoomMax: PropTypes.number,
  renderIconByName: PropTypes.func,
};

const defaultProps = {
  src: null,
  hotspots: [],
  alt: null,
  hideZoomControls: false,
  hideHotspots: false,
  hideMinimap: false,
  isHotspotDataLoading: false,
  background: '#eee',
  zoomMax: undefined,
  renderIconByName: null,
};

export const startDrag = (event, element, cursor, setCursor) => {
  const cursorX = event.clientX;
  const cursorY = event.clientY;
  if (element === 'image') {
    setCursor({
      ...cursor,
      cursorX,
      cursorY,
      dragging: true,
    });
  }
  event.preventDefault();
};

/** update the image offset based on the dragged point, and the minimap on the relative opposite from the dragged point */
export const whileDrag = (event, cursor, setCursor, image, setImage, minimap, setMinimap) => {
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

/** Make sure that the pointer hasn't left the */
export const stopDrag = (cursor, setCursor) => {
  setCursor({ ...cursor, dragging: false });
};

export const calculateImageWidth = (container, orientation, ratio, scale = 1) =>
  (container.orientation === orientation
    ? orientation === 'landscape'
      ? ratio >= container.ratio
        ? container.width // landscape image bigger than landscape container
        : container.height * ratio // landscape image smaller than landscape container
      : ratio >= container.ratio
      ? container.height / ratio // portrait image bigger than portrait container
      : container.width // portrait image smaller than portrait container
    : orientation === 'landscape'
    ? container.width // landscape image and portrait container
    : container.height / ratio) * scale; // portrait image and landscape container

export const calculateImageHeight = (container, orientation, ratio, scale = 1) =>
  (container.orientation === orientation
    ? orientation === 'landscape'
      ? ratio >= container.ratio
        ? container.width / ratio // landscape image bigger than landscape container
        : container.height // landscape image smaller than landscape container
      : ratio >= container.ratio
      ? container.height // portrait image bigger than portrait container
      : container.width * ratio // portrait image smaller than portrait container
    : orientation === 'landscape'
    ? container.width / ratio // landscape image and portrait container
    : container.height) * scale; // portrait image and landscape container

/** Sets initialWidth and initialHeight of an image, offsets orientations in the state */
export const onImageLoad = (
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

  const width = calculateImageWidth(container, orientation, ratio);
  const height = calculateImageHeight(container, orientation, ratio);

  // Because the first zoom is double, the initial image has to be big enough to support
  const resizable = initialWidth > 2 * width || initialHeight > 2 * height;

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

/** Updates the image, minimap and options based on the scale of the new zoom.
 * Will not allow scaling beyond zoomMax */
export const zoom = (
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
  const width = calculateImageWidth(container, image.orientation, image.ratio, scale);
  const height = calculateImageHeight(container, image.orientation, image.ratio, scale);

  // Reset image position, (i.e. zoom to fit)
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
    //
    setOptions({ ...options, draggable: false });
  }
  // Actual zooming in request
  else if (scale > 1) {
    if (
      (zoomMax && scale < zoomMax) ||
      (image.initialWidth > width && image.initialHeight > height)
    ) {
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

      // Reset draggability if we're zooming
      setOptions({ ...options, draggable: true });
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
    }
  }
};

/** Parent smart component with local state that renders an image with its hotspots */
const ImageHotspots = ({
  hideZoomControls: hideZoomControlsProp,
  hideHotspots: hideHotspotsProp,
  hideMinimap: hideMinimapProp,
  hotspots,
  background,
  src,
  height,
  width,
  alt,
  isHotspotDataLoading,
  zoomMax,
  renderIconByName,
}) => {
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

  const orientation = width > height ? 'landscape' : 'portrait';
  const ratio = orientation === 'landscape' ? width / height : height / width;

  const container = { height, width, ratio, orientation };

  // Once the component mounts set up the container info
  useDeepCompareEffect(
    () => {
      zoom(
        image.scale,
        zoomMax,
        container,
        image,
        setImage,
        minimap,
        setMinimap,
        options,
        setOptions
      );
    },
    [container, zoomMax, image, minimap, options] // eslint-disable-line
  );

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
            renderIconByName={renderIconByName}
          />
        );
      }),
    [hotspots, hotspotsStyle, image.offsetX, image.offsetY, renderIconByName]
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
      style={containerStyle}
      onMouseOut={() => {
        if (dragging) {
          // If we leave the container, stop detecting the drag
          stopDrag(cursor, setCursor);
        }
      }}
      onBlur={() => {
        if (dragging) {
          // If we leave the container, stop detecting the drag
          stopDrag(cursor, setCursor);
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
              stopDrag(cursor, setCursor);
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
