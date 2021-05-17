import { Add16, Subtract16 } from '@carbon/icons-react';
import { Dropdown } from 'carbon-components-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../../Button/Button';
import ComposedModal from '../../ComposedModal/ComposedModal';
import { settings } from '../../../constants/Settings';
import { TableColumnsPropTypes, TableSortPropType } from '../TablePropTypes';

const { iotPrefix } = settings;

const propTypes = {
  columns: TableColumnsPropTypes.isRequired,
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
  },
};

const TableMultiSortModal = ({ columns, sort, actions, showMultiSortModal, i18n }) => {
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

  const handleSelectMultiSortColumn = useCallback(
    (index) => ({ selectedItem }) => {
      setSelectedMultiSortColumns((prev) => {
        const currentItem = prev[index];
        return Object.assign([], prev, {
          [index]: {
            ...currentItem,
            columnId: selectedItem.id,
          },
        });
      });
    },
    []
  );
  const handleSelectMultiSortColumnDirection = useCallback(
    (index) => ({ selectedItem }) => {
      setSelectedMultiSortColumns((prev) => {
        const currentItem = prev[index];
        return Object.assign([], prev, {
          [index]: {
            ...currentItem,
            direction: selectedItem.id,
          },
        });
      });
    },
    []
  );

  const multiSortColumns = useMemo(() => {
    return columns
      .filter((col) => {
        const columnAlreadySorted =
          selectedMultiSortColumns.find((sortCol) => sortCol.columnId === col.id) !== undefined;

        return col.isSortable && !columnAlreadySorted;
      })
      .map((col) => ({ id: col.id, name: col.name }));
  }, [columns, selectedMultiSortColumns]);

  const handleAddMultiSortColumn = useCallback(
    (index) => () => {
      setSelectedMultiSortColumns((prev) => {
        const clone = [...prev];
        clone.splice(index + 1, 0, {
          columnId: '',
          direction: 'ASC',
        });
        return clone;
      });

      onAddMultiSortColumn(index);
    },
    [onAddMultiSortColumn]
  );
  const handleRemoveMultiSortColumn = useCallback(
    (index) => () => {
      setSelectedMultiSortColumns((prev) => {
        const clone = [...prev];
        clone.splice(index, 1);
        return clone;
      });

      onRemoveMultiSortColumn(index);
    },
    [onRemoveMultiSortColumn]
  );

  const handleSaveMultiSortColumns = useCallback(() => {
    onSaveMultiSortColumns(selectedMultiSortColumns);
  }, [onSaveMultiSortColumns, selectedMultiSortColumns]);

  const handleCancelMultiSortColumns = useCallback(() => {
    setSelectedMultiSortColumns(sort);
    onCancelMultiSortColumns();
  }, [onCancelMultiSortColumns, sort]);

  return (
    <ComposedModal
      className={`${iotPrefix}--table-multi-sort-modal`}
      header={{
        title: i18n.multiSortModalTitle,
      }}
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
              initialSelectedItem={columns.find((col) => {
                return col.id === columnId;
              })}
            />
            <Dropdown
              id={`${columnId}-select-sort-direction`}
              label={i18n.multiSortDirectionLabel}
              items={sortDirections}
              titleText={i18n.multiSortDirectionTitle}
              initialSelectedItem={sortDirections.find((dir) => {
                return dir.id === direction;
              })}
              onChange={handleSelectMultiSortColumnDirection(index)}
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
