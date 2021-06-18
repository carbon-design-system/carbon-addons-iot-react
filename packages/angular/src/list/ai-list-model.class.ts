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
    this._items = this.initializeListItems(items);
    this.expandedIds = [...this.expandedIds, ...this.getExpandedIdsFromListItems(this._items)];
    this.selectedIds = [...this.selectedIds, ...this.getSelectedIdsFromListItems(this._items)];
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
        parentId: item.parentId ? item.parentId : parentIdOfCurrentLevel,
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

  handleExpansion(id: string) {
    const indexOfId = this.expandedIds.indexOf(id);
    indexOfId === -1 ? this.expandedIds.push(id) : this.expandedIds.splice(indexOfId, 1);
  }

  handleSelect(id: string, selected: boolean, selectionType: SelectionType | undefined = SelectionType.SINGLE) {
    if (selectionType === SelectionType.SINGLE) {
      this.selectedIds = [id];
    } else if (selectionType === SelectionType.MULTI) {
      this.updateAllChildrenSelectedIds(this._items, id, selected);
      this.updateAllParentsSelectedStates(this._items);
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
    // Remove ids from the list state arrays after removing the item.
    this.updateListStateArray(this.expandedIds, id, false);
    this.updateListStateArray(this.selectedIds, id, false);
    this.updateListStateArray(this.indeterminateIds, id, false);
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

  protected updateAllChildrenSelectedIds(items: AIListItem[], selectedItemId: string, selected: boolean) {
    items.forEach((item: AIListItem) => {
      if ((item.parentId === selectedItemId || item.id === selectedItemId)) {
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

        if (item.items.every((item: AIListItem) => this.selectedIds.includes(item.id))) {
          this.updateListStateArray(this.selectedIds, item.id, true);
          this.updateListStateArray(this.indeterminateIds, item.id, false);
        } else if (item.items.some((item: AIListItem) => this.selectedIds.includes(item.id))) {
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
   * This adds the given `newItem` to `items` as a child of `parentId`
   * at the `index` relative to the child list of `parentId`.
   */
  protected insertItem(items: AIListItem[], newItem: AIListItem, parentId: string, index = 0) {
    return items.map((item: AIListItem) => {
      if (this.hasChildren(item)) {
        this.insertItem(item.items, newItem, parentId, index);
      }

      if (item.id === parentId) {
        item.items.splice(index, 0, newItem);
      }

      return item;
    });
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
