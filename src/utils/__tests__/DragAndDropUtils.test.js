import { DropLocation, moveItemsInList } from '../DragAndDropUtils';
import { getListItems } from '../../components/List/SimpleList/SimpleList.story';

const simpleListItems = getListItems(10);

describe('componentUtilityFunctions', () => {
  it('move first item under the second item', () => {
    const itemToMove = simpleListItems[0];

    const newList = moveItemsInList(
      simpleListItems,
      [itemToMove.id],
      simpleListItems[1].id,
      DropLocation.Below
    );

    expect(newList[1].id).toEqual(itemToMove.id);
  });

  it('move first item above the second item', () => {
    const itemToMove = simpleListItems[0];

    const newList = moveItemsInList(
      simpleListItems,
      [itemToMove.id],
      simpleListItems[1].id,
      DropLocation.Above
    );

    expect(newList[0].id).toEqual(itemToMove.id);
  });

  it('move first item nested in second item', () => {
    const itemToMove = simpleListItems[0];

    const newList = moveItemsInList(
      simpleListItems,
      [itemToMove.id],
      simpleListItems[1].id,
      DropLocation.Nested
    );

    expect(newList[0].children[0].id).toEqual(itemToMove.id);
  });

  it('multiple nesting', () => {
    const itemToMove = simpleListItems[0];

    let newList = moveItemsInList(
      simpleListItems,
      [itemToMove.id],
      simpleListItems[1].id,
      DropLocation.Nested
    );

    newList = moveItemsInList(newList, [newList[0].id], newList[1].id, DropLocation.Nested);
    newList = moveItemsInList(newList, [newList[0].id], newList[1].id, DropLocation.Nested);

    expect(newList[0].children[0].children[0].children[0].id).toEqual(itemToMove.id);
  });

  it('move multiple items to top of the list', () => {
    const itemsToMove = [
      simpleListItems[0].id,
      simpleListItems[3].id,
      simpleListItems[5].id,
      simpleListItems[9].id,
    ];

    const newList = moveItemsInList(
      simpleListItems,
      itemsToMove,
      itemsToMove[0],
      DropLocation.Above
    );

    expect(newList[0].id).toEqual(itemsToMove[0]);
    expect(newList[1].id).toEqual(itemsToMove[1]);
    expect(newList[2].id).toEqual(itemsToMove[2]);
    expect(newList[3].id).toEqual(itemsToMove[3]);
  });
});
