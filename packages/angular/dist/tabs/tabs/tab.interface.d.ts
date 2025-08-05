/**
 *
 * @ai-apps/angular v2.155.1 | tab.interface.d.ts
 *
 * Copyright 2014, 2025 IBM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
