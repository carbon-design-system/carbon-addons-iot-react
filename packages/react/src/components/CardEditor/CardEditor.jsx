import React from 'react';
import PropTypes from 'prop-types';
import { Apps16 } from '@carbon/icons-react';
import isNil from 'lodash/isNil';

import { Button } from '../../index';
import { settings } from '../../constants/Settings';
import { DASHBOARD_EDITOR_CARD_TYPES } from '../../constants/LayoutConstants';

import CardGalleryList from './CardGalleryList/CardGalleryList';
import CardEditForm from './CardEditForm/CardEditForm';

const { iotPrefix } = settings;

const propTypes = {
  /** card data being edited */
  cardJson: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.shape({
      series: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          dataSourceId: PropTypes.string,
          color: PropTypes.string,
        })
      ),
      xLabel: PropTypes.string,
      yLabel: PropTypes.string,
      unit: PropTypes.string,
      includeZeroOnXaxis: PropTypes.bool,
      includeZeroOnYaxis: PropTypes.bool,
      timeDataSourceId: PropTypes.string,
    }),
    interval: PropTypes.string,
    showLegend: PropTypes.bool,
  }),
  /** Callback function when user clicks Show Gallery */
  onShowGallery: PropTypes.func.isRequired,
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  /** Callback function when card is added from list */
  onAddCard: PropTypes.func.isRequired,
  /** if provided, returns an array of strings which are the dataItems to be allowed
   * on each card
   * getValidDataItems(card, selectedTimeRange)
   */
  getValidDataItems: PropTypes.func,
  /** an array of dataItem string names to be included on each card
   * this prop will be ignored if getValidDataItems is defined
   */
  dataItems: PropTypes.arrayOf(PropTypes.string),
  /** If provided, runs the function when the user clicks submit in the Card code JSON editor
   * onValidateCardJson(cardJson)
   * @returns Array<string> error strings. return empty array if there is no errors
   */
  onValidateCardJson: PropTypes.func,
  supportedCardTypes: PropTypes.arrayOf(PropTypes.string),
  i18n: PropTypes.shape({
    galleryHeader: PropTypes.string,
    addCardButton: PropTypes.string,
    searchPlaceholderText: PropTypes.string,
  }),
};

const defaultProps = {
  cardJson: null,
  i18n: {
    galleryHeader: 'Gallery',
    openGalleryButton: 'Add card',
    addCardButton: 'Add card',
    closeGalleryButton: 'Back',
    openJSONButton: 'Open JSON editor',
    searchPlaceholderText: 'Enter a search',
  },
  getValidDataItems: null,
  dataItems: [],
  supportedCardTypes: Object.keys(DASHBOARD_EDITOR_CARD_TYPES),
  onValidateCardJson: null,
};

const baseClassName = `${iotPrefix}--card-editor`;

const CardEditor = ({
  cardJson,
  onShowGallery,
  onChange,
  onAddCard,
  getValidDataItems,
  dataItems,
  onValidateCardJson,
  supportedCardTypes,
  i18n,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  // show the gallery if no card is being edited
  const showGallery = isNil(cardJson);

  return (
    <div className={baseClassName}>
      {!showGallery ? (
        <div className={`${baseClassName}--header`}>
          <Button
            className="gallery-button"
            kind="ghost"
            size="small"
            renderIcon={Apps16}
            onClick={onShowGallery}
          >
            {mergedI18n.addCardButton}
          </Button>
        </div>
      ) : null}
      <div className={`${baseClassName}--content`}>
        {showGallery ? (
          <CardGalleryList
            onAddCard={onAddCard}
            supportedCardTypes={supportedCardTypes}
            i18n={mergedI18n}
          />
        ) : (
          <CardEditForm
            cardJson={cardJson}
            onChange={onChange}
            dataItems={dataItems}
            getValidDataItems={getValidDataItems}
            onValidateCardJson={onValidateCardJson}
            i18n={mergedI18n}
          />
        )}
      </div>
    </div>
  );
};

CardEditor.propTypes = propTypes;
CardEditor.defaultProps = defaultProps;

export default CardEditor;
