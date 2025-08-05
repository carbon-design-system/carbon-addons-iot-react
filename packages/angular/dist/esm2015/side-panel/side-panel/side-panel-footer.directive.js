/**
 *
 * @ai-apps/angular v2.155.1 | side-panel-footer.directive.js
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
/**
 * selector: `aiSidePanelFooter`
 */
export class SidePanelFooterDirective {
    constructor() {
        this.footerClass = true;
    }
}
SidePanelFooterDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiSidePanelFooter]',
                exportAs: 'aiSidePanelFooter',
            },] }
];
SidePanelFooterDirective.propDecorators = {
    footerClass: [{ type: HostBinding, args: ['class.iot--side-panel-footer',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZS1wYW5lbC1mb290ZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NpZGUtcGFuZWwvc2lkZS1wYW5lbC1mb290ZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZEOztHQUVHO0FBS0gsTUFBTSxPQUFPLHdCQUF3QjtJQUpyQztRQUsrQyxnQkFBVyxHQUFHLElBQUksQ0FBQztJQUNsRSxDQUFDOzs7WUFOQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsUUFBUSxFQUFFLG1CQUFtQjthQUM5Qjs7OzBCQUVFLFdBQVcsU0FBQyw4QkFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogc2VsZWN0b3I6IGBhaVNpZGVQYW5lbEZvb3RlcmBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2FpU2lkZVBhbmVsRm9vdGVyXScsXG4gIGV4cG9ydEFzOiAnYWlTaWRlUGFuZWxGb290ZXInLFxufSlcbmV4cG9ydCBjbGFzcyBTaWRlUGFuZWxGb290ZXJEaXJlY3RpdmUge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tc2lkZS1wYW5lbC1mb290ZXInKSBmb290ZXJDbGFzcyA9IHRydWU7XG59XG4iXX0=