import React, { useMemo } from 'react';
import { OverflowMenu, OverflowMenuItem, Icon, Button } from 'carbon-components-react';
import styled from 'styled-components';
import moment from 'moment';
import Download16 from '@carbon/icons-react/lib/download/16';
import fileDownload from 'js-file-download';
import isNil from 'lodash/isNil';
import uniqBy from 'lodash/uniqBy';
import cloneDeep from 'lodash/cloneDeep';
import capitalize from 'lodash/capitalize';
import OverFlowMenuIcon from '@carbon/icons-react/lib/overflow-menu--vertical/16';

import { CardPropTypes, TableCardPropTypes } from '../../constants/PropTypes';
import Card from '../Card/Card';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import StatefulTable from '../Table/StatefulTable';
import { generateTableSampleValues } from '../TimeSeriesCard/timeSeriesUtils';

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
  overflow-y: hidden;
  &&& {
    .bx--pagination {
      position: absolute;
      bottom: 0;
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

const ToolbarButton = styled(Button)`
  &.bx--btn > svg {
    margin: 0;
  }
`;

const StyledIconDiv = styled.div`
  display: flex;
`;

const StyledSpan = styled.span`
  margin-left: 5px;
`;

const StyledExpandedDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 16px;
`;

const defaultProps = {
  size: CARD_SIZES.LARGE,
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
        highestSeverityThreshold.push(threshold); //eslint-disable-line
      } // The lowest severity is actually the most severe
      else if (highestSeverityThreshold[currentThresholdIndex].severity > threshold.severity) {
        highestSeverityThreshold[currentThresholdIndex] = threshold; //eslint-disable-line
      }
      return highestSeverityThreshold;
    }, []);
};

const determinePrecisionAndValue = (precision, value) => {
  const precisionDefined = Number.isInteger(value) ? 0 : precision;

  if (typeof value === 'number') {
    return value > 1000000000000
      ? `${(value / 1000000000000).toFixed(precisionDefined)}T`
      : value > 1000000000
      ? `${(value / 1000000000).toFixed(precisionDefined)}B`
      : value > 1000000
      ? `${(value / 1000000).toFixed(precisionDefined)}M`
      : value > 1000
      ? `${(value / 1000).toFixed(precisionDefined)}K`
      : value.toFixed(precisionDefined);
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
  ...others
}) => {
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

    let thresholdIcon = null;
    if (matchingThresholdValue) {
      switch (matchingThresholdValue.severity) {
        case 1:
          thresholdIcon = (
            <StyledIconDiv
              title={`${matchingThresholdValue.dataSourceId} ${matchingThresholdValue.comparison} ${
                matchingThresholdValue.value
              }`}
            >
              <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
                <g
                  id="Artboard-Copy-2"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g id="Group">
                    <path
                      d="M15.483595,4.16821623 L11.828224,0.514898318 C11.4996389,0.186340499 11.0498759,0 10.5847164,0 L5.4141139,0 C4.94895439,0 4.49919139,0.186340499 4.17043702,0.51506755 L0.515728028,4.16947288 C0.186857661,4.49695966 1.58095759e-13,4.94738907 1.58095759e-13,5.41374714 L1.58095759e-13,10.5845032 C1.58095759e-13,11.0496811 0.18637442,11.4994512 0.515144768,11.8281943 L4.17032421,15.4842364 C4.50074437,15.813273 4.94971353,16 5.4141139,16 L10.5841331,16 C11.0519715,16 11.4969656,15.8151662 11.82781,15.4843492 L15.4864327,11.8277802 C15.8179763,11.4922167 16,11.0496451 16,10.5845032 L16,5.41374714 C16.00134,4.94645588 15.816286,4.49993244 15.483595,4.16821623 Z"
                      id="outline-color"
                      fill="#FFFFFF"
                    />
                    <path
                      d="M14.7771914,4.87602583 L11.1213159,1.22220371 C10.9801669,1.08106644 10.7847747,1 10.5847164,1 L5.4141139,1 C5.21405561,1 5.01866342,1.08106644 4.87751443,1.22220371 L1.22280543,4.87660904 C1.08107318,5.0177463 1,5.21312227 1,5.41374714 L1,10.5845032 C1,10.7845449 1.08107318,10.9799208 1.22222217,11.1210581 L4.87751443,14.7772131 C5.01924668,14.9183503 5.21463888,15 5.4141139,15 L10.5841331,15 C10.7865245,15 10.9772506,14.9206832 11.1207326,14.7772131 L14.7795244,11.1204749 C14.9218399,10.9764216 15,10.7862945 15,10.5845032 L15,5.41374714 C15.0005801,5.21020621 14.9212567,5.01949594 14.7771914,4.87602583 Z"
                      id="background-color"
                      fill="#DA1E28"
                    />
                    <polygon
                      id="icon-color"
                      fill="#FFFFFF"
                      points="10.3185714 11.001753 8 8.68318155 5.68142857 11.001753 5 10.3203244 7.31857143 8.00175297 5 5.68318155 5.68142857 5.00175297 8 7.3203244 10.3185714 5.00175297 11 5.68318155 8.68142857 8.00175297 11 10.3203244"
                    />
                  </g>
                </g>
              </svg>
              <StyledSpan>{strings.criticalLabel}</StyledSpan>
            </StyledIconDiv>
          );
          break;
        case 2:
          thresholdIcon = (
            <StyledIconDiv
              title={`${matchingThresholdValue.dataSourceId} ${matchingThresholdValue.comparison} ${
                matchingThresholdValue.value
              }`}
            >
              <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
                <g id="Artboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Group">
                    <path
                      d="M15.7894601,14.2675131 C15.5195241,14.7230623 15.029513,15.0024208 14.5000526,15.0025132 L1.53339891,15.0021846 C0.996512233,15.0159597 0.493279942,14.7413061 0.202531324,14.2625132 C-0.0652585874,13.7984115 -0.0652585874,13.2266148 0.189272648,12.78623 L6.68470115,0.787539475 C6.94639352,0.302404679 7.45295465,2.66453526e-15 8.00391648,2.66453526e-15 C8.55487831,2.66453526e-15 9.06143944,0.302404679 9.3224242,0.78623001 L15.8183281,12.7858011 C16.0707419,13.2512161 16.0592142,13.8153414 15.7894601,14.2675131 Z"
                      id="outline-color"
                      fill="#FFFFFF"
                    />
                    <path
                      d="M14.941052,13.2599875 L8.44460575,1.26245909 C8.35737079,1.1007808 8.18850902,1 8.00484631,1 C7.82118359,1 7.65232182,1.1007808 7.56508686,1.26245909 L1.06864057,13.2599875 C0.979373004,13.4146562 0.979373004,13.6052158 1.06864057,13.7598845 C1.16167713,13.9128935 1.32942924,14.0044259 1.50840001,13.9998351 L14.5012926,13.9998351 C14.6777297,13.9998043 14.8410746,13.906704 14.9310575,13.7548855 C15.0215326,13.6032635 15.0253318,13.4151411 14.941052,13.2599875 Z"
                      id="background-color"
                      fill="#FC7B1E"
                    />
                    <path
                      d="M7.50084897,5.75 L8.50084897,5.75 L8.50084897,9.75 L7.50084897,9.75 L7.50084897,5.75 Z M8.00084897,12.5 C7.58663541,12.5 7.25084897,12.1642136 7.25084897,11.75 C7.25084897,11.3357864 7.58663541,11 8.00084897,11 C8.41506253,11 8.75084897,11.3357864 8.75084897,11.75 C8.75084897,12.1642136 8.41506253,12.5 8.00084897,12.5 Z"
                      id="symbol-color"
                      fill="#FFFFFF"
                    />
                  </g>
                </g>
              </svg>
              <StyledSpan>{strings.moderateLabel}</StyledSpan>
            </StyledIconDiv>
          );
          break;
        case 3:
          thresholdIcon = (
            <StyledIconDiv
              title={`${matchingThresholdValue.dataSourceId} ${matchingThresholdValue.comparison} ${
                matchingThresholdValue.value
              }`}
            >
              <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
                <g id="Artboard-Copy" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Group">
                    <path
                      d="M8,16 C3.581722,16 0,12.418278 0,8 C0,3.581722 3.581722,0 8,0 C12.418278,0 16,3.581722 16,8 C16,12.418278 12.418278,16 8,16 Z"
                      id="outline-color"
                      fill="#FFFFFF"
                    />
                    <circle id="background-color" fill="#FDD13A" cx="8" cy="8" r="7" />
                    <path
                      d="M7.22,4 L8.47,4 L8.47,8 L7.22,8 L7.22,4 Z M7.875,11.9 C7.39175084,11.9 7,11.5082492 7,11.025 C7,10.5417508 7.39175084,10.15 7.875,10.15 C8.35824916,10.15 8.75,10.5417508 8.75,11.025 C8.75,11.5082492 8.35824916,11.9 7.875,11.9 Z"
                      id="symbol-color"
                      fill="#FFFFFF"
                    />
                  </g>
                </g>
              </svg>
              <StyledSpan>{strings.lowLabel}</StyledSpan>
            </StyledIconDiv>
          );
          break;
        default:
          break;
      }
    }
    return thresholdIcon;
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

  // Don't add the icon column in sample mode
  if (!isEditable) {
    const indexes = columns
      .map((column, index) =>
        uniqueThresholds.filter(item => item.dataSourceId === column.dataSourceId)[0]
          ? { i: index, columnId: column.dataSourceId }
          : null
      )
      .filter(i => !isNil(i));
    indexes.forEach(({ i, columnId }, index) =>
      columnsUpdated.splice(index !== 0 ? i + 1 : i, 0, {
        id: `iconColumn-${columnId}`,
        label: uniqueThresholds[index].label
          ? uniqueThresholds[index].label
          : `${capitalize(columnId)} ${strings.severityLabel}`,
        width: '140px',
        isSortable: true,
        renderDataFunction: renderThresholdIcon,
        priority: 1,
        filter: {
          placeholderText: strings.selectSeverityPlaceholder,
          options: [
            {
              id: '1',
              text: strings.criticalLabel,
            },
            {
              id: '2',
              text: strings.moderateLabel,
            },
            {
              id: '3',
              text: strings.lowLabel,
            },
          ],
        },
      })
    );
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
          width: i.width ? i.width : size === CARD_SIZES.TALL ? '150px' : '', // force the text wrap
          filter: i.filter
            ? i.filter
            : { placeholderText: strings.defaultFilterStringPlaceholdText }, // if filter not send we send empty object
        }))
        .concat(hasActionColumn ? actionColumn : [])
        .map(column => {
          const columnPriority = column.priority || 1; // default to 1 if not provided
          switch (size) {
            case CARD_SIZES.TALL:
              return columnPriority === 1 ? column : null;

            case CARD_SIZES.LARGE:
              return columnPriority === 1 || columnPriority === 2 ? column : null;

            case CARD_SIZES.XLARGE:
              return column;

            default:
              return column;
          }
        })
        .filter(i => i),
    [actionColumn, hasActionColumn, newColumns, size, strings.defaultFilterStringPlaceholdText]
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
              ? Object.keys(i.values)
                  .map(value => {
                    const precision = filteredPrecisionColumns.find(
                      item => item.dataSourceId === value
                    );

                    return precision
                      ? {
                          [value]: determinePrecisionAndValue(precision.precision, i.values[value]),
                        }
                      : null;
                  })
                  .filter(v => v)[0]
              : null;

            return {
              id: i.id,
              values: {
                ...iconColumns,
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

  const csvDownloadHandler = () => {
    let csv = '';
    // get all keys availavle and merge it
    let object = [];
    data.forEach(item => {
      object = [...object, ...Object.keys(item.values)];
    });
    object = [...new Set(object)];
    csv += `${object.join(',')}\n`;
    data.forEach(item => {
      object.forEach(arrayHeader => {
        csv += `${item.values[arrayHeader] ? item.values[arrayHeader] : ''},`;
      });
      csv += `\n`;
    });

    const exportedFilenmae = `${title}.csv` || 'export.csv';

    fileDownload(csv, exportedFilenmae);
  };

  // is columns recieved is different from the columnsToRender show card expand
  const isExpandable =
    columns.length !==
    columnsToRender.filter(item => item.id !== 'actionColumn' && !item.id.includes('iconColumn'))
      .length;

  const hasFilter = size !== CARD_SIZES.TALL;

  const hasRowExpansion = !!(expandedRows && expandedRows.length);

  // Defined the first column to be sorted, if column has defined sort
  const columnStartSortDefined = columnsToRender.find(item => item.sort);

  // if not sort by column provided, sort on the first priority 1 column
  const columnStartSort = !columnStartSortDefined
    ? columnsToRender.find(item => item.priority === 1)
    : columnStartSortDefined;

  return (
    <Card
      id={id}
      title={title}
      size={size}
      onCardAction={onCardAction}
      availableActions={{ expand: isExpandable, range: true }}
      isEditable={isEditable}
      isExpanded={isExpanded}
      i18n={i18n}
      {...others}
    >
      {({ height }) => {
        const numberOfRowsPerPage = !isNil(height) ? Math.floor((height - 48 * 3) / 48) : 10;
        return (
          <StyledStatefulTable
            columns={columnsToRender}
            data={tableDataWithTimestamp}
            isExpanded={isExpanded}
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
              },
            }}
            view={{
              pagination: {
                pageSize: numberOfRowsPerPage,
                pageSizes: [numberOfRowsPerPage],
                isItemPerPageHidden: true,
              },
              toolbar: {
                activeBar: null,
                isDisabled: isEditable,
                customToolbarContent: (
                  <ToolbarButton
                    kind="ghost"
                    size="small"
                    renderIcon={Download16}
                    iconDescription={strings.downloadIconDescription}
                    onClick={() => csvDownloadHandler()}
                    title={strings.downloadIconDescription}
                  />
                ),
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
            i18n={i18n}
          />
        );
      }}
    </Card>
  );
};

TableCard.propTypes = { ...CardPropTypes, ...TableCardPropTypes };
TableCard.displayName = 'TableCard';
TableCard.defaultProps = defaultProps;
export default TableCard;
