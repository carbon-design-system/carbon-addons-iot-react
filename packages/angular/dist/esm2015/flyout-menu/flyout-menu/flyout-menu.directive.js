/**
 *
 * @ai-apps/angular v2.155.1 | flyout-menu.directive.js
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


import { Directive, Input, ElementRef, ViewContainerRef, HostBinding, } from '@angular/core';
import { EventService } from 'carbon-components-angular/utils';
import { TooltipDirective, DialogService } from 'carbon-components-angular';
import { FlyoutMenuPane } from './flyout-menu-pane.component';
/**
 * selector: `aiFlyoutMenu`
 */
export class FlyoutMenuDirective extends TooltipDirective {
    /**
     * Creates an instance of `TooltipDirective`.
     */
    constructor(elementRef, viewContainerRef, dialogService, eventService) {
        super(elementRef, viewContainerRef, dialogService, eventService);
        this.elementRef = elementRef;
        this.viewContainerRef = viewContainerRef;
        this.dialogService = dialogService;
        this.eventService = eventService;
        /**
         * Controls wether the overflow menu is flipped
         */
        this.flip = false;
        this.menuClass = true;
        /**
         * bx--tooltip__trigger is inherited from TooltipDirective and it enables focus indication
         */
        this.className = false;
        /**
         * Override tabindex to make it not tabbable
         */
        this.tabIndex = -1;
        dialogService.setContext({ component: FlyoutMenuPane });
    }
    get openClass() {
        return this.isOpen;
    }
    get menuBottomClass() {
        return this.placement === 'bottom';
    }
    get menuTopClass() {
        return this.placement === 'top';
    }
    updateConfig() {
        this.dialogConfig.content = this.aiFlyoutMenu;
        this.dialogConfig.flip = this.flip;
        this.dialogConfig.offset = this.offset;
        this.dialogConfig.wrapperClass = this.wrapperClass;
        this.dialogConfig.placement = this.placement;
    }
}
FlyoutMenuDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiFlyoutMenu]',
                exportAs: 'aiFlyoutMenu',
                providers: [DialogService],
            },] }
];
FlyoutMenuDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ViewContainerRef },
    { type: DialogService },
    { type: EventService }
];
FlyoutMenuDirective.propDecorators = {
    aiFlyoutMenu: [{ type: Input }],
    flip: [{ type: Input }],
    menuClass: [{ type: HostBinding, args: ['class.iot--flyout-menu',] }],
    className: [{ type: HostBinding, args: ['class.bx--tooltip__trigger',] }],
    tabIndex: [{ type: HostBinding, args: ['tabindex',] }],
    openClass: [{ type: HostBinding, args: ['class.iot--flyout-menu__open',] }],
    menuBottomClass: [{ type: HostBinding, args: ['class.iot--flyout-menu__bottom',] }],
    menuTopClass: [{ type: HostBinding, args: ['class.iot--flyout-menu__top',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmx5b3V0LW1lbnUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2ZseW91dC1tZW51L2ZseW91dC1tZW51LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFFTCxVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLFdBQVcsR0FDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDL0QsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzVFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUU5RDs7R0FFRztBQU1ILE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxnQkFBZ0I7SUE2QnZEOztPQUVHO0lBQ0gsWUFDWSxVQUFzQixFQUN0QixnQkFBa0MsRUFDbEMsYUFBNEIsRUFDNUIsWUFBMEI7UUFFcEMsS0FBSyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFMdkQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBL0J0Qzs7V0FFRztRQUNNLFNBQUksR0FBRyxLQUFLLENBQUM7UUFFaUIsY0FBUyxHQUFHLElBQUksQ0FBQztRQUN4RDs7V0FFRztRQUN3QyxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQzdEOztXQUVHO1FBQ3NCLGFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztRQXFCckMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFyQkQsSUFBaUQsU0FBUztRQUN4RCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUNELElBQW1ELGVBQWU7UUFDaEUsT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLFFBQVEsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsSUFBZ0QsWUFBWTtRQUMxRCxPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDO0lBQ2xDLENBQUM7SUFlRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUM5QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNuRCxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQy9DLENBQUM7OztZQXJERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQzthQUMzQjs7O1lBZkMsVUFBVTtZQUNWLGdCQUFnQjtZQUlTLGFBQWE7WUFEL0IsWUFBWTs7OzJCQWdCbEIsS0FBSzttQkFJTCxLQUFLO3dCQUVMLFdBQVcsU0FBQyx3QkFBd0I7d0JBSXBDLFdBQVcsU0FBQyw0QkFBNEI7dUJBSXhDLFdBQVcsU0FBQyxVQUFVO3dCQUN0QixXQUFXLFNBQUMsOEJBQThCOzhCQUcxQyxXQUFXLFNBQUMsZ0NBQWdDOzJCQUc1QyxXQUFXLFNBQUMsNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgVGVtcGxhdGVSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIEhvc3RCaW5kaW5nLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEV2ZW50U2VydmljZSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXIvdXRpbHMnO1xuaW1wb3J0IHsgVG9vbHRpcERpcmVjdGl2ZSwgRGlhbG9nU2VydmljZSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuaW1wb3J0IHsgRmx5b3V0TWVudVBhbmUgfSBmcm9tICcuL2ZseW91dC1tZW51LXBhbmUuY29tcG9uZW50JztcblxuLyoqXG4gKiBzZWxlY3RvcjogYGFpRmx5b3V0TWVudWBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2FpRmx5b3V0TWVudV0nLFxuICBleHBvcnRBczogJ2FpRmx5b3V0TWVudScsXG4gIHByb3ZpZGVyczogW0RpYWxvZ1NlcnZpY2VdLFxufSlcbmV4cG9ydCBjbGFzcyBGbHlvdXRNZW51RGlyZWN0aXZlIGV4dGVuZHMgVG9vbHRpcERpcmVjdGl2ZSB7XG4gIC8qKlxuICAgKiBUaGUgc3RyaW5nIG9yIHRlbXBsYXRlIGNvbnRlbnQgdG8gYmUgZXhwb3NlZCBieSB0aGUgdG9vbHRpcC5cbiAgICovXG4gIEBJbnB1dCgpIGFpRmx5b3V0TWVudTogc3RyaW5nIHwgVGVtcGxhdGVSZWY8YW55PjtcbiAgLyoqXG4gICAqIENvbnRyb2xzIHdldGhlciB0aGUgb3ZlcmZsb3cgbWVudSBpcyBmbGlwcGVkXG4gICAqL1xuICBASW5wdXQoKSBmbGlwID0gZmFsc2U7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLWZseW91dC1tZW51JykgbWVudUNsYXNzID0gdHJ1ZTtcbiAgLyoqXG4gICAqIGJ4LS10b29sdGlwX190cmlnZ2VyIGlzIGluaGVyaXRlZCBmcm9tIFRvb2x0aXBEaXJlY3RpdmUgYW5kIGl0IGVuYWJsZXMgZm9jdXMgaW5kaWNhdGlvblxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5ieC0tdG9vbHRpcF9fdHJpZ2dlcicpIGNsYXNzTmFtZSA9IGZhbHNlO1xuICAvKipcbiAgICogT3ZlcnJpZGUgdGFiaW5kZXggdG8gbWFrZSBpdCBub3QgdGFiYmFibGVcbiAgICovXG4gIEBIb3N0QmluZGluZygndGFiaW5kZXgnKSB0YWJJbmRleCA9IC0xO1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tZmx5b3V0LW1lbnVfX29wZW4nKSBnZXQgb3BlbkNsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLmlzT3BlbjtcbiAgfVxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tZmx5b3V0LW1lbnVfX2JvdHRvbScpIGdldCBtZW51Qm90dG9tQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucGxhY2VtZW50ID09PSAnYm90dG9tJztcbiAgfVxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tZmx5b3V0LW1lbnVfX3RvcCcpIGdldCBtZW51VG9wQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucGxhY2VtZW50ID09PSAndG9wJztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIGBUb29sdGlwRGlyZWN0aXZlYC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByb3RlY3RlZCBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBldmVudFNlcnZpY2U6IEV2ZW50U2VydmljZVxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCB2aWV3Q29udGFpbmVyUmVmLCBkaWFsb2dTZXJ2aWNlLCBldmVudFNlcnZpY2UpO1xuICAgIGRpYWxvZ1NlcnZpY2Uuc2V0Q29udGV4dCh7IGNvbXBvbmVudDogRmx5b3V0TWVudVBhbmUgfSk7XG4gIH1cblxuICB1cGRhdGVDb25maWcoKSB7XG4gICAgdGhpcy5kaWFsb2dDb25maWcuY29udGVudCA9IHRoaXMuYWlGbHlvdXRNZW51O1xuICAgIHRoaXMuZGlhbG9nQ29uZmlnLmZsaXAgPSB0aGlzLmZsaXA7XG4gICAgdGhpcy5kaWFsb2dDb25maWcub2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgdGhpcy5kaWFsb2dDb25maWcud3JhcHBlckNsYXNzID0gdGhpcy53cmFwcGVyQ2xhc3M7XG4gICAgdGhpcy5kaWFsb2dDb25maWcucGxhY2VtZW50ID0gdGhpcy5wbGFjZW1lbnQ7XG4gIH1cbn1cbiJdfQ==