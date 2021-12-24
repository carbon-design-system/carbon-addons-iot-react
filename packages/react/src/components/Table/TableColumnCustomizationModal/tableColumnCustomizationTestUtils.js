export const getColumns = () => [
  {
    id: 'string',
    name: 'String',
  },
  {
    id: 'date',
    name: 'Date',
  },
  {
    id: 'select',
    name: 'Select',
  },
  {
    id: 'secretField',
    name: 'Secret Information',
  },
  {
    id: 'status',
    name: 'Status',
  },
  {
    id: 'number',
    name: 'Number',
  },
  {
    id: 'boolean',
    name: 'Boolean',
  },
  {
    id: 'node',
    name: 'React Node',
  },
  {
    id: 'object',
    name: 'Object Id',
  },
];

export const generateColumns = (number) =>
  [...new Array(number)].map((item, index) => ({
    id: `${index + 1}`,
    name: `Item ${index + 1}`,
  }));

export const getCallbacks = () => ({
  onClose: jest.fn(),
  onChange: jest.fn(),
  onReset: jest.fn(),
  onSave: jest.fn(),
  onLoadMore: jest.fn(),
});

export const getDefaultProps = () => ({
  ...getCallbacks(),
  availableColumns: getColumns(),
  initialOrdering: [],
  open: true,
});
