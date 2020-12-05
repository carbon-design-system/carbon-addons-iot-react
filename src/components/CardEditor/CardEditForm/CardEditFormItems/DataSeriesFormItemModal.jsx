import React from 'react';
import PropTypes from 'prop-types';
import {
  purple70,
  cyan50,
  teal70,
  magenta70,
  red50,
  red60,
  red90,
  green60,
  blue80,
  magenta50,
  purple50,
  teal50,
  cyan90,
} from '@carbon/colors';
import { WarningAlt32 } from '@carbon/icons-react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';

import { settings } from '../../../../constants/Settings';
import { ComposedModal, TextInput, Dropdown } from '../../../../index';
import { handleDataItemEdit } from '../../../DashboardEditor/editorUtils';

import ThresholdsFormItem from './ThresholdsFormItem';

const { iotPrefix } = settings;

const propTypes = {
  /* card value */
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
    }),
    interval: PropTypes.string,
    showLegend: PropTypes.bool,
  }),
  showEditor: PropTypes.bool,
  setShowEditor: PropTypes.func,
  editDataItem: PropTypes.shape({}),
  setEditDataItem: PropTypes.func,
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
  /* callback when image input value changes (File object) */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    dataItemEditorDataItemTitle: PropTypes.string,
    dataItemEditorDataItemLabel: PropTypes.string,
    dataItemEditorLegendColor: PropTypes.string,
    dataSeriesTitle: PropTypes.string,
    selectDataItems: PropTypes.string,
    dataItem: PropTypes.string,
    edit: PropTypes.string,
    dataItemEditorDataItemCustomLabel: PropTypes.string,
    dataItemEditorDataItemUnit: PropTypes.string,
    dataItemEditorDataItemFilter: PropTypes.string,
    dataItemEditorDataItemThresholds: PropTypes.string,
    dataItemEditorDataItemAddThreshold: PropTypes.string,
  }),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    dataItemEditorDataItemTitle: 'Data item',
    dataItemEditorDataItemLabel: 'Label',
    dataItemEditorLegendColor: 'Legend color',
    dataSeriesTitle: 'Data series',
    selectDataItems: 'Select data items',
    dataItem: 'Data item',
    edit: 'Edit',
    dataItemEditorDataItemCustomLabel: 'Custom label',
    dataItemEditorDataItemUnit: 'Unit',
    dataItemEditorDataItemFilter: 'Data filter',
    dataItemEditorDataItemThresholds: 'Thresholds',
    dataItemEditorDataItemAddThreshold: 'Add threshold',
  },
  showEditor: false,
  setShowEditor: null,
  availableDimensions: {},
  editDataItem: {},
  setEditDataItem: null,
};

const DATAITEM_COLORS_OPTIONS = [
  purple70,
  cyan50,
  teal70,
  magenta70,
  red50,
  red90,
  green60,
  blue80,
  magenta50,
  purple50,
  teal50,
  cyan90,
];

