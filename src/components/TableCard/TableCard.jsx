import React from 'react';
import PropTypes from 'prop-types';
import { OverflowMenu, OverflowMenuItem, Icon } from 'carbon-components-react';
import styled from 'styled-components';

import { CardPropTypes } from '../../constants/PropTypes';
import Card from '../Card/Card';
import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import Table from '../Table/Table';

const StyledOverflowMenu = styled(OverflowMenu)`
  &&& {
    opacity: 1;
    .bx--overflow-menu__icon {
      transform: none;
    }
  }
`;

const onClick = (e, id, action, onApplyRowAction) => {
  onApplyRowAction(action, id);
  e.preventDefault();
  e.stopPropagation();
};

const TableCard = ({ title, data, columns, actions, options, size, view, ...others }) => {
  const layout = CARD_LAYOUTS.HORIZONTAL;

  const renderActionCell = ({ value: action }) => {
    if (action.length === 1) {
      return (
        <Icon
          onClick={() => {
            console.log('link clicked');
          }}
          name={action[0].icon}
        />
      );
    }
    return (
      <StyledOverflowMenu floatingMenu>
        {action.map(item => {
          return (
            <OverflowMenuItem
              key={item.id}
              itemText={item.labelText}
              onClick={e => onClick(e, action.id, actions.table.onApplyRowAction)}
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
      width: '50px',
      isSortable: false,
      renderDataFunction: renderActionCell,
      priority: 1,
    },
  ];

  const columnsToRender = columns
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

  const defaultOrdering = columnsToRender.map(c => ({
    columnId: c.id,
  }));

  const viewUpdate = {
    ...view,
    table: {
      ...view.table,
      ordering: defaultOrdering,
    },
  };

  return (
    <Card title={title} size={size} layout={layout} {...others}>
      <Table
        style={{
          flex: 'inherit',
          alignSelf: 'flex-end',
        }}
        columns={columnsToRender}
        data={data}
        actions={actions}
        options={options}
        view={viewUpdate}
      />
    </Card>
  );
};

TableCard.propTypes = {
  ...CardPropTypes,
  size: PropTypes.oneOf([CARD_SIZES.TALL, CARD_SIZES.LARGE, CARD_SIZES.XLARGE]),
  /** Array of data - table content */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      values: PropTypes.shape([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.array])
        .isRequired,
    })
  ).isRequired,
  /** Array of columns - header */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      width: PropTypes.string,
      priority: PropTypes.number,
      /** for each column you can register a render callback function that is called with this object payload
       * {
       *    value: PropTypes.any (current cell value),
       *    columnId: PropTypes.string,
       *    rowId: PropTypes.string,
       *    row: PropTypes.object like this {col: value, col2: value}
       * }, you should return the node that should render within that cell */
      renderDataFunction: PropTypes.func,
    })
  ).isRequired,
  /** Callbacks for actions of the table, can be used to update state in wrapper component to update `view` props */
  actions: PropTypes.shape({
    pagination: PropTypes.shape({
      /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
      onChangePage: PropTypes.func,
    }),
    /** table wide actions */
    table: PropTypes.shape({
      onRowSelected: PropTypes.func,
      onRowClicked: PropTypes.func,
      onRowExpanded: PropTypes.func,
      onSelectAll: PropTypes.func,
      onChangeSort: PropTypes.func,
      /** if you return a promise from apply row action the stateful table will assume you're asynchronous and give a spinner */
      onApplyRowAction: PropTypes.func,
      onClearRowError: PropTypes.func,
      onEmptyStateAction: PropTypes.func,
      onChangeOrdering: PropTypes.func,
    }).isRequired,
  }),
  options: PropTypes.shape({
    hasPagination: PropTypes.bool,
  }),
};

TableCard.displayName = 'TableCard';
TableCard.defaultProps = {
  size: CARD_SIZES.LARGE,
  actions: {},
  options: { hasPagination: true },
};
export default TableCard;
