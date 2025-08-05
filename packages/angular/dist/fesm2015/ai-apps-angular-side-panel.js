/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-side-panel.js
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


import { EventEmitter, Component, ViewEncapsulation, HostBinding, Input, Output, Directive, NgModule } from '@angular/core';
import { Close16, ChevronLeft16, ChevronRight16, OpenPanelLeft16, OpenPanelRight16 } from '@carbon/icons';
import { IconService, DialogService, ButtonModule, I18nModule, PlaceholderModule, DialogModule, IconModule, LinkModule } from 'carbon-components-angular';
import { CommonModule } from '@angular/common';

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
class SidePanel {
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

/**
 * selector: `aiSidePanelTitle`
 */
class SidePanelTitleDirective {
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

/**
 * selector: `aiSidePanelFooter`
 */
class SidePanelFooterDirective {
    constructor() {
        this.footerClass = true;
    }
}
SidePanelFooterDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiSidePanelFooter]',
                exportAs: 'aiSidePanelFooter',
            },] }
];
SidePanelFooterDirective.propDecorators = {
    footerClass: [{ type: HostBinding, args: ['class.iot--side-panel-footer',] }]
};

// modules
class SidePanelModule {
}
SidePanelModule.decorators = [
    { type: NgModule, args: [{
                declarations: [SidePanel, SidePanelTitleDirective, SidePanelFooterDirective],
                exports: [SidePanel, SidePanelTitleDirective, SidePanelFooterDirective],
                providers: [DialogService],
                imports: [
                    ButtonModule,
                    CommonModule,
                    I18nModule,
                    PlaceholderModule,
                    DialogModule,
                    IconModule,
                    LinkModule,
                ],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { SidePanel, SidePanelFooterDirective, SidePanelModule, SidePanelTitleDirective };
//# sourceMappingURL=ai-apps-angular-side-panel.js.map
