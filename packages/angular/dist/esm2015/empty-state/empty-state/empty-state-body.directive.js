/**
 *
 * @ai-apps/angular v2.155.1 | empty-state-body.directive.js
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


import { Directive, HostBinding } from '@angular/core';
export class EmptyStateBodyDirective {
    constructor() {
        this.classList = 'iot--empty-state--text';
    }
}
EmptyStateBodyDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiEmptyStateBody]',
            },] }
];
EmptyStateBodyDirective.propDecorators = {
    classList: [{ type: HostBinding, args: ['class',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHktc3RhdGUtYm9keS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZW1wdHktc3RhdGUvZW1wdHktc3RhdGUtYm9keS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFLdkQsTUFBTSxPQUFPLHVCQUF1QjtJQUhwQztRQUl3QixjQUFTLEdBQUcsd0JBQXdCLENBQUM7SUFDN0QsQ0FBQzs7O1lBTEEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7YUFDL0I7Ozt3QkFFRSxXQUFXLFNBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2FpRW1wdHlTdGF0ZUJvZHldJyxcbn0pXG5leHBvcnQgY2xhc3MgRW1wdHlTdGF0ZUJvZHlEaXJlY3RpdmUge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzJykgY2xhc3NMaXN0ID0gJ2lvdC0tZW1wdHktc3RhdGUtLXRleHQnO1xufVxuIl19