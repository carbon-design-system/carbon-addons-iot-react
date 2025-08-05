/**
 *
 * @ai-apps/angular v2.155.1 | card-toolbar.component.js
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


import { Component, HostBinding } from '@angular/core';
export class CardToolbarComponent {
    constructor() {
        this.toolbarClass = true;
    }
}
CardToolbarComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-card-toolbar',
                template: ` <ng-content></ng-content> `
            },] }
];
CardToolbarComponent.propDecorators = {
    toolbarClass: [{ type: HostBinding, args: ['class.iot--card--toolbar',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC10b29sYmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jYXJkL2NhcmQtdG9vbGJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFNdkQsTUFBTSxPQUFPLG9CQUFvQjtJQUpqQztRQUsyQyxpQkFBWSxHQUFHLElBQUksQ0FBQztJQUMvRCxDQUFDOzs7WUFOQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsUUFBUSxFQUFFLDZCQUE2QjthQUN4Qzs7OzJCQUVFLFdBQVcsU0FBQywwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLWNhcmQtdG9vbGJhcicsXG4gIHRlbXBsYXRlOiBgIDxuZy1jb250ZW50PjwvbmctY29udGVudD4gYCxcbn0pXG5leHBvcnQgY2xhc3MgQ2FyZFRvb2xiYXJDb21wb25lbnQge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tY2FyZC0tdG9vbGJhcicpIHRvb2xiYXJDbGFzcyA9IHRydWU7XG59XG4iXX0=