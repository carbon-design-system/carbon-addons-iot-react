import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DataTable, FormItem, TextInput, FilterableMultiSelect } from 'carbon-components-react';
import { Close16 } from '@carbon/icons-react';
import memoize from 'lodash/memoize';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import warning from 'warning';

import { defaultFunction, handleEnterKeyDown } from '../../../../utils/componentUtilityFunctions';
import { settings } from '../../../../constants/Settings';
import ComboBox from '../../../ComboBox/ComboBox';

const { iotPrefix, prefix } = settings;
const { TableHeader, TableRow } = DataTable;

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
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
              .isRequired,
            text: PropTypes.string.isRequired,
          })
        ),
        /** if isMultiselect and isFilterable are true, the table is filtered based on a multiselect */
        isMultiselect: PropTypes.bool,
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
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.bool,
          PropTypes.arrayOf(PropTypes.string),
        ]).isRequired,
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
    /** disabled filters are shown and active but cannot be modified */
    isDisabled: PropTypes.bool,
    lightweight: PropTypes.bool,
    /** should we filter as the user types or after they press enter */
    hasFastFilter: PropTypes.bool,

    testId: PropTypes.string,
    /** shows an additional column that can expand/shrink as the table is resized  */
    showExpanderColumn: PropTypes.bool.isRequired,
    /** Size prop from Carbon to shrink row height (and header height in some instances) */
    size: function checkProps(props, propName, componentName) {
      if (['compact', 'short', 'normal', 'tall'].includes(props[propName])) {
        warning(
          false,
          `The value \`${props[propName]}\` has been deprecated for the ` +
            `\`${propName}\` prop on the ${componentName} component. It will be removed in the next major ` +
            `release. Please use 'xs', 'sm', 'md', 'lg', or 'xl' instead.`
        );
      }
    },
  };

  static defaultProps = {
    tableOptions: { hasRowSelection: 'multi' },
    filters: [],
    isVisible: true,
    isDisabled: false,
    onApplyFilter: defaultFunction,
    filterText: 'Filter',
    clearFilterText: 'Clear filter',
    clearSelectionText: 'Clear selection',
    openMenuText: 'Open menu',
    closeMenuText: 'Close menu',
    lightweight: false,
    hasFastFilter: true,
    testId: '',
    size: undefined,
  };

  state = {
    dropdownMaxHeight: 'unset',
    filterValues: this.props.columns.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.id]: (
          this.props.filters.find((i) => i.columnId === curr.id) || {
            value: '',
          }
        ).value,
      }),
      {}
    ),
  };

  // TODO: we should really do this through a useEffect hook when we refactor to functional component
  static getDerivedStateFromProps(props, state) {
    // If the filter props change from the outside, we need to reset the filterValues inside local state
    if (!isEqual(props.filters, state.prevPropsFilters)) {
      const newFilters = props.columns.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.id]: (props.filters.find((i) => i.columnId === curr.id) || { value: '' }).value,
        }),
        {}
      );

      if (!isEqual(newFilters, state.filterValues)) {
        return { filterValues: newFilters, prevPropsFilters: props.filters };
      }
      // Need to store the updated filters from before
      return { prevPropsFilters: props.filters };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.rowRef = React.createRef();
  }

  componentDidMount() {
    this.updateDropdownHeight();
  }

  componentDidUpdate(prevProps, prevState) {
    const { dropdownMaxHeight } = this.state;
    const { size } = this.props;
    if (dropdownMaxHeight !== prevState.dropdownMaxHeight || size !== prevProps.size) {
      this.updateDropdownHeight();
    }
  }

  updateDropdownHeight = () => {
    if (this.rowRef.current) {
      const tableContainer = this.rowRef.current.closest(`.${prefix}--data-table-content`);
      const tableHead = this.rowRef.current.closest(`thead`);
      if (tableContainer) {
        const { height: containerHeight } = tableContainer.getBoundingClientRect();
        const { height: headHeight } = tableHead.getBoundingClientRect();

        const height = containerHeight - headHeight - 16;

        this.setState({
          dropdownMaxHeight: `${height}px`,
        });
      }
    }
  };

  /**
   * take the state with the filter values and send to our listener
   */
  handleApplyFilter = () => {
    const { onApplyFilter } = this.props;
    const { filterValues } = this.state;
    onApplyFilter(filterValues);
  };

  // when a user clicks or hits ENTER, we'll clear the input
  handleClearFilter = (event, column) => {
    this.setState(
      (state) => ({
        filterValues: {
          ...state.filterValues,
          [column.id]: '',
        },
      }),
      this.handleApplyFilter
    );
  };

  handleTranslation = (idToTranslate) => {
    const { clearSelectionText, openMenuText, closeMenuText } = this.props;
    switch (idToTranslate) {
      default:
        return '';
      case 'clear.selection':
        return clearSelectionText;
      case 'clear.all':
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
      isDisabled,
      hasFastFilter,
      testId,
      showExpanderColumn,
    } = this.props;
    const { dropdownMaxHeight, filterValues } = this.state;
    const visibleColumns = ordering.filter((c) => !c.isHidden);
    return isVisible ? (
      <TableRow
        data-testid={testId}
        style={{
          '--filter-header-dropdown-max-height': dropdownMaxHeight,
        }}
      >
        {hasRowSelection === 'multi' ? (
          <TableHeader className={`${iotPrefix}--filter-header-row--header`} ref={this.rowRef} />
        ) : null}
        {hasRowExpansion ? (
          <TableHeader className={`${iotPrefix}--filter-header-row--header`} />
        ) : null}
        {visibleColumns.map((c, i) => {
          const column = columns.find((item) => c.columnId === item.id);
          const columnStateValue = filterValues[column.id]; // eslint-disable-line react/destructuring-assignment
          const filterColumnOptions = (options) => {
            options.sort((a, b) => {
              return a.text.localeCompare(b.text, { sensitivity: 'base' });
            });
            return options;
          };
          const memoizeColumnOptions = memoize(filterColumnOptions); // TODO: this memoize isn't really working, should refactor to a higher column level
          const isLastColumn = visibleColumns.length - 1 === i;
          // undefined check has the effect of making isFilterable default to true
          // if unspecified
          const headerContent =
            column.isFilterable !== undefined && !column.isFilterable ? (
              <div />
            ) : column.options ? (
              column.isMultiselect ? (
                <FilterableMultiSelect
                  key={columnStateValue}
                  className={classnames(
                    `${iotPrefix}--filterheader-multiselect`,
                    `${iotPrefix}--filterheader-multiselect__menu--fit-content`,
                    {
                      [`${iotPrefix}--filterheader-multiselect__menu--flip-horizontal`]: isLastColumn,
                    }
                  )}
                  id={`column-${i}`}
                  aria-label={filterText}
                  placeholder={column.placeholderText || 'Choose an option'}
                  translateWithId={this.handleTranslation}
                  items={memoizeColumnOptions(column.options)}
                  label={column.placeholderText || 'Choose an option'}
                  itemToString={(item) => item.text}
                  initialSelectedItems={
                    Array.isArray(columnStateValue)
                      ? columnStateValue.map((value) =>
                          typeof value !== 'object' ? { id: value, text: value } : value
                        )
                      : columnStateValue
                      ? [{ id: columnStateValue, text: columnStateValue }]
                      : []
                  }
                  onChange={(evt) => {
                    this.setState(
                      (state) => ({
                        filterValues: {
                          ...state.filterValues,
                          [column.id]: evt.selectedItems.map((item) => item.text),
                        },
                      }),
                      this.handleApplyFilter
                    );
                  }}
                  light
                  disabled={isDisabled}
                />
              ) : (
                <ComboBox
                  menuFitContent
                  horizontalDirection={isLastColumn ? 'start' : 'end'}
                  key={columnStateValue}
                  className={`${iotPrefix}--filterheader-combo`}
                  id={`column-${i}`}
                  aria-label={filterText}
                  translateWithId={this.handleTranslation}
                  items={memoizeColumnOptions(column.options)}
                  itemToString={(item) => (item ? item.text : '')}
                  initialSelectedItem={{
                    id: columnStateValue,
                    text: (
                      column.options.find((option) => option.id === columnStateValue) || {
                        text: '',
                      }
                    ).text, // eslint-disable-line react/destructuring-assignment
                  }}
                  placeholder={column.placeholderText || 'Choose an option'}
                  onChange={(selectedItem) => {
                    this.setState(
                      (state) => ({
                        filterValues: {
                          ...state.filterValues,
                          [column.id]: selectedItem === null ? '' : selectedItem.id,
                        },
                      }),
                      this.handleApplyFilter
                    );
                  }}
                  light={lightweight}
                  disabled={isDisabled}
                />
              )
            ) : (
              <FormItem className={`${iotPrefix}--filter-header-row--form-item`}>
                <TextInput
                  id={column.id}
                  labelText={column.id}
                  hideLabel
                  light={lightweight}
                  placeholder={column.placeholderText || 'Type and hit enter to apply'}
                  title={filterValues[column.id] || column.placeholderText} // eslint-disable-line react/destructuring-assignment
                  onChange={(event) => {
                    event.persist();
                    this.setState(
                      (state) => ({
                        filterValues: {
                          ...state.filterValues,
                          [column.id]: event.target.value,
                        },
                      }),
                      hasFastFilter ? debounce(this.handleApplyFilter, 150) : null // only apply the filter at debounced interval
                    );
                  }}
                  onKeyDown={
                    !hasFastFilter
                      ? (event) => handleEnterKeyDown(event, this.handleApplyFilter)
                      : null
                  } // if fast filter off, then filter on key press
                  onBlur={!hasFastFilter ? this.handleApplyFilter : null} // if fast filter off, then filter on blur
                  value={filterValues[column.id]} // eslint-disable-line react/destructuring-assignment
                  disabled={isDisabled}
                />
                {filterValues[column.id] ? ( // eslint-disable-line react/destructuring-assignment
                  <div
                    role="button"
                    className={classnames(`${prefix}--list-box__selection`, {
                      [`${iotPrefix}--clear-filters-button--disabled`]: isDisabled,
                    })}
                    tabIndex={isDisabled ? '-1' : '0'}
                    onClick={(event) => {
                      if (!isDisabled) {
                        this.handleClearFilter(event, column);
                      }
                    }}
                    onKeyDown={(event) =>
                      handleEnterKeyDown(event, () => {
                        if (!isDisabled) {
                          this.handleClearFilter(event, column);
                        }
                      })
                    }
                    title={clearFilterText}
                  >
                    <Close16 description={clearFilterText} />
                  </div>
                ) : null}
              </FormItem>
            );

          return (
            <TableHeader
              className={classnames(
                `${iotPrefix}--tableheader-filter`,
                `${iotPrefix}--filter-header-row--header`,
                {
                  // This class does not make sense for undefined column widths and the corresponding
                  // CSS has been removed. Class is kept only for backwards compatibilty in the DOM.
                  [`${iotPrefix}--filter-header-row--header-width`]: column.width === undefined,
                }
              )}
              data-column={column.id}
              key={`FilterHeader${column.id}`}
              width={column.width}
            >
              {headerContent}
            </TableHeader>
          );
        })}
        {hasRowActions ? (
          <TableHeader className={`${iotPrefix}--filter-header-row--header`} />
        ) : null}
        {showExpanderColumn ? (
          <TableHeader
            data-testid={`${testId}-expander-column`}
            className={`${iotPrefix}--filter-header-row--header`}
          />
        ) : null}
      </TableRow>
    ) : null;
  }
}
export default FilterHeaderRow;
