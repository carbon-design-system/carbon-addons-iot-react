/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-flyout-menu.js
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


import { EventEmitter, Component, ViewEncapsulation, Input, Output, ElementRef, Optional, Directive, ViewContainerRef, HostBinding, NgModule } from '@angular/core';
import { IconService, Dialog, closestAttr, position, ElementService, AnimationFrameService, TooltipDirective, DialogService, ButtonModule, I18nModule, PlaceholderModule, DialogModule, IconModule, LinkModule } from 'carbon-components-angular';
import { Filter16 } from '@carbon/icons';
import { I18n } from 'carbon-components-angular/i18n';
import { EventService } from 'carbon-components-angular/utils';
import { CommonModule } from '@angular/common';

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
class FlyoutMenu {
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
class FlyoutMenuPane extends Dialog {
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

/**
 * selector: `aiFlyoutMenu`
 */
class FlyoutMenuDirective extends TooltipDirective {
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

/**
 * html:
 * ```
 * <ai-flyout-menu-footer>
 *	<button ibmButton="secondary">Cancel</button>
 *	<button ibmButton>Apply</button>
 * </ai-flyout-menu-footer>
 * ```
 */
class FlyoutMenuFooter {
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

// modules
class FlyoutMenuModule {
}
FlyoutMenuModule.decorators = [
    { type: NgModule, args: [{
                declarations: [FlyoutMenu, FlyoutMenuPane, FlyoutMenuDirective, FlyoutMenuFooter],
                exports: [FlyoutMenu, FlyoutMenuPane, FlyoutMenuDirective, FlyoutMenuFooter],
                providers: [DialogService],
                entryComponents: [FlyoutMenuPane],
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

export { FlyoutMenu, FlyoutMenuDirective, FlyoutMenuFooter, FlyoutMenuModule, FlyoutMenuPane };
//# sourceMappingURL=ai-apps-angular-flyout-menu.js.map
