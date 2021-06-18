import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionType } from '../ai-list-model.class';

@Component({
  selector: 'ai-list-item',
  template: `
    <div class='iot--list-item-parent'>
      <div
        class='iot--list-item'
        [ngClass]="{
          'iot--list-item__selectable': isSelectable,
          'iot--list-item__selected': selected
        }"
        (click)="onSingleSelect()"
      >
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
                [title]='title ? title : value'
              >
                {{ value }}
              </div>
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
   * Nesting level of the list item. Determines the amount of space the item will be indented
   * when rendered in the list.
   */
  @Input() nestingLevel = 0;

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
