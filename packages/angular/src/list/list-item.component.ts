import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListItem } from './list-item.class';

@Component({
  selector: 'ai-list-item',
  template: `
    <div>
      <div
        class="iot--list-item"
        [ngClass]="{
          'iot--list-item__selectable': isSelectable,
          'iot--list-item__selected': listItem.selected
        }"
      >
        <div
          *ngIf="listItem.nestingLevel > 0"
          class="iot--list-item--nesting-offset"
          [ngStyle]="{ width: 30 * listItem.nestingLevel + 'px' }"
        ></div>
        <div
          *ngIf="listItem.items.length > 0"
          role="button"
          (click)="onExpansionClick()"
          tabindex="0"
          class="iot--list-item--expand-icon"
        >
          <svg *ngIf="!listItem.expanded" ibmIcon="chevron--down" size="16"></svg>
          <svg
            *ngIf="listItem.expanded"
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
        <div
          class="iot--list-item--content"
          [ngClass]="{ 'iot--list-item--content__selected': listItem.selected }"
        >
          <div
            *ngIf="isSelectable"
            class="iot--list-item--content--icon iot--list-item--content--icon__left"
          >
            <ibm-checkbox
              (checkedChange)="onCheckedChange($event)"
              [checked]="listItem.selected"
              [indeterminate]="listItem.indeterminate"
            >
            </ibm-checkbox>
          </div>
          <div class="iot--list-item--content--values">
            <div class="iot--list-item--content--values--main">
              <div class="iot--list-item--content--values--value">
                {{ listItem.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ListItemComponent {
  @Input() listItem: ListItem;
  @Input() isSelectable: boolean;
  @Input() search: boolean;

  @Output() checkedChange = new EventEmitter<any>();
  @Output() expansionClick = new EventEmitter<any>();

  onCheckedChange(checked: boolean) {
    this.checkedChange.emit({ id: this.listItem.id, checked });
  }

  onExpansionClick() {
    this.expansionClick.emit(this.listItem.id);
  }
}
