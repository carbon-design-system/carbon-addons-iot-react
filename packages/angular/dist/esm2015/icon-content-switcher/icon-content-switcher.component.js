/**
 *
 * @ai-apps/angular v2.155.1 | icon-content-switcher.component.js
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


import { Component, ContentChildren, QueryList } from '@angular/core';
import { ContentSwitcher } from 'carbon-components-angular';
import { IconContentSwitcherOption } from '.';
/**
 * [See demo](../../?path=/story/components-icon-content-switcher--basic)
 *
 * ```html
 * <ai-icon-content-switcher (selected)="selected($event)">
 *		<button aiIconContentOption>First section</button>
 *		<button aiIconContentOption>Second section</button>
 *		<button aiIconContentOption>Third section</button>
 *	</ai-icon-content-switcher>
 *	```
 *
 * <example-url>../../iframe.html?id=components-icon-content-switcher--basic</example-url>
 */
export class IconContentSwitcher extends ContentSwitcher {
}
IconContentSwitcher.decorators = [
    { type: Component, args: [{
                selector: 'ai-content-switcher',
                template: `
    <div
      [attr.aria-label]="ariaLabel"
      class="bx--content-switcher iot--content-switcher--icon"
      [class.bx--content-switcher--light]="theme === 'light'"
      role="tablist"
    >
      <ng-content></ng-content>
    </div>
  `
            },] }
];
IconContentSwitcher.propDecorators = {
    options: [{ type: ContentChildren, args: [IconContentSwitcherOption,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1jb250ZW50LXN3aXRjaGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pY29uLWNvbnRlbnQtc3dpdGNoZXIvaWNvbi1jb250ZW50LXN3aXRjaGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLEdBQUcsQ0FBQztBQUU5Qzs7Ozs7Ozs7Ozs7O0dBWUc7QUFjSCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsZUFBZTs7O1lBYnZELFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUscUJBQXFCO2dCQUMvQixRQUFRLEVBQUU7Ozs7Ozs7OztHQVNUO2FBQ0Y7OztzQkFFRSxlQUFlLFNBQUMseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIFF1ZXJ5TGlzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udGVudFN3aXRjaGVyIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5pbXBvcnQgeyBJY29uQ29udGVudFN3aXRjaGVyT3B0aW9uIH0gZnJvbSAnLic7XG5cbi8qKlxuICogW1NlZSBkZW1vXSguLi8uLi8/cGF0aD0vc3RvcnkvY29tcG9uZW50cy1pY29uLWNvbnRlbnQtc3dpdGNoZXItLWJhc2ljKVxuICpcbiAqIGBgYGh0bWxcbiAqIDxhaS1pY29uLWNvbnRlbnQtc3dpdGNoZXIgKHNlbGVjdGVkKT1cInNlbGVjdGVkKCRldmVudClcIj5cbiAqXHRcdDxidXR0b24gYWlJY29uQ29udGVudE9wdGlvbj5GaXJzdCBzZWN0aW9uPC9idXR0b24+XG4gKlx0XHQ8YnV0dG9uIGFpSWNvbkNvbnRlbnRPcHRpb24+U2Vjb25kIHNlY3Rpb248L2J1dHRvbj5cbiAqXHRcdDxidXR0b24gYWlJY29uQ29udGVudE9wdGlvbj5UaGlyZCBzZWN0aW9uPC9idXR0b24+XG4gKlx0PC9haS1pY29uLWNvbnRlbnQtc3dpdGNoZXI+XG4gKlx0YGBgXG4gKlxuICogPGV4YW1wbGUtdXJsPi4uLy4uL2lmcmFtZS5odG1sP2lkPWNvbXBvbmVudHMtaWNvbi1jb250ZW50LXN3aXRjaGVyLS1iYXNpYzwvZXhhbXBsZS11cmw+XG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLWNvbnRlbnQtc3dpdGNoZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsXCJcbiAgICAgIGNsYXNzPVwiYngtLWNvbnRlbnQtc3dpdGNoZXIgaW90LS1jb250ZW50LXN3aXRjaGVyLS1pY29uXCJcbiAgICAgIFtjbGFzcy5ieC0tY29udGVudC1zd2l0Y2hlci0tbGlnaHRdPVwidGhlbWUgPT09ICdsaWdodCdcIlxuICAgICAgcm9sZT1cInRhYmxpc3RcIlxuICAgID5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgSWNvbkNvbnRlbnRTd2l0Y2hlciBleHRlbmRzIENvbnRlbnRTd2l0Y2hlciB7XG4gIEBDb250ZW50Q2hpbGRyZW4oSWNvbkNvbnRlbnRTd2l0Y2hlck9wdGlvbikgb3B0aW9uczogUXVlcnlMaXN0PEljb25Db250ZW50U3dpdGNoZXJPcHRpb24+O1xufVxuIl19