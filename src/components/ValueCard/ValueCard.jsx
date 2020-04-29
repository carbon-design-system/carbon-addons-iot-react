import React from 'react';
import styled from 'styled-components';
import withSize from 'react-sizeme';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import find from 'lodash/find';

import { ValueCardPropTypes, CardPropTypes } from '../../constants/CardPropTypes';
import { CARD_LAYOUTS, CARD_SIZES, CARD_CONTENT_PADDING } from '../../constants/LayoutConstants';
import { COLORS } from '../../styles/styles';
import Card from '../Card/Card';
import {
  determineMaxValueCardAttributeCount,
  getUpdatedCardSize,
} from '../../utils/cardUtilityFunctions';
import DataStateRenderer from '../Card/DataStateRenderer';

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
  if (layout === CARD_LAYOUTS.HORIZONTAL && !CARD_SIZES.MEDIUMWIDE) {
    return 1.25;
  }

  let fontSize = 1.25;
  switch (size) {
    case CARD_SIZES.SMALL:
    case CARD_SIZES.SMALLWIDE:
      fontSize = 0.875;
      break;
    case CARD_SIZES.MEDIUMTHIN:
    case CARD_SIZES.MEDIUM:
      fontSize = isVertical && attributeCount > 2 ? 0.875 : 1;
      break;
    case CARD_SIZES.LARGETHIN:
      fontSize = isVertical && attributeCount > 5 ? 0.875 : 1;
      break;
    case CARD_SIZES.MEDIUMWIDE:
    default:
  }
  return fontSize;
};

/** * Determines the label alignment */
const getLabelAlignment = ({ size, isVertical, attributeCount }) => {
  if (attributeCount === 1 && size === CARD_SIZES.MEDIUM && isVertical) {
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
  text-align: ${props => (props.shouldDoubleWrap ? 'left' : getLabelAlignment(props))};
  ${props =>
    (props.isVertical || props.size === CARD_SIZES.SMALL || props.size === CARD_SIZES.MEDIUM) &&
    `padding-top: 0.25rem;`};
  ${props =>
    !(props.isVertical || props.size === CARD_SIZES.SMALL || props.size === CARD_SIZES.SMALLWIDE) &&
    `padding-left: 0.5rem`};
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
    case CARD_SIZES.SMALL:
      layout = CARD_LAYOUTS.HORIZONTAL;
      break;
    case CARD_SIZES.SMALLWIDE:
      layout =
        measuredWidth && measuredWidth < 300 && attributes.length > 1
          ? CARD_LAYOUTS.VERTICAL
          : CARD_LAYOUTS.HORIZONTAL;
      break;
    case CARD_SIZES.MEDIUM:
    case CARD_SIZES.MEDIUMTHIN:
      layout = CARD_LAYOUTS.VERTICAL;
      break;
    case CARD_SIZES.LARGETHIN:
    case CARD_SIZES.MEDIUMWIDE:
      if (attributes.length > 2) {
        layout = CARD_LAYOUTS.VERTICAL;
      }
      break;
    case CARD_SIZES.LARGE:
      if (attributes.length > 2) {
        layout = CARD_LAYOUTS.VERTICAL;
      }
      break;

    case CARD_SIZES.LARGEWIDE:
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
export const determineValue = (dataSourceId, values, dataFilter = {}) =>
  Array.isArray(values)
    ? filter(values, dataFilter)[0] && filter(values, dataFilter)[0][dataSourceId]
    : values && values[dataSourceId];

const determineAttributes = (size, attributes) => {
  if (!attributes || !Array.isArray(attributes)) {
    return attributes;
  }
  const attributeCount = determineMaxValueCardAttributeCount(size, attributes.length);
  return attributes.slice(0, attributeCount);
};

const isLabelAboveValue = (size, layout, attributes, measuredSize, shouldDoubleWrap) => {
  switch (size) {
    case CARD_SIZES.SMALLWIDE:
      return layout === CARD_LAYOUTS.HORIZONTAL;
    case CARD_SIZES.MEDIUM:
      return attributes.length === 1 || !measuredSize || measuredSize.width < 300;
    default:
      return shouldDoubleWrap || !measuredSize || measuredSize.width < 300;
  }
};

const ValueCard = ({
  title,
  content,
  size,
  values,
  isEditable,
  i18n,
  dataState,
  id,
  locale,
  ...others
}) => {
  const availableActions = {
    expand: false,
    ...others.availableActions,
  };
  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  const shouldDoubleWrap =
    content.attributes.length === 1 &&
    find(values, value => typeof value === 'string') &&
    Object.keys(values).length === 1;

  return (
    <withSize.SizeMe>
      {({ size: measuredSize }) => {
        const layout = determineLayout(newSize, content && content.attributes, measuredSize.width);
        const attributes = determineAttributes(newSize, content && content.attributes);

        // Measure the size to determine whether to render the attribute label above the value
        const isVertical = isLabelAboveValue(
          newSize,
          layout,
          content ? content.attributes : [],
          measuredSize,
          shouldDoubleWrap
        );

        // Determine if we are in "mini mode" (all rendered content in attribute is the same height)
        const isMini = newSize === CARD_SIZES.SMALLWIDE && layout === CARD_LAYOUTS.VERTICAL;

        return (
          <Card
            title={title}
            size={newSize}
            availableActions={availableActions}
            isEmpty={isEmpty(values) && !dataState}
            isEditable={isEditable}
            i18n={i18n}
            id={id}
            {...others}
          >
            <ContentWrapper layout={layout}>
              {dataState && <DataStateRenderer dataState={dataState} size={newSize} id={id} />}
              {!dataState &&
                attributes.map((attribute, i) => (
                  <React.Fragment
                    key={`fragment-${attribute.dataSourceId}-${JSON.stringify(
                      attribute.dataFilter || {}
                    )}`}
                  >
                    <AttributeWrapper
                      layout={layout}
                      isVertical={isVertical}
                      isSmall={attribute.secondaryValue !== undefined}
                      isMini={isMini}
                      size={newSize}
                      attributeCount={attributes.length}
                    >
                      <Attribute
                        attributeCount={attributes.length}
                        isVertical={isVertical}
                        layout={layout}
                        locale={locale}
                        isSmall={
                          (newSize === CARD_SIZES.SMALL ||
                            newSize === CARD_SIZES.SMALLWIDE ||
                            newSize === CARD_SIZES.MEDIUMTHIN) &&
                          (attribute.secondaryValue !== undefined || attribute.label !== undefined)
                        }
                        isMini={isMini}
                        alignValue={
                          newSize === CARD_SIZES.MEDIUMTHIN && attributes.length === 1
                            ? 'center'
                            : undefined
                        }
                        {...attribute}
                        renderIconByName={others.renderIconByName}
                        size={newSize} // When the card is in the editable state, we will show a preview
                        value={
                          isEditable
                            ? '--'
                            : determineValue(attribute.dataSourceId, values, attribute.dataFilter)
                        }
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
                        size={newSize}
                        shouldDoubleWrap={shouldDoubleWrap}
                      >
                        {attribute.label}
                      </AttributeLabel>
                    </AttributeWrapper>
                    {i < attributes.length - 1 &&
                    (isVertical || layout === CARD_LAYOUTS.VERTICAL) &&
                    newSize !== CARD_SIZES.SMALLWIDE ? (
                      <AttributeWrapper
                        layout={layout}
                        isVertical={isVertical}
                        isSmall={attribute.secondaryValue !== undefined}
                        isMini={isMini}
                        size={newSize}
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
  locale: 'en',
};

export default ValueCard;
