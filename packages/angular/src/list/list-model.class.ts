import { ListItem } from './list-item.class';

export class ListModel {
  set items(items: ListItem[]) {
    this._items = this.initListItems(items, this.adjustDepth(items, 0));
    this._displayedItems = this._items;
  }

  get items() {
    return this._displayedItems;
  }

  // This is needed to kickstart the recursive template generation.
  expanded = true;

  protected _displayedItems: ListItem[] = [];
  protected _items: ListItem[] = [];

  initListItems(items: ListItem[], depth = 0, parentId = null) {
    return items.map((item: ListItem) => ({
      ...item,
      nestingLevel: item.items && item.items.length ? depth - 1 : depth,
      parentId,
      items: item.items && item.items.length
        ? this.initListItems(item.items, this.adjustDepth(items, depth), item.id)
        : []
    }));
  }

  expandListItem(expansionId: string) {
    this._items = this.toggleListItem(this._items, expansionId);
    this._displayedItems = this._items;
  }

  selectListItem(selectedId: string, checked: boolean) {
    this._items = this.updateAllChildrenSelectedStates(this._items, selectedId, checked);
    this._items = this.updateAllParentsSelectedStates(this._items);
    this._displayedItems = this._items;
  }

  search(searchString: string) {
    this._displayedItems = this.searchForNestedItemValues(this._items, searchString);
  }

  protected adjustDepth(items: ListItem[], currentDepth: number) {
    return items.some((item) => this.itemContainsChildren(item)) ? currentDepth + 1 : currentDepth;
  }

  protected toggleListItem(items: ListItem[], expansionId: string) {
    return items.map((item: ListItem) => ({
      ...item,
      expanded: item.id === expansionId ? !item.expanded : item.expanded,
      items: item.items && item.items.length ? this.toggleListItem(item.items, expansionId) : []
    }));
  }

  // This sets all nested children `selected` values to the parent `selected` value.
  protected updateAllChildrenSelectedStates(items: ListItem[], parentId: string, selected: boolean) {
    return items.map((item: ListItem) => {
      if (item.parentId === parentId || item.id === parentId) {
        return {
          ...item,
          selected,
          items: this.itemContainsChildren(item)
            // Set selected state of all direct children of this item.
            ? this.updateAllChildrenSelectedStates(item.items, item.id, selected)
            : []
        };
      }

      return {
        ...item,
        items: this.itemContainsChildren(item)
          ? this.updateAllChildrenSelectedStates(item.items, parentId, selected)
          : []
      };
    });
  }

  // This updates the `selected` values of all `ListItems` based on all
  // their children's `selected` values.
  // For every `ListItem`:
  // set `selected` to `true` if all children are selected
  // set `indeterminate` to `true` if some but not all children are selected
  protected updateAllParentsSelectedStates(items: ListItem[]) {
    return items.map((item: ListItem) => {
      if (item.items && item.items.length) {
        // We need to go bottom up in order to get the most up to date child selected states
        // since parent's selected state depends on its children's selected states as well.
        this.updateAllParentsSelectedStates(item.items);

        if (item.items.every((item) => item.selected)) {
          item.indeterminate = false;
          item.selected = true;
        } else if (item.items.some((item) => item.selected)) {
          item.selected = false;
          item.indeterminate = true;
        } else {
          item.selected = false;
          item.indeterminate = false;
        }
      }

      return item;
    });
  }

  protected searchForNestedItemValues(items: ListItem[], searchString: string) {
    return items.reduce((filteredItems: ListItem[], item: ListItem) => {
      if (this.itemContainsChildren(item)) {
        // If the parent matches the search then add the parent and all children.
        if (item.value.toLowerCase().includes(searchString.toLowerCase())) {
          filteredItems.push(item);
        } else { // If its children did, we still need the item with only the search matching children.
          const matchingChildren = this.searchForNestedItemValues(item.items, searchString);
          if (matchingChildren.length > 0) {
            filteredItems.push({
              ...item,
              expanded: true,
              items: matchingChildren
            });
          }
        }
      } else if (item.value.toLowerCase().includes(searchString.toLowerCase())) {
        filteredItems.push(item);
      }

      return filteredItems;
    }, []);
  }

  protected itemContainsChildren(item: ListItem) {
    return item.items && item.items.length > 0;
  }
}
