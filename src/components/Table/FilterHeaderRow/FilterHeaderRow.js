import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ComboBox, DataTable, TextInput } from 'carbon-components-react';
import styled from 'styled-components';

import { defaultFunction, handleEnterKeyDown } from '../../../utils/componentUtilityFunctions';

const {
  // TableBody,
  // Table,
  // TableHead,
  TableHeader,
  TableRow,
  // TableExpandHeader,
  // TableContainer,
} = DataTable;

const StyledTableRow = styled(TableRow)`
  &&& {
    th {
      padding-top: 0.5rem;
      padding-bottom: 1.5rem;
    }
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
const StyledTextInput = styled(TextInput)`
  &&& {
    background-color: white;
  }
`;
class FilterHeaderRow extends Component {
  static propTypes = {
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        /** When false, no filter shows */
        isFilterable: PropTypes.bool,
        /** i18N text for translation */
        placeholderText: PropTypes.string,
        /** if options is empty array, assume text input for filter */
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
          })
        ),
      })
    ).isRequired,
    /** Callback when filter is applied sends object of keys and values with the filter values */
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
    /** Callback when filter is applied sends object of keys and values with the filter values */
    onApplyFilter: PropTypes.func,
    /** properties global to the table */
    tableOptions: PropTypes.shape({
      hasRowSelection: PropTypes.bool,
    }),
    /** filter can be hidden by the user but filters will still apply to the table */
    isVisible: PropTypes.bool,
  };

  static defaultProps = {
    tableOptions: { hasRowSelection: true },
    filters: [],
    isVisible: true,
    onApplyFilter: defaultFunction,
  };

  constructor(props) {
    super(props);
    this.state = props.columns.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.id]: (props.filters.find(i => i.columnId === curr.id) || { value: '' }).value,
      }),
      {}
    );
  }

  /**
   * take the state with the filter values and send to our listener
   */
  handleApplyFilter = () => {
    const { onApplyFilter } = this.props;
    onApplyFilter(this.state);
  };

  render() {
    const {
      columns,
      tableOptions: { hasRowSelection },
      isVisible,
    } = this.props;
    return isVisible ? (
      <StyledTableRow>
        {hasRowSelection ? <StyledTableHeader /> : null}
        {columns.map(column => (
          <StyledTableHeader key={`FilterHeader${column.id}`}>
            {column.options ? (
              <ComboBox
                items={column.options}
                itemToString={item => (item ? item.text : '')}
                initialSelectedItem={{
                  id: this.state[column.id], // eslint-disable-line react/destructuring-assignment
                  text: (column.options.find(i => i.id === this.state[column.id]) || { text: '' }) // eslint-disable-line react/destructuring-assignment
                    .text,
                }}
                placeholder={column.placeholderText || 'Choose an option'}
                onChange={evt => {
                  this.setState(
                    state => ({
                      ...state,
                      [column.id]: evt.selectedItem === null ? '' : evt.selectedItem.id,
                    }),
                    this.handleApplyFilter
                  );
                }}
                light
              />
            ) : (
              <StyledTextInput
                id={column.id}
                labelText={column.id}
                hideLabel
                placeholder={column.placeholderText || 'Type and hit enter to apply'}
                onKeyDown={event => handleEnterKeyDown(event, this.handleApplyFilter)}
                onBlur={this.handleApplyFilter}
                onChange={event => this.setState({ [column.id]: event.target.value })}
                value={this.state[column.id]} // eslint-disable-line react/destructuring-assignment
              />
            )}
          </StyledTableHeader>
        ))}
      </StyledTableRow>
    ) : null;
  }
}
export default FilterHeaderRow;
