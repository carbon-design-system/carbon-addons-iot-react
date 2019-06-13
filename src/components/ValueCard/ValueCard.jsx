import React from 'react';
import styled from 'styled-components';
import withSize from 'react-sizeme';
import isEmpty from 'lodash/isEmpty';

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

/**
 * Responsible for rendering the Attribute and the Label for a given attribute
 * isVertical means that the label is rendering above the Attribute
 */
const AttributeWrapper = styled.div`
  ${props =>
    !props.isVertical
      ? ` flex-direction: row;`
      : ` 
    padding: 0 ${CARD_CONTENT_PADDING}px;
    flex-direction: column;
    align-items: flex-end;
  `}
  width: 100%;
  display: flex;
  align-items: center;
  ${props => (props.isVertical ? `` : 'justify-content: space-around;')}
  padding: 0px ${CARD_CONTENT_PADDING}px;
`;

const AttributeSeparator = styled.hr`
  margin: 0;
  border-top: solid 1px #ccc;
  width: 100%;
`;

/**
 *
 * Returns the font size in rems for a label
 * @param {*} param0
 */
const determineLabelFontSize = ({ size, layout, attributeCount, isVertical }) => {
  if (layout === CARD_LAYOUTS.HORIZONTAL && !CARD_SIZES.WIDE) {
    return 1.25;
  }
  if (isVertical && attributeCount > 1) {
    return 0.875;
  }
  let fontSize = 1.25;
  switch (size) {
    case CARD_SIZES.XSMALL:
    case CARD_SIZES.XSMALLWIDE:
      fontSize = 0.875;
      break;
    case CARD_SIZES.SMALL:
    case CARD_SIZES.TALL:
      fontSize = !isVertical ? 1 : 1.25;
      break;

    case CARD_SIZES.WIDE:
    default:
  }
  return fontSize;
};

/** * Determines the label alignment */
const getLabelAlignment = ({ size, isVertical, attributeCount }) => {
  if (attributeCount === 1 && size === CARD_SIZES.SMALL && isVertical) {
    return 'center';
  }
  return isVertical ? 'left' : 'right';
};

const shouldLabelWrap = ({ title, isVertical }) => {
  if (!title || isVertical) {
    return false;
  }
  const words = title.split(' ');
  if (words.length > 1 && words.length < 3) {
    return true;
  }
  return false;
};

/**
 * Render a given attribute label
 */
const AttributeLabel = styled.div`
  ${props => `font-size: ${determineLabelFontSize(props)}rem;`};
  text-align: ${props => getLabelAlignment(props)};
  ${props =>
    (props.isVertical || props.size === CARD_SIZES.XSMALL || props.size === CARD_SIZES.SMALL) &&
    `padding-top: 0.25rem;`};
  ${props => !(props.isVertical || props.size === CARD_SIZES.XSMALL) && `padding-left: 0.5rem`};
  order: ${props => (props.isVertical && props.size !== CARD_SIZES.XSMALLWIDE ? 0 : 2)};
  color: ${COLORS.gray};
  font-weight: lighter;
  ${props => (shouldLabelWrap(props) ? `` : `white-space: nowrap;`)}
  text-overflow: ellipsis;
  overflow: hidden;
  padding-bottom: 0.25rem;
  ${props => (props.isVertical ? `width: 100%` : 'width: 50%')};
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
    case CARD_SIZES.WIDE:
      if (attributes.length > 2) {
        layout = CARD_LAYOUTS.VERTICAL;
      }
      break;
    case CARD_SIZES.LARGE:
      if (attributes.length > 2) {
        layout = CARD_LAYOUTS.VERTICAL;
      }
      break;

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
    case CARD_SIZES.LARGE:
      attributeCount = 5;
      break;
    case CARD_SIZES.TALL:
    case CARD_SIZES.XLARGE:
      attributeCount = 7;
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
              {attributes.map((attribute, i) => (
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
                      isSmall={
                        size === CARD_SIZES.XSMALL &&
                        (attribute.secondaryValue !== undefined || attribute.label !== undefined)
                      }
                      alignValue={
                        size === CARD_SIZES.SMALL && attributes.length === 1 ? 'center' : undefined
                      }
                      {...attribute}
                      size={size}
                      value={determineValue(attribute.dataSourceId, values)}
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
                      attributeCount={attributes.length}
                      size={size}
                    >
                      {attribute.label}
                    </AttributeLabel>
                  </AttributeWrapper>
                  {i < attributes.length - 1 && (isVertical || layout === CARD_LAYOUTS.VERTICAL) ? (
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
              ))}
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
