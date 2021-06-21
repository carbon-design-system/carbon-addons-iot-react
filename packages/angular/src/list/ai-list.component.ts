import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AIListModel, SelectionType } from './ai-list-model.class';
import { AIListItem } from './list-item/ai-list-item.interface';

@Component({
  selector: 'ai-list',
  template: `
    <div class="iot--list">
      <ai-list-header [hasSearch]="hasSearch" [title]="title" (onSearch)="onSearch.emit($event)">
      </ai-list-header>
      <div class="iot--list--content">
        <ng-template
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{ $implicit: model }"
        >
        </ng-template>
      </div>
    </div>

    <ng-template #listItemTemplateRef let-item let-index="index">
      <ng-container *ngIf="item.id && !isArray(item)">
        <ai-list-item-wrapper
          [draggable]="itemsDraggable && item.draggable"
          [isDragging]="isDragging"
          (dragStart)="handleDragStart(item)"
          (dragEnd)="handleDragEnd()"
          (itemDropped)="handleDrop(item, $event)"
        >
          <ai-list-item
            [value]="item.value"
            [nestingLevel]="item.nestingLevel"
            [hasChildren]="model.hasChildren(item)"
            [isSelectable]="item.isSelectable"
            [secondaryValue]="item.secondaryValue"
            [selectionType]="selectionType"
            [rowActions]="item.rowActions"
            [expanded]="model.isItemExpanded(item.id)"
            [selected]="model.isItemSelected(item.id)"
            [indeterminate]="model.isItemIndeterminate(item.id)"
            (expansionClick)="toggleExpansion(item.id)"
            [draggable]="itemsDraggable"
            [isCategory]="item.isCategory"
            (itemSelected)="
              model.handleSelect(item.id, !model.isItemSelected(item.id), selectionType)
            "
          >
          </ai-list-item>
        </ai-list-item-wrapper>
      </ng-container>

      <ng-container *ngIf="model.hasChildren(item)">
        <ng-template
          ngFor
          [ngForOf]="item.items"
          [ngForTemplate]="listItemTemplateRef"
        ></ng-template>
      </ng-container>

      <!-- Must be the top level of list items -->
      <ng-container *ngIf="isArray(item)">
        <ng-template ngFor [ngForOf]="item" [ngForTemplate]="listItemTemplateRef"></ng-template>
      </ng-container>
    </ng-template>
  `,
})
export class AIListComponent {
  @Input() model: AIListModel;

  @Input() selectionType: SelectionType;

  /**
   * Indicates whether or not items in the list are draggable.
   */
  @Input() itemsDraggable: boolean;

  /**
   * Indicates whether a search bar should be rendered in the list header.
   */
  @Input() hasSearch = false;

  /**
   * Title to be displayed on the list header.
   */
  @Input() title: string;

  /**
   * If a `hasSearch` is true, this is emitted when search value is changed.
   */
  @Output() onSearch = new EventEmitter<string>();

  /**
   * If `itemsDraggable` is `true`, this is set to whatever list item is
   * being dragged at any given moment.
   */
  draggedItem: AIListItem | undefined;

  /**
   * If `itemsDraggable` is `true`, this is set to `true` whenever a list
   * item is being dragged and set to `false` when no list items are currently
   * being dragged.
   */
  isDragging = false;

  handleDragStart(item: AIListItem | undefined) {
    this.isDragging = true;
    this.draggedItem = item;
  }

  handleDragEnd() {
    this.isDragging = false;
    this.draggedItem = undefined;
  }

  /**
   * @param dropLocation This is the list item where the `draggedItem` is dropped.
   * @param dropPosition The is the portion of `dropLocation` that `draggedItem` was dropped.
   */
  handleDrop(dropLocation: AIListItem, dropPosition: 'below' | 'above' | 'nested') {
    // Prevent dropping an item into itself, or into one of its' own children.
    if (!this.model.getParentIds(dropLocation.id).includes(this.draggedItem.id)) {
      this.model.removeItem(this.draggedItem.id);
      // Put the item as a child of the `dropLocation` list item.
      if (dropPosition === 'nested') {
        this.model.addItem(this.draggedItem, dropLocation.id, 0);
      } else {
        // This will be the index to insert the `draggedItem`, and will be based on
        // the index of the `dropLocation` within its' parent's child items.
        let relativeIndex = 0;
        // The insert location will be within a list item's child items.
        if (dropLocation.parentId !== null) {
          const dropLocationParentItem = this.model.getItem(dropLocation.parentId);
          // Index of the `dropLocation` within it's parent's child items.
          relativeIndex = dropLocationParentItem.items.findIndex(
            (item: AIListItem) => item.id === dropLocation.id
          );
          // Otherwise the insert location will be within the top level of the list items.
        } else {
          // Index of `dropLocation` within the top level of the list items.
          relativeIndex = this.model.items.findIndex(
            (item: AIListItem) => item.id === dropLocation.id
          );
        }
        this.model.addItem(
          this.draggedItem,
          dropLocation.parentId,
          relativeIndex + (dropPosition === 'below' ? 1 : 0)
        );
      }
    }

    this.isDragging = false;
    this.draggedItem = undefined;
  }

  toggleExpansion(id: string) {
    this.model.handleExpansion(id, !this.model.isItemExpanded(id));
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }
}
