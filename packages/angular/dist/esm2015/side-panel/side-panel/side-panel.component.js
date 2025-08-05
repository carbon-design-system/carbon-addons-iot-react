/**
 *
 * @ai-apps/angular v2.155.1 | side-panel.component.js
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


import { Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation, } from '@angular/core';
import { Close16, ChevronLeft16, ChevronRight16, OpenPanelLeft16, OpenPanelRight16, } from '@carbon/icons';
import { IconService } from 'carbon-components-angular';
/**
 *
 * [See demo](../../?path=/story/components-side-panel--basic)
 *
 * html:
 * ```
 * <ai-side-panel>
 *	options
 * </ai-side-panel>
 * ```
 */
export class SidePanel {
    constructor(iconService) {
        this.iconService = iconService;
        this.sidePanelClass = true;
        this.showClose = true;
        this.showDrawer = false;
        this.variation = 'inline';
        /**
         * Activates the panel when set to `true`, by sliding it in or over.
         *
         * Has no effect for `variation` `inline`
         */
        this.active = false;
        this.side = 'left';
        this.close = new EventEmitter();
    }
    get sidePanelSlideInClass() {
        return this.variation === 'slide-in';
    }
    get sidePanelInlineClass() {
        return this.variation === 'inline';
    }
    get sidePanelSlideOverClass() {
        return this.variation === 'slide-over';
    }
    get sidePanelRightClass() {
        return this.side === 'right';
    }
    get sidePanelDrawerClass() {
        return this.showDrawer && !this.active;
    }
    get shouldShowDrawer() {
        return this.showDrawer && this.variation === 'inline';
    }
    ngOnInit() {
        this.iconService.register(Close16);
        this.iconService.register(ChevronLeft16);
        this.iconService.register(ChevronRight16);
        this.iconService.register(OpenPanelLeft16);
        this.iconService.register(OpenPanelRight16);
    }
}
SidePanel.decorators = [
    { type: Component, args: [{
                selector: 'ai-side-panel',
                template: `
    <div
      class="panel"
      [ngClass]="{
        'iot--side-panel__left': side === 'left',
        'iot--side-panel__right': side === 'right'
      }"
    >
      <button
        *ngIf="showClose || showDrawer"
        tabindex="0"
        class="iot--btn bx--btn bx--btn--ghost bx--btn--icon-only close-button"
        type="button"
        (click)="close.emit()"
      >
        <svg *ngIf="showClose && !shouldShowDrawer" ibmIcon="close" size="16"></svg>
        <svg
          *ngIf="shouldShowDrawer && active && side === 'left'"
          [ibmIcon]="closeIcon || 'chevron--left'"
          size="16"
        ></svg>
        <svg
          *ngIf="shouldShowDrawer && active && side === 'right'"
          [ibmIcon]="closeIcon || 'chevron--right'"
          size="16"
        ></svg>
        <svg
          *ngIf="shouldShowDrawer && !active && side === 'left'"
          [ibmIcon]="drawerIcon || 'open-panel--left'"
          size="16"
        ></svg>
        <svg
          *ngIf="shouldShowDrawer && !active && side === 'right'"
          [ibmIcon]="drawerIcon || 'open-panel--right'"
          size="16"
        ></svg>
      </button>
      <div class="panel-content-wrapper">
        <ng-content></ng-content>
      </div>
    </div>
  `,
                encapsulation: ViewEncapsulation.None
            },] }
];
SidePanel.ctorParameters = () => [
    { type: IconService }
];
SidePanel.propDecorators = {
    sidePanelClass: [{ type: HostBinding, args: ['class.iot--side-panel',] }],
    sidePanelSlideInClass: [{ type: HostBinding, args: ['class.iot--side-panel__slide-in',] }],
    sidePanelInlineClass: [{ type: HostBinding, args: ['class.iot--side-panel__inline',] }],
    sidePanelSlideOverClass: [{ type: HostBinding, args: ['class.iot--side-panel__slide-over',] }],
    sidePanelRightClass: [{ type: HostBinding, args: ['class.iot--side-panel__right',] }],
    sidePanelDrawerClass: [{ type: HostBinding, args: ['class.iot--side-panel__drawer',] }],
    showClose: [{ type: Input }],
    showDrawer: [{ type: Input }],
    drawerIcon: [{ type: Input }],
    closeIcon: [{ type: Input }],
    variation: [{ type: Input }],
    active: [{ type: Input }, { type: HostBinding, args: ['class.active',] }],
    overlay: [{ type: Input }],
    side: [{ type: Input }],
    close: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZS1wYW5lbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2lkZS1wYW5lbC9zaWRlLXBhbmVsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixXQUFXLEVBQ1gsS0FBSyxFQUVMLE1BQU0sRUFDTixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLE9BQU8sRUFDUCxhQUFhLEVBQ2IsY0FBYyxFQUNkLGVBQWUsRUFDZixnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXhEOzs7Ozs7Ozs7O0dBVUc7QUErQ0gsTUFBTSxPQUFPLFNBQVM7SUFrRHBCLFlBQXNCLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBakRSLG1CQUFjLEdBQUcsSUFBSSxDQUFDO1FBZ0JuRCxjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFTbkIsY0FBUyxHQUF5QyxRQUFRLENBQUM7UUFDcEU7Ozs7V0FJRztRQUdILFdBQU0sR0FBRyxLQUFLLENBQUM7UUFPTixTQUFJLEdBQXFCLE1BQU0sQ0FBQztRQUUvQixVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQU1ZLENBQUM7SUFoRGxELElBQW9ELHFCQUFxQjtRQUN2RSxPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssVUFBVSxDQUFDO0lBQ3ZDLENBQUM7SUFDRCxJQUFrRCxvQkFBb0I7UUFDcEUsT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLFFBQVEsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsSUFBc0QsdUJBQXVCO1FBQzNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsS0FBSyxZQUFZLENBQUM7SUFDekMsQ0FBQztJQUNELElBQWlELG1CQUFtQjtRQUNsRSxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDO0lBQy9CLENBQUM7SUFDRCxJQUFrRCxvQkFBb0I7UUFDcEUsT0FBTyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN6QyxDQUFDO0lBOEJELElBQUksZ0JBQWdCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFFBQVEsQ0FBQztJQUN4RCxDQUFDO0lBSUQsUUFBUTtRQUNOLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDOUMsQ0FBQzs7O1lBeEdGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXlDVDtnQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN0Qzs7O1lBMURRLFdBQVc7Ozs2QkE0RGpCLFdBQVcsU0FBQyx1QkFBdUI7b0NBQ25DLFdBQVcsU0FBQyxpQ0FBaUM7bUNBRzdDLFdBQVcsU0FBQywrQkFBK0I7c0NBRzNDLFdBQVcsU0FBQyxtQ0FBbUM7a0NBRy9DLFdBQVcsU0FBQyw4QkFBOEI7bUNBRzFDLFdBQVcsU0FBQywrQkFBK0I7d0JBRzNDLEtBQUs7eUJBQ0wsS0FBSzt5QkFJTCxLQUFLO3dCQUlMLEtBQUs7d0JBQ0wsS0FBSztxQkFNTCxLQUFLLFlBQ0wsV0FBVyxTQUFDLGNBQWM7c0JBTTFCLEtBQUs7bUJBRUwsS0FBSztvQkFFTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBJbnB1dCxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENsb3NlMTYsXG4gIENoZXZyb25MZWZ0MTYsXG4gIENoZXZyb25SaWdodDE2LFxuICBPcGVuUGFuZWxMZWZ0MTYsXG4gIE9wZW5QYW5lbFJpZ2h0MTYsXG59IGZyb20gJ0BjYXJib24vaWNvbnMnO1xuaW1wb3J0IHsgSWNvblNlcnZpY2UgfSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyJztcblxuLyoqXG4gKlxuICogW1NlZSBkZW1vXSguLi8uLi8/cGF0aD0vc3RvcnkvY29tcG9uZW50cy1zaWRlLXBhbmVsLS1iYXNpYylcbiAqXG4gKiBodG1sOlxuICogYGBgXG4gKiA8YWktc2lkZS1wYW5lbD5cbiAqXHRvcHRpb25zXG4gKiA8L2FpLXNpZGUtcGFuZWw+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWktc2lkZS1wYW5lbCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgY2xhc3M9XCJwYW5lbFwiXG4gICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICdpb3QtLXNpZGUtcGFuZWxfX2xlZnQnOiBzaWRlID09PSAnbGVmdCcsXG4gICAgICAgICdpb3QtLXNpZGUtcGFuZWxfX3JpZ2h0Jzogc2lkZSA9PT0gJ3JpZ2h0J1xuICAgICAgfVwiXG4gICAgPlxuICAgICAgPGJ1dHRvblxuICAgICAgICAqbmdJZj1cInNob3dDbG9zZSB8fCBzaG93RHJhd2VyXCJcbiAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgY2xhc3M9XCJpb3QtLWJ0biBieC0tYnRuIGJ4LS1idG4tLWdob3N0IGJ4LS1idG4tLWljb24tb25seSBjbG9zZS1idXR0b25cIlxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgKGNsaWNrKT1cImNsb3NlLmVtaXQoKVwiXG4gICAgICA+XG4gICAgICAgIDxzdmcgKm5nSWY9XCJzaG93Q2xvc2UgJiYgIXNob3VsZFNob3dEcmF3ZXJcIiBpYm1JY29uPVwiY2xvc2VcIiBzaXplPVwiMTZcIj48L3N2Zz5cbiAgICAgICAgPHN2Z1xuICAgICAgICAgICpuZ0lmPVwic2hvdWxkU2hvd0RyYXdlciAmJiBhY3RpdmUgJiYgc2lkZSA9PT0gJ2xlZnQnXCJcbiAgICAgICAgICBbaWJtSWNvbl09XCJjbG9zZUljb24gfHwgJ2NoZXZyb24tLWxlZnQnXCJcbiAgICAgICAgICBzaXplPVwiMTZcIlxuICAgICAgICA+PC9zdmc+XG4gICAgICAgIDxzdmdcbiAgICAgICAgICAqbmdJZj1cInNob3VsZFNob3dEcmF3ZXIgJiYgYWN0aXZlICYmIHNpZGUgPT09ICdyaWdodCdcIlxuICAgICAgICAgIFtpYm1JY29uXT1cImNsb3NlSWNvbiB8fCAnY2hldnJvbi0tcmlnaHQnXCJcbiAgICAgICAgICBzaXplPVwiMTZcIlxuICAgICAgICA+PC9zdmc+XG4gICAgICAgIDxzdmdcbiAgICAgICAgICAqbmdJZj1cInNob3VsZFNob3dEcmF3ZXIgJiYgIWFjdGl2ZSAmJiBzaWRlID09PSAnbGVmdCdcIlxuICAgICAgICAgIFtpYm1JY29uXT1cImRyYXdlckljb24gfHwgJ29wZW4tcGFuZWwtLWxlZnQnXCJcbiAgICAgICAgICBzaXplPVwiMTZcIlxuICAgICAgICA+PC9zdmc+XG4gICAgICAgIDxzdmdcbiAgICAgICAgICAqbmdJZj1cInNob3VsZFNob3dEcmF3ZXIgJiYgIWFjdGl2ZSAmJiBzaWRlID09PSAncmlnaHQnXCJcbiAgICAgICAgICBbaWJtSWNvbl09XCJkcmF3ZXJJY29uIHx8ICdvcGVuLXBhbmVsLS1yaWdodCdcIlxuICAgICAgICAgIHNpemU9XCIxNlwiXG4gICAgICAgID48L3N2Zz5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWNvbnRlbnQtd3JhcHBlclwiPlxuICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgU2lkZVBhbmVsIGltcGxlbWVudHMgT25Jbml0IHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLXNpZGUtcGFuZWwnKSBzaWRlUGFuZWxDbGFzcyA9IHRydWU7XG4gIEBIb3N0QmluZGluZygnY2xhc3MuaW90LS1zaWRlLXBhbmVsX19zbGlkZS1pbicpIGdldCBzaWRlUGFuZWxTbGlkZUluQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFyaWF0aW9uID09PSAnc2xpZGUtaW4nO1xuICB9XG4gIEBIb3N0QmluZGluZygnY2xhc3MuaW90LS1zaWRlLXBhbmVsX19pbmxpbmUnKSBnZXQgc2lkZVBhbmVsSW5saW5lQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFyaWF0aW9uID09PSAnaW5saW5lJztcbiAgfVxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tc2lkZS1wYW5lbF9fc2xpZGUtb3ZlcicpIGdldCBzaWRlUGFuZWxTbGlkZU92ZXJDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy52YXJpYXRpb24gPT09ICdzbGlkZS1vdmVyJztcbiAgfVxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tc2lkZS1wYW5lbF9fcmlnaHQnKSBnZXQgc2lkZVBhbmVsUmlnaHRDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5zaWRlID09PSAncmlnaHQnO1xuICB9XG4gIEBIb3N0QmluZGluZygnY2xhc3MuaW90LS1zaWRlLXBhbmVsX19kcmF3ZXInKSBnZXQgc2lkZVBhbmVsRHJhd2VyQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0RyYXdlciAmJiAhdGhpcy5hY3RpdmU7XG4gIH1cbiAgQElucHV0KCkgc2hvd0Nsb3NlID0gdHJ1ZTtcbiAgQElucHV0KCkgc2hvd0RyYXdlciA9IGZhbHNlO1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgaWNvbiB0byB1c2Ugd2hlbiBgc2hvd0RyYXdlcmAgaXMgYHRydWVgIGFuZCBgYWN0aXZlYCBpcyBgZmFsc2VgXG4gICAqL1xuICBASW5wdXQoKSBkcmF3ZXJJY29uOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBpY29uIHRvIHVzZSBhcyBjbG9zZSBpY29uIHdoZW4gYHNob3dEcmF3ZXJgIGlzIGB0cnVlYFxuICAgKi9cbiAgQElucHV0KCkgY2xvc2VJY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHZhcmlhdGlvbjogJ3NsaWRlLWluJyB8ICdpbmxpbmUnIHwgJ3NsaWRlLW92ZXInID0gJ2lubGluZSc7XG4gIC8qKlxuICAgKiBBY3RpdmF0ZXMgdGhlIHBhbmVsIHdoZW4gc2V0IHRvIGB0cnVlYCwgYnkgc2xpZGluZyBpdCBpbiBvciBvdmVyLlxuICAgKlxuICAgKiBIYXMgbm8gZWZmZWN0IGZvciBgdmFyaWF0aW9uYCBgaW5saW5lYFxuICAgKi9cbiAgQElucHV0KClcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5hY3RpdmUnKVxuICBhY3RpdmUgPSBmYWxzZTtcblxuICAvKipcbiAgICogRW5hYmxlcyBvdmVybGF5IHdoZW4gYWN0aXZlIHdpdGggYHZhcmlhdGlvbmAgYHNsaWRlLW92ZXJgLlxuICAgKi9cbiAgQElucHV0KCkgb3ZlcmxheTogZmFsc2U7XG5cbiAgQElucHV0KCkgc2lkZTogJ2xlZnQnIHwgJ3JpZ2h0JyA9ICdsZWZ0JztcblxuICBAT3V0cHV0KCkgY2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgZ2V0IHNob3VsZFNob3dEcmF3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0RyYXdlciAmJiB0aGlzLnZhcmlhdGlvbiA9PT0gJ2lubGluZSc7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaWNvblNlcnZpY2U6IEljb25TZXJ2aWNlKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaWNvblNlcnZpY2UucmVnaXN0ZXIoQ2xvc2UxNik7XG4gICAgdGhpcy5pY29uU2VydmljZS5yZWdpc3RlcihDaGV2cm9uTGVmdDE2KTtcbiAgICB0aGlzLmljb25TZXJ2aWNlLnJlZ2lzdGVyKENoZXZyb25SaWdodDE2KTtcbiAgICB0aGlzLmljb25TZXJ2aWNlLnJlZ2lzdGVyKE9wZW5QYW5lbExlZnQxNik7XG4gICAgdGhpcy5pY29uU2VydmljZS5yZWdpc3RlcihPcGVuUGFuZWxSaWdodDE2KTtcbiAgfVxufVxuIl19