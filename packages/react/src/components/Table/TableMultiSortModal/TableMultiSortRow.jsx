import React from 'react';
import { Add16, Subtract16 } from '@carbon/icons-react';
import { Select, SelectItem } from 'carbon-components-react';
import PropTypes from 'prop-types';

import Button from '../../Button/Button';

const propTypes = {
  columnId: PropTypes.string.isRequired,
  defaultColumn: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  defaultDirection: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  i18n: PropTypes.shape({
    multiSortSelectColumnSortByTitle: PropTypes.stirng,
    multiSortSelectColumnThenByTitle: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  multiSortColumns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  numSelectedColumns: PropTypes.number.isRequired,
  onAddMultiSortColumn: PropTypes.func.isRequired,
  onRemoveMultiSortColumn: PropTypes.func.isRequired,
  onSelectMultiSortColumn: PropTypes.func.isRequired,
  onSelectMultiSortColumnDirection: PropTypes.func.isRequired,
  sortDirections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
  testId: PropTypes.string.isRequired,
};

export const TableMultiSortRow = ({
  columnId,
  defaultColumn,
  defaultDirection,
  i18n,
  index,
  multiSortColumns,
  onAddMultiSortColumn,
  onRemoveMultiSortColumn,
  onSelectMultiSortColumn,
  onSelectMultiSortColumnDirection,
  numSelectedColumns,
  sortDirections,
  testId,
}) => {
  return (
    <div>
      <Select
        data-testid={`${testId}-column-select`}
        id={`${columnId}-select-sort-column`}
        helperText={i18n.multiSortSelectColumnLabel}
        onChange={onSelectMultiSortColumn}
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
        onChange={onSelectMultiSortColumnDirection}
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
        onClick={onAddMultiSortColumn}
        testId={`${columnId}-add-sort-button`}
        disabled={numSelectedColumns >= multiSortColumns.length}
      />
      <Button
        hasIconOnly
        renderIcon={Subtract16}
        kind="ghost"
        tooltipPosition="top"
        iconDescription={i18n.multiSortRemoveColumn}
        onClick={onRemoveMultiSortColumn}
        testId={`${columnId}-remove-sort-button`}
        disabled={numSelectedColumns.length === 1}
      />
    </div>
  );
};

TableMultiSortRow.propTypes = propTypes;
