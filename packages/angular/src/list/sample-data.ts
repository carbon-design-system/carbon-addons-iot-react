export const simpleListItems = [
  { value: 'Canada', isSelectable: true },
  { value: 'Brazil', isSelectable: true },
  { value: 'Columbia', isSelectable: true },
  { value: 'United States of Ameria', isSelectable: true },
  { value: 'Uruguay', isSelectable: true },
  { value: 'Spain', isSelectable: true },
];

export const nestedListItems = [
  {
    value: 'Countries',
    isSelectable: true,
    id: 'countries',
    isCategory: true,
    draggable: true,
    items: [
      {
        value: 'Canada',
        secondaryValue: 'CA',
        isSelectable: true,
        draggable: true,
      },
      {
        value: 'Brazil',
        secondaryValue: 'BR',
        isSelectable: true,
        draggable: true,
      },
      {
        value: 'Columbia',
        secondaryValue: 'CO',
        isSelectable: true,
        draggable: true,
      },
      {
        value: 'United States of Ameria',
        secondaryValue: 'USA',
        isSelectable: true,
        draggable: true,
      },
      {
        value: 'Uruguay',
        secondaryValue: 'UY',
        isSelectable: true,
        draggable: true,
      },
      {
        value: 'Spain',
        secondaryValue: 'ESP',
        isSelectable: true,
        draggable: true,
      },
    ],
  },
  {
    value: 'Category 1',
    isSelectable: true,
    id: 'category-1',
    isCategory: true,
    draggable: true,
    items: [
      {
        value: 'Item 1',
        secondaryValue: 'C1',
        isSelectable: true,
        draggable: true,
      },
      {
        value: 'Item 2',
        isSelectable: true,
        secondaryValue: 'C1',
        draggable: true,
      },
      {
        value: 'Item 3',
        isSelectable: true,
        secondaryValue: 'C1',
        draggable: true,
      },
      {
        value: 'Item 4',
        secondaryValue: 'C1',
        isSelectable: true,
        draggable: true,
      },
      {
        value: 'Item 5',
        secondaryValue: 'C1',
        isSelectable: true,
        draggable: true,
      },
      {
        value: 'Category 2',
        secondaryValue: 'C1',
        isSelectable: true,
        draggable: true,
        isCategory: true,
        id: 'category-2',
        items: [
          {
            value: 'Item 1',
            secondaryValue: 'C2',
            isSelectable: true,
            draggable: true,
          },
          {
            value: 'Item 2',
            secondaryValue: 'C2',
            isSelectable: true,
            draggable: true,
          },
          {
            value: 'Category 3',
            isSelectable: true,
            draggable: true,
            id: 'category-3',
            isCategory: true,
            items: [
              {
                value: 'Item 1',
                secondaryValue: 'C3',
                isSelectable: true,
                draggable: true,
              },
              {
                value: 'Item 2',
                secondaryValue: 'C3',
                id: 'item-2',
                isSelectable: true,
                draggable: true,
              },
              {
                value: 'Item 3',
                secondaryValue: 'C3',
                isSelectable: true,
                draggable: true,
              },
              {
                value: 'Item 4',
                secondaryValue: 'C3',
                isSelectable: true,
                draggable: true,
              },
              {
                value: 'Item 5',
                secondaryValue: 'C3',
                isSelectable: true,
                draggable: true,
              },
            ],
          },
          {
            value: 'Item 4',
            secondaryValue: 'C2',
            isSelectable: true,
            draggable: true,
          },
          {
            value: 'Item 5',
            secondaryValue: 'C2',
            isSelectable: true,
            draggable: true,
          },
        ],
      },
    ],
  },
  {
    value: 'Not-so-random data 1',
    isSelectable: true,
    draggable: true,
  },
  {
    value: 'Not-so-random data 2',
    isSelectable: true,
    draggable: true,
  },
  {
    value: 'Not-so-random data 3',
    isSelectable: true,
    draggable: true,
  },
];

export const singleSelectNestedListItems = [
  {
    value: 'Countries',
    expanded: true,
    items: [...simpleListItems],
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
              { value: 'Item 5', isSelectable: true },
            ],
          },
          { value: 'Item 4', isSelectable: true },
          { value: 'Item 5', isSelectable: true },
        ],
      },
    ],
  },
];

export const multiSelectNestedListItems = [
  {
    value: 'Countries',
    isSelectable: true,
    isCategory: true,
    items: [...simpleListItems],
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
              { value: 'Item 5', isSelectable: true },
            ],
          },
          { value: 'Item 4', isSelectable: true },
          { value: 'Item 5', isSelectable: true },
        ],
      },
    ],
  },
  { value: 'Not-so-random data 1', isSelectable: true },
  { value: 'Not-so-random data 2', isSelectable: true },
  { value: 'Not-so-random data 3', isSelectable: true },
];
