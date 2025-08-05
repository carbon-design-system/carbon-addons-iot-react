/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-card.js
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


import { Injectable, TemplateRef, Component, ElementRef, HostBinding, Input, Directive, Optional, EventEmitter, Output, SkipSelf, NgModule } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OverflowMenu, IconModule, DialogModule } from 'carbon-components-angular';
import { CommonModule } from '@angular/common';

/**
 * Service for data and config shared between card components
 */
class CardService {
    constructor() {
        /**
         * Overall height of the card
         */
        this.height = null;
        this.headerHeight = 48;
        this.expandedSubject = new BehaviorSubject(false);
        this.subscriptions = new Subscription();
    }
    /**
     * Set the overall height of the card in pixels
     *
     * @param height height specified in pixels
     */
    setCardHeight(height) {
        this.height = height;
    }
    /**
     * Get the overall height of the card as a formatted string
     *
     * @returns the height as a string ex. `'200px'`
     */
    getCardHeight() {
        if (!this.height) {
            return '';
        }
        return `${this.height}px`;
    }
    /**
     * Get the height of just the content area as a formatted string
     *
     * @returns the height as a string ex. `'200px'`
     */
    getContentHeight() {
        if (!this.height) {
            return '';
        }
        return `${this.height - this.headerHeight}px`;
    }
    setExpanded(isExpanded) {
        this.expandedSubject.next(isExpanded);
    }
    getExpanded() {
        return this.expandedSubject.value;
    }
    onExpand(listener) {
        const subscription = this.expandedSubject.subscribe(listener);
        this.subscriptions.add(subscription);
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
CardService.decorators = [
    { type: Injectable }
];

class CardContentComponent {
    constructor(cardService, elementRef) {
        this.cardService = cardService;
        this.elementRef = elementRef;
        this.contentClass = true;
        this.expandedClass = false;
        this.isEmpty = false;
    }
    ngOnInit() {
        this.cardService.onExpand((value) => {
            this.expandedClass = value;
        });
    }
    ngAfterViewInit() {
        const hostElement = this.elementRef.nativeElement;
        hostElement.style.setProperty('--card-content-height', this.cardService.getContentHeight());
    }
    isTemplate(value) {
        return value instanceof TemplateRef;
    }
}
CardContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-card-content',
                template: `
    <ng-content></ng-content>
    <div *ngIf="isEmpty" class="iot--card--empty-message-wrapper">
      <ng-container *ngIf="!isTemplate(emptyText)">{{ emptyText }}</ng-container>
      <ng-template *ngIf="isTemplate(emptyText)" [ngTemplateOutlet]="emptyText"></ng-template>
    </div>
  `
            },] }
];
CardContentComponent.ctorParameters = () => [
    { type: CardService },
    { type: ElementRef }
];
CardContentComponent.propDecorators = {
    contentClass: [{ type: HostBinding, args: ['class.iot--card--content',] }],
    expandedClass: [{ type: HostBinding, args: ['class.iot--card--content--expanded',] }],
    emptyText: [{ type: Input }],
    isEmpty: [{ type: Input }]
};

class CardHeaderComponent {
    constructor() {
        this.hostClass = 'true';
    }
}
CardHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-card-header',
                template: ` <ng-content></ng-content> `
            },] }
];
CardHeaderComponent.propDecorators = {
    hostClass: [{ type: HostBinding, args: ['class.iot--card--header',] }]
};

class CardTitleComponent {
    constructor() {
        this.text = '';
        this.hostClass = true;
    }
}
CardTitleComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-card-title',
                template: `
    <div class="iot--card--title--text" [attr.title]="text">
      {{ text }}
    </div>
    <ng-content></ng-content>
  `
            },] }
];
CardTitleComponent.propDecorators = {
    text: [{ type: Input }],
    hostClass: [{ type: HostBinding, args: ['class.iot--card--title',] }]
};

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
class CardToolbarActionDirective {
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

class CardToolbarComponent {
    constructor() {
        this.toolbarClass = true;
    }
}
CardToolbarComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-card-toolbar',
                template: ` <ng-content></ng-content> `
            },] }
];
CardToolbarComponent.propDecorators = {
    toolbarClass: [{ type: HostBinding, args: ['class.iot--card--toolbar',] }]
};

