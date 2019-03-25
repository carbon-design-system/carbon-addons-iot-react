import React from 'react';
import { mount } from 'enzyme';
import { DataTable } from 'carbon-components-react';
import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';

import ColumnHeaderRow from './ColumnHeaderRow';

// import ColumnHeaderSelect from '../ColumnHeaderSelect';

const commonTableHeadProps = {
  /** List of columns */
  columns: [{ id: 'col1', name: 'Column 1', isSortable: false }],
  /** Ordering list */
  ordering: [{ columnId: 'col1', isHidden: false }],
  tableOptions: {
    hasRowSelection: false,
    hasRowExpansion: false,
  },
  onChangeOrdering: jest.fn(),
};

const wrapInTestContext = DecoratedComponent => {
  return DragDropContext(TestBackend)(() => <DecoratedComponent {...commonTableHeadProps} />);
};

let wrapper, backend;

describe('TableHead', () => {
  beforeEach(() => {
    const Wrapped = wrapInTestContext(ColumnHeaderRow);

    wrapper = mount(<Wrapped />);
    backend = wrapper
      .instance()
      .getManager()
      .getBackend();
  });
  it('cant be tested indenpendently', () => {
    console.log('Backend variable', wrapper.find(ColumnHeaderRow).debug());

    const nodeDraggable = wrapper.find(ColumnHeaderRow).instance();
    // console.log(nodeDraggable);
    const sourceIdNodeDraggable = nodeDraggable.getHandlerId();
    // console.log(sourceIdNodeDraggable);
    // wrapper
    //   .instance()
    //   .getManager()
    //   .getBackend()
    //   .simulateBeginDrag([nodeDraggable.instance().getHandlerId()]);
  });
});
