import React from 'react';
import styled from 'styled-components';
import withSize from 'react-sizeme';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ValueCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_LAYOUTS, CARD_SIZES, CARD_CONTENT_PADDING } from '../../constants/LayoutConstants';
import { COLORS } from '../../styles/styles';
import Card from '../Card/Card';

import Attribute from './Attribute';

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL &&
    `
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-around;
    padding: 0 0 1rem;
  `}
  ${props =>
    props.layout === CARD_LAYOUTS.VERTICAL &&
    `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 0 0 0.5rem;
  `}
`;

const AttributeWrapper = styled.div`
  ${props =>
    (props.layout === CARD_LAYOUTS.HORIZONTAL || props.size === CARD_SIZES.SMALL) &&
    !props.isVertical
      ? ` flex-direction: row;`
      : props.layout === CARD_LAYOUTS.VERTICAL || props.isVertical
      ? ` 
    padding: 0 ${CARD_CONTENT_PADDING}px;
    flex-direction: column;
    align-items: flex-end;
  `
      : ''}
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0px ${CARD_CONTENT_PADDING}px;
`;

const AttributeSeparator = styled.hr`
  margin: 0;
  border-top: solid 1px #ccc;
  width: 100%;
`;

const AttributeValueWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${props => (props.isVertical ? `width: 100%` : '')}
`;

const AttributeLabel = styled.div`
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL && `padding-bottom: 0.25rem; font-size: 1.25rem;`};
  ${props =>
    props.isVertical
      ? props.size === CARD_SIZES.XSMALL || props.size === CARD_SIZES.XSMALLWIDE
        ? `font-size: .875rem`
        : `font-size: 1.0rem`
      : `font-size: 1.25rem`};
  text-align: ${props =>
    props.layout === CARD_LAYOUTS.VERTICAL ||
    props.size === CARD_SIZES.XSMALL ||
    props.size === CARD_SIZES.XSMALLWIDE
      ? 'left'
      : 'right'};
  ${props =>
    (props.isVertical || props.size === CARD_SIZES.XSMALL || props.size === CARD_SIZES.SMALL) &&
    `padding-bottom: 0.25rem; padding-top: 0.25rem;`};
  ${props => !(props.isVertical || props.size === CARD_SIZES.XSMALL) && `padding-left: 0.5rem`};
  order: ${props => (props.isVertical && props.size !== CARD_SIZES.XSMALLWIDE ? 0 : 2)};
  color: ${COLORS.gray};
  font-weight: lighter;
  white-space: nowrap;
  ${props => props.isVertical && `width: 100%`};
  ${props => props.isVertical && `text-overflow: ellipsis`};
  ${props => props.isVertical && `overflow: hidden`};
`;

const determineLayout = (size, attributes) => {
  let layout = CARD_LAYOUTS.HORIZONTAL;
  switch (size) {
    case CARD_SIZES.XSMALL:
    case CARD_SIZES.XSMALLWIDE:
      layout = CARD_LAYOUTS.HORIZONTAL;
      break;
    case CARD_SIZES.SMALL:
      layout = CARD_LAYOUTS.VERTICAL;
      break;
    case CARD_SIZES.TALL:
    case CARD_SIZES.MEDIUM:
      if (attributes.length > 2) {
        layout = CARD_LAYOUTS.VERTICAL;
      }
      break;
    case CARD_SIZES.LARGE:
      if (attributes.length > 2) {
        layout = CARD_LAYOUTS.VERTICAL;
      }
      break;

    case CARD_SIZES.WIDE:
    case CARD_SIZES.XLARGE:
      if (attributes.length > 5) {
        layout = CARD_LAYOUTS.VERTICAL;
      }
      break;

    default:
      break;
  }
  return layout;
};

const determineValue = (dataSourceId, values) => values && values[dataSourceId];

