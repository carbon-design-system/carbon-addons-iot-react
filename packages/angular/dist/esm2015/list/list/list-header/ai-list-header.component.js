/**
 *
 * @ai-apps/angular v2.155.1 | ai-list-header.component.js
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
export class AIListHeaderComponent {
    constructor() {
        /**
         * Indicates whether a search bar should be rendered in the list header.
         */
        this.hasSearch = false;
        /**
         * If a `hasSearch` is true, this is emitted when search value is changed.
         */
        this.onSearch = new EventEmitter();
    }
}
AIListHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-list-header',
                template: `
    <div class="iot--list-header-container">
      <div class="iot--list-header">
        <div class="iot--list-header--title">
          {{ title }}
        </div>
      </div>
      <div *ngIf="hasSearch" class="iot--list-header--search">
        <ibm-search
          placeholder="search"
          (valueChange)="onSearch.emit($event)"
          (clear)="onSearch.emit('')"
        >
        </ibm-search>
      </div>
    </div>
  `
            },] }
];
AIListHeaderComponent.propDecorators = {
    title: [{ type: Input }],
    hasSearch: [{ type: Input }],
    onSearch: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWktbGlzdC1oZWFkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpc3QvbGlzdC1oZWFkZXIvYWktbGlzdC1oZWFkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFzQnZFLE1BQU0sT0FBTyxxQkFBcUI7SUFwQmxDO1FBMEJFOztXQUVHO1FBQ00sY0FBUyxHQUFHLEtBQUssQ0FBQztRQUUzQjs7V0FFRztRQUNPLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBQy9DLENBQUM7OztZQW5DQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JUO2FBQ0Y7OztvQkFLRSxLQUFLO3dCQUtMLEtBQUs7dUJBS0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLWxpc3QtaGVhZGVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiaW90LS1saXN0LWhlYWRlci1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpb3QtLWxpc3QtaGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpb3QtLWxpc3QtaGVhZGVyLS10aXRsZVwiPlxuICAgICAgICAgIHt7IHRpdGxlIH19XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2ICpuZ0lmPVwiaGFzU2VhcmNoXCIgY2xhc3M9XCJpb3QtLWxpc3QtaGVhZGVyLS1zZWFyY2hcIj5cbiAgICAgICAgPGlibS1zZWFyY2hcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cInNlYXJjaFwiXG4gICAgICAgICAgKHZhbHVlQ2hhbmdlKT1cIm9uU2VhcmNoLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgKGNsZWFyKT1cIm9uU2VhcmNoLmVtaXQoJycpXCJcbiAgICAgICAgPlxuICAgICAgICA8L2libS1zZWFyY2g+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQUlMaXN0SGVhZGVyQ29tcG9uZW50IHtcbiAgLyoqXG4gICAqIFRpdGxlIHRvIGJlIGRpc3BsYXllZCBvbiB0aGUgbGlzdCBoZWFkZXIuXG4gICAqL1xuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBhIHNlYXJjaCBiYXIgc2hvdWxkIGJlIHJlbmRlcmVkIGluIHRoZSBsaXN0IGhlYWRlci5cbiAgICovXG4gIEBJbnB1dCgpIGhhc1NlYXJjaCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJZiBhIGBoYXNTZWFyY2hgIGlzIHRydWUsIHRoaXMgaXMgZW1pdHRlZCB3aGVuIHNlYXJjaCB2YWx1ZSBpcyBjaGFuZ2VkLlxuICAgKi9cbiAgQE91dHB1dCgpIG9uU2VhcmNoID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG59XG4iXX0=