import React from 'react';
import { mount } from 'enzyme';
import { render, screen, fireEvent } from '@testing-library/react';

import { DragAndDrop } from '../../../../utils/DragAndDropUtils';

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
  it('can reorder columns', () => {
    const onChangeOrdering = jest.fn();
    render(
      <DragAndDrop>
        <UnconnectedColumnHeaderRow
          {...commonTableHeadProps}
          onChangeOrdering={onChangeOrdering}
        />
      </DragAndDrop>
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
      <DragAndDrop>
        <UnconnectedColumnHeaderRow
          {...commonTableHeadProps}
          onChangeOrdering={onChangeOrdering}
        />
      </DragAndDrop>
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
      <DragAndDrop>
        <UnconnectedColumnHeaderRow
          {...commonTableHeadProps}
          onChangeOrdering={onChangeOrdering}
          onColumnToggle={onColumnToggle}
        />
      </DragAndDrop>
    );

    fireEvent.click(screen.getByText('Column 1'));

    expect(onChangeOrdering).toHaveBeenCalledTimes(0);
    expect(onColumnToggle).toHaveBeenCalledTimes(1);
  });
});

describe('ColumnHeaderRow', () => {
  it('when hasRowExpansion set to true', () => {
    const tableHeadProps = {
      ...commonTableHeadProps,
      options: { ...commonTableHeadProps.options, hasRowExpansion: true },
    };

    render(
      <DragAndDrop>
        <UnconnectedColumnHeaderRow {...tableHeadProps} />
      </DragAndDrop>
    );

    expect(screen.getByText('Column 1').textContent).toContain('Column 1');
    expect(screen.getByText('Column 2').textContent).toContain('Column 2');
  });

  it('when ordering is empty, no columns are displayed', () => {
    const tableHeadProps = {
      ...commonTableHeadProps,
      ordering: [],
    };

    const renderedElement = render(
      <DragAndDrop>
        <UnconnectedColumnHeaderRow {...tableHeadProps} />
      </DragAndDrop>
    );

    expect(renderedElement.container.innerHTML).toContain('colspan="2"');
  });

  it('when hasRowActions set to true', () => {
    const tableHeadProps = {
      ...commonTableHeadProps,
      options: { ...commonTableHeadProps.options, hasRowActions: true },
    };

    const renderedElement = render(
      <DragAndDrop>
        <UnconnectedColumnHeaderRow {...tableHeadProps} />
      </DragAndDrop>
    );

    expect(renderedElement.container.innerHTML).toContain('Column 1');
    expect(renderedElement.container.innerHTML).toContain('Column 2');
    expect(renderedElement.container.innerHTML).toContain('colspan="3"');
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

    const renderedElement = mount(
      <DragAndDrop>
        <UnconnectedColumnHeaderRow {...tableHeadProps} />
      </DragAndDrop>
    );

    expect(renderedElement.find('.column-header__btn').last().text()).toContain(
      'button_text'
    );

    renderedElement.find('.column-header__btn').last().simulate('click');

    expect(onColumnSelectionConfig).toHaveBeenCalledTimes(1);
  });
});
