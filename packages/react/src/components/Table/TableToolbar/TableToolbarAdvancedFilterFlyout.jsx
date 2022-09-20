import { Close16, Filter20 } from '@carbon/icons-react';
import {
  Button,
  ComboBox,
  FormItem,
  MultiSelect,
  FilterableMultiSelect,
  Tab,
  Tabs,
  TextInput,
  DatePicker,
  DatePickerInput,
} from 'carbon-components-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { memoize, isEqual } from 'lodash-es';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';
import FlyoutMenu, { FlyoutMenuDirection } from '../../FlyoutMenu/FlyoutMenu';
import { defaultFunction, handleEnterKeyDown } from '../../../utils/componentUtilityFunctions';

const { iotPrefix, prefix } = settings;

const itemToString = (key) => (item) => item?.[key] ?? '';

const propTypes = {
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
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
          text: PropTypes.string.isRequired,
        })
      ),
      /** if dateOptions is empty array, assume a default format and locale */
      dateOptions: PropTypes.shape({
        dateFormat: PropTypes.string,
        locale: PropTypes.string,
      }),
      /** if isMultiselect and isFilterable are true, the table is filtered based on a multiselect */
      isMultiselect: PropTypes.bool,
      /** if isDate and isFilterable are true, the table is filtered base on a date picker */
      isDate: PropTypes.bool,
    })
  ).isRequired,
  tableState: PropTypes.shape({
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
          PropTypes.object,
          PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
        ]).isRequired,
      })
    ),
    advancedFilters: PropTypes.arrayOf(
      PropTypes.shape({
        /** Unique id for particular filter */
        filterId: PropTypes.string.isRequired,
        /** Text for main tilte of page */
        filterTitleText: PropTypes.string.isRequired,
      })
    ),
    advancedFilterFlyoutOpen: PropTypes.bool,
    selectedAdvancedFilterIds: PropTypes.arrayOf(PropTypes.string),
    isDisabled: PropTypes.bool,
  }),
  actions: PropTypes.shape({
    onApplyAdvancedFilter: PropTypes.func,
    onCancelAdvancedFilter: PropTypes.func,
    onCreateAdvancedFilter: PropTypes.func,
    onChangeAdvancedFilter: PropTypes.func,
    onToggleAdvancedFilter: PropTypes.func,
  }),
  i18n: PropTypes.shape({
    applyButtonText: PropTypes.string,
    cancelButtonText: PropTypes.string,
    advancedFilterLabelText: PropTypes.string,
    createNewAdvancedFilterText: PropTypes.string,
    advancedFilterPlaceholderText: PropTypes.string,
    simpleFiltersTabLabel: PropTypes.string,
    advancedFiltersTabLabel: PropTypes.string,
    clearAllFilters: PropTypes.string,
    filterAria: PropTypes.string,
    openMenuAria: PropTypes.string,
    closeMenuAria: PropTypes.string,
    clearSelectionAria: PropTypes.string,
  }),
};

const reduceFilterState = (filters, selectedAdvancedFilterIds) => {
  let simple = {};
  let advanced = {
    filterIds: [],
  };
  if (Array.isArray(filters) && filters.length) {
    simple = filters.reduce((state, { columnId, value }) => {
      return {
        ...state,
        [columnId]: value,
      };
    }, {});
  }

  if (Array.isArray(selectedAdvancedFilterIds) && selectedAdvancedFilterIds.length) {
    advanced = {
      filterIds: selectedAdvancedFilterIds,
    };
  }

  return {
    simple,
    advanced,
  };
};

