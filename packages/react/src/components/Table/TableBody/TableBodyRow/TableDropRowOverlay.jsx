import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import React from 'react';

import { settings } from '../../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  /**
   * Any CSS style rules. This is to set the top, left, and possibly transform, to position this
   * overlay.
   */
  style: PropTypes.objectOf(PropTypes.string),

  /**
   * The ID of the table row this handle is it. This is the row that will be dragged by this handle.
   */
  rowId: PropTypes.string,
};

/**
 * During a drag and drop we want a border around the row we're about to drop on. We can't add a CSS
 * border on the row since the cells already have borders on them. And if we alter them and change
 * widths, the table shifts. Instead, we overlay a transparent element over the row and add the
 * border to that. That is this overlay.
 *
 * @param {object} props
 */
function TableDropRowOverlay({ style }) {
  return createPortal(
    <div style={style} className={`${iotPrefix}--table-drop-row-overlay`} />,
    document.body
  );
}

TableDropRowOverlay.propTypes = propTypes;

export { TableDropRowOverlay };