const DataSeriesFormItemModal = ({
  cardConfig,
  showEditor,
  setShowEditor,
  editDataItem,
  setEditDataItem,
  availableDimensions,
  onChange,
  i18n,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const baseClassName = `${iotPrefix}--card-edit-form`;

  const TimeSeriesContent = (
    <>
      <span className={`bx--label ${baseClassName}--input-label`}>
        {mergedI18n.dataItemEditorDataItemTitle}
      </span>
      <div className={`${baseClassName}--input`}>
        {editDataItem.dataSourceId}
      </div>
      <div className={`${baseClassName}--input`}>
        <TextInput
          id={`${cardConfig.id}_series-label`}
          labelText={mergedI18n.dataItemEditorDataItemLabel}
          light
          onChange={(evt) =>
            setEditDataItem({
              ...editDataItem,
              label: evt.target.value,
            })
          }
          value={editDataItem.label}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <span className={`bx--label ${baseClassName}--input--label`}>
          {mergedI18n.dataItemEditorLegendColor}
        </span>
        <div className="color-picker">
          {DATAITEM_COLORS_OPTIONS.map((color, i) => (
            <button
              key={`color_${i}`}
              type="button"
              style={{ backgroundColor: color }}
              className={classnames('color-picker-button', {
                'color-picker-button__selected': color === editDataItem.color,
              })}
              onClick={() => setEditDataItem({ ...editDataItem, color })}
            />
          ))}
        </div>
      </div>
    </>
  );

  const selectedDimensionFilter = editDataItem.dataFilter
    ? Object.keys(editDataItem.dataFilter)[0]
    : '';

  const ValueContent = (
    <>
      <div className={`${baseClassName}--input-group`}>
        <div className={`${baseClassName}--input-group--item`}>
          <TextInput
            id={`${cardConfig.id}_attribute-label`}
            labelText={mergedI18n.dataItemEditorDataItemCustomLabel}
            light
            onChange={(evt) =>
              setEditDataItem({
                ...editDataItem,
                label: evt.target.value,
              })
            }
            value={editDataItem.label}
          />
        </div>
        <div className={`${baseClassName}--input-group--item-end`}>
          <TextInput
            id={`${cardConfig.id}_attribute-unit`}
            labelText={mergedI18n.dataItemEditorDataItemUnit}
            light
            onChange={(evt) =>
              setEditDataItem({
                ...editDataItem,
                unit: evt.target.value,
              })
            }
            value={editDataItem.unit}
          />
        </div>
      </div>
      <div className={`${baseClassName}--input-group`}>
        <div
          className={classnames({
            [`${baseClassName}--input-group--item`]: !isEmpty(
              editDataItem.dataFilter
            ),
            [`${baseClassName}--input-group--item-half`]:
              isEmpty(editDataItem.dataFilter) ||
              (!isEmpty(editDataItem.dataFilter) &&
                !availableDimensions[selectedDimensionFilter]),
          })}>
          <Dropdown
            id={`${cardConfig.id}_data-filter-key`}
            label=""
            direction="bottom"
            items={['None', ...Object.keys(availableDimensions)]}
            light
            selectedItem={selectedDimensionFilter || 'None'}
            onChange={({ selectedItem }) => {
              if (selectedItem !== 'None') {
                const dataFilter = {
                  [selectedItem]: availableDimensions[selectedItem][0],
                };
                setEditDataItem({
                  ...editDataItem,
                  dataFilter,
                });
              } else {
                setEditDataItem({
                  ...omit(editDataItem, 'dataFilter'),
                });
              }
            }}
            titleText={mergedI18n.dataItemEditorDataItemFilter}
          />
        </div>
        {!isEmpty(editDataItem.dataFilter) &&
        availableDimensions[selectedDimensionFilter] ? (
          <div className={`${baseClassName}--input-group--item-end`}>
            <Dropdown
              id={`${cardConfig.id}_data-filter-value`}
              label=""
              direction="bottom"
              items={availableDimensions[selectedDimensionFilter]}
              light
              selectedItem={editDataItem.dataFilter[selectedDimensionFilter]}
              onChange={({ selectedItem }) => {
                const dataFilter = { [selectedDimensionFilter]: selectedItem };
                setEditDataItem({
                  ...editDataItem,
                  dataFilter,
                });
              }}
            />
          </div>
        ) : null}
      </div>
      <ThresholdsFormItem
        dataSourceId={editDataItem.dataSourceId}
        cardConfig={cardConfig}
        id={`${cardConfig.id}_thresholds`}
        thresholds={editDataItem.thresholds}
        selectedIcon={{ carbonIcon: <WarningAlt32 />, name: 'Warning alt' }}
        selectedColor={{ carbonColor: red60, name: 'red60' }}
        onChange={(thresholds) => {
          setEditDataItem({
            ...editDataItem,
            thresholds,
          });
        }}
      />
    </>
  );

  return (
    <>
      {showEditor ? (
        <div className={`${baseClassName}--modal-wrapper`}>
          <ComposedModal
            header={{
              title: mergedI18n.dataItemEditorDataItemTitle,
            }}
            size="sm"
            onSubmit={() => {
              const newCard = handleDataItemEdit(editDataItem, cardConfig);
              onChange(newCard);
              setShowEditor(false);
              setEditDataItem({});
            }}
            onClose={() => {
              setShowEditor(false);
              setEditDataItem({});
            }}>
            {cardConfig.type === 'TIMESERIES'
              ? TimeSeriesContent
              : ValueContent}
          </ComposedModal>
        </div>
      ) : null}
    </>
  );
};
DataSeriesFormItemModal.defaultProps = defaultProps;
DataSeriesFormItemModal.propTypes = propTypes;
export default DataSeriesFormItemModal;
