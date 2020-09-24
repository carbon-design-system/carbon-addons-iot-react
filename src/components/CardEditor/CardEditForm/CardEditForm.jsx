import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Add16, Edit16, Delete16, Code16 } from '@carbon/icons-react';

import {
  CARD_SIZES,
  CARD_TYPES,
  CARD_DIMENSIONS,
  BAR_CHART_TYPES,
  BAR_CHART_LAYOUTS,
} from '../../../constants/LayoutConstants';
import { settings } from '../../../constants/Settings';
import CardCodeEditor from '../../CardCodeEditor/CardCodeEditor';
import { Tabs, Tab, Button, TextArea, List, Modal, TextInput, Dropdown } from '../../../index';

const { iotPrefix } = settings;

const defaultProps = {
  value: {},
  i18n: {
    openEditorButton: 'Open JSON editor',
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
  value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** card data errors */
  // errors: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    openEditorButton: PropTypes.string,
  }),
};

const CardEditForm = ({ value, /* errors, */ onChange, i18n }) => {
  const mergedI18N = { ...defaultProps.i18n, ...i18n };
  const [showEditor, setShowEditor] = useState(false);
  const [modalError, setModalError] = useState();
  const [modalData, setModalData] = useState();

  const baseClassName = `${iotPrefix}--card-edit-form`;

  const allowedIntervals = ['minute', 'hour', 'day', 'week', 'month'];

  const allowedSizesForType = {
    VALUE: [
      CARD_SIZES.SMALL,
      CARD_SIZES.SMALLWIDE,
      CARD_SIZES.MEDIUMTHIN,
      CARD_SIZES.MEDIUM,
      CARD_SIZES.MEDIUMWIDE,
      CARD_SIZES.LARGETHIN,
      CARD_SIZES.LARGE,
      CARD_SIZES.LARGEWIDE,
    ],
    TIMESERIES: [
      CARD_SIZES.MEDIUMTHIN,
      CARD_SIZES.MEDIUM,
      CARD_SIZES.MEDIUMWIDE,
      CARD_SIZES.LARGETHIN,
      CARD_SIZES.LARGE,
      CARD_SIZES.LARGEWIDE,
    ],
    BAR: [
      CARD_SIZES.MEDIUMTHIN,
      CARD_SIZES.MEDIUM,
      CARD_SIZES.MEDIUMWIDE,
      CARD_SIZES.LARGETHIN,
      CARD_SIZES.LARGE,
      CARD_SIZES.LARGEWIDE,
    ],
    TABLE: [
      CARD_SIZES.MEDIUMTHIN,
      CARD_SIZES.MEDIUM,
      CARD_SIZES.MEDIUMWIDE,
      CARD_SIZES.LARGETHIN,
      CARD_SIZES.LARGE,
      CARD_SIZES.LARGEWIDE,
    ],
    IMAGE: [
      CARD_SIZES.MEDIUMTHIN,
      CARD_SIZES.MEDIUM,
      CARD_SIZES.MEDIUMWIDE,
      CARD_SIZES.LARGETHIN,
      CARD_SIZES.LARGE,
      CARD_SIZES.LARGEWIDE,
    ],
  };

  const getCardSizeText = size => {
    const sizeName = mergedI18N[`cardSize_${size}`] ?? i;
    const sizeDimensions = CARD_DIMENSIONS[size]
      ? `(${CARD_DIMENSIONS[size].lg.w}x${CARD_DIMENSIONS[size].lg.h})`
      : null;
    return `${sizeName}${sizeDimensions ? ` ${sizeDimensions}` : ''}`;
  };

  const renderValueCardBasicItems = () => {
    return (
      <>
        <List
          title="Attributes"
          buttons={[
            <Button
              renderIcon={Add16}
              hasIconOnly
              size="small"
              iconDescription="Add"
              key="expandable-list-button-add"
              onClick={() =>
                onChange({
                  ...value,
                  content: {
                    ...(value.content ?? {}),
                    attributes: [
                      ...(value?.content?.attributes ?? []),
                      {
                        dataSourceId: 'dataSourceId',
                        unit: '',
                        label: 'Label',
                      },
                    ],
                  },
                })
              }
            />,
          ]}
          items={(value?.content?.attributes ?? []).map(attr => ({
            id: attr.dataSourceId,
            content: {
              value: attr.label,
              rowActions: [
                <Button
                  style={{ color: 'black' }}
                  renderIcon={Edit16}
                  hasIconOnly
                  kind="ghost"
                  size="small"
                  onClick={() => alert('edit')}
                  iconDescription="Edit"
                />,
                <Button
                  style={{ color: 'black' }}
                  renderIcon={Delete16}
                  hasIconOnly
                  kind="ghost"
                  size="small"
                  onClick={() =>
                    onChange({
                      ...value,
                      content: {
                        ...(value.content ?? {}),
                        attributes: value.content.attributes.filter(
                          i => i.dataSourceId !== attr.dataSourceId
                        ),
                      },
                    })
                  }
                  iconDescription="Remove"
                />,
              ],
            },
          }))}
        />
      </>
    );
  };

  const renderValueCardAdvancedItems = () => {
    return null;
  };

  const renderBarChartCardBasicItems = () => {
    return (
      <>
        <div className={`${baseClassName}--input`}>
          <TextInput
            id="categoryDataSourceId"
            labelText="Category data source"
            light
            onChange={evt =>
              onChange({
                ...value,
                content: {
                  ...(value.content ?? {}),
                  categoryDataSourceId: evt.target.value,
                },
              })
            }
            value={value.content?.categoryDataSourceId}
          />
        </div>
      </>
    );
  };

  const renderBarChartCardAdvancedItems = () => {
    return (
      <>
        <div className={`${baseClassName}--input`}>
          <Dropdown
            id="barChartType"
            label="Select a chart type"
            direction="bottom"
            itemToString={item => item.text}
            items={Object.keys(BAR_CHART_TYPES).map(i => ({
              id: i,
              text: mergedI18N[`barChartType_${i}`] ?? i,
            }))}
            light
            selectedItem={
              value?.content?.type
                ? {
                    id: value.content.type,
                    text: mergedI18N[`barChartType_${value.content.type}`] ?? value.content.type,
                  }
                : null
            }
            onChange={({ selectedItem }) => {
              onChange({
                ...value,
                content: {
                  ...(value.content ?? {}),
                  type: selectedItem.id,
                },
              });
            }}
            titleText="Chart type"
          />
        </div>
        <div className={`${baseClassName}--input`}>
          <Dropdown
            id="layout"
            label="Select a layout type"
            direction="bottom"
            itemToString={item => item.text}
            items={Object.keys(BAR_CHART_LAYOUTS).map(i => ({
              id: i,
              text: mergedI18N[`barChartLayout_${i}`] ?? i,
            }))}
            light
            selectedItem={
              value?.content?.layout
                ? {
                    id: value.content.layout,
                    text:
                      mergedI18N[`barChartLayout_${value.content.layout}`] ?? value.content.layout,
                  }
                : null
            }
            onChange={({ selectedItem }) => {
              onChange({
                ...value,
                content: {
                  ...(value.content ?? {}),
                  layout: selectedItem.id,
                },
              });
            }}
            titleText="Layout"
          />
        </div>
        <div className={`${baseClassName}--input`}>
          <TextInput
            id="categoryDataSourceId"
            labelText="Category data source"
            light
            onChange={evt =>
              onChange({
                ...value,
                content: {
                  ...(value.content ?? {}),
                  ...(evt.target.value !== '' ? { categoryDataSourceId: evt.target.value } : {}),
                },
              })
            }
            value={value.content?.categoryDataSourceId}
          />
        </div>
        <div className={`${baseClassName}--input`}>
          <TextInput
            id="title"
            labelText="X-axis label (Optional)"
            light
            onChange={evt =>
              onChange({
                ...value,
                content: {
                  ...(value.content ?? {}),
                  xLabel: evt.target.value,
                },
              })
            }
            value={value.content?.xLabel}
          />
        </div>
        <div className={`${baseClassName}--input`}>
          <TextInput
            id="title"
            labelText="Y-axis label (Optional)"
            light
            onChange={evt =>
              onChange({
                ...value,
                content: {
                  ...(value.content ?? {}),
                  yLabel: evt.target.value,
                },
              })
            }
            value={value.content?.yLabel}
          />
        </div>
      </>
    );
  };

  const renderTimeSeriesCardBasicItems = () => {
    return (
      <>
        <div className={`${baseClassName}--input`}>
          <Dropdown
            id="interval"
            label="Select a time interval"
            direction="bottom"
            itemToString={item => item.text}
            items={allowedIntervals.map(i => ({ id: i, text: i }))}
            light
            selectedItem={value.interval ? { id: value.interval, text: value.interval } : null}
            onChange={({ selectedItem }) => {
              onChange({ ...value, interval: selectedItem.id });
            }}
            titleText="Interval"
          />
        </div>
        <div className={`${baseClassName}--input`}>
          <TextInput
            id="timeDataSourceId"
            labelText="Time data source"
            light
            onChange={evt =>
              onChange({
                ...value,
                content: {
                  ...(value.content ?? {}),
                  ...(evt.target.value !== '' ? { timeDataSourceId: evt.target.value } : {}),
                },
              })
            }
            value={value.content?.timeDataSourceId}
          />
        </div>
      </>
    );
  };

  const renderTimeSeriesCardAdvancedItems = () => {
    return (
      <>
        <div className={`${baseClassName}--input`}>
          <TextInput
            id="title"
            labelText="X-axis label (Optional)"
            light
            onChange={evt =>
              onChange({
                ...value,
                content: {
                  ...(value.content ?? {}),
                  xLabel: evt.target.value,
                },
              })
            }
            value={value.content?.xLabel}
          />
        </div>
        <div className={`${baseClassName}--input`}>
          <TextInput
            id="title"
            labelText="Y-axis label (Optional)"
            light
            onChange={evt =>
              onChange({
                ...value,
                content: {
                  ...(value.content ?? {}),
                  yLabel: evt.target.value,
                },
              })
            }
            value={value.content?.yLabel}
          />
        </div>
      </>
    );
  };

  return (
    <>
      {showEditor ? (
        <CardCodeEditor
          onSubmit={(val, setError) => {
            try {
              setError(false);
              if (val === '') {
                setError('JSON value must not be an empty string');
              } else {
                const json = JSON.parse(val);
                // Check for non-exception throwing cases (false, 1234, null)
                if (json && typeof json === 'object') {
                  onChange(json);
                  setShowEditor(false);
                }
                setError(`${val.substring(0, 8)} is not valid JSON`);
              }
            } catch (e) {
              setError(e.message);
            }
            return false;
          }}
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
          <Tab label="Basics">
            <div className={`${baseClassName}--content`}>
              <div className={`${baseClassName}--input`}>
                <TextInput
                  id="title"
                  labelText="Card title"
                  light
                  onChange={evt => onChange({ ...value, title: evt.target.value })}
                  value={value.title}
                />
              </div>
              <div className={`${baseClassName}--input`}>
                <TextArea
                  id="description"
                  labelText="Description (Optional)"
                  light
                  onChange={evt => onChange({ ...value, description: evt.target.value })}
                  value={value.description}
                />
              </div>
              <div className={`${baseClassName}--input`}>
                <Dropdown
                  id="size"
                  label="Select a size"
                  direction="bottom"
                  itemToString={item => item.text}
                  items={(allowedSizesForType[value.type] ?? Object.keys(CARD_SIZES)).map(i => {
                    return {
                      id: i,
                      text: getCardSizeText(i),
                    };
                  })}
                  light
                  selectedItem={{ id: value.size, text: getCardSizeText(value.size) }}
                  onChange={({ selectedItem }) => {
                    onChange({ ...value, size: selectedItem.id });
                  }}
                  titleText="Size"
                />
              </div>
              {value.type === CARD_TYPES.VALUE ? renderValueCardBasicItems() : null}
              {value.type === CARD_TYPES.BAR ? renderBarChartCardBasicItems() : null}
              {value.type === CARD_TYPES.TIMESERIES ? renderTimeSeriesCardBasicItems() : null}
            </div>
          </Tab>
          <Tab label="Customize">
            <div className={`${baseClassName}--content`}>
              {value.type === CARD_TYPES.VALUE ? renderValueCardAdvancedItems() : null}
              {value.type === CARD_TYPES.BAR ? renderBarChartCardAdvancedItems() : null}
              {value.type === CARD_TYPES.TIMESERIES ? renderTimeSeriesCardAdvancedItems() : null}
            </div>
          </Tab>
        </Tabs>
        <div className={`${baseClassName}--footer`}>
          <Button
            kind="tertiary"
            size="small"
            renderIcon={Code16}
            onClick={() => {
              setModalData(JSON.stringify(value, null, 4));
              setShowEditor(true);
            }}
          >
            {mergedI18N.openEditorButton}
          </Button>
        </div>
      </div>
    </>
  );
};

CardEditForm.propTypes = propTypes;
CardEditForm.defaultProps = defaultProps;

export default CardEditForm;
