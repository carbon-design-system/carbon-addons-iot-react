import React from 'react';
import { isEmpty } from 'lodash-es';
import classnames from 'classnames';

import { ValueContentPropTypes, CardPropTypes } from '../../constants/CardPropTypes';
import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import {
  getResizeHandles,
  getUpdatedCardSize,
  handleCardVariables,
} from '../../utils/cardUtilityFunctions';

import { BASE_CLASS_NAME, DEFAULT_FONT_SIZE, determineLayout } from './valueCardUtils';
import ValueContent from './ValueContent';

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
      locale={locale}
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
      <ValueContent
        id={id}
        layout={layout}
        dataState={dataState}
        content={content}
        locale={locale}
        title={title}
        customFormatter={customFormatter}
        testId={testID || testId}
        onAttributeClick={onAttributeClick}
        size={newSize}
        values={values}
        isEditable={isEditable}
        fontSize={fontSize}
        isNumberValueCompact={isNumberValueCompact}
        {...others}
      />

      {resizeHandles}
    </Card>
  );
};

ValueCard.propTypes = { ...CardPropTypes, ...ValueContentPropTypes };

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
