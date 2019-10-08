import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ComboBox, DataTable, FormItem, TextInput } from 'carbon-components-react';
import Close from '@carbon/icons-react/lib/close/16';
import styled from 'styled-components';

import { COLORS } from '../../../../styles/styles';
import { defaultFunction, handleEnterKeyDown } from '../../../../utils/componentUtilityFunctions';

const { TableHeader, TableRow } = DataTable;

// const TableRow = styled(TableRow)`
//   &&& {
//     th {
//       padding-top: 0.5rem;
//       padding-bottom: 1.5rem;
//     }
//   }
// `;
const StyledTableHeader = styled(TableHeader)`
  &&& {
    span.bx--table-header-label {
      padding-top: 0;
    }

    .bx--form-item input {
      min-width: 12.75rem;
    }

    .bx--list-box input[role='combobox'] {
      /* need to save enough room for clear and dropdown button */
      padding-right: 4rem;
      ${props => {
        const { width } = props;
        return width !== undefined
          ? `
        min-width: calc(${width} - 10px);
        max-width: calc(${width} - 10px);
      `
          : '';
      }}
    }
    .bx--form-item.bx--combo-box {
      ${props => {
        const { width } = props;
        return width !== undefined
          ? `
        min-width: calc(${width} - 10px);
        max-width:calc(${width} - 10px);
      `
          : '';
      }}
    }

    ${props => {
      const { width, isSelectColumn } = props;

      return width !== undefined
        ? `
        min-width: ${width};
        max-width: ${width};
        white-space: nowrap;
        overflow-x: ${!isSelectColumn ? 'hidden' : 'inherit'};
        text-overflow: ellipsis;
      `
        : '';
    }};

    .bx--tag--filter {
      background-color: transparent;

      &:focus {
        outline: 2px solid ${COLORS.blue60};
        outline-offset: -2px;

        svg {
          border: none;
        }
      }

      & > svg {
        fill: ${COLORS.gray100};
        border-radius: 0;

        &:hover {
          background-color: transparent;
        }
      }
    }
  }
`;
const StyledFormItem = styled(FormItem)`
  &&& {
    display: inline-block;
    position: relative;

    input {
      padding-right: 2.5rem;
    }

    .bx--list-box__selection {
      right: 0;
      top: 50%;
      transform: translateY(-50%);
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
    /** internationalized string */
    filterText: PropTypes.string,
    clearFilterText: PropTypes.string,
    clearSelectionText: PropTypes.string,
    openMenuText: PropTypes.string,
    closeMenuText: PropTypes.string,
    ordering: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        /* Visibility of column in table, defaults to false */
        isHidden: PropTypes.bool,
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
      hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
      hasRowExpansion: PropTypes.bool,
      hasRowActions: PropTypes.bool,
    }),
    /** filter can be hidden by the user but filters will still apply to the table */
    isVisible: PropTypes.bool,
    lightweight: PropTypes.bool,
  };

  static defaultProps = {
    tableOptions: { hasRowSelection: 'multi' },
    filters: [],
    isVisible: true,
    onApplyFilter: defaultFunction,
    filterText: 'Filter',
    clearFilterText: 'Clear filter',
    clearSelectionText: 'Clear selection',
    openMenuText: 'Open menu',
    closeMenuText: 'Close menu',
    lightweight: false,
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

  handleTranslation = id => {
    const { clearSelectionText, openMenuText, closeMenuText } = this.props;
    switch (id) {
      default:
        return '';
      case 'clear.selection':
        return clearSelectionText;
      case 'open.menu':
        return openMenuText;
      case 'close.menu':
        return closeMenuText;
    }
  };

  render() {
    const {
      columns,
      ordering,
      clearFilterText,
      filterText,
      tableOptions: { hasRowSelection, hasRowExpansion, hasRowActions },
      isVisible,
      lightweight,
    } = this.props;
    return isVisible ? (
      <TableRow>
        {hasRowSelection === 'multi' ? <StyledTableHeader /> : null}
        {hasRowExpansion ? <StyledTableHeader /> : null}
        {ordering
          .filter(c => !c.isHidden)
          .map((c, i) => {
            const column = columns.find(item => c.columnId === item.id);
            const columnStateValue = this.state[column.id]; // eslint-disable-line

            // undefined check has the effect of making isFilterable default to true
            // if unspecified
            const headerContent =
              column.isFilterable !== undefined && !column.isFilterable ? (
                <div />
              ) : column.options ? (
                <ComboBox
                  id={`column-${i}`}
                  aria-label={filterText}
                  translateWithId={this.handleTranslation}
                  items={column.options}
                  itemToString={item => (item ? item.text : '')}
                  initialSelectedItem={{
                    id: columnStateValue,
                    text: (
                      column.options.find(option => option.id === columnStateValue) || { text: '' }
                    ).text, // eslint-disable-line react/destructuring-assignment
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
                  light={!lightweight}
                />
              ) : (
                <StyledFormItem>
                  <TextInput
                    id={column.id}
                    labelText={column.id}
                    hideLabel
                    light={!lightweight}
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
                      title={clearFilterText}
                    >
                      <Close description={clearFilterText} />
                      {/* <Icon icon={iconClose} description={clearFilterText} focusable="false" /> */}
                    </div>
                  ) : null}
                </StyledFormItem>
              );

            return (
              <StyledTableHeader
                data-column={column.id}
                key={`FilterHeader${column.id}`}
                width={column.width}
                isSelectColumn={!!column.options}
              >
                {headerContent}
              </StyledTableHeader>
            );
          })}
        {hasRowActions ? <StyledTableHeader /> : null}
      </TableRow>
    ) : null;
  }
}
export default FilterHeaderRow;
