import React from 'react';
import { mount } from 'enzyme';
import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';

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

const wrapInTestContext = DecoratedComponent =>
  DragDropContext(TestBackend)(() => <DecoratedComponent {...commonTableHeadProps} />);

let wrapper;
let backend;

describe('TableHead', () => {
  beforeEach(() => {
    const Wrapped = wrapInTestContext(UnconnectedColumnHeaderRow);

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
