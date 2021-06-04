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
  /**
   * to allow expansion of the Tab interface with propertys as needed
   */
  [property: string]: any;
}
