import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionType } from '../ai-list.component';
import { AIListItem } from './ai-list-item.class';

@Component({
  selector: 'ai-list-item',
  template: `
    <div
      class="iot--list-item"
      [ngClass]="{
        'iot--list-item__selectable': item.isSelectable,
        'iot--list-item__selected': item.selected,
        'iot--list-item-editable': item.isDraggable
      }"
      (click)="selectionType === 'single' ? item.select(!item.selected, true) : null"
    >
      <div class="iot--list-item-editable--drag-preview">
        {{ item.value }}
      </div>
      <svg
        *ngIf="draggable"
        class="iot--list-item--handle"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 32 32"
      >
        <path
          d="M10 6H14V10H10zM18 6H22V10H18zM10 14H14V18H10zM18 14H22V18H18zM10 22H14V26H10zM18 22H22V26H18z"
        ></path>
      </svg>
      <div
        *ngIf="nestingLevel > 0"
        class="iot--list-item--nesting-offset"
        [ngStyle]="{ width: 30 * nestingLevel + 'px' }"
      ></div>
      <div
        *ngIf="item.hasChildren()"
        role="button"
        (click)="item.expand(!item.expanded)"
        tabindex="0"
        class="iot--list-item--expand-icon"
      >
        <svg *ngIf="!item.expanded" ibmIcon="chevron--down" size="16"></svg>
        <!-- chevron--up doesn't exist in icons yet -->
        <svg
          *ngIf="item.expanded"
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          role="img"
        >
          <path d="M8 5L13 10 12.3 10.7 8 6.4 3.7 10.7 3 10z"></path>
        </svg>
      </div>
      <div class="iot--list-item--content">
        <div
          *ngIf="item.isSelectable && selectionType === 'multi'"
          class="iot--list-item--content--icon iot--list-item--content--icon__left"
        >
          <ibm-checkbox
            (checkedChange)="handleSelect($event)"
            [checked]="item.selected"
            [indeterminate]="item.indeterminate"
          >
          </ibm-checkbox>
        </div>
        <div class="iot--list-item--content--values">
          <div class="iot--list-item--content--values--main">
            <div
              class="iot--list-item--content--values--value"
              [ngClass]="{ 'iot--list-item--category': item.isCategory }"
            >
              {{ item.value }}
            </div>
            <div
              *ngIf="item.secondaryValue !== null"
              class="iot--list-item--content--values--value"
            >
              {{ item.secondaryValue }}
            </div>
            <div *ngIf="item.rowActions" class="iot--list-item--content--row-actions">
              <ng-template [ngTemplateOutlet]="item.rowActions"></ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AIListItemComponent {
  @Input() item: AIListItem;
  /**
   * Nesting level of the list item. Determines the amount of space the item will be indented
   * when rendered in the list.
   */
  @Input() nestingLevel = 0;

  /**
   * Indicates whether or not the item can be dragged into a different position.
   */
  @Input() draggable = false;

  /**
   * Indicates whether or not the list item can be selected.
   */
  @Input() isSelectable = false;

  /**
   * Indicates the editing style of the list item. If it is `multi` the list item will be
   * rendered with a checkbox. If it is not given then the list item will not be editable,
   * that is, you can't select it.
   */
  @Input() selectionType: SelectionType;

  /**
   * Emitted if the item has been selected.
   */
  @Output() itemSelected = new EventEmitter<any>();

  handleSelect(select: boolean) {
    this.item.select(select);
    this.itemSelected.emit();
  }
}
