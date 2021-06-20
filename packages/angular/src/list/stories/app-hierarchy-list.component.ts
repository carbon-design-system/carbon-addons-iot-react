import { Component, Input, OnInit } from '@angular/core';
import { AIListModel } from '../ai-list-model.class';
import { AIListItem } from '../list-item/ai-list-item.interface';

const items = [
  {
    value: 'Countries',
    isSelectable: true,
    id: 'countries',
    isCategory: true,
    draggable: true,
    items: [
      { value: 'Canada', isSelectable: true, draggable: true },
      { value: 'Brazil', isSelectable: true, draggable: true },
      { value: 'Columbia', isSelectable: true, draggable: true },
      { value: 'United States of Ameria', isSelectable: true, draggable: true },
      { value: 'Uruguay', isSelectable: true, draggable: true },
      { value: 'Spain', isSelectable: true, draggable: true }
    ]
  },
  {
    value: 'Category 1',
    isSelectable: true,
    id: 'category-1',
    isCategory: true,
    draggable: true,
    items: [
      { value: 'Item 1', isSelectable: true, draggable: true },
      { value: 'Item 2', isSelectable: true, draggable: true },
      { value: 'Item 3', isSelectable: true, draggable: true },
      { value: 'Item 4', isSelectable: true, draggable: true },
      { value: 'Item 5', isSelectable: true, draggable: true },
      {
        value: 'Category 2',
        isSelectable: true,
        draggable: true,
        isCategory: true,
        id: 'category-2',
        items: [
          { value: 'Item 1', isSelectable: true, draggable: true  },
          { value: 'Item 2', isSelectable: true, draggable: true  },
          {
            value: 'Category 3',
            isSelectable: true,
            draggable: true,
            id: 'category-3',
            isCategory: true,
            items: [
              { value: 'Item 1', isSelectable: true, draggable: true  },
              { value: 'Item 2', id: 'item-2', isSelectable: true, draggable: true  },
              { value: 'Item 3', isSelectable: true, draggable: true  },
              { value: 'Item 4', isSelectable: true, draggable: true  },
              { value: 'Item 5', isSelectable: true, draggable: true  }
            ]
          },
          { value: 'Item 4', isSelectable: true, draggable: true  },
          { value: 'Item 5', isSelectable: true, draggable: true  }
        ]
      }
    ]
  },
  { value: 'Not-so-random data 1', isSelectable: true, draggable: true  },
  { value: 'Not-so-random data 2', isSelectable: true, draggable: true  },
  { value: 'Not-so-random data 3', isSelectable: true, draggable: true  }
];

@Component({
  selector: 'app-hierarchy-list',
  template: `
    <ai-list
      [model]="model"
      [itemsDraggable]="true"
      selectionType="multi"
      title="Draggable, selectable, searchable items"
      [hasSearch]="true"
      (onSearch)="handleSearch($event)"
    >
    </ai-list>
  `,
})
export class AppHierarchyList implements OnInit {
  @Input() model: AIListModel = new AIListModel();

  ngOnInit() {
    this.model.items = items;
  }

  handleSearch(searchString: string) {
    const filteredList = this.searchForNestedItemValues(items, searchString);
    this.model.items = filteredList;
    this.expandItems(filteredList);
  }

  expandItems(items: AIListItem[]) {
    items.forEach((item: AIListItem) => {
      if (this.model.hasChildren(item)) {
        this.expandItems(item.items);
      }
      this.model.handleExpansion(item.id, true);
    });
  }

  searchForNestedItemValues(items: AIListItem[], searchString: string) {
    return items.reduce((filteredItems: AIListItem[], item: AIListItem) => {
      if (this.model.hasChildren(item)) {
        // If the parent matches the search then add the parent and all children.
        if (item.value.toLowerCase().includes(searchString.toLowerCase())) {
          filteredItems.push(item);
        } else {
          // If its children did, we still need the item with only the search matching children.
          const matchingChildren = this.searchForNestedItemValues(item.items, searchString);
          if (matchingChildren.length > 0) {
            filteredItems.push({
              ...item,
              expanded: true,
              items: matchingChildren,
            });
          }
        }
      } else if (item.value.toLowerCase().includes(searchString.toLowerCase())) {
        filteredItems.push(item);
      }

      return filteredItems;
    }, []);
  }
}
