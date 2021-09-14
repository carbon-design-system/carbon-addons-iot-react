import React from 'react';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

import { ValueCardPropTypes, CardPropTypes } from '../../constants/CardPropTypes';
import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import {
  getResizeHandles,
  getUpdatedCardSize,
  handleCardVariables,
} from '../../utils/cardUtilityFunctions';
import DataStateRenderer from '../Card/DataStateRenderer';

import {
  BASE_CLASS_NAME,
  PREVIEW_DATA,
  DEFAULT_FONT_SIZE,
  determineLayout,
  determineValue,
} from './valueCardUtils';
import Attribute from './Attribute';

/**
 * This components responsibilities include:
 * Rendering the attribute groups
 * Determining the layout
 * determines the data to render
 */
const ValueCard = ({
  title: titleProp,
  content: contentProp,
  size,
  values: valuesProp,
  isEditable,
  isResizable,
  i18n,
  dataState,
  id,
  locale,
  customFormatter,
  children,
  fontSize,
  isNumberValueCompact,
  testID,
  testId,
  onAttributeClick,
  ...others
}) => {
  const availableActions = {
    expand: false,
    ...others.availableActions,
  };

  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  const resizeHandles = isResizable ? getResizeHandles(children) : [];

  /** Searches for variables and updates the card if it is passed the cardVariables prop */
  const { title, content, values } = handleCardVariables(
    titleProp,
    contentProp,
    valuesProp,
    others
  );

  const layout = determineLayout(newSize);

  const attributeCount = content.attributes.length;

  return (
    <Card
      title={title}
      size={newSize}
      availableActions={availableActions}
      isEmpty={isEmpty(values) && !dataState}
      isEditable={isEditable}
      isResizable={isResizable}
      resizeHandles={resizeHandles}
      i18n={i18n}
      id={id}
      className={classnames({
        // allows attribute overflow scrolling
        [`${BASE_CLASS_NAME}__horizontal`]: layout === CARD_LAYOUTS.HORIZONTAL,
        [`${BASE_CLASS_NAME}__vertical`]: layout === CARD_LAYOUTS.VERTICAL,
      })}
      // TODO: remove deprecated 'testID' in v3.
      testId={testID || testId}
      {...others}
    >
      <div
        className={classnames(`${BASE_CLASS_NAME}__content-wrapper`, {
          [`${BASE_CLASS_NAME}__content-wrapper--vertical`]: layout === CARD_LAYOUTS.VERTICAL,
        })}
      >
        {!dataState ? (
          content.attributes.map((attribute, index) => (
            <Attribute
              key={`fragment-${attribute.dataSourceId}-${JSON.stringify(
                attribute.dataFilter || {}
              )}`}
              attribute={attribute}
              attributeCount={attributeCount}
              layout={layout}
              locale={locale}
              isEditable={isEditable}
              title={title}
              renderIconByName={others.renderIconByName}
              value={
                // When the card is in the editable state, we will show a preview
                isEditable
                  ? PREVIEW_DATA
                  : determineValue(attribute.dataSourceId, values, attribute.dataFilter)
              }
              secondaryValue={
                attribute.secondaryValue && {
                  ...attribute.secondaryValue,
                  // When the card is in the editable state, we will show a preview
                  value: isEditable
                    ? PREVIEW_DATA
                    : determineValue(attribute.secondaryValue.dataSourceId, values),
                }
              }
              customFormatter={customFormatter}
              fontSize={fontSize}
              isNumberValueCompact={isNumberValueCompact}
              // TODO: remove deprecated 'testID' in v3.
              testId={`${testID || testId}-attribute-${index}`}
              onValueClick={onAttributeClick}
            />
          ))
        ) : (
          <DataStateRenderer
            dataState={dataState}
            size={newSize}
            id={id}
            // TODO: remove deprecated 'testID' in v3.
            testId={`${testID || testId}-data-state`}
          />
        )}
      </div>
      {resizeHandles}
    </Card>
  );
};

ValueCard.propTypes = { ...CardPropTypes, ...ValueCardPropTypes };

ValueCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
  locale: 'en',
  dataState: null,
  values: null,
  // default productive-heading-06 font size
  fontSize: DEFAULT_FONT_SIZE,
  cardVariables: null,
  customFormatter: null,
  isNumberValueCompact: false,
  // TODO: fix this default in V3, so that cards are unique not inherited from the base Card
  testId: 'Card',
  onAttributeClick: null,
};

export default ValueCard;
