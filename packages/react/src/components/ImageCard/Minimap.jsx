import React from 'react';
import PropTypes from 'prop-types';

export const MinimapPropTypes = {
  /** The image to render in the minimap */
  src: PropTypes.string,
  /** size of the image in the minimap */
  width: PropTypes.number,
  height: PropTypes.number,
  /** size of the guide overlaid on the minimap image */
  guideWidth: PropTypes.number,
  guideHeight: PropTypes.number,
  /** the offsets of the overlaid guide */
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
};

const defaultProps = {
  src: null,
  guideWidth: null,
  guideHeight: null,
  width: null,
  height: null,
  offsetX: null,
  offsetY: null,
};

/**
 * This renders the minimap component with the appropriate styles. No local state, only a dumb render component
 */
const Minimap = ({ src, width, height, guideWidth, guideHeight, offsetX, offsetY }) => {
  const minimapStyle = {
    width,
    height,
    position: 'absolute',
    display: 'block',
    bottom: 10,
    left: 10,
    background: '#fff',
    boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.5)',
    pointerEvents: 'none',
  };

  const guideStyle = {
    width: guideWidth,
    height: guideHeight,
    position: 'absolute',
    display: 'block',
    left: offsetX,
    top: offsetY,
    border: '1px solid rgba(64, 139, 252, 0.8)',
    background: 'rgba(64, 139, 252, 0.1)',
    pointerEvents: 'none',
  };
  return (
    <div style={minimapStyle}>
      {src && (
        <img src={src} alt="Minimap" width={minimapStyle.width} height={minimapStyle.height} />
      )}
      <div style={guideStyle} />
    </div>
  );
};

Minimap.defaultProps = defaultProps;
Minimap.propTypes = MinimapPropTypes;

export default Minimap;
