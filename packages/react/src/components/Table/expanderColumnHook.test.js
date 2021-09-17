import { renderHook } from '@testing-library/react-hooks';

import { useShowExpanderColumn } from './expanderColumnHook';

describe('Expander column hook', () => {
  const getColumns = () => [
    { id: 'col1', name: 'Column 1' },
    { id: 'col2', name: 'Column 2' },
    { id: 'col3', name: 'Column 3' },
  ];
  const getOrdering = () => [
    { columnId: 'col1', isHidden: false, width: '100px' },
    { columnId: 'col2', isHidden: false, width: '100px' },
    { columnId: 'col3', isHidden: false, width: '100px' },
  ];

  describe('in tables with resizable columns', () => {
    it('returns TRUE when visible columns have initial widths', () => {
      const { result } = renderHook(() =>
        useShowExpanderColumn({
          hasResize: true,
          useAutoTableLayoutForResize: false,
          ordering: getOrdering(),
          columns: getColumns(),
        })
      );
      expect(result.current).toBeTruthy();
    });

    it('always returns FALSE when table-layout is auto (useAutoTableLayoutForResize: true)', () => {
      const { result } = renderHook(() =>
        useShowExpanderColumn({
          hasResize: true,
          useAutoTableLayoutForResize: true,
          ordering: getOrdering(),
          columns: getColumns(),
        })
      );
      expect(result.current).toBeFalsy();
    });

    it('prevents the expander column for occupying space in the inital render if the columns have no initial width', () => {
      const { result } = renderHook(() =>
        useShowExpanderColumn({
          hasResize: true,
          useAutoTableLayoutForResize: false,
          ordering: getOrdering().map((col) =>
            // remove the widths prop
            ({ ...col, widths: undefined })
          ),
          columns: getColumns(),
        })
      );

      const initialRender = false;
      const finalRender = true;

      expect(result.all).toEqual([initialRender, true, finalRender]);
    });

    it('returns TRUE if only hidden columns are missing initial widths', () => {
      const { result } = renderHook(() =>
        useShowExpanderColumn({
          hasResize: true,
          useAutoTableLayoutForResize: false,
          ordering: getOrdering().map((col) =>
            col.id === 'col1'
              ? {
                  columnId: 'col1',
                  isHidden: true,
                }
              : col
          ),
          columns: getColumns(),
        })
      );
      expect(result.current).toBeTruthy();
    });

    it('returns TRUE with all hidden columns', () => {
      const { result } = renderHook(() =>
        useShowExpanderColumn({
          hasResize: true,
          useAutoTableLayoutForResize: false,
          ordering: getOrdering().map((col) => ({ ...col, isHidden: true })),
          columns: getColumns(),
        })
      );
      expect(result.current).toBeTruthy();
    });
  });
  describe('in tables without resizable columns', () => {
    it('always returns FALSE', () => {
      const { result } = renderHook(() =>
        useShowExpanderColumn({
          hasResize: false,
          useAutoTableLayoutForResize: false,
          ordering: getOrdering(),
          columns: getColumns(),
        })
      );
      expect(result.current).toBeFalsy();
    });
  });
});
