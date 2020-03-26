import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  value: PropTypes.any, // eslint-disable-line
  unit: PropTypes.string,
  layout: PropTypes.string,
  isMini: PropTypes.bool,
  allowedToWrap: PropTypes.bool.isRequired,
  wrapCompact: PropTypes.bool,
};

const defaultProps = {
  unit: '',
  layout: null,
  isMini: false,
  wrapCompact: false,
};

/** This components job is determining how to render different kinds units */
const UnitRenderer = ({ unit, layout, isMini, allowedToWrap, wrapCompact }) => {
  const bemBase = `${iotPrefix}--value-card__attribute-unit`;
  const unitElement = (
    <span
      style={{ '--default-font-size': layout === CARD_LAYOUTS.HORIZONTAL ? '1.25rem' : '1.5rem' }}
      className={classNames(bemBase, {
        [`${bemBase}--wrappable`]: allowedToWrap,
        [`${bemBase}--not-wrappable`]: !allowedToWrap,
        [`${bemBase}--wrappable-compact`]: wrapCompact,
        [`${bemBase}--mini`]: isMini,
      })}
    >
      {unit}
    </span>
  );

  return isMini ? <div>{unitElement}</div> : unitElement;
};

UnitRenderer.propTypes = propTypes;
UnitRenderer.defaultProps = defaultProps;

export default UnitRenderer;
