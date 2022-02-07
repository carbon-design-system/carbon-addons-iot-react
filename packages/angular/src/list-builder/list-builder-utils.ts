import { AIListBuilderItem } from './list-builder-item.class';

export const getSelectedItems = (items: AIListBuilderItem[]) => {
  return items.reduce(
    (displayedItems: AIListBuilderItem[], item: AIListBuilderItem) =>
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
