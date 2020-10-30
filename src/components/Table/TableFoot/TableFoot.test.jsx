import React from 'react';
import { render, screen } from '@testing-library/react';

import { settings } from '../../../constants/Settings';

import TableFoot from './TableFoot';

const { iotPrefix } = settings;

const ordering = [
  { columnId: 'a' },
  {
    columnId: 'b',
    isHidden: true,
  },
  { columnId: 'c' },
];

describe('TableFoot', () => {
  it('shows aggregation label in first column unless that column has an aggregated value', () => {
    const label = 'Total:';
    const tableFootTestId = 'test';
    const firstColumnTestId = `${tableFootTestId}-aggregation-${ordering[0].columnId}`;

    const { rerender } = render(
      <table>
        <TableFoot
          testId={tableFootTestId}
          tableState={{
            aggregations: { label, columns: [{ id: 'c', value: '10' }] },
            ordering: ordering,
          }}
        />
      </table>
    );

    expect(screen.getByTestId(firstColumnTestId).textContent).toEqual(label);

    rerender(
      <table>
        <TableFoot
          testId={tableFootTestId}
          tableState={{
            aggregations: { label, columns: [{ id: 'a', value: '10' }] },
            ordering: ordering,
          }}
        />
      </table>
    );

    expect(screen.getByTestId(firstColumnTestId).textContent).not.toEqual(
      label
    );

    // const modifiedColumns = [
    //   {
    //     id: 'moreNumbers',
    //     name: 'More Numbers',
    //   },
    //   ...tableColumns,
    // ];
    // const modifiedData = tableData.map((data) => ({
    //   ...data,
    //   values: { moreNumbers: 1, ...data.values },
    // }));
    // rerender(
    //   <Table
    //     id="test"
    //     columns={modifiedColumns}
    //     data={modifiedData}
    //     options={{ hasAggregations: true }}
    //     view={{
    //       aggregations: {
    //         label,
    //         columns: [{ id: 'number' }, { id: 'moreNumbers' }],
    //       },
    //     }}
    //   />
    // );
    // const newFirstAggregationCell = screen.getByTestId(
    //   `${tableTestId}-${tableFootTestId}-${modifiedColumns[0].id}`
    // );
    // expect(newFirstAggregationCell.textContent).not.toEqual(label);
    // expect(newFirstAggregationCell.textContent).toEqual('20');
  });

  // it('adds empty cells for rowExpension, rowSelection & rowActions', () => {
  //   render(
  //     <Table
  //       id="test"
  //       columns={tableColumns}
  //       data={tableData}
  //       options={{
  //         hasAggregations: true,
  //         hasRowSelection: 'multi',
  //         hasRowExpansion: true,
  //         hasRowActions: true,
  //       }}
  //       view={{
  //         aggregations: {
  //           label,
  //           columns: [{ id: 'number' }],
  //         },
  //       }}
  //     />
  //   );
  // });
});
