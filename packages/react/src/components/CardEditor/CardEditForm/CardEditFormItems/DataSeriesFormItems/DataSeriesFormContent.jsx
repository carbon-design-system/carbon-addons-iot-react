import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Edit16, Subtract16 } from '@carbon/icons-react';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';

import { settings } from '../../../../../constants/Settings';
import {
  DATAITEM_COLORS_OPTIONS,
  handleDataSeriesChange,
  DataItemsPropTypes,
} from '../../../../DashboardEditor/editorUtils';
import { Button, List, MultiSelect, Dropdown } from '../../../../../index';
import DataSeriesFormItemModal from '../DataSeriesFormItemModal';
import { CARD_TYPES, BAR_CHART_TYPES } from '../../../../../constants/LayoutConstants';
import ContentFormItemTitle from '../ContentFormItemTitle';

import BarChartDataSeriesContent from './BarChartDataSeriesContent';

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
      showLegend: PropTypes.bool,
    }),
    interval: PropTypes.string,
  }),
  /* callback when data item input value changes */
  onChange: PropTypes.func.isRequired,
  /** if provided, returns an array of strings which are the dataItems to be allowed
   * on each card
   * getValidDataItems(card, selectedTimeRange)
   */
  getValidDataItems: PropTypes.func,
  /** an array of dataItems to be included on each card
   * this prop will be ignored if getValidDataItems is defined
   */
  dataItems: DataItemsPropTypes,
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
  /** list of dataItem names that have been selected to display on the card */
  selectedDataItems: PropTypes.arrayOf(PropTypes.string),
  setSelectedDataItems: PropTypes.func.isRequired,
  selectedTimeRange: PropTypes.string.isRequired,
  /** optional link href's for each card type that will appear in a tooltip */
  dataSeriesItemLinks: PropTypes.shape({
    simpleBar: PropTypes.string,
    groupedBar: PropTypes.string,
    stackedBar: PropTypes.string,
    timeSeries: PropTypes.string,
    value: PropTypes.string,
    custom: PropTypes.string,
  }),
  i18n: PropTypes.shape({
    dataItemEditorTitle: PropTypes.string,
    dataItemEditorDataItemTitle: PropTypes.string,
    dataItemEditorDataItemLabel: PropTypes.string,
    dataItemEditorLegendColor: PropTypes.string,
    dataItemEditorSectionTitle: PropTypes.string,
    dataItemEditorSectionSimpleBarTooltipText: PropTypes.string,
    dataItemEditorSectionGroupedBarTooltipText: PropTypes.string,
    dataItemEditorSectionStackedBarTooltipText: PropTypes.string,
    dataItemEditorSectionTimeSeriesTooltipText: PropTypes.string,
    dataItemEditorSectionValueTooltipText: PropTypes.string,
    dataItemEditorSectionCustomTooltipText: PropTypes.string,
    dataItemEditorSectionTooltipLinkText: PropTypes.string,
    dataSeriesTitle: PropTypes.string,
    selectDataItems: PropTypes.string,
    selectDataItem: PropTypes.string,
    dataItem: PropTypes.string,
    edit: PropTypes.string,
    remove: PropTypes.string,
    customize: PropTypes.string,
    clearAllText: PropTypes.string,
    clearSelectionText: PropTypes.string,
    openMenuText: PropTypes.string,
    closeMenuText: PropTypes.string,
  }),
  translateWithId: PropTypes.func.isRequired,
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    dataItemEditorTitle: 'Edit data series',
    dataItemEditorDataItemTitle: 'Data item',
    dataItemEditorDataItemLabel: 'Label',
    dataItemEditorLegendColor: 'Legend color',
    dataItemEditorSectionTitle: 'Data',
    dataItemEditorSectionSimpleBarTooltipText:
      'Display a metric using bars. Plot over time or by a dimension from Group by.',
    dataItemEditorSectionGroupedBarTooltipText:
      'Group categories side by side in bars. Show groupings of related metrics or different categories of a single metric.',
    dataItemEditorSectionStackedBarTooltipText:
      'Stack bars by categories of a single dimension or into multiple related metrics.',
    dataItemEditorSectionTimeSeriesTooltipText: 'Plot time series metrics over time.',
    dataItemEditorSectionValueTooltipText:
      'Display metric values, dimension values, or alert counts. Select from Data item. ',
    dataItemEditorSectionCustomTooltipText:
      'Show or hide alert fields. Choose dimensions to add as extra columns. ',
    dataItemEditorSectionTooltipLinkText: 'Learn more',
    selectDataItems: 'Select data items',
    selectDataItem: 'Select data item',
    dataItem: 'Data item',
    edit: 'Edit',
    remove: 'Remove',
    customize: 'Customize',
    clearAllText: 'Clear all',
    clearSelectionText: 'Clear selection',
    openMenuText: 'Open menu',
    closeMenuText: 'Close menu',
  },
  getValidDataItems: null,
  dataItems: [],
  selectedDataItems: [],
  availableDimensions: {},
  dataSeriesItemLinks: null,
};

export const formatDataItemsForDropdown = (dataItems) =>
  dataItems?.map(({ dataSourceId }) => ({
    id: dataSourceId,
    text: dataSourceId,
  })) || [];

/**
 * Retuns card specific tooltip depending on card type
 * @param {Object} cardConfig
 * @returns {Object} tooltip definition
 */
export const defineCardSpecificTooltip = (cardConfig, dataSeriesItemLinks, i18n) => {
  switch (cardConfig.type) {
    case CARD_TYPES.BAR:
      if (cardConfig.content.type === BAR_CHART_TYPES.SIMPLE) {
        return {
          tooltipText: i18n.dataItemEditorSectionSimpleBarTooltipText,
          ...(dataSeriesItemLinks?.simpleBar
            ? {
                linkText: i18n.dataItemEditorSectionTooltipLinkText,
                href: dataSeriesItemLinks.simpleBar,
              }
            : {}),
        };
      }
      if (cardConfig.content.type === BAR_CHART_TYPES.GROUPED) {
        return {
          tooltipText: i18n.dataItemEditorSectionGroupedBarTooltipText,
          ...(dataSeriesItemLinks?.groupedBar
            ? {
                linkText: i18n.dataItemEditorSectionTooltipLinkText,
                href: dataSeriesItemLinks.groupedBar,
              }
            : {}),
        };
      }
      // STACKED
      return {
        tooltipText: i18n.dataItemEditorSectionStackedBarTooltipText,
        ...(dataSeriesItemLinks?.stackedBar
          ? {
              linkText: i18n.dataItemEditorSectionTooltipLinkText,
              href: dataSeriesItemLinks.stackedBar,
            }
          : {}),
      };

    case CARD_TYPES.TIMESERIES:
      return {
        tooltipText: i18n.dataItemEditorSectionTimeSeriesTooltipText,
        ...(dataSeriesItemLinks?.timeSeries
          ? {
              linkText: i18n.dataItemEditorSectionTooltipLinkText,
              href: dataSeriesItemLinks.timeSeries,
            }
          : {}),
      };

    case CARD_TYPES.VALUE:
      return {
        tooltipText: i18n.dataItemEditorSectionValueTooltipText,
        ...(dataSeriesItemLinks?.value
          ? {
              linkText: i18n.dataItemEditorSectionTooltipLinkText,
              href: dataSeriesItemLinks.value,
            }
          : {}),
      };

    case CARD_TYPES.CUSTOM:
    default:
      return {
        tooltipText: i18n.dataItemEditorSectionCustomTooltipText,
        ...(dataSeriesItemLinks?.custom
          ? {
              linkText: i18n.dataItemEditorSectionTooltipLinkText,
              href: dataSeriesItemLinks.custom,
            }
          : {}),
      };
  }
};

