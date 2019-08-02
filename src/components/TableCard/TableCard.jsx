import React from 'react';
import { OverflowMenu, OverflowMenuItem, Icon, Button } from 'carbon-components-react';
import styled from 'styled-components';
import moment from 'moment';
import Download16 from '@carbon/icons-react/lib/download/16';

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

const StyledStatefulTable = styled(({ showHeader, ...rest }) => <StatefulTable {...rest} />)`
  flex: inherit;
  height: 100%;
  margin: 0 -1px;
  position: relative;

  &&& {
    .bx--data-table-v2 thead tr:nth-child(2) {
      height: 3rem;

      th {
        padding-top: 5px;
        padding-bottom: 10px;

        input {
          height: 2rem;
        }
      }
      th div {
        display: block;
      }
    }
  }

  .bx--table-toolbar {
    padding-bottom: 2px;
    padding-top: 0px;
  }
  .bx--data-table-v2 th:first-of-type,
  .bx--data-table-v2 td:first-of-type {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .bx--data-table-v2 thead {
    display: ${props => (!props.showHeader ? 'none' : '')};
    tr {
      height: 2rem;
    }
  }

  .bx--data-table-v2 tbody tr {
    height: 2.5rem;
  }
  .bx--data-table-v2-container + .bx--pagination {
    border: 1px solid #dfe3e6;
  }
  .bx--pagination {
    position: absolute;
    bottom: 0;
  }
  .bx--toolbar-search-container {
    margin-left: 1rem;
  }

  .bx--data-table-v2-container {
    max-height: 435px;
  }
`;

const StyledExpandedRowContent = styled.div`
  padding-left: 35px;
  padding-bottom: 15px;
  padding-top: 16px;
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

const StyledIcon = styled(Icon)`
  width: 16px;
  height: 16px;
  ${props =>
    props.color &&
    `
    color: ${props.color};
    fill: ${props.color};
  `}
`;

const TableCard = ({
  id,
  title,
  content: { columns = [], showHeader, expandedRows, sort },
  size,
  onCardAction,
  values: data,
  isEditable,
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
        name={actionList[0].icon}
      />
    ) : actionList && actionList.length > 1 ? (
      <StyledOverflowMenu
        floatingMenu
        renderIcon={() => (
          <Icon name="icon--overflow-menu" width="16px" height="16" fill="#5a6872" />
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

  // if there is icon row add column
  const iconColumn = [
    {
      id: 'iconColumn',
      name: '',
      width: '20px',
      isSortable: false,
      priority: 1,
    },
  ];

  const hasActionColumn = data.filter(i => i.actions).length > 0;
  const hasIconColumn = data.filter(i => i.rowIcon).length > 0;

  const newColumns = hasIconColumn ? [...iconColumn, ...columns] : columns;
  const columnsToRender = newColumns
    .map(i => ({
      ...i,
      id: i.dataSourceId ? i.dataSourceId : i.id,
      name: i.label ? i.label : i.name,
      isSortable: true, // i.isSortable ? i.isSortable : true,
      width: i.width ? i.width : size === CARD_SIZES.TALL ? '150px' : '', // force the text wrap
      filter: i.filter ? i.filter : {}, // if filter not send we send empty object
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
    .filter(i => i);

  const filteredTimestampColumns = columns
    .map(column => (column.type && column.type === 'TIMESTAMP' ? column.dataSourceId : null))
    .filter(i => i);

  // if we're in editable mode, generate fake data
  const tableData = isEditable
    ? generateTableSampleValues(columns)
    : hasActionColumn || filteredTimestampColumns.length
    ? data.map(i => {
        // if has custom action
        const action = hasActionColumn ? { actionColumn: JSON.stringify(i.actions || []) } : null;

        // if has column with timestamp
        const valueUpdated = filteredTimestampColumns.length
          ? Object.keys(i.values)
              .map(value =>
                filteredTimestampColumns.includes(value)
                  ? { [value]: moment(i.values[value]).format('LLL') }
                  : null
              )
              .filter(v => v)[0]
          : null;

        // check if any row has the rowIcon , if so add as a new row
        const icon = i.rowIcon
          ? {
              iconColumn: <StyledIcon name={i.rowIcon.icon} color={i.rowIcon.color} />,
            }
          : null;

        return {
          id: i.id,
          values: {
            ...icon,
            ...i.values,
            ...action,
            ...valueUpdated,
          },
        };
      })
    : data;

  // format expanded rows to send to Table component
  const expandedRowsFormatted = [];
  if (expandedRows && expandedRows.length) {
    expandedRows.forEach(expandedItem => {
      tableData.forEach(item => {
        if (item.values.hasOwnProperty(expandedItem.id)) {
          expandedRowsFormatted.push({
            rowId: item.id,
            content: (
              <StyledExpandedRowContent>
                <p>{expandedItem.label}</p>
                {item.values[expandedItem.id]}
              </StyledExpandedRowContent>
            ),
          });
        }
      });
    });
  }

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

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', exportedFilenmae);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // is columns recieved is different from the columnsToRender show card expand
  const isExpandable =
    columns.length !==
    columnsToRender.filter(item => item.id !== 'actionColumn' && item.id !== 'iconColumn').length;

  const hasFilter = size !== CARD_SIZES.TALL;

  const hasRowExpansion = !!(expandedRows && expandedRows.length);

  const columnStartSort = columnsToRender.find(item => item.priority === 1);

  return (
    <Card
      id={id}
      title={title}
      size={size}
      onCardAction={onCardAction}
      availableActions={{ expand: isExpandable }}
      isEditable={isEditable}
      {...others}
    >
      <StyledStatefulTable
        columns={columnsToRender}
        data={tableData}
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
            pageSize: 10,
            pageSizes: [10],
            isItemPerPageHidden: true,
          },
          toolbar: {
            activeBar: null,
            isDisabled: isEditable,
            customToolbarContent: (
              <ToolbarButton
                kind="ghost"
                small
                renderIcon={Download16}
                onClick={() => csvDownloadHandler()}
              />
            ),
          },
          filters: [],
          table: {
            ...(columnStartSort
              ? {
                  sort: {
                    columnId: columnStartSort.id,
                    direction: sort,
                  },
                }
              : {}),
          },
        }}
        showHeader={showHeader !== undefined ? showHeader : true}
      />
    </Card>
  );
};

TableCard.propTypes = { ...CardPropTypes, ...TableCardPropTypes };
TableCard.displayName = 'TableCard';
TableCard.defaultProps = {
  size: CARD_SIZES.LARGE,
  values: [],
};
export default TableCard;
