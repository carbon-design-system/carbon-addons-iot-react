import { Close16, Filter20 } from '@carbon/icons-react';
import {
  Button,
  ComboBox,
  FormItem,
  MultiSelect,
  Tab,
  Tabs,
  TextInput,
} from 'carbon-components-react';
import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import memoize from 'lodash/memoize';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';
import FlyoutMenu, { FlyoutMenuDirection } from '../../FlyoutMenu/FlyoutMenu';
import { handleEnterKeyDown } from '../../../utils/componentUtilityFunctions';

const { iotPrefix, prefix } = settings;

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
      /** if isMultiselect and isFilterable are true, the table is filtered based on a multiselect */
      isMultiselect: PropTypes.bool,
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
          PropTypes.arrayOf(PropTypes.string),
        ]).isRequired,
      })
    ),
    hasFastFilter: PropTypes.bool,
    advancedFilters: PropTypes.arrayOf(
      PropTypes.shape({
        filterId: PropTypes.string.isRequired,
        filterTitleText: PropTypes.string.isRequired,
      })
    ),
    advancedFilterFlyoutOpen: PropTypes.bool,
    selectedAdvancedFilterId: PropTypes.string,
    isDisabled: PropTypes.bool,
  }),
  actions: PropTypes.shape({
    onApplyFilter: PropTypes.func,
    onCancelFilter: PropTypes.func,
    onCreateAdvancedFilter: PropTypes.func,
    onChangeAdvancedFilter: PropTypes.func,
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

const defaultProps = {
  tableState: {
    filters: [],
    hasFastFilter: true,
    advancedFilters: [],
    advancedFilterFlyoutOpen: false,
    selectedAdvancedFilterId: '',
    isDisabled: false,
  },
  actions: {
    onApplyFilter: null,
    onCancelFilter: null,
    onCreateAdvancedFilter: null,
    onChangeAdvancedFilter: null,
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
    hasFastFilter,
    advancedFilters,
    advancedFilterFlyoutOpen,
    selectedAdvancedFilterId,
    isDisabled,
  },
  i18n,
  actions: {
    onApplyFilter,
    onCancelFilter,
    onCreateAdvancedFilter,
    onChangeAdvancedFilter,
    onToggleFilter,
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
    filters?.reduce((state, { columnId, value }) => {
      return {
        ...state,
        simple: {
          ...state.simple,
          [columnId]: value,
        },
        advanced: {
          filterId: selectedAdvancedFilterId ?? null,
        },
      };
    }, {}) ?? {}
  );
  const handleApplyFilter = useCallback(() => {
    if (typeof onApplyFilter === 'function') {
      onApplyFilter(filterState);
    }
  }, [filterState, onApplyFilter]);

  const handleClearFilter = (event, { id }) => {
    // when a user clicks or hits ENTER, we'll clear the input
    if (event.keyCode === 13 || !event.keyCode) {
      setFilterState((prev) => ({
        ...prev,
        simple: {
          ...prev.simple,
          [id]: '',
        },
      }));
    }
  };

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

  useEffect(() => {
    handleApplyFilter();
  }, [handleApplyFilter]);

  return (
    <FlyoutMenu
      testId="advanced-filter-flyout"
      iconDescription="advanced-filter-flyout-icon"
      direction={FlyoutMenuDirection.BottomEnd}
      renderIcon={Filter20}
      light
      isOpen={advancedFilterFlyoutOpen}
      onApply={() => {
        if (typeof onApplyFilter === 'function') {
          onApplyFilter(filterState);
        }
      }}
      onCancel={onCancelFilter}
      buttonProps={{
        className: classnames(
          `${prefix}--btn--icon-only`,
          `${iotPrefix}--tooltip-svg-wrapper`,
          `${iotPrefix}--table-toolbar__advanced-filters-button`,
          {
            [`${iotPrefix}--table-toolbar-button-active`]: advancedFilterFlyoutOpen,
          }
        ),
        onClick: onToggleFilter,
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
              return !column.isHidden && fullColumn.isFilterable === true;
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
                    const { value: columnStateValue } =
                      filters?.find((filter) => filter.columnId === column.id) ?? {};
                    const filterColumnOptions = (options) => {
                      options.sort((a, b) => {
                        return a.text.localeCompare(b.text, { sensitivity: 'base' });
                      });
                      return options;
                    };
                    const memoizeColumnOptions = memoize(filterColumnOptions); // TODO: this memoize isn't really working, should refactor to a higher column level

                    if (column.options) {
                      if (column.isMultiselect) {
                        return (
                          <MultiSelect.Filterable
                            className={`${iotPrefix}--filter-flyout__simple-field`}
                            key={columnStateValue}
                            id={`column-${rowIndex}-${columnIndex}`}
                            aria-label={filterAria}
                            placeholder={column.placeholderText || 'Choose an option'}
                            translateWithId={handleTranslation}
                            items={memoizeColumnOptions(column.options)}
                            label={column.placeholderText || 'Choose an option'}
                            itemToString={(item) => (item ? item.text : '')}
                            titleText={column.name}
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
                              setFilterState((prev) => {
                                return {
                                  ...prev,
                                  simple: {
                                    ...prev.simple,
                                    [column.id]: evt.selectedItems.map((item) => item.text),
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
                          key={columnStateValue}
                          id={`column-${columnIndex}`}
                          aria-label={filterAria}
                          translateWithId={handleTranslation}
                          items={memoizeColumnOptions(column.options)}
                          itemToString={(item) => (item ? item.text : '')}
                          initialSelectedItem={{
                            id: columnStateValue,
                            text: (
                              column.options.find((option) => option.id === columnStateValue) || {
                                text: '',
                              }
                            ).text,
                          }}
                          placeholder={column.placeholderText || 'Choose an option'}
                          titleText={column.name}
                          onChange={(evt) => {
                            setFilterState((prev) => {
                              return {
                                ...prev,
                                simple: {
                                  ...prev.simple,
                                  [column.id]: evt.selectedItem === null ? '' : evt.selectedItem.id,
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
                            event.persist();

                            setFilterState((prev) => {
                              return {
                                ...prev,
                                simple: {
                                  ...prev.simple,
                                  [column.id]: event.target.value,
                                },
                              };
                            });
                          }}
                          onKeyDown={
                            !hasFastFilter
                              ? (event) => handleEnterKeyDown(event, handleApplyFilter)
                              : null
                          } // if fast filter off, then filter on key press
                          onBlur={!hasFastFilter ? handleApplyFilter : null} // if fast filter off, then filter on blur
                          value={filterState?.simple?.[column.id]}
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
          <ComboBox
            id="advanced-filter-combobox"
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
              if (typeof onChangeAdvancedFilter === 'function') {
                onChangeAdvancedFilter(e);
              }
              setFilterState((prev) => {
                return {
                  ...prev,
                  advanced: {
                    filterId: e.selectedItem.filterId,
                  },
                };
              });
            }}
            itemToString={(item) => item?.filterTitleText ?? ''}
            items={advancedFilters ?? []}
            initialSelectedItem={advancedFilters?.find(
              (filter) => filter.filterId === selectedAdvancedFilterId
            )}
            placeholder={advancedFilterPlaceholderText}
          />
        </Tab>
      </Tabs>
    </FlyoutMenu>
  );
};

TableToolbarAdvancedFilterFlyout.propTypes = propTypes;
TableToolbarAdvancedFilterFlyout.defaultProps = defaultProps;

export default TableToolbarAdvancedFilterFlyout;
