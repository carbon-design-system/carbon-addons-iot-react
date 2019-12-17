import React from 'react';
import styled from 'styled-components';
import withSize from 'react-sizeme';
import isEmpty from 'lodash/isEmpty';

import { ValueCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_LAYOUTS, CARD_SIZES, CARD_CONTENT_PADDING } from '../../constants/LayoutConstants';
import { COLORS } from '../../styles/styles';
import Card from '../Card/Card';
import { determineMaxValueCardAttributeCount } from '../../utils/cardUtilityFunctions';

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

const determineAttributeWidth = ({ attributeCount, layout }) => {
  return layout === CARD_LAYOUTS.HORIZONTAL ? `${Math.floor(100 / attributeCount)}%` : '100%';
};

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
  width: ${props => determineAttributeWidth(props)};
  display: flex;
  align-items: center;
  ${props => (props.isVertical ? `` : 'justify-content: space-around;')}
  padding: 0px ${CARD_CONTENT_PADDING}px;
`;

const AttributeSeparator = styled.hr`
  margin: 0;
  border-top: solid 1px #dfe3e6;
  width: 100%;
`;

const Spacer = styled.div`
  flex: 1;
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

  let fontSize = 1.25;
  switch (size) {
    case CARD_SIZES.XSMALL:
    case CARD_SIZES.XSMALLWIDE:
      fontSize = 0.875;
      break;
    case CARD_SIZES.SMALL:
      fontSize = isVertical && attributeCount > 2 ? 0.875 : 1;
      break;
    case CARD_SIZES.TALL:
      fontSize = isVertical && attributeCount > 5 ? 0.875 : 1;
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
  ${props => `line-height: ${determineLabelFontSize(props)}rem;`}
  ${props => `font-size: ${determineLabelFontSize(props)}rem;`};
  text-align: ${props => getLabelAlignment(props)};
  ${props =>
    (props.isVertical || props.size === CARD_SIZES.XSMALL || props.size === CARD_SIZES.SMALL) &&
    `padding-top: 0.25rem;`};
  ${props =>
    !(
      props.isVertical ||
      props.size === CARD_SIZES.XSMALL ||
      props.size === CARD_SIZES.XSMALLWIDE
    ) && `padding-left: 0.5rem`};
  order: ${props => (props.isVertical ? 0 : 2)};
  color: ${COLORS.gray};
  font-weight: lighter;
  ${props => (shouldLabelWrap(props) ? `` : `white-space: nowrap;`)}
  text-overflow: ellipsis;
  overflow: hidden;
  padding-bottom: ${props => (props.isMini ? '0' : '0.25rem')};
  ${props => (props.isVertical ? `width: 100%` : 'width: 50%')};
`;

const determineLayout = (size, attributes, measuredWidth) => {
  let layout = CARD_LAYOUTS.HORIZONTAL;
  switch (size) {
    case CARD_SIZES.XSMALL:
      layout = CARD_LAYOUTS.HORIZONTAL;
      break;
    case CARD_SIZES.XSMALLWIDE:
      layout =
        measuredWidth && measuredWidth < 300 && attributes.length > 1
          ? CARD_LAYOUTS.VERTICAL
          : CARD_LAYOUTS.HORIZONTAL;
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

/** Support either an array of values or an object of values */
export const determineValue = (dataSourceId, values) =>
  Array.isArray(values) ? values[0] && values[0][dataSourceId] : values && values[dataSourceId];

const determineAttributes = (size, attributes) => {
  if (!attributes || !Array.isArray(attributes)) {
    return attributes;
  }
  const attributeCount = determineMaxValueCardAttributeCount(size, attributes.length);
  return attributes.slice(0, attributeCount);
};

const isLabelAboveValue = (size, layout, attributes, measuredSize) => {
  switch (size) {
    case CARD_SIZES.XSMALLWIDE:
      return layout === CARD_LAYOUTS.HORIZONTAL;
    case CARD_SIZES.SMALL:
      return attributes.length === 1 || !measuredSize || measuredSize.width < 300;
    default:
      return !measuredSize || measuredSize.width < 300;
  }
};

const ValueCard = ({ title, content, size, values, isEditable, i18n, ...others }) => {
  const availableActions = {
    expand: false,
    ...others.availableActions,
  };

  return (
    <withSize.SizeMe>
      {({ size: measuredSize }) => {
        const layout = determineLayout(size, content && content.attributes, measuredSize.width);
        const attributes = determineAttributes(size, content && content.attributes);

        // Measure the size to determine whether to render the attribute label above the value
        const isVertical = isLabelAboveValue(
          size,
          layout,
          content ? content.attributes : [],
          measuredSize
        );

        // Determine if we are in "mini mode" (all rendered content in attribute is the same height)
        const isMini = size === CARD_SIZES.XSMALLWIDE && layout === CARD_LAYOUTS.VERTICAL;

        return (
          <Card
            title={title}
            size={size}
            availableActions={availableActions}
            isEmpty={isEmpty(values)}
            isEditable={isEditable}
            i18n={i18n}
            {...others}
          >
            <ContentWrapper layout={layout}>
              {attributes.map((attribute, i) => (
                <React.Fragment key={`fragment-${attribute.dataSourceId}`}>
                  <AttributeWrapper
                    layout={layout}
                    isVertical={isVertical}
                    isSmall={attribute.secondaryValue !== undefined}
                    isMini={isMini}
                    size={size}
                    attributeCount={attributes.length}
                  >
                    <Attribute
                      isVertical={isVertical}
                      layout={layout}
                      isSmall={
                        size === CARD_SIZES.XSMALL &&
                        (attribute.secondaryValue !== undefined || attribute.label !== undefined)
                      }
                      isMini={isMini}
                      alignValue={
                        size === CARD_SIZES.SMALL && attributes.length === 1 ? 'center' : undefined
                      }
                      {...attribute}
                      renderIconByName={others.renderIconByName}
                      size={size} // When the card is in the editable state, we will show a preview
                      value={isEditable ? '--' : determineValue(attribute.dataSourceId, values)}
                      secondaryValue={
                        attribute.secondaryValue && {
                          ...attribute.secondaryValue,
                          value: isEditable // When the card is in the editable state, we will show a preview
                            ? '--'
                            : determineValue(attribute.secondaryValue.dataSourceId, values),
                        }
                      }
                    />
                    {isMini && <Spacer />}
                    <AttributeLabel
                      title={attribute.label}
                      isVertical={isVertical}
                      layout={layout}
                      isMini={isMini}
                      attributeCount={attributes.length}
                      size={size}
                    >
                      {attribute.label}
                    </AttributeLabel>
                  </AttributeWrapper>
                  {i < attributes.length - 1 &&
                  (isVertical || layout === CARD_LAYOUTS.VERTICAL) &&
                  size !== CARD_SIZES.XSMALLWIDE ? (
                    <AttributeWrapper
                      layout={layout}
                      isVertical={isVertical}
                      isSmall={attribute.secondaryValue !== undefined}
                      isMini={isMini}
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
