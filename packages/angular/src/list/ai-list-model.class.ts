import { AIListItem } from './list-item/ai-list-item.interface';

export enum SelectionType {
  SINGLE = 'single',
  MULTI = 'multi'
}

export class AIListModel {
  /**
   * This is used for the generation of unique list item ids.
   */
  protected static COUNT = 0;

  /**
   * Sets the items.
   *
   * Initializes the `nestingLevel`s, `id`s, and `parentId`s
   * of the given `AIListItem`s if they are not already set.
   *
   * Initializes `expandedIds` and `selectedIds` with the selected
   * and expanded given items.
   */
  set items(items: AIListItem[]) {
    this._items = this.initializeListItems(items, this.getAdjustedNestingLevel(items, 0), null);
    this.initializeListItems(this._items);
  }

  get items() {
    return this._items;
  }

  /**
   * Ids of list items which are expanded.
   */
  expandedIds: string[] = [];

  /**
   * Ids of list items which are selected.
   */
  selectedIds: string[] = [];

  /**
   * Ids of list items which have an indeterminate checkbox state.
   *
   * Only applies for multi-select type editing style.
   */
  indeterminateIds: string[] = [];

  protected _items: AIListItem[] = [];

  /**
   * This function initializes the `nestingLevel`s, `id`s, and `parentId`s
   * of the given list items.
   */
  initializeListItems(items: AIListItem[], currentNestingLevel = 0, parentIdOfCurrentLevel = null) {
    return items.map((item: AIListItem) => {
      const id = `List-item-${AIListModel.COUNT++}`;
      return {
        ...item,
        id: item.id ? item.id : id,
        nestingLevel: this.hasChildren(item) ? currentNestingLevel - 1 : currentNestingLevel,
        parentId: parentIdOfCurrentLevel,
        items: this.hasChildren(item)
          ? this.initializeListItems(
              item.items,
              this.getAdjustedNestingLevel(items, currentNestingLevel),
              item.id ? item.id : id
            )
          : []
      };
    });
  }

  /**
   * This initializes the state arrays `expandedIds`, and `selectedIds` based on its' current state and
   * the properties of the given list items.
   */
  initializeListStates(items: AIListItem[]) {
    // No duplicate ids.
    this.expandedIds = [...new Set([...this.expandedIds, ...this.getExpandedIdsFromListItems(items)])];
    this.selectedIds = [...new Set([...this.selectedIds, ...this.getSelectedIdsFromListItems(items)])];
  }

  /**
   * This expands the list item with the given `id` if `expand` is `true` and
   * shrinks the list item if `expand` is false.
   */
  handleExpansion(id: string, expand: boolean) {
    const indexOfId = this.expandedIds.indexOf(id);
    if (expand && indexOfId < 0) {
      this.expandedIds.push(id);
    } else if (!expand && indexOfId > -1) {
      this.expandedIds.splice(indexOfId, 1);
    }
  }

  /**
   * This adds the given `newItem` to `items` as a child of `parentId`
   * at the `index` relative to the child list of `parentId`.
   * It will be added as a top level item if `parentId` null.
   */
  addItem(newItem: AIListItem, parentId: string, index = 0) {
    this.items = this.insertItem(this._items, newItem, parentId, index);
  }

  /**
   * This will remove the list item with the given `id`.
   */
  removeItem(id: string) {
    this.items = this.filterListItems(this._items, id);
  }

  /**
   * This returns the list item with the given `id`.
   */
  getItem(id: string) {
    for (let item of this._items) {
      const searchHit = this.searchListItem(item, id);
      if (searchHit !== null) {
        return searchHit;
      }
    }
    return null;
  }

  /**
   * This searches through the given list item and its' children returning
   * the item with the given `id` or `null` if that item doesn;t exist.
   */
  searchListItem(item: AIListItem, id: string) {
    if (item.id === id) {
      return item;
    } else if (this.hasChildren(item)) {
      let result = null;
      for (let i = 0; result === null && i < item.items.length; i++) {
          result = this.searchListItem(item.items[i], id);
      }
      return result;
    }
    return null;
  }

  /**
   * This gets all the parent ids of the list item with the given `id`.
   */
  getParentIds(id: string) {
    return this.getAllParentIds(this._items, id);
  }

