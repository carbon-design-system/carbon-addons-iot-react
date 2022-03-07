import { ListItem } from 'carbon-components-angular';

export interface TabAction {
  title: string;
  icon?: string;
  onClick?: (tab: Tab) => void;
}

export interface Tab {
  /**
   * String title for the tab header and item in the tab dropdown
   */
  title: string;
  /**
   * Key unique to the TabController that contains this Tab,
   * used to identify and link the tab header and tab pane together,
   * and syncronize tab selection
   */
  key: string;
  /**
   * Optional value to indicate the selection status of the Tab
   */
  selected?: boolean;
  actions?: TabAction[];
  /**
   * (Optional) Additional props to be used when creating drop down list items
   * from the `Tab` items if `ai-tab-dropdown` is used.
   */
  dropdownListProps?: ListItem;
  /**
   * to allow expansion of the Tab interface with properties as needed
   */
  [property: string]: any;
}
