import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { settings } from '../../../constants/Settings';

import ColumnResize from './ColumnResize';
import TableHeader from './TableHeader';

const { iotPrefix } = settings;

describe('ColumnResize', () => {
  it('should set left position when resizing and within bounds', () => {
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

  it('should resize properly in RTL', () => {
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
});
