/**
 *
 * @ai-apps/angular v2.155.1 | card-toolbar-action.directive.js
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


import { Directive, HostBinding, Optional } from '@angular/core';
import { OverflowMenu } from 'carbon-components-angular';
/**
 * Directive to apply toolbar specific styles and behavior.
 *
 * May be applied to a button, or other simple element:
 * ```
 * <button aiCardToolbarAction>
 *   <svg ibmIcon="calendar" size="16"></svg>
 * </button>
 * ```
 *
 * It will also apply the correct styles to an `ibm-overflow-menu`. For example:
 * ```
 * <ibm-overflow-menu aiCardToolbarAction>
 *   <ibm-overflow-menu-option>First option</ibm-overflow-menu-option>
 *   <ibm-overflow-menu-option>Second option</ibm-overflow-menu-option>
 *   <ibm-overflow-menu-option>Third option</ibm-overflow-menu-option>
 *   <ibm-overflow-menu-option>Fourth option</ibm-overflow-menu-option>
 * </ibm-overflow-menu>
 * ```
 *
 * For the overflow-menu it will override the `flip`, `offset`, and `triggerClass` to toolbar specific values.
 */
export class CardToolbarActionDirective {
    /**
     *
     * @param overflowMenuRef optional ref to the OverflowMenu instance this directive may be attached to
     */
    constructor(overflowMenuRef) {
        this.overflowMenuRef = overflowMenuRef;
        this.classList = 'iot--card--toolbar-action iot--card--toolbar-svg-wrapper bx--btn--icon-only bx--btn bx--btn--ghost';
    }
    ngOnInit() {
        if (this.overflowMenuRef) {
            this.overflowMenuRef.triggerClass = this.classList;
            this.overflowMenuRef.flip = true;
            this.overflowMenuRef.offset = { x: 4, y: 0 };
            this.classList = '';
        }
    }
}
CardToolbarActionDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiCardToolbarAction]',
            },] }
];
CardToolbarActionDirective.ctorParameters = () => [
    { type: OverflowMenu, decorators: [{ type: Optional }] }
];
CardToolbarActionDirective.propDecorators = {
    classList: [{ type: HostBinding, args: ['class',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC10b29sYmFyLWFjdGlvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2FyZC9jYXJkLXRvb2xiYXItYWN0aW9uLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBVSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXpEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFJSCxNQUFNLE9BQU8sMEJBQTBCO0lBSXJDOzs7T0FHRztJQUNILFlBQWtDLGVBQTZCO1FBQTdCLG9CQUFlLEdBQWYsZUFBZSxDQUFjO1FBUHpDLGNBQVMsR0FDN0Isb0dBQW9HLENBQUM7SUFNckMsQ0FBQztJQUVuRSxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDbkQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDOzs7WUFwQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx1QkFBdUI7YUFDbEM7OztZQTFCUSxZQUFZLHVCQW1DTixRQUFROzs7d0JBUHBCLFdBQVcsU0FBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0QmluZGluZywgT25Jbml0LCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT3ZlcmZsb3dNZW51IH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5cbi8qKlxuICogRGlyZWN0aXZlIHRvIGFwcGx5IHRvb2xiYXIgc3BlY2lmaWMgc3R5bGVzIGFuZCBiZWhhdmlvci5cbiAqXG4gKiBNYXkgYmUgYXBwbGllZCB0byBhIGJ1dHRvbiwgb3Igb3RoZXIgc2ltcGxlIGVsZW1lbnQ6XG4gKiBgYGBcbiAqIDxidXR0b24gYWlDYXJkVG9vbGJhckFjdGlvbj5cbiAqICAgPHN2ZyBpYm1JY29uPVwiY2FsZW5kYXJcIiBzaXplPVwiMTZcIj48L3N2Zz5cbiAqIDwvYnV0dG9uPlxuICogYGBgXG4gKlxuICogSXQgd2lsbCBhbHNvIGFwcGx5IHRoZSBjb3JyZWN0IHN0eWxlcyB0byBhbiBgaWJtLW92ZXJmbG93LW1lbnVgLiBGb3IgZXhhbXBsZTpcbiAqIGBgYFxuICogPGlibS1vdmVyZmxvdy1tZW51IGFpQ2FyZFRvb2xiYXJBY3Rpb24+XG4gKiAgIDxpYm0tb3ZlcmZsb3ctbWVudS1vcHRpb24+Rmlyc3Qgb3B0aW9uPC9pYm0tb3ZlcmZsb3ctbWVudS1vcHRpb24+XG4gKiAgIDxpYm0tb3ZlcmZsb3ctbWVudS1vcHRpb24+U2Vjb25kIG9wdGlvbjwvaWJtLW92ZXJmbG93LW1lbnUtb3B0aW9uPlxuICogICA8aWJtLW92ZXJmbG93LW1lbnUtb3B0aW9uPlRoaXJkIG9wdGlvbjwvaWJtLW92ZXJmbG93LW1lbnUtb3B0aW9uPlxuICogICA8aWJtLW92ZXJmbG93LW1lbnUtb3B0aW9uPkZvdXJ0aCBvcHRpb248L2libS1vdmVyZmxvdy1tZW51LW9wdGlvbj5cbiAqIDwvaWJtLW92ZXJmbG93LW1lbnU+XG4gKiBgYGBcbiAqXG4gKiBGb3IgdGhlIG92ZXJmbG93LW1lbnUgaXQgd2lsbCBvdmVycmlkZSB0aGUgYGZsaXBgLCBgb2Zmc2V0YCwgYW5kIGB0cmlnZ2VyQ2xhc3NgIHRvIHRvb2xiYXIgc3BlY2lmaWMgdmFsdWVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYWlDYXJkVG9vbGJhckFjdGlvbl0nLFxufSlcbmV4cG9ydCBjbGFzcyBDYXJkVG9vbGJhckFjdGlvbkRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBjbGFzc0xpc3QgPVxuICAgICdpb3QtLWNhcmQtLXRvb2xiYXItYWN0aW9uIGlvdC0tY2FyZC0tdG9vbGJhci1zdmctd3JhcHBlciBieC0tYnRuLS1pY29uLW9ubHkgYngtLWJ0biBieC0tYnRuLS1naG9zdCc7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBvdmVyZmxvd01lbnVSZWYgb3B0aW9uYWwgcmVmIHRvIHRoZSBPdmVyZmxvd01lbnUgaW5zdGFuY2UgdGhpcyBkaXJlY3RpdmUgbWF5IGJlIGF0dGFjaGVkIHRvXG4gICAqL1xuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgb3ZlcmZsb3dNZW51UmVmOiBPdmVyZmxvd01lbnUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMub3ZlcmZsb3dNZW51UmVmKSB7XG4gICAgICB0aGlzLm92ZXJmbG93TWVudVJlZi50cmlnZ2VyQ2xhc3MgPSB0aGlzLmNsYXNzTGlzdDtcbiAgICAgIHRoaXMub3ZlcmZsb3dNZW51UmVmLmZsaXAgPSB0cnVlO1xuICAgICAgdGhpcy5vdmVyZmxvd01lbnVSZWYub2Zmc2V0ID0geyB4OiA0LCB5OiAwIH07XG4gICAgICB0aGlzLmNsYXNzTGlzdCA9ICcnO1xuICAgIH1cbiAgfVxufVxuIl19