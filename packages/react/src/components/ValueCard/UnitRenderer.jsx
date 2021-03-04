import PropTypes from 'prop-types';
import React from 'react';

import { BASE_CLASS_NAME } from './valueCardUtils';

const propTypes = {
  unit: PropTypes.string,
};

const defaultProps = {
  unit: '',
};

const BEM_BASE = `${BASE_CLASS_NAME}__attribute-unit`;

/**
 * This components job is determining how to render different kinds of units
 */
const UnitRenderer = ({ unit }) => {
  return (
    <span
      style={{
        '--default-font-size': '1.25rem',
      }}
      className={BEM_BASE}
    >
      {unit}
    </span>
  );
};

UnitRenderer.propTypes = propTypes;
UnitRenderer.defaultProps = defaultProps;

export default UnitRenderer;
