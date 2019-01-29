import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DataTable, TextInput, Select, SelectItem } from 'carbon-components-react';
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
        options: PropTypes.arrayOf(PropTypes.string),
      })
    ).isRequired,
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
    isVisible: true,
    onApplyFilter: defaultFunction,
  };

  // eslint-disable-next-line
  state = this.props.columns.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.id]: '',
    }),
    {}
  );

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
      <TableRow>
        {hasRowSelection ? <StyledTableHeader /> : null}
        {columns.map(column => (
          <StyledTableHeader key={`FilterHeader${column.id}`}>
            {column.options ? (
              <Select
                id={column.id}
                labelText={column.id}
                hideLabel
                // defaultValue="placeholder-item"
                onChange={event => {
                  // Remove the synthetic event from the pool and allow
                  // async references to the event properties.
                  // https://reactjs.org/docs/events.html#event-pooling
                  event.persist();

                  this.setState(
                    state => ({
                      ...state,
                      [column.id]: event.target.value,
                    }),
                    this.handleApplyFilter
                  );
                }}
                value={this.state[column.id] || 'placeholder-item'} // eslint-disable-line react/destructuring-assignment
              >
                <SelectItem disabled hidden value="placeholder-item" text="Choose an option" />
                {column.options.map(option => (
                  <SelectItem
                    key={`StyledHeaderSelectItem-${option}`}
                    text={option}
                    value={option}
                  />
                ))}
              </Select>
            ) : (
              <TextInput
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
      </TableRow>
    ) : null;
  }
}
export default FilterHeaderRow;
