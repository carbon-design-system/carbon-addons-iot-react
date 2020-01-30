import React from 'react';
import { mount } from 'enzyme';
import { Simulate, act } from 'react-dom/test-utils';

import TableHead from './TableHead';
import TableHeader from './TableHeader';

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
function simulateMovementWithoutMouseUp(node, fromX, fromY, toX, toY) {
  const domNode = node.getDOMNode();
  Simulate.mouseDown(domNode, { clientX: fromX, clientY: fromY });
  mouseMove(toX, toY, domNode);
}

function simulateMovementWithMouseUp(node, fromX, fromY, toX, toY) {
  const domNode = node.getDOMNode();
  Simulate.mouseDown(domNode, { clientX: fromX, clientY: fromY });
  mouseMove(toX, toY, domNode);
  const mouseUp = new Event('mouseup');
  window.document.dispatchEvent(mouseUp);
}

const commonTableHeadProps = {
  /** List of columns */
  columns: [
    { id: 'col1', name: 'Column 1', isSortable: false },
    { id: 'col2', name: 'Column 2', isSortable: false },
    { id: 'col3', name: 'Column 3', isSortable: true, align: 'start' },
  ],
  tableState: {
    selection: {},
    sort: {
      columnId: 'col3',
      direction: 'ASC',
    },
    ordering: [
      { columnId: 'col1', isHidden: false },
      { columnId: 'col2', isHidden: false },
      { columnId: 'col3', isHidden: false },
    ],
  },
  actions: { onChangeOrdering: jest.fn() },
  hasResize: true,
};

