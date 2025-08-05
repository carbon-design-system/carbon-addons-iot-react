/**
 *
 * @ai-apps/angular v2.155.1 | sortable-list-item.component.js
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


import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
/**
 * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-sortable-list-item component
 */
export class SortableListItemComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.checked = true;
        this.disabled = false;
        this.dragActive = false;
        this.dragStart = new EventEmitter();
        this.dragEnd = new EventEmitter();
        this.move = new EventEmitter();
    }
}
SortableListItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-sortable-list-item',
                template: `
    <div
      class="drag-marker"
      [ngClass]="{
        active: dragActive
      }"
    ></div>
    <div class="wrapper" [ngClass]="{ disabled: disabled }">
      <div
        class="handle"
        scDraggable
        [dragImage]="elementRef.nativeElement"
        [imageOffset]="{ x: 4, y: 20 }"
        (start)="!disabled ? dragStart.emit() : null"
        (end)="!disabled ? dragEnd.emit() : null"
      >
        <svg
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
      </div>
      <div class="content">
        <ibm-checkbox [checked]="checked" [disabled]="disabled">
          <ng-content></ng-content>
        </ibm-checkbox>
        <ibm-overflow-menu [flip]="true">
          <ibm-overflow-menu-option (selected)="move.emit('up')" [disabled]="disabled"
            >Move up</ibm-overflow-menu-option
          >
          <ibm-overflow-menu-option (selected)="move.emit('down')" [disabled]="disabled"
            >Move down</ibm-overflow-menu-option
          >
        </ibm-overflow-menu>
      </div>
    </div>
  `,
                styles: [":host{display:list-item;height:2.5rem;margin-bottom:.5rem;padding-left:1rem;padding-right:1rem}.drag-marker{border:1px solid #4589ff;display:none}.drag-marker.active{display:block}.wrapper{align-items:center;display:flex;height:100%;width:100%}.handle{cursor:pointer}.content{align-items:center;background:#f4f4f4;display:flex;height:100%;margin-left:.5rem;padding-left:1rem;padding-right:.5rem;width:100%}"]
            },] }
];
SortableListItemComponent.ctorParameters = () => [
    { type: ElementRef }
];
SortableListItemComponent.propDecorators = {
    checked: [{ type: Input }],
    disabled: [{ type: Input }],
    dragActive: [{ type: Input }],
    dragStart: [{ type: Output }],
    dragEnd: [{ type: Output }],
    move: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGUtbGlzdC1pdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy90b29sa2l0L3NvcnRhYmxlLWxpc3Qvc29ydGFibGUtbGlzdC1pdGVtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRjs7R0FFRztBQWtESCxNQUFNLE9BQU8seUJBQXlCO0lBYXBDLFlBQW1CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFaaEMsWUFBTyxHQUFHLElBQUksQ0FBQztRQUVmLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFFakIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUVsQixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUvQixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUU3QixTQUFJLEdBQUcsSUFBSSxZQUFZLEVBQWlCLENBQUM7SUFFUCxDQUFDOzs7WUE5RDlDLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNENUOzthQUVGOzs7WUFwRG1CLFVBQVU7OztzQkFzRDNCLEtBQUs7dUJBRUwsS0FBSzt5QkFFTCxLQUFLO3dCQUVMLE1BQU07c0JBRU4sTUFBTTttQkFFTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbi8qKlxuICogKipXYXJuaW5nOioqIFRoaXMgY29tcG9uZW50IHdpbGwgYmUgZGVwcmVjYXRlZCBpbiB0aGUgZnV0dXJlIGluIGZhdm91ciBvZiBhIHNwZWMgY29tcGxpYW50IGFpLXNvcnRhYmxlLWxpc3QtaXRlbSBjb21wb25lbnRcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnc2Mtc29ydGFibGUtbGlzdC1pdGVtJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2XG4gICAgICBjbGFzcz1cImRyYWctbWFya2VyXCJcbiAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgYWN0aXZlOiBkcmFnQWN0aXZlXG4gICAgICB9XCJcbiAgICA+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIndyYXBwZXJcIiBbbmdDbGFzc109XCJ7IGRpc2FibGVkOiBkaXNhYmxlZCB9XCI+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiaGFuZGxlXCJcbiAgICAgICAgc2NEcmFnZ2FibGVcbiAgICAgICAgW2RyYWdJbWFnZV09XCJlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRcIlxuICAgICAgICBbaW1hZ2VPZmZzZXRdPVwieyB4OiA0LCB5OiAyMCB9XCJcbiAgICAgICAgKHN0YXJ0KT1cIiFkaXNhYmxlZCA/IGRyYWdTdGFydC5lbWl0KCkgOiBudWxsXCJcbiAgICAgICAgKGVuZCk9XCIhZGlzYWJsZWQgPyBkcmFnRW5kLmVtaXQoKSA6IG51bGxcIlxuICAgICAgPlxuICAgICAgICA8c3ZnXG4gICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgZm9jdXNhYmxlPVwiZmFsc2VcIlxuICAgICAgICAgIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZCBtZWV0XCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgIHdpZHRoPVwiMTZcIlxuICAgICAgICAgIGhlaWdodD1cIjE2XCJcbiAgICAgICAgICB2aWV3Qm94PVwiMCAwIDMyIDMyXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICBkPVwiTTEwIDZIMTRWMTBIMTB6TTE4IDZIMjJWMTBIMTh6TTEwIDE0SDE0VjE4SDEwek0xOCAxNEgyMlYxOEgxOHpNMTAgMjJIMTRWMjZIMTB6TTE4IDIySDIyVjI2SDE4elwiXG4gICAgICAgICAgPjwvcGF0aD5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XG4gICAgICAgIDxpYm0tY2hlY2tib3ggW2NoZWNrZWRdPVwiY2hlY2tlZFwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiPlxuICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgPC9pYm0tY2hlY2tib3g+XG4gICAgICAgIDxpYm0tb3ZlcmZsb3ctbWVudSBbZmxpcF09XCJ0cnVlXCI+XG4gICAgICAgICAgPGlibS1vdmVyZmxvdy1tZW51LW9wdGlvbiAoc2VsZWN0ZWQpPVwibW92ZS5lbWl0KCd1cCcpXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICAgID5Nb3ZlIHVwPC9pYm0tb3ZlcmZsb3ctbWVudS1vcHRpb25cbiAgICAgICAgICA+XG4gICAgICAgICAgPGlibS1vdmVyZmxvdy1tZW51LW9wdGlvbiAoc2VsZWN0ZWQpPVwibW92ZS5lbWl0KCdkb3duJylcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgPk1vdmUgZG93bjwvaWJtLW92ZXJmbG93LW1lbnUtb3B0aW9uXG4gICAgICAgICAgPlxuICAgICAgICA8L2libS1vdmVyZmxvdy1tZW51PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlVXJsczogWycuL3NvcnRhYmxlLWxpc3QtaXRlbS5zY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIFNvcnRhYmxlTGlzdEl0ZW1Db21wb25lbnQge1xuICBASW5wdXQoKSBjaGVja2VkID0gdHJ1ZTtcblxuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIGRyYWdBY3RpdmUgPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgZHJhZ1N0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBPdXRwdXQoKSBkcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBPdXRwdXQoKSBtb3ZlID0gbmV3IEV2ZW50RW1pdHRlcjwndXAnIHwgJ2Rvd24nPigpO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuIl19