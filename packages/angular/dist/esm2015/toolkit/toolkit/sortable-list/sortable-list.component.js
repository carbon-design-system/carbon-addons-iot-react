/**
 *
 * @ai-apps/angular v2.155.1 | sortable-list.component.js
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
/**
 * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-sortable-list component
 */
export class SortableListComponent {
    constructor() {
        this.itemsChange = new EventEmitter();
        this.dragging = null;
        this.dragOver = null;
    }
    trackByFn(index, item) {
        return item;
    }
    dragStart(item) {
        this.dragging = item;
    }
    active(item) {
        this.dragOver = item;
    }
    leave() {
        this.dragOver = null;
    }
    isActive(item) {
        return this.dragOver === item;
    }
    end() {
        this.dragOver = null;
        this.dragging = null;
    }
    handleDrop() {
        if (!this.dragging) {
            return;
        }
        this.items = this.insertBefore(this.dragging, this.dragOver);
        this.end();
        this.itemsChange.emit(this.items);
    }
    handleMove(direction, item) {
        const itemIndex = this.items.indexOf(item);
        if (direction === 'up') {
            if (!this.items[itemIndex - 1]) {
                return;
            }
            this.items = this.insertBefore(item, this.items[itemIndex - 1]);
        }
        else if (direction === 'down') {
            const baseItem = this.items[itemIndex + 2] ? this.items[itemIndex + 2] : 'bottom';
            this.items = this.insertBefore(item, baseItem);
        }
    }
    insertBefore(itemToMove, baseItem) {
        const tmpItems = Array.from(this.items);
        const itemToMoveIndex = tmpItems.indexOf(itemToMove);
        tmpItems.splice(itemToMoveIndex, 1);
        if (baseItem === 'bottom') {
            tmpItems.push(itemToMove);
        }
        else {
            const insertionPointIndex = tmpItems.indexOf(baseItem);
            tmpItems.splice(insertionPointIndex, 0, itemToMove);
        }
        return tmpItems;
    }
}
SortableListComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-sortable-list',
                template: `
    <ol>
      <ng-container *ngFor="let item of items; trackBy: trackByFn">
        <li
          scDropzone
          class="dropzone"
          [ngClass]="{
            active: isActive(item),
            visible: dragging
          }"
          (dropping)="handleDrop()"
          (active)="active(item)"
          (leave)="leave()"
        >
          <div class="line"></div>
        </li>
        <sc-sortable-list-item
          [disabled]="item.disabled"
          (dragStart)="dragStart(item)"
          (dragEnd)="end()"
          (move)="handleMove($event, item)"
        >
          <ng-container *ngIf="!item.template">{{ item?.content | async }}</ng-container>
          <ng-template
            *ngIf="item.template"
            [ngTemplateOutlet]="item.template"
            [ngTemplateOutletContext]="item"
          >
          </ng-template>
        </sc-sortable-list-item>
      </ng-container>
      <li
        scDropzone
        class="dropzone bottom"
        [ngClass]="{
          active: isActive('bottom'),
          visible: dragging
        }"
        (dropping)="handleDrop()"
        (active)="active('bottom')"
        (leave)="leave()"
      >
        <div class="line"></div>
      </li>
    </ol>
  `,
                styles: ["ol{padding-bottom:4px;padding-top:4px;position:relative}.dropzone{display:none;height:2.5rem;margin-top:-28px;padding-left:1rem;padding-right:1rem;position:absolute;width:100%}.dropzone.active .line{border-top:1px solid #0f62fe;position:relative;top:24px;width:100%}.visible{display:block}"]
            },] }
];
SortableListComponent.propDecorators = {
    items: [{ type: Input }],
    itemsChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGUtbGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvdG9vbGtpdC9zb3J0YWJsZS1saXN0L3NvcnRhYmxlLWxpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFRdkU7O0dBRUc7QUFtREgsTUFBTSxPQUFPLHFCQUFxQjtJQWxEbEM7UUFxRFksZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBcUIsQ0FBQztRQUV2RCxhQUFRLEdBQUcsSUFBSSxDQUFDO1FBRWhCLGFBQVEsR0FBRyxJQUFJLENBQUM7SUFtRXpCLENBQUM7SUFqRUMsU0FBUyxDQUFDLEtBQWEsRUFBRSxJQUFzQjtRQUM3QyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxTQUFTLENBQUMsSUFBc0I7UUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFpQztRQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN2QixDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxRQUFRLENBQUMsSUFBaUM7UUFDeEMsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQztJQUNoQyxDQUFDO0lBRUQsR0FBRztRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVYLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsVUFBVSxDQUFDLFNBQXdCLEVBQUUsSUFBc0I7UUFDekQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDOUIsT0FBTzthQUNSO1lBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pFO2FBQU0sSUFBSSxTQUFTLEtBQUssTUFBTSxFQUFFO1lBQy9CLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQ2xGLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDaEQ7SUFDSCxDQUFDO0lBRVMsWUFBWSxDQUFDLFVBQTRCLEVBQUUsUUFBcUM7UUFDeEYsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFeEMsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRCxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVwQyxJQUFJLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDekIsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMzQjthQUFNO1lBQ0wsTUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELFFBQVEsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ3JEO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQzs7O1lBM0hGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZDVDs7YUFFRjs7O29CQUVFLEtBQUs7MEJBRUwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMaXN0SXRlbSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuaW1wb3J0IHsgU29ydGFibGVMaXN0T3B0aW9uIH0gZnJvbSAnLi9zb3J0YWJsZS1saXN0LW1vZGVsLmNsYXNzJztcblxuZXhwb3J0IHR5cGUgU29ydGFibGVMaXN0SXRlbSA9IFNvcnRhYmxlTGlzdE9wdGlvbiAmIExpc3RJdGVtO1xuXG5leHBvcnQgdHlwZSBTb3J0YWJsZUxpc3RJdGVtcyA9IFNvcnRhYmxlTGlzdEl0ZW1bXTtcblxuLyoqXG4gKiAqKldhcm5pbmc6KiogVGhpcyBjb21wb25lbnQgd2lsbCBiZSBkZXByZWNhdGVkIGluIHRoZSBmdXR1cmUgaW4gZmF2b3VyIG9mIGEgc3BlYyBjb21wbGlhbnQgYWktc29ydGFibGUtbGlzdCBjb21wb25lbnRcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnc2Mtc29ydGFibGUtbGlzdCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG9sPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgaXRlbSBvZiBpdGVtczsgdHJhY2tCeTogdHJhY2tCeUZuXCI+XG4gICAgICAgIDxsaVxuICAgICAgICAgIHNjRHJvcHpvbmVcbiAgICAgICAgICBjbGFzcz1cImRyb3B6b25lXCJcbiAgICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICBhY3RpdmU6IGlzQWN0aXZlKGl0ZW0pLFxuICAgICAgICAgICAgdmlzaWJsZTogZHJhZ2dpbmdcbiAgICAgICAgICB9XCJcbiAgICAgICAgICAoZHJvcHBpbmcpPVwiaGFuZGxlRHJvcCgpXCJcbiAgICAgICAgICAoYWN0aXZlKT1cImFjdGl2ZShpdGVtKVwiXG4gICAgICAgICAgKGxlYXZlKT1cImxlYXZlKClcIlxuICAgICAgICA+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImxpbmVcIj48L2Rpdj5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPHNjLXNvcnRhYmxlLWxpc3QtaXRlbVxuICAgICAgICAgIFtkaXNhYmxlZF09XCJpdGVtLmRpc2FibGVkXCJcbiAgICAgICAgICAoZHJhZ1N0YXJ0KT1cImRyYWdTdGFydChpdGVtKVwiXG4gICAgICAgICAgKGRyYWdFbmQpPVwiZW5kKClcIlxuICAgICAgICAgIChtb3ZlKT1cImhhbmRsZU1vdmUoJGV2ZW50LCBpdGVtKVwiXG4gICAgICAgID5cbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWl0ZW0udGVtcGxhdGVcIj57eyBpdGVtPy5jb250ZW50IHwgYXN5bmMgfX08L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgICAgICpuZ0lmPVwiaXRlbS50ZW1wbGF0ZVwiXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJpdGVtLnRlbXBsYXRlXCJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJpdGVtXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9zYy1zb3J0YWJsZS1saXN0LWl0ZW0+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDxsaVxuICAgICAgICBzY0Ryb3B6b25lXG4gICAgICAgIGNsYXNzPVwiZHJvcHpvbmUgYm90dG9tXCJcbiAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgIGFjdGl2ZTogaXNBY3RpdmUoJ2JvdHRvbScpLFxuICAgICAgICAgIHZpc2libGU6IGRyYWdnaW5nXG4gICAgICAgIH1cIlxuICAgICAgICAoZHJvcHBpbmcpPVwiaGFuZGxlRHJvcCgpXCJcbiAgICAgICAgKGFjdGl2ZSk9XCJhY3RpdmUoJ2JvdHRvbScpXCJcbiAgICAgICAgKGxlYXZlKT1cImxlYXZlKClcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibGluZVwiPjwvZGl2PlxuICAgICAgPC9saT5cbiAgICA8L29sPlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi9zb3J0YWJsZS1saXN0LnNjc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgU29ydGFibGVMaXN0Q29tcG9uZW50IHtcbiAgQElucHV0KCkgaXRlbXM6IFNvcnRhYmxlTGlzdEl0ZW1zO1xuXG4gIEBPdXRwdXQoKSBpdGVtc0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8U29ydGFibGVMaXN0SXRlbXM+KCk7XG5cbiAgcHVibGljIGRyYWdnaW5nID0gbnVsbDtcblxuICBwdWJsaWMgZHJhZ092ZXIgPSBudWxsO1xuXG4gIHRyYWNrQnlGbihpbmRleDogbnVtYmVyLCBpdGVtOiBTb3J0YWJsZUxpc3RJdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICBkcmFnU3RhcnQoaXRlbTogU29ydGFibGVMaXN0SXRlbSkge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBpdGVtO1xuICB9XG5cbiAgYWN0aXZlKGl0ZW06IFNvcnRhYmxlTGlzdEl0ZW0gfCAnYm90dG9tJykge1xuICAgIHRoaXMuZHJhZ092ZXIgPSBpdGVtO1xuICB9XG5cbiAgbGVhdmUoKSB7XG4gICAgdGhpcy5kcmFnT3ZlciA9IG51bGw7XG4gIH1cblxuICBpc0FjdGl2ZShpdGVtOiBTb3J0YWJsZUxpc3RJdGVtIHwgJ2JvdHRvbScpIHtcbiAgICByZXR1cm4gdGhpcy5kcmFnT3ZlciA9PT0gaXRlbTtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICB0aGlzLmRyYWdPdmVyID0gbnVsbDtcbiAgICB0aGlzLmRyYWdnaW5nID0gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZURyb3AoKSB7XG4gICAgaWYgKCF0aGlzLmRyYWdnaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5pdGVtcyA9IHRoaXMuaW5zZXJ0QmVmb3JlKHRoaXMuZHJhZ2dpbmcsIHRoaXMuZHJhZ092ZXIpO1xuXG4gICAgdGhpcy5lbmQoKTtcblxuICAgIHRoaXMuaXRlbXNDaGFuZ2UuZW1pdCh0aGlzLml0ZW1zKTtcbiAgfVxuXG4gIGhhbmRsZU1vdmUoZGlyZWN0aW9uOiAndXAnIHwgJ2Rvd24nLCBpdGVtOiBTb3J0YWJsZUxpc3RJdGVtKSB7XG4gICAgY29uc3QgaXRlbUluZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xuICAgIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcbiAgICAgIGlmICghdGhpcy5pdGVtc1tpdGVtSW5kZXggLSAxXSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLml0ZW1zID0gdGhpcy5pbnNlcnRCZWZvcmUoaXRlbSwgdGhpcy5pdGVtc1tpdGVtSW5kZXggLSAxXSk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJykge1xuICAgICAgY29uc3QgYmFzZUl0ZW0gPSB0aGlzLml0ZW1zW2l0ZW1JbmRleCArIDJdID8gdGhpcy5pdGVtc1tpdGVtSW5kZXggKyAyXSA6ICdib3R0b20nO1xuICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuaW5zZXJ0QmVmb3JlKGl0ZW0sIGJhc2VJdGVtKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5zZXJ0QmVmb3JlKGl0ZW1Ub01vdmU6IFNvcnRhYmxlTGlzdEl0ZW0sIGJhc2VJdGVtOiBTb3J0YWJsZUxpc3RJdGVtIHwgJ2JvdHRvbScpIHtcbiAgICBjb25zdCB0bXBJdGVtcyA9IEFycmF5LmZyb20odGhpcy5pdGVtcyk7XG5cbiAgICBjb25zdCBpdGVtVG9Nb3ZlSW5kZXggPSB0bXBJdGVtcy5pbmRleE9mKGl0ZW1Ub01vdmUpO1xuICAgIHRtcEl0ZW1zLnNwbGljZShpdGVtVG9Nb3ZlSW5kZXgsIDEpO1xuXG4gICAgaWYgKGJhc2VJdGVtID09PSAnYm90dG9tJykge1xuICAgICAgdG1wSXRlbXMucHVzaChpdGVtVG9Nb3ZlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5zZXJ0aW9uUG9pbnRJbmRleCA9IHRtcEl0ZW1zLmluZGV4T2YoYmFzZUl0ZW0pO1xuICAgICAgdG1wSXRlbXMuc3BsaWNlKGluc2VydGlvblBvaW50SW5kZXgsIDAsIGl0ZW1Ub01vdmUpO1xuICAgIH1cblxuICAgIHJldHVybiB0bXBJdGVtcztcbiAgfVxufVxuIl19