class CardDateRangeComponent {
    constructor() {
        this.wrapperClass = true;
        /**
         * List of date/time ranges to display in the overflow menu.
         *
         * Uses a modified `ListItem` array. `id` keys **must** be provided.
         *
         * If a null is passed to the ngModel or `value` Input the item with
         * the `id` of `"default"` will be selected.
         */
        this.ranges = [
            {
                id: 'default',
                content: 'Default',
                selected: true,
            },
            {
                id: 'last-24-hours',
                content: 'Last 24 hours',
                selected: false,
            },
            {
                id: 'last-7-days',
                content: 'Last 7 days',
                selected: false,
            },
            {
                id: 'last-month',
                content: 'Last month',
                selected: false,
            },
            {
                id: 'last-quarter',
                content: 'Last quarter',
                selected: false,
            },
            {
                id: 'last-year',
                content: 'Last year',
                selected: false,
            },
            {
                id: 'this-week',
                content: 'This week',
                selected: false,
                divider: true,
            },
            {
                id: 'this-month',
                content: 'This month',
                selected: false,
            },
            {
                id: 'this-quarter',
                content: 'This quarter',
                selected: false,
            },
            {
                id: 'this-year',
                content: 'This year',
                selected: false,
            },
        ];
        /**
         * Set to the id of a range item to select it
         */
        this.value = 'default';
        /**
         * Emits the id of the currently selected range item
         */
        this.valueChange = new EventEmitter();
        /**
         * Contains the content of the currently selected range item
         */
        this.selectedRangeContent = this.getSelectedRange().content;
        this.onChange = (obj) => { };
        this.onTouched = () => { };
    }
    ngOnChanges(changes) {
        if (changes.value) {
            this.selectRange(changes.value.currentValue);
        }
    }
    onRangeSelected(range) {
        this.selectRange(range);
        this.onChange(range);
        this.valueChange.emit(range);
    }
    writeValue(rangeId) {
        this.selectRange(rangeId);
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Updates the `ranges` list to only select the provided id.
     *
     * Also updates `selectedRangeContent`
     *
     * falsy/null values will select the `default` option
     *
     * @param rangeId id of the range item to select
     */
    selectRange(rangeId) {
        if (!rangeId) {
            rangeId = 'default';
        }
        this.ranges = this.ranges.map((range) => {
            if (range.id === rangeId) {
                range.selected = true;
            }
            else {
                range.selected = false;
            }
            return range;
        });
        this.selectedRangeContent = this.getSelectedRange().content;
    }
    getSelectedRange() {
        return this.ranges.find((range) => range.selected);
    }
}
CardDateRangeComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-card-date-range',
                template: `
    <div class="iot--card--toolbar-timerange-label">{{ selectedRangeContent }}</div>
    <ibm-overflow-menu aiCardToolbarAction [customTrigger]="triggerIcon">
      <ibm-overflow-menu-option *ngFor="let range of ranges" (selected)="onRangeSelected(range.id)">
        {{ range.content }}
      </ibm-overflow-menu-option>
    </ibm-overflow-menu>
    <ng-template #triggerIcon>
      <svg ibmIcon="calendar" size="16"></svg>
    </ng-template>
  `
            },] }
];
CardDateRangeComponent.propDecorators = {
    wrapperClass: [{ type: HostBinding, args: ['class.iot--card--toolbar-date-range-wrapper',] }],
    ranges: [{ type: Input }],
    value: [{ type: Input }],
    valueChange: [{ type: Output }]
};

const ɵ0 = (parentCardService) => {
    return parentCardService || new CardService();
};
/**
 * Provider for `CardService` that lets us either use a service provided to us
 * by the parent injector, or fall back to a new instance for this component tree.
 */
const CARD_SERVICE_PROVIDER = {
    provide: CardService,
    deps: [[new Optional(), new SkipSelf(), CardService]],
    useFactory: ɵ0,
};
class CardComponent {
    constructor(cardService, elementRef) {
        this.cardService = cardService;
        this.elementRef = elementRef;
        this.defaultHeight = null;
        this.expanded = false;
        this.cardClass = true;
        this.wrapperClass = true;
        this.selected = false;
        this.role = 'presentation';
    }
    ngOnChanges(changes) {
        if (changes.expanded) {
            this.cardService.setExpanded(changes.expanded.currentValue);
        }
    }
    ngOnInit() {
        if (this.defaultHeight) {
            this.cardService.setCardHeight(this.defaultHeight);
        }
    }
    ngAfterViewInit() {
        const hostElement = this.elementRef.nativeElement;
        hostElement.style.setProperty('--card-default-height', this.cardService.getCardHeight());
    }
}
CardComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-card',
                template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
    <ng-container *ngIf="!expanded" [ngTemplateOutlet]="content"></ng-container>
    <div *ngIf="expanded" class="bx--modal is-visible">
      <div class="iot--card iot--card--wrapper expanded">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </div>
    </div>
  `,
                providers: [CARD_SERVICE_PROVIDER],
                styles: [`
      .expanded {
        height: calc(100% - 50px);
        width: calc(100% - 50px);
      }
    `]
            },] }
];
CardComponent.ctorParameters = () => [
    { type: CardService },
    { type: ElementRef }
];
CardComponent.propDecorators = {
    defaultHeight: [{ type: Input }],
    expanded: [{ type: Input }],
    cardClass: [{ type: HostBinding, args: ['class.iot--card',] }],
    wrapperClass: [{ type: HostBinding, args: ['class.iot--card--wrapper',] }],
    selected: [{ type: HostBinding, args: ['class.iot--card--wrapper__selected',] }, { type: Input }],
    role: [{ type: HostBinding, args: ['attr.role',] }]
};

class CardModule {
}
CardModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    CardContentComponent,
                    CardHeaderComponent,
                    CardTitleComponent,
                    CardToolbarActionDirective,
                    CardToolbarComponent,
                    CardDateRangeComponent,
                    CardComponent,
                ],
                exports: [
                    CardContentComponent,
                    CardHeaderComponent,
                    CardTitleComponent,
                    CardToolbarActionDirective,
                    CardToolbarComponent,
                    CardDateRangeComponent,
                    CardComponent,
                ],
                imports: [CommonModule, IconModule, DialogModule],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { CardComponent, CardContentComponent, CardDateRangeComponent, CardHeaderComponent, CardModule, CardTitleComponent, CardToolbarActionDirective, CardToolbarComponent, CardService as ɵa };
//# sourceMappingURL=ai-apps-angular-card.js.map
