import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Apps16, Data_116 as Data116 } from '@carbon/icons-react';
import isNil from 'lodash/isNil';
import warning from 'warning';

import Button from '../Button';
import { settings } from '../../constants/Settings';
import { DASHBOARD_EDITOR_CARD_TYPES } from '../../constants/LayoutConstants';
import deprecate from '../../internal/deprecate';

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
    content: PropTypes.oneOfType([
      PropTypes.shape({
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
      // custom card content is a function
      PropTypes.func,
    ]),
    interval: PropTypes.string,
  }),
  /** Callback function when user clicks Show Gallery */
  onShowGallery: PropTypes.func.isRequired,
  /** Callback function when form data changes, passes the updated card configuration */
  onChange: PropTypes.func.isRequired,
  /** Callback function when card is added from list */
  onAddCard: PropTypes.func.isRequired,
  /** optional function passes the card props being edited and you can updated the card props
   * This allows you to add things to the edit form that are not in the main card JSON.  This is a better
   * way to add custom editor props to the Card.
   */
  onRenderCardEditForm: PropTypes.func,
  /** if provided, allows the consumer to make changes to the cardConfig for preview in the JSON editor modal.
   * onCardJsonPreview(card)
   */
  onCardJsonPreview: PropTypes.func,
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
  /** if provided, returns an object where the keys are available dimensions which are the dimensions to be allowed
   * on each card
   * ex response: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   * getValidDimensions(card)
   */
  getValidDimensions: PropTypes.func,
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
    editDataItems: PropTypes.string,
  }),
  currentBreakpoint: PropTypes.string,
  isSummaryDashboard: PropTypes.bool,
  // TODO: remove deprecated testID in v3
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  /** Id that can be used for testing */
  testId: PropTypes.string,
  /** optional link href's for each card type that will appear in a tooltip */
  dataSeriesItemLinks: PropTypes.shape({
    simpleBar: PropTypes.string,
    groupedBar: PropTypes.string,
    stackedBar: PropTypes.string,
    timeSeries: PropTypes.string,
    value: PropTypes.string,
    custom: PropTypes.string,
    table: PropTypes.string,
    image: PropTypes.string,
  }),
  onEditDataItems: PropTypes.func,
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
    editDataItems: 'Edit data items',
  },
  getValidDimensions: null,
  getValidDataItems: null,
  getValidTimeRanges: null,
  onCardJsonPreview: null,
  onRenderCardEditForm: null,
  dataItems: [],
  availableDimensions: {},
  supportedCardTypes: Object.keys(DASHBOARD_EDITOR_CARD_TYPES),
  icons: null,
  onValidateCardJson: null,
  currentBreakpoint: 'xl',
  isSummaryDashboard: false,
  testId: 'card-editor',
  dataSeriesItemLinks: null,
  onEditDataItems: null,
};

const baseClassName = `${iotPrefix}--card-editor`;

const CardEditor = ({
  cardConfig,
  isSummaryDashboard,
  onShowGallery,
  onChange,
  onAddCard,
  getValidDataItems,
  getValidTimeRanges,
  dataItems,
  onValidateCardJson,
  onCardJsonPreview,
  supportedCardTypes,
  availableDimensions: availableDimensionsProp,
  getValidDimensions,
  onRenderCardEditForm,
  icons,
  i18n,
  currentBreakpoint,
  // TODO: remove deprecated testID in v3
  testID,
  testId,
  dataSeriesItemLinks,
  // eslint-disable-next-line react/prop-types
  onFetchDynamicDemoHotspots,
  onEditDataItems,
}) => {
  React.useEffect(() => {
    if (__DEV__) {
      warning(
        false,
        'The `CardEditor` is an experimental component and could be lacking unit test and documentation. Be aware that minor version bumps could introduce breaking changes. For the reasons listed above use of this component in production is highly discouraged'
      );
    }
  }, []);
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);

  const availableDimensions = useMemo(
    () => (getValidDimensions ? getValidDimensions(cardConfig) : availableDimensionsProp),
    [availableDimensionsProp, cardConfig, getValidDimensions]
  );

  // show the gallery if no card is being edited
  const showGallery = isNil(cardConfig);

  const finalCardToEdit = useMemo(
    () => (onRenderCardEditForm && cardConfig ? onRenderCardEditForm(cardConfig) : cardConfig),
    [cardConfig, onRenderCardEditForm]
  );
  return (
    <div
      className={baseClassName}
      // TODO: remove deprecated testID in v3
      data-testid={testID || testId}
    >
      {showGallery ? (
        <div className={`${baseClassName}--header`}>
          <h2 className={`${baseClassName}--header--title`}>{mergedI18n.galleryHeader}</h2>
        </div>
      ) : null}
      <div className={`${baseClassName}--content`}>
        {showGallery ? (
          <CardGalleryList
            icons={icons}
            onAddCard={onAddCard}
            supportedCardTypes={supportedCardTypes}
            i18n={mergedI18n}
            // TODO: remove deprecated testID in v3
            testId={`${testID || testId}-card-gallery-list`}
          />
        ) : (
          <CardEditForm
            cardConfig={finalCardToEdit}
            isSummaryDashboard={isSummaryDashboard}
            onChange={onChange}
            dataItems={dataItems}
            getValidDataItems={getValidDataItems}
            getValidTimeRanges={getValidTimeRanges}
            onValidateCardJson={onValidateCardJson}
            onCardJsonPreview={onCardJsonPreview}
            availableDimensions={availableDimensions}
            i18n={mergedI18n}
            currentBreakpoint={currentBreakpoint}
            dataSeriesItemLinks={dataSeriesItemLinks}
            onFetchDynamicDemoHotspots={onFetchDynamicDemoHotspots}
          />
        )}
      </div>
      {showGallery ? null : (
        <div className={`${baseClassName}--footer`}>
          <Button
            kind="ghost"
            size="small"
            renderIcon={Apps16}
            onClick={onShowGallery}
            // TODO: remove deprecated testID in v3 and pass testId to overrride defaults
            // testId={`${testID || testId}-add-card-button`}
          >
            {mergedI18n.addCardButton}
          </Button>
        </div>
      )}
      {isSummaryDashboard ? (
        <div className={`${baseClassName}--footer`}>
          <Button
            key="edit-data-item"
            kind="ghost"
            size="small"
            renderIcon={Data116}
            onClick={onEditDataItems}
            iconDescription={mergedI18n.editDataItems}
            // TODO: remove deprecated testID in v3
            // testId={`${testID || testId}-edit-button`}
          >
            {mergedI18n.editDataItems}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

CardEditor.propTypes = propTypes;
CardEditor.defaultProps = defaultProps;

export default CardEditor;
