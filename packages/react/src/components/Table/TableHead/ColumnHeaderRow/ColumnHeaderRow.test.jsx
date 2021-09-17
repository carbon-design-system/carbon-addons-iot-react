import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UnconnectedColumnHeaderRow } from './ColumnHeaderRow';

const commonTableHeadProps = {
  /** List of columns */
  columns: [
    { id: 'col1', name: 'Column 1', isSortable: false },
    { id: 'col2', name: 'Column 2', isSortable: false },
  ],
  /** Ordering list */
  ordering: [
    { columnId: 'col1', isHidden: false },
    { columnId: 'col2', isHidden: false },
  ],
  options: {
    hasRowSelection: false,
    hasRowExpansion: false,
  },
  onColumnToggle: () => {},
  onChangeOrdering: () => {},
};

describe('TableHead', () => {
  it('should be selectable by testId', () => {
    const onChangeOrdering = jest.fn();
    render(
      <UnconnectedColumnHeaderRow
        {...commonTableHeadProps}
        showExpanderColumn={false}
        onChangeOrdering={onChangeOrdering}
        testId="column_header_row"
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(screen.getByTestId('column_header_row')).toBeDefined();
  });

  it('can reorder columns', () => {
    const onChangeOrdering = jest.fn();
    render(
      <UnconnectedColumnHeaderRow
        {...commonTableHeadProps}
        showExpanderColumn={false}
        onChangeOrdering={onChangeOrdering}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );

    const column1 = screen.getByText('Column 1');
    const column2 = screen.getByText('Column 2');

    fireEvent.dragStart(column1);
    fireEvent.dragEnter(column2);
    fireEvent.dragOver(column2);
    fireEvent.drop(column2);

    expect(onChangeOrdering).toHaveBeenCalledWith([
      { columnId: 'col2', isHidden: false },
      { columnId: 'col1', isHidden: false },
    ]);
  });
  it('does not reorder columns when placed upon themselves', () => {
    const onChangeOrdering = jest.fn();
    render(
      <UnconnectedColumnHeaderRow
        {...commonTableHeadProps}
        showExpanderColumn={false}
        onChangeOrdering={onChangeOrdering}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );

    const column1 = screen.getByText('Column 1');

    fireEvent.dragStart(column1);
    fireEvent.dragEnter(column1);
    fireEvent.dragOver(column1);
    fireEvent.drop(column1);

    expect(onChangeOrdering).toHaveBeenCalledTimes(0);
  });
  it('can click to toggle visibility', () => {
    const onChangeOrdering = jest.fn();
    const onColumnToggle = jest.fn();
    render(
      <UnconnectedColumnHeaderRow
        {...commonTableHeadProps}
        onChangeOrdering={onChangeOrdering}
        onColumnToggle={onColumnToggle}
        showExpanderColumn={false}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );

    fireEvent.click(screen.getByText('Column 1'));

    expect(onChangeOrdering).toHaveBeenCalledTimes(0);
    expect(onColumnToggle).toHaveBeenCalledTimes(1);
  });
});

describe('ColumnHeaderRow', () => {
  it('when hasRowExpansion set to true', () => {
    const tableHeadProps = {
      ...commonTableHeadProps,
      options: { ...commonTableHeadProps.options, hasRowExpansion: true },
    };

    render(<UnconnectedColumnHeaderRow {...tableHeadProps} showExpanderColumn={false} />, {
      container: document.body.appendChild(document.createElement('tbody')),
    });

    expect(screen.getByText('Column 1').textContent).toContain('Column 1');
    expect(screen.getByText('Column 2').textContent).toContain('Column 2');
  });

  it('when ordering is empty, no columns are displayed', () => {
    const tableHeadProps = {
      ...commonTableHeadProps,
      ordering: [],
    };

    const { container } = render(
      <UnconnectedColumnHeaderRow {...tableHeadProps} showExpanderColumn={false} />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );

    expect(container.innerHTML).toContain('colspan="2"');
  });

  it('when hasRowActions set to true', () => {
    const tableHeadProps = {
      ...commonTableHeadProps,
      options: { ...commonTableHeadProps.options, hasRowActions: true },
    };

    const { container } = render(
      <UnconnectedColumnHeaderRow {...tableHeadProps} showExpanderColumn={false} />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );

    expect(container.innerHTML).toContain('Column 1');
    expect(container.innerHTML).toContain('Column 2');
    expect(container.innerHTML).toContain('colspan="3"');
  });

  it('adds extra colspan when showExpanderColumn is true', () => {
    const tableHeadProps = {
      ...commonTableHeadProps,
      options: { ...commonTableHeadProps.options },
      showExpanderColumn: true,
    };

    const { container } = render(<UnconnectedColumnHeaderRow {...tableHeadProps} />, {
      container: document.body.appendChild(document.createElement('tbody')),
    });

    expect(container.innerHTML).toContain('Column 1');
    expect(container.innerHTML).toContain('Column 2');
    expect(container.innerHTML).toContain('colspan="3"');
  });

  it('column selection config renders and fires callback on click', () => {
    const onColumnSelectionConfig = jest.fn();
    const tableHeadProps = {
      ...commonTableHeadProps,
      options: {
        ...commonTableHeadProps.options,
        hasColumnSelectionConfig: true,
      },
      onColumnSelectionConfig,
      columnSelectionConfigText: 'button_text',
    };

    render(<UnconnectedColumnHeaderRow {...tableHeadProps} showExpanderColumn={false} />, {
      container: document.body.appendChild(document.createElement('tbody')),
    });

    expect(screen.queryAllByText('button_text')).not.toBeNull();

    userEvent.click(screen.queryByRole('button', { name: 'button_text' }));

    expect(onColumnSelectionConfig).toHaveBeenCalledTimes(1);
  });
});
