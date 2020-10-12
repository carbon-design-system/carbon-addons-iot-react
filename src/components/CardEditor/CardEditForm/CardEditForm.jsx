import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Code16 } from '@carbon/icons-react';

import {
  CARD_SIZES,
  CARD_DIMENSIONS,
  ALLOWED_CARD_SIZES_PER_TYPE,
} from '../../../constants/LayoutConstants';
import { settings } from '../../../constants/Settings';
import { Tabs, Tab, Button, TextArea, TextInput, Dropdown } from '../../../index';
import CardCodeEditor from '../../CardCodeEditor/CardCodeEditor';

const { iotPrefix } = settings;

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
};

const propTypes = {
  /** card data value */
  cardJson: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    openEditorButton: PropTypes.string,
  }),
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
 * Checks for JSON form errors
 * @param {Object} val card JSON text input
 * @param {Function} setError
 * @param {Function} onChange
 * @param {Function} setShowEditor
 */
export const handleSubmit = (val, setError, onChange, setShowEditor) => {
  try {
    let error = false;
    if (val === '') {
      setError('JSON value must not be an empty string');
      error = true;
    } else {
      const json = JSON.parse(val);
      // Check for non-exception throwing cases (false, 1234, null)
      if (json && typeof json === 'object') {
        onChange(json);
        setShowEditor(false);
      }
      setError(`${val.substring(0, 8)} is not valid JSON`);
      error = true;
    }
    if (!error) {
      setError(false);
      return true;
    }
  } catch (e) {
    setError(e.message);
    return false;
  }
  return false;
};

const CardEditForm = ({ cardJson, onChange, i18n }) => {
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
          onChange={evt => onChange({ ...cardJson, title: evt.target.value })}
          value={cardJson.title}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <TextArea
          id="description"
          labelText="Description (Optional)"
          light
          onChange={evt => onChange({ ...cardJson, description: evt.target.value })}
          value={cardJson.description}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <Dropdown
          id="size"
          label="Select a size"
          direction="bottom"
          itemToString={item => item.text}
          items={(ALLOWED_CARD_SIZES_PER_TYPE[cardJson.type] ?? Object.keys(CARD_SIZES)).map(
            size => {
              return {
                id: size,
                text: getCardSizeText(size, mergedI18n),
              };
            }
          )}
          light
          selectedItem={{ id: cardJson.size, text: getCardSizeText(cardJson.size, mergedI18n) }}
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
          onSubmit={(val, setError) => handleSubmit(val, setError, onChange, setShowEditor)}
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
          <Tab label={i18n.contentTabLabel}>
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
