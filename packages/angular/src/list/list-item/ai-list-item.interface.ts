export interface AIListItem {
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

  rowActions?: any;

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
   * Indicates whther or not the item is selected.
   */
  selected?: boolean;

  /**
   * Optional nested items.
   */
  items?: AIListItem[];

  /**
   * Nesting level of the list item. Determines the amount of space the item will be indented
   * when rendered in the list.
   */
  nestingLevel?: number;

  /**
   * Indicates whether or not the item can be dragged into a different position.
   */
  draggable?: boolean;
}
