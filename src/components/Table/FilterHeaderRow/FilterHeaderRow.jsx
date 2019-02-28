import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ComboBox, DataTable, FormItem, Icon, TextInput } from 'carbon-components-react';
import { iconClose } from 'carbon-icons';
import styled from 'styled-components';

import { defaultFunction, handleEnterKeyDown } from '../../../utils/componentUtilityFunctions';

const { TableHeader, TableRow } = DataTable;

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
const StyledFormItem = styled(FormItem)`
  &&& {
    position: relative;

    input {
      padding-right: 2.5rem;
    }

    .bx--list-box__selection {
      right: 0;
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
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
          })
        ),
      })
    ).isRequired,
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

  state = this.props.columns.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.id]: (this.props.filters.find(i => i.columnId === curr.id) || { value: '' }).value,
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

  handleClearFilter = (event, column) => {
    // when a user clicks or hits ENTER, we'll clear the input
    if (event.keyCode === 13 || !event.keyCode) {
      this.setState(
        state => ({
          ...state,
          [column.id]: '',
        }),
        this.handleApplyFilter
      );
    }
  };

  render() {
    const {
      columns,
      tableOptions: { hasRowSelection, hasRowExpansion },
      isVisible,
    } = this.props;
    return isVisible ? (
      <StyledTableRow>
        {hasRowSelection ? <StyledTableHeader /> : null}
        {hasRowExpansion ? <StyledTableHeader /> : null}
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
              <StyledFormItem>
                <TextInput
                  id={column.id}
                  labelText={column.id}
                  hideLabel
                  light
                  placeholder={column.placeholderText || 'Type and hit enter to apply'}
                  onKeyDown={event => handleEnterKeyDown(event, this.handleApplyFilter)}
                  onBlur={this.handleApplyFilter}
                  onChange={event => this.setState({ [column.id]: event.target.value })}
                  value={this.state[column.id]} // eslint-disable-line react/destructuring-assignment
                />
                {this.state[column.id] ? ( // eslint-disable-line react/destructuring-assignment
                  <div
                    role="button"
                    className="bx--list-box__selection"
                    tabIndex="0"
                    onClick={event => {
                      this.handleClearFilter(event, column);
                    }}
                    onKeyDown={event => {
                      this.handleClearFilter(event, column);
                    }}
                    title="Clear Filter">
                    <Icon icon={iconClose} description="Clear Filter" focusable="false" />
                  </div>
                ) : null}
              </StyledFormItem>
            )}
          </StyledTableHeader>
        ))}
      </StyledTableRow>
    ) : null;
  }
}
export default FilterHeaderRow;
