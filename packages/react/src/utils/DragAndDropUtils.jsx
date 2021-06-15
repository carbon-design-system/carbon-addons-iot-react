import React from 'react';

import { useDNDProviderElement } from '../hooks/useDNDProviderElement';

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

/**
 * Returns true if a passed in editing style is multiple rather than single
 * @param {EditingStyle} editingStyle current editing style
 */
export const editingStyleIsMultiple = (editingStyle) => {
  return editingStyle === EditingStyle.MultipleNesting || editingStyle === EditingStyle.Multiple;
};

/**
 * Returns a set of items that match the set of ids
 * @param {Array<ListItem>} items full set of items
 * @param {Array[string]} ids selected ids from the set of items
 */
const searchDraggedItem = (items, ids) => {
  let draggedItems = [];

  items.forEach((item) => {
    if (ids.some((id) => item.id === id)) {
      draggedItems.push(item);
    } else if (item.children) {
      draggedItems = [...draggedItems, ...searchDraggedItem(item.children, ids)];
    }
  });

  return draggedItems;
};

/**
 * Helper function that returns a new list with the dragged items moved to the specified location
 * @param {Array<ListItem>} items original list of ListItems
 * @param {Array<ListItem>} draggedItems items to be moved
 * @param {string} dropId the id of the drop location
 * @param {DropLocation} location Where the drop will occur, above or below the specified id or as the first child of the specified id
 * @param {boolean} dropped flag stating if the drop has already occured in case there are duplicate ids in the list
 */
const updateList = (items, draggedItems, dropId, location, dropped = false) => {
  let finalList = [];
  let itemDropped = dropped; // Protects against dupe ids and multiple drops

  if (items && !draggedItems[0]?.children?.some((x) => x.id === dropId)) {
    items.forEach((item) => {
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
      if (!draggedItems.find((drag) => drag.id === item.id)) {
        item.children = children; // eslint-disable-line no-param-reassign
        finalList.push(item);
      }

      // Insert dragged items in after location
      if (!itemDropped && item.id === dropId && location === DropLocation.Below) {
        finalList = [...finalList, ...draggedItems];
      }
    });
    return finalList;
  }

  return items;
};

/**
 * Returns a new list with the dragged items moved to the specified location
 * @param {Array<ListItem>} items original list of ListItems
 * @param {Array<ListItem>} draggedItems items to be moved
 * @param {string} dropId the id of the drop location
 * @param {DropLocation} location Where the drop will occur, above or below the specified id or as the first child of the specified id
 */
export const moveItemsInList = (items, dragIds, dropId, location) => {
  const draggedItems = searchDraggedItem(
    items,
    dragIds.filter((id) => id !== dropId)
  );

  return updateList(items, draggedItems, dropId, location);
};

/**
 * Returns every child id from the ListItem and their children's ids
 * @param {ListItem} listItem
 */
const getAllChildIds = (listItem) => {
  let childIds = [];

  if (listItem.children) {
    listItem.children.forEach((child) => {
      childIds.push(child.id);

      childIds = [...childIds, ...getAllChildIds(child)];
    });
  }

  return childIds;
};

/**
 * Handles adding and removing items to a list to determine which list items are selected or deselected
 * @param {Array<ListItem>} list original list of ListItems
 * @param {Array<string>} currentSelection current selection of ListItems as ids
 * @param {string} id the id of an item that has been selected or deselected
 * @param {string} parentId the parent id of the selected or deselected item - if unselected, the parent is also unselected
 */
export const handleEditModeSelect = (list, currentSelection, id, parentId) => {
  let newSelection = [];

  if (currentSelection.filter((editId) => editId === id).length > 0) {
    newSelection = currentSelection.filter((selected) => selected !== id && selected !== parentId);
  } else {
    list.forEach((editItem) => {
      if (editItem.id === id) {
        newSelection.push(id);

        newSelection = [...newSelection, ...getAllChildIds(editItem)];
      } else if (editItem.children) {
        newSelection = [
          ...newSelection,
          ...handleEditModeSelect(editItem.children, currentSelection, id, parentId),
        ];
      }

      if (currentSelection.some((selectionId) => selectionId === editItem.id)) {
        newSelection.push(editItem.id);
      }
    });
  }

  return newSelection;
};

export function DragAndDrop(props) {
  const DNDElement = useDNDProviderElement(props);
  return <React.Fragment>{DNDElement}</React.Fragment>;
}

/**
 * Allows the merging of multiple refs when a components needs to handle more than one,
 * e.g. when combining a map and a (drag and) drop target reference for the same element.
 * @param  {...any} refs Refs that should be merged are passed as separate parameters
 * @returns A function that will update the current property or call the ref function of all merged refs
 */
export const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  return !filteredRefs.length
    ? null
    : filteredRefs.length === 1
    ? filteredRefs[0]
    : (currentInstance) => {
        filteredRefs.forEach((ref) => {
          if (typeof ref === 'function') {
            ref(currentInstance);
          } else if (ref) {
            ref.current = currentInstance; // eslint-disable-line no-param-reassign
          }
        });
      };
};
