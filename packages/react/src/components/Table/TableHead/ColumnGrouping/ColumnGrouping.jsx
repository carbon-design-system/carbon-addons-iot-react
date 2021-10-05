import React from 'react';
import PropTypes from 'prop-types';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import { DataTable } from 'carbon-components-react';

import { settings } from '../../../../constants/Settings';
import TableHeader from '../TableHeader';
import { TableColumnGroupPropType, TableOrderingPropType } from '../../TablePropTypes';

const { iotPrefix } = settings;

const propTypes = {
  /** Number of additional columns that have been added to the start of the table */
  appendedColumns: PropTypes.number,
  /** Specify the properties of each column group in the table. Defaults to empty column. */
  columnGroups: TableColumnGroupPropType.isRequired,
  /** Specify the order, visibility and group belonging of the table columns */
  ordering: TableOrderingPropType.isRequired,
  /** Number of additional columns that have been added to the start of the table */
  prependedColumns: PropTypes.number,
  testId: PropTypes.string,
};

const defaultProps = {
  appendedColumns: 0,
  prependedColumns: 0,
  testId: 'column-grouping-row',
};

const ColumnGrouping = ({ appendedColumns, columnGroups, ordering, prependedColumns, testId }) => {
  const { TableRow } = DataTable;
  const visibleColumns = ordering.filter((col) => !col.isHidden);

  const groups = uniqWith(
    visibleColumns
      .filter((col) => col.columnGroupId)
      .map((col) => ({
        ...columnGroups.find((colGroup) => colGroup.id === col.columnGroupId),
        colspan: visibleColumns.filter(({ columnGroupId }) => columnGroupId === col.columnGroupId)
          .length,
      }))
      .filter((colGroupData) => colGroupData.hasOwnProperty('id')),
    isEqual
  );

  return (
    <TableRow data-testid={testId} className={`${iotPrefix}--table-header__group-row`}>
      {prependedColumns ? (
        <TableHeader
          key="spacer-start"
          colSpan={prependedColumns}
          testId={`${testId}-prepended-column-group`}
          className={`${iotPrefix}--table-header__group-row-spacer`}
        />
      ) : null}
      {groups.map((colGroupData) => (
        <TableHeader
          title={colGroupData.name}
          key={`column-group-${colGroupData.id}`}
          testId={`${testId}-column-group-${colGroupData.id}`}
          className={`${iotPrefix}--table-header__column-group`}
          colSpan={colGroupData.colspan || '1'}
        >
          {colGroupData.name}
        </TableHeader>
      ))}
      {appendedColumns ? (
        <TableHeader
          key="spacer-end"
          colSpan={appendedColumns}
          testId={`${testId}-appended-column-group`}
          className={`${iotPrefix}--table-header__group-row-spacer`}
        />
      ) : null}
    </TableRow>
  );
};

ColumnGrouping.defaultProps = defaultProps;
ColumnGrouping.propTypes = propTypes;
export default ColumnGrouping;
