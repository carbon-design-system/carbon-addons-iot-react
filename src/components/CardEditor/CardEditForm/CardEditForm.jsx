import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Code16 } from '@carbon/icons-react';
import isEmpty from 'lodash/isEmpty';

import {
  CARD_SIZES,
  CARD_DIMENSIONS,
  ALLOWED_CARD_SIZES_PER_TYPE,
} from '../../../constants/LayoutConstants';
import { settings } from '../../../constants/Settings';
import {
  Tabs,
  Tab,
  Button,
  TextArea,
  TextInput,
  Dropdown,
} from '../../../index';
import CardCodeEditor from '../../CardCodeEditor/CardCodeEditor';

const { iotPrefix } = settings;

const propTypes = {
  /** card data value */
  cardJson: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  /** If provided, runs the function when the user clicks submit in the Card code JSON editor
   * onValidateCardJson(cardJson)
   * @returns Array<string> error strings. return empty array if there is no errors
   */
  onValidateCardJson: PropTypes.func,
  i18n: PropTypes.shape({
    openEditorButton: PropTypes.string,
  }),
};

const defaultProps = {
  cardJson: {},
  i18n: {
    openEditorButton: 'Open JSON editor',
    contentTabLabel: 'Content',
    cardSize_SMALL: 'Small',
    cardSize_SMALLWIDE: 'Small wide',
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
    // additional card type names can be provided using the convention of `cardType_TYPE`
  },
  onValidateCardJson: null,
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
 * Checks for JSON form errors
 * @param {Object} card JSON text input
 * @param {Function} setError
 * @param {Function} onValidateCardJson
 * @param {Function} onChange
 * @param {Function} setShowEditor
 */
export const handleSubmit = (
  card,
  setError,
  onValidateCardJson,
  onChange,
  setShowEditor
) => {
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
    onChange(JSON.parse(card));
    setShowEditor(false);
    return true;
  }

  setError(allErrors.join('. '));
  return false;
};

const CardEditForm = ({ cardJson, onChange, onValidateCardJson, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const [showEditor, setShowEditor] = useState(false);
  const [modalData, setModalData] = useState();

  const baseClassName = `${iotPrefix}--card-edit-form`;

  const commonFormItems = (
    <>
      <div className={`${baseClassName}--input`}>
        <TextInput
          id="title"
          labelText="Card title"
          light
          onChange={(evt) => onChange({ ...cardJson, title: evt.target.value })}
          value={cardJson.title}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <TextArea
          id="description"
          labelText="Description (Optional)"
          light
          onChange={(evt) =>
            onChange({ ...cardJson, description: evt.target.value })
          }
          value={cardJson.description}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <Dropdown
          id="size"
          label="Select a size"
          direction="bottom"
          itemToString={(item) => item.text}
          items={(
            ALLOWED_CARD_SIZES_PER_TYPE[cardJson.type] ??
            Object.keys(CARD_SIZES)
          ).map((size) => {
            return {
              id: size,
              text: getCardSizeText(size, mergedI18n),
            };
          })}
          light
          selectedItem={{
            id: cardJson.size,
            text: getCardSizeText(cardJson.size, mergedI18n),
          }}
          onChange={({ selectedItem }) => {
            onChange({ ...cardJson, size: selectedItem.id });
          }}
          titleText="Size"
        />
      </div>
    </>
  );

  return (
    <>
      {showEditor ? (
        <CardCodeEditor
          onSubmit={(card, setError) =>
            handleSubmit(
              card,
              setError,
              onValidateCardJson,
              onChange,
              setShowEditor
            )
          }
          onClose={() => setShowEditor(false)}
          initialValue={modalData}
          i18n={{
            errorTitle: 'Error:',
            modalTitle: 'Edit card JSON configuration',
            modalLabel: 'Card editor',
            modalHelpText:
              'The JSON definition for this card is provided below.  You can modify this data directly to update the card configuration.',
            modalIconDescription: 'Close',
          }}
        />
      ) : null}
      <div className={baseClassName}>
        <Tabs>
          <Tab label={mergedI18n.contentTabLabel}>
            <div className={`${baseClassName}--content`}>{commonFormItems}</div>
          </Tab>
        </Tabs>
        <div className={`${baseClassName}--footer`}>
          <Button
            kind="tertiary"
            size="small"
            renderIcon={Code16}
            onClick={() => {
              setModalData(JSON.stringify(cardJson, null, 4));
              setShowEditor(true);
            }}>
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
