import React from 'react';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

import {
  ValueCardPropTypes,
  CardPropTypes,
} from '../../constants/CardPropTypes';
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
      {...others}>
      <div
        className={classnames(`${BASE_CLASS_NAME}__content-wrapper`, {
          [`${BASE_CLASS_NAME}__content-wrapper--horizontal`]:
            layout === CARD_LAYOUTS.HORIZONTAL,
          [`${BASE_CLASS_NAME}__content-wrapper--vertical`]:
            layout === CARD_LAYOUTS.VERTICAL,
        })}>
        {!dataState ? (
          content.attributes.map((attribute) => (
            <Attribute
              attribute={attribute}
              layout={layout}
              locale={locale}
              isEditable={isEditable}
              title={title}
              renderIconByName={others.renderIconByName}
              value={
                // When the card is in the editable state, we will show a preview
                isEditable
                  ? PREVIEW_DATA
                  : determineValue(
                      attribute.dataSourceId,
                      values,
                      attribute.dataFilter
                    )
              }
              secondaryValue={
                attribute.secondaryValue && {
                  ...attribute.secondaryValue,
                  // When the card is in the editable state, we will show a preview
                  value: isEditable
                    ? PREVIEW_DATA
                    : determineValue(
                        attribute.secondaryValue.dataSourceId,
                        values
                      ),
                }
              }
              customFormatter={customFormatter}
              fontSize={fontSize}
              isNumberValueCompact={isNumberValueCompact}
            />
          ))
        ) : (
          <DataStateRenderer dataState={dataState} size={newSize} id={id} />
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
  fontSize: 42,
  cardVariables: null,
  customFormatter: null,
  isNumberValueCompact: false,
};

export default ValueCard;
