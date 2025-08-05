/**
 *
 * @ai-apps/angular v2.155.1 | ai-list-item-wrapper.component.js
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
export class AIListItemWrapperComponent {
    constructor() {
        /**
         * Indicates whether or not the item can be dragged into a different position.
         */
        this.draggable = false;
        this.isDragging = false;
        /**
         * Indicates whether or not the list item can be selected.
         */
        this.isSelectable = false;
        this.size = 'md';
        this.disabled = false;
        this.dragStart = new EventEmitter();
        this.dragEnd = new EventEmitter();
        this.dragOverAbove = new EventEmitter();
        this.dragOverBelow = new EventEmitter();
        this.dragOverNested = new EventEmitter();
        this.droppedBelow = new EventEmitter();
        this.droppedAbove = new EventEmitter();
        this.droppedNested = new EventEmitter();
    }
}
AIListItemWrapperComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-list-item-wrapper',
                template: `
    <div data-floating-menu-container="true" class="iot--list-item-parent">
      <div
        *ngIf="draggable && !disabled; else listItem"
        class="iot--list-item-editable--drag-container"
        role="listitem"
        [draggable]="true"
        (dragstart)="dragStart.emit($event)"
        (dragend)="dragEnd.emit($event)"
      >
        <div
          class="iot--list-item-editable--drop-targets"
          [ngClass]="{ 'iot--list-item__large': size === 'lg' }"
          *ngIf="isDragging"
        >
          <div
            aiListTarget
            targetPosition="nested"
            (dropping)="droppedNested.emit($event)"
            (dragOver)="dragOverNested.emit($event)"
            [targetSize]="100"
          ></div>
          <div
            aiListTarget
            targetPosition="above"
            (dropping)="droppedAbove.emit($event)"
            (dragOver)="dragOverAbove.emit($event)"
          ></div>
          <div
            aiListTarget
            targetPosition="below"
            (dropping)="droppedBelow.emit($event)"
            (dragOver)="dragOverBelow.emit($event)"
          ></div>
        </div>
        <ng-container [ngTemplateOutlet]="listItem"></ng-container>
      </div>
    </div>

    <ng-template #listItem>
      <ng-content></ng-content>
    </ng-template>
  `
            },] }
];
AIListItemWrapperComponent.propDecorators = {
    draggable: [{ type: Input }],
    isDragging: [{ type: Input }],
    isSelectable: [{ type: Input }],
    size: [{ type: Input }],
    disabled: [{ type: Input }],
    dragStart: [{ type: Output }],
    dragEnd: [{ type: Output }],
    dragOverAbove: [{ type: Output }],
    dragOverBelow: [{ type: Output }],
    dragOverNested: [{ type: Output }],
    droppedBelow: [{ type: Output }],
    droppedAbove: [{ type: Output }],
    droppedNested: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWktbGlzdC1pdGVtLXdyYXBwZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpc3QvbGlzdC1pdGVtL2FpLWxpc3QtaXRlbS13cmFwcGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBZ0R2RSxNQUFNLE9BQU8sMEJBQTBCO0lBOUN2QztRQStDRTs7V0FFRztRQUNNLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFbEIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUU1Qjs7V0FFRztRQUNNLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBRXJCLFNBQUksR0FBZ0IsSUFBSSxDQUFDO1FBRXpCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFFaEIsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFcEMsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFbEMsa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRXhDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUV4QyxtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFekMsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRXZDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUV2QyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7SUFDcEQsQ0FBQzs7O1lBOUVBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBDVDthQUNGOzs7d0JBS0UsS0FBSzt5QkFFTCxLQUFLOzJCQUtMLEtBQUs7bUJBRUwsS0FBSzt1QkFFTCxLQUFLO3dCQUVMLE1BQU07c0JBRU4sTUFBTTs0QkFFTixNQUFNOzRCQUVOLE1BQU07NkJBRU4sTUFBTTsyQkFFTixNQUFNOzJCQUVOLE1BQU07NEJBRU4sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLWxpc3QtaXRlbS13cmFwcGVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGRhdGEtZmxvYXRpbmctbWVudS1jb250YWluZXI9XCJ0cnVlXCIgY2xhc3M9XCJpb3QtLWxpc3QtaXRlbS1wYXJlbnRcIj5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJkcmFnZ2FibGUgJiYgIWRpc2FibGVkOyBlbHNlIGxpc3RJdGVtXCJcbiAgICAgICAgY2xhc3M9XCJpb3QtLWxpc3QtaXRlbS1lZGl0YWJsZS0tZHJhZy1jb250YWluZXJcIlxuICAgICAgICByb2xlPVwibGlzdGl0ZW1cIlxuICAgICAgICBbZHJhZ2dhYmxlXT1cInRydWVcIlxuICAgICAgICAoZHJhZ3N0YXJ0KT1cImRyYWdTdGFydC5lbWl0KCRldmVudClcIlxuICAgICAgICAoZHJhZ2VuZCk9XCJkcmFnRW5kLmVtaXQoJGV2ZW50KVwiXG4gICAgICA+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzcz1cImlvdC0tbGlzdC1pdGVtLWVkaXRhYmxlLS1kcm9wLXRhcmdldHNcIlxuICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ2lvdC0tbGlzdC1pdGVtX19sYXJnZSc6IHNpemUgPT09ICdsZycgfVwiXG4gICAgICAgICAgKm5nSWY9XCJpc0RyYWdnaW5nXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGFpTGlzdFRhcmdldFxuICAgICAgICAgICAgdGFyZ2V0UG9zaXRpb249XCJuZXN0ZWRcIlxuICAgICAgICAgICAgKGRyb3BwaW5nKT1cImRyb3BwZWROZXN0ZWQuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgIChkcmFnT3Zlcik9XCJkcmFnT3Zlck5lc3RlZC5lbWl0KCRldmVudClcIlxuICAgICAgICAgICAgW3RhcmdldFNpemVdPVwiMTAwXCJcbiAgICAgICAgICA+PC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgYWlMaXN0VGFyZ2V0XG4gICAgICAgICAgICB0YXJnZXRQb3NpdGlvbj1cImFib3ZlXCJcbiAgICAgICAgICAgIChkcm9wcGluZyk9XCJkcm9wcGVkQWJvdmUuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgIChkcmFnT3Zlcik9XCJkcmFnT3ZlckFib3ZlLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgPjwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGFpTGlzdFRhcmdldFxuICAgICAgICAgICAgdGFyZ2V0UG9zaXRpb249XCJiZWxvd1wiXG4gICAgICAgICAgICAoZHJvcHBpbmcpPVwiZHJvcHBlZEJlbG93LmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgICAoZHJhZ092ZXIpPVwiZHJhZ092ZXJCZWxvdy5lbWl0KCRldmVudClcIlxuICAgICAgICAgID48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwibGlzdEl0ZW1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPG5nLXRlbXBsYXRlICNsaXN0SXRlbT5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBBSUxpc3RJdGVtV3JhcHBlckNvbXBvbmVudCB7XG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdGhlIGl0ZW0gY2FuIGJlIGRyYWdnZWQgaW50byBhIGRpZmZlcmVudCBwb3NpdGlvbi5cbiAgICovXG4gIEBJbnB1dCgpIGRyYWdnYWJsZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIGlzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRoZSBsaXN0IGl0ZW0gY2FuIGJlIHNlbGVjdGVkLlxuICAgKi9cbiAgQElucHV0KCkgaXNTZWxlY3RhYmxlID0gZmFsc2U7XG5cbiAgQElucHV0KCkgc2l6ZTogJ21kJyB8ICdsZycgPSAnbWQnO1xuXG4gIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpIGRyYWdTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBkcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIGRyYWdPdmVyQWJvdmUgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgZHJhZ092ZXJCZWxvdyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBkcmFnT3Zlck5lc3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBPdXRwdXQoKSBkcm9wcGVkQmVsb3cgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAT3V0cHV0KCkgZHJvcHBlZEFib3ZlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIGRyb3BwZWROZXN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbn1cbiJdfQ==