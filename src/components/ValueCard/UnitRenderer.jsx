import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types, react/require-default-props
  unit: PropTypes.string,
  allowedToWrap: PropTypes.bool.isRequired,
  wrapCompact: PropTypes.bool,
  attributeCount: PropTypes.number,
};

const defaultProps = {
  unit: '',
  wrapCompact: false,
  attributeCount: 0,
};

/**
 * This components job is determining how to render different kinds of units
 */
const UnitRenderer = ({
  value,
  unit,
  allowedToWrap,
  wrapCompact,
  attributeCount,
}) => {
  const bemBase = `${iotPrefix}--value-card__attribute-unit`;
  const notAllowedToWrap =
    typeof value === 'string' && !allowedToWrap && attributeCount === 1;

  return (
    <span
      style={{
        '--default-font-size': '1.25rem',
      }}
      className={classnames(bemBase, {
        [`${bemBase}--wrappable`]: allowedToWrap,
        [`${bemBase}--not-wrappable`]: notAllowedToWrap,
        [`${bemBase}--wrappable-compact`]: wrapCompact,
      })}>
      {unit}
    </span>
  );
};

UnitRenderer.propTypes = propTypes;
UnitRenderer.defaultProps = defaultProps;

export default UnitRenderer;
