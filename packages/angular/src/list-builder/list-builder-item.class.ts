export class ListBuilderItem {
  addingMethod: 'row-action' | 'select' = 'row-action';
  hideUnselectedItemOnSelect = true;

  // Props for the list item in the unselected list.
  unselectedItemState: any = {};
  added = false;

  // Props for the list item in the selected list.
  selectedItemState: any = {};

  items: ListBuilderItem[] = [];

  constructor(rawData?: any) {
    Object.assign(this, {}, rawData);

    const defaultUnselectedItemState = {
      hidden: this.hideUnselectedItemOnSelect && this.added,
    };
    const defaultSelectedItemState = {
      hidden: !this.added,
    };

    Object.assign(this.unselectedItemState, defaultUnselectedItemState, this.unselectedItemState);
    Object.assign(this.selectedItemState, defaultSelectedItemState, this.selectedItemState);
  }

  hasChildren() {
    return this.items && this.items.length > 0;
  }

  /**
   * Allows for any other custom properties to be included in the ListItem
   */
  [x: string]: any;
}