const defaultProps = {
  tableState: {
    filters: [],
    advancedFilters: [],
    advancedFilterFlyoutOpen: false,
    selectedAdvancedFilterIds: [],
    isDisabled: false,
  },
  actions: {
    onApplyAdvancedFilter: defaultFunction('on AdvancedFilter'),
    onCancelAdvancedFilter: defaultFunction('onCancelAdvancedFilter'),
    onCreateAdvancedFilter: defaultFunction('onCreateAdvancedFilter'),
    onChangeAdvancedFilter: defaultFunction('onChangeAdvancedFilter'),
    onToggleAdvancedFilter: defaultFunction('onToggleAdvancedFilter'),
  },
  i18n: {
    applyButtonText: 'Apply filters',
    cancelButtonText: 'Cancel',
    advancedFilterLabelText: 'Select an existing filter or',
    createNewAdvancedFilterText: 'create a new advanced filter',
    advancedFilterPlaceholderText: 'Select a filter',
    simpleFiltersTabLabel: 'Simple filters',
    advancedFiltersTabLabel: 'Advanced filters',
    filterAria: 'Filter',
    openMenuAria: 'Open menu',
    closeMenuAria: 'Close menu',
    clearSelectionAria: 'Clear selection',
    clearFilterAria: 'Clear filter',
  },
};

