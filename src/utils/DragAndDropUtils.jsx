import cloneDeep from 'lodash/cloneDeep';

export const DropLocation = {
  Above: 'above',
  Below: 'below',
  Nested: 'nested',
};

export const EditingStyle = {
  Single: 'single',
  Multiple: 'multiple',
  SingleNesting: 'single-nesting',
  MultipleNesting: 'multiple-nesting',
};

export const editingStyleIsMultiple = editingStyle => {
  return editingStyle === EditingStyle.MultipleNesting || editingStyle === EditingStyle.Multiple;
};

const searchDraggedItem = (items, ids) => {
  let draggedItems = [];

  cloneDeep(items).forEach(item => {
    if (ids.some(id => item.id === id)) {
      draggedItems.push(item);
    } else if (item.children) {
      draggedItems = [...draggedItems, ...searchDraggedItem(item.children, ids)];
    }
  });

  return draggedItems;
};

const updateList = (items, draggedItems, dropId, location, dropped = false) => {
  let finalList = [];
  let itemDropped = dropped; // Protects against dupe ids and multiple drops

  if (items) {
    cloneDeep(items).forEach(item => {
      // Insert dragged items in before location
      if (!itemDropped && item.id === dropId && location === DropLocation.Above) {
        finalList = [...finalList, ...draggedItems];
        itemDropped = true;
      }

      let { children = [] } = item;

      // Insert dragged items in nested location
      if (!itemDropped && location === DropLocation.Nested && dropId === item.id) {
        itemDropped = true;
        children = draggedItems.concat(
          updateList(children, draggedItems, dropId, location, itemDropped)
        );
      } else if (children?.length) {
        children = updateList(children, draggedItems, dropId, location, itemDropped);
      }

      // Add item into final list if it isn't a dragged item
      if (!draggedItems.find(drag => drag.id === item.id)) {
        item.children = children; // eslint-disable-line no-param-reassign
        finalList.push(item);
      }

      // Insert dragged items in after location
      if (!itemDropped && item.id === dropId && location === DropLocation.Below) {
        finalList = [...finalList, ...draggedItems];
      }
    });
  }

  return finalList;
};

export const moveItemsInList = (items, dragIds, dropId, target) => {
  const draggedItems = searchDraggedItem(items, dragIds);
  const newList = updateList(items, draggedItems, dropId, target);

  return newList;
};

const getAllChildIds = listItem => {
  let childIds = [];

  if (listItem.children) {
    listItem.children.forEach(child => {
      childIds.push(child.id);

      childIds = [...childIds, ...getAllChildIds(child)];
    });
  }

  return childIds;
};

export const handleEditModeSelect = (list, currentSelection, id, parentId) => {
  let newSelection = [];

  if (currentSelection.filter(editId => editId === id).length > 0) {
    newSelection = currentSelection.filter(selected => selected !== id && selected !== parentId);
  } else {
    list.forEach(editItem => {
      if (editItem.id === id) {
        newSelection.push(id);

        newSelection = [...newSelection, ...getAllChildIds(editItem)];
      }

      if (editItem.children) {
        newSelection = [
          ...newSelection,
          ...handleEditModeSelect(editItem.children, currentSelection, id, parentId),
        ];
      }

      if (currentSelection.some(selectionId => selectionId === editItem.id)) {
        newSelection.push(editItem.id);
      }
    });
  }

  return newSelection;
};
