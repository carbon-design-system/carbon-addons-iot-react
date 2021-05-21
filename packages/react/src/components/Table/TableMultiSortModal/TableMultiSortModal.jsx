import { Add16, Subtract16 } from '@carbon/icons-react';
import { Dropdown } from 'carbon-components-react';
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import Button from '../../Button/Button';
import ComposedModal from '../../ComposedModal/ComposedModal';
import { settings } from '../../../constants/Settings';
import { TableColumnsPropTypes, TableSortPropType } from '../TablePropTypes';

const { iotPrefix } = settings;

const propTypes = {
  columns: TableColumnsPropTypes.isRequired,
  ordering: PropTypes.arrayOf(
    PropTypes.shape({
      columnId: PropTypes.string.isRequired,
      /* Visibility of column in table, defaults to false */
      isHidden: PropTypes.bool,
    })
  ).isRequired,
  actions: PropTypes.shape({
    onAddMultiSortColumn: PropTypes.func,
    onRemoveMultiSortColumn: PropTypes.func,
    onSaveMultiSortColumns: PropTypes.func,
    onCancelMultiSortColumns: PropTypes.func,
  }).isRequired,
  sort: PropTypes.arrayOf(TableSortPropType).isRequired,
  showMultiSortModal: PropTypes.bool,
  i18n: PropTypes.shape({
    multiSortModalTitle: PropTypes.string,
    multiSortModalPrimaryLabel: PropTypes.string,
    multiSortModalSecondaryLabel: PropTypes.string,
    multiSortSelectColumnLabel: PropTypes.string,
    multiSortSelectColumnSortByTitle: PropTypes.string,
    multiSortSelectColumnThenByTitle: PropTypes.string,
    multiSortDirectionLabel: PropTypes.string,
    multiSortDirectionTitle: PropTypes.string,
    multiSortAddColumn: PropTypes.string,
    multiSortRemoveColumn: PropTypes.string,
    multiSortAscending: PropTypes.string,
    multiSortDescending: PropTypes.string,
    multiSortCloseModal: PropTypes.string,
    multiSortClearAll: PropTypes.string,
    multiSortOpenMenu: PropTypes.string,
    multiSortCloseMenu: PropTypes.string,
  }),
};

const defaultProps = {
  showMultiSortModal: false,
  i18n: {
    multiSortModalTitle: 'Select columns to sort',
    multiSortModalPrimaryLabel: 'Sort',
    multiSortModalSecondaryLabel: 'Cancel',
    multiSortSelectColumnLabel: 'Select a column',
    multiSortSelectColumnSortByTitle: 'Sort by',
    multiSortSelectColumnThenByTitle: 'Then by',
    multiSortDirectionLabel: 'Select a direction',
    multiSortDirectionTitle: 'Sort order',
    multiSortAddColumn: 'Add column',
    multiSortRemoveColumn: 'Remove column',
    multiSortAscending: 'Ascending',
    multiSortDescending: 'Descending',
    multiSortCloseModal: 'Close',
  },
};

