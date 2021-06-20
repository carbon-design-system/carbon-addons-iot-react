import { Component, Input } from '@angular/core';

import { AIListModel, SelectionType } from './ai-list-model.class';
import { AIListItem } from './list-item/ai-list-item.interface';

@Component({
  selector: 'ai-list',
  template: `
    <div class="iot--list">
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
        <ai-list-item
          [value]="item.value"
          [nestingLevel]="item.nestingLevel"
          [hasChildren]="model.hasChildren(item)"
          [isSelectable]="item.isSelectable"
          [selectionType]="selectionType"
          [expanded]="model.isItemExpanded(item.id)"
          [selected]="model.isItemSelected(item.id)"
          [indeterminate]="model.isItemIndeterminate(item.id)"
          (expansionClick)="model.handleExpansion(item.id)"
          [draggable]="itemsDraggable"
          [isDragging]="isDragging"
          [isCategory]="item.isCategory"
          (itemSelected)="model.handleSelect(item.id, !model.isItemSelected(item.id), selectionType)"
          (dragStart)="handleDragStart(item)"
          (itemDropped)="handleDrop(item, $event)"
        >
        </ai-list-item>
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

  draggedItem: AIListItem | undefined;

  isDragging: boolean;

  handleDragStart(item: AIListItem | undefined) {
    this.isDragging = true;
    this.draggedItem = item;
  }

  handleDrop(dropLocation: AIListItem, dropPosition: string) {
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
}
