/* eslint-disable react/default-props-match-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import { ValueContentPropTypes } from '../../constants/CardPropTypes';
import DataStateRenderer from '../Card/DataStateRenderer';

import { BASE_CLASS_NAME, DEFAULT_FONT_SIZE, determineValue } from './valueCardUtils';
import Attribute from './Attribute';

const propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  layout: PropTypes.oneOf(['HORIZONTAL', 'VERTICAL']),
  locale: PropTypes.string,
  isEditable: PropTypes.bool,
  ...ValueContentPropTypes,
};

const defaultProps = {
  id: 'valueContent-id',
  title: '',
  layout: 'VERTICAL',
  locale: 'en',
  isEditable: false,
  dataState: null,
  values: null,
  fontSize: DEFAULT_FONT_SIZE,
  customFormatter: null,
  isNumberValueCompact: false,
  testId: 'ValueContent',
  onAttributeClick: null,
  size: CARD_SIZES.MEDIUM,
};

const ValueContent = ({
  id,
  title,
  content,
  values,
  layout,
  dataState,
  locale,
  isEditable,
  customFormatter,
  fontSize,
  isNumberValueCompact,
  testId,
  onAttributeClick,
  size,
  ...others
}) => {
  const attributeCount = content.attributes.length;

  return (
    <div
      className={classnames(`${BASE_CLASS_NAME}__content-wrapper`, {
        [`${BASE_CLASS_NAME}__content-wrapper--vertical`]: layout === CARD_LAYOUTS.VERTICAL,
      })}
    >
      {!dataState ? (
        content.attributes.map((attribute, index) => (
          <Attribute
            key={`fragment-${attribute.dataSourceId}-${JSON.stringify(attribute.dataFilter || {})}`}
            attribute={attribute}
            attributeCount={attributeCount}
            layout={layout}
            locale={locale}
            isEditable={isEditable}
            title={title}
            renderIconByName={others.renderIconByName}
            value={determineValue(attribute.dataSourceId, values, attribute.dataFilter)}
            secondaryValue={
              attribute.secondaryValue && {
                ...attribute.secondaryValue,
                value: determineValue(attribute.secondaryValue.dataSourceId, values),
              }
            }
            customFormatter={customFormatter}
            fontSize={fontSize}
            isNumberValueCompact={isNumberValueCompact}
            testId={`${testId}-attribute-${index}`}
            onValueClick={onAttributeClick}
          />
        ))
      ) : (
        <DataStateRenderer
          dataState={dataState}
          size={size}
          id={id}
          testId={`${testId}-data-state`}
        />
      )}
    </div>
  );
};

ValueContent.propTypes = propTypes;
ValueContent.defaultProps = defaultProps;
export default ValueContent;
