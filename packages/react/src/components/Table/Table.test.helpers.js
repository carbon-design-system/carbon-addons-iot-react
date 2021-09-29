export const mockActions = {
  pagination: {
    onChangePage: jest.fn(),
  },
  toolbar: {
    onApplyFilter: jest.fn(),
    onToggleFilter: jest.fn(),
    onToggleColumnSelection: jest.fn(),
    onClearAllFilters: jest.fn(),
    onCancelBatchAction: jest.fn(),
    onApplyBatchAction: jest.fn(),
    onApplySearch: jest.fn(),
    onDownloadCSV: jest.fn(),
    onShowRowEdit: jest.fn(),
  },
  table: {
    onRowSelected: jest.fn(),
    onRowClicked: jest.fn(),
    onRowExpanded: jest.fn(),
    onSelectAll: jest.fn(),
    onChangeSort: jest.fn(),
    onApplyRowAction: jest.fn(),
    onEmptyStateAction: jest.fn(),
    onChangeOrdering: jest.fn(),
    onColumnResize: jest.fn(),
    onRowLoadMore: jest.fn(),
  },
};

export const getTableColumns = (selectData) => [
  {
    id: 'string',
    name: 'String',
    filter: { placeholderText: 'pick a string' },
    isSortable: true,
  },
  {
    id: 'node',
    name: 'React node',
    isSortable: true,
  },
  {
    id: 'date',
    name: 'Date',
    filter: { placeholderText: 'pick a date' },
  },
  {
    id: 'select',
    name: 'Select',
    filter: { placeholderText: 'pick an option', options: selectData },
  },
  {
    id: 'number',
    name: 'Number',
    filter: { placeholderText: 'pick a number' },
  },
];

const getNewRow = (idx, suffix = '') => ({
  id: `row-${idx}${suffix ? `_${suffix}` : ''}`,
  values: {
    string: `test string ${idx} ${suffix}`,
  },
});

export const getNestedRows = () => {
  return Array(3)
    .fill(0)
    .map((i, idx) => ({
      id: `row-${idx}`,
      values: {
        string: `row-${idx}`,
      },
      children:
        idx !== 1
          ? [getNewRow(idx, 'A', true), getNewRow(idx, 'B', true)]
          : idx === 1
          ? [
              getNewRow(idx, 'A', true),
              {
                ...getNewRow(idx, 'B'),
                hasLoadMore: true,
                children: [
                  getNewRow(idx, 'B-1', true),
                  {
                    ...getNewRow(idx, 'B-2'),
                    children: [getNewRow(idx, 'B-2-A', true), getNewRow(idx, 'B-2-B', true)],
                  },
                  getNewRow(idx, 'B-3', true),
                ],
              },
              getNewRow(idx, 'C', true),
              {
                ...getNewRow(idx, 'D', true),
                children: [
                  getNewRow(idx, 'D-1', true),
                  getNewRow(idx, 'D-2', true),
                  getNewRow(idx, 'D-3', true),
                ],
              },
            ]
          : undefined,
    }));
};

export const getNestedRowIds = () => [
  'row-0',
  'row-0_A',
  'row-0_B',
  'row-1',
  'row-1_A',
  'row-1_B',
  'row-1_B-1',
  'row-1_B-2',
  'row-1_B-2-A',
  'row-1_B-2-B',
  'row-1_B-3',
  'row-1_C',
  'row-1_D',
  'row-1_D-1',
  'row-1_D-2',
  'row-1_D-3',
  'row-2',
  'row-2_A',
  'row-2_B',
];
