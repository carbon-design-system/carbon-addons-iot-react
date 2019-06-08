import React from 'react';
import { OverflowMenu, OverflowMenuItem, Icon } from 'carbon-components-react';
import styled from 'styled-components';

import { CardPropTypes, TableCardPropTypes } from '../../constants/PropTypes';
import Card from '../Card/Card';
import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import StatefulTable from '../Table/StatefulTable';

const StyledOverflowMenu = styled(OverflowMenu)`
  &&& {
    margin-left: 10px;
    opacity: 1;
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

const StyledStatefulTable = styled(StatefulTable)`
  flex: inherit;
  height: 100%;
  margin: 0 -1px;
  position: relative;

  .bx--table-toolbar {
    overflow: hidden;
  }

  .bx--table-toolbar {
    display: none;
  }
  .bx--data-table-v2 tr {
    height: 2.95rem;
  }
  .bx--data-table-v2 tr {
    height: 2.95rem;
  }
  .bx--data-table-v2-container + .bx--pagination {
    border: 1px solid #dfe3e6;
  }
  .bx--pagination {
    position: absolute;
    bottom: 0;
  }
`;

const TableCard = ({
  id,
  title,
  content: { columns, data },
  size,
  view,
  onCardAction,
  ...others
}) => {
  const layout = CARD_LAYOUTS.HORIZONTAL;

  const renderActionCell = cellItem => {
    return cellItem.value && cellItem.value.length === 1 ? (
      <StyledActionIcon
        onClick={evt => {
          evt.preventDefault();
          evt.stopPropagation();
          onCardAction(id, 'TABLE_CARD_ROW_ACTION', {
            rowId: cellItem.rowId,
            actionId: cellItem.value[0].id,
          });
        }}
        name={cellItem.value[0].icon}
      />
    ) : (
      <StyledOverflowMenu>
        {cellItem.value.map(item => {
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
    );
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

  const columnsToRender = columns
    .map(i => ({
      ...i,
      isSortable: true,
    }))
    .concat(actionColumn)
    .map(column => {
      switch (size) {
        case CARD_SIZES.TALL:
          return column.priority === 1 ? column : null;

        case CARD_SIZES.LARGE:
          return column.priority === 1 || column.priority === 2 ? column : null;

        case CARD_SIZES.XLARGE:
          return column;

        default:
          return column;
      }
    })
    .filter(i => i);

  const tableData = data.map(i => ({
    id: i.id,
    values: {
      ...i.values,
      actionColumn: i.actions || [],
    },
  }));

  return (
    <Card id={id} title={title} size={size} layout={layout} onCardAction={onCardAction} {...others}>
      <StyledStatefulTable
        columns={columnsToRender}
        data={tableData}
        options={{
          hasPagination: true,
        }}
        view={{
          pagination: {
            pageSize: 9,
            pageSizes: [9],
            page: 1,
            totalItems: data.length,
            isItemPerPageHidden: true,
          },
        }}
      />
    </Card>
  );
};

TableCard.propTypes = { ...CardPropTypes, ...TableCardPropTypes };
TableCard.displayName = 'TableCard';
TableCard.defaultProps = {
  size: CARD_SIZES.LARGE,
};
export default TableCard;
