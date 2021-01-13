import React from 'react';
import withSize from 'react-sizeme';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import find from 'lodash/find';
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
  baseClassName,
  determineLayout,
  determineValue,
  shouldLabelWrap,
} from './valueCardUtils';
import Attribute from './Attribute';

/**
 * This components responsibilities include:
 * Rendering the attribute groups
 * Determining the layout
 * determining the wrapping rules (should be moved to attribute)
 * determining the position of the label (should be moved to attribute)
 * determines the data to render
 * completing the card variables
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
  ...others
}) => {
  const availableActions = {
    expand: false,
    ...others.availableActions,
  };

  const resizeHandles = isResizable ? getResizeHandles(children) : [];

  /** Searches for variables and updates the card if it is passed the cardVariables prop */
  const { title, content, values } = handleCardVariables(
    titleProp,
    contentProp,
    valuesProp,
    others
  );

  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  const shouldDoubleWrap =
    content.attributes.length === 1 &&
    find(values, (value) => typeof value === 'string') &&
    Object.keys(values).length === 1;

  return (
    <withSize.SizeMe>
      {({ size: measuredSize }) => {
        const layout = determineLayout(
          newSize,
          content && content.attributes,
          measuredSize.width
        );

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
            {...others}>
            <div
              className={classnames(`${baseClassName}__content-wrapper`, {
                [`${baseClassName}__content-wrapper__horizontal`]:
                  layout === CARD_LAYOUTS.HORIZONTAL,
                [`${baseClassName}__content-wrapper__vertical`]:
                  layout === CARD_LAYOUTS.VERTICAL,
              })}>
              {!isNil(dataState) ? (
                <DataStateRenderer
                  dataState={dataState}
                  size={newSize}
                  id={id}
                />
              ) : (
                content.attributes.map((attribute, attrIndex) => (
                  <React.Fragment
                    key={`fragment-${attribute.dataSourceId}-${JSON.stringify(
                      attribute.dataFilter || {}
                    )}`}>
                    <div className={`${baseClassName}__attribute-wrapper`}>
                      <Attribute
                        attributeCount={content.attributes.length}
                        layout={layout}
                        locale={locale}
                        isEditable={isEditable}
                        {...attribute}
                        renderIconByName={others.renderIconByName}
                        size={newSize} // When the card is in the editable state, we will show a preview
                        value={
                          isEditable
                            ? '--'
                            : determineValue(
                                attribute.dataSourceId,
                                values,
                                attribute.dataFilter
                              )
                        }
                        secondaryValue={
                          attribute.secondaryValue && {
                            ...attribute.secondaryValue,
                            value: isEditable // When the card is in the editable state, we will show a preview
                              ? '--'
                              : determineValue(
                                  attribute.secondaryValue.dataSourceId,
                                  values
                                ),
                          }
                        }
                        customFormatter={customFormatter}
                      />
                      <div
                        className={classnames(
                          `${baseClassName}__attribute-label`,
                          {
                            [`${baseClassName}__attribute-label--small-medium`]:
                              size === CARD_SIZES.SMALL ||
                              size === CARD_SIZES.MEDIUM,
                            [`${baseClassName}__attribute-label--not-small`]:
                              size === CARD_SIZES.SMALL ||
                              size === CARD_SIZES.SMALLWIDE,
                            [`${baseClassName}__attribute-label--wrappable`]: !shouldLabelWrap(
                              title
                            ),
                            [`${baseClassName}__attribute-label--double-wrap`]: shouldDoubleWrap,
                          }
                        )}>
                        {attribute.label}
                      </div>
                    </div>
                    {attrIndex < content.attributes.length - 1 &&
                    layout === CARD_LAYOUTS.VERTICAL &&
                    newSize !== CARD_SIZES.SMALLWIDE ? (
                      <div className={`${baseClassName}__attribute-wrapper`}>
                        <hr
                          className={`${baseClassName}__attribute-separator`}
                        />
                      </div>
                    ) : null}
                  </React.Fragment>
                ))
              )}
            </div>
            {resizeHandles}
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
  dataState: null,
  values: null,
};

export default ValueCard;
