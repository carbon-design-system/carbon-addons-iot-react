import React from 'react';
import { mount } from 'enzyme';
// import { DataTable } from 'carbon-components-react';
import { Simulate } from 'react-dom/test-utils';

import TableHead from './TableHead';
import TableHeader from './TableHeader';

// const { TableHeader } = DataTable;

function mouseMove(x, y, node) {
  const doc = node ? node.ownerDocument : document;
  const evt = doc.createEvent('MouseEvents');
  evt.initMouseEvent(
    'mousemove',
    true,
    true,
    window,
    0,
    0,
    0,
    x,
    y,
    false,
    false,
    false,
    false,
    0,
    null
  );
  doc.dispatchEvent(evt);
  return evt;
}

function simulateMovementFromTo(node, fromX, fromY, toX, toY) {
  Simulate.mouseDown(node, { clientX: fromX, clientY: fromX });
  mouseMove(toX, toY, node);
  Simulate.mouseUp(node);
}

const commonTableHeadProps = {
  /** List of columns */
  columns: [
    { id: 'col1', name: 'Column 1', isSortable: false },
    { id: 'col2', name: 'Column 2', isSortable: false },
  ],
  tableState: {
    selection: {},
    sort: {},
    ordering: [{ columnId: 'col1', isHidden: false }, { columnId: 'col2', isHidden: false }],
  },
  actions: {},
  hasResize: true,
};

describe('TableHead', () => {
  test('columns should render', () => {
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(2);
  });
  test('make sure data-column is set for width', () => {
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find('th[data-column="col1"]');
    expect(tableHeaders).toHaveLength(1);
  });
  test('check has resize if has resize is true ', () => {
    commonTableHeadProps.hasResize = true;
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find('div.column-resize-wrapper');
    expect(tableHeaders).toHaveLength(1);
  });

  test('check not resize if has resize is false ', () => {
    commonTableHeadProps.hasResize = false;
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find('div.column-resize-wrapper');
    expect(tableHeaders).toHaveLength(0);
  });

  test('drag outside bounds shows invalid', () => {
    commonTableHeadProps.hasResize = true;
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const resizer = wrapper.find('#resize-col1');
    const resizerNode = resizer.getDOMNode();

    expect(resizerNode.classList.contains('column-resize-wrapper')).toBe(true);
    expect(resizerNode.classList.contains('column-resize-wrapper--invalid')).toBe(false);

    simulateMovementFromTo(resizerNode, 0, 0, 0, 900);
    expect(resizerNode.classList.contains('column-resize-wrapper--invalid')).toBe(true);
  });
});
