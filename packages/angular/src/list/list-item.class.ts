export class ListItem {
  /**
   * Variable used for creating unique ids for ListItems.
   */
  static listItemCount = 0;

  value: string;

  items: ListItem[];

  nestingLevel: number;

  id = `list-item-${ListItem.listItemCount}`;

  expanded = true;

  hidden = false;

  parentId: string;

  selected: boolean;

  indeterminate: boolean;

  constructor(rawData?: any) {
    ListItem.listItemCount++;

    const defaults = {
      value: '',
      nestingLevel: 0,
      expanded: false,
      items: [],
    };

    const data = Object.assign({}, defaults, rawData);
    for (const property of Object.getOwnPropertyNames(data)) {
      if (data.hasOwnProperty(property)) {
        this[property] = data[property];
      }
    }
  }
}
