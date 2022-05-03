import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Code16 } from '@carbon/icons-react';
import { isEmpty, omit, pick } from 'lodash-es';

import { CARD_DIMENSIONS, CARD_TYPES } from '../../../constants/LayoutConstants';
import { settings } from '../../../constants/Settings';
import Button from '../../Button';
import { Tabs, Tab } from '../../Tabs';
import CardCodeEditor from '../../CardCodeEditor/CardCodeEditor';
import { DataItemsPropTypes } from '../../DashboardEditor/editorUtils';

import CardEditFormContent from './CardEditFormContent';
import CardEditFormSettings from './CardEditFormSettings';

const { iotPrefix } = settings;

const propTypes = {
  /** card data value */
  cardConfig: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    openEditorButton: PropTypes.string,
    contentTabLabel: PropTypes.string,
    settingsTabLabel: PropTypes.string,
    cardSize_SMALL: PropTypes.string,
    cardSize_SMALLWIDE: PropTypes.string,
    cardSize_SMALLFULL: PropTypes.string,
    cardSize_MEDIUM: PropTypes.string,
    cardSize_MEDIUMTHIN: PropTypes.string,
    cardSize_MEDIUMWIDE: PropTypes.string,
    cardSize_LARGE: PropTypes.string,
    cardSize_LARGETHIN: PropTypes.string,
    cardSize_LARGEWIDE: PropTypes.string,
    chartType_BAR: PropTypes.string,
    chartType_LINE: PropTypes.string,
    barChartType_SIMPLE: PropTypes.string,
    barChartType_GROUPED: PropTypes.string,
    barChartType_STACKED: PropTypes.string,
    barChartLayout_HORIZONTAL: PropTypes.string,
    barChartLayout_VERTICAL: PropTypes.string,

    errorTitle: PropTypes.string,
    modalTitle: PropTypes.string,
    modalLabel: PropTypes.string,
    modalHelpText: PropTypes.string,
    modalIconDescription: PropTypes.string,
  }),
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
  dataItems: DataItemsPropTypes,
  /** if provided, allows the consumer to make changes to the cardConfig for preview in the JSON editor modal.
   * onCardJsonPreview(card)
   */
  onCardJsonPreview: PropTypes.func,
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
  /** If provided, runs the function when the user clicks submit in the Card code JSON editor
   * onValidateCardJson(cardConfig)
   * @returns Array<string> error strings. return empty array if there is no errors
   */
  onValidateCardJson: PropTypes.func,
  currentBreakpoint: PropTypes.string,
  isSummaryDashboard: PropTypes.bool,
  testID: PropTypes.string,
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
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    openEditorButton: 'Open JSON editor',
    contentTabLabel: 'Content',
    settingsTabLabel: 'Settings',
    cardSize_SMALL: 'Small',
    cardSize_SMALLWIDE: 'Small wide',
    cardSize_SMALLFULL: 'Small full',
    cardSize_MEDIUM: 'Medium',
    cardSize_MEDIUMTHIN: 'Medium thin',
    cardSize_MEDIUMWIDE: 'Medium wide',
    cardSize_LARGE: 'Large',
    cardSize_LARGETHIN: 'Large thin',
    cardSize_LARGEWIDE: 'Large wide',
    chartType_BAR: 'Bar',
    chartType_LINE: 'Line',
    barChartType_SIMPLE: 'Simple',
    barChartType_GROUPED: 'Grouped',
    barChartType_STACKED: 'Stacked',
    barChartLayout_HORIZONTAL: 'Horizontal',
    barChartLayout_VERTICAL: 'Vertical',
    errorTitle: 'Error:',
    modalTitle: 'Edit card JSON configuration',
    modalLabel: 'Card editor',
    modalHelpText:
      'The JSON definition for this card is provided below.  You can modify this data directly to update the card configuration.',
    modalIconDescription: 'Close',
  },
  getValidDataItems: null,
  getValidTimeRanges: null,
  onCardJsonPreview: null,
  dataItems: [],
  availableDimensions: {},
  onValidateCardJson: null,
  currentBreakpoint: 'xl',
  isSummaryDashboard: false,
  testID: 'card-edit-form',
  dataSeriesItemLinks: null,
};

/**
 * Returns card size and dimensions labels
 * @param {string} size
 * @param {Object<string>} i18n
 * @returns {string}
 */
export const getCardSizeText = (size, i18n) => {
  const sizeName = i18n[`cardSize_${size}`];
  const sizeDimensions = `(${CARD_DIMENSIONS[size].lg.w}x${CARD_DIMENSIONS[size].lg.h})`;
  return `${sizeName} ${sizeDimensions}`;
};

/**
 * Returns errors of basic JSON syntax
 * Must not be empty string, Must be valid JSON
 * @param {Object} card JSON currently being edited
 * @returns {Array<string>} error strings
 */
export const basicCardValidation = (card) => {
  const errors = [];
  try {
    const json = JSON.parse(card);
    if (!json || typeof json !== 'object') {
      errors.push(`${card.substring(0, 8)} is not valid JSON`);
    }
  } catch (e) {
    errors.push(e.message);
  }
  return errors;
};

/**
 * removes properties needed for the editor that we don't want the user to be able to modify
 * @param {Object} card JSON currently being edited
 * @returns {Object} card with omitted attributes
 */
export const hideCardPropertiesForEditor = (card) => {
  let attributes;
  let series;
  let columns;
  if (card.content?.attributes) {
    attributes = card.content.attributes.map((attribute) =>
      omit(attribute, ['aggregationMethods', 'grain', 'downSampleMethods'])
    );
  }
  if (card.content?.series) {
    series = card.content.series.map((attribute) =>
      omit(attribute, ['aggregationMethods', 'grain', 'downSampleMethods'])
    );
  }
  if (card.content?.columns) {
    columns = card.content.columns.map((column) =>
      omit(column, ['aggregationMethods', 'grain', 'downSampleMethods'])
    );
  }
  // Need to exclued content for custom cards because the card's JSX element lives on it in this case
  if (!CARD_TYPES.hasOwnProperty(card.type) || card.type === CARD_TYPES.CUSTOM) {
    return omit(card, 'content');
  }
  return omit(
    attributes // VALUE CARD
      ? { ...card, content: { ...card.content, attributes } }
      : series // TIMESERIES AND BAR CHART CARDS
      ? { ...card, content: { ...card.content, series } }
      : card.values?.hotspots // IMAGE CARD
      ? {
          ...card,
          values: {
            ...card.values,
            hotspots: card.values?.hotspots?.map((hotspot) => ({
              ...hotspot,
              content: {
                ...hotspot.content,
                attributes: hotspot.content?.attributes?.map((attribute) =>
                  omit(attribute, ['aggregationMethods', 'grain'])
                ),
              },
            })),
          },
        }
      : columns // TABLE CARD
      ? { ...card, content: { ...card.content, columns } }
      : card,
    ['content.src', 'content.imgState', 'i18n', 'validateUploadedImage']
  );
};

/**
 * Checks for JSON form errors
 * @param {Object} card JSON text input
 * @param {Function} setError
 * @param {Function} onValidateCardJson
 * @param {Function} onChange
 * @param {Function} setShowEditor
 */
export const handleSubmit = (card, id, setError, onValidateCardJson, onChange, setShowEditor) => {
  // first validate basic JSON syntax
  const basicErrors = basicCardValidation(card);
  // second validate the consumer's custom function if provided
  let customValidationErrors = [];
  if (onValidateCardJson) {
    customValidationErrors = onValidateCardJson(card);
  }
  const allErrors = basicErrors.concat(customValidationErrors);
  // then submit
  if (isEmpty(allErrors)) {
    onChange({ ...JSON.parse(card), id });
    setShowEditor(false);
    return true;
  }

  setError(allErrors.join('. '));
  return false;
};

const CardEditForm = ({
  cardConfig,
  isSummaryDashboard,
  onChange,
  i18n,
  dataItems,
  onValidateCardJson,
  onCardJsonPreview,
  getValidDataItems,
  getValidTimeRanges,
  currentBreakpoint,
  availableDimensions,
  testID,
  dataSeriesItemLinks,
  // eslint-disable-next-line react/prop-types
  onFetchDynamicDemoHotspots,
}) => {
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);
  const [showEditor, setShowEditor] = useState(false);
  const [modalData, setModalData] = useState();

  const { id } = cardConfig;
  const baseClassName = `${iotPrefix}--card-edit-form`;

  const isCustomCardWithNoSettings =
    (cardConfig.type === CARD_TYPES.CUSTOM || !CARD_TYPES.hasOwnProperty(cardConfig.type)) &&
    !cardConfig.renderEditSettings;

  return (
    <>
      {showEditor ? (
        <CardCodeEditor
          onSubmit={(card, setError) =>
            handleSubmit(card, id, setError, onValidateCardJson, onChange, setShowEditor)
          }
          onClose={() => setShowEditor(false)}
          initialValue={modalData}
          i18n={pick(
            mergedI18n,
            'errorTitle',
            'modalTitle',
            'modalLabel',
            'modalHelpText',
            'modalIconDescription',
            'copyBtnDescription',
            'copyBtnFeedBack',
            'expandBtnLabel',
            'modalPrimaryButtonLabel',
            'modalSecondaryButtonLabel'
          )}
        />
      ) : null}
      <div className={baseClassName}>
        <Tabs scrollIntoView={false}>
          <Tab label={mergedI18n.contentTabLabel}>
            <CardEditFormContent
              cardConfig={cardConfig}
              onChange={onChange}
              isSummaryDashboard={isSummaryDashboard}
              i18n={mergedI18n}
              dataItems={dataItems}
              availableDimensions={availableDimensions}
              getValidDataItems={getValidDataItems}
              getValidTimeRanges={getValidTimeRanges}
              currentBreakpoint={currentBreakpoint}
              dataSeriesItemLinks={dataSeriesItemLinks}
              onFetchDynamicDemoHotspots={onFetchDynamicDemoHotspots}
            />
          </Tab>
          {!isCustomCardWithNoSettings ? (
            <Tab label={mergedI18n.settingsTabLabel}>
              <CardEditFormSettings
                availableDimensions={availableDimensions}
                cardConfig={cardConfig}
                onChange={onChange}
                i18n={mergedI18n}
                getValidDataItems={getValidDataItems}
              />
            </Tab>
          ) : null}
        </Tabs>
        <div className={`${baseClassName}--footer`}>
          <Button
            testId={`${testID}-open-editor-button`}
            kind="ghost"
            size="small"
            renderIcon={Code16}
            onClick={() => {
              const cardConfigForModal = onCardJsonPreview
                ? onCardJsonPreview(hideCardPropertiesForEditor(cardConfig))
                : hideCardPropertiesForEditor(cardConfig);
              setModalData(JSON.stringify(cardConfigForModal, null, 4));
              setShowEditor(true);
            }}
          >
            {mergedI18n.openEditorButton}
          </Button>
        </div>
      </div>
    </>
  );
};

CardEditForm.propTypes = propTypes;
CardEditForm.defaultProps = defaultProps;

export default CardEditForm;
