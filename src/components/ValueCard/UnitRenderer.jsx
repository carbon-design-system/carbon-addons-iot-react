import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types, react/require-default-props
  unit: PropTypes.string,
  layout: PropTypes.string,
  allowedToWrap: PropTypes.bool.isRequired,
  wrapCompact: PropTypes.bool,
};

const defaultProps = {
  unit: '',
  layout: null,
  wrapCompact: false,
};

/**
 * This components job is determining how to render different kinds of units
 */
const UnitRenderer = ({
  value,
  unit,
  layout,
  allowedToWrap,
  wrapCompact,
  attributeCount,
}) => {
  const bemBase = `${iotPrefix}--value-card__attribute-unit`;
  const notAllowedToWrap =
    typeof value === 'string' && !allowedToWrap && attributeCount === 1;

  const unitElement = (
    <span
      style={{
        '--default-font-size':
          layout === CARD_LAYOUTS.HORIZONTAL ? '1.25rem' : '1.5rem',
      }}
      className={classnames(bemBase, {
        [`${bemBase}--wrappable`]: allowedToWrap,
        [`${bemBase}--not-wrappable`]: notAllowedToWrap,
        [`${bemBase}--wrappable-compact`]: wrapCompact,
      })}>
      {unit}
    </span>
  );

  return unitElement;
};

UnitRenderer.propTypes = propTypes;
UnitRenderer.defaultProps = defaultProps;

export default UnitRenderer;
