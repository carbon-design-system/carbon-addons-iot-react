import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { settings } from '../../../constants/Settings';

import ColumnResize from './ColumnResize';
import TableHeader from './TableHeader';

const { iotPrefix } = settings;

describe('ColumnResize', () => {
  const resizeHandleWidth = 4;

  it('should handle resize of last column when expander column is present and preserveColumnWidths:false', () => {
    const testColumnId = 'lastCol';
    const testColumnWidth = 100;
    const resizeHandlePosition = testColumnWidth - resizeHandleWidth;
    jest
      .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
      .mockImplementation(() => resizeHandlePosition);
    const onResize = jest.fn();
    const ref = React.createRef(null);
    const forwardMouseEvent = (e) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    };
    render(
      <table>
        <thead>
          <tr>
            <TableHeader ref={ref} onMouseUp={forwardMouseEvent} onMouseMove={forwardMouseEvent}>
              <ColumnResize
                showExpanderColumn
                ref={ref}
                currentColumnWidths={{
                  firstCol: { width: 100, id: 'firstCol' },
                  lastCol: { width: testColumnWidth, id: testColumnId },
                }}
                columnId={testColumnId}
                ordering={[
                  { columnId: 'firstCol', isHidden: false },
                  { columnId: testColumnId, isHidden: false },
                ]}
                onResize={onResize}
                paddingExtra={0}
                preserveColumnWidths={false}
              />
            </TableHeader>
          </tr>
        </thead>
      </table>
    );

    const handle = screen.getByRole('button', { name: 'Resize column' });

    fireEvent.mouseDown(handle, {
      clientX: 0,
    });
    fireEvent.mouseMove(handle, {
      clientX: 50,
    });
    fireEvent.mouseUp(handle);
    expect(onResize).toHaveBeenCalledWith([
      {
        id: testColumnId,
        width: 150,
      },
    ]);
    jest.clearAllMocks();
  });

  it('should handle resize of last column when expander column is present and preserveColumnWidths:true', () => {
    const testColumnId = 'lastCol';
    const testColumnWidth = 100;
    const resizeHandlePosition = testColumnWidth - resizeHandleWidth;
    jest
      .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
      .mockImplementation(() => resizeHandlePosition);
    const onResize = jest.fn();
    const ref = React.createRef(null);
    const forwardMouseEvent = (e) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    };
    render(
      <table>
        <thead>
          <tr>
            <TableHeader ref={ref} onMouseUp={forwardMouseEvent} onMouseMove={forwardMouseEvent}>
              <ColumnResize
                showExpanderColumn
                ref={ref}
                currentColumnWidths={{
                  firstCol: { width: 100, id: 'firstCol' },
                  lastCol: { width: testColumnWidth, id: testColumnId },
                }}
                columnId={testColumnId}
                ordering={[
                  { columnId: 'firstCol', isHidden: false },
                  { columnId: testColumnId, isHidden: false },
                ]}
                onResize={onResize}
                paddingExtra={0}
                preserveColumnWidths
              />
            </TableHeader>
          </tr>
        </thead>
      </table>
    );

    const handle = screen.getByRole('button', { name: 'Resize column' });

    fireEvent.mouseDown(handle, {
      clientX: 0,
    });
    fireEvent.mouseMove(handle, {
      clientX: 50,
    });
    fireEvent.mouseUp(handle);
    expect(onResize).toHaveBeenCalledWith([
      {
        id: testColumnId,
        width: 150,
      },
    ]);
    jest.clearAllMocks();
  });

  it('should handle resize of last column when expander column is present in RTL and preserveColumnWidths:false', () => {
    const testColumnId = 'lastCol';
    const testColumnWidth = 100;
    const resizeHandlePosition = 0;
    const originalDir = document.dir;
    document.dir = 'rtl';
    jest
      .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
      .mockImplementation(() => resizeHandlePosition);
    const onResize = jest.fn();
    const ref = React.createRef(null);
    const forwardMouseEvent = (e) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    };
    render(
      <table>
        <thead>
          <tr>
            <TableHeader ref={ref} onMouseUp={forwardMouseEvent} onMouseMove={forwardMouseEvent}>
              <ColumnResize
                showExpanderColumn
                ref={ref}
                currentColumnWidths={{
                  firstCol: { width: 100, id: 'firstCol' },
                  lastCol: { width: testColumnWidth, id: testColumnId },
                }}
                columnId={testColumnId}
                ordering={[
                  { columnId: 'firstCol', isHidden: false },
                  { columnId: testColumnId, isHidden: false },
                ]}
                onResize={onResize}
                paddingExtra={0}
                preserveColumnWidths={false}
              />
            </TableHeader>
          </tr>
        </thead>
      </table>
    );

    const handle = screen.getByRole('button', { name: 'Resize column' });
    fireEvent.mouseDown(handle, {
      clientX: 0,
    });
    fireEvent.mouseMove(handle, {
      clientX: -50,
    });
    fireEvent.mouseUp(handle);
    expect(onResize).toHaveBeenCalledWith([
      {
        id: testColumnId,
        width: 150,
      },
    ]);
    jest.clearAllMocks();
    document.dir = originalDir;
  });

  it('should handle resize of last column when expander column is present in RTL and preserveColumnWidths:true', () => {
    const testColumnId = 'lastCol';
    const testColumnWidth = 100;
    const resizeHandlePosition = 0;
    const originalDir = document.dir;
    document.dir = 'rtl';
    jest
      .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
      .mockImplementation(() => resizeHandlePosition);
    const onResize = jest.fn();
    const ref = React.createRef(null);
    const forwardMouseEvent = (e) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    };
    render(
      <table>
        <thead>
          <tr>
            <TableHeader ref={ref} onMouseUp={forwardMouseEvent} onMouseMove={forwardMouseEvent}>
              <ColumnResize
                showExpanderColumn
                ref={ref}
                currentColumnWidths={{
                  firstCol: { width: 100, id: 'firstCol' },
                  lastCol: { width: testColumnWidth, id: testColumnId },
                }}
                columnId={testColumnId}
                ordering={[
                  { columnId: 'firstCol', isHidden: false },
                  { columnId: testColumnId, isHidden: false },
                ]}
                onResize={onResize}
                paddingExtra={0}
                preserveColumnWidths
              />
            </TableHeader>
          </tr>
        </thead>
      </table>
    );

    const handle = screen.getByRole('button', { name: 'Resize column' });
    fireEvent.mouseDown(handle, {
      clientX: 0,
    });
    fireEvent.mouseMove(handle, {
      clientX: -50,
    });
    fireEvent.mouseUp(handle);
    expect(onResize).toHaveBeenCalledWith([
      {
        id: testColumnId,
        width: 150,
      },
    ]);
    jest.clearAllMocks();
    document.dir = originalDir;
  });

  it('should handle resize column (that is not the last) when expander column is present and preserveColumnWidths:false', () => {
    const testColumnId = 'firstCol';
    const testColumnWidth = 200;
    const resizeHandlePosition = testColumnWidth - resizeHandleWidth;

    jest
      .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
      .mockImplementation(() => resizeHandlePosition);
    const onResize = jest.fn();
    const ref = React.createRef(null);
    const forwardMouseEvent = (e) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    };
    render(
      <table>
        <thead>
          <tr>
            <TableHeader ref={ref} onMouseUp={forwardMouseEvent} onMouseMove={forwardMouseEvent}>
              <ColumnResize
                showExpanderColumn
                ref={ref}
                currentColumnWidths={{
                  firstCol: { width: testColumnWidth, id: testColumnId },
                  lastCol: { width: 200, id: 'lastCol' },
                }}
                columnId={testColumnId}
                ordering={[
                  { columnId: testColumnId, isHidden: false },
                  { columnId: 'lastCol', isHidden: false },
                ]}
                onResize={onResize}
                paddingExtra={0}
                preserveColumnWidths={false}
              />
            </TableHeader>
          </tr>
        </thead>
      </table>
    );

    const handle = screen.getByRole('button', { name: 'Resize column' });
    fireEvent.mouseDown(handle, {
      clientX: 0,
    });
    fireEvent.mouseMove(handle, {
      clientX: 50,
    });
    fireEvent.mouseUp(handle);
    expect(onResize).toHaveBeenCalledWith([
      {
        id: testColumnId,
        width: 250,
      },
      {
        id: 'lastCol',
        width: 150,
      },
    ]);
    jest.clearAllMocks();
  });

  it('should handle resize column (that is not the last) when expander column is present and preserveColumnWidths:true', () => {
    const testColumnId = 'firstCol';
    const testColumnWidth = 200;
    const resizeHandlePosition = testColumnWidth - resizeHandleWidth;

    jest
      .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
      .mockImplementation(() => resizeHandlePosition);
    const onResize = jest.fn();
    const ref = React.createRef(null);
    const forwardMouseEvent = (e) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    };
    render(
      <table>
        <thead>
          <tr>
            <TableHeader ref={ref} onMouseUp={forwardMouseEvent} onMouseMove={forwardMouseEvent}>
              <ColumnResize
                showExpanderColumn
                ref={ref}
                currentColumnWidths={{
                  firstCol: { width: testColumnWidth, id: testColumnId },
                  lastCol: { width: 200, id: 'lastCol' },
                }}
                columnId={testColumnId}
                ordering={[
                  { columnId: testColumnId, isHidden: false },
                  { columnId: 'lastCol', isHidden: false },
                ]}
                onResize={onResize}
                paddingExtra={0}
                preserveColumnWidths
              />
            </TableHeader>
          </tr>
        </thead>
      </table>
    );

    const handle = screen.getByRole('button', { name: 'Resize column' });
    fireEvent.mouseDown(handle, {
      clientX: 0,
    });
    fireEvent.mouseMove(handle, {
      clientX: 50,
    });
    fireEvent.mouseUp(handle);
    expect(onResize).toHaveBeenCalledWith([
      {
        id: testColumnId,
        width: 250,
      },
    ]);
    jest.clearAllMocks();
  });

  it('should handle resize column (that is not the last) when expander column is present in RTL and preserveColumnWidths:false', () => {
    const testColumnId = 'firstCol';
    const testColumnWidth = 200;
    const resizeHandlePosition = 0;
    const originalDir = document.dir;
    document.dir = 'rtl';

    jest
      .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
      .mockImplementation(() => resizeHandlePosition);
    const onResize = jest.fn();
    const ref = React.createRef(null);
    const forwardMouseEvent = (e) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    };
    render(
      <table>
        <thead>
          <tr>
            <TableHeader ref={ref} onMouseUp={forwardMouseEvent} onMouseMove={forwardMouseEvent}>
              <ColumnResize
                showExpanderColumn
                ref={ref}
                currentColumnWidths={{
                  firstCol: { width: testColumnWidth, id: testColumnId },
                  lastCol: { width: 200, id: 'lastCol' },
                }}
                columnId={testColumnId}
                ordering={[
                  { columnId: testColumnId, isHidden: false },
                  { columnId: 'lastCol', isHidden: false },
                ]}
                onResize={onResize}
                paddingExtra={0}
                preserveColumnWidths={false}
              />
            </TableHeader>
          </tr>
        </thead>
      </table>
    );

    const handle = screen.getByRole('button', { name: 'Resize column' });
    fireEvent.mouseDown(handle, {
      clientX: 0,
    });
    fireEvent.mouseMove(handle, {
      clientX: -50,
    });
    fireEvent.mouseUp(handle);
    expect(onResize).toHaveBeenCalledWith([
      {
        id: testColumnId,
        width: 250,
      },
      {
        id: 'lastCol',
        width: 150,
      },
    ]);
    jest.clearAllMocks();
    document.dir = originalDir;
  });

  it('should handle resize column (that is not the last) when expander column is present in RTL and preserveColumnWidths:true', () => {
    const testColumnId = 'firstCol';
    const testColumnWidth = 200;
    const resizeHandlePosition = 0;
    const originalDir = document.dir;
    document.dir = 'rtl';

    jest
      .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
      .mockImplementation(() => resizeHandlePosition);
    const onResize = jest.fn();
    const ref = React.createRef(null);
    const forwardMouseEvent = (e) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    };
    render(
      <table>
        <thead>
          <tr>
            <TableHeader ref={ref} onMouseUp={forwardMouseEvent} onMouseMove={forwardMouseEvent}>
              <ColumnResize
                showExpanderColumn
                ref={ref}
                currentColumnWidths={{
                  firstCol: { width: testColumnWidth, id: testColumnId },
                  lastCol: { width: 200, id: 'lastCol' },
                }}
                columnId={testColumnId}
                ordering={[
                  { columnId: testColumnId, isHidden: false },
                  { columnId: 'lastCol', isHidden: false },
                ]}
                onResize={onResize}
                paddingExtra={0}
                preserveColumnWidths
              />
            </TableHeader>
          </tr>
        </thead>
      </table>
    );

    const handle = screen.getByRole('button', { name: 'Resize column' });
    fireEvent.mouseDown(handle, {
      clientX: 0,
    });
    fireEvent.mouseMove(handle, {
      clientX: -50,
    });
    fireEvent.mouseUp(handle);
    expect(onResize).toHaveBeenCalledWith([
      {
        id: testColumnId,
        width: 250,
      },
    ]);
    jest.clearAllMocks();
    document.dir = originalDir;
  });

  it('should set left position when resizing and within bounds and preserveColumnWidths:false', () => {
    jest.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(() => 96);
    const onResize = jest.fn();
    const ref = React.createRef(null);
    const forwardMouseEvent = (e) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    };
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeader ref={ref} onMouseUp={forwardMouseEvent} onMouseMove={forwardMouseEvent}>
              <ColumnResize
                showExpanderColumn={false}
                ref={ref}
                currentColumnWidths={{
                  test: { width: 100, id: 'test' },
                  'second-test': {
                    width: 100,
                    id: 'second-test',
                  },
                }}
                columnId="test"
                ordering={[
                  { columnId: 'test', isHidden: false },
                  { columnId: 'second-test', isHidden: false },
                ]}
                onResize={onResize}
                paddingExtra={4}
                preserveColumnWidths={false}
              />
            </TableHeader>
          </tr>
        </thead>
      </table>
    );

    const handle = container.querySelector(`.${iotPrefix}--column-resize-handle`);
    fireEvent.mouseDown(handle, {
      clientX: 0,
    });
    fireEvent.mouseMove(handle, {
      clientX: 10,
    });
    fireEvent.mouseMove(handle, {
      clientX: 20,
    });
    fireEvent.mouseMove(handle, {
      clientX: 30,
    });
    fireEvent.mouseUp(handle);
    expect(onResize).toHaveBeenCalledWith([
      {
        id: 'test',
        width: 130,
      },
      {
        id: 'second-test',
        width: 70,
      },
    ]);
    jest.clearAllMocks();
  });

  it('should set left position when resizing and within bounds and preserveColumnWidths:true', () => {
    jest.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(() => 96);
    const onResize = jest.fn();
    const ref = React.createRef(null);
    const forwardMouseEvent = (e) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    };
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeader ref={ref} onMouseUp={forwardMouseEvent} onMouseMove={forwardMouseEvent}>
              <ColumnResize
                showExpanderColumn={false}
                ref={ref}
                currentColumnWidths={{
                  test: { width: 100, id: 'test' },
                  'second-test': {
                    width: 100,
                    id: 'second-test',
                  },
                }}
                columnId="test"
                ordering={[
                  { columnId: 'test', isHidden: false },
                  { columnId: 'second-test', isHidden: false },
                ]}
                onResize={onResize}
                paddingExtra={4}
                preserveColumnWidths
              />
            </TableHeader>
          </tr>
        </thead>
      </table>
    );

    const handle = container.querySelector(`.${iotPrefix}--column-resize-handle`);
    fireEvent.mouseDown(handle, {
      clientX: 0,
    });
    fireEvent.mouseMove(handle, {
      clientX: 10,
    });
    fireEvent.mouseMove(handle, {
      clientX: 20,
    });
    fireEvent.mouseMove(handle, {
      clientX: 30,
    });
    fireEvent.mouseUp(handle);
    expect(onResize).toHaveBeenCalledWith([
      {
        id: 'test',
        width: 130,
      },
    ]);
    jest.clearAllMocks();
  });

  it('should resize properly in RTL and preserveColumnWidths:false', () => {
    jest.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(() => 0);
    const originalDir = document.dir;
    document.dir = 'rtl';
    const onResize = jest.fn();
    const ref = React.createRef(null);
    const forwardMouseEvent = (e) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    };
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeader ref={ref} onMouseUp={forwardMouseEvent} onMouseMove={forwardMouseEvent}>
              <ColumnResize
                showExpanderColumn={false}
                ref={ref}
                currentColumnWidths={{
                  test: { width: 100, id: 'test' },
                  'second-test': {
                    width: 100,
                    id: 'second-test',
                  },
                }}
                columnId="test"
                ordering={[
                  { columnId: 'test', isHidden: false },
                  { columnId: 'second-test', isHidden: false },
                ]}
                onResize={onResize}
                paddingExtra={4}
                preserveColumnWidths={false}
              />
            </TableHeader>
          </tr>
        </thead>
      </table>
    );

    const handle = container.querySelector(`.${iotPrefix}--column-resize-handle`);
    expect(handle).toHaveStyle({
      left: '0',
    });
    fireEvent.mouseDown(handle, {
      clientX: 0,
    });
    fireEvent.mouseMove(handle, {
      clientX: -10,
    });
    fireEvent.mouseMove(handle, {
      clientX: -20,
    });
    fireEvent.mouseMove(handle, {
      clientX: -30,
    });
    fireEvent.mouseUp(handle);
    expect(onResize).toHaveBeenCalledWith([
      {
        id: 'test',
        width: 130,
      },
      {
        id: 'second-test',
        width: 70,
      },
    ]);
    jest.clearAllMocks();
    document.dir = originalDir;
  });

  it('should resize properly in RTL and preserveColumnWidths:true', () => {
    jest.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(() => 0);
    const originalDir = document.dir;
    document.dir = 'rtl';
    const onResize = jest.fn();
    const ref = React.createRef(null);
    const forwardMouseEvent = (e) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    };
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeader ref={ref} onMouseUp={forwardMouseEvent} onMouseMove={forwardMouseEvent}>
              <ColumnResize
                showExpanderColumn={false}
                ref={ref}
                currentColumnWidths={{
                  test: { width: 100, id: 'test' },
                  'second-test': {
                    width: 100,
                    id: 'second-test',
                  },
                }}
                columnId="test"
                ordering={[
                  { columnId: 'test', isHidden: false },
                  { columnId: 'second-test', isHidden: false },
                ]}
                onResize={onResize}
                paddingExtra={4}
                preserveColumnWidths
              />
            </TableHeader>
          </tr>
        </thead>
      </table>
    );

    const handle = container.querySelector(`.${iotPrefix}--column-resize-handle`);
    expect(handle).toHaveStyle({
      left: '0',
    });
    fireEvent.mouseDown(handle, {
      clientX: 0,
    });
    fireEvent.mouseMove(handle, {
      clientX: -10,
    });
    fireEvent.mouseMove(handle, {
      clientX: -20,
    });
    fireEvent.mouseMove(handle, {
      clientX: -30,
    });
    fireEvent.mouseUp(handle);
    expect(onResize).toHaveBeenCalledWith([
      {
        id: 'test',
        width: 130,
      },
    ]);
    jest.clearAllMocks();
    document.dir = originalDir;
  });
});