describe('TableHead', () => {
  test('columns should render', () => {
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(3);
  });

  test('columns should render extra column for multi select', () => {
    const myProps = {
      ...commonTableHeadProps,
      options: {
        hasRowExpansion: true,
        hasRowSelection: 'multi',
      },
    };
    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(4);
  });

  test('hasRowActions flag creates empty TableHeader', () => {
    const myProps = {
      ...commonTableHeadProps,
      options: {
        hasRowActions: true,
      },
    };
    const wrapper = mount(<TableHead {...myProps} />);
    const emptyTableHeader = wrapper.find('TableHeader .bx--table-header-label').last();
    expect(emptyTableHeader).toEqual({});
  });

  test('make sure data-column is set for width', () => {
    const myProps = { ...commonTableHeadProps };
    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find('th[data-column="col1"]');
    expect(tableHeaders).toHaveLength(1);
  });

  test('activeBar set to "filter" shows FilterHeaderRow', () => {
    const myProps = { ...commonTableHeadProps, tableState: { ...commonTableHeadProps.tableState } };
    myProps.tableState.activeBar = 'filter';
    let wrapper = mount(<TableHead {...myProps} />);
    expect(wrapper.exists('FilterHeaderRow')).toBeTruthy();

    delete myProps.tableState.activeBar;
    wrapper = mount(<TableHead {...myProps} />);
    expect(wrapper.exists('FilterHeaderRow')).toBeFalsy();
  });

  test('activeBar set to "column" shows ColumnHeaderRow', () => {
    const myProps = { ...commonTableHeadProps, tableState: { ...commonTableHeadProps.tableState } };
    myProps.tableState.activeBar = 'column';
    const wrapper = mount(<TableHead {...myProps} />);
    expect(wrapper.exists('ColumnHeaderRow')).toBeTruthy();
  });

  test('check has resize if has resize is true ', () => {
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find('div.column-resize-handle');
    expect(tableHeaders).toHaveLength(2);
  });

  test('check not resize if has resize is false ', () => {
    const myProps = { ...commonTableHeadProps, hasResize: false };
    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find('div.column-resize-handle');
    expect(tableHeaders).toHaveLength(0);
  });

  test('check hidden item is not shown ', () => {
    const myProps = {
      ...commonTableHeadProps,
      tableState: {
        ...commonTableHeadProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: false },
          { columnId: 'col2', isHidden: false },
          { columnId: 'col3', isHidden: true },
        ],
      },
      hasResize: false,
    };

    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(2);
  });

  describe('TableHead resize columns', () => {
    // Note that JSDOM always returns default 0 for the values of getBoundingClientRect
    // which means that we should find a better way of testing the column resize functionality.
    // The inital with is here retrieved by using the headerWidth prop to use during the effects.
    test('drag outside bounds shows invalid (LTR)', () => {
      const myProps = {
        ...commonTableHeadProps,
        headerWidth: 120,
        hasResize: true,
      };
      const wrapper = mount(<TableHead {...myProps} />);
      const resizer = wrapper.find('#resize-col1');
      const resizerNode = resizer.getDOMNode();

      Simulate.click(resizerNode);

      expect(resizerNode.classList.contains('column-resize-handle')).toBe(true);
      expect(resizerNode.classList.contains('column-resize-handle--invalid')).toBe(false);

      act(() => {
        simulateMovementWithoutMouseUp(resizer, 0, 0, 900, 0);
        simulateMovementWithoutMouseUp(resizer, 100, 0, 30, 0);
      });
      expect(resizerNode.classList.contains('column-resize-handle--invalid')).toBe(true);
    });

    test('drag and drop outside bounds removes invalid (LTR)', () => {
      const myProps = {
        ...commonTableHeadProps,
        headerWidth: 120,
        hasResize: true,
      };
      const wrapper = mount(<TableHead {...myProps} />);
      const resizer = wrapper.find('#resize-col1');
      const resizerNode = resizer.getDOMNode();
      expect(resizerNode.classList.contains('column-resize-handle')).toBe(true);
      expect(resizerNode.classList.contains('column-resize-handle--invalid')).toBe(false);
      act(() => {
        simulateMovementWithMouseUp(resizer, 0, 0, 900, 0);
      });
      expect(resizerNode.classList.contains('column-resize-handle--invalid')).toBe(false);
    });

    test('drag outside bounds shows invalid RTL', () => {
      document.dir = 'rtl';
      const myProps = {
        ...commonTableHeadProps,
        headerWidth: 120,
        hasResize: true,
      };
      const wrapper = mount(<TableHead {...myProps} />);
      const resizer = wrapper.find('#resize-col1');
      const resizerNode = resizer.getDOMNode();
      expect(resizerNode.classList.contains('column-resize-handle')).toBe(true);
      expect(resizerNode.classList.contains('column-resize-handle--invalid')).toBe(false);
      act(() => {
        simulateMovementWithoutMouseUp(resizer, 0, 0, 900, 0);
      });
      expect(resizerNode.classList.contains('column-resize-handle--invalid')).toBe(true);
    });

    test('drag valid LTR shows as valid', () => {
      const myProps = {
        ...commonTableHeadProps,
        headerWidth: 120,
        hasResize: true,
      };
      const wrapper = mount(<TableHead {...myProps} />);
      const resizer = wrapper.find('#resize-col1');
      const resizerNode = resizer.getDOMNode();
      expect(resizerNode.classList.contains('column-resize-handle')).toBe(true);
      expect(resizerNode.classList.contains('column-resize-handle--invalid')).toBe(false);
      act(() => {
        simulateMovementWithoutMouseUp(resizer, 30, 0, 50, 0);
      });
      expect(resizerNode.classList.contains('column-resize-handle--invalid')).toBe(false);
    });

    test('drag valid RTL shows as valid', () => {
      document.dir = 'rtl';
      const myProps = {
        ...commonTableHeadProps,
        headerWidth: 120,
        hasResize: true,
      };
      const wrapper = mount(<TableHead {...myProps} />);
      const resizer = wrapper.find('#resize-col1');
      const resizerNode = resizer.getDOMNode();
      expect(resizerNode.classList.contains('column-resize-handle')).toBe(true);
      expect(resizerNode.classList.contains('column-resize-handle--invalid')).toBe(false);
      act(() => {
        simulateMovementWithoutMouseUp(resizer, 0, 0, 900, 0);
        simulateMovementWithoutMouseUp(resizer, 50, 0, 30, 0);
      });
      expect(resizerNode.classList.contains('column-resize-handle--invalid')).toBe(false);
    });
  });
});
