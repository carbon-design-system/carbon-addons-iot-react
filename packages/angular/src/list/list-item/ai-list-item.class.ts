import { EventEmitter, TemplateRef } from '@angular/core';

export class AIListItem {
  /**
   * Variable used for creating unique ids for ListItems.
   */
  static listItemCount = 0;

  /**
   * Unique identifier for the list item.
   */
  id?: string;

  /**
   * Id of the list item's direct parent.
   */
  parentId?: string;

  /**
   * Primary content to be displayed in the list item.
   */
  value?: string;

  /**
   * Indicates whether or not a list item's displayed value should be bolded.
   */
  isCategory?: boolean;

  /**
   * Secondary value to be displayed in the list item.
   */
  secondaryValue?: string;

  /**
   * This contains an optional row action that can be rendered in the list item.
   */
  rowActions?: TemplateRef<any>;

  /**
   * If the list item has child list items, this indicates whether or not it's
   * direct children are displayed.
   */
  expanded?: boolean;

  /**
   * Indicates whether or not the list item can be selected.
   */
  isSelectable?: boolean;

  /**
   * Indicates whether or not the item is selected.
   */
  selected?: boolean;

  indeterminate?: boolean;

  /**
   * Optional nested items.
   */
  items?: AIListItem[];

  /**
   * Indicates whether or not the item can be dragged into a different position.
   */
  isDraggable?: boolean;

  itemSelected = new EventEmitter();

  constructor(rawData?: any) {
    const defaults = {
      id: `list-item-${AIListItem.listItemCount++}`,
      value: '',
      expanded: false,
      isSelectable: false,
      indeterminate: false,
      selected: false,
      isDraggable: false,
      items: [],
    };

    const data = Object.assign({}, defaults, rawData);
    for (const property of Object.getOwnPropertyNames(data)) {
      if (data.hasOwnProperty(property)) {
        this[property] = data[property];
      }
    }
  }

  updateExpanded(expanded: boolean) {
    this.expanded = expanded;
  }

  updateSelected(selected: boolean) {
    this.selected = selected;
  }

  updateIndeterminate(indeterminate: boolean) {
    this.indeterminate = indeterminate;
  }

  addItem(listItem: AIListItem, index: number) {
    this.items.splice(index, 0, listItem);
  }

  removeItem(listItem: AIListItem) {
    const removeIndex = this.items.findIndex((item: AIListItem) => item.id === listItem.id);
    if (removeIndex >= 0) {
      this.items.splice(removeIndex, 1);
    }
  }

  hasItem(item: AIListItem) {
    if (item === undefined || item === null) {
      return false;
    }
    return this.hasItemAsChild(this.items, item);
  }

  hasChildren() {
    return this.items && this.items.length > 0;
  }

  someChildrenSelected() {
    return this.items.some((item: AIListItem) => (item.isSelectable ? item.selected : false));
  }

  allChildrenSelected() {
    return this.items.every((item: AIListItem) => (item.isSelectable ? item.selected : true));
  }

  protected hasItemAsChild(items: AIListItem[], item: AIListItem) {
    return items.reduce((hasItem: boolean, listItem: AIListItem) => {
      if (listItem.items && listItem.items.length > 0) {
        return hasItem || item.id === listItem.id || this.hasItemAsChild(listItem.items, item);
      }
      return hasItem || item.id === listItem.id;
    }, false);
  }
}
