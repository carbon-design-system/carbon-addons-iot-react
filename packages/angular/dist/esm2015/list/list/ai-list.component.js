/**
 *
 * @ai-apps/angular v2.155.1 | ai-list.component.js
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


import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { AIListItem } from './list-item/ai-list-item.class';
import { IconService } from 'carbon-components-angular';
import { Bee32 } from '@carbon/icons';
export var SelectionType;
(function (SelectionType) {
    SelectionType["SINGLE"] = "single";
    SelectionType["MULTI"] = "multi";
})(SelectionType || (SelectionType = {}));
export class AIListComponent {
    constructor(iconService) {
        this.iconService = iconService;
        /**
         * Indicates whether a search bar should be rendered in the list header.
         */
        this.hasSearch = false;
        this.isFullHeight = false;
        /**
         * Text that is displayed when list is empty. To change the default
         * icon with the text, this can also be set to a `TemplateRef`.
         *
         * The reason we are using type `any` instead of `string | TemplateRef<any>`,
         * which is the only two types that should be accepted, is because
         * passing `emptyState` into `ngTemplateOutlet` would cause the error:
         * `Type 'string | TemplateRef<any>' is not assignable to type 'TemplateRef<any>'`
         * to come up while building.
         */
        this.emptyState = 'No list items to show';
        /**
         * If a `hasSearch` is true, this is emitted when search value is changed.
         */
        this.onSearch = new EventEmitter();
        this.isDraggingChange = new EventEmitter();
        this.draggedItemChange = new EventEmitter();
        this.searchString = '';
        this._isDragging = false;
        this._draggedItem = null;
    }
    set isDragging(isDragging) {
        let shouldEmit = false;
        if (this._isDragging !== isDragging) {
            shouldEmit = true;
        }
        this._isDragging = isDragging;
        if (shouldEmit) {
            this.isDraggingChange.emit(isDragging);
        }
    }
    get isDragging() {
        return this._isDragging;
    }
    set draggedItem(draggedItem) {
        let shouldEmit = false;
        if (this._draggedItem !== draggedItem) {
            shouldEmit = true;
        }
        this._draggedItem = draggedItem;
        if (shouldEmit) {
            this.draggedItemChange.emit(draggedItem);
        }
    }
    get draggedItem() {
        return this._draggedItem;
    }
    ngOnInit() {
        this.iconService.register(Bee32);
    }
    handleDragStart(item) {
        this.isDragging = true;
        this.draggedItem = item;
    }
    handleDragEnd(dragEvent, item, parent) {
        const dragEffect = dragEvent.dataTransfer.dropEffect;
        // Remove the original item if the dragged item has been successfully moved to a new position.
        if (dragEffect !== 'none') {
            if (parent === null) {
                const droppedItemIndex = this.items.findIndex((listItem) => listItem === item);
                this.items.splice(droppedItemIndex, 1);
            }
            else {
                const droppedItemIndex = parent.items.findIndex((listItem) => listItem === item);
                parent.items.splice(droppedItemIndex, 1);
            }
        }
        this.isDragging = false;
        this.draggedItem = null;
    }
    handleDragOver(dragEvent, receiver) {
        // Only allow dropping if:
        // 1. The dragged item is not being dropped onto one of its' own children.
        // 2. The dragged item is not being dropped onto itself.
        if (this.draggedItem &&
            !this.draggedItem.hasItem(receiver) &&
            (receiver === null || receiver.id !== this.draggedItem.id)) {
            dragEvent.preventDefault();
        }
    }
    handleDrop(receiver, index) {
        // A copy of the dragged item is created so that the original can be removed in `handleDragEnd`.
        const item = new AIListItem(this.draggedItem);
        if (receiver === null) {
            this.items.splice(index, 0, item);
        }
        else {
            receiver.addItem(item, index);
        }
    }
    handleSelect(selectedItem) {
        if (this.selectionType === SelectionType.MULTI) {
            this.updateChildSelectedStates(selectedItem);
            this.updateParentSelectedStates(this.items);
        }
        else {
            this.onSingleSelect(this.items, selectedItem.id);
        }
    }
    handleSearch(searchString) {
        this.searchString = searchString;
        this.onSearch.emit(searchString);
    }
    /**
     * This function returns the adjusted `nestingLevel`s of an AIListItem.
     */
    getAdjustedNestingLevel(items, currentDepth) {
        return items.some((item) => item.hasChildren()) ? currentDepth + 1 : currentDepth;
    }
    isArray(obj) {
        return Array.isArray(obj);
    }
    isTemplate(value) {
        return value instanceof TemplateRef;
    }
    updateChildSelectedStates(selectedItem) {
        if (selectedItem.hasChildren()) {
            selectedItem.items.forEach((item) => {
                if (!item.disabled) {
                    item.select(selectedItem.selected);
                }
                this.updateChildSelectedStates(item);
            });
        }
    }
    updateParentSelectedStates(items) {
        items.forEach((item) => {
            if (item.hasChildren()) {
                this.updateParentSelectedStates(item.items);
            }
            else {
                return;
            }
            if (item.isSelectable && item.allChildrenSelected()) {
                item.select();
                item.setIndeterminate(false);
            }
            else if (item.isSelectable && item.someChildrenSelected()) {
                item.select();
                item.setIndeterminate();
            }
            else {
                if (!item.items.every((listItem) => listItem.disabled)) {
                    item.select(false);
                }
                item.setIndeterminate(false);
            }
        });
    }
    onSingleSelect(items, selectedId) {
        items.forEach((item) => {
            if (item.id !== selectedId) {
                item.select(false);
            }
            if (item.hasChildren()) {
                this.onSingleSelect(item.items, selectedId);
            }
        });
    }
}
AIListComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-list',
                template: `
    <div class="iot--list" [ngClass]="{ 'iot--list__full-height': isFullHeight }">
      <ai-list-header [hasSearch]="hasSearch" [title]="title" (onSearch)="handleSearch($event)">
      </ai-list-header>
      <div
        class="iot--list--content"
        [ngClass]="{ 'iot--list--content__full-height': isFullHeight }"
      >
        <ng-container
          *ngIf="items && items.length > 0"
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
        </ng-container>
        <div
          *ngIf="!items || items.length < 1"
          class="iot--list--empty-state iot--list--empty-state__full-height"
          (drop)="isDragging ? handleDrop(null, 0) : undefined"
          (dragover)="$event.preventDefault()"
        >
          <ng-container *ngIf="!isTemplate(emptyState)">
            <svg ibmIcon="bee" size="32"></svg>
            <p>{{ emptyState }}</p>
          </ng-container>
          <ng-container *ngIf="isTemplate(emptyState)" [ngTemplateOutlet]="emptyState">
          </ng-container>
        </div>
      </div>
    </div>

    <ng-template #listItemTemplateRef let-data>
      <!-- Render item -->
      <ng-container *ngIf="data.item.id && !isArray(data.item) && data.item.includes(searchString)">
        <ai-list-item-wrapper
          [draggable]="itemsDraggable && data.item.isDraggable"
          [disabled]="data.item.disabled"
          [size]="data.item.size"
          [isDragging]="isDragging"
          (dragStart)="handleDragStart(data.item)"
          (dragEnd)="handleDragEnd($event, data.item, data.parentItem)"
          (droppedAbove)="handleDrop(data.parentItem, data.index)"
          (droppedBelow)="handleDrop(data.parentItem, data.index + 1)"
          (droppedNested)="handleDrop(data.item, 0)"
          (dragOverBelow)="handleDragOver($event, data.parentItem)"
          (dragOverAbove)="handleDragOver($event, data.parentItem)"
          (dragOverNested)="handleDragOver($event, data.item)"
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
  `
            },] }
];
AIListComponent.ctorParameters = () => [
    { type: IconService }
];
AIListComponent.propDecorators = {
    items: [{ type: Input }],
    selectionType: [{ type: Input }],
    itemsDraggable: [{ type: Input }],
    isDragging: [{ type: Input }],
    draggedItem: [{ type: Input }],
    hasSearch: [{ type: Input }],
    title: [{ type: Input }],
    isFullHeight: [{ type: Input }],
    emptyState: [{ type: Input }],
    onSearch: [{ type: Output }],
    isDraggingChange: [{ type: Output }],
    draggedItemChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWktbGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlzdC9haS1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1RixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdEMsTUFBTSxDQUFOLElBQVksYUFHWDtBQUhELFdBQVksYUFBYTtJQUN2QixrQ0FBaUIsQ0FBQTtJQUNqQixnQ0FBZSxDQUFBO0FBQ2pCLENBQUMsRUFIVyxhQUFhLEtBQWIsYUFBYSxRQUd4QjtBQXdHRCxNQUFNLE9BQU8sZUFBZTtJQTZFMUIsWUFBc0IsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFyQzlDOztXQUVHO1FBQ00sY0FBUyxHQUFHLEtBQUssQ0FBQztRQU9sQixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUU5Qjs7Ozs7Ozs7O1dBU0c7UUFDTSxlQUFVLEdBQVEsdUJBQXVCLENBQUM7UUFFbkQ7O1dBRUc7UUFDTyxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUV0QyxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBQy9DLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFjLENBQUM7UUFFN0QsaUJBQVksR0FBRyxFQUFFLENBQUM7UUFFUixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUNwQixpQkFBWSxHQUFlLElBQUksQ0FBQztJQUVPLENBQUM7SUFuRWxELElBQWEsVUFBVSxDQUFDLFVBQW1CO1FBQ3pDLElBQUksVUFBVSxHQUFHLEtB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QUFDO0lBQ0wsQ0FBQztJQUVTLGNBQWMsQ0FBQyxLQUFtQixFQUFFLFVBQWtCO1FBQzlELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFnQixFQUFFLEVBQUU7WUFDakMsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLFVBQVUsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNwQjtZQUVELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7YUFDN0M7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7OztZQWxURixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrR1Q7YUFDRjs7O1lBN0dRLFdBQVc7OztvQkErR2pCLEtBQUs7NEJBRUwsS0FBSzs2QkFLTCxLQUFLO3lCQUVMLEtBQUs7MEJBZUwsS0FBSzt3QkFrQkwsS0FBSztvQkFLTCxLQUFLOzJCQUVMLEtBQUs7eUJBWUwsS0FBSzt1QkFLTCxNQUFNOytCQUVOLE1BQU07Z0NBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBSUxpc3RJdGVtIH0gZnJvbSAnLi9saXN0LWl0ZW0vYWktbGlzdC1pdGVtLmNsYXNzJztcbmltcG9ydCB7IEljb25TZXJ2aWNlIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5pbXBvcnQgeyBCZWUzMiB9IGZyb20gJ0BjYXJib24vaWNvbnMnO1xuXG5leHBvcnQgZW51bSBTZWxlY3Rpb25UeXBlIHtcbiAgU0lOR0xFID0gJ3NpbmdsZScsXG4gIE1VTFRJID0gJ211bHRpJyxcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWktbGlzdCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImlvdC0tbGlzdFwiIFtuZ0NsYXNzXT1cInsgJ2lvdC0tbGlzdF9fZnVsbC1oZWlnaHQnOiBpc0Z1bGxIZWlnaHQgfVwiPlxuICAgICAgPGFpLWxpc3QtaGVhZGVyIFtoYXNTZWFyY2hdPVwiaGFzU2VhcmNoXCIgW3RpdGxlXT1cInRpdGxlXCIgKG9uU2VhcmNoKT1cImhhbmRsZVNlYXJjaCgkZXZlbnQpXCI+XG4gICAgICA8L2FpLWxpc3QtaGVhZGVyPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cImlvdC0tbGlzdC0tY29udGVudFwiXG4gICAgICAgIFtuZ0NsYXNzXT1cInsgJ2lvdC0tbGlzdC0tY29udGVudF9fZnVsbC1oZWlnaHQnOiBpc0Z1bGxIZWlnaHQgfVwiXG4gICAgICA+XG4gICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAqbmdJZj1cIml0ZW1zICYmIGl0ZW1zLmxlbmd0aCA+IDBcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxpc3RJdGVtVGVtcGxhdGVSZWZcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XG4gICAgICAgICAgICAkaW1wbGljaXQ6IHtcbiAgICAgICAgICAgICAgaXRlbTogaXRlbXMsXG4gICAgICAgICAgICAgIG5lc3RpbmdMZXZlbDogMCxcbiAgICAgICAgICAgICAgcGFyZW50SXRlbTogbnVsbCxcbiAgICAgICAgICAgICAgaW5kZXg6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XCJcbiAgICAgICAgPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgICpuZ0lmPVwiIWl0ZW1zIHx8IGl0ZW1zLmxlbmd0aCA8IDFcIlxuICAgICAgICAgIGNsYXNzPVwiaW90LS1saXN0LS1lbXB0eS1zdGF0ZSBpb3QtLWxpc3QtLWVtcHR5LXN0YXRlX19mdWxsLWhlaWdodFwiXG4gICAgICAgICAgKGRyb3ApPVwiaXNEcmFnZ2luZyA/IGhhbmRsZURyb3AobnVsbCwgMCkgOiB1bmRlZmluZWRcIlxuICAgICAgICAgIChkcmFnb3Zlcik9XCIkZXZlbnQucHJldmVudERlZmF1bHQoKVwiXG4gICAgICAgID5cbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWlzVGVtcGxhdGUoZW1wdHlTdGF0ZSlcIj5cbiAgICAgICAgICAgIDxzdmcgaWJtSWNvbj1cImJlZVwiIHNpemU9XCIzMlwiPjwvc3ZnPlxuICAgICAgICAgICAgPHA+e3sgZW1wdHlTdGF0ZSB9fTwvcD5cbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXNUZW1wbGF0ZShlbXB0eVN0YXRlKVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImVtcHR5U3RhdGVcIj5cbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxuZy10ZW1wbGF0ZSAjbGlzdEl0ZW1UZW1wbGF0ZVJlZiBsZXQtZGF0YT5cbiAgICAgIDwhLS0gUmVuZGVyIGl0ZW0gLS0+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZGF0YS5pdGVtLmlkICYmICFpc0FycmF5KGRhdGEuaXRlbSkgJiYgZGF0YS5pdGVtLmluY2x1ZGVzKHNlYXJjaFN0cmluZylcIj5cbiAgICAgICAgPGFpLWxpc3QtaXRlbS13cmFwcGVyXG4gICAgICAgICAgW2RyYWdnYWJsZV09XCJpdGVtc0RyYWdnYWJsZSAmJiBkYXRhLml0ZW0uaXNEcmFnZ2FibGVcIlxuICAgICAgICAgIFtkaXNhYmxlZF09XCJkYXRhLml0ZW0uZGlzYWJsZWRcIlxuICAgICAgICAgIFtzaXplXT1cImRhdGEuaXRlbS5zaXplXCJcbiAgICAgICAgICBbaXNEcmFnZ2luZ109XCJpc0RyYWdnaW5nXCJcbiAgICAgICAgICAoZHJhZ1N0YXJ0KT1cImhhbmRsZURyYWdTdGFydChkYXRhLml0ZW0pXCJcbiAgICAgICAgICAoZHJhZ0VuZCk9XCJoYW5kbGVEcmFnRW5kKCRldmVudCwgZGF0YS5pdGVtLCBkYXRhLnBhcmVudEl0ZW0pXCJcbiAgICAgICAgICAoZHJvcHBlZEFib3ZlKT1cImhhbmRsZURyb3AoZGF0YS5wYXJlbnRJdGVtLCBkYXRhLmluZGV4KVwiXG4gICAgICAgICAgKGRyb3BwZWRCZWxvdyk9XCJoYW5kbGVEcm9wKGRhdGEucGFyZW50SXRlbSwgZGF0YS5pbmRleCArIDEpXCJcbiAgICAgICAgICAoZHJvcHBlZE5lc3RlZCk9XCJoYW5kbGVEcm9wKGRhdGEuaXRlbSwgMClcIlxuICAgICAgICAgIChkcmFnT3ZlckJlbG93KT1cImhhbmRsZURyYWdPdmVyKCRldmVudCwgZGF0YS5wYXJlbnRJdGVtKVwiXG4gICAgICAgICAgKGRyYWdPdmVyQWJvdmUpPVwiaGFuZGxlRHJhZ092ZXIoJGV2ZW50LCBkYXRhLnBhcmVudEl0ZW0pXCJcbiAgICAgICAgICAoZHJhZ092ZXJOZXN0ZWQpPVwiaGFuZGxlRHJhZ092ZXIoJGV2ZW50LCBkYXRhLml0ZW0pXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxhaS1saXN0LWl0ZW1cbiAgICAgICAgICAgIFtpdGVtXT1cImRhdGEuaXRlbVwiXG4gICAgICAgICAgICBbbmVzdGluZ0xldmVsXT1cImRhdGEuaXRlbS5oYXNDaGlsZHJlbigpID8gZGF0YS5uZXN0aW5nTGV2ZWwgLSAxIDogZGF0YS5uZXN0aW5nTGV2ZWxcIlxuICAgICAgICAgICAgKGl0ZW1TZWxlY3RlZCk9XCJoYW5kbGVTZWxlY3QoZGF0YS5pdGVtKVwiXG4gICAgICAgICAgICBbc2VsZWN0aW9uVHlwZV09XCJzZWxlY3Rpb25UeXBlXCJcbiAgICAgICAgICAgIFtkcmFnZ2FibGVdPVwiaXRlbXNEcmFnZ2FibGVcIlxuICAgICAgICAgID5cbiAgICAgICAgICA8L2FpLWxpc3QtaXRlbT5cbiAgICAgICAgPC9haS1saXN0LWl0ZW0td3JhcHBlcj5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgICA8IS0tIEl0ZW0gaGFzIGNoaWxkcmVuIC0tPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFpc0FycmF5KGRhdGEuaXRlbSkgJiYgZGF0YS5pdGVtLmhhc0NoaWxkcmVuKCkgJiYgZGF0YS5pdGVtLmV4cGFuZGVkXCI+XG4gICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgaXRlbSBvZiBkYXRhLml0ZW0uaXRlbXM7IGluZGV4IGFzIGlcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxpc3RJdGVtVGVtcGxhdGVSZWZcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XG4gICAgICAgICAgICAkaW1wbGljaXQ6IHtcbiAgICAgICAgICAgICAgaXRlbTogaXRlbSxcbiAgICAgICAgICAgICAgbmVzdGluZ0xldmVsOiBnZXRBZGp1c3RlZE5lc3RpbmdMZXZlbChkYXRhLml0ZW0uaXRlbXMsIGRhdGEubmVzdGluZ0xldmVsKSxcbiAgICAgICAgICAgICAgcGFyZW50SXRlbTogZGF0YS5pdGVtLFxuICAgICAgICAgICAgICBpbmRleDogaVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cIlxuICAgICAgICA+PC9uZy1jb250YWluZXI+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cblxuICAgICAgPCEtLSBUb3AgbGV2ZWwgaXRlbSAtLT5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpc0FycmF5KGRhdGEuaXRlbSlcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICpuZ0Zvcj1cImxldCBpdGVtIG9mIGRhdGEuaXRlbTsgaW5kZXggYXMgaVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwibGlzdEl0ZW1UZW1wbGF0ZVJlZlwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgICAgICRpbXBsaWNpdDoge1xuICAgICAgICAgICAgICBpdGVtOiBpdGVtLFxuICAgICAgICAgICAgICBuZXN0aW5nTGV2ZWw6IGdldEFkanVzdGVkTmVzdGluZ0xldmVsKGRhdGEuaXRlbSwgZGF0YS5uZXN0aW5nTGV2ZWwpLFxuICAgICAgICAgICAgICBwYXJlbnRJdGVtOiBudWxsLFxuICAgICAgICAgICAgICBpbmRleDogaVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cIlxuICAgICAgICA+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQUlMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgaXRlbXM6IEFJTGlzdEl0ZW1bXTtcblxuICBASW5wdXQoKSBzZWxlY3Rpb25UeXBlOiBTZWxlY3Rpb25UeXBlO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgaXRlbXMgaW4gdGhlIGxpc3QgY2FuIGJlIGRyYWdnZWQgaW50byBuZXcgcG9zaXRpb25zLlxuICAgKi9cbiAgQElucHV0KCkgaXRlbXNEcmFnZ2FibGU6IGJvb2xlYW47XG5cbiAgQElucHV0KCkgc2V0IGlzRHJhZ2dpbmcoaXNEcmFnZ2luZzogYm9vbGVhbikge1xuICAgIGxldCBzaG91bGRFbWl0ID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuX2lzRHJhZ2dpbmcgIT09IGlzRHJhZ2dpbmcpIHtcbiAgICAgIHNob3VsZEVtaXQgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLl9pc0RyYWdnaW5nID0gaXNEcmFnZ2luZztcbiAgICBpZiAoc2hvdWxkRW1pdCkge1xuICAgICAgdGhpcy5pc0RyYWdnaW5nQ2hhbmdlLmVtaXQoaXNEcmFnZ2luZyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGlzRHJhZ2dpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzRHJhZ2dpbmc7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgZHJhZ2dlZEl0ZW0oZHJhZ2dlZEl0ZW06IEFJTGlzdEl0ZW0pIHtcbiAgICBsZXQgc2hvdWxkRW1pdCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLl9kcmFnZ2VkSXRlbSAhPT0gZHJhZ2dlZEl0ZW0pIHtcbiAgICAgIHNob3VsZEVtaXQgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLl9kcmFnZ2VkSXRlbSA9IGRyYWdnZWRJdGVtO1xuICAgIGlmIChzaG91bGRFbWl0KSB7XG4gICAgICB0aGlzLmRyYWdnZWRJdGVtQ2hhbmdlLmVtaXQoZHJhZ2dlZEl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIGdldCBkcmFnZ2VkSXRlbSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZHJhZ2dlZEl0ZW07XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgYSBzZWFyY2ggYmFyIHNob3VsZCBiZSByZW5kZXJlZCBpbiB0aGUgbGlzdCBoZWFkZXIuXG4gICAqL1xuICBASW5wdXQoKSBoYXNTZWFyY2ggPSBmYWxzZTtcblxuICAvKipcbiAgICogVGl0bGUgdG8gYmUgZGlzcGxheWVkIG9uIHRoZSBsaXN0IGhlYWRlci5cbiAgICovXG4gIEBJbnB1dCgpIHRpdGxlOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgaXNGdWxsSGVpZ2h0ID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRleHQgdGhhdCBpcyBkaXNwbGF5ZWQgd2hlbiBsaXN0IGlzIGVtcHR5LiBUbyBjaGFuZ2UgdGhlIGRlZmF1bHRcbiAgICogaWNvbiB3aXRoIHRoZSB0ZXh0LCB0aGlzIGNhbiBhbHNvIGJlIHNldCB0byBhIGBUZW1wbGF0ZVJlZmAuXG4gICAqXG4gICAqIFRoZSByZWFzb24gd2UgYXJlIHVzaW5nIHR5cGUgYGFueWAgaW5zdGVhZCBvZiBgc3RyaW5nIHwgVGVtcGxhdGVSZWY8YW55PmAsXG4gICAqIHdoaWNoIGlzIHRoZSBvbmx5IHR3byB0eXBlcyB0aGF0IHNob3VsZCBiZSBhY2NlcHRlZCwgaXMgYmVjYXVzZVxuICAgKiBwYXNzaW5nIGBlbXB0eVN0YXRlYCBpbnRvIGBuZ1RlbXBsYXRlT3V0bGV0YCB3b3VsZCBjYXVzZSB0aGUgZXJyb3I6XG4gICAqIGBUeXBlICdzdHJpbmcgfCBUZW1wbGF0ZVJlZjxhbnk+JyBpcyBub3QgYXNzaWduYWJsZSB0byB0eXBlICdUZW1wbGF0ZVJlZjxhbnk+J2BcbiAgICogdG8gY29tZSB1cCB3aGlsZSBidWlsZGluZy5cbiAgICovXG4gIEBJbnB1dCgpIGVtcHR5U3RhdGU6IGFueSA9ICdObyBsaXN0IGl0ZW1zIHRvIHNob3cnO1xuXG4gIC8qKlxuICAgKiBJZiBhIGBoYXNTZWFyY2hgIGlzIHRydWUsIHRoaXMgaXMgZW1pdHRlZCB3aGVuIHNlYXJjaCB2YWx1ZSBpcyBjaGFuZ2VkLlxuICAgKi9cbiAgQE91dHB1dCgpIG9uU2VhcmNoID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgQE91dHB1dCgpIGlzRHJhZ2dpbmdDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIEBPdXRwdXQoKSBkcmFnZ2VkSXRlbUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8QUlMaXN0SXRlbT4oKTtcblxuICBzZWFyY2hTdHJpbmcgPSAnJztcblxuICBwcm90ZWN0ZWQgX2lzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgcHJvdGVjdGVkIF9kcmFnZ2VkSXRlbTogQUlMaXN0SXRlbSA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGljb25TZXJ2aWNlOiBJY29uU2VydmljZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmljb25TZXJ2aWNlLnJlZ2lzdGVyKEJlZTMyKTtcbiAgfVxuXG4gIGhhbmRsZURyYWdTdGFydChpdGVtOiBBSUxpc3RJdGVtKSB7XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmRyYWdnZWRJdGVtID0gaXRlbTtcbiAgfVxuXG4gIGhhbmRsZURyYWdFbmQoZHJhZ0V2ZW50OiBEcmFnRXZlbnQsIGl0ZW06IEFJTGlzdEl0ZW0sIHBhcmVudDogQUlMaXN0SXRlbSkge1xuICAgIGNvbnN0IGRyYWdFZmZlY3QgPSBkcmFnRXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3Q7XG5cbiAgICAvLyBSZW1vdmUgdGhlIG9yaWdpbmFsIGl0ZW0gaWYgdGhlIGRyYWdnZWQgaXRlbSBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgbW92ZWQgdG8gYSBuZXcgcG9zaXRpb24uXG4gICAgaWYgKGRyYWdFZmZlY3QgIT09ICdub25lJykge1xuICAgICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICBjb25zdCBkcm9wcGVkSXRlbUluZGV4ID0gdGhpcy5pdGVtcy5maW5kSW5kZXgoKGxpc3RJdGVtOiBBSUxpc3RJdGVtKSA9PiBsaXN0SXRlbSA9PT0gaXRlbSk7XG4gICAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKGRyb3BwZWRJdGVtSW5kZXgsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZHJvcHBlZEl0ZW1JbmRleCA9IHBhcmVudC5pdGVtcy5maW5kSW5kZXgoXG4gICAgICAgICAgKGxpc3RJdGVtOiBBSUxpc3RJdGVtKSA9PiBsaXN0SXRlbSA9PT0gaXRlbVxuICAgICAgICApO1xuICAgICAgICBwYXJlbnQuaXRlbXMuc3BsaWNlKGRyb3BwZWRJdGVtSW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIHRoaXMuZHJhZ2dlZEl0ZW0gPSBudWxsO1xuICB9XG5cbiAgaGFuZGxlRHJhZ092ZXIoZHJhZ0V2ZW50OiBEcmFnRXZlbnQsIHJlY2VpdmVyOiBBSUxpc3RJdGVtKSB7XG4gICAgLy8gT25seSBhbGxvdyBkcm9wcGluZyBpZjpcbiAgICAvLyAxLiBUaGUgZHJhZ2dlZCBpdGVtIGlzIG5vdCBiZWluZyBkcm9wcGVkIG9udG8gb25lIG9mIGl0cycgb3duIGNoaWxkcmVuLlxuICAgIC8vIDIuIFRoZSBkcmFnZ2VkIGl0ZW0gaXMgbm90IGJlaW5nIGRyb3BwZWQgb250byBpdHNlbGYuXG4gICAgaWYgKFxuICAgICAgdGhpcy5kcmFnZ2VkSXRlbSAmJlxuICAgICAgIXRoaXMuZHJhZ2dlZEl0ZW0uaGFzSXRlbShyZWNlaXZlcikgJiZcbiAgICAgIChyZWNlaXZlciA9PT0gbnVsbCB8fCByZWNlaXZlci5pZCAhPT0gdGhpcy5kcmFnZ2VkSXRlbS5pZClcbiAgICApIHtcbiAgICAgIGRyYWdFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZURyb3AocmVjZWl2ZXI6IEFJTGlzdEl0ZW0sIGluZGV4OiBudW1iZXIpIHtcbiAgICAvLyBBIGNvcHkgb2YgdGhlIGRyYWdnZWQgaXRlbSBpcyBjcmVhdGVkIHNvIHRoYXQgdGhlIG9yaWdpbmFsIGNhbiBiZSByZW1vdmVkIGluIGBoYW5kbGVEcmFnRW5kYC5cbiAgICBjb25zdCBpdGVtID0gbmV3IEFJTGlzdEl0ZW0odGhpcy5kcmFnZ2VkSXRlbSk7XG4gICAgaWYgKHJlY2VpdmVyID09PSBudWxsKSB7XG4gICAgICB0aGlzLml0ZW1zLnNwbGljZShpbmRleCwgMCwgaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlY2VpdmVyLmFkZEl0ZW0oaXRlbSwgaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVNlbGVjdChzZWxlY3RlZEl0ZW06IEFJTGlzdEl0ZW0pIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLk1VTFRJKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoaWxkU2VsZWN0ZWRTdGF0ZXMoc2VsZWN0ZWRJdGVtKTtcbiAgICAgIHRoaXMudXBkYXRlUGFyZW50U2VsZWN0ZWRTdGF0ZXModGhpcy5pdGVtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25TaW5nbGVTZWxlY3QodGhpcy5pdGVtcywgc2VsZWN0ZWRJdGVtLmlkKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTZWFyY2goc2VhcmNoU3RyaW5nOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNlYXJjaFN0cmluZyA9IHNlYXJjaFN0cmluZztcbiAgICB0aGlzLm9uU2VhcmNoLmVtaXQoc2VhcmNoU3RyaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGFkanVzdGVkIGBuZXN0aW5nTGV2ZWxgcyBvZiBhbiBBSUxpc3RJdGVtLlxuICAgKi9cbiAgZ2V0QWRqdXN0ZWROZXN0aW5nTGV2ZWwoaXRlbXM6IEFJTGlzdEl0ZW1bXSwgY3VycmVudERlcHRoOiBudW1iZXIpIHtcbiAgICByZXR1cm4gaXRlbXMuc29tZSgoaXRlbSkgPT4gaXRlbS5oYXNDaGlsZHJlbigpKSA/IGN1cnJlbnREZXB0aCArIDEgOiBjdXJyZW50RGVwdGg7XG4gIH1cblxuICBpc0FycmF5KG9iajogYW55KSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcbiAgfVxuXG4gIHB1YmxpYyBpc1RlbXBsYXRlKHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZjtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVDaGlsZFNlbGVjdGVkU3RhdGVzKHNlbGVjdGVkSXRlbTogQUlMaXN0SXRlbSkge1xuICAgIGlmIChzZWxlY3RlZEl0ZW0uaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgc2VsZWN0ZWRJdGVtLml0ZW1zLmZvckVhY2goKGl0ZW06IEFJTGlzdEl0ZW0pID0+IHtcbiAgICAgICAgaWYgKCFpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgaXRlbS5zZWxlY3Qoc2VsZWN0ZWRJdGVtLnNlbGVjdGVkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZUNoaWxkU2VsZWN0ZWRTdGF0ZXMoaXRlbSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlUGFyZW50U2VsZWN0ZWRTdGF0ZXMoaXRlbXM6IEFJTGlzdEl0ZW1bXSkge1xuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW06IEFJTGlzdEl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtLmhhc0NoaWxkcmVuKCkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJlbnRTZWxlY3RlZFN0YXRlcyhpdGVtLml0ZW1zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uaXNTZWxlY3RhYmxlICYmIGl0ZW0uYWxsQ2hpbGRyZW5TZWxlY3RlZCgpKSB7XG4gICAgICAgIGl0ZW0uc2VsZWN0KCk7XG4gICAgICAgIGl0ZW0uc2V0SW5kZXRlcm1pbmF0ZShmYWxzZSk7XG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uaXNTZWxlY3RhYmxlICYmIGl0ZW0uc29tZUNoaWxkcmVuU2VsZWN0ZWQoKSkge1xuICAgICAgICBpdGVtLnNlbGVjdCgpO1xuICAgICAgICBpdGVtLnNldEluZGV0ZXJtaW5hdGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaXRlbS5pdGVtcy5ldmVyeSgobGlzdEl0ZW0pID0+IGxpc3RJdGVtLmRpc2FibGVkKSkge1xuICAgICAgICAgIGl0ZW0uc2VsZWN0KGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtLnNldEluZGV0ZXJtaW5hdGUoZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uU2luZ2xlU2VsZWN0KGl0ZW1zOiBBSUxpc3RJdGVtW10sIHNlbGVjdGVkSWQ6IHN0cmluZykge1xuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW06IEFJTGlzdEl0ZW0pID0+IHtcbiAgICAgIGlmIChpdGVtLmlkICE9PSBzZWxlY3RlZElkKSB7XG4gICAgICAgIGl0ZW0uc2VsZWN0KGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW0uaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgICB0aGlzLm9uU2luZ2xlU2VsZWN0KGl0ZW0uaXRlbXMsIHNlbGVjdGVkSWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=