const TableMultiSortModal = ({ columns, ordering, sort, actions, showMultiSortModal, i18n }) => {
  const {
    onAddMultiSortColumn,
    onRemoveMultiSortColumn,
    onSaveMultiSortColumns,
    onCancelMultiSortColumns,
  } = actions;

  const [selectedMultiSortColumns, setSelectedMultiSortColumns] = useState(sort);

  useEffect(() => {
    setSelectedMultiSortColumns(sort);
  }, [sort]);

  const handleTranslation = (idToTranslate) => {
    switch (idToTranslate) {
      case 'open.menu':
        return i18n.multiSortOpenMenu;
      case 'close.menu':
        return i18n.multiSortCloseMenu;
      default:
        return '';
    }
  };

  const sortDirections = useMemo(
    () => [
      {
        id: 'ASC',
        label: i18n.multiSortAscending,
      },
      {
        id: 'DESC',
        label: i18n.multiSortDescending,
      },
    ],
    [i18n.multiSortAscending, i18n.multiSortDescending]
  );

  const handleSelectMultiSortColumn = (index) => ({ selectedItem }) => {
    setSelectedMultiSortColumns((prev) => {
      const currentItem = prev[index];
      return Object.assign([], prev, {
        [index]: {
          ...currentItem,
          columnId: selectedItem.id,
        },
      });
    });
  };

  const handleSelectMultiSortColumnDirection = (index) => ({ selectedItem }) => {
    setSelectedMultiSortColumns((prev) => {
      const currentItem = prev[index];
      return Object.assign([], prev, {
        [index]: {
          ...currentItem,
          direction: selectedItem.id,
        },
      });
    });
  };

  const multiSortColumns = useMemo(() => {
    return columns
      .filter(({ id, isSortable }) => {
        const columnAlreadySorted =
          selectedMultiSortColumns.find(({ columnId }) => columnId === id) !== undefined;

        const orderCol = ordering.find(({ columnId }) => columnId === id);

        return isSortable && !orderCol.isHidden && !columnAlreadySorted;
      })
      .map((col) => ({ id: col.id, name: col.name }));
  }, [columns, ordering, selectedMultiSortColumns]);

  const getInitialSelectedColumn = (columnId) => {
    const selectedColumn = columns.find((col) => {
      return col.id === columnId;
    });

    return selectedColumn || multiSortColumns[0];
  };

  const getInitialSelectedDirection = (direction) => {
    const selectedDirection = sortDirections.find((dir) => {
      return dir.id === direction;
    });

    return selectedDirection || sortDirections[0];
  };

  const handleAddMultiSortColumn = (index) => () => {
    setSelectedMultiSortColumns((prev) => {
      const clone = [...prev];
      clone.splice(index + 1, 0, {
        columnId: '',
        direction: 'ASC',
      });
      return clone;
    });

    onAddMultiSortColumn(index);
  };

  const handleRemoveMultiSortColumn = (index) => () => {
    setSelectedMultiSortColumns((prev) => prev.filter((c, i) => i !== index));

    onRemoveMultiSortColumn(index);
  };

  const handleSaveMultiSortColumns = () => {
    // if empty strings were passed for columnId or direction
    // the dropdown will show the first available column and direction,
    // but if they save without performing a change, the initial state
    // is empty, so we perform a check to ensure the defaults are saved
    const defaulted = selectedMultiSortColumns.map(({ columnId, direction }) => {
      const column = getInitialSelectedColumn(columnId);
      const dir = getInitialSelectedDirection(direction);
      return {
        columnId: columnId || column.id,
        direction: direction || dir.id,
      };
    });

    if (!isEqual(selectedMultiSortColumns, defaulted)) {
      setSelectedMultiSortColumns(defaulted);
    }

    onSaveMultiSortColumns(defaulted);
  };

  const handleCancelMultiSortColumns = () => {
    setSelectedMultiSortColumns(sort);
    onCancelMultiSortColumns();
  };

  return (
    <ComposedModal
      className={`${iotPrefix}--table-multi-sort-modal`}
      header={{
        title: i18n.multiSortModalTitle,
      }}
      iconDescription={i18n.multiSortCloseModal}
      footer={{
        primaryButtonLabel: i18n.multiSortModalPrimaryLabel,
        secondaryButtonLabel: i18n.multiSortModalSecondaryLabel,
      }}
      open={showMultiSortModal}
      onSubmit={handleSaveMultiSortColumns}
      onClose={handleCancelMultiSortColumns}
    >
      {selectedMultiSortColumns.map(({ columnId, direction }, index) => {
        return (
          <div
            key={`${columnId}-${direction}-${index}`}
            className={`${iotPrefix}--table-multi-sort-modal__content`}
          >
            <Dropdown
              id={`${columnId}-select-sort-column`}
              label={i18n.multiSortSelectColumnLabel}
              items={multiSortColumns}
              itemToString={(col) => {
                return col.name;
              }}
              onChange={handleSelectMultiSortColumn(index)}
              titleText={
                index === 0
                  ? i18n.multiSortSelectColumnSortByTitle
                  : i18n.multiSortSelectColumnThenByTitle
              }
              initialSelectedItem={getInitialSelectedColumn(columnId)}
              translateWithId={handleTranslation}
            />
            <Dropdown
              id={`${columnId}-select-sort-direction`}
              label={i18n.multiSortDirectionLabel}
              items={sortDirections}
              titleText={i18n.multiSortDirectionTitle}
              initialSelectedItem={getInitialSelectedDirection(direction)}
              onChange={handleSelectMultiSortColumnDirection(index)}
              translateWithId={handleTranslation}
            />
            <Button
              hasIconOnly
              renderIcon={Add16}
              kind="ghost"
              tooltipPosition="top"
              iconDescription={i18n.multiSortAddColumn}
              onClick={handleAddMultiSortColumn(index)}
              data-testid={`${columnId}-add-rule-button`}
            />
            <Button
              hasIconOnly
              renderIcon={Subtract16}
              kind="ghost"
              tooltipPosition="top"
              iconDescription={i18n.multiSortRemoveColumn}
              onClick={handleRemoveMultiSortColumn(index)}
              data-testid={`${columnId}-remove-rule-button`}
              disabled={selectedMultiSortColumns.length === 1}
            />
          </div>
        );
      })}
    </ComposedModal>
  );
};

TableMultiSortModal.propTypes = propTypes;
TableMultiSortModal.defaultProps = defaultProps;

export default TableMultiSortModal;
