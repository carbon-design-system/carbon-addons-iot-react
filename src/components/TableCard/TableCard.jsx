import React from 'react';
import { OverflowMenu, OverflowMenuItem, Icon } from 'carbon-components-react';
import styled from 'styled-components';

import { CardPropTypes, TableCardPropTypes } from '../../constants/PropTypes';
import Card from '../Card/Card';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import StatefulTable from '../Table/StatefulTable';

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
        max-width: 90%;
        width: 90%;
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

const TableCard = ({
  id,
  title,
  content: { columns, showHeader, expandedRows },
  size,
  onCardAction,
  values: data,
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

  const hasActionColumn = data.filter(i => i.actions).length > 0;

  const columnsToRender = columns
    .map(i => ({
      ...i,
      isSortable: true,
      width: i.width ? i.width : size === CARD_SIZES.TALL ? '150px' : '', // force the text wrap
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

  const tableData = hasActionColumn
    ? data.map(i => ({
        id: i.id,
        values: {
          ...i.values,
          actionColumn: JSON.stringify(i.actions || []),
        },
      }))
    : data;

  // is columns recieved is different from the columnsToRender show card expand
  const isExpandable =
    columns.length !== columnsToRender.filter(item => item.id !== 'actionColumn').length;

  const hasFilter = size !== CARD_SIZES.TALL;

  const hasRowExpansion = !!(expandedRows && expandedRows.length);

  return (
    <Card
      id={id}
      title={title}
      size={size}
      onCardAction={onCardAction}
      availableActions={{ expand: isExpandable }}
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
        expandedData={expandedRows}
        actions={{
          table: { onRowClicked: () => {}, onRowExpanded: () => {} },
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
          },
          filters: [],
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
