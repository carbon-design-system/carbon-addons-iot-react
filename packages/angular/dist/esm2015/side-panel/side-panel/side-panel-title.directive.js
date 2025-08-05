/**
 *
 * @ai-apps/angular v2.155.1 | side-panel-title.directive.js
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


import { Directive, HostBinding, Input } from '@angular/core';
/**
 * selector: `aiSidePanelTitle`
 */
export class SidePanelTitleDirective {
    constructor() {
        this.titleClass = true;
        this.condensed = false;
        this.showClose = true;
    }
}
SidePanelTitleDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiSidePanelTitle]',
                exportAs: 'aiSidePanelTitle',
            },] }
];
SidePanelTitleDirective.propDecorators = {
    titleClass: [{ type: HostBinding, args: ['class.iot--side-panel-title',] }],
    condensed: [{ type: Input }, { type: HostBinding, args: ['class.iot--side-panel-title__condensed',] }],
    showClose: [{ type: Input }, { type: HostBinding, args: ['class.iot--side-panel-title__with-close',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZS1wYW5lbC10aXRsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2lkZS1wYW5lbC9zaWRlLXBhbmVsLXRpdGxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQ7O0dBRUc7QUFLSCxNQUFNLE9BQU8sdUJBQXVCO0lBSnBDO1FBSzhDLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFDRSxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGNBQVMsR0FBRyxJQUFJLENBQUM7SUFDcEYsQ0FBQzs7O1lBUkEsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLFFBQVEsRUFBRSxrQkFBa0I7YUFDN0I7Ozt5QkFFRSxXQUFXLFNBQUMsNkJBQTZCO3dCQUN6QyxLQUFLLFlBQUksV0FBVyxTQUFDLHdDQUF3Qzt3QkFDN0QsS0FBSyxZQUFJLFdBQVcsU0FBQyx5Q0FBeUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEhvc3RCaW5kaW5nLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIHNlbGVjdG9yOiBgYWlTaWRlUGFuZWxUaXRsZWBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2FpU2lkZVBhbmVsVGl0bGVdJyxcbiAgZXhwb3J0QXM6ICdhaVNpZGVQYW5lbFRpdGxlJyxcbn0pXG5leHBvcnQgY2xhc3MgU2lkZVBhbmVsVGl0bGVEaXJlY3RpdmUge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tc2lkZS1wYW5lbC10aXRsZScpIHRpdGxlQ2xhc3MgPSB0cnVlO1xuICBASW5wdXQoKSBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tc2lkZS1wYW5lbC10aXRsZV9fY29uZGVuc2VkJykgY29uZGVuc2VkID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBIb3N0QmluZGluZygnY2xhc3MuaW90LS1zaWRlLXBhbmVsLXRpdGxlX193aXRoLWNsb3NlJykgc2hvd0Nsb3NlID0gdHJ1ZTtcbn1cbiJdfQ==