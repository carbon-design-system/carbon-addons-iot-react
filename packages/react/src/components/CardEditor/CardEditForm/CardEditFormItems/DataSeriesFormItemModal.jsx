import React, { useCallback } from 'react';
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
import { FormLabel } from 'carbon-components-react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';

import { settings } from '../../../../constants/Settings';
import { ComposedModal, TextInput, Dropdown } from '../../../../index';
import { handleDataItemEdit, DataItemsPropTypes } from '../../../DashboardEditor/editorUtils';
import ColorDropdown from '../../../ColorDropdown/ColorDropdown';
import Table from '../../../Table/Table';
import { BAR_CHART_TYPES, CARD_TYPES } from '../../../../constants/LayoutConstants';

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
  setEditDataSeries: PropTypes.func,
  editDataSeries: PropTypes.arrayOf(
    PropTypes.shape({
      dataSourceId: PropTypes.string,
      label: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  validDataItems: DataItemsPropTypes,
  isSummaryDashboard: PropTypes.bool,
  i18n: PropTypes.shape({
    dataItemEditorDataItemTitle: PropTypes.string,
    dataItemEditorDataItemLabel: PropTypes.string,
    dataItemEditorLegendColor: PropTypes.string,
    dataItemEditorSectionTitle: PropTypes.string,
    selectDataItems: PropTypes.string,
    dataItem: PropTypes.string,
    edit: PropTypes.string,
    dataItemEditorDataItemCustomLabel: PropTypes.string,
    dataItemEditorDataItemUnit: PropTypes.string,
    dataItemEditorDataItemFilter: PropTypes.string,
    dataItemEditorDataItemThresholds: PropTypes.string,
    dataItemEditorDataItemAddThreshold: PropTypes.string,
    source: PropTypes.string,
    primaryButtonLabelText: PropTypes.string,
    secondaryButtonLabelText: PropTypes.string,
  }),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    dataItemEditorDataSeriesTitle: 'Customize data series',
    dataItemEditorValueCardTitle: 'Edit data',
    dataItemEditorDataItemLabel: 'Label',
    dataItemEditorLegendColor: 'Legend color',
    dataItemEditorSectionTitle: 'Data series',
    selectDataItems: 'Select data items',
    dataItem: 'Data item',
    edit: 'Edit',
    example: 'Example',
    notSet: 'Not set',
    none: 'None',
    dataItemEditorDataItemCustomLabel: 'Custom label',
    dataItemEditorDataItemUnit: 'Unit',
    dataItemEditorDataItemFilter: 'Data filter',
    dataItemEditorDataItemThresholds: 'Thresholds',
    dataItemEditorDataItemAddThreshold: 'Add threshold',
    dataItemEditorBarColor: 'Bar color',
    dataItemEditorLineColor: 'Line color',
    source: 'Source data item',
    aggregationMethod: 'Aggregation method',
    grain: 'Grain',
    inputLabel: 'Input',
    hourlyLabel: 'Hourly',
    dailyLabel: 'Daily',
    weeklyLabel: 'Weekly',
    monthlyLabel: 'Monthly',
    yearlyLabel: 'Yearly',
    dataItemSource: 'Data item source',
    primaryButtonLabelText: 'Save',
    secondaryButtonLabelText: 'Cancel',
    decimalPlaces: 'Decimal places',
  },
  editDataSeries: [],
  showEditor: false,
  setShowEditor: null,
  availableDimensions: {},
  editDataItem: {},
  setEditDataItem: null,
  setEditDataSeries: null,
  isSummaryDashboard: false,
  validDataItems: [],
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
  isSummaryDashboard,
  showEditor,
  editDataSeries,
  setEditDataSeries,
  setShowEditor,
  editDataItem,
  setEditDataItem,
  validDataItems,
  availableDimensions,
  onChange,
  i18n,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { id, type, content } = cardConfig;
  const baseClassName = `${iotPrefix}--card-edit-form`;

  const isTimeBasedCard =
    type === CARD_TYPES.TIMESERIES ||
    type === CARD_TYPES.TABLE ||
    content?.type === BAR_CHART_TYPES.SIMPLE ||
    content?.type === BAR_CHART_TYPES.STACKED;

  const handleTranslation = useCallback(
    (idToTranslate) => {
      const { clearSelectionText, openMenuText, closeMenuText, clearAllText } = mergedI18n;
      switch (idToTranslate) {
        default:
          return '';
        case 'clear.all':
          return clearAllText || 'Clear all';
        case 'clear.selection':
          return clearSelectionText || 'Clear selection';
        case 'open.menu':
          return openMenuText || 'Open menu';
        case 'close.menu':
          return closeMenuText || 'Close menu';
      }
    },
    [mergedI18n]
  );

  const availableGrains = [
    { id: 'input', text: mergedI18n.inputLabel },
    { id: 'hourly', text: mergedI18n.hourlyLabel },
    { id: 'daily', text: mergedI18n.dailyLabel },
    { id: 'weekly', text: mergedI18n.weeklyLabel },
    { id: 'monthly', text: mergedI18n.monthlyLabel },
    { id: 'yearly', text: mergedI18n.yearlyLabel },
  ];

  const initialAggregation = validDataItems?.find(
    ({ dataSourceId }) => dataSourceId === editDataItem.dataSourceId
  )?.aggregationMethod;

  const initialGrain = validDataItems?.find(
    ({ dataSourceId }) => dataSourceId === editDataItem.dataSourceId
  )?.grain;

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
                translateWithId={handleTranslation}
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

  const DataEditorContent = (
    <>
      <div className={`${baseClassName}--input-group`}>
        {!initialAggregation || !isSummaryDashboard ? ( // selector should only be use-able in an instance dash or if there is no initial aggregation
          <div className={`${baseClassName}--input-group--item-half`}>
            <Dropdown
              id={`${id}_aggregation-method`}
              label=""
              direction="bottom"
              itemToString={(item) => item.text}
              items={editDataItem.aggregationMethods || []}
              selectedItem={
                editDataItem.aggregationMethods?.find(
                  (method) => method.id === editDataItem.aggregationMethod
                ) || { id: 'none', text: mergedI18n.none }
              }
              titleText={mergedI18n.aggregationMethod}
              light
              onChange={({ selectedItem }) =>
                setEditDataItem({
                  ...editDataItem,
                  aggregationMethod: selectedItem.id,
                })
              }
            />
          </div>
        ) : (
          <div className={`${baseClassName}--input-group--item-half`}>
            <FormLabel className={`${baseClassName}--input-group--item-half-label`}>
              {mergedI18n.aggregationMethod}
            </FormLabel>
            <span className={`${baseClassName}--input-group--item-half-content`}>
              {`${
                editDataItem.aggregationMethod
                  ? editDataItem.aggregationMethod[0].toUpperCase()
                  : ''
              }${editDataItem.aggregationMethod?.slice(1) || ''}`}
            </span>
          </div>
        )}

        {isTimeBasedCard && (
          <div className={`${baseClassName}--input-group--item-half`}>
            <Dropdown
              id={`${id}_grain-selector`}
              label=""
              direction="bottom"
              itemToString={(item) => item.text}
              items={
                isSummaryDashboard && initialAggregation // limit options for aggregated metrics in a summary dash
                  ? availableGrains.slice(
                      availableGrains.findIndex((grain) => grain.id === initialGrain)
                    )
                  : availableGrains
              }
              selectedItem={
                availableGrains.find((grain) => grain.id === editDataItem.grain) ||
                availableGrains.find((grain) => grain.id === 'input')
              }
              titleText={mergedI18n.grain}
              light
              onChange={({ selectedItem }) => {
                if (selectedItem !== mergedI18n.inputLabel) {
                  setEditDataItem({
                    ...editDataItem,
                    grain: selectedItem.id,
                  });
                } else {
                  setEditDataItem(omit(editDataItem, 'grain'));
                }
              }}
            />
          </div>
        )}
      </div>

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
            helperText={`${mergedI18n.dataItemSource}: ${editDataItem.dataSourceId}`}
          />
        </div>

        {(type === CARD_TYPES.TIMESERIES || type === CARD_TYPES.BAR) && ( // show color selector
          <div className={`${baseClassName}--input-group--item`}>
            <ColorDropdown
              id={`${id}_color-dropdown`}
              label=""
              titleText={
                type === CARD_TYPES.TIMESERIES
                  ? mergedI18n.dataItemEditorLineColor
                  : mergedI18n.dataItemEditorBarColor
              }
              selectedColor={DATAITEM_COLORS_OPTIONS.find(
                ({ carbonColor }) => carbonColor === editDataItem.color
              )}
              onChange={({ color }) =>
                setEditDataItem({
                  ...editDataItem,
                  color: color.carbonColor,
                })
              }
            />
          </div>
        )}
      </div>

      {(type === CARD_TYPES.VALUE || type === CARD_TYPES.IMAGE) && (
        <div className={`${baseClassName}--input-group`}>
          <div className={`${baseClassName}--input-group--item`}>
            <TextInput
              id={`${id}_attribute-unit`}
              labelText={mergedI18n.dataItemEditorDataItemUnit}
              light
              placeholder={`${mergedI18n.example}: %`}
              onChange={(evt) =>
                setEditDataItem({
                  ...editDataItem,
                  unit: evt.target.value,
                })
              }
              value={editDataItem.unit}
            />
          </div>
          {type === CARD_TYPES.VALUE && (
            <div className={`${baseClassName}--input-group--item-end`}>
              <Dropdown
                id={`${id}_value-card-decimal-place`}
                titleText="Decimal places"
                direction="bottom"
                label=""
                items={[mergedI18n.notSet, '0', '1', '2', '3', '4']}
                light
                selectedItem={editDataItem.precision?.toString() || mergedI18n.notSet}
                onChange={({ selectedItem }) => {
                  const isSet = selectedItem !== mergedI18n.notSet;
                  if (isSet) {
                    setEditDataItem({
                      ...editDataItem,
                      precision: Number(selectedItem),
                    });
                  } else {
                    setEditDataItem(omit(editDataItem, 'precision'));
                  }
                }}
              />
            </div>
          )}
        </div>
      )}

      {isSummaryDashboard ? ( // only show data filter in summary dashboards
        <div className={`${baseClassName}--input-group`}>
          <div
            className={classnames({
              [`${baseClassName}--input-group--item`]: !isEmpty(editDataItem.dataFilter),
              [`${baseClassName}--input-group--item-half`]:
                isEmpty(editDataItem.dataFilter) ||
                (!isEmpty(editDataItem.dataFilter) &&
                  !availableDimensions[selectedDimensionFilter]),
            })}
          >
            <Dropdown
              id={`${id}_data-filter-key`}
              label=""
              translateWithId={handleTranslation}
              direction="bottom"
              items={[mergedI18n.none, ...Object.keys(availableDimensions)]}
              light
              selectedItem={selectedDimensionFilter || mergedI18n.none}
              onChange={({ selectedItem }) => {
                if (selectedItem !== mergedI18n.none) {
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
          {!isEmpty(editDataItem.dataFilter) && availableDimensions[selectedDimensionFilter] ? (
            <div className={`${baseClassName}--input-group--item-end`}>
              <Dropdown
                id={`${id}_data-filter-value`}
                label=""
                direction="bottom"
                items={availableDimensions[selectedDimensionFilter]}
                light
                selectedItem={editDataItem.dataFilter[selectedDimensionFilter]}
                onChange={({ selectedItem }) => {
                  const dataFilter = {
                    [selectedDimensionFilter]: selectedItem,
                  };
                  setEditDataItem({
                    ...editDataItem,
                    dataFilter,
                  });
                }}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {(type === CARD_TYPES.VALUE || type === CARD_TYPES.IMAGE) && (
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
      )}
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
            helperText={`${mergedI18n.source}: ${editDataItem.dataSourceId}`}
          />
        </div>
      </div>
      <ThresholdsFormItem
        id={`${id}_thresholds`}
        i18n={mergedI18n}
        thresholds={editDataItem.thresholds}
        translateWithId={handleTranslation}
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
              label: editDataItem.dataSourceId,
              title:
                type === CARD_TYPES.VALUE
                  ? mergedI18n.dataItemEditorValueCardTitle
                  : mergedI18n.dataItemEditorDataSeriesTitle,
            }}
            size="xs"
            footer={{
              primaryButtonLabel: mergedI18n.primaryButtonLabelText,
              secondaryButtonLabel: mergedI18n.secondaryButtonLabelText,
            }}
            onSubmit={() => {
              const newCard =
                cardConfig.type === CARD_TYPES.IMAGE
                  ? editDataItem
                  : handleDataItemEdit(editDataItem, cardConfig, editDataSeries);
              onChange(newCard);
              setShowEditor(false);
              setEditDataItem({});
            }}
            iconDescription={mergedI18n.closeButtonLabelText}
            onClose={() => {
              setShowEditor(false);
              setEditDataItem({});
            }}
          >
            {type === CARD_TYPES.BAR && content.type === BAR_CHART_TYPES.GROUPED
              ? DataSeriesEditorTable
              : type === CARD_TYPES.TABLE
              ? TableCardDataEditor
              : DataEditorContent}
          </ComposedModal>
        </div>
      ) : null}
    </>
  );
};
DataSeriesFormItemModal.defaultProps = defaultProps;
DataSeriesFormItemModal.propTypes = propTypes;
export default DataSeriesFormItemModal;
