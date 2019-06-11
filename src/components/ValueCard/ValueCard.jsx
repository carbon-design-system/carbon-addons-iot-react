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

const AttributeWrapper = styled.div`
  ${props =>
    props.layout === CARD_LAYOUTS.VERTICAL &&
    `
    padding: 0 ${CARD_CONTENT_PADDING}px;
    width: 100%;

  `}
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL &&
    `
    width: 100%;
  `}
  padding: 0px ${CARD_CONTENT_PADDING}px  ;
`;

const AttributeBorder = styled.div`
  display: flex;
  flex-direction: ${props => (props.isVertical ? 'column' : 'row')};
  align-items: ${props => (props.isVertical ? 'flex-start' : 'flex-end')};
  justify-content: space-between;
  ${props => props.hasBorder && `border-top: 1px solid ${COLORS.lightGrey}`};
  ${props => (!props.isVertical ? `padding: ${(CARD_CONTENT_PADDING * 2) / 3}px 0px` : '')};
`;

const AttributeValueWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AttributeLabel = styled.div`
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL && `padding-bottom: 0.25rem; font-size: 1.25rem;`};
  ${props =>
    props.layout === CARD_LAYOUTS.VERTICAL ||
    props.size === CARD_SIZES.XSMALL ||
    props.size === CARD_SIZES.XSMALL_WIDE
      ? props.size === CARD_SIZES.XSMALL || props.size === CARD_SIZES.XSMALL_WIDE
        ? `font-size: .875rem` // for small card sizes, small font
        : `font-size: 1.0rem;` // otherwi
      : null};
  text-align: ${props =>
    props.layout === CARD_LAYOUTS.VERTICAL ||
    props.size === CARD_SIZES.XSMALL ||
    props.size === CARD_SIZES.XSMALL_WIDE
      ? 'left'
      : 'right'};
  ${props =>
    (props.isVertical || props.size === CARD_SIZES.XSMALL) &&
    `padding-bottom: 0.25rem; padding-top: 0.25rem;`};
  ${props => !(props.isVertical || props.size === CARD_SIZES.XSMALL) && `padding-left: 0.5rem`};
  order: ${props => (props.isVertical ? 0 : 2)};
  color: ${COLORS.gray};
  font-weight: lighter;
  ${props => props.isVertical && `text-overflow: ellipsis`};
  ${props => props.isVertical && `overflow: hidden`};
`;

const determineLayout = (size, attributes) => {
  let layout = CARD_LAYOUTS.HORIZONTAL;
  switch (size) {
    case CARD_SIZES.XSMALL:
    case CARD_SIZES.XSMALL_WIDE:
      layout = CARD_LAYOUTS.HORIZONTAL;
      break;
    case CARD_SIZES.SMALL:
      layout = CARD_LAYOUTS.VERTICAL;
      break;
    case CARD_SIZES.TALL:
      if (attributes.length > 2) {
        layout = CARD_LAYOUTS.VERTICAL;
      }
      break;

    case CARD_SIZES.MEDIUM:
    case CARD_SIZES.LARGE:
      if (attributes.length > 3) {
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

const ValueCard = ({ title, content, size, values, ...others }) => {
  const layout = determineLayout(size, content && content.attributes);

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
            layout={layout}
            availableActions={availableActions}
            isEmpty={isEmpty(values)}
            {...others}
          >
            {isXS && content.attributes.length > 0 ? ( // Small card only gets one
              <AttributeWrapper
                layout={layout}
                isSmall={!isNil(content.attributes[0].secondaryValue)}
              >
                <AttributeValueWrapper>
                  {content.attributes[0].label ? ( // Optional title attribute
                    <AttributeLabel
                      title={content.attributes[0].label}
                      isVertical={isVertical}
                      layout={layout}
                      size={size}
                    >
                      {content.attributes[0].label}
                    </AttributeLabel>
                  ) : null}
                  <Attribute
                    isVertical={isVertical}
                    isSmall={
                      !isNil(content.attributes[0].secondaryValue) ||
                      !isNil(content.attributes[0].label)
                    }
                    layout={layout}
                    {...content.attributes[0]}
                    value={determineValue(content.attributes[0].dataSourceId, values)}
                    secondaryValue={
                      content.attributes[0].secondaryValue && {
                        ...content.attributes[0].secondaryValue,
                        value: determineValue(
                          content.attributes[0].secondaryValue.dataSourceId,
                          values
                        ),
                      }
                    }
                  />
                </AttributeValueWrapper>
              </AttributeWrapper>
            ) : (
              content.attributes.map((attribute, i) => (
                // Larger card
                <AttributeWrapper
                  layout={layout}
                  key={`${attribute.title}-${i}`}
                  isSmall={attribute.secondaryValue !== undefined}
                >
                  <AttributeBorder isVertical={isVertical} hasBorder={!isVertical && i > 0}>
                    <Attribute
                      isVertical={isVertical}
                      layout={layout}
                      {...attribute}
                      value={determineValue(attribute.dataSourceId, values)}
                      secondaryValue={
                        attribute.secondaryValue && {
                          ...attribute.secondaryValue,
                          value: determineValue(attribute.secondaryValue.dataSourceId, values),
                        }
                      }
                    />
                    <AttributeLabel title={attribute.label} isVertical={isVertical} layout={layout}>
                      {attribute.label}
                    </AttributeLabel>
                  </AttributeBorder>
                </AttributeWrapper>
              ))
            )}
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
