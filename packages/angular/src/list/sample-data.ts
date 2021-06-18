export const simpleListItems = [
  { value: 'Canada', isSelectable: true },
  { value: 'Brazil', isSelectable: true },
  { value: 'Columbia', isSelectable: true },
  { value: 'United States of Ameria', isSelectable: true },
  { value: 'Uruguay', isSelectable: true },
  { value: 'Spain', isSelectable: true }
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
    items: [
      ...simpleListItems
    ]
  },
  {
    value: 'Category 1',
    isSelectable: true,
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
        expanded: true,
        items: [
          { value: 'Item 1', isSelectable: true },
          { value: 'Item 2', isSelectable: true },
          {
            value: 'Category 3',
            isSelectable: true,
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
