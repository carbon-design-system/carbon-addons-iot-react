import { Add16, Subtract16 } from '@carbon/icons-react';
import { Select, SelectItem } from 'carbon-components-react';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
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
    onClearMultiSortColumns: PropTypes.func,
  }).isRequired,
  sort: PropTypes.arrayOf(TableSortPropType).isRequired,
  showMultiSortModal: PropTypes.bool,
  i18n: PropTypes.shape({
    multiSortModalTitle: PropTypes.string,
    multiSortModalPrimaryLabel: PropTypes.string,
    multiSortModalSecondaryLabel: PropTypes.string,
    multiSortModalClearLabel: PropTypes.string,
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
  testId: PropTypes.string,
};

const defaultProps = {
  showMultiSortModal: false,
  i18n: {
    multiSortModalTitle: 'Select columns to sort',
    multiSortModalPrimaryLabel: 'Sort',
    multiSortModalSecondaryLabel: 'Cancel',
    multiSortModalClearLabel: 'Clear sorting',
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
  testId: 'multi-sort-modal',
};

const TableMultiSortModal = ({
  columns,
  ordering,
  sort,
  actions,
  showMultiSortModal,
  i18n,
  testId,
}) => {
  const {
    onAddMultiSortColumn,
    onRemoveMultiSortColumn,
    onSaveMultiSortColumns,
    onCancelMultiSortColumns,
    onClearMultiSortColumns,
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

  const handleSelectMultiSortColumn = (index) => (event) => {
    const columnId = event.target.value;
    setSelectedMultiSortColumns((prev) => {
      const currentItem = prev[index];
      return Object.assign([], prev, {
        [index]: {
          ...currentItem,
          columnId,
        },
      });
    });
  };

  const handleSelectMultiSortColumnDirection = (index) => (event) => {
    const direction = event.target.value;
    setSelectedMultiSortColumns((prev) => {
      const currentItem = prev[index];
      return Object.assign([], prev, {
        [index]: {
          ...currentItem,
          direction,
        },
      });
    });
  };

  const multiSortColumns = useMemo(() => {
    return columns
      .filter(({ id, isSortable }) => {
        const orderCol = ordering.find(({ columnId }) => columnId === id);

        return isSortable && !orderCol.isHidden;
      })
      .map((col) => {
        const columnAlreadySorted =
          selectedMultiSortColumns.find(({ columnId }) => columnId === col.id) !== undefined;
        return { id: col.id, name: col.name, disabled: columnAlreadySorted };
      });
  }, [columns, ordering, selectedMultiSortColumns]);

  const getInitialSelectedColumn = (columnId) => {
    const selectedColumn = columns.find((col) => {
      return col.id === columnId;
    });

    return selectedColumn || multiSortColumns.filter((col) => !col.disabled)[0];
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

  const handleClearMultiSortColumns = () => {
    setSelectedMultiSortColumns([]);
    onClearMultiSortColumns();
  };

  return (
    <ComposedModal
      testId={testId}
      className={`${iotPrefix}--table-multi-sort-modal`}
      header={{
        title: i18n.multiSortModalTitle,
      }}
      iconDescription={i18n.multiSortCloseModal}
      onClose={handleCancelMultiSortColumns}
      footer={
        <div className={`${iotPrefix}--table-multi-sort-modal__footer`}>
          <Button
            kind="ghost"
            onClick={handleClearMultiSortColumns}
            testId={`${testId}-modal-clear-button`}
          >
            {i18n.multiSortModalClearLabel}
          </Button>
          <div />
          <Button
            kind="secondary"
            onClick={handleCancelMultiSortColumns}
            testId={`${testId}-modal-secondary-button`}
          >
            {i18n.multiSortModalSecondaryLabel}
          </Button>
          <Button
            kind="primary"
            onClick={handleSaveMultiSortColumns}
            testId={`${testId}-modal-primary-button`}
            data-modal-primary-focus
          >
            {i18n.multiSortModalPrimaryLabel}
          </Button>
        </div>
      }
      open={showMultiSortModal}
    >
      {selectedMultiSortColumns.map(({ columnId, direction }, index) => {
        const defaultColumn = getInitialSelectedColumn(columnId);
        const defaultDirection = getInitialSelectedDirection(direction);
        return (
          <Fragment key={`${columnId}-${direction}-${index}`}>
            <Select
              data-testid={`${testId}-column-select`}
              id={`${columnId}-select-sort-column`}
              helperText={i18n.multiSortSelectColumnLabel}
              onChange={handleSelectMultiSortColumn(index)}
              labelText={
                index === 0
                  ? i18n.multiSortSelectColumnSortByTitle
                  : i18n.multiSortSelectColumnThenByTitle
              }
              defaultValue={defaultColumn?.id}
            >
              {multiSortColumns.map((col) => (
                <SelectItem
                  key={`${col.id}-${col.name}`}
                  text={col.name}
                  value={col.id}
                  disabled={col.disabled}
                />
              ))}
            </Select>
            <Select
              data-testid={`${testId}-direction-select`}
              id={`${columnId}-select-sort-direction`}
              helperText={i18n.multiSortDirectionLabel}
              labelText={i18n.multiSortDirectionTitle}
              defaultValue={defaultDirection.id}
              onChange={handleSelectMultiSortColumnDirection(index)}
            >
              {sortDirections.map((dir) => (
                <SelectItem key={`${dir.id}-${dir.label}`} text={dir.label} value={dir.id} />
              ))}
            </Select>
            <Button
              hasIconOnly
              renderIcon={Add16}
              kind="ghost"
              tooltipPosition="top"
              iconDescription={i18n.multiSortAddColumn}
              onClick={handleAddMultiSortColumn(index)}
              testId={`${columnId}-add-sort-button`}
              disabled={selectedMultiSortColumns.length >= multiSortColumns.length}
            />
            <Button
              hasIconOnly
              renderIcon={Subtract16}
              kind="ghost"
              tooltipPosition="top"
              iconDescription={i18n.multiSortRemoveColumn}
              onClick={handleRemoveMultiSortColumn(index)}
              testId={`${columnId}-remove-sort-button`}
              disabled={selectedMultiSortColumns.length === 1}
            />
          </Fragment>
        );
      })}
    </ComposedModal>
  );
};

TableMultiSortModal.propTypes = propTypes;
TableMultiSortModal.defaultProps = defaultProps;

export default TableMultiSortModal;
