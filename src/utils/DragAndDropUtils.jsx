import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

export const DropLocation = {
  Above: 'above',
  Below: 'below',
  Nested: 'nested',
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
    cloneDeep(items)
      .filter(item => !draggedItems.find(dragged => dragged.id === item.id)) // filter out dragged items
      .forEach(item => {
        // Insert dragged items in before location
        if (!itemDropped && item.id === dropId && location === DropLocation.Above) {
          finalList = [...finalList, ...draggedItems];
          itemDropped = true;
        }

        let { children = [] } = items;

        // Insert dragged items in nested location
        if (!itemDropped && item.id === dropId && location === DropLocation.Nested) {
          itemDropped = true;

          console.log(
            `dropping in the nest: ${JSON.stringify(draggedItems)} ${JSON.stringify(children)}`
          );

          children = [
            ...draggedItems,
            ...updateList(children, draggedItems, dropId, location, itemDropped),
          ];

          console.log(`what a drag: ${JSON.stringify(draggedItems)} ${children}`);
        } else if (children === item.children) {
          children = updateList(children, draggedItems, dropId, location, itemDropped);
        }

        item.children = children; // eslint-disable-line no-param-reassign
        finalList.push(item);

        // Insert dragged items in after location
        if (!itemDropped && item.id === dropId && location === DropLocation.Below) {
          finalList = [...finalList, ...draggedItems];
        }
      });
  }

  return finalList;
};

export const moveItemsInList = (items, dragIds, dropId, target) => {
  // if (dragId === hoverId) {
  //   return false;
  // }

  console.log(
    `items before: ${JSON.stringify(items)} ${JSON.stringify(dragIds)} ${dropId} ${target}`
  );

  const draggedItems = searchDraggedItem(items, dragIds);

  // console.log(`dragged items: ${JSON.stringify(draggedItems)}`);

  const newList = updateList(items, draggedItems, dropId, target);

  console.log(`items after: ${JSON.stringify(newList)}`);

  return newList;
};
