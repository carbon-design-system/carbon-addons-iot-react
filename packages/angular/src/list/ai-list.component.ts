import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AIListItem } from './list-item/ai-list-item.class';

export enum SelectionType {
  SINGLE = 'single',
  MULTI = 'multi',
}

@Component({
  selector: 'ai-list',
  template: `
    <div class="iot--list">
      <ai-list-header [hasSearch]="hasSearch" [title]="title" (onSearch)="onSearch.emit($event)">
      </ai-list-header>
      <div class="iot--list--content">
        <ng-template
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{
            $implicit: {
              item: items,
              nestingLevel: 0,
              parentItem: null,
              index: 0
            }
          }"
        >
        </ng-template>
      </div>
    </div>

    <ng-template #listItemTemplateRef let-data>
      <ng-container *ngIf="data.item.id && !isArray(data.item)">
        <ai-list-item-wrapper
          [draggable]="itemsDraggable && data.item.isDraggable"
          [isDragging]="draggingState.isDragging"
          (dragStart)="setDraggingState(true, data.item, data.parentItem)"
          (dragEnd)="setDraggingState(false, null, null)"
          (droppedAbove)="handleDrop(data.parentItem, data.index)"
          (droppedBelow)="handleDrop(data.parentItem, data.index + 1)"
          (droppedNested)="handleDrop(data.item, 0)"
        >
          <ai-list-item
            [item]="data.item"
            [nestingLevel]="data.item.hasChildren() ? data.nestingLevel - 1 : data.nestingLevel"
            (itemSelected)="handleSelect(data.item.id)"
            [parentId]="data.parentId"
            [selectionType]="selectionType"
            [draggable]="itemsDraggable"
          >
          </ai-list-item>
        </ai-list-item-wrapper>
      </ng-container>

      <ng-container
        *ngIf="!isArray(data.item) && data.item.hasChildren() && data.item.expanded"
      >
        <ng-container
          *ngFor="let item of data.item.items; index as i"
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{
            $implicit: {
              item: item,
              nestingLevel: getAdjustedNestingLevel(data.item.items, data.nestingLevel),
              parentItem: data.item,
              index: i
            }
          }"
        ></ng-container>
      </ng-container>

      <ng-container *ngIf="isArray(data.item)">
        <ng-container
          *ngFor="let item of data.item; index as i"
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{
            $implicit: {
              item: item,
              nestingLevel: getAdjustedNestingLevel(data.item, data.nestingLevel),
              parentItem: null,
              index: i
            }
          }"
        >
        </ng-container>
      </ng-container>
    </ng-template>
  `,
})
export class AIListComponent {
  @Input() items: AIListItem[];

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

  draggingState = { isDragging: false, draggedItem: null, draggedItemsParent: null };

  /**
   * This function returns the adjusted `nestingLevel`s of an AIListItem.
   */
  getAdjustedNestingLevel(items: AIListItem[], currentDepth: number) {
    return items.some((item) => item.hasChildren()) ? currentDepth + 1 : currentDepth;
  }

  handleSelect(selectedItemId: string) {
    if (this.selectionType === SelectionType.MULTI) {
      this.updateChildSelectedStates(this.items, selectedItemId);
      this.updateParentSelectedStates(this.items);
    } else {
      this.handleSingleSelect(this.items, selectedItemId);
    }
  }

  setDraggingState(isDragging: boolean, draggedItem: AIListItem, draggedItemsParent: AIListItem) {
    this.draggingState = {
      isDragging,
      draggedItem,
      draggedItemsParent
    };
  }

  handleDrop(receivingItem: AIListItem, insertIndex: number) {
    if (!this.draggingState.draggedItem.hasItem(receivingItem) &&
      (receivingItem === null || receivingItem.id !== this.draggingState.draggedItem.id)) {
      if (this.draggingState.draggedItemsParent === null) {
        const removeIndex = this.items.findIndex((item: AIListItem) => item.id === this.draggingState.draggedItem.id);
        this.items.splice(removeIndex, 1);
      } else {
        this.draggingState.draggedItemsParent.removeItem(this.draggingState.draggedItem);
      }
      if (receivingItem === null) {
        this.items.splice(insertIndex, 0, this.draggingState.draggedItem);
      } else {
        receivingItem.addItem(this.draggingState.draggedItem, insertIndex);
      }
    }
    this.setDraggingState(false, null, null);
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  protected updateChildSelectedStates(items: AIListItem[], selectedId: string, selected: boolean = null) {
    items.forEach((item: AIListItem) => {
      if (selected !== null && item.isSelectable) {
        item.select(selected);
      }

      if (item.items && item.items.length > 0) {
        if (item.id === selectedId) {
          this.updateChildSelectedStates(item.items, selectedId, item.selected);
        } else {
          this.updateChildSelectedStates(item.items, selectedId, selected);
        }
      }
    });
  }

  protected updateParentSelectedStates(items: AIListItem[]) {
    items.forEach((item: AIListItem) => {
      if (item.items && item.items.length > 0) {
        this.updateParentSelectedStates(item.items);
      } else {
        return;
      }

      if (
        item.isSelectable &&
        item.items.every((item: AIListItem) => item.isSelectable ? item.selected : true)
      ) {
        item.select(true);
        item.updateIndeterminate(false);
      } else if (
        item.isSelectable &&
        item.items.some((item: AIListItem) => item.isSelectable ? item.selected : false)
      ) {
        item.select(false);
        item.updateIndeterminate(true);
      } else {
        item.select(false);
        item.updateIndeterminate(false);
      }
    });
  }

  protected handleSingleSelect(items: AIListItem[], selectedId: string) {
    items.forEach((item: AIListItem) => {
      if (item.id !== selectedId) {
        item.select(false);
      }

      if (item.items && item.items.length > 0) {
        this.handleSingleSelect(item.items, selectedId);
      }
    });
  }
}
