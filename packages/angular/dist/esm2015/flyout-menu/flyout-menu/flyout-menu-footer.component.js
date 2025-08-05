/**
 *
 * @ai-apps/angular v2.155.1 | flyout-menu-footer.component.js
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


import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
/**
 * html:
 * ```
 * <ai-flyout-menu-footer>
 *	<button ibmButton="secondary">Cancel</button>
 *	<button ibmButton>Apply</button>
 * </ai-flyout-menu-footer>
 * ```
 */
export class FlyoutMenuFooter {
    constructor() {
        this.className = true;
    }
}
FlyoutMenuFooter.decorators = [
    { type: Component, args: [{
                selector: 'ai-flyout-menu-footer',
                template: ` <ng-content></ng-content> `,
                encapsulation: ViewEncapsulation.None
            },] }
];
FlyoutMenuFooter.propDecorators = {
    className: [{ type: HostBinding, args: ['class.iot--flyout-menu__bottom-container',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmx5b3V0LW1lbnUtZm9vdGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9mbHlvdXQtbWVudS9mbHlvdXQtbWVudS1mb290ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTFFOzs7Ozs7OztHQVFHO0FBTUgsTUFBTSxPQUFPLGdCQUFnQjtJQUw3QjtRQU0yRCxjQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzVFLENBQUM7OztZQVBBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxRQUFRLEVBQUUsNkJBQTZCO2dCQUN2QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN0Qzs7O3dCQUVFLFdBQVcsU0FBQywwQ0FBMEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIGh0bWw6XG4gKiBgYGBcbiAqIDxhaS1mbHlvdXQtbWVudS1mb290ZXI+XG4gKlx0PGJ1dHRvbiBpYm1CdXR0b249XCJzZWNvbmRhcnlcIj5DYW5jZWw8L2J1dHRvbj5cbiAqXHQ8YnV0dG9uIGlibUJ1dHRvbj5BcHBseTwvYnV0dG9uPlxuICogPC9haS1mbHlvdXQtbWVudS1mb290ZXI+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWktZmx5b3V0LW1lbnUtZm9vdGVyJyxcbiAgdGVtcGxhdGU6IGAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PiBgLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBGbHlvdXRNZW51Rm9vdGVyIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLWZseW91dC1tZW51X19ib3R0b20tY29udGFpbmVyJykgY2xhc3NOYW1lID0gdHJ1ZTtcbn1cbiJdfQ==