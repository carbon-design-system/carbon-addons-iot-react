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
      <ng-container *ngIf="item.value">
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
            (itemSelected)="model.handleSelect(item.id, !model.isItemSelected(item.id), selectionType)"
          >
          </ai-list-item>
        </ai-list-item-wrapper>
      </ng-container>
      <ng-container *ngIf="model.hasChildren(item) && model.isItemExpanded(item.id)">
        <ng-template ngFor [ngForOf]="item.items" [ngForTemplate]="listItemTemplateRef">
        </ng-template>
      </ng-container>
    </ng-template>
  `,
})

export class AIListComponent {
  @Input() model: AIListModel;

  @Input() selectionType: SelectionType;

  @Input() itemsDraggable: boolean;

  @Input() hasSearch = false;

  @Input() title: string;

  @Output() onSearch = new EventEmitter<string>();

  draggedItem: AIListItem | undefined;

  isDragging: boolean;

  handleDragStart(item: AIListItem | undefined) {
    this.isDragging = true;
    this.draggedItem = item;
  }

  handleDragEnd() {
    this.isDragging = false;
    this.draggedItem = undefined;
  }

  handleDrop(dropLocation: AIListItem, dropPosition: string) {
    if (!dropLocation || !dropPosition) {
      return;
    }
    // Prevent dropping an item into itself, or a parent.
    if (!this.model.getParentIds(dropLocation.id).includes(this.draggedItem.id)) {
      this.model.removeItem(this.draggedItem.id);
      if (dropPosition === 'nested') {
        this.model.addItem(this.draggedItem, dropLocation.id, 0);
      } else {
        let relativeIndex = 0;
        if (dropLocation.parentId !== null) {
          const dropLocationParentItem = this.model.getItem(dropLocation.parentId);
          relativeIndex = dropLocationParentItem.items.findIndex((item: AIListItem) => item.id === dropLocation.id);
        } else {
          relativeIndex = this.model.items.findIndex((item: AIListItem) => item.id === dropLocation.id);
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
}
