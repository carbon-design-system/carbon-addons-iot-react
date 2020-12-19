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
import cloneDeep from 'lodash/cloneDeep';

import { settings } from '../../../../constants/Settings';
import { ComposedModal, TextInput, Dropdown } from '../../../../index';
import { handleDataItemEdit } from '../../../DashboardEditor/editorUtils';
import ColorDropdown from '../../../ColorDropdown/ColorDropdown';
import Table from '../../../Table/Table';
import { CARD_TYPES } from '../../../../constants/LayoutConstants';

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
  setEditDataSeries: PropTypes.func.isRequired,
  editDataSeries: PropTypes.arrayOf(
    PropTypes.shape({
      dataSourceId: PropTypes.string,
      label: PropTypes.string,
      color: PropTypes.string,
    })
  ),
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
    source: PropTypes.string,
  }),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    dataItemEditorDataSeriesTitle: 'Customize data series',
    dataItemEditorValueCardTitle: 'Edit data',
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
    dataItemEditorBarColor: 'Bar color',
    dataItemEditorLineColor: 'Line color',
    source: 'Source data item'
  },
  editDataSeries: [],
  showEditor: false,
  setShowEditor: null,
  availableDimensions: {},
  editDataItem: {},
  setEditDataItem: null,
};

const DATAITEM_COLORS_OPTIONS = [
  { carbonColor: purple70, name: 'purple70' },
  { carbonColor: cyan50, name: 'cyan50' },
  { carbonColor: teal70, name: 'teal70' },
  { carbonColor: magenta70, name: 'magenta70' },
  { carbonColor: red50, name: 'red50' },
  { carbonColor: red90, name: 'red90' },
  { carbonColor: green60, name: 'green60' },
  { carbonColor: blue80, name: 'blue80' },
  { carbonColor: magenta50, name: 'magenta50' },
  { carbonColor: purple50, name: 'purple50' },
  { carbonColor: teal50, name: 'teal50' },
  { carbonColor: cyan90, name: 'cyan90' },
];

const DataSeriesFormItemModal = ({
  cardConfig,
  showEditor,
  editDataSeries,
  setEditDataSeries,
  setShowEditor,
  editDataItem,
  setEditDataItem,
  availableDimensions,
  onChange,
  i18n,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { id, type } = cardConfig;
  const baseClassName = `${iotPrefix}--card-edit-form`;

  const DataSeriesEditorTable = (
    <Table
      id={`${id}_data_items_table`}
      columns={[
        { id: 'dataSourceId', name: mergedI18n.dataItem },
        {
          id: 'label',
          name: mergedI18n.dataItemEditorDataItemCustomLabel,
          // eslint-disable-next-line react/prop-types
          renderDataFunction: ({ row }) => {
            const seriesIndex = editDataSeries.findIndex(
              (series) => series.dataSourceId === row.dataSourceId
            );
            return (
              <TextInput
                id={`${row.dataSourceId}_label-input`}
                light
                titleText=""
                onChange={(evt) => {
                  const updatedSeries = cloneDeep(editDataSeries);
                  updatedSeries[seriesIndex].label = evt.target.value;
                  setEditDataSeries(updatedSeries);
                }}
                value={editDataSeries[seriesIndex].label}
              />
            );
          },
        },
        {
          id: 'color',
          name:
            type === CARD_TYPES.TIMESERIES
              ? mergedI18n.dataItemEditorLineColor
              : type === CARD_TYPES.BAR
              ? mergedI18n.dataItemEditorBarColor
              : '',
          // eslint-disable-next-line react/prop-types
          renderDataFunction: ({ row }) => {
            const seriesIndex = editDataSeries.findIndex(
              (series) => series.dataSourceId === row.dataSourceId
            );
            const selectedColor = DATAITEM_COLORS_OPTIONS.find(
              ({ carbonColor }) => carbonColor === row.color
            );
            return (
              <ColorDropdown
                id={`${id}_color-dropdown`}
                label=""
                titleText=""
                selectedColor={selectedColor}
                onChange={({ color }) => {
                  const updatedSeries = cloneDeep(editDataSeries);
                  updatedSeries[seriesIndex].color = color.carbonColor;
                  setEditDataSeries(updatedSeries);
                }}
              />
            );
          },
        },
      ]}
      data={editDataSeries.map(({ dataSourceId, color, label }) => ({
        id: dataSourceId,
        values: {
          dataSourceId,
          label,
          color,
        },
      }))}
    />
  );

  const selectedDimensionFilter = editDataItem.dataFilter
    ? Object.keys(editDataItem.dataFilter)[0]
    : '';

  const ValueCardDataEditor = (
    <>
      <div className={`${baseClassName}--input-group`}>
        <div className={`${baseClassName}--input-group--item`}>
          <TextInput
            id={`${id}_attribute-label`}
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
            id={`${id}_attribute-unit`}
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
            id={`${id}_data-filter-key`}
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
              id={`${id}_data-filter-value`}
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
        id={`${id}_thresholds`}
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

  const TableCardDataEditor = (
    <>
      <div className={`${baseClassName}--input-group`}>
        <div className={`${baseClassName}--input-group--item`}>
          <TextInput
            id={`${id}_attribute-label`}
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
          <p className={`${baseClassName}--input-group--span`}>{`${mergedI18n.source}: ${editDataItem.dataSourceId}`}</p>
        </div>
      </div>
      <ThresholdsFormItem
        id={`${id}_thresholds`}
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
              title:
                type === CARD_TYPES.VALUE
                  ? mergedI18n.dataItemEditorValueCardTitle
                  : mergedI18n.dataItemEditorDataSeriesTitle,
            }}
            size="sm"
            onSubmit={() => {
              const newCard =
                cardConfig.type === 'IMAGE'
                  ? editDataItem
                  : handleDataItemEdit(
                      editDataItem,
                      cardConfig,
                      editDataSeries
                    );
              onChange(newCard);
              setShowEditor(false);
              setEditDataItem({});
            }}
            onClose={() => {
              setShowEditor(false);
              setEditDataItem({});
            }}>
            {type === CARD_TYPES.TIMESERIES || type === CARD_TYPES.BAR
              ? DataSeriesEditorTable
              : type === CARD_TYPES.TABLE
              ? TableCardDataEditor
              : ValueCardDataEditor}
          </ComposedModal>
        </div>
      ) : null}
    </>
  );
};
DataSeriesFormItemModal.defaultProps = defaultProps;
DataSeriesFormItemModal.propTypes = propTypes;
export default DataSeriesFormItemModal;
