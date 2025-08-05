/**
 *
 * @ai-apps/angular v2.155.1 | icon-content-switcher-option.directive.js
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
import { ContentSwitcherOption } from 'carbon-components-angular';
/**
 * selector: `aiIconContentOption`
 */
export class IconContentSwitcherOption extends ContentSwitcherOption {
    constructor() {
        super(...arguments);
        this.mainClass = `iot--icon-switch
    bx--btn
    bx--btn--secondary
    bx--tooltip--hidden
    bx--btn--icon-only
    bx--tooltip__trigger
    bx--tooltip--a11y
    bx--btn--icon-only--top
    bx--tooltip--align-center`;
        this.selectedClass = false;
        this.size = 'md';
        this.theme = 'dark';
    }
    get unselectedClass() {
        return !this.selectedClass;
    }
    get isDefaultSize() {
        return this.size === 'md';
    }
    get isSmallSize() {
        return this.size === 'sm';
    }
    get isLargeSize() {
        return this.size === 'lg';
    }
    get isLight() {
        return this.theme === 'light';
    }
    get isUnselectedLight() {
        return this.isLight && !this.selectedClass;
    }
}
IconContentSwitcherOption.decorators = [
    { type: Directive, args: [{
                selector: '[aiIconContentOption]',
                exportAs: 'aiIconContentOption',
            },] }
];
IconContentSwitcherOption.propDecorators = {
    mainClass: [{ type: HostBinding, args: ['class',] }],
    selectedClass: [{ type: HostBinding, args: ['class.iot--icon-switch--selected',] }, { type: HostBinding, args: ['class.bx--content-switcher--selected',] }],
    unselectedClass: [{ type: HostBinding, args: ['class.iot--icon-switch--unselected',] }],
    isDefaultSize: [{ type: HostBinding, args: ['class.iot--icon-switch--default',] }],
    isSmallSize: [{ type: HostBinding, args: ['class.iot--icon-switch--small',] }],
    isLargeSize: [{ type: HostBinding, args: ['class.iot--icon-switch--large',] }],
    isLight: [{ type: HostBinding, args: ['class.iot--icon-switch--light',] }],
    isUnselectedLight: [{ type: HostBinding, args: ['class.iot--icon-switch--unselected--light',] }],
    size: [{ type: Input }],
    theme: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1jb250ZW50LXN3aXRjaGVyLW9wdGlvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaWNvbi1jb250ZW50LXN3aXRjaGVyL2ljb24tY29udGVudC1zd2l0Y2hlci1vcHRpb24uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVsRTs7R0FFRztBQUtILE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxxQkFBcUI7SUFKcEU7O1FBS3dCLGNBQVMsR0FBRzs7Ozs7Ozs7OEJBUU4sQ0FBQztRQUc3QixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQXlCYixTQUFJLEdBQXVCLElBQUksQ0FBQztRQUNoQyxVQUFLLEdBQXFCLE1BQU0sQ0FBQztJQUM1QyxDQUFDO0lBMUJDLElBQXVELGVBQWU7UUFDcEUsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQW9ELGFBQWE7UUFDL0QsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBa0QsV0FBVztRQUMzRCxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUFrRCxXQUFXO1FBQzNELE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQWtELE9BQU87UUFDdkQsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLE9BQU8sQ0FBQztJQUNoQyxDQUFDO0lBRUQsSUFBOEQsaUJBQWlCO1FBQzdFLE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDN0MsQ0FBQzs7O1lBdkNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxRQUFRLEVBQUUscUJBQXFCO2FBQ2hDOzs7d0JBRUUsV0FBVyxTQUFDLE9BQU87NEJBU25CLFdBQVcsU0FBQyxrQ0FBa0MsY0FDOUMsV0FBVyxTQUFDLHNDQUFzQzs4QkFFbEQsV0FBVyxTQUFDLG9DQUFvQzs0QkFJaEQsV0FBVyxTQUFDLGlDQUFpQzswQkFJN0MsV0FBVyxTQUFDLCtCQUErQjswQkFJM0MsV0FBVyxTQUFDLCtCQUErQjtzQkFJM0MsV0FBVyxTQUFDLCtCQUErQjtnQ0FJM0MsV0FBVyxTQUFDLDJDQUEyQzttQkFJdkQsS0FBSztvQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0QmluZGluZywgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRlbnRTd2l0Y2hlck9wdGlvbiB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuXG4vKipcbiAqIHNlbGVjdG9yOiBgYWlJY29uQ29udGVudE9wdGlvbmBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2FpSWNvbkNvbnRlbnRPcHRpb25dJyxcbiAgZXhwb3J0QXM6ICdhaUljb25Db250ZW50T3B0aW9uJyxcbn0pXG5leHBvcnQgY2xhc3MgSWNvbkNvbnRlbnRTd2l0Y2hlck9wdGlvbiBleHRlbmRzIENvbnRlbnRTd2l0Y2hlck9wdGlvbiB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBtYWluQ2xhc3MgPSBgaW90LS1pY29uLXN3aXRjaFxuICAgIGJ4LS1idG5cbiAgICBieC0tYnRuLS1zZWNvbmRhcnlcbiAgICBieC0tdG9vbHRpcC0taGlkZGVuXG4gICAgYngtLWJ0bi0taWNvbi1vbmx5XG4gICAgYngtLXRvb2x0aXBfX3RyaWdnZXJcbiAgICBieC0tdG9vbHRpcC0tYTExeVxuICAgIGJ4LS1idG4tLWljb24tb25seS0tdG9wXG4gICAgYngtLXRvb2x0aXAtLWFsaWduLWNlbnRlcmA7XG4gIEBIb3N0QmluZGluZygnY2xhc3MuaW90LS1pY29uLXN3aXRjaC0tc2VsZWN0ZWQnKVxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmJ4LS1jb250ZW50LXN3aXRjaGVyLS1zZWxlY3RlZCcpXG4gIHNlbGVjdGVkQ2xhc3MgPSBmYWxzZTtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLWljb24tc3dpdGNoLS11bnNlbGVjdGVkJykgZ2V0IHVuc2VsZWN0ZWRDbGFzcygpIHtcbiAgICByZXR1cm4gIXRoaXMuc2VsZWN0ZWRDbGFzcztcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuaW90LS1pY29uLXN3aXRjaC0tZGVmYXVsdCcpIGdldCBpc0RlZmF1bHRTaXplKCkge1xuICAgIHJldHVybiB0aGlzLnNpemUgPT09ICdtZCc7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0taWNvbi1zd2l0Y2gtLXNtYWxsJykgZ2V0IGlzU21hbGxTaXplKCkge1xuICAgIHJldHVybiB0aGlzLnNpemUgPT09ICdzbSc7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0taWNvbi1zd2l0Y2gtLWxhcmdlJykgZ2V0IGlzTGFyZ2VTaXplKCkge1xuICAgIHJldHVybiB0aGlzLnNpemUgPT09ICdsZyc7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0taWNvbi1zd2l0Y2gtLWxpZ2h0JykgZ2V0IGlzTGlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbWUgPT09ICdsaWdodCc7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0taWNvbi1zd2l0Y2gtLXVuc2VsZWN0ZWQtLWxpZ2h0JykgZ2V0IGlzVW5zZWxlY3RlZExpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmlzTGlnaHQgJiYgIXRoaXMuc2VsZWN0ZWRDbGFzcztcbiAgfVxuXG4gIEBJbnB1dCgpIHNpemU6ICdzbScgfCAnbWQnIHwgJ2xnJyA9ICdtZCc7XG4gIEBJbnB1dCgpIHRoZW1lOiAnbGlnaHQnIHwgJ2RhcmsnID0gJ2RhcmsnO1xufVxuIl19