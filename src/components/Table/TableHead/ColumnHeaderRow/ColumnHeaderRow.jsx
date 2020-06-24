import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DataTable, Button } from 'carbon-components-react';
import styled from 'styled-components';
import { Settings16 } from '@carbon/icons-react';
import { spacing03, spacing06 } from '@carbon/layout';

import { defaultFunction } from '../../../../utils/componentUtilityFunctions';
import { defaultI18NPropTypes } from '../../TablePropTypes';
import ColumnHeaderSelect from '../ColumnHeaderSelect/ColumnHeaderSelect';

const { TableHeader, TableRow } = DataTable;

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

const StyledColumnSelectWrapper = styled.div`
   {
    display: flex;
    flex-wrap: wrap;
  }
`;

const StyledColumnSelectTableRow = styled(TableRow)`
  &&& {
    th {
      padding-top: ${spacing06};
      padding-bottom: ${spacing03};
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
    options: PropTypes.shape({
      hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
      hasRowExpansion: PropTypes.bool,
      hasColumnSelectionConfig: PropTypes.bool,
    }).isRequired,
    onChangeOrdering: PropTypes.func.isRequired,
    onColumnToggle: PropTypes.func.isRequired,
    onColumnSelectionConfig: PropTypes.func,
    columnSelectionConfigText: PropTypes.string,
    isDisabled: PropTypes.bool,
  };

  static defaultProps = {
    onColumnSelectionConfig: defaultFunction('actions.table.onColumnSelectionConfig'),
    columnSelectionConfigText: defaultI18NPropTypes.columnSelectionConfig,
    isDisabled: false,
  };

  reorderColumn = (srcIndex, destIndex) => {
    const { ordering, onChangeOrdering } = this.props;

    ordering.splice(destIndex, 0, ordering.splice(srcIndex, 1)[0]);

    onChangeOrdering(ordering);
  };

  toggleColumn = id => {
    const { ordering, onColumnToggle } = this.props;
    onColumnToggle(
      id,
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
      options: { hasRowSelection, hasRowExpansion, hasRowActions, hasColumnSelectionConfig },
      onColumnSelectionConfig,
      columnSelectionConfigText,
      isDisabled,
    } = this.props;

    const visibleColumns = columns.filter(
      c => !(ordering.find(o => o.columnId === c.id) || { isHidden: false }).isHidden
    );
    return (
      <StyledColumnSelectTableRow>
        {hasRowSelection === 'multi' ? <StyledTableHeader /> : null}
        {hasRowExpansion ? <StyledTableHeader /> : null}
        <StyledTableHeader colSpan={visibleColumns.length + (hasRowActions ? 1 : 0)} scope="col">
          <StyledColumnSelectWrapper>
            {ordering.map((c, idx) => (
              <ColumnHeaderSelect
                key={`${idx}-item`}
                index={idx}
                columnId={c.columnId}
                isHidden={c.isHidden}
                moveItem={(srcIndex, destIndex) => this.reorderColumn(srcIndex, destIndex)}
                onClick={() => this.toggleColumn(c.columnId)}
                isDisabled={isDisabled}
              >
                {columns.find(i => c.columnId === i.id).name}
              </ColumnHeaderSelect>
            ))}
          </StyledColumnSelectWrapper>
          {hasColumnSelectionConfig ? (
            <Button
              disabled={isDisabled}
              className="column-header__btn"
              kind="ghost"
              size="small"
              renderIcon={Settings16}
              onClick={() => onColumnSelectionConfig()}
            >
              {columnSelectionConfigText}
            </Button>
          ) : null}
        </StyledTableHeader>
      </StyledColumnSelectTableRow>
    );
  }
}

export { ColumnHeaderRow as UnconnectedColumnHeaderRow };
export default DragDropContext(HTML5Backend)(ColumnHeaderRow);
