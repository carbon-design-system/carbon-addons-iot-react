import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';

import './drag-panel.scss';

const propTypes = {
  id: PropTypes.string.isRequired,
  left: PropTypes.number,
  top: PropTypes.number,
  children: PropTypes.node,
};

const defaultProps = {
  left: 0,
  top: 0,
};

const DragPanel = ({ id, left, top, children }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'dragPanel',
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top]
  );
  return isDragging ? null : (
    <div className="drag-panel" ref={drag} style={{ left, top }} role="dragPanel">
      {children}
    </div>
  );
};

DragPanel.propTypes = propTypes;
DragPanel.defaultProps = defaultProps;
export default DragPanel;
