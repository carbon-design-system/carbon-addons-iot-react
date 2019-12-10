import React from 'react';
import { mount } from 'enzyme';
import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';
import { render } from '@testing-library/react';

import { UnconnectedColumnHeaderRow } from './ColumnHeaderRow';

const commonTableHeadProps = {
  /** List of columns */
  columns: [
    { id: 'col1', name: 'Column 1', isSortable: false },
    { id: 'col2', name: 'Column 2', isSortable: false },
  ],
  /** Ordering list */
  ordering: [{ columnId: 'col1', isHidden: false }, { columnId: 'col2', isHidden: false }],
  tableOptions: {
    hasRowSelection: false,
    hasRowExpansion: false,
  },
  onChangeOrdering: jest.fn(),
};

const wrapInTestContext = (DecoratedComponent, props) =>
  DragDropContext(TestBackend)(() => <DecoratedComponent {...props} />);

let wrapper;
let backend;

describe('TableHead', () => {
  beforeEach(() => {
    const Wrapped = wrapInTestContext(UnconnectedColumnHeaderRow, commonTableHeadProps);

    wrapper = mount(<Wrapped />);
    backend = wrapper
      .instance()
      .getManager()
      .getBackend();
  });
  it('can reorder columns', () => {
    const dragSource = wrapper
      .find("DragSource(DropTarget(ColumnHeaderSelect))[columnId='col1']")
      .instance();
    const dropTarget = wrapper.find("DropTarget(ColumnHeaderSelect)[columnId='col2']").instance();
    backend.simulateBeginDrag([dragSource.getHandlerId()]);
    backend.simulateHover([dropTarget.getHandlerId()]);
    backend.simulateEndDrag();
    expect(commonTableHeadProps.onChangeOrdering).toHaveBeenCalled();
  });
  it('can click to toggle visibility', () => {
    const headerButton = wrapper.find("ColumnHeaderSelect[columnId='col1']");
    headerButton.simulate('click');
    expect(commonTableHeadProps.onChangeOrdering).toHaveBeenCalled();
  });
});

describe('ColumnHeaderRow test', () => {
  test('when hasRowExpansion set to true', () => {
    const tableHeadProps = {
      ...commonTableHeadProps,
      tableOptions: { ...commonTableHeadProps.tableOptions, hasRowExpansion: true },
    };

    const Wrapped = wrapInTestContext(UnconnectedColumnHeaderRow, tableHeadProps);
    const { getByText } = render(<Wrapped />);

    expect(getByText('Column 1').textContent).toContain('Column 1');
    expect(getByText('Column 2').textContent).toContain('Column 2');
  });

  test('when ordering is empty, no columns are displayed', () => {
    const tableHeadProps = {
      ...commonTableHeadProps,
      ordering: [],
    };

    const Wrapped = wrapInTestContext(UnconnectedColumnHeaderRow, tableHeadProps);
    const renderedElement = render(<Wrapped />);

    expect(renderedElement.container.innerHTML).toContain('colspan="2"');
  });

  test('when hasRowActions set to true', () => {
    const tableHeadProps = {
      ...commonTableHeadProps,
      tableOptions: { ...commonTableHeadProps.tableOptions, hasRowActions: true },
    };

    const Wrapped = wrapInTestContext(UnconnectedColumnHeaderRow, tableHeadProps);
    const renderedElement = render(<Wrapped />);

    expect(renderedElement.container.innerHTML).toContain('Column 1');
    expect(renderedElement.container.innerHTML).toContain('Column 2');
    expect(renderedElement.container.innerHTML).toContain('colspan="3"');
  });
});
