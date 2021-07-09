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
      <ai-list-header [hasSearch]="hasSearch" [title]="title" (onSearch)="searchString = $event">
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
      <!-- Render item -->
      <ng-container *ngIf="data.item.id && !isArray(data.item) && data.item.includes(searchString)">
        <ai-list-item-wrapper
          [draggable]="itemsDraggable && data.item.isDraggable"
          [isDragging]="draggingState.isDragging"
          (dragStart)="setDraggingState({ isDragging: true, item: data.item, parent: data.parentItem })"
          (dragEnd)="setDraggingState({ isDragging: false, item: null, parent: null })"
          (droppedAbove)="handleDrop(data.parentItem, data.index)"
          (droppedBelow)="handleDrop(data.parentItem, data.index + 1)"
          (droppedNested)="handleDrop(data.item, 0)"
        >
          <ai-list-item
            [item]="data.item"
            [nestingLevel]="data.item.hasChildren() ? data.nestingLevel - 1 : data.nestingLevel"
            (itemSelected)="handleSelect(data.item)"
            [selectionType]="selectionType"
            [draggable]="itemsDraggable"
          >
          </ai-list-item>
        </ai-list-item-wrapper>
      </ng-container>

      <!-- Item has children -->
      <ng-container *ngIf="!isArray(data.item) && data.item.hasChildren() && data.item.expanded">
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

      <!-- Top level item -->
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
   * Indicates whether or not items in the list can be dragged into new positions.
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

  searchString = '';

  draggingState = { isDragging: false, item: null, parent: null };

  setDraggingState(data: any) {
    this.draggingState = Object.assign({}, this.draggingState, data);
  }

  handleDrop(receiver: AIListItem, index: number) {
    // Don't allow list items to be dropped as one of its own children, and also
    // don't allow list items to be dropped on itself.
    if (
      !this.draggingState.item.hasItem(receiver) &&
      (receiver === null || receiver.id !== this.draggingState.item.id)
    ) {
      // Remove the `draggedItem` from its original position.
      // If `draggedItemParent` is null it means `draggedItem` is a top level list item.
      if (this.draggingState.parent === null) {
        const droppedItemIndex = this.items.findIndex(
          (item: AIListItem) => item.id === this.draggingState.item.id
        );
        this.items.splice(droppedItemIndex, 1);
      } else {
        this.draggingState.parent.removeItem(this.draggingState.item);
      }

      // Place `draggedItem` as a child of `recievingItem` at the given `index`.
      // If `receiver` is null it means put `draggedItem` as a top level list item.
      if (receiver === null) {
        this.items.splice(index, 0, this.draggingState.item);
      } else {
        receiver.addItem(this.draggingState.item, index);
      }
    }
    this.setDraggingState({ isDragging: false, item: null, parent: null });
  }

  handleSelect(selectedItem: AIListItem) {
    if (this.selectionType === SelectionType.MULTI) {
      this.updateChildSelectedStates(selectedItem);
      this.updateParentSelectedStates(this.items);
    } else {
      this.onSingleSelect(this.items, selectedItem.id);
    }
  }

  /**
   * This function returns the adjusted `nestingLevel`s of an AIListItem.
   */
  getAdjustedNestingLevel(items: AIListItem[], currentDepth: number) {
    return items.some((item) => item.hasChildren()) ? currentDepth + 1 : currentDepth;
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  protected updateChildSelectedStates(selectedItem: AIListItem) {
    if (selectedItem.hasChildren()) {
      selectedItem.items.forEach((item: AIListItem) => {
        item.select(selectedItem.selected);
        this.updateChildSelectedStates(item);
      });
    }
  }

  protected updateParentSelectedStates(items: AIListItem[]) {
    items.forEach((item: AIListItem) => {
      if (item.hasChildren()) {
        this.updateParentSelectedStates(item.items);
      } else {
        return;
      }

      if (item.isSelectable && item.allChildrenSelected()) {
        item.select();
        item.setIndeterminate(false);
      } else if (item.isSelectable && item.someChildrenSelected()) {
        item.select(false);
        item.setIndeterminate();
      } else {
        item.select(false);
        item.setIndeterminate(false);
      }
    });
  }

  protected onSingleSelect(items: AIListItem[], selectedId: string) {
    items.forEach((item: AIListItem) => {
      if (item.id !== selectedId) {
        item.select(false);
      }

      if (item.hasChildren()) {
        this.onSingleSelect(item.items, selectedId);
      }
    });
  }
}
