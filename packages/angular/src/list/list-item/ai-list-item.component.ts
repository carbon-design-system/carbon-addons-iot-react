import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionType } from '../ai-list-model.class';

@Component({
  selector: 'ai-list-item',
  template: `
    <div
      class='iot--list-item'
      [ngClass]="{
        'iot--list-item__selectable': isSelectable,
        'iot--list-item__selected': selected,
        'iot--list-item-editable': draggable
      }"
      (click)="onSingleSelect()"
    >
      <div class="iot--list-item-editable--drag-preview">
        {{ value }}
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
        *ngIf='nestingLevel > 0'
        class='iot--list-item--nesting-offset'
        [ngStyle]='{ width: 30 * nestingLevel + "px" }'
      ></div>
      <div
        *ngIf='hasChildren'
        role='button'
        (click)='expansionClick.emit()'
        tabindex='0'
        class="iot--list-item--expand-icon"
      >
        <svg *ngIf="!expanded" ibmIcon="chevron--down" size="16"></svg>
        <!-- chevron--up doesn't exist in icons yet -->
        <svg
          *ngIf="expanded"
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
      <div class='iot--list-item--content'>
        <div
          *ngIf="isSelectable && selectionType === 'multi'"
          class='iot--list-item--content--icon iot--list-item--content--icon__left'
        >
          <ibm-checkbox
            (checkedChange)='itemSelected.emit()'
            [checked]='selected'
            [indeterminate]='indeterminate'
          >
          </ibm-checkbox>
        </div>
        <div class='iot--list-item--content--values'>
          <div class='iot--list-item--content--values--main'>
            <div
              class='iot--list-item--content--values--value'
              [ngClass]="{ 'iot--list-item--category' : isCategory }">
              {{ value }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AIListItemComponent {
  /**
   * Primary content to be displayed in the list item.
   */
  @Input() value: string;

  @Input() title: string;

  /**
   * Indicates whether or not the list item has children. It will display the expansion button
   * if it does.
   */
  @Input() hasChildren = false;

  /**
   * If the list item has child list items, this indicates whether or not it's
   * direct children are displayed.
   *
   * Expansion button will show a chevron pointing down if `true` and up if `false`.
   */
  @Input() expanded = false;

  /**
   * Indicates whether or not a list item's displayed value should be bolded.
   */
  @Input() isCategory = false;

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

  @Input() selected = false;

  @Input() indeterminate = false;

  @Input() selectionType: SelectionType;

  /**
   * Emitted when the expansion button is clicked.
   */
  @Output() expansionClick = new EventEmitter<any>();

  @Output() itemSelected = new EventEmitter<any>();

  onSingleSelect() {
    if (this.isSelectable && this.selectionType === SelectionType.SINGLE) {
      this.itemSelected.emit();
    }
  }
}