  /**
   * This returns an array of list item `id`s from the given `items` which have
   * `expanded` set to `true`.
   */
  getExpandedIdsFromListItems(items: AIListItem[]) {
    return items.reduce((expandedIds: string[], item: AIListItem) => {
      if (item.expanded) {
        expandedIds.push(item.id);
      }

      if (this.hasChildren(item)) {
        expandedIds.push(...this.getExpandedIdsFromListItems(item.items));
      }

      return expandedIds;
    }, []);
  }

  /**
   * This returns an array of list item `id`s from the given `items` which have
   * `selected` set to `true`.
   */
  getSelectedIdsFromListItems(items: AIListItem[]) {
    return items.reduce((selectedIds: string[], item: AIListItem) => {
      if (item.selected) {
        selectedIds.push(item.id);
      }

      if (this.hasChildren(item)) {
        selectedIds.push(...this.getSelectedIdsFromListItems(item.items));
      }

      return selectedIds;
    }, []);
  }

  /**
   * This returns `true` if the list item with the given `id` is expanded.
   */
  isItemExpanded(id: string) {
    return this.expandedIds.includes(id);
  }

  /**
   * This returns `true` if the list item with the given `id` is selected.
   */
  isItemSelected(id: string) {
    return this.selectedIds.includes(id);
  }

  /**
   * This returns `true` if the list item with the given `id` is indeterminate.
   */
  isItemIndeterminate(id: string) {
    return this.indeterminateIds.includes(id);
  }

  /**
   * This returns `true` if the list item with the given `id` has child list items.
   */
  hasChildren(item: AIListItem) {
    return item.items && item.items.length > 0;
  }

  /**
   * @param id List item with the given `id` to handle select.
   * @param selected `true` the item with the given `id` should be selected, `false` if it should be deselected.
   * @param selectionType `multi` select or `single` select editing style.
   */
  handleSelect(id: string, selected: boolean, selectionType: SelectionType = SelectionType.SINGLE) {
    if (selectionType === SelectionType.SINGLE) {
      this.selectedIds = [id];
    } else if (selectionType === SelectionType.MULTI) {
      this.updateAllChildrenSelectedIds(this._items, id, selected);
      this.updateAllParentsSelectedStates(this._items);
    }
  }

  /**
   * This function updates the `selectedIds` array, adding the `id`s of the children of the list item with the initially given
   * `selectedItemId`, (and their children, (and their children (and.. you get the point))) if `selected` is
   * `true` and removes them if `selected` is `false`.
   *
   * @param items List items.
   * @param selectedItemId The `id` of the list item which is being selected or deselected.
   * @param selected `true` the item with the given `selectedItemId` should be selected, `false` if it should be deselected.
   */
  protected updateAllChildrenSelectedIds(items: AIListItem[], selectedItemId: string, selected: boolean) {
    items.forEach((item: AIListItem) => {
      if (item.isSelectable && (item.parentId === selectedItemId || item.id === selectedItemId)) {
        // All children of the item must have the same selected value as its' parent.
        this.updateListStateArray(this.selectedIds, item.id, selected);
        if (this.hasChildren(item)) {
          // The children of the children must also be updated to their parent's selected value.
          this.updateAllChildrenSelectedIds(item.items, item.id, selected);
          return;
        }
      }
      if (this.hasChildren(item)) {
        this.updateAllChildrenSelectedIds(item.items, selectedItemId, selected);
        return;
      }
    });
  }

  /**
   * This function looks through the given `items` and updates the `selectedIds` array and `indeterminateIds` array
   * based on the selected states of all item's children as follows:
   *
   * If an item has children which are all selected, select that item and make sure it isn't in
   * an indeterminate state.
   *
   * If an item has children where some of them are selected but not all of them, make that item indeterminate
   * and make sure it isn't selected.
   *
   * If an item has children where none of them are selected, make sure that item isn't selected or in an
   * indeterminate state.
   */
  protected updateAllParentsSelectedStates(items: AIListItem[]) {
    items.forEach((item: AIListItem) => {
      if (this.hasChildren(item)) {
        // We need to go bottom up in order to get the most up to date child selected states
        // since parent's selected state depends on its children's selected states as well.
        this.updateAllParentsSelectedStates(item.items);

        if (
          item.isSelectable
          && item.items.every((item: AIListItem) => item.isSelectable ? this.selectedIds.includes(item.id) : true)
        ) {
          this.updateListStateArray(this.selectedIds, item.id, true);
          this.updateListStateArray(this.indeterminateIds, item.id, false);
        } else if (
          item.isSelectable
          && item.items.some((item: AIListItem) => item.isSelectable ? this.selectedIds.includes(item.id) : false)
        ) {
          this.updateListStateArray(this.selectedIds, item.id, false);
          this.updateListStateArray(this.indeterminateIds, item.id, true);
        } else {
          this.updateListStateArray(this.selectedIds, item.id, false);
          this.updateListStateArray(this.indeterminateIds, item.id, false);
        }
      }
    });
  }

