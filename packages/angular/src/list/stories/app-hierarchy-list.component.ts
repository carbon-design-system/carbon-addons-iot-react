import { AfterViewInit, Component } from '@angular/core';
import { nestedDraggableListItems } from '../sample-data';

@Component({
  selector: 'app-hierarchy-list',
  template: `
    <ai-list
      [items]="displayedItems"
      selectionType="multi"
      title="Draggable, selectable, searchable items"
      [hasSearch]="true"
      [itemsDraggable]="true"
    >
    </ai-list>
  `,
})
export class AppHierarchyList implements AfterViewInit {
  items = nestedDraggableListItems;
  displayedItems = this.items;
}
