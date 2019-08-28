import React from 'react';
import PropTypes from 'prop-types';
import { Icon, InlineLoading } from 'carbon-components-react';

import Hotspot, { propTypes as HotspotPropTypes } from './Hotspot';

const propTypes = {
  /** source of the local image file to display */
  src: PropTypes.string.isRequired,
  /** alt tag and shown on mouseover */
  alt: PropTypes.string,
  /** optional array of hotspots to render over the image */
  hotspots: PropTypes.arrayOf(PropTypes.shape(HotspotPropTypes)),
  /** optional features to enable or disable */
  hideZoomControls: PropTypes.bool,
  hideHotspots: PropTypes.bool,
  hideMinimap: PropTypes.bool,
  isHotspotDataLoading: PropTypes.bool,
  background: PropTypes.string,
  zoomMax: PropTypes.number,
};

const defaultProps = {
  hotspots: [],
  alt: null,
  hideZoomControls: false,
  hideHotspots: false,
  hideMinimap: false,
  isHotspotDataLoading: false,
  background: '#eee',
  zoomMax: undefined,
};

class ImageHotspots extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      container: {
        width: undefined,
        height: undefined,
        ratio: undefined,
        orientation: undefined,
        background: '#eee',
      },
      image: {
        initialWidth: undefined,
        initialHeight: undefined,
        width: undefined,
        height: undefined,
        scale: undefined,
        ratio: undefined,
        orientation: undefined,
        offsetX: undefined,
        offsetY: undefined,
      },
      minimap: {
        initialSize: 100,
        width: undefined,
        height: undefined,
        guideWidth: undefined,
        guideHeight: undefined,
        offsetX: 0,
        offsetY: 0,
      },
      hideZoomControls: false,
      hideHotspots: false,
      hideMinimap: false,
      resizable: undefined,
      draggable: undefined,
      cursorX: undefined,
      cursorY: undefined,
      mcursorX: undefined,
      mcursorY: undefined,
      dragging: undefined,
      isGuideDragging: undefined,
      hotspots: [],
    };

    this.container = React.createRef();
  }

  componentDidMount = () => {
    const { hideZoomControls, hideHotspots, hideMinimap, hotspots, background } = this.props;
    const { offsetWidth: width, offsetHeight: height } = this.container.current;
    const orientation = width > height ? 'landscape' : 'portrait';
    const ratio = orientation === 'landscape' ? width / height : height / width;

    this.setState({
      container: { width, height, ratio, orientation, background },
      hideZoomControls,
      hideHotspots,
      hideMinimap,
      hotspots,
    });

    window.addEventListener('resize', this.onWindowResize);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onWindowResize);
  };

  startDrag = (event, element) => {
    const cursorX = event.clientX;
    const cursorY = event.clientY;
    if (element === 'image') {
      this.setState(state => ({
        ...state,
        cursorX,
        cursorY,
        dragging: true,
      }));
    } else if (element === 'guide') {
      // TODO
    }
    event.preventDefault();
  };

  whileDrag = event => {
    const { image, minimap } = this.state;
    const cursorX = event.clientX;
    const cursorY = event.clientY;
    const deltaX = cursorX - this.state.cursorX;
    const deltaY = cursorY - this.state.cursorY;
    const newOffsetX = image.offsetX + deltaX;
    const newOffsetY = image.offsetY + deltaY;

    this.setState(state => ({
      ...state,
      cursorX,
      cursorY,
      image: {
        ...image,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      },
      minimap: {
        ...minimap,
        offsetX: -((minimap.width / image.width) * newOffsetX),
        offsetY: -((minimap.height / image.height) * newOffsetY),
      },
    }));
  };

  stopDrag = () => {
    const { container, image, minimap } = this.state;
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

    this.setState(state => ({
      ...state,
      image: {
        ...state.image,
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
      },
      minimap: {
        ...state.minimap,
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
      },
      dragging: false,
    }));
  };

  onImageLoad = ({ target: image }) => {
    const { offsetWidth: initialWidth, offsetHeight: initialHeight } = image;
    const { container, minimap, hideZoomControls, hideMinimap } = this.state;
    const orientation = initialWidth > initialHeight ? 'landscape' : 'portrait';
    const ratio =
      orientation === 'landscape' ? initialWidth / initialHeight : initialHeight / initialWidth;

    const width =
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

    const height =
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

    this.setState(prevState => ({
      ...prevState,
      image: {
        ...prevState.image,
        initialWidth,
        initialHeight,
        width,
        height,
        scale: 1,
        ratio,
        orientation,
        offsetX: 0,
        offsetY: container.height / 2 - height / 2,
      },
      minimap: {
        ...minimap,
        width: orientation === 'landscape' ? minimap.initialSize : minimap.initialSize / ratio,
        height: orientation === 'portrait' ? minimap.initialSize : minimap.initialSize / ratio,
        guideWidth: orientation === 'landscape' ? minimap.initialSize : minimap.initialSize / ratio,
        guideHeight: orientation === 'portrait' ? minimap.initialSize : minimap.initialSize / ratio,
      },
      hideZoomControls: hideZoomControls || !resizable,
      hideMinimap: hideMinimap || !resizable,
      resizable,
      draggable: false,
    }));
  };

  onWindowResize = () => {
    const { offsetWidth: width, offsetHeight: height } = this.container.current;
    const orientation = width > height ? 'landscape' : 'portrait';
    const ratio = orientation === 'landscape' ? width / height : height / width;

    this.setState({ container: { width, height, ratio, orientation } });

    this.zoom(this.state.image.scale);
  };

  zoom = scale => {
    if (scale > 0) {
      const { container, image, minimap } = this.state;
      const { zoomMax } = this.props;

      const width =
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

      const height =
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
        this.setState(prevState => ({
          image: {
            ...prevState.image,
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
          },
          minimap: {
            ...prevState.minimap,
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
          },
          draggable: scale > 1,
        }));
      }

      // Reset image position
      if (scale === 1) {
        this.setState(prevState => ({
          image: {
            ...prevState.image,
            offsetX: 0,
            offsetY: container.height / 2 - height / 2,
          },
          minimap: {
            ...prevState.minimap,
            offsetX: 0,
            offsetY: 0,
          },
        }));
      }
    }
  };

  render = () => {
    const { src, alt, hotspots, background, isHotspotDataLoading } = this.props;
    const {
      container,
      image,
      minimap,
      dragging,
      hideZoomControls,
      hideHotspots,
      hideMinimap,
      draggable,
    } = this.state;
    const imageLoaded = image.initialWidth && image.initialHeight;

    const containerStyle = {
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
      background: background || this.state.background,
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

    const bottomControlsStyle = {
      position: 'absolute',
      bottom: 10,
      right: 10,
      pointerEvents: this.state.dragging ? 'none' : 'auto',
    };

    const buttonStyle = {
      width: '25px',
      height: '25px',
      border: 'none',
      background: '#fff',
      boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.5)',
    };

    const minimapStyle = {
      width: minimap.width,
      height: minimap.height,
      position: 'absolute',
      display: 'block',
      bottom: 10,
      left: 10,
      background: '#fff',
      boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.5)',
      pointerEvents: 'none',
    };

    const guideStyle = {
      width: minimap.guideWidth,
      height: minimap.guideHeight,
      position: 'absolute',
      display: 'block',
      left: minimap.offsetX,
      top: minimap.offsetY,
      border: '1px solid rgba(64, 139, 252, 0.8)',
      background: 'rgba(64, 139, 252, 0.1)',
      pointerEvents: 'none',
    };

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
        ref={this.container}
        style={containerStyle}
        onMouseOut={event => {
          if (dragging) {
            this.stopDrag(event);
          }
        }}
        onBlur={event => {
          if (dragging) {
            this.stopDrag(event);
          }
        }}
      >
        {src && (
          <img
            src={src}
            alt={alt}
            onLoad={this.onImageLoad}
            style={imageStyle}
            onMouseDown={evt => {
              if (!hideZoomControls && draggable) {
                this.startDrag(evt, 'image');
              }
            }}
            onMouseMove={evt => {
              if (!hideZoomControls && dragging) {
                this.whileDrag(evt);
              }
            }}
            onMouseUp={event => {
              if (dragging) {
                this.stopDrag(event);
              }
            }}
          />
        )}
        {isHotspotDataLoading ? (
          <InlineLoading
            style={{ position: 'absolute', top: 0 }}
            description="Loading hotspot data..."
          />
        ) : null}
        {!isHotspotDataLoading && !hideHotspots && hotspots && (
          <div style={hotspotsStyle}>
            {hotspots.map(hotspot => {
              return (
                <Hotspot
                  {...hotspot}
                  key={`${hotspot.x}-${hotspot.y}`}
                  style={hotspotsStyle}
                  offsetX={image.offsetX}
                  offsetY={image.offsetY}
                />
              );
            })}
          </div>
        )}
        {!hideZoomControls && (
          <>
            <div style={bottomControlsStyle}>
              {draggable && (
                <>
                  <button type="button" style={buttonStyle} onClick={() => this.zoom(1)}>
                    <Icon name="icon--minimize" width="100%" height="100%" />
                  </button>
                  <br />
                  <br />
                </>
              )}
              <button type="button" style={buttonStyle} onClick={() => this.zoom(image.scale + 1)}>
                +
              </button>
              <br />
              <button type="button" style={buttonStyle} onClick={() => this.zoom(image.scale - 1)}>
                -
              </button>
            </div>
            {!hideMinimap && (
              <div style={minimapStyle}>
                {src && (
                  <img
                    src={src}
                    alt="Minimap"
                    width={minimapStyle.width}
                    height={minimapStyle.height}
                  />
                )}
                <div style={guideStyle} />
              </div>
            )}
          </>
        )}
      </div>
    );
  };
}

ImageHotspots.propTypes = propTypes;
ImageHotspots.defaultProps = defaultProps;

export default ImageHotspots;