  /**
   * This gets all the parent ids of the list item with the given `id` in `items`.
   */
  protected getAllParentIds(items: AIListItem[], id: string) {
      return items.reduce((parentIds, item: AIListItem) => {
      if (item.id === id) {
        parentIds.push(item.id);
        parentIds.push(...this.getAllParentIds(this._items, item.parentId));
      } else if (this.hasChildren(item)) {
        parentIds.push(...this.getAllParentIds(item.items, id));
      }
      return parentIds;
    }, []);
  }

  /**
   * This returns new list items after adding the given `newItem` to `items`
   * as a child of `parentId` at the `index` relative to the child list of `parentId`.
   *
   * If `parentId` is null it will add `newItem` as a top level list item at the given `index`.
   *
   * For example:
   * If I have the following list items:
   *
   * [
   *  {
   *    value: 'item-1',
   *    id: 'item-1',
   *    items: [
   *      { value: 'item-2', id: 'item-2' },
   *      { value: 'item-3', id: 'item-3' }
   *    ]
   *  },
   *  { value: 'item-4', id: 'item-4' }
   * ]
   *
   * And I call insertItem(items, { value: 'TEST', 'TEST' }, 'item-1', 1), the list items returned is:
   *
   * [
   *  {
   *    value: 'item-1',
   *    id: 'item-1',
   *    items: [
   *      { value: 'item-2', id: 'item-2' },
   *      { value: 'TEST', 'TEST' },
   *      { value: 'item-3', id: 'item-3' }
   *    ]
   *  },
   *  { value: 'item-4', id: 'item-4' }
   * ]
   *
   * And insertItem(items, { value: 'TEST', 'TEST' }, null, 1), will return:
   *
   * [
   *  {
   *    value: 'item-1',
   *    id: 'item-1',
   *    items: [
   *      { value: 'item-2', id: 'item-2' },
   *      { value: 'item-3', id: 'item-3' }
   *    ]
   *  },
   *  { value: 'TEST', 'TEST' },
   *  { value: 'item-4', id: 'item-4' }
   * ]
   */
  protected insertItem(items: AIListItem[], newItem: AIListItem, parentId: string, index = 0) {
    const newItems = items.map((item: AIListItem) => {
      if (item.id === parentId) {
        item.items.splice(index, 0, newItem);
      }

      if (this.hasChildren(item)) {
        this.insertItem(item.items, newItem, parentId, index);
      }

      return item;
    });
    if (parentId === null) {
      newItems.splice(index, 0, newItem);
    }

    return newItems;
  }

  /**
   * This filters out the list item in `items` with the given `id`.
   */
  protected filterListItems(items: AIListItem[], id: string) {
    return items.filter((item: AIListItem) => {
      if (this.hasChildren (item)) {
        item.items = this.filterListItems(item.items, id);
      }
      return item.id !== id;
    });
  }

  /**
   * This function returns the adjusted `nestingLevel`s of an AIListItem.
   */
  protected getAdjustedNestingLevel(items: AIListItem[], currentDepth: number) {
    return items.some((item) => this.hasChildren(item)) ? currentDepth + 1 : currentDepth;
  }

  /**
   * Adds `item` to `array` if `item` doesn't already exist in `array` if `insert` is `true`.
   * Removes `item` from `array` if `insert` is `false`.
   */
  protected updateListStateArray(array: any[], item: any, insert = true) {
    if (insert) {
      if (!array.includes(item)) {
        array.push(item);
      }
    } else if (array.includes(item)) {
      array.splice(array.indexOf(item), 1);
    }
  }
}
