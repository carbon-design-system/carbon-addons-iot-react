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
  cardConfig: PropTypes.shape({
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
      showLegend: PropTypes.bool,
    }),
    interval: PropTypes.string,
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
  /** if provided, returns an array of strings which are the timeRanges to be allowed
   * on each card
   * getValidTimeRanges(card, selectedDataItems)
   */
  getValidTimeRanges: PropTypes.func,
  /** an array of dataItems to be included on each card
   * this prop will be ignored if getValidDataItems is defined
   */
  dataItems: PropTypes.arrayOf(
    PropTypes.shape({
      dataSourceId: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
  /** If provided, runs the function when the user clicks submit in the Card code JSON editor
   * onValidateCardJson(cardConfig)
   * @returns Array<string> error strings. return empty array if there is no errors
   */
  onValidateCardJson: PropTypes.func,
  /**
   * An array of card types that are allowed to show up in the list. These keys will also be used in both icons and i18n
   * ex: [ DASHBOARD_EDITOR_CARD_TYPES.TIMESERIES, DASHBOARD_EDITOR_CARD_TYPES.ALERT, 'CUSTOM', 'ANOTHER_CUSTOM']
   */
  supportedCardTypes: PropTypes.arrayOf(PropTypes.string),
  /**
   * Dictionary of icons that corresponds to both `supportedCardTypes` and `i18n`
   * ex:
   * {
   *  TIMESERIES: <EscalatorDown />,
   *  ALERT: <Code24 />,
   *  CUSTOM: <Basketball32 />,
   *  ANOTHER_CUSTOM: <Automobile32 />,
   * }
   */
  icons: PropTypes.objectOf(PropTypes.node),
  /**
   * i18n must include the label for each `supportedCardTypes`
   * ex:
   * [
   *  TIMESERIES: 'ITEM 1',
   *  ALERT: 'ITEM 8',
   *  CUSTOM: 'ITEM 10',
   *  COOL_NEW_CARD: 'Missing Icon',
   * ]
   */
  i18n: PropTypes.shape({
    galleryHeader: PropTypes.string,
    addCardButton: PropTypes.string,
    searchPlaceHolderText: PropTypes.string,
  }),
  currentBreakpoint: PropTypes.string,
  /** Id that can be used for testing */
  testID: PropTypes.string,
};

const defaultProps = {
  cardConfig: null,
  i18n: {
    galleryHeader: 'Gallery',
    openGalleryButton: 'Add card',
    addCardButton: 'Add card',
    closeGalleryButton: 'Back',
    openJSONButton: 'Open JSON editor',
    searchPlaceHolderText: 'Enter a search',
  },
  getValidDataItems: null,
  getValidTimeRanges: null,
  dataItems: [],
  availableDimensions: {},
  supportedCardTypes: Object.keys(DASHBOARD_EDITOR_CARD_TYPES),
  icons: null,
  onValidateCardJson: null,
  currentBreakpoint: 'xl',
  testID: 'card-editor',
};

const baseClassName = `${iotPrefix}--card-editor`;

const CardEditor = ({
  cardConfig,
  onShowGallery,
  onChange,
  onAddCard,
  getValidDataItems,
  getValidTimeRanges,
  dataItems,
  onValidateCardJson,
  supportedCardTypes,
  availableDimensions,
  icons,
  i18n,
  currentBreakpoint,
  testID,
  // eslint-disable-next-line react/prop-types
  onFetchDynamicDemoHotspots,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  // show the gallery if no card is being edited
  const showGallery = isNil(cardConfig);

  return (
    <div className={baseClassName} data-testid={testID}>
      {!showGallery ? (
        <div className={`${baseClassName}--header`}>
          <Button
            className="gallery-button"
            kind="ghost"
            size="small"
            renderIcon={Apps16}
            onClick={onShowGallery}>
            {mergedI18n.addCardButton}
          </Button>
        </div>
      ) : (
        <div className={`${baseClassName}--header`}>
          <h2 className={`${baseClassName}--header--title`}>
            {mergedI18n.galleryHeader}
          </h2>
        </div>
      )}
      <div className={`${baseClassName}--content`}>
        {showGallery ? (
          <CardGalleryList
            icons={icons}
            onAddCard={onAddCard}
            supportedCardTypes={supportedCardTypes}
            i18n={mergedI18n}
            data-testid={`${testID}-card-gallery-list`}
          />
        ) : (
          <CardEditForm
            cardConfig={cardConfig}
            onChange={onChange}
            dataItems={dataItems}
            getValidDataItems={getValidDataItems}
            getValidTimeRanges={getValidTimeRanges}
            onValidateCardJson={onValidateCardJson}
            availableDimensions={availableDimensions}
            i18n={mergedI18n}
            currentBreakpoint={currentBreakpoint}
            onFetchDynamicDemoHotspots={onFetchDynamicDemoHotspots}
          />
        )}
      </div>
    </div>
  );
};

CardEditor.propTypes = propTypes;
CardEditor.defaultProps = defaultProps;

export default CardEditor;
