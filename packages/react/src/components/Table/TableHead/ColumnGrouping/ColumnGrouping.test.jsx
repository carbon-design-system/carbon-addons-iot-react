import React from 'react';
import { render, screen } from '@testing-library/react';

import ColumnGrouping from './ColumnGrouping';

describe('ColumnGrouping', () => {
  it('should be selectable by testId', () => {
    render(
      <ColumnGrouping
        testId="column-grouping-row"
        columnGroups={[]}
        ordering={[]}
        appendedColumns={1}
        prependedColumns={1}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(screen.getByTestId('column-grouping-row')).toBeDefined();
    expect(screen.getByTestId('column-grouping-row-prepended-column-group')).toBeDefined();
    expect(screen.getByTestId('column-grouping-row-appended-column-group')).toBeDefined();
  });

  it('only show groups that have visible columns assigned to it', () => {
    render(
      <ColumnGrouping
        testId="column-grouping-row"
        columnGroups={[
          { id: 'groupA', name: 'group A' },
          { id: 'groupB', name: 'group B' },
        ]}
        ordering={[
          { columnId: 'col1', columnGroupId: 'groupA', isHidden: true },
          { columnId: 'col2', columnGroupId: 'groupB' },
          { columnId: 'col3', columnGroupId: 'groupB' },
        ]}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(screen.getByText('group B')).toBeDefined();
    expect(screen.queryByText('group A')).not.toBeInTheDocument();
  });

  it('ignores references to non existing groups', () => {
    render(
      <ColumnGrouping
        testId="column-grouping-row"
        columnGroups={[{ id: 'groupA', name: 'group A' }]}
        ordering={[
          { columnId: 'col1', columnGroupId: 'groupA' },
          { columnId: 'col2', columnGroupId: 'groupA' },
          { columnId: 'col3', columnGroupId: 'groupB' },
          { columnId: 'col4', columnGroupId: 'groupC' },
        ]}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(screen.getByText('group A')).toBeDefined();
    expect(screen.queryAllByRole('columnheader')).toHaveLength(1);
  });

  it('adds colspan to the columngroup to match the number of columns assigned to it', () => {
    render(
      <ColumnGrouping
        columnGroups={[{ id: 'groupA', name: 'group A' }]}
        ordering={[
          { columnId: 'col1', columnGroupId: 'groupA' },
          { columnId: 'col2', columnGroupId: 'groupA' },
          { columnId: 'col3', columnGroupId: 'groupA' },
        ]}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(screen.getByTitle('group A')).toHaveAttribute('colspan', '3');
  });

  it('appends and prepends columns with the correct colspan', () => {
    const { rerender } = render(
      <ColumnGrouping
        appendedColumns={1}
        prependedColumns={1}
        columnGroups={[{ id: 'groupA', name: 'group A' }]}
        ordering={[
          { columnId: 'col1', columnGroupId: 'groupA' },
          { columnId: 'col2', columnGroupId: 'groupA' },
        ]}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(screen.getByTestId('column-grouping-row-appended-column-group')).toHaveAttribute(
      'colspan',
      '1'
    );
    expect(screen.getByTestId('column-grouping-row-prepended-column-group')).toHaveAttribute(
      'colspan',
      '1'
    );

    rerender(
      <ColumnGrouping
        appendedColumns={2}
        prependedColumns={2}
        columnGroups={[{ id: 'groupA', name: 'group A' }]}
        ordering={[
          { columnId: 'col1', columnGroupId: 'groupA' },
          { columnId: 'col2', columnGroupId: 'groupA' },
        ]}
      />
    );
    expect(screen.getByTestId('column-grouping-row-appended-column-group')).toHaveAttribute(
      'colspan',
      '2'
    );
    expect(screen.getByTestId('column-grouping-row-prepended-column-group')).toHaveAttribute(
      'colspan',
      '2'
    );

    rerender(
      <ColumnGrouping
        appendedColumns={0}
        prependedColumns={0}
        columnGroups={[{ id: 'groupA', name: 'group A' }]}
        ordering={[
          { columnId: 'col1', columnGroupId: 'groupA' },
          { columnId: 'col2', columnGroupId: 'groupA' },
        ]}
      />
    );

    expect(
      screen.queryByTestId('column-grouping-row-appended-column-group')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('column-grouping-row-prepended-column-group')
    ).not.toBeInTheDocument();
  });

  it('renders the correct number of columns', () => {
    render(
      <ColumnGrouping
        appendedColumns={2}
        columnGroups={[
          { id: 'groupA', name: 'group A' },
          { id: 'groupB', name: 'group B' },
          { id: 'groupC', name: 'group C' },
        ]}
        ordering={[
          { columnId: 'col1', columnGroupId: 'groupA' },
          { columnId: 'col2', columnGroupId: 'groupA' },
          { columnId: 'col3', columnGroupId: 'groupB' },
          { columnId: 'col4', columnGroupId: 'groupB' },
          { columnId: 'col5', columnGroupId: 'groupC' },
          { columnId: 'col6', columnGroupId: 'groupC' },
          { columnId: 'col7' },
        ]}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    // It should render 3 group columns and 1 appended column
    expect(screen.queryAllByRole('columnheader')).toHaveLength(4);
  });
});
