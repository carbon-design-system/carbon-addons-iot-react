import { AfterViewInit, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { AIListItem } from '../list-item/ai-list-item.class';
import { nestedListItems } from '../sample-data';

@Component({
  selector: 'app-hierarchy-list',
  template: `
    <ai-list
      [items]="items"
      selectionType="multi"
      title="Draggable, selectable, searchable items"
      [hasSearch]="true"
      (onSearch)="handleSearch($event)"
      [itemsDraggable]="true"
    >
    </ai-list>

    <ng-template #rowActions>
      <ibm-overflow-menu placement="bottom" [flip]="true">
        <ibm-overflow-menu-option>
          An example option that is really long to show what should be done to handle long text
        </ibm-overflow-menu-option>
        <ibm-overflow-menu-option>Option 2</ibm-overflow-menu-option>
        <li class="bx--overflow-menu-options__option">
          <button class="bx--overflow-menu-options__btn">A fully custom option</button>
        </li>
        <ibm-overflow-menu-option>Option 4</ibm-overflow-menu-option>
        <ibm-overflow-menu-option disabled="true" [divider]="true"
          >Disabled</ibm-overflow-menu-option
        >
        <ibm-overflow-menu-option type="danger">Danger option</ibm-overflow-menu-option>
      </ibm-overflow-menu>
    </ng-template>
    <ibm-placeholder></ibm-placeholder>
  `,
})
export class AppHierarchyList implements AfterViewInit {
  @ViewChild('rowActions') rowAction: TemplateRef<any>;

  items = nestedListItems;

  ngAfterViewInit() {
    this.addRowActionsToAllItems(this.items);

    this.items = this.items;
  }

  handleSearch(searchString: string) {
    const filteredList = this.searchForNestedItemValues(this.items, searchString);
    this.items = filteredList;
  }

  addRowActionsToAllItems(items: AIListItem[]) {
    items.forEach((item: AIListItem) => {
      if (item.hasChildren()) {
        this.addRowActionsToAllItems(item.items);
      }

      item.rowActions = this.rowAction;
    });
  }

  searchForNestedItemValues(items: AIListItem[], searchString: string) {
    return items.reduce((filteredItems: AIListItem[], item: AIListItem) => {
      if (item.hasChildren()) {
        // If the parent matches the search then add the parent and all children.
        if (item.value.toLowerCase().includes(searchString.toLowerCase())) {
          filteredItems.push(item);
        } else {
          // If its children did, we still need the item with only the search matching children.
          const matchingChildren = this.searchForNestedItemValues(item.items, searchString);
          if (matchingChildren.length > 0) {
            filteredItems.push(
              new AIListItem({
                ...item,
                expanded: true,
                items: matchingChildren,
              })
            );
          }
        }
      } else if (item.value.toLowerCase().includes(searchString.toLowerCase())) {
        filteredItems.push(item);
      } else if (
        item.secondaryValue &&
        item.secondaryValue.toLowerCase().includes(searchString.toLowerCase())
      ) {
        filteredItems.push(item);
      }

      return filteredItems;
    }, []);
  }
}
