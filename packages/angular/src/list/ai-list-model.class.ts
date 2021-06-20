import { AIListItem } from './list-item/ai-list-item.interface';

export enum SelectionType {
  SINGLE = 'single',
  MULTI = 'multi'
}

export class AIListModel {
  /**
   * This is used for the generation of unique ids.
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
    // Initialize `nestingLevel`s, `id`s, and `parentId`s if they are not already set.
    this._items = this.initializeListItems(items, this.getAdjustedNestingLevel(items, 0), null);
    this.initializeListItems(this._items);
  }

  get items() {
    return this._items;
  }

  expandedIds: string[] = [];

  selectedIds: string[] = [];

  indeterminateIds: string[] = [];

  /**
   * This is needed to initiate the recursive rendering of list items.
   */
  id = 'list-model';

  protected _items: AIListItem[] = [];

  constructor() {
    // This is needed to initiate the recursive rendering of list items.
    this.expandedIds.push(this.id);
  }

  /**
   * This function initializes the `nestingLevel`s, as well as the `id`s, and `parentId`s
   * of the given `AIListItem`s if they are not already set.
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

  initializeListStates(items: AIListItem[]) {
    // No duplicate ids.
    this.expandedIds = [...new Set([...this.expandedIds, ...this.getExpandedIdsFromListItems(items)])];
    this.selectedIds = [...new Set([...this.selectedIds, ...this.getSelectedIdsFromListItems(items)])];
  }

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

  getItem(id: string) {
    for (let item of this._items) {
      const searchHit = this.searchListItem(item, id);
      if (searchHit !== null) {
        return searchHit;
      }
    }
    return null;
  }

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

  isItemExpanded(id: string) {
    return this.expandedIds.includes(id);
  }

  isItemSelected(id: string) {
    return this.selectedIds.includes(id);
  }

  isItemIndeterminate(id: string) {
    return this.indeterminateIds.includes(id);
  }

  hasChildren(item: AIListItem) {
    return item.items && item.items.length > 0;
  }

  handleSelect(id: string, selected: boolean, selectionType: SelectionType = SelectionType.SINGLE) {
    if (selectionType === SelectionType.SINGLE) {
      this.selectedIds = [id];
    } else if (selectionType === SelectionType.MULTI) {
      this.updateAllChildrenSelectedIds(this._items, id, selected);
      this.updateAllParentsSelectedStates(this._items);
    }
  }

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
   * This adds the given `newItem` to `items` as a child of `parentId`
   * at the `index` relative to the child list of `parentId`.
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

  /**
   * This function returns the adjusted `nestingLevel`s of an AIListItem.
   */
  protected getAdjustedNestingLevel(items: AIListItem[], currentDepth: number) {
    return items.some((item) => this.hasChildren(item)) ? currentDepth + 1 : currentDepth;
  }
}
