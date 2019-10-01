import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'carbon-components-react';
import { iconMinimize } from 'carbon-icons';

import Minimap, { MinimapPropTypes } from './Minimap';

const propTypes = {
  ...MinimapPropTypes,
  draggable: PropTypes.bool,
  dragging: PropTypes.bool,
  hideMinimap: PropTypes.bool,
  onZoomToFit: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  onZoomIn: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    minimizeIconDescription: PropTypes.string,
  }),
};

const defaultProps = {
  draggable: false,
  dragging: false,
  hideMinimap: false,
  i18n: {
    minimizeIconDescription: 'Minimize',
  },
};

const ImageControls = ({
  minimap,
  draggable,
  dragging,
  hideMinimap,
  onZoomToFit,
  onZoomIn,
  onZoomOut,
  i18n: { minimizeIconDescription },
}) => {
  const bottomControlsStyle = {
    position: 'absolute',
    bottom: 10,
    right: 10,
    pointerEvents: dragging ? 'none' : 'auto',
  };

  const buttonStyle = {
    width: '25px',
    height: '25px',
    border: 'none',
    background: '#fff',
    boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.5)',
  };
  return (
    <>
      <div style={bottomControlsStyle}>
        {draggable && (
          <>
            <button type="button" style={buttonStyle} onClick={onZoomToFit}>
              <Icon
                icon={iconMinimize}
                description={minimizeIconDescription}
                width="100%"
                height="100%"
              />
            </button>
            <br />
            <br />
          </>
        )}
        <button type="button" style={buttonStyle} onClick={onZoomIn}>
          +
        </button>
        <br />
        <button type="button" style={buttonStyle} onClick={onZoomOut}>
          -
        </button>
      </div>
      {!hideMinimap && <Minimap {...minimap} />}
    </>
  );
};

ImageControls.propTypes = propTypes;
ImageControls.defaultProps = defaultProps;
export default ImageControls;
