import React, { forwardRef } from 'react';
import { createPortal } from 'react-dom';

import { settings } from '../../../../constants/Settings';

const { iotPrefix } = settings;

/**
 * During a drag and drop we want a border around the row we're about to drop on. We can't add a CSS
 * border on the row since the cells already have borders on them. And if we alter them and change
 * widths, the table shifts. Instead, we overlay a transparent element over the row and add the
 * border to that. That is this overlay.
 *
 * @param {object} props
 */
const TableDropRowOverlay = forwardRef(function TableDropRowOverlay(_, ref) {
  return createPortal(
    <div className={`${iotPrefix}--table-drop-row-overlay`} ref={ref} />,
    document.body
  );
});

export { TableDropRowOverlay };
