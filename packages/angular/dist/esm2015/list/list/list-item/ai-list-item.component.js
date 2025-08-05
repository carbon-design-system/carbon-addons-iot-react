/**
 *
 * @ai-apps/angular v2.155.1 | ai-list-item.component.js
 *
 * Copyright 2014, 2025 IBM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionType } from '../ai-list.component';
import { AIListItem } from './ai-list-item.class';
import { ChevronUp16, Draggable16 } from '@carbon/icons';
import { IconService } from 'carbon-components-angular';
export class AIListItemComponent {
    constructor(iconService) {
        this.iconService = iconService;
        /**
         * Nesting level of the list item. Determines the amount of space the item will be indented
         * when rendered in the list.
         */
        this.nestingLevel = 0;
        /**
         * Indicates whether or not the item can be dragged into a different position.
         */
        this.draggable = false;
        /**
         * Indicates whether or not the list item can be selected.
         */
        this.isSelectable = false;
        /**
         * Emitted if the item has been selected.
         */
        this.itemSelected = new EventEmitter();
    }
    ngOnInit() {
        this.iconService.register(ChevronUp16);
        this.iconService.register(Draggable16);
    }
    handleSelect(select) {
        this.item.select(select);
        this.itemSelected.emit();
    }
}
AIListItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-list-item',
                template: `
    <div
      role="button"
      [attr.tabindex]="
        this.item.isSelectable && !this.item.disabled && !this.item.isDraggable ? 0 : undefined
      "
      class="iot--list-item"
      [ngClass]="{
        'iot--list-item__selectable': item.isSelectable,
        'iot--list-item__selected': item.selected,
        'iot--list-item-editable': item.isDraggable,
        'iot--list-item__large': item.size === 'lg'
      }"
      (click)="selectionType === 'single' ? handleSelect(!item.selected) : null"
      (keyup.Space)="selectionType === 'single' ? handleSelect(!item.selected) : null"
    >
      <div class="iot--list-item-editable--drag-preview">
        {{ item.value }}
      </div>
      <svg
        *ngIf="draggable && item.isDraggable"
        class="iot--list-item--handle"
        [ngClass]="{ 'iot--list-item--handle__disabled': item.disabled }"
        ibmIcon="draggable"
        size="16"
      ></svg>
      <div
        *ngIf="nestingLevel > 0"
        class="iot--list-item--nesting-offset"
        [ngStyle]="{ width: 30 * nestingLevel + 'px' }"
      ></div>
      <div
        *ngIf="item.hasChildren()"
        role="button"
        (click)="!item.disabled ? item.expand(!item.expanded) : undefined"
        (keyup.Space)="!item.disabled ? item.expand(!item.expanded) : undefined"
        [tabindex]="!item.disabled ? 0 : undefined"
        class="iot--list-item--expand-icon"
        [ngClass]="{ 'iot--list-item--expand-icon__disabled': item.disabled }"
      >
        <svg *ngIf="!item.expanded" ibmIcon="chevron--down" size="16"></svg>
        <svg *ngIf="item.expanded" ibmIcon="chevron--up" size="16"></svg>
      </div>
      <div
        class="iot--list-item--content"
        [ngClass]="{
          'iot--list-item--content__selected': item.selected,
          'iot--list-item--content__large': item.size === 'lg'
        }"
      >
        <div
          *ngIf="item.isSelectable && selectionType === 'multi'"
          class="iot--list-item--content--icon iot--list-item--content--icon__left"
        >
          <ibm-checkbox
            (checkedChange)="handleSelect($event)"
            [checked]="item.selected"
            [id]="item.id + '_checkbox'"
            [disabled]="item.disabled"
            [indeterminate]="item.indeterminate"
          >
          </ibm-checkbox>
        </div>
        <div
          class="iot--list-item--content--values"
          [ngClass]="{ 'iot--list-item--content--values__large': item.size === 'lg' }"
        >
          <div
            class="iot--list-item--content--values--main"
            [ngClass]="{ 'iot--list-item--content--values--main__large': item.size === 'lg' }"
          >
            <div
              class="iot--list-item--content--values--value"
              [ngClass]="{
                'iot--list-item--category': item.isCategory,
                'iot--list-item--content--values__disabled': item.disabled,
                'iot--list-item--content--values--value__with-actions': item.rowActions
              }"
            >
              {{ item.value }}
            </div>
            <div
              *ngIf="item.secondaryValue !== undefined"
              class="iot--list-item--content--values--value"
              [ngClass]="{
                'iot--list-item--content--values__disabled': item.disabled,
                'iot--list-item--content--values--value__large': item.size === 'lg'
              }"
            >
              {{ item.secondaryValue }}
            </div>
            <div *ngIf="item.rowActions" class="iot--list-item--content--row-actions">
              <ng-container
                [ngTemplateOutlet]="item.rowActions"
                [ngTemplateOutletContext]="item.rowActionsContext"
              >
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
            },] }
];
AIListItemComponent.ctorParameters = () => [
    { type: IconService }
];
AIListItemComponent.propDecorators = {
    item: [{ type: Input }],
    nestingLevel: [{ type: Input }],
    draggable: [{ type: Input }],
    isSelectable: [{ type: Input }],
    selectionType: [{ type: Input }],
    itemSelected: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWktbGlzdC1pdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saXN0L2xpc3QtaXRlbS9haS1saXN0LWl0ZW0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUE0R3hELE1BQU0sT0FBTyxtQkFBbUI7SUE4QjlCLFlBQXNCLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBNUI5Qzs7O1dBR0c7UUFDTSxpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUUxQjs7V0FFRztRQUNNLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFM0I7O1dBRUc7UUFDTSxpQkFBWSxHQUFHLEtBQUssQ0FBQztRQVM5Qjs7V0FFRztRQUNPLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztJQUVBLENBQUM7SUFFbEQsUUFBUTtRQUNOLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxZQUFZLENBQUMsTUFBZTtRQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLENBQUM7OztZQWxKRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0dUO2FBQ0Y7OztZQTNHUSxXQUFXOzs7bUJBNkdqQixLQUFLOzJCQUtMLEtBQUs7d0JBS0wsS0FBSzsyQkFLTCxLQUFLOzRCQU9MLEtBQUs7MkJBS0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFNlbGVjdGlvblR5cGUgfSBmcm9tICcuLi9haS1saXN0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBSUxpc3RJdGVtIH0gZnJvbSAnLi9haS1saXN0LWl0ZW0uY2xhc3MnO1xuaW1wb3J0IHsgQ2hldnJvblVwMTYsIERyYWdnYWJsZTE2IH0gZnJvbSAnQGNhcmJvbi9pY29ucyc7XG5pbXBvcnQgeyBJY29uU2VydmljZSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhaS1saXN0LWl0ZW0nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgW2F0dHIudGFiaW5kZXhdPVwiXG4gICAgICAgIHRoaXMuaXRlbS5pc1NlbGVjdGFibGUgJiYgIXRoaXMuaXRlbS5kaXNhYmxlZCAmJiAhdGhpcy5pdGVtLmlzRHJhZ2dhYmxlID8gMCA6IHVuZGVmaW5lZFxuICAgICAgXCJcbiAgICAgIGNsYXNzPVwiaW90LS1saXN0LWl0ZW1cIlxuICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAnaW90LS1saXN0LWl0ZW1fX3NlbGVjdGFibGUnOiBpdGVtLmlzU2VsZWN0YWJsZSxcbiAgICAgICAgJ2lvdC0tbGlzdC1pdGVtX19zZWxlY3RlZCc6IGl0ZW0uc2VsZWN0ZWQsXG4gICAgICAgICdpb3QtLWxpc3QtaXRlbS1lZGl0YWJsZSc6IGl0ZW0uaXNEcmFnZ2FibGUsXG4gICAgICAgICdpb3QtLWxpc3QtaXRlbV9fbGFyZ2UnOiBpdGVtLnNpemUgPT09ICdsZydcbiAgICAgIH1cIlxuICAgICAgKGNsaWNrKT1cInNlbGVjdGlvblR5cGUgPT09ICdzaW5nbGUnID8gaGFuZGxlU2VsZWN0KCFpdGVtLnNlbGVjdGVkKSA6IG51bGxcIlxuICAgICAgKGtleXVwLlNwYWNlKT1cInNlbGVjdGlvblR5cGUgPT09ICdzaW5nbGUnID8gaGFuZGxlU2VsZWN0KCFpdGVtLnNlbGVjdGVkKSA6IG51bGxcIlxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJpb3QtLWxpc3QtaXRlbS1lZGl0YWJsZS0tZHJhZy1wcmV2aWV3XCI+XG4gICAgICAgIHt7IGl0ZW0udmFsdWUgfX1cbiAgICAgIDwvZGl2PlxuICAgICAgPHN2Z1xuICAgICAgICAqbmdJZj1cImRyYWdnYWJsZSAmJiBpdGVtLmlzRHJhZ2dhYmxlXCJcbiAgICAgICAgY2xhc3M9XCJpb3QtLWxpc3QtaXRlbS0taGFuZGxlXCJcbiAgICAgICAgW25nQ2xhc3NdPVwieyAnaW90LS1saXN0LWl0ZW0tLWhhbmRsZV9fZGlzYWJsZWQnOiBpdGVtLmRpc2FibGVkIH1cIlxuICAgICAgICBpYm1JY29uPVwiZHJhZ2dhYmxlXCJcbiAgICAgICAgc2l6ZT1cIjE2XCJcbiAgICAgID48L3N2Zz5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJuZXN0aW5nTGV2ZWwgPiAwXCJcbiAgICAgICAgY2xhc3M9XCJpb3QtLWxpc3QtaXRlbS0tbmVzdGluZy1vZmZzZXRcIlxuICAgICAgICBbbmdTdHlsZV09XCJ7IHdpZHRoOiAzMCAqIG5lc3RpbmdMZXZlbCArICdweCcgfVwiXG4gICAgICA+PC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgICpuZ0lmPVwiaXRlbS5oYXNDaGlsZHJlbigpXCJcbiAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICAgIChjbGljayk9XCIhaXRlbS5kaXNhYmxlZCA/IGl0ZW0uZXhwYW5kKCFpdGVtLmV4cGFuZGVkKSA6IHVuZGVmaW5lZFwiXG4gICAgICAgIChrZXl1cC5TcGFjZSk9XCIhaXRlbS5kaXNhYmxlZCA/IGl0ZW0uZXhwYW5kKCFpdGVtLmV4cGFuZGVkKSA6IHVuZGVmaW5lZFwiXG4gICAgICAgIFt0YWJpbmRleF09XCIhaXRlbS5kaXNhYmxlZCA/IDAgOiB1bmRlZmluZWRcIlxuICAgICAgICBjbGFzcz1cImlvdC0tbGlzdC1pdGVtLS1leHBhbmQtaWNvblwiXG4gICAgICAgIFtuZ0NsYXNzXT1cInsgJ2lvdC0tbGlzdC1pdGVtLS1leHBhbmQtaWNvbl9fZGlzYWJsZWQnOiBpdGVtLmRpc2FibGVkIH1cIlxuICAgICAgPlxuICAgICAgICA8c3ZnICpuZ0lmPVwiIWl0ZW0uZXhwYW5kZWRcIiBpYm1JY29uPVwiY2hldnJvbi0tZG93blwiIHNpemU9XCIxNlwiPjwvc3ZnPlxuICAgICAgICA8c3ZnICpuZ0lmPVwiaXRlbS5leHBhbmRlZFwiIGlibUljb249XCJjaGV2cm9uLS11cFwiIHNpemU9XCIxNlwiPjwvc3ZnPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiaW90LS1saXN0LWl0ZW0tLWNvbnRlbnRcIlxuICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgJ2lvdC0tbGlzdC1pdGVtLS1jb250ZW50X19zZWxlY3RlZCc6IGl0ZW0uc2VsZWN0ZWQsXG4gICAgICAgICAgJ2lvdC0tbGlzdC1pdGVtLS1jb250ZW50X19sYXJnZSc6IGl0ZW0uc2l6ZSA9PT0gJ2xnJ1xuICAgICAgICB9XCJcbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgICpuZ0lmPVwiaXRlbS5pc1NlbGVjdGFibGUgJiYgc2VsZWN0aW9uVHlwZSA9PT0gJ211bHRpJ1wiXG4gICAgICAgICAgY2xhc3M9XCJpb3QtLWxpc3QtaXRlbS0tY29udGVudC0taWNvbiBpb3QtLWxpc3QtaXRlbS0tY29udGVudC0taWNvbl9fbGVmdFwiXG4gICAgICAgID5cbiAgICAgICAgICA8aWJtLWNoZWNrYm94XG4gICAgICAgICAgICAoY2hlY2tlZENoYW5nZSk9XCJoYW5kbGVTZWxlY3QoJGV2ZW50KVwiXG4gICAgICAgICAgICBbY2hlY2tlZF09XCJpdGVtLnNlbGVjdGVkXCJcbiAgICAgICAgICAgIFtpZF09XCJpdGVtLmlkICsgJ19jaGVja2JveCdcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cIml0ZW0uZGlzYWJsZWRcIlxuICAgICAgICAgICAgW2luZGV0ZXJtaW5hdGVdPVwiaXRlbS5pbmRldGVybWluYXRlXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgPC9pYm0tY2hlY2tib3g+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3M9XCJpb3QtLWxpc3QtaXRlbS0tY29udGVudC0tdmFsdWVzXCJcbiAgICAgICAgICBbbmdDbGFzc109XCJ7ICdpb3QtLWxpc3QtaXRlbS0tY29udGVudC0tdmFsdWVzX19sYXJnZSc6IGl0ZW0uc2l6ZSA9PT0gJ2xnJyB9XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzPVwiaW90LS1saXN0LWl0ZW0tLWNvbnRlbnQtLXZhbHVlcy0tbWFpblwiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdpb3QtLWxpc3QtaXRlbS0tY29udGVudC0tdmFsdWVzLS1tYWluX19sYXJnZSc6IGl0ZW0uc2l6ZSA9PT0gJ2xnJyB9XCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzPVwiaW90LS1saXN0LWl0ZW0tLWNvbnRlbnQtLXZhbHVlcy0tdmFsdWVcIlxuICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICAgICAgJ2lvdC0tbGlzdC1pdGVtLS1jYXRlZ29yeSc6IGl0ZW0uaXNDYXRlZ29yeSxcbiAgICAgICAgICAgICAgICAnaW90LS1saXN0LWl0ZW0tLWNvbnRlbnQtLXZhbHVlc19fZGlzYWJsZWQnOiBpdGVtLmRpc2FibGVkLFxuICAgICAgICAgICAgICAgICdpb3QtLWxpc3QtaXRlbS0tY29udGVudC0tdmFsdWVzLS12YWx1ZV9fd2l0aC1hY3Rpb25zJzogaXRlbS5yb3dBY3Rpb25zXG4gICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7eyBpdGVtLnZhbHVlIH19XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgKm5nSWY9XCJpdGVtLnNlY29uZGFyeVZhbHVlICE9PSB1bmRlZmluZWRcIlxuICAgICAgICAgICAgICBjbGFzcz1cImlvdC0tbGlzdC1pdGVtLS1jb250ZW50LS12YWx1ZXMtLXZhbHVlXCJcbiAgICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICdpb3QtLWxpc3QtaXRlbS0tY29udGVudC0tdmFsdWVzX19kaXNhYmxlZCc6IGl0ZW0uZGlzYWJsZWQsXG4gICAgICAgICAgICAgICAgJ2lvdC0tbGlzdC1pdGVtLS1jb250ZW50LS12YWx1ZXMtLXZhbHVlX19sYXJnZSc6IGl0ZW0uc2l6ZSA9PT0gJ2xnJ1xuICAgICAgICAgICAgICB9XCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3sgaXRlbS5zZWNvbmRhcnlWYWx1ZSB9fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiaXRlbS5yb3dBY3Rpb25zXCIgY2xhc3M9XCJpb3QtLWxpc3QtaXRlbS0tY29udGVudC0tcm93LWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIml0ZW0ucm93QWN0aW9uc1wiXG4gICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIml0ZW0ucm93QWN0aW9uc0NvbnRleHRcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIEFJTGlzdEl0ZW1Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBpdGVtOiBBSUxpc3RJdGVtO1xuICAvKipcbiAgICogTmVzdGluZyBsZXZlbCBvZiB0aGUgbGlzdCBpdGVtLiBEZXRlcm1pbmVzIHRoZSBhbW91bnQgb2Ygc3BhY2UgdGhlIGl0ZW0gd2lsbCBiZSBpbmRlbnRlZFxuICAgKiB3aGVuIHJlbmRlcmVkIGluIHRoZSBsaXN0LlxuICAgKi9cbiAgQElucHV0KCkgbmVzdGluZ0xldmVsID0gMDtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRoZSBpdGVtIGNhbiBiZSBkcmFnZ2VkIGludG8gYSBkaWZmZXJlbnQgcG9zaXRpb24uXG4gICAqL1xuICBASW5wdXQoKSBkcmFnZ2FibGUgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRoZSBsaXN0IGl0ZW0gY2FuIGJlIHNlbGVjdGVkLlxuICAgKi9cbiAgQElucHV0KCkgaXNTZWxlY3RhYmxlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB0aGUgZWRpdGluZyBzdHlsZSBvZiB0aGUgbGlzdCBpdGVtLiBJZiBpdCBpcyBgbXVsdGlgIHRoZSBsaXN0IGl0ZW0gd2lsbCBiZVxuICAgKiByZW5kZXJlZCB3aXRoIGEgY2hlY2tib3guIElmIGl0IGlzIG5vdCBnaXZlbiB0aGVuIHRoZSBsaXN0IGl0ZW0gd2lsbCBub3QgYmUgZWRpdGFibGUsXG4gICAqIHRoYXQgaXMsIHlvdSBjYW4ndCBzZWxlY3QgaXQuXG4gICAqL1xuICBASW5wdXQoKSBzZWxlY3Rpb25UeXBlOiBTZWxlY3Rpb25UeXBlO1xuXG4gIC8qKlxuICAgKiBFbWl0dGVkIGlmIHRoZSBpdGVtIGhhcyBiZWVuIHNlbGVjdGVkLlxuICAgKi9cbiAgQE91dHB1dCgpIGl0ZW1TZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpY29uU2VydmljZTogSWNvblNlcnZpY2UpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pY29uU2VydmljZS5yZWdpc3RlcihDaGV2cm9uVXAxNik7XG4gICAgdGhpcy5pY29uU2VydmljZS5yZWdpc3RlcihEcmFnZ2FibGUxNik7XG4gIH1cblxuICBoYW5kbGVTZWxlY3Qoc2VsZWN0OiBib29sZWFuKSB7XG4gICAgdGhpcy5pdGVtLnNlbGVjdChzZWxlY3QpO1xuICAgIHRoaXMuaXRlbVNlbGVjdGVkLmVtaXQoKTtcbiAgfVxufVxuIl19