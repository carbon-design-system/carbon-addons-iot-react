import React, { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  /**
   * Any children to show in the avatar while dragging. Usually the row name and icon or similar.
   */
  children: PropTypes.node.isRequired,

  /** CSS z-index for the avatar. */
  zIndex: PropTypes.number.isRequired,
};

/**
 * The drag avatar that shows a preview of what's being dragged. The caller provides the child
 * "image" node (anything) to show, but this draws the bordered tile and around it. This must be
 * absolutely positioned on the page via its ref.
 *
 * @param {object} props
 * @param {ref} ref React ref to connect to the root dom node.
 *
 */
const TableDragAvatar = forwardRef(function TableDragAvatar({ zIndex, children }, ref) {
  return createPortal(
    <div className={`${iotPrefix}--table-drag-avatar`} ref={ref} style={{ zIndex }}>
      {children}
    </div>,
    document.body
  );
});

TableDragAvatar.propTypes = propTypes;

export { TableDragAvatar };
