import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DataTable, Button } from 'carbon-components-react';
import styled from 'styled-components';

const { TableHeader, TableRow } = DataTable;

const ToggleButton = styled(Button)`
  &&& {
    margin-left: 1rem;
    ${props =>
      props.ishidden === 'true' && {
        opacity: 0.5,
      }}
  }
`;

const StyledTableHeader = styled(TableHeader)`
  &&& {
    border-top: none;

    .bx--form-item {
      display: table-cell;

      input {
        min-width: 12.75rem;
      }
    }
  }
`;

const StyledColumnSelectTableRow = styled(TableRow)`
  &&& {
    th {
      padding-top: 0.5rem;
      padding-bottom: 1.5rem;
    }
    td {
      background-color: inherit;
      border-left: none;
      border-width: 0 0 0 4px;
    }
    :hover {
      border: inherit;
      background-color: inherit;
      td {
        background-color: inherit;
        border-left: none;
        border-width: 0 0 0 4px;
      }
    }
  }
`;

class ColumnHeaderRow extends Component {
  static propTypes = {
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    ordering: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        /* Visibility of column in table, defaults to false */
        isHidden: PropTypes.bool,
      })
    ).isRequired,
    tableOptions: PropTypes.shape({
      hasRowSelection: PropTypes.bool,
      hasRowExpansion: PropTypes.bool,
    }).isRequired,
    onChangeOrdering: PropTypes.func.isRequired,
  };

  /*
  reorderColumn = id => {
    // TODO: implement
    const { ordering, onChangeOrdering } = this.props;
    onChangeOrdering(ordering.map(i => ({
      columnId: i.columnId,
      isHidden: !i.isHidden,
    })))
  }
  */

  toggleColumn = id => {
    const { ordering, onChangeOrdering } = this.props;
    onChangeOrdering(
      ordering.map(i => ({
        columnId: i.columnId,
        isHidden: i.columnId === id ? !i.isHidden : i.isHidden,
      }))
    );
  };

  render() {
    const {
      columns,
      ordering,
      tableOptions: { hasRowSelection, hasRowExpansion, hasRowActions },
    } = this.props;
    const visibleColumns = columns.filter(
      c => !(ordering.find(o => o.columnId === c.id) || { isHidden: false }).isHidden
    );
    return (
      <StyledColumnSelectTableRow>
        {hasRowSelection ? <StyledTableHeader /> : null}
        {hasRowExpansion ? <StyledTableHeader /> : null}
        <StyledTableHeader colSpan={visibleColumns.length + (hasRowActions ? 1 : 0)}>
          {ordering.map(c => (
            <ToggleButton
              key={c.columnId}
              kind="secondary"
              ishidden={`${c.isHidden}`}
              onClick={() => this.toggleColumn(c.columnId)}>
              {columns.find(i => c.columnId === i.id).name}
            </ToggleButton>
          ))}
        </StyledTableHeader>
      </StyledColumnSelectTableRow>
    );
  }
}
export default ColumnHeaderRow;
