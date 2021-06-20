export const simpleListItems = [
  { value: 'Canada', isSelectable: true },
  { value: 'Brazil', isSelectable: true },
  { value: 'Columbia', isSelectable: true },
  { value: 'United States of Ameria', isSelectable: true },
  { value: 'Uruguay', isSelectable: true },
  { value: 'Spain', isSelectable: true }
];

export const nestedListItems = [
  {
    value: 'Countries',
    id: 'countries',
    isCategory: true,
    draggable: true,
    items: [
      ...simpleListItems
    ]
  },
  {
    value: 'Category 1',
    id: 'category-1',
    isCategory: true,
    draggable: true,
    items: [
      { value: 'Item 1' },
      { value: 'Item 2' },
      { value: 'Item 3' },
      { value: 'Item 4' },
      { value: 'Item 5' },
      {
        value: 'Category 2',
        draggable: true,
        isCategory: true,
        id: 'category-2',
        items: [
          { value: 'Item 1' },
          { value: 'Item 2' },
          {
            value: 'Category 3',
            id: 'category-3',
            isCategory: true,
            items: [
              { value: 'Item 1' },
              { value: 'Item 2', id: 'item-2' },
              { value: 'Item 3' },
              { value: 'Item 4' },
              { value: 'Item 5' }
            ]
          },
          { value: 'Item 4' },
          { value: 'Item 5' }
        ]
      }
    ]
  },
  { value: 'Not-so-random data 1' },
  { value: 'Not-so-random data 2' },
  { value: 'Not-so-random data 3' }
];


export const singleSelectNestedListItems = [
  {
    value: 'Countries',
    expanded: true,
    items: [
      ...simpleListItems
    ]
  },
  {
    value: 'Category 1',
    expanded: true,
    items: [
      { value: 'Item 1', isSelectable: true },
      { value: 'Item 2', isSelectable: true },
      { value: 'Item 3', isSelectable: true },
      { value: 'Item 4', isSelectable: true },
      { value: 'Item 5', isSelectable: true },
      {
        value: 'Category 2',
        expanded: true,
        items: [
          { value: 'Item 1', isSelectable: true },
          { value: 'Item 2', isSelectable: true },
          {
            value: 'Category 3',
            expanded: true,
            items: [
              { value: 'Item 1', isSelectable: true },
              { value: 'Item 2', isSelectable: true },
              { value: 'Item 3', isSelectable: true },
              { value: 'Item 4', isSelectable: true },
              { value: 'Item 5', isSelectable: true }
            ]
          },
          { value: 'Item 4', isSelectable: true },
          { value: 'Item 5', isSelectable: true }
        ]
      }
    ]
  }
];

export const multiSelectNestedListItems = [
  {
    value: 'Countries',
    isSelectable: true,
    isCategory: true,
    items: [
      ...simpleListItems
    ]
  },
  {
    value: 'Category 1',
    id: 'category-1',
    isSelectable: true,
    isCategory: true,
    expanded: true,
    items: [
      { value: 'Item 1', isSelectable: true },
      { value: 'Item 2', isSelectable: true },
      { value: 'Item 3', isSelectable: true },
      { value: 'Item 4', isSelectable: true },
      { value: 'Item 5', isSelectable: true },
      {
        value: 'Category 2',
        isSelectable: true,
        isCategory: true,
        id: 'category-2',
        expanded: true,
        items: [
          { value: 'Item 1', isSelectable: true },
          { value: 'Item 2', isSelectable: true },
          {
            value: 'Category 3',
            id: 'category-3',
            isSelectable: true,
            isCategory: true,
            expanded: true,
            items: [
              { value: 'Item 1', isSelectable: true },
              { value: 'Item 2', isSelectable: true, id: 'item-2' },
              { value: 'Item 3', isSelectable: true },
              { value: 'Item 4', isSelectable: true },
              { value: 'Item 5', isSelectable: true }
            ]
          },
          { value: 'Item 4', isSelectable: true },
          { value: 'Item 5', isSelectable: true }
        ]
      }
    ]
  },
  { value: 'Not-so-random data 1', isSelectable: true },
  { value: 'Not-so-random data 2', isSelectable: true },
  { value: 'Not-so-random data 3', isSelectable: true }
];