const DataSeriesFormItem = ({
  cardConfig,
  dataItems,
  getValidDataItems,
  onChange,
  selectedDataItems,
  setSelectedDataItems,
  selectedTimeRange,
  availableDimensions,
  i18n,
  dataSeriesItemLinks,
  translateWithId,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  const [showEditor, setShowEditor] = useState(false);
  const [editDataItem, setEditDataItem] = useState({});
  const [editDataSeries, setEditDataSeries] = useState(cardConfig.content?.series || []);
  const [removedDataItems, setRemovedDataItems] = useState([]);

  const baseClassName = `${iotPrefix}--card-edit-form`;

  const isComplexDataSeries =
    cardConfig.type === CARD_TYPES.TIMESERIES || cardConfig.type === CARD_TYPES.BAR;

  const canMultiSelectDataItems = cardConfig.content?.type !== BAR_CHART_TYPES.SIMPLE;

  // determine which content section to look at
  const dataSection =
    cardConfig.type === CARD_TYPES.TIMESERIES || cardConfig.type === CARD_TYPES.BAR
      ? cardConfig?.content?.series
      : cardConfig?.content?.attributes;

  const initialSelectedItems = formatDataItemsForDropdown(dataSection);

  const validDataItems = getValidDataItems
    ? getValidDataItems(cardConfig, selectedTimeRange)
    : dataItems;

  const cardSpecificTooltip = defineCardSpecificTooltip(
    cardConfig,
    dataSeriesItemLinks,
    mergedI18n
  );

  return (
    <>
      <DataSeriesFormItemModal
        cardConfig={cardConfig}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        editDataSeries={editDataSeries}
        setEditDataSeries={setEditDataSeries}
        editDataItem={editDataItem}
        setEditDataItem={setEditDataItem}
        availableDimensions={availableDimensions}
        onChange={onChange}
        i18n={mergedI18n}
      />
      <ContentFormItemTitle
        title={mergedI18n.dataItemEditorSectionTitle}
        // Specific to each card type
        tooltip={{ ...cardSpecificTooltip }}
      />
      {cardConfig.type === CARD_TYPES.BAR ? (
        <BarChartDataSeriesContent
          cardConfig={cardConfig}
          onChange={onChange}
          availableDimensions={availableDimensions}
          i18n={mergedI18n}
          translateWithId={translateWithId}
        />
      ) : null}
      {canMultiSelectDataItems ? (
        <div className={`${baseClassName}--input`}>
          <MultiSelect
            // need to re-gen if selected card changes or if a dataItem is removed from the list
            key={`data-item-select-${removedDataItems.length}-selected_card-id-${cardConfig.id}`}
            id={`${cardConfig.id}_dataSourceIds`}
            label={mergedI18n.selectDataItems}
            direction="bottom"
            itemToString={(item) => item.id}
            initialSelectedItems={initialSelectedItems}
            items={formatDataItemsForDropdown(validDataItems)}
            light
            onChange={({ selectedItems }) => {
              // need to remove the category if the card is a stacked timeseries bar
              const card =
                cardConfig.content.type === BAR_CHART_TYPES.STACKED &&
                cardConfig.content.timeDataSourceId &&
                selectedItems.length > 1
                  ? omit(cardConfig, 'content.categoryDataSourceId')
                  : cardConfig;

              const newCard = handleDataSeriesChange(selectedItems, card, setEditDataSeries);
              setSelectedDataItems(selectedItems.map(({ id }) => id));
              onChange(newCard);
            }}
            titleText={mergedI18n.dataItem}
            translateWithId={translateWithId}
          />
        </div>
      ) : (
        <div className={`${baseClassName}--input`}>
          <Dropdown
            id={`${cardConfig.id}_dataSourceId`}
            direction="bottom"
            label={mergedI18n.selectDataItem}
            light
            translateWithId={translateWithId}
            titleText={mergedI18n.dataItem}
            items={validDataItems.map(({ dataSourceId }) => dataSourceId)}
            selectedItem={
              !isEmpty(cardConfig.content?.series)
                ? cardConfig.content?.series[0].dataSourceId
                : null
            }
            onChange={({ selectedItem }) => {
              const newCard = handleDataSeriesChange(
                [{ id: selectedItem }],
                cardConfig,
                setEditDataSeries
              );
              setSelectedDataItems([selectedItem]);
              onChange(newCard);
            }}
          />
        </div>
      )}
      <List
        className={`${baseClassName}--data-item-list`}
        key={`data-item-list${selectedDataItems.length}`}
        // need to force an empty "empty state"
        emptyState={<div />}
        title=""
        items={dataSection?.map((dataItem, i) => ({
          id: dataItem.dataSourceId,
          content: {
            value: dataItem.label,
            icon: isComplexDataSeries ? (
              <div
                style={{
                  width: '1rem',
                  height: '1rem',
                  backgroundColor:
                    dataItem.color || DATAITEM_COLORS_OPTIONS[i % DATAITEM_COLORS_OPTIONS.length],
                }}
              />
            ) : null,
            rowActions: () => [
              <Button
                key={`data-item-${dataItem.dataSourceId}`}
                renderIcon={isComplexDataSeries ? Subtract16 : Edit16}
                hasIconOnly
                kind="ghost"
                size="small"
                onClick={() => {
                  if (isComplexDataSeries) {
                    const filteredItems = cardConfig.content?.series?.filter(
                      (item) => item.dataSourceId !== dataItem.dataSourceId
                    );
                    setSelectedDataItems(filteredItems.map((item) => item.dataSourceId));
                    setRemovedDataItems([
                      ...removedDataItems,
                      cardConfig.content?.series?.find(
                        (item) => item.dataSourceId === dataItem.dataSourceId
                      ),
                    ]);
                    setEditDataSeries(filteredItems);
                    onChange({
                      ...cardConfig,
                      content: {
                        ...cardConfig.content,
                        series: filteredItems,
                      },
                    });
                  } else {
                    setEditDataItem(dataItem);
                    setShowEditor(true);
                  }
                }}
                iconDescription={isComplexDataSeries ? mergedI18n.remove : mergedI18n.edit}
              />,
            ],
          },
        }))}
      />
      {isComplexDataSeries && dataSection.length ? (
        <Button
          renderIcon={Edit16}
          kind="ghost"
          size="small"
          onClick={() => {
            setShowEditor(true);
          }}
          iconDescription={mergedI18n.customize}
        >
          {mergedI18n.customize}
        </Button>
      ) : null}
    </>
  );
};
DataSeriesFormItem.defaultProps = defaultProps;
DataSeriesFormItem.propTypes = propTypes;
export default DataSeriesFormItem;