const TableToolbarAdvancedFilterFlyout = ({
  columns,
  tableState: {
    ordering,
    filters,
    advancedFilters,
    advancedFilterFlyoutOpen,
    selectedAdvancedFilterIds,
    isDisabled,
  },
  i18n,
  actions: {
    onApplyAdvancedFilter,
    onCancelAdvancedFilter,
    onCreateAdvancedFilter,
    onChangeAdvancedFilter,
    onToggleAdvancedFilter,
  },
}) => {
  const {
    applyButtonText,
    cancelButtonText,
    advancedFilterLabelText,
    createNewAdvancedFilterText,
    advancedFilterPlaceholderText,
    simpleFiltersTabLabel,
    advancedFiltersTabLabel,
    filterAria,
    openMenuAria,
    closeMenuAria,
    clearSelectionAria,
    clearFilterAria,
  } = {
    ...defaultProps.i18n,
    ...(i18n ?? {}),
  };

  const [filterState, setFilterState] = useState(
    reduceFilterState(filters, selectedAdvancedFilterIds)
  );

  const previousFilters = useRef(null);

  useEffect(() => {
    if (!isEqual(previousFilters.current, { filters, selectedAdvancedFilterIds })) {
      const newState = reduceFilterState(filters, selectedAdvancedFilterIds);

      if (!isEqual(newState, filterState)) {
        setFilterState(newState);
        onApplyAdvancedFilter(newState);
      }
    }
  }, [filterState, filters, onApplyAdvancedFilter, selectedAdvancedFilterIds]);

  useEffect(() => {
    previousFilters.current = {
      filters,
      selectedAdvancedFilterIds,
    };
  });

  const handleClearFilter = useCallback((event, { id }) => {
    setFilterState((prev) => ({
      ...prev,
      simple: {
        ...prev.simple,
        [id]: '',
      },
    }));
  }, []);

  const handleTranslation = useCallback(
    (idToTranslate) => {
      switch (idToTranslate) {
        default:
          return '';
        case 'clear.selection':
          return clearSelectionAria;
        case 'clear.all':
          return clearSelectionAria;
        case 'open.menu':
          return openMenuAria;
        case 'close.menu':
          return closeMenuAria;
      }
    },
    [clearSelectionAria, closeMenuAria, openMenuAria]
  );

  return (
    <FlyoutMenu
      testId="advanced-filter-flyout"
      iconDescription="advanced-filter-flyout-icon"
      direction={FlyoutMenuDirection.BottomEnd}
      disabled={isDisabled}
      renderIcon={Filter20}
      light
      isOpen={advancedFilterFlyoutOpen}
      onApply={() => {
        onApplyAdvancedFilter(filterState);
      }}
      onCancel={() => {
        setFilterState(reduceFilterState(filters, selectedAdvancedFilterIds));
        onCancelAdvancedFilter();
      }}
      buttonProps={{
        className: classnames(
          `${prefix}--btn--icon-only`,
          `${iotPrefix}--tooltip-svg-wrapper`,
          `${iotPrefix}--table-toolbar__advanced-filters-button`,
          {
            [`${iotPrefix}--table-toolbar-button-active`]: advancedFilterFlyoutOpen,
          }
        ),
        onClick: onToggleAdvancedFilter,
      }}
      i18n={{
        applyButtonText,
        cancelButtonText,
      }}
    >
      <Tabs className={`${iotPrefix}--advanced-filter__tab-container`}>
        <Tab label={simpleFiltersTabLabel} title={simpleFiltersTabLabel}>
          {ordering
            .filter((column) => {
              const fullColumn = columns.find((item) => column.columnId === item.id);
              return !column.isHidden && fullColumn?.isFilterable === true;
            })
            .reduce((chunks, item, index) => {
              const newChunks = [...chunks];
              const chunkIndex = Math.floor(index / 2);

              if (!chunks[chunkIndex]) {
                newChunks[chunkIndex] = [];
              }

              newChunks[chunkIndex] = [...newChunks[chunkIndex], item];

              return newChunks;
            }, [])
            .map((aRow, rowIndex) => {
              return (
                <div
                  key={`simple-filter-row-${rowIndex}`}
                  className={`${iotPrefix}--filter-flyout__simple-row`}
                >
                  {aRow.map((aColumn, columnIndex) => {
                    const column = columns.find((item) => aColumn.columnId === item.id);
                    const { value: columnFilterValue } =
                      filters?.find((filter) => filter.columnId === column.id) ?? {};
                    const filterColumnOptions = (options) => {
                      options.sort((a, b) => {
                        return a.text.localeCompare(b.text, { sensitivity: 'base' });
                      });
                      return options;
                    };
                    const memoizeColumnOptions = memoize(filterColumnOptions); // TODO: this memoize isn't really working, should refactor to a higher column level
                    if (column.isDate) {
                      return (
                        <FormItem
                          key={`simple-filter-item-${rowIndex}-${columnIndex}`}
                          className={`${iotPrefix}--filter-flyout__simple-field`}
                        >
                          <DatePicker
                            key={`${columnIndex}-${columnFilterValue}`}
                            datePickerType="single"
                            locale={column?.dateOptions?.locale || 'en'}
                            dateFormat={column?.dateOptions?.dateFormat || 'Y-m-d'}
                            id={`column-${rowIndex}-${columnIndex}`}
                            value={filterState?.simple?.[column.id]}
                            onChange={(evt) => {
                              setFilterState((prev) => {
                                return {
                                  ...prev,
                                  simple: {
                                    ...prev.simple,
                                    [column.id]: evt[0],
                                  },
                                };
                              });
                            }}
                          >
                            <DatePickerInput
                              className={`${iotPrefix}--lelele`}
                              placeholder={column.placeholderText || 'enter a date'}
                              labelText={column.name}
                              id={`column-${rowIndex}-${columnIndex}`}
                            />
                          </DatePicker>
                        </FormItem>
                      );
                    }
                    if (column.options) {
                      if (column.isMultiselect) {
                        return (
                          <FilterableMultiSelect
                            className={`${iotPrefix}--filter-flyout__simple-field`}
                            key={`${columnIndex}-${columnFilterValue}`}
                            id={`column-${rowIndex}-${columnIndex}`}
                            aria-label={filterAria}
                            placeholder={column.placeholderText || 'Choose an option'}
                            translateWithId={handleTranslation}
                            items={memoizeColumnOptions(column.options)}
                            label={column.placeholderText || 'Choose an option'}
                            itemToString={itemToString('text')}
                            titleText={column.name}
                            initialSelectedItems={
                              Array.isArray(columnFilterValue)
                                ? columnFilterValue.map((value) =>
                                    typeof value !== 'object' ? { id: value, text: value } : value
                                  )
                                : columnFilterValue
                                ? [{ id: columnFilterValue, text: columnFilterValue }]
                                : []
                            }
                            onChange={(evt) => {
                              const { selectedItems } = evt;
                              setFilterState((prev) => {
                                return {
                                  ...prev,
                                  simple: {
                                    ...prev.simple,
                                    [column.id]: selectedItems.map((item) => item.text),
                                  },
                                };
                              });
                            }}
                          />
                        );
                      }
                      return (
                        <ComboBox
                          className={`${iotPrefix}--filter-flyout__simple-field`}
                          key={columnFilterValue}
                          id={`column-${columnIndex}`}
                          aria-label={filterAria}
                          translateWithId={handleTranslation}
                          items={memoizeColumnOptions(column.options)}
                          itemToString={itemToString('text')}
                          initialSelectedItem={{
                            id: columnFilterValue,
                            text: (
                              column.options.find((option) => option.id === columnFilterValue) || {
                                text: '',
                              }
                            ).text,
                          }}
                          placeholder={column.placeholderText || 'Choose an option'}
                          titleText={column.name}
                          onChange={(evt) => {
                            const { selectedItem } = evt;
                            setFilterState((prev) => {
                              return {
                                ...prev,
                                simple: {
                                  ...prev.simple,
                                  [column.id]: selectedItem === null ? '' : selectedItem.id,
                                },
                              };
                            });
                          }}
                        />
                      );
                    }

                    return (
                      <FormItem
                        key={`simple-filter-item-${rowIndex}-${columnIndex}`}
                        className={`${iotPrefix}--filter-flyout__simple-field`}
                      >
                        <TextInput
                          id={column.id}
                          labelText={column.name}
                          placeholder={column.placeholderText || 'Type and hit enter to apply'}
                          title={filterState?.[column.id] || column.placeholderText}
                          onChange={(event) => {
                            const { value } = event.target;
                            setFilterState((prev) => {
                              return {
                                ...prev,
                                simple: {
                                  ...prev.simple,
                                  [column.id]: value,
                                },
                              };
                            });
                          }}
                          defaultValue={filterState?.simple?.[column.id]}
                        />
                        {filterState?.simple?.[column.id] ? (
                          <div
                            role="button"
                            className={classnames(`${prefix}--list-box__selection`, {
                              [`${iotPrefix}--clear-filters-button--disabled`]: isDisabled,
                            })}
                            tabIndex={isDisabled ? '-1' : '0'}
                            onClick={(event) => {
                              if (!isDisabled) {
                                handleClearFilter(event, column);
                              }
                            }}
                            onKeyDown={(event) =>
                              handleEnterKeyDown(event, () => {
                                if (!isDisabled) {
                                  handleClearFilter(event, column);
                                }
                              })
                            }
                            title={clearFilterAria}
                          >
                            <Close16 description={clearFilterAria} />
                          </div>
                        ) : null}
                      </FormItem>
                    );
                  })}
                </div>
              );
            })}
        </Tab>
        <Tab label={advancedFiltersTabLabel} title={advancedFiltersTabLabel}>
          <MultiSelect
            id="advanced-filter-multiselect"
            titleText={
              <>
                {advancedFilterLabelText}{' '}
                <Button
                  className={`${iotPrefix}--advanced-filter__inline-button`}
                  kind="ghost"
                  onClick={onCreateAdvancedFilter}
                >
                  {createNewAdvancedFilterText}
                </Button>
              </>
            }
            onChange={(e) => {
              onChangeAdvancedFilter(e);
              setFilterState((prev) => {
                return {
                  ...prev,
                  advanced: {
                    filterIds: e.selectedItems?.map((advFilter) => advFilter.filterId) ?? [],
                  },
                };
              });
            }}
            itemToString={itemToString('filterTitleText')}
            items={advancedFilters ?? []}
            initialSelectedItems={advancedFilters?.filter((advFilter) =>
              selectedAdvancedFilterIds.includes(advFilter.filterId)
            )}
            label={advancedFilterPlaceholderText}
          />
        </Tab>
      </Tabs>
    </FlyoutMenu>
  );
};

TableToolbarAdvancedFilterFlyout.propTypes = propTypes;
TableToolbarAdvancedFilterFlyout.defaultProps = defaultProps;

export default TableToolbarAdvancedFilterFlyout;
