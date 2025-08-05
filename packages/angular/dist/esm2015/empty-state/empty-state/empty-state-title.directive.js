/**
 *
 * @ai-apps/angular v2.155.1 | empty-state-title.directive.js
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
export class EmptyStateTitleDirective {
    constructor() {
        this.classList = 'iot--empty-state--title';
    }
}
EmptyStateTitleDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiEmptyStateTitle]',
            },] }
];
EmptyStateTitleDirective.propDecorators = {
    classList: [{ type: HostBinding, args: ['class',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHktc3RhdGUtdGl0bGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2VtcHR5LXN0YXRlL2VtcHR5LXN0YXRlLXRpdGxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUt2RCxNQUFNLE9BQU8sd0JBQXdCO0lBSHJDO1FBSXdCLGNBQVMsR0FBRyx5QkFBeUIsQ0FBQztJQUM5RCxDQUFDOzs7WUFMQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjthQUNoQzs7O3dCQUVFLFdBQVcsU0FBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYWlFbXB0eVN0YXRlVGl0bGVdJyxcbn0pXG5leHBvcnQgY2xhc3MgRW1wdHlTdGF0ZVRpdGxlRGlyZWN0aXZlIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpIGNsYXNzTGlzdCA9ICdpb3QtLWVtcHR5LXN0YXRlLS10aXRsZSc7XG59XG4iXX0=