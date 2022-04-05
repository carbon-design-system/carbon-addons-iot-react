import { ListBuilderItem } from './list-builder-item.class';

export const getSelectedItems = (items: ListBuilderItem[]) => {
  return items.reduce(
    (displayedItems: ListBuilderItem[], item: ListBuilderItem) =>
      item.added
        ? [
            ...displayedItems,
            {
              ...item,
              children:
                item.children && item.children.length > 0 ? getSelectedItems(item.children) : [],
            },
          ]
        : displayedItems,
    []
  );
};
