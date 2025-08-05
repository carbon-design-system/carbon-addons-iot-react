/**
 *
 * @ai-apps/angular v2.155.1 | flyout-menu.component.js
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


import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { IconService } from 'carbon-components-angular';
import { Filter16 } from '@carbon/icons';
/**
 * [See demo](../../?path=/story/components-flyout-menu--basic)
 *
 * html:
 * ```
 * <ai-flyout-menu>
 *	options
 * </ai-flyout-menu>
 * ```
 *
 * <example-url>../../iframe.html?id=components-flyout-menu--basic</example-url>
 */
export class FlyoutMenu {
    constructor(iconService) {
        this.iconService = iconService;
        this.flip = false;
        this.placement = 'bottom';
        this.isOpenChange = new EventEmitter();
    }
    /**
     * This specifies any vertical and horizontal offset for the position of the dialog
     */
    set offset(os) {
        this._offset = os;
    }
    get offset() {
        if (!this._offset) {
            return { x: (this.flip ? -1 : 1) * 4, y: 0 };
        }
        return this._offset;
    }
    ngOnInit() {
        this.iconService.register(Filter16);
    }
}
FlyoutMenu.decorators = [
    { type: Component, args: [{
                selector: 'ai-flyout-menu',
                template: `
    <ng-template #templateRef let-tooltip="tooltip">
      <div class="bx--tooltip__content">
        <div class="iot--flyout-menu--content">
          <ng-content></ng-content>
        </div>
        <ng-content
          select="ai-flyout-menu-footer, .iot--flyout-menu__bottom-container"
        ></ng-content>
      </div>
    </ng-template>
    <div
      [aiFlyoutMenu]="templateRef"
      [isOpen]="isOpen"
      (isOpenChange)="isOpenChange.emit($event)"
      [offset]="offset"
      [flip]="flip"
      trigger="click"
      [placement]="placement"
      style="--tooltip-visibility: hidden;"
    >
      <button
        aria-label="Helpful description"
        data-testid="flyout-menu-button"
        tabindex="0"
        ibmButton="ghost"
        [iconOnly]="true"
        class="
        iot--flyout-menu--trigger-button
        iot--btn
        bx--tooltip__trigger
        bx--tooltip--a11y
        bx--tooltip--top
        bx--tooltip--align-center"
      >
        <svg ibmIcon="filter" size="16" class="bx--overflow-menu__icon"></svg>
      </button>
    </div>
  `,
                encapsulation: ViewEncapsulation.None
            },] }
];
FlyoutMenu.ctorParameters = () => [
    { type: IconService }
];
FlyoutMenu.propDecorators = {
    offset: [{ type: Input }],
    flip: [{ type: Input }],
    placement: [{ type: Input }],
    isOpen: [{ type: Input }],
    isOpenChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmx5b3V0LW1lbnUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2ZseW91dC1tZW51L2ZseW91dC1tZW51LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDOzs7Ozs7Ozs7OztHQVdHO0FBNENILE1BQU0sT0FBTyxVQUFVO0lBcUJyQixZQUFzQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQVByQyxTQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2IsY0FBUyxHQUF3QyxRQUFRLENBQUM7UUFFekQsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO0lBSUosQ0FBQztJQXBCbEQ7O09BRUc7SUFDSCxJQUFhLE1BQU0sQ0FBQyxFQUE0QjtRQUM5QyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBQ0QsSUFBSSxNQUFNO1FBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQzlDO1FBQ0QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFXRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEMsQ0FBQzs7O1lBcEVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0NUO2dCQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2FBQ3RDOzs7WUF6RFEsV0FBVzs7O3FCQThEakIsS0FBSzttQkFVTCxLQUFLO3dCQUNMLEtBQUs7cUJBQ0wsS0FBSzsyQkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEljb25TZXJ2aWNlIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5pbXBvcnQgeyBGaWx0ZXIxNiB9IGZyb20gJ0BjYXJib24vaWNvbnMnO1xuXG4vKipcbiAqIFtTZWUgZGVtb10oLi4vLi4vP3BhdGg9L3N0b3J5L2NvbXBvbmVudHMtZmx5b3V0LW1lbnUtLWJhc2ljKVxuICpcbiAqIGh0bWw6XG4gKiBgYGBcbiAqIDxhaS1mbHlvdXQtbWVudT5cbiAqXHRvcHRpb25zXG4gKiA8L2FpLWZseW91dC1tZW51PlxuICogYGBgXG4gKlxuICogPGV4YW1wbGUtdXJsPi4uLy4uL2lmcmFtZS5odG1sP2lkPWNvbXBvbmVudHMtZmx5b3V0LW1lbnUtLWJhc2ljPC9leGFtcGxlLXVybD5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWktZmx5b3V0LW1lbnUnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjdGVtcGxhdGVSZWYgbGV0LXRvb2x0aXA9XCJ0b29sdGlwXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiYngtLXRvb2x0aXBfX2NvbnRlbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlvdC0tZmx5b3V0LW1lbnUtLWNvbnRlbnRcIj5cbiAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bmctY29udGVudFxuICAgICAgICAgIHNlbGVjdD1cImFpLWZseW91dC1tZW51LWZvb3RlciwgLmlvdC0tZmx5b3V0LW1lbnVfX2JvdHRvbS1jb250YWluZXJcIlxuICAgICAgICA+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8ZGl2XG4gICAgICBbYWlGbHlvdXRNZW51XT1cInRlbXBsYXRlUmVmXCJcbiAgICAgIFtpc09wZW5dPVwiaXNPcGVuXCJcbiAgICAgIChpc09wZW5DaGFuZ2UpPVwiaXNPcGVuQ2hhbmdlLmVtaXQoJGV2ZW50KVwiXG4gICAgICBbb2Zmc2V0XT1cIm9mZnNldFwiXG4gICAgICBbZmxpcF09XCJmbGlwXCJcbiAgICAgIHRyaWdnZXI9XCJjbGlja1wiXG4gICAgICBbcGxhY2VtZW50XT1cInBsYWNlbWVudFwiXG4gICAgICBzdHlsZT1cIi0tdG9vbHRpcC12aXNpYmlsaXR5OiBoaWRkZW47XCJcbiAgICA+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGFyaWEtbGFiZWw9XCJIZWxwZnVsIGRlc2NyaXB0aW9uXCJcbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJmbHlvdXQtbWVudS1idXR0b25cIlxuICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICBpYm1CdXR0b249XCJnaG9zdFwiXG4gICAgICAgIFtpY29uT25seV09XCJ0cnVlXCJcbiAgICAgICAgY2xhc3M9XCJcbiAgICAgICAgaW90LS1mbHlvdXQtbWVudS0tdHJpZ2dlci1idXR0b25cbiAgICAgICAgaW90LS1idG5cbiAgICAgICAgYngtLXRvb2x0aXBfX3RyaWdnZXJcbiAgICAgICAgYngtLXRvb2x0aXAtLWExMXlcbiAgICAgICAgYngtLXRvb2x0aXAtLXRvcFxuICAgICAgICBieC0tdG9vbHRpcC0tYWxpZ24tY2VudGVyXCJcbiAgICAgID5cbiAgICAgICAgPHN2ZyBpYm1JY29uPVwiZmlsdGVyXCIgc2l6ZT1cIjE2XCIgY2xhc3M9XCJieC0tb3ZlcmZsb3ctbWVudV9faWNvblwiPjwvc3ZnPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIEZseW91dE1lbnUgaW1wbGVtZW50cyBPbkluaXQge1xuICAvKipcbiAgICogVGhpcyBzcGVjaWZpZXMgYW55IHZlcnRpY2FsIGFuZCBob3Jpem9udGFsIG9mZnNldCBmb3IgdGhlIHBvc2l0aW9uIG9mIHRoZSBkaWFsb2dcbiAgICovXG4gIEBJbnB1dCgpIHNldCBvZmZzZXQob3M6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkge1xuICAgIHRoaXMuX29mZnNldCA9IG9zO1xuICB9XG4gIGdldCBvZmZzZXQoKTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9IHtcbiAgICBpZiAoIXRoaXMuX29mZnNldCkge1xuICAgICAgcmV0dXJuIHsgeDogKHRoaXMuZmxpcCA/IC0xIDogMSkgKiA0LCB5OiAwIH07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XG4gIH1cblxuICBASW5wdXQoKSBmbGlwID0gZmFsc2U7XG4gIEBJbnB1dCgpIHBsYWNlbWVudDogJ2JvdHRvbScgfCAndG9wJyB8ICdsZWZ0JyB8ICdyaWdodCcgPSAnYm90dG9tJztcbiAgQElucHV0KCkgaXNPcGVuOiBib29sZWFuO1xuICBAT3V0cHV0KCkgaXNPcGVuQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIHByaXZhdGUgX29mZnNldDtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaWNvblNlcnZpY2U6IEljb25TZXJ2aWNlKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaWNvblNlcnZpY2UucmVnaXN0ZXIoRmlsdGVyMTYpO1xuICB9XG59XG4iXX0=