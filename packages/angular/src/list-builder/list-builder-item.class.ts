export class ListBuilderItem {
  addingMethod: 'row-action' | 'select' = 'row-action';
  hideUnselectedItemOnSelect = true;

  // Props for the list item in the unselected list.
  unselectedItemProps: any = {};
  added = false;

  // Props for the list item in the selected list.
  selectedItemProps: any = {};

  children: ListBuilderItem[] = [];

  constructor(rawData?: any) {
    Object.assign(this, {}, rawData);

    const defaultUnselectedItemProps = {
      hidden: this.hideUnselectedItemOnSelect && this.added,
    };
    const defaultSelectedItemProps = {
      hidden: !this.added,
    };

    Object.assign(this.unselectedItemProps, defaultUnselectedItemProps, this.unselectedItemProps);
    Object.assign(this.selectedItemProps, defaultSelectedItemProps, this.selectedItemProps);
  }
}
