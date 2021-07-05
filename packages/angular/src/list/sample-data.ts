import { AIListItem } from './list-item/ai-list-item.class';

export const simpleListItems = [
  new AIListItem({ value: 'Canada', isSelectable: true }),
  new AIListItem({ value: 'Brazil', isSelectable: true }),
  new AIListItem({ value: 'Columbia', isSelectable: true }),
  new AIListItem({ value: 'United States of Ameria', isSelectable: true }),
  new AIListItem({ value: 'Uruguay', isSelectable: true }),
  new AIListItem({ value: 'Spain', isSelectable: true }),
];

export const nestedListItems = [
  new AIListItem({
    value: 'Countries',
    isSelectable: true,
    isDraggable: true,
    items: [
      new AIListItem({
        value: 'Canada',
        isSelectable: true,
        isDraggable: true,
        items: [
          new AIListItem({ value: 'Ontario', isSelectable: true, isDraggable: true }),
          new AIListItem({ value: 'British Colombia', isSelectable: true, isDraggable: true })
        ]
      }),
      new AIListItem({ value: 'Brazil', isSelectable: true, isDraggable: true }),
      new AIListItem({ value: 'Columbia', isSelectable: true, isDraggable: true }),
      new AIListItem({ value: 'United States of Ameria', isSelectable: true, isDraggable: true }),
      new AIListItem({ value: 'Uruguay', isSelectable: true, isDraggable: true }),
      new AIListItem({ value: 'Spain', isSelectable: true, isDraggable: true }),
    ]
  }),
  new AIListItem({ value: 'Clothing', isSelectable: true, isDraggable: true })
];