const determineAttributes = (size, attributes) => {
  if (!attributes || !Array.isArray(attributes)) {
    return attributes;
  }
  let attributeCount = attributes.length;
  switch (size) {
    case CARD_SIZES.XSMALL:
      attributeCount = 1;
      break;
    case CARD_SIZES.XSMALLWIDE:
      attributeCount = 2;
      break;
    case CARD_SIZES.MEDIUM:
    case CARD_SIZES.SMALL:
    case CARD_SIZES.WIDE:
      attributeCount = 3;
      break;
    case CARD_SIZES.TALL:
    case CARD_SIZES.LARGE:
      attributeCount = 5;
      break;
    case CARD_SIZES.XLARGE:
      attributeCount = 6;
      break;
    default:
  }
  return attributes.slice(0, attributeCount);
};

const ValueCard = ({ title, content, size, values, ...others }) => {
  const layout = determineLayout(size, content && content.attributes);
  const attributes = determineAttributes(size, content && content.attributes);

  const availableActions = {
    expand: false,
    ...others.availableActions,
  };

  const isXS = size === CARD_SIZES.XSMALL;

  return (
    <withSize.SizeMe>
      {({ size: measuredSize }) => {
        // Measure the size to determine whether to render in vertical or horizontal
        const isVertical = !measuredSize || measuredSize.width < 300;
        return (
          <Card
            title={title}
            size={size}
            availableActions={availableActions}
            isEmpty={isEmpty(values)}
            {...others}
          >
            <ContentWrapper layout={layout}>
              {isXS && attributes.length > 0 ? ( // Small card only gets one
                <AttributeWrapper
                  layout={layout}
                  isSmall={!isNil(attributes[0].secondaryValue)}
                  size={size}
                >
                  <AttributeValueWrapper isVertical={isVertical}>
                    {attributes[0].label ? ( // Optional title attribute
                      <AttributeLabel
                        title={attributes[0].label}
                        isVertical={isVertical}
                        isSmall={isXS}
                        layout={layout}
                        size={size}
                      >
                        {attributes[0].label}
                      </AttributeLabel>
                    ) : null}
                    <Attribute
                      isVertical={isVertical}
                      isSmall={!isNil(attributes[0].secondaryValue) || !isNil(attributes[0].label)}
                      layout={layout}
                      {...attributes[0]}
                      value={determineValue(attributes[0].dataSourceId, values)}
                      secondaryValue={
                        attributes[0].secondaryValue && {
                          ...attributes[0].secondaryValue,
                          value: determineValue(attributes[0].secondaryValue.dataSourceId, values),
                        }
                      }
                    />
                  </AttributeValueWrapper>
                </AttributeWrapper>
              ) : (
                attributes.map((attribute, i) => (
                  // Larger card
                  <React.Fragment key={`fragment-${attribute.dataSourceId}`}>
                    <AttributeWrapper
                      layout={layout}
                      isVertical={isVertical}
                      isSmall={attribute.secondaryValue !== undefined}
                      size={size}
                    >
                      <Attribute
                        isVertical={isVertical}
                        layout={layout}
                        {...attribute}
                        value={determineValue(attribute.dataSourceId, values)}
                        isSmall={isVertical}
                        secondaryValue={
                          attribute.secondaryValue && {
                            ...attribute.secondaryValue,
                            value: determineValue(attribute.secondaryValue.dataSourceId, values),
                          }
                        }
                      />
                      <AttributeLabel
                        title={attribute.label}
                        isVertical={isVertical}
                        layout={layout}
                        size={size}
                      >
                        {attribute.label}
                      </AttributeLabel>
                    </AttributeWrapper>
                    {i < attributes.length - 1 ? (
                      <AttributeWrapper
                        layout={layout}
                        isVertical={isVertical}
                        isSmall={attribute.secondaryValue !== undefined}
                        size={size}
                      >
                        <AttributeSeparator />
                      </AttributeWrapper>
                    ) : null}
                  </React.Fragment>
                ))
              )}
            </ContentWrapper>
          </Card>
        );
      }}
    </withSize.SizeMe>
  );
};

ValueCard.propTypes = { ...CardPropTypes, ...ValueCardPropTypes };

ValueCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
};

export default ValueCard;
