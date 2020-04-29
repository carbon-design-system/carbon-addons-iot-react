import React, { useMemo, useCallback } from 'react';
import { OverflowMenu, OverflowMenuItem, Icon } from 'carbon-components-react';
import styled from 'styled-components';
import moment from 'moment';
import isNil from 'lodash/isNil';
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';
import cloneDeep from 'lodash/cloneDeep';
import capitalize from 'lodash/capitalize';
import OverFlowMenuIcon from '@carbon/icons-react/es/overflow-menu--vertical/20';

import { CardPropTypes, TableCardPropTypes } from '../../constants/CardPropTypes';
import Card, { defaultProps as CardDefaultProps } from '../Card/Card';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import StatefulTable from '../Table/StatefulTable';
import { generateTableSampleValues } from '../TimeSeriesCard/timeSeriesUtils';
import { csvDownloadHandler } from '../../utils/componentUtilityFunctions';
import CardToolbar from '../Card/CardToolbar';
import { getUpdatedCardSize, formatNumberWithPrecision } from '../../utils/cardUtilityFunctions';

import ThresholdIcon from './ThresholdIcon';

const StyledOverflowMenu = styled(OverflowMenu)`
  &&& {
    margin-left: 10px;
    opacity: 1;
    overflow-y: hidden;
    display: flex;
    align-items: center;

    .bx--overflow-menu__icon {
      transform: none;
    }
  }
`;

const StyledActionIcon = styled(Icon)`
  cursor: pointer;
  margin-left: 11px;
  &:hover {
    fill: rgb(61, 112, 178);
  }
`;

const StyledStatefulTable = styled(({ showHeader, isExpanded, data, ...rest }) => (
  <StatefulTable {...rest} data={data} />
))`
  flex: inherit;
  height: 100%;
  position: relative;
  overflow-y: ${props => (!props.isExpanded ? 'hidden' : 'auto')};
  padding-bottom: ${props => (props.isExpanded ? '3rem' : '')};
  &&& {
    .bx--pagination {
      position: ${props => (!props.isExpanded ? 'absolute' : 'fixed')};
      bottom: ${props => (!props.isExpanded ? '0px' : '25px')};
      ${props => (props.isExpanded ? `width: calc(100% - 50px)` : ``)}
    }
    .bx--data-table-container {
      ${props =>
        props.data && props.data.length > 0 && !props.isExpanded
          ? `max-height: 435px;`
          : `height: 90%;`}
    }

    .bx--list-box__menu-item {
      height: 2rem;
      font-weight: normal;
    }

    .bx--table-toolbar {
      padding-bottom: 2px;
      padding-top: 0px;
    }
    .bx--data-table th:first-of-type,
    .bx--data-table td:first-of-type {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .bx--data-table thead {
      display: ${props => (!props.showHeader ? 'none' : '')};
      tr {
        height: 2rem;
      }
    }

    .bx--data-table tbody tr {
      height: 2.5rem;
    }
    .bx--data-table-container + .bx--pagination {
      border: 1px solid #dfe3e6;
    }

    .bx--toolbar-search-container {
      margin-left: 1rem;
    }
    .bx--data-table {
      ${props => (props.data && props.data.length > 0 ? `height: initial;` : `height: 100%;`)}
      td {
        white-space: nowrap;
      }
    }
    .bx--data-table thead tr:nth-child(2) {
      height: 3rem;

      th {
        padding-top: 5px;
        padding-bottom: 10px;

        input {
          height: 2rem;
        }
      }
      th div.bx--form-item {
        display: block;
        .bx--list-box {
          height: auto;
        }
      }
      th div.bx--list-box {
        height: auto;
        .bx--list-box__selection {
          height: inherit;
        }
      }
    }
  }
`;

const StyledExpandedRowContent = styled.div`
  padding-left: 35px;
  padding-bottom: 8px;
  padding-top: 24px;

  p {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
  }
`;

const StyledExpandedDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 16px;
`;

const defaultProps = {
  size: CARD_SIZES.LARGE,
  locale: 'en',
  values: [],
  i18n: {
    criticalLabel: 'Critical',
    moderateLabel: 'Moderate',
    lowLabel: 'Low',
    selectSeverityPlaceholder: 'Select a severity',
    searchPlaceholder: 'Search',
    filterButtonAria: 'Filters',
    defaultFilterStringPlaceholdText: 'Type and hit enter to apply',
    downloadIconDescription: 'Download table content',
    severityLabel: 'Severity',
    emptyMessage: 'There is no data for this time range.',
    // Card-specific labels needed for combo with table toolbar
    last24HoursLabel: 'Last 24 hrs',
    last7DaysLabel: 'Last 7 days',
    lastMonthLabel: 'Last month',
    lastQuarterLabel: 'Last quarter',
    lastYearLabel: 'Last year',
    periodToDateLabel: 'Period to date',
    thisWeekLabel: 'This week',
    thisMonthLabel: 'This month',
    thisQuarterLabel: 'This quarter',
    thisYearLabel: 'This year',
    hourlyLabel: 'Hourly',
    dailyLabel: 'Daily',
    weeklyLabel: 'Weekly',
    monthlyLabel: 'Monthly',
    defaultLabel: 'Default',
    closeLabel: 'Close',
    expandLabel: 'Expand to fullscreen',
  },
};
/**
 * Returns an array of matching thresholds will only return the highest severity threshold for a column
 * If passed a columnId, it filters the threshold check on the current column only
 */
export const findMatchingThresholds = (thresholds, item, columnId) => {
  return thresholds
    .filter(t => {
      const { comparison, value, dataSourceId } = t;
      // Does the threshold apply to the current column?
      if (columnId && !columnId.includes(dataSourceId)) {
        return false;
      }

      switch (comparison) {
        case '<':
          return !isNil(item[dataSourceId]) && parseFloat(item[dataSourceId]) < value;
        case '>':
          return parseFloat(item[dataSourceId]) > value;
        case '=':
          return parseFloat(item[dataSourceId]) === value;
        case '<=':
          return !isNil(item[dataSourceId]) && parseFloat(item[dataSourceId]) <= value;
        case '>=':
          return parseFloat(item[dataSourceId]) >= value;
        default:
          return false;
      }
    })
    .reduce((highestSeverityThreshold, threshold) => {
      const currentThresholdIndex = highestSeverityThreshold.findIndex(
        currentThreshold => currentThreshold.dataSourceId === threshold.dataSourceId
      );

      if (
        // If I don't have a threshold currently for this column
        currentThresholdIndex < 0
      ) {
        highestSeverityThreshold.push({ ...threshold, currentValue: item[threshold.dataSourceId] }); //eslint-disable-line
      } // The lowest severity is actually the most severe
      else if (highestSeverityThreshold[currentThresholdIndex].severity > threshold.severity) {
        // eslint-disable-next-line
        highestSeverityThreshold[currentThresholdIndex] = {
          ...threshold,
          currentValue: item[threshold.dataSourceId],
        };
      }
      return highestSeverityThreshold;
    }, []);
};

const determinePrecisionAndValue = (precision = 0, value, locale) => {
  const precisionDefined = Number.isInteger(value) ? 0 : precision;

  if (typeof value === 'number') {
    return formatNumberWithPrecision(value, precisionDefined, locale);
  }
  if (isNil(value)) {
    return '--';
  }
  return '--';
};

const TableCard = ({
  id,
  title,
  isExpanded,
  content: { columns = [], showHeader, expandedRows, sort, thresholds, emptyMessage },
  size,
  onCardAction,
  values: data,
  isEditable,
  i18n,
  tooltip,
  locale,
  ...others
}) => {
  // Set the locale
  moment.locale(locale);
  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  /** adds the id to the card action */
  const cachedOnCardAction = useCallback((...args) => onCardAction(id, ...args), [
    onCardAction,
    id,
  ]);

  const renderActionCell = cellItem => {
    const actionList = JSON.parse(cellItem.value);
    return actionList && actionList.length === 1 ? (
      <StyledActionIcon
        onClick={evt => {
          evt.preventDefault();
          evt.stopPropagation();
          onCardAction(id, 'TABLE_CARD_ROW_ACTION', {
            rowId: cellItem.rowId,
            actionId: actionList[0].id,
          });
        }}
        icon={actionList[0].icon}
        description={actionList[0].label}
      />
    ) : actionList && actionList.length > 1 ? (
      <StyledOverflowMenu
        floatingMenu
        renderIcon={() => (
          <OverFlowMenuIcon fill="#5a6872" description={i18n.overflowMenuIconDescription} />
        )}
      >
        {actionList.map(item => {
          return (
            <OverflowMenuItem
              key={item.id}
              itemText={item.labelText}
              onClick={evt => {
                evt.preventDefault();
                evt.stopPropagation();
                onCardAction(id, 'TABLE_CARD_ROW_ACTION', {
                  rowId: cellItem.rowId,
                  actionId: item.id,
                });
              }}
            />
          );
        })}
      </StyledOverflowMenu>
    ) : null;
  };

  const strings = {
    ...defaultProps.i18n,
    ...i18n,
  };

  const renderThresholdIcon = cellItem => {
    const matchingThresholdValue = findMatchingThresholds(
      thresholds,
      cellItem.row,
      cellItem.columnId
    )[0];

    return matchingThresholdValue ? (
      <ThresholdIcon
        title={`${matchingThresholdValue.dataSourceId}: ${matchingThresholdValue.currentValue} ${
          matchingThresholdValue.comparison
        } ${matchingThresholdValue.value}`}
        {...matchingThresholdValue}
        strings={strings}
        showSeverityLabel={matchingThresholdValue.showSeverityLabel}
        severityLabel={matchingThresholdValue.severityLabel}
        renderIconByName={others.renderIconByName}
      />
    ) : null;
  };

  // Should the table data be filtered to only match on threshold
  const uniqueThresholds = uniqBy(thresholds, 'dataSourceId');
  const onlyShowIfColumnHasData = uniqueThresholds.find(i => i.showOnContent);
  const tableData = useMemo(
    () =>
      onlyShowIfColumnHasData
        ? data.map(i => (i.values[onlyShowIfColumnHasData.dataSourceId] ? i : null)).filter(i => i)
        : data,
    [onlyShowIfColumnHasData, data]
  );

  // always add the last action column has default
  const actionColumn = [
    {
      id: 'actionColumn',
      name: '',
      width: '60px',
      isSortable: false,
      renderDataFunction: renderActionCell,
      priority: 1,
    },
  ];

  const hasActionColumn = data.filter(i => i.actions).length > 0;

  // filter to get the indexes for each one
  const columnsUpdated = cloneDeep(columns);

  /**
   * Generates a threshold column based off the uniqueThreshold's value
   * @param {string} columnId AKA dataSourceId
   * @returns {Object} new threshold column
   */
  const generateThresholdColumn = columnId => {
    // Need to find the index of the dataSource regardless of uniqueThresholds ordering
    const uniqueThresholdIndex = uniqueThresholds.findIndex(
      threshold => threshold.dataSourceId === columnId
    );
    return {
      id: `iconColumn-${columnId}`,
      label: uniqueThresholds[uniqueThresholdIndex].label
        ? uniqueThresholds[uniqueThresholdIndex].label
        : `${capitalize(columnId)} ${strings.severityLabel}`,
      width: uniqueThresholds[uniqueThresholdIndex].width,
      isSortable: true,
      renderDataFunction: renderThresholdIcon,
      priority: 1,
      filter: {
        placeholderText: strings.selectSeverityPlaceholder,
        options: [
          {
            id: 1,
            text: strings.criticalLabel,
          },
          {
            id: 2,
            text: strings.moderateLabel,
          },
          {
            id: 3,
            text: strings.lowLabel,
          },
        ],
      },
    };
  };

  // Don't add the icon column in sample mode
  if (!isEditable) {
    // Add the new threshold columns to the existing columns
    uniqueThresholds.forEach(threshold => {
      const columnIndex = columnsUpdated.findIndex(
        column => column.dataSourceId === threshold.dataSourceId
      );
      // If columnIndex is not -1, there was a match so add the column. Otherwise, skip the column as it will be added
      // in the next call
      if (columnIndex !== -1) {
        columnsUpdated.splice(columnIndex, 0, generateThresholdColumn(threshold.dataSourceId));
      }
    });

    // Check for any threshold columns that weren't matched (if the column was hidden) and add to the end of the array
    const missingThresholdColumns = uniqueThresholds.filter(threshold => {
      return !find(columnsUpdated, column => {
        return threshold.dataSourceId === column.dataSourceId;
      });
    });

    if (missingThresholdColumns.length > 0) {
      columnsUpdated.splice(
        columnsUpdated.length,
        0,
        ...missingThresholdColumns.map(({ dataSourceId }) => generateThresholdColumn(dataSourceId))
      );
    }
  }

  const newColumns = thresholds ? columnsUpdated : columns;

  const columnsToRender = useMemo(
    () =>
      newColumns
        .map(i => ({
          ...i,
          id: i.dataSourceId ? i.dataSourceId : i.id,
          name: i.label ? i.label : i.dataSourceId || '', // don't force label to be required
          isSortable: true,
          width: i.width ? `${i.width}px` : newSize === CARD_SIZES.LARGETHIN ? '150px' : '', // force the text wrap
          filter: i.filter
            ? i.filter
            : { placeholderText: strings.defaultFilterStringPlaceholdText }, // if filter not send we send empty object
        }))
        .concat(hasActionColumn ? actionColumn : [])
        .map(column => {
          const columnPriority = column.priority || 1; // default to 1 if not provided
          switch (newSize) {
            case CARD_SIZES.LARGETHIN:
              return columnPriority === 1 ? column : null;

            case CARD_SIZES.LARGE:
              return columnPriority === 1 || columnPriority === 2 ? column : null;

            case CARD_SIZES.LARGEWIDE:
              return column;

            default:
              return column;
          }
        })
        .filter(i => i),
    [actionColumn, hasActionColumn, newColumns, newSize, strings.defaultFilterStringPlaceholdText]
  );

  const filteredTimestampColumns = useMemo(
    () =>
      columns
        .map(column => (column.type && column.type === 'TIMESTAMP' ? column.dataSourceId : null))
        .filter(i => !isNil(i)),
    [columns]
  );

  const filteredPrecisionColumns = useMemo(
    () =>
      columns
        .map(column =>
          column.precision
            ? { dataSourceId: column.dataSourceId, precision: column.precision }
            : null
        )
        .filter(i => !isNil(i)),
    [columns]
  );

  // if we're in editable mode, generate fake data
  const tableDataWithTimestamp = useMemo(
    () =>
      isEditable
        ? generateTableSampleValues(id, columns)
        : hasActionColumn ||
          filteredTimestampColumns.length ||
          filteredPrecisionColumns.length ||
          thresholds
        ? tableData.map(i => {
            // if has custom action
            const action = hasActionColumn
              ? { actionColumn: JSON.stringify(i.actions || []) }
              : null;

            // if has column with timestamp
            const timestampUpdated = filteredTimestampColumns.length
              ? Object.keys(i.values)
                  .map(value =>
                    filteredTimestampColumns.includes(value)
                      ? { [value]: moment(i.values[value]).format('L HH:mm') }
                      : null
                  )
                  .filter(v => !isNil(v))[0]
              : null;

            const matchingThresholds = thresholds
              ? findMatchingThresholds(thresholds, i.values)
              : null;

            // map each of the matching thresholds into a data object
            const iconColumns = matchingThresholds
              ? matchingThresholds.reduce(
                  (thresholdData, threshold) => {
                    thresholdData[`iconColumn-${threshold.dataSourceId}`] = threshold.severity; // eslint-disable-line
                    return thresholdData;
                  },

                  {}
                )
              : null;

            // if column have custom precision value
            const precisionUpdated = filteredPrecisionColumns.length
              ? Object.keys(i.values).reduce((acc, value) => {
                  const precision = filteredPrecisionColumns.find(
                    item => item.dataSourceId === value
                  );

                  // If I find a precision column it should override the normal
                  if (precision) {
                    acc[value] = determinePrecisionAndValue(
                      precision.precision,
                      i.values[value],
                      locale
                    );
                  }

                  return acc;
                }, {})
              : null;

            return {
              id: i.id,
              values: {
                ...iconColumns,
                ...action,
                ...i.values,
                ...action,
                ...timestampUpdated,
                ...precisionUpdated,
              },
              isSelectable: false,
            };
          })
        : tableData,
    [
      isEditable,
      id,
      columns,
      hasActionColumn,
      filteredTimestampColumns,
      filteredPrecisionColumns,
      thresholds,
      tableData,
      locale,
    ]
  );

  // format expanded rows to send to Table component
  const expandedRowsFormatted = useMemo(
    () =>
      expandedRows && expandedRows.length
        ? tableData.map(dataItem => {
            // filter the data keys and find the expandaded row exist for that key
            const expandedItem = Object.keys(dataItem.values)
              .map(value => expandedRows.filter(item => item.id === value)[0])
              .filter(i => i);

            return {
              rowId: dataItem.id,
              content: (
                <StyledExpandedRowContent key={`${dataItem.id}-expanded`}>
                  {expandedItem.length ? (
                    expandedItem.map((item, index) => (
                      <StyledExpandedDiv key={`${item.id}-expanded-${index}`}>
                        <p key={`${item.id}-label`} style={{ marginRight: '5px' }}>
                          {item ? item.label : '--'}
                        </p>
                        <span>{item ? dataItem.values[item.id] : null}</span>
                      </StyledExpandedDiv>
                    ))
                  ) : (
                    <StyledExpandedDiv key={`${dataItem.id}-expanded`}>
                      {' '}
                      <p key={`${dataItem.id}-label`}>--</p>
                    </StyledExpandedDiv>
                  )}
                </StyledExpandedRowContent>
              ),
            };
          })
        : [],
    [expandedRows, tableData]
  );

  // is columns recieved is different from the columnsToRender show card expand
  const isExpandable =
    columns.length !==
    columnsToRender.filter(item => item.id !== 'actionColumn' && !item.id.includes('iconColumn'))
      .length;

  const hasFilter = newSize !== CARD_SIZES.LARGETHIN;

  const hasRowExpansion = !!(expandedRows && expandedRows.length);

  // Defined the first column to be sorted, if column has defined sort
  const columnStartSortDefined = columnsToRender.find(item => item.sort);

  // if not sort by column provided, sort on the first priority 1 column
  const columnStartSort = !columnStartSortDefined
    ? columnsToRender.find(item => item.priority === 1)
    : columnStartSortDefined;

  const cardToolbar = (
    <CardToolbar
      availableActions={{ expand: isExpandable, range: true }}
      i18n={i18n}
      isEditable={isEditable}
      isExpanded={isExpanded}
      onCardAction={cachedOnCardAction}
      {...others}
    />
  );

  return (
    <Card
      id={id}
      size={newSize}
      onCardAction={onCardAction}
      availableActions={{ expand: isExpandable, range: true }}
      isEditable={isEditable}
      isExpanded={isExpanded}
      i18n={i18n}
      hideHeader
      {...others}
    >
      {({ height }) => {
        const numberOfRowsPerPage = !isNil(height) ? Math.floor((height - 48 * 3) / 48) : 10;
        return (
          <StyledStatefulTable
            columns={columnsToRender}
            data={tableDataWithTimestamp}
            id={`table-for-card-${id}`}
            isExpanded={isExpanded}
            secondaryTitle={title}
            tooltip={tooltip}
            options={{
              hasPagination: true,
              hasSearch: true,
              hasFilter,
              hasRowExpansion,
            }}
            expandedData={expandedRowsFormatted}
            actions={{
              table: {
                onRowClicked: () => {},
                onRowExpanded: () => {},
                onChangeSort: () => {},
              },
              pagination: { onChangePage: () => {} },
              toolbar: {
                onClearAllFilters: () => {},
                onToggleFilter: () => {},
                onDownloadCSV: () => csvDownloadHandler(tableDataWithTimestamp, title),
              },
            }}
            view={{
              pagination: {
                pageSize: numberOfRowsPerPage,
                pageSizes: [numberOfRowsPerPage, 25, 100],
                isItemPerPageHidden: !isExpanded,
              },
              toolbar: {
                activeBar: null,
                isDisabled: isEditable,
                customToolbarContent: cardToolbar,
              },
              filters: [],
              table: {
                ...(columnStartSort
                  ? {
                      sort: {
                        columnId: columnStartSort.id,
                        direction: !columnStartSortDefined ? sort : columnStartSortDefined.sort,
                      },
                    }
                  : {}),
                emptyState: {
                  message: emptyMessage || strings.emptyMessage,
                },
              },
            }}
            showHeader={showHeader !== undefined ? showHeader : true}
            i18n={i18n} // TODO: add Card defaultprops ?
          />
        );
      }}
    </Card>
  );
};

TableCard.propTypes = { ...CardPropTypes, ...TableCardPropTypes };
TableCard.displayName = 'TableCard';
TableCard.defaultProps = defaultProps;
TableCard.defaultProps.i18n = { ...defaultProps.i18n, ...CardDefaultProps.i18n };
export default TableCard;
