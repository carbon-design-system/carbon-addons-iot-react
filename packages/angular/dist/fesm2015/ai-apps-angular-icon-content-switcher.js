/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-icon-content-switcher.js
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


import { Directive, HostBinding, Input, Component, ContentChildren, NgModule } from '@angular/core';
import { ContentSwitcherOption, ContentSwitcher } from 'carbon-components-angular';

/**
 * selector: `aiIconContentOption`
 */
class IconContentSwitcherOption extends ContentSwitcherOption {
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
class IconContentSwitcher extends ContentSwitcher {
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

// modules
class IconContentSwitcherModule {
}
IconContentSwitcherModule.decorators = [
    { type: NgModule, args: [{
                declarations: [IconContentSwitcher, IconContentSwitcherOption],
                exports: [IconContentSwitcher, IconContentSwitcherOption],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { IconContentSwitcher, IconContentSwitcherModule, IconContentSwitcherOption };
//# sourceMappingURL=ai-apps-angular-icon-content-switcher.js.map
