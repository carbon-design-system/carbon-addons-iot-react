import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isNil from 'lodash/isNil';

import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';

const propTypes = {
  value: PropTypes.any, // eslint-disable-line
  unit: PropTypes.any, // eslint-disable-line
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  isSmall: PropTypes.bool,
  precision: PropTypes.number,
  /** the card size */
  size: PropTypes.string.isRequired,
  color: PropTypes.string,
  isVertical: PropTypes.bool,
};

const defaultProps = {
  layout: CARD_LAYOUTS.HORIZONTAL,
  isSmall: false,
  precision: 0,
  color: null,
  isVertical: false,
};

const Attribute = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  ${props => (props.unit || props.isSmall) && !props.isVertical && `max-width: 66%`};
  ${props => props.color && `color: ${props.color}`};
  display: flex;
`;

/** Returns font size in rem */
const determineFontSize = ({ value, size, isSmall }) => {
  if (typeof value === 'string' && size === CARD_SIZES.XSMALL) {
    return value.length > 4 ? 1 : 2;
  }
  return isSmall ? 2 : 2.5;
};

/** Renders the actual attribute value */
const AttributeValue = styled.span`
  line-height: ${props => (props.isSmall ? '2.0rem' : '2.5rem')};
  font-size: ${props => `${determineFontSize(props)}rem`};
  padding-bottom: 0.25rem;
  font-weight: lighter;
  ${props => props.layout === CARD_LAYOUTS.VERTICAL && `text-align: left;`};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledBoolean = styled.span`
  text-transform: capitalize;
`;

/** This components job is determining how to render different kinds of card values */
const ValueRenderer = ({ value, size, unit, layout, precision, isSmall, color, isVertical }) => {
  let renderValue = value;
  if (typeof value === 'boolean') {
    renderValue = <StyledBoolean>{value.toString()}</StyledBoolean>;
  }
  if (typeof value === 'number') {
    renderValue =
      value > 1000000000000
        ? (value / 1000000000000).toFixed(precision)
        : value > 1000000000
        ? (value / 1000000000).toFixed(precision)
        : value > 1000000
        ? (value / 1000000).toFixed(precision)
        : value > 1000
        ? (value / 1000).toFixed(precision)
        : value.toFixed(precision);
  } else if (isNil(value)) {
    renderValue = '--';
  }
  return (
    <Attribute unit={unit} isSmall={isSmall} color={color} isVertical={isVertical}>
      <AttributeValue
        size={size}
        title={`${value} ${unit || ''}`}
        layout={layout}
        isSmall={isSmall}
        value={value}
      >
        {renderValue}
      </AttributeValue>
    </Attribute>
  );
};

ValueRenderer.propTypes = propTypes;
ValueRenderer.defaultProps = defaultProps;

export default ValueRenderer;
