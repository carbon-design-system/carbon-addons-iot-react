import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

import { settings } from '../../../../../constants/Settings';
import { Dropdown } from '../../../../Dropdown';
import { BAR_CHART_TYPES } from '../../../../../constants/LayoutConstants';

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
  /* callback when image input value changes (File object) */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    dataItemEditorTitle: PropTypes.string,
    dataItemEditorDataItemTitle: PropTypes.string,
    dataItemEditorDataItemLabel: PropTypes.string,
    dataItemEditorLegendColor: PropTypes.string,
    dataSeriesTitle: PropTypes.string,
    selectDataItems: PropTypes.string,
    selectDataItem: PropTypes.string,
    dataItem: PropTypes.string,
    edit: PropTypes.string,
    customize: PropTypes.string,

    selectGroupBy: PropTypes.string,
    selectCategory: PropTypes.string,
    groupBy: PropTypes.string,
    subGroup: PropTypes.string,
    timeInterval: PropTypes.string,
  }),
  translateWithId: PropTypes.func.isRequired,
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    dataItemEditorTitle: 'Edit data series',
    dataItemEditorDataItemTitle: 'Data item',
    dataItemEditorDataItemLabel: 'Label',
    dataItemEditorLegendColor: 'Legend color',
    dataItemEditorSectionTitle: 'Data',
    selectDataItems: 'Select data items',
    selectDataItem: 'Select data item',
    dataItem: 'Data item',
    edit: 'Edit',
    customize: 'Customize',

    selectGroupBy: 'Select a group by',
    selectCategory: 'Select a category',
    groupBy: 'Group by',
    subGroup: 'Sub-group',
    timeInterval: 'Time interval',
  },
  availableDimensions: {},
};

const BarChartDataSeriesContent = ({
  cardConfig = {},
  onChange,
  availableDimensions,
  i18n,
  translateWithId,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };

  const baseClassName = `${iotPrefix}--card-edit-form`;

  return (
    <>
      <div className={`${baseClassName}--input`}>
        <Dropdown
          id={`${cardConfig.id}_group-by`}
          direction="bottom"
          label={mergedI18n.selectGroupBy}
          title={mergedI18n.selectGroupBy}
          light
          translateWithId={translateWithId}
          titleText={mergedI18n.groupBy}
          items={[
            ...(cardConfig.content.type !== BAR_CHART_TYPES.GROUPED
              ? [mergedI18n.timeInterval]
              : []),
            ...Object.keys(availableDimensions),
          ]}
          selectedItem={
            cardConfig.content?.timeDataSourceId
              ? mergedI18n.timeInterval
              : cardConfig.content.type !== BAR_CHART_TYPES.GROUPED
              ? cardConfig.content?.categoryDataSourceId || mergedI18n.timeInterval
              : cardConfig.content?.categoryDataSourceId
          }
          onChange={({ selectedItem }) => {
            if (selectedItem !== mergedI18n.timeInterval) {
              onChange({
                ...cardConfig,
                content: {
                  ...omit(cardConfig.content, 'timeDataSourceId'),
                  categoryDataSourceId: selectedItem,
                },
                dataSource: {
                  ...cardConfig.dataSource,
                  groupBy: [selectedItem],
                },
              });
            } else {
              onChange({
                ...cardConfig,
                content: {
                  ...omit(cardConfig.content, 'categoryDataSourceId'),
                  timeDataSourceId: 'timestamp',
                },
                dataSource: {
                  ...omit(cardConfig.dataSource, 'groupBy'),
                },
              });
            }
          }}
        />
      </div>
      {cardConfig.content.timeDataSourceId &&
      Object.keys(availableDimensions)?.length > 0 &&
      cardConfig.content.type === BAR_CHART_TYPES.STACKED &&
      cardConfig.content.series.length <= 1 ? (
        <div className={`${baseClassName}--input`}>
          <Dropdown
            id={`${cardConfig.id}_sub-group-by`}
            direction="bottom"
            label={mergedI18n.selectCategory}
            title={mergedI18n.selectCategory}
            light
            translateWithId={translateWithId}
            titleText={mergedI18n.subGroup}
            items={Object.keys(availableDimensions)}
            selectedItem={cardConfig.content?.categoryDataSourceId}
            onChange={({ selectedItem }) => {
              onChange({
                ...cardConfig,
                content: {
                  ...cardConfig.content,
                  timeDataSourceId: 'timestamp',
                  categoryDataSourceId: selectedItem,
                },
                dataSource: {
                  ...cardConfig.dataSource,
                  groupBy: [selectedItem],
                },
              });
            }}
          />
        </div>
      ) : null}
    </>
  );
};

BarChartDataSeriesContent.defaultProps = defaultProps;
BarChartDataSeriesContent.propTypes = propTypes;
export default BarChartDataSeriesContent;
