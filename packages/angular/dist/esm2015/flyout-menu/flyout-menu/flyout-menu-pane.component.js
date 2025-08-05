/**
 *
 * @ai-apps/angular v2.155.1 | flyout-menu-pane.component.js
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


import { Component, ElementRef, EventEmitter, Input, Optional, Output, ViewEncapsulation, } from '@angular/core';
import { AnimationFrameService, closestAttr, Dialog, ElementService, position, } from 'carbon-components-angular';
import { I18n } from 'carbon-components-angular/i18n';
/**
 * The Filter menu component encapsulates the OverFlowMenu directive, and the flyout iconography
 * into one convienent component
 *
 * [See demo](../../?path=/story/components-flyout-menu--basic)
 *
 * html:
 * ```
 * <ai-flyout-menu-pane>
 *	options
 * </ai-flyout-menu-pane>
 * ```
 */
export class FlyoutMenuPane extends Dialog {
    constructor(elementRef, elementService, i18n, animationFrameService = null) {
        super(elementRef, elementService, animationFrameService);
        this.elementRef = elementRef;
        this.elementService = elementService;
        this.i18n = i18n;
        this.animationFrameService = animationFrameService;
        this.hasContentTemplate = true;
        /**
         * Sets the role of the tooltip. If there's no focusable content we leave it as a `tooltip`,
         * if there _is_ focusable content we switch to the interactive `dialog` role.
         */
        this.role = 'tooltip';
        this.buttonLabel = this.i18n.get().OVERFLOW_MENU.OVERFLOW;
        this.light = false;
        this.open = true;
        this.openChange = new EventEmitter();
        this.shouldClose = (meta) => {
            return !this.dialog.nativeElement.contains(meta.target);
        };
    }
    /**
     * This specifies any vertical and horizontal offset for the position of the dialog
     */
    set offset(os) {
        this._offset = os;
    }
    get offset() {
        if (!this._offset) {
            return { x: (this.dialogConfig.flip ? -1 : 1) * 4, y: 0 };
        }
        return this._offset;
    }
    get contentTemplate() {
        return this.dialogConfig.content;
    }
    get position() {
        return `${this.dialogConfig.placement}-${this.dialogConfig.flip ? 'end' : 'start'}`;
    }
    handleOpenChange(event) {
        this.open = event;
        this.openChange.emit(event);
    }
    onDialogInit() {
        const chevronWidth = 16;
        const chevronHeight = 14;
        const borderWidth = 2;
        const positionOverflowMenuVertically = (pos) => {
            let offset;
            const closestRel = closestAttr('position', ['relative', 'fixed', 'absolute'], this.elementRef.nativeElement);
            let topFix = (closestRel ? closestRel.getBoundingClientRect().top * -1 : 0) -
                chevronHeight / 2 +
                1 * borderWidth;
            const leftFix = closestRel ? closestRel.getBoundingClientRect().left * -1 : 0;
            if (this.dialogConfig.placement === 'top') {
                topFix += chevronHeight / 2;
            }
            /*
             * 20 is half the width of the overflow menu trigger element.
             * we also move the element by half of it's own width, since
             * position service will try and center everything
             */
            offset = Math.round(this.dialog.nativeElement.offsetWidth / 2) - 20 - chevronWidth / 2;
            if (this.dialogConfig.flip) {
                return position.addOffset(pos, topFix, -offset + leftFix);
            }
            return position.addOffset(pos, topFix, offset + leftFix);
        };
        this.addGap['bottom'] = positionOverflowMenuVertically;
        this.addGap['top'] = positionOverflowMenuVertically;
        const positionOverflowMenuHorizontally = (pos) => {
            const adjustedOffset = this.getAdjustOffset();
            const topFix = (this.dialog.nativeElement.offsetHeight -
                this.dialogConfig.parentRef.nativeElement.offsetHeight -
                borderWidth) /
                2;
            let leftFix = (this.dialogConfig.placement === 'right' ? 1 : -1) * borderWidth;
            if (this.dialogConfig.placement === 'right') {
                leftFix -= chevronWidth / 2;
            }
            if (this.dialogConfig.flip) {
                return position.addOffset(pos, -5 + adjustedOffset.top - topFix, adjustedOffset.left + leftFix + chevronWidth / 2);
            }
            return position.addOffset(pos, -3 + adjustedOffset.top + topFix, adjustedOffset.left + leftFix);
        };
        this.addGap['left'] = positionOverflowMenuHorizontally;
        this.addGap['right'] = positionOverflowMenuHorizontally;
        if (!this.dialogConfig.menuLabel) {
            this.dialogConfig.menuLabel = this.i18n.get().OVERFLOW_MENU.OVERFLOW;
        }
    }
    getAdjustOffset() {
        const closestWithPos = closestAttr('position', ['relative', 'fixed', 'absolute'], this.elementRef.nativeElement.parentElement);
        const topPos = closestWithPos ? closestWithPos.getBoundingClientRect().top * -1 : 0;
        const leftPos = closestWithPos ? closestWithPos.getBoundingClientRect().left * -1 : 0;
        return { top: topPos, left: leftPos };
    }
}
FlyoutMenuPane.decorators = [
    { type: Component, args: [{
                selector: 'ai-flyout-menu-pane',
                template: `
    <div
      #dialog
      [id]="dialogConfig.compID"
      [attr.role]="role"
      [attr.data-floating-menu-direction]="dialogConfig.placement"
      class="bx--tooltip bx--tooltip--shown iot--flyout-menu--body"
      [ngClass]="{
        'iot--flyout-menu--body__bottom-start': position === 'bottom-start',
        'iot--flyout-menu--body__bottom-end': position === 'bottom-end',
        'iot--flyout-menu--body__top-start': position === 'top-start',
        'iot--flyout-menu--body__top-end': position === 'top-end',
        'iot--flyout-menu--body__left-start': position === 'left-start',
        'iot--flyout-menu--body__left-end': position === 'left-end',
        'iot--flyout-menu--body__right-start': position === 'right-start',
        'iot--flyout-menu--body__right-end': position === 'right-end',
        'iot--flyout-menu--body__light': light,
        'iot--flyout-menu--body__open': open
      }"
    >
      <ng-template
        *ngIf="hasContentTemplate"
        [ngTemplateOutlet]="contentTemplate"
        [ngTemplateOutletContext]="{ tooltip: this }"
      >
      </ng-template>
      <p *ngIf="!hasContentTemplate">
        {{ dialogConfig.content }}
      </p>
    </div>
  `,
                encapsulation: ViewEncapsulation.None
            },] }
];
FlyoutMenuPane.ctorParameters = () => [
    { type: ElementRef },
    { type: ElementService },
    { type: I18n },
    { type: AnimationFrameService, decorators: [{ type: Optional }] }
];
FlyoutMenuPane.propDecorators = {
    offset: [{ type: Input }],
    buttonLabel: [{ type: Input }],
    light: [{ type: Input }],
    open: [{ type: Input }],
    openChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmx5b3V0LW1lbnUtcGFuZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZmx5b3V0LW1lbnUvZmx5b3V0LW1lbnUtcGFuZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUVOLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wscUJBQXFCLEVBRXJCLFdBQVcsRUFDWCxNQUFNLEVBQ04sY0FBYyxFQUNkLFFBQVEsR0FDVCxNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV0RDs7Ozs7Ozs7Ozs7O0dBWUc7QUFvQ0gsTUFBTSxPQUFPLGNBQWUsU0FBUSxNQUFNO0lBb0N4QyxZQUNZLFVBQXNCLEVBQ3RCLGNBQThCLEVBQzlCLElBQVUsRUFDRSx3QkFBK0MsSUFBSTtRQUV6RSxLQUFLLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBTC9DLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLFNBQUksR0FBSixJQUFJLENBQU07UUFDRSwwQkFBcUIsR0FBckIscUJBQXFCLENBQThCO1FBM0JwRSx1QkFBa0IsR0FBRyxJQUFJLENBQUM7UUFJakM7OztXQUdHO1FBQ0ksU0FBSSxHQUFHLFNBQVMsQ0FBQztRQUNmLGdCQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO1FBRXJELFVBQUssR0FBRyxLQUFLLENBQUM7UUFNZCxTQUFJLEdBQUcsSUFBSSxDQUFDO1FBRVgsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFhbkQs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TCxLQUFLO29CQUVMLEtBQUs7bUJBTUwsS0FBSzt5QkFFTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQW5pbWF0aW9uRnJhbWVTZXJ2aWNlLFxuICBDbG9zZU1ldGEsXG4gIGNsb3Nlc3RBdHRyLFxuICBEaWFsb2csXG4gIEVsZW1lbnRTZXJ2aWNlLFxuICBwb3NpdGlvbixcbn0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5pbXBvcnQgeyBJMThuIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhci9pMThuJztcblxuLyoqXG4gKiBUaGUgRmlsdGVyIG1lbnUgY29tcG9uZW50IGVuY2Fwc3VsYXRlcyB0aGUgT3ZlckZsb3dNZW51IGRpcmVjdGl2ZSwgYW5kIHRoZSBmbHlvdXQgaWNvbm9ncmFwaHlcbiAqIGludG8gb25lIGNvbnZpZW5lbnQgY29tcG9uZW50XG4gKlxuICogW1NlZSBkZW1vXSguLi8uLi8/cGF0aD0vc3RvcnkvY29tcG9uZW50cy1mbHlvdXQtbWVudS0tYmFzaWMpXG4gKlxuICogaHRtbDpcbiAqIGBgYFxuICogPGFpLWZseW91dC1tZW51LXBhbmU+XG4gKlx0b3B0aW9uc1xuICogPC9haS1mbHlvdXQtbWVudS1wYW5lPlxuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLWZseW91dC1tZW51LXBhbmUnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgICNkaWFsb2dcbiAgICAgIFtpZF09XCJkaWFsb2dDb25maWcuY29tcElEXCJcbiAgICAgIFthdHRyLnJvbGVdPVwicm9sZVwiXG4gICAgICBbYXR0ci5kYXRhLWZsb2F0aW5nLW1lbnUtZGlyZWN0aW9uXT1cImRpYWxvZ0NvbmZpZy5wbGFjZW1lbnRcIlxuICAgICAgY2xhc3M9XCJieC0tdG9vbHRpcCBieC0tdG9vbHRpcC0tc2hvd24gaW90LS1mbHlvdXQtbWVudS0tYm9keVwiXG4gICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICdpb3QtLWZseW91dC1tZW51LS1ib2R5X19ib3R0b20tc3RhcnQnOiBwb3NpdGlvbiA9PT0gJ2JvdHRvbS1zdGFydCcsXG4gICAgICAgICdpb3QtLWZseW91dC1tZW51LS1ib2R5X19ib3R0b20tZW5kJzogcG9zaXRpb24gPT09ICdib3R0b20tZW5kJyxcbiAgICAgICAgJ2lvdC0tZmx5b3V0LW1lbnUtLWJvZHlfX3RvcC1zdGFydCc6IHBvc2l0aW9uID09PSAndG9wLXN0YXJ0JyxcbiAgICAgICAgJ2lvdC0tZmx5b3V0LW1lbnUtLWJvZHlfX3RvcC1lbmQnOiBwb3NpdGlvbiA9PT0gJ3RvcC1lbmQnLFxuICAgICAgICAnaW90LS1mbHlvdXQtbWVudS0tYm9keV9fbGVmdC1zdGFydCc6IHBvc2l0aW9uID09PSAnbGVmdC1zdGFydCcsXG4gICAgICAgICdpb3QtLWZseW91dC1tZW51LS1ib2R5X19sZWZ0LWVuZCc6IHBvc2l0aW9uID09PSAnbGVmdC1lbmQnLFxuICAgICAgICAnaW90LS1mbHlvdXQtbWVudS0tYm9keV9fcmlnaHQtc3RhcnQnOiBwb3NpdGlvbiA9PT0gJ3JpZ2h0LXN0YXJ0JyxcbiAgICAgICAgJ2lvdC0tZmx5b3V0LW1lbnUtLWJvZHlfX3JpZ2h0LWVuZCc6IHBvc2l0aW9uID09PSAncmlnaHQtZW5kJyxcbiAgICAgICAgJ2lvdC0tZmx5b3V0LW1lbnUtLWJvZHlfX2xpZ2h0JzogbGlnaHQsXG4gICAgICAgICdpb3QtLWZseW91dC1tZW51LS1ib2R5X19vcGVuJzogb3BlblxuICAgICAgfVwiXG4gICAgPlxuICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICpuZ0lmPVwiaGFzQ29udGVudFRlbXBsYXRlXCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29udGVudFRlbXBsYXRlXCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgdG9vbHRpcDogdGhpcyB9XCJcbiAgICAgID5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8cCAqbmdJZj1cIiFoYXNDb250ZW50VGVtcGxhdGVcIj5cbiAgICAgICAge3sgZGlhbG9nQ29uZmlnLmNvbnRlbnQgfX1cbiAgICAgIDwvcD5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgRmx5b3V0TWVudVBhbmUgZXh0ZW5kcyBEaWFsb2cge1xuICAvKipcbiAgICogVGhpcyBzcGVjaWZpZXMgYW55IHZlcnRpY2FsIGFuZCBob3Jpem9udGFsIG9mZnNldCBmb3IgdGhlIHBvc2l0aW9uIG9mIHRoZSBkaWFsb2dcbiAgICovXG4gIEBJbnB1dCgpIHNldCBvZmZzZXQob3M6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkge1xuICAgIHRoaXMuX29mZnNldCA9IG9zO1xuICB9XG4gIGdldCBvZmZzZXQoKTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9IHtcbiAgICBpZiAoIXRoaXMuX29mZnNldCkge1xuICAgICAgcmV0dXJuIHsgeDogKHRoaXMuZGlhbG9nQ29uZmlnLmZsaXAgPyAtMSA6IDEpICogNCwgeTogMCB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG4gIHB1YmxpYyBoYXNDb250ZW50VGVtcGxhdGUgPSB0cnVlO1xuICBwdWJsaWMgZ2V0IGNvbnRlbnRUZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kaWFsb2dDb25maWcuY29udGVudCBhcyBUZW1wbGF0ZVJlZjxhbnk+O1xuICB9XG4gIC8qKlxuICAgKiBTZXRzIHRoZSByb2xlIG9mIHRoZSB0b29sdGlwLiBJZiB0aGVyZSdzIG5vIGZvY3VzYWJsZSBjb250ZW50IHdlIGxlYXZlIGl0IGFzIGEgYHRvb2x0aXBgLFxuICAgKiBpZiB0aGVyZSBfaXNfIGZvY3VzYWJsZSBjb250ZW50IHdlIHN3aXRjaCB0byB0aGUgaW50ZXJhY3RpdmUgYGRpYWxvZ2Agcm9sZS5cbiAgICovXG4gIHB1YmxpYyByb2xlID0gJ3Rvb2x0aXAnO1xuICBASW5wdXQoKSBidXR0b25MYWJlbCA9IHRoaXMuaTE4bi5nZXQoKS5PVkVSRkxPV19NRU5VLk9WRVJGTE9XO1xuXG4gIEBJbnB1dCgpIGxpZ2h0ID0gZmFsc2U7XG5cbiAgZ2V0IHBvc2l0aW9uKCkge1xuICAgIHJldHVybiBgJHt0aGlzLmRpYWxvZ0NvbmZpZy5wbGFjZW1lbnR9LSR7dGhpcy5kaWFsb2dDb25maWcuZmxpcCA/ICdlbmQnIDogJ3N0YXJ0J31gO1xuICB9XG5cbiAgQElucHV0KCkgb3BlbiA9IHRydWU7XG5cbiAgQE91dHB1dCgpIG9wZW5DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgcHJpdmF0ZSBfb2Zmc2V0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBlbGVtZW50U2VydmljZTogRWxlbWVudFNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIGkxOG46IEkxOG4sXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIGFuaW1hdGlvbkZyYW1lU2VydmljZTogQW5pbWF0aW9uRnJhbWVTZXJ2aWNlID0gbnVsbFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBlbGVtZW50U2VydmljZSwgYW5pbWF0aW9uRnJhbWVTZXJ2aWNlKTtcbiAgfVxuXG4gIHNob3VsZENsb3NlID0gKG1ldGE6IENsb3NlTWV0YSkgPT4ge1xuICAgIHJldHVybiAhdGhpcy5kaWFsb2cubmF0aXZlRWxlbWVudC5jb250YWlucyhtZXRhLnRhcmdldCk7XG4gIH07XG5cbiAgaGFuZGxlT3BlbkNoYW5nZShldmVudDogYm9vbGVhbikge1xuICAgIHRoaXMub3BlbiA9IGV2ZW50O1xuICAgIHRoaXMub3BlbkNoYW5nZS5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIG9uRGlhbG9nSW5pdCgpIHtcbiAgICBjb25zdCBjaGV2cm9uV2lkdGggPSAxNjtcbiAgICBjb25zdCBjaGV2cm9uSGVpZ2h0ID0gMTQ7XG4gICAgY29uc3QgYm9yZGVyV2lkdGggPSAyO1xuXG4gICAgY29uc3QgcG9zaXRpb25PdmVyZmxvd01lbnVWZXJ0aWNhbGx5ID0gKHBvcykgPT4ge1xuICAgICAgbGV0IG9mZnNldDtcbiAgICAgIGNvbnN0IGNsb3Nlc3RSZWwgPSBjbG9zZXN0QXR0cihcbiAgICAgICAgJ3Bvc2l0aW9uJyxcbiAgICAgICAgWydyZWxhdGl2ZScsICdmaXhlZCcsICdhYnNvbHV0ZSddLFxuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxuICAgICAgKTtcbiAgICAgIGxldCB0b3BGaXggPVxuICAgICAgICAoY2xvc2VzdFJlbCA/IGNsb3Nlc3RSZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICogLTEgOiAwKSAtXG4gICAgICAgIGNoZXZyb25IZWlnaHQgLyAyICtcbiAgICAgICAgMSAqIGJvcmRlcldpZHRoO1xuICAgICAgY29uc3QgbGVmdEZpeCA9IGNsb3Nlc3RSZWwgPyBjbG9zZXN0UmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKiAtMSA6IDA7XG5cbiAgICAgIGlmICh0aGlzLmRpYWxvZ0NvbmZpZy5wbGFjZW1lbnQgPT09ICd0b3AnKSB7XG4gICAgICAgIHRvcEZpeCArPSBjaGV2cm9uSGVpZ2h0IC8gMjtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqIDIwIGlzIGhhbGYgdGhlIHdpZHRoIG9mIHRoZSBvdmVyZmxvdyBtZW51IHRyaWdnZXIgZWxlbWVudC5cbiAgICAgICAqIHdlIGFsc28gbW92ZSB0aGUgZWxlbWVudCBieSBoYWxmIG9mIGl0J3Mgb3duIHdpZHRoLCBzaW5jZVxuICAgICAgICogcG9zaXRpb24gc2VydmljZSB3aWxsIHRyeSBhbmQgY2VudGVyIGV2ZXJ5dGhpbmdcbiAgICAgICAqL1xuICAgICAgb2Zmc2V0ID0gTWF0aC5yb3VuZCh0aGlzLmRpYWxvZy5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIC8gMikgLSAyMCAtIGNoZXZyb25XaWR0aCAvIDI7XG4gICAgICBpZiAodGhpcy5kaWFsb2dDb25maWcuZmxpcCkge1xuICAgICAgICByZXR1cm4gcG9zaXRpb24uYWRkT2Zmc2V0KHBvcywgdG9wRml4LCAtb2Zmc2V0ICsgbGVmdEZpeCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcG9zaXRpb24uYWRkT2Zmc2V0KHBvcywgdG9wRml4LCBvZmZzZXQgKyBsZWZ0Rml4KTtcbiAgICB9O1xuXG4gICAgdGhpcy5hZGRHYXBbJ2JvdHRvbSddID0gcG9zaXRpb25PdmVyZmxvd01lbnVWZXJ0aWNhbGx5O1xuICAgIHRoaXMuYWRkR2FwWyd0b3AnXSA9IHBvc2l0aW9uT3ZlcmZsb3dNZW51VmVydGljYWxseTtcblxuICAgIGNvbnN0IHBvc2l0aW9uT3ZlcmZsb3dNZW51SG9yaXpvbnRhbGx5ID0gKHBvcykgPT4ge1xuICAgICAgY29uc3QgYWRqdXN0ZWRPZmZzZXQgPSB0aGlzLmdldEFkanVzdE9mZnNldCgpO1xuICAgICAgY29uc3QgdG9wRml4ID1cbiAgICAgICAgKHRoaXMuZGlhbG9nLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0IC1cbiAgICAgICAgICB0aGlzLmRpYWxvZ0NvbmZpZy5wYXJlbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgLVxuICAgICAgICAgIGJvcmRlcldpZHRoKSAvXG4gICAgICAgIDI7XG4gICAgICBsZXQgbGVmdEZpeCA9ICh0aGlzLmRpYWxvZ0NvbmZpZy5wbGFjZW1lbnQgPT09ICdyaWdodCcgPyAxIDogLTEpICogYm9yZGVyV2lkdGg7XG4gICAgICBpZiAodGhpcy5kaWFsb2dDb25maWcucGxhY2VtZW50ID09PSAncmlnaHQnKSB7XG4gICAgICAgIGxlZnRGaXggLT0gY2hldnJvbldpZHRoIC8gMjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmRpYWxvZ0NvbmZpZy5mbGlwKSB7XG4gICAgICAgIHJldHVybiBwb3NpdGlvbi5hZGRPZmZzZXQoXG4gICAgICAgICAgcG9zLFxuICAgICAgICAgIC01ICsgYWRqdXN0ZWRPZmZzZXQudG9wIC0gdG9wRml4LFxuICAgICAgICAgIGFkanVzdGVkT2Zmc2V0LmxlZnQgKyBsZWZ0Rml4ICsgY2hldnJvbldpZHRoIC8gMlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBvc2l0aW9uLmFkZE9mZnNldChcbiAgICAgICAgcG9zLFxuICAgICAgICAtMyArIGFkanVzdGVkT2Zmc2V0LnRvcCArIHRvcEZpeCxcbiAgICAgICAgYWRqdXN0ZWRPZmZzZXQubGVmdCArIGxlZnRGaXhcbiAgICAgICk7XG4gICAgfTtcblxuICAgIHRoaXMuYWRkR2FwWydsZWZ0J10gPSBwb3NpdGlvbk92ZXJmbG93TWVudUhvcml6b250YWxseTtcbiAgICB0aGlzLmFkZEdhcFsncmlnaHQnXSA9IHBvc2l0aW9uT3ZlcmZsb3dNZW51SG9yaXpvbnRhbGx5O1xuXG4gICAgaWYgKCF0aGlzLmRpYWxvZ0NvbmZpZy5tZW51TGFiZWwpIHtcbiAgICAgIHRoaXMuZGlhbG9nQ29uZmlnLm1lbnVMYWJlbCA9IHRoaXMuaTE4bi5nZXQoKS5PVkVSRkxPV19NRU5VLk9WRVJGTE9XO1xuICAgIH1cbiAgfVxuXG4gIGdldEFkanVzdE9mZnNldCgpIHtcbiAgICBjb25zdCBjbG9zZXN0V2l0aFBvcyA9IGNsb3Nlc3RBdHRyKFxuICAgICAgJ3Bvc2l0aW9uJyxcbiAgICAgIFsncmVsYXRpdmUnLCAnZml4ZWQnLCAnYWJzb2x1dGUnXSxcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApO1xuICAgIGNvbnN0IHRvcFBvcyA9IGNsb3Nlc3RXaXRoUG9zID8gY2xvc2VzdFdpdGhQb3MuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICogLTEgOiAwO1xuICAgIGNvbnN0IGxlZnRQb3MgPSBjbG9zZXN0V2l0aFBvcyA/IGNsb3Nlc3RXaXRoUG9zLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKiAtMSA6IDA7XG5cbiAgICByZXR1cm4geyB0b3A6IHRvcFBvcywgbGVmdDogbGVmdFBvcyB9O1xuICB9XG59XG4iXX0=