/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-card.umd.js
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


(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('carbon-components-angular'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@ai-apps/angular/card', ['exports', '@angular/core', 'rxjs', 'carbon-components-angular', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = global["ai-apps"].angular || {}, global["ai-apps"].angular.card = {}), global.ng.core, global.rxjs, global.carbonComponentsAngular, global.ng.common));
})(this, (function (exports, core, rxjs, carbonComponentsAngular, common) { 'use strict';

    /**
     * Service for data and config shared between card components
     */
    var CardService = /** @class */ (function () {
        function CardService() {
            /**
             * Overall height of the card
             */
            this.height = null;
            this.headerHeight = 48;
            this.expandedSubject = new rxjs.BehaviorSubject(false);
            this.subscriptions = new rxjs.Subscription();
        }
        /**
         * Set the overall height of the card in pixels
         *
         * @param height height specified in pixels
         */
        CardService.prototype.setCardHeight = function (height) {
            this.height = height;
        };
        /**
         * Get the overall height of the card as a formatted string
         *
         * @returns the height as a string ex. `'200px'`
         */
        CardService.prototype.getCardHeight = function () {
            if (!this.height) {
                return '';
            }
            return this.height + "px";
        };
        /**
         * Get the height of just the content area as a formatted string
         *
         * @returns the height as a string ex. `'200px'`
         */
        CardService.prototype.getContentHeight = function () {
            if (!this.height) {
                return '';
            }
            return this.height - this.headerHeight + "px";
        };
        CardService.prototype.setExpanded = function (isExpanded) {
            this.expandedSubject.next(isExpanded);
        };
        CardService.prototype.getExpanded = function () {
            return this.expandedSubject.value;
        };
        CardService.prototype.onExpand = function (listener) {
            var subscription = this.expandedSubject.subscribe(listener);
            this.subscriptions.add(subscription);
        };
        CardService.prototype.ngOnDestroy = function () {
            this.subscriptions.unsubscribe();
        };
        return CardService;
    }());
    CardService.decorators = [
        { type: core.Injectable }
    ];

    var CardContentComponent = /** @class */ (function () {
        function CardContentComponent(cardService, elementRef) {
            this.cardService = cardService;
            this.elementRef = elementRef;
            this.contentClass = true;
            this.expandedClass = false;
            this.isEmpty = false;
        }
        CardContentComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.cardService.onExpand(function (value) {
                _this.expandedClass = value;
            });
        };
        CardContentComponent.prototype.ngAfterViewInit = function () {
            var hostElement = this.elementRef.nativeElement;
            hostElement.style.setProperty('--card-content-height', this.cardService.getContentHeight());
        };
        CardContentComponent.prototype.isTemplate = function (value) {
            return value instanceof core.TemplateRef;
        };
        return CardContentComponent;
    }());
    CardContentComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-card-content',
                    template: "\n    <ng-content></ng-content>\n    <div *ngIf=\"isEmpty\" class=\"iot--card--empty-message-wrapper\">\n      <ng-container *ngIf=\"!isTemplate(emptyText)\">{{ emptyText }}</ng-container>\n      <ng-template *ngIf=\"isTemplate(emptyText)\" [ngTemplateOutlet]=\"emptyText\"></ng-template>\n    </div>\n  "
                },] }
    ];
    CardContentComponent.ctorParameters = function () { return [
        { type: CardService },
        { type: core.ElementRef }
    ]; };
    CardContentComponent.propDecorators = {
        contentClass: [{ type: core.HostBinding, args: ['class.iot--card--content',] }],
        expandedClass: [{ type: core.HostBinding, args: ['class.iot--card--content--expanded',] }],
        emptyText: [{ type: core.Input }],
        isEmpty: [{ type: core.Input }]
    };

    var CardHeaderComponent = /** @class */ (function () {
        function CardHeaderComponent() {
            this.hostClass = 'true';
        }
        return CardHeaderComponent;
    }());
    CardHeaderComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-card-header',
                    template: " <ng-content></ng-content> "
                },] }
    ];
    CardHeaderComponent.propDecorators = {
        hostClass: [{ type: core.HostBinding, args: ['class.iot--card--header',] }]
    };

    var CardTitleComponent = /** @class */ (function () {
        function CardTitleComponent() {
            this.text = '';
            this.hostClass = true;
        }
        return CardTitleComponent;
    }());
    CardTitleComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-card-title',
                    template: "\n    <div class=\"iot--card--title--text\" [attr.title]=\"text\">\n      {{ text }}\n    </div>\n    <ng-content></ng-content>\n  "
                },] }
    ];
    CardTitleComponent.propDecorators = {
        text: [{ type: core.Input }],
        hostClass: [{ type: core.HostBinding, args: ['class.iot--card--title',] }]
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
    var CardToolbarActionDirective = /** @class */ (function () {
        /**
         *
         * @param overflowMenuRef optional ref to the OverflowMenu instance this directive may be attached to
         */
        function CardToolbarActionDirective(overflowMenuRef) {
            this.overflowMenuRef = overflowMenuRef;
            this.classList = 'iot--card--toolbar-action iot--card--toolbar-svg-wrapper bx--btn--icon-only bx--btn bx--btn--ghost';
        }
        CardToolbarActionDirective.prototype.ngOnInit = function () {
            if (this.overflowMenuRef) {
                this.overflowMenuRef.triggerClass = this.classList;
                this.overflowMenuRef.flip = true;
                this.overflowMenuRef.offset = { x: 4, y: 0 };
                this.classList = '';
            }
        };
        return CardToolbarActionDirective;
    }());
    CardToolbarActionDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[aiCardToolbarAction]',
                },] }
    ];
    CardToolbarActionDirective.ctorParameters = function () { return [
        { type: carbonComponentsAngular.OverflowMenu, decorators: [{ type: core.Optional }] }
    ]; };
    CardToolbarActionDirective.propDecorators = {
        classList: [{ type: core.HostBinding, args: ['class',] }]
    };

    var CardToolbarComponent = /** @class */ (function () {
        function CardToolbarComponent() {
            this.toolbarClass = true;
        }
        return CardToolbarComponent;
    }());
    CardToolbarComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-card-toolbar',
                    template: " <ng-content></ng-content> "
                },] }
    ];
    CardToolbarComponent.propDecorators = {
        toolbarClass: [{ type: core.HostBinding, args: ['class.iot--card--toolbar',] }]
    };

    var CardDateRangeComponent = /** @class */ (function () {
        function CardDateRangeComponent() {
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
            this.valueChange = new core.EventEmitter();
            /**
             * Contains the content of the currently selected range item
             */
            this.selectedRangeContent = this.getSelectedRange().content;
            this.onChange = function (obj) { };
            this.onTouched = function () { };
        }
        CardDateRangeComponent.prototype.ngOnChanges = function (changes) {
            if (changes.value) {
                this.selectRange(changes.value.currentValue);
            }
        };
        CardDateRangeComponent.prototype.onRangeSelected = function (range) {
            this.selectRange(range);
            this.onChange(range);
            this.valueChange.emit(range);
        };
        CardDateRangeComponent.prototype.writeValue = function (rangeId) {
            this.selectRange(rangeId);
        };
        CardDateRangeComponent.prototype.registerOnChange = function (fn) {
            this.onChange = fn;
        };
        CardDateRangeComponent.prototype.registerOnTouched = function (fn) {
            this.onTouched = fn;
        };
        /**
         * Updates the `ranges` list to only select the provided id.
         *
         * Also updates `selectedRangeContent`
         *
         * falsy/null values will select the `default` option
         *
         * @param rangeId id of the range item to select
         */
        CardDateRangeComponent.prototype.selectRange = function (rangeId) {
            if (!rangeId) {
                rangeId = 'default';
            }
            this.ranges = this.ranges.map(function (range) {
                if (range.id === rangeId) {
                    range.selected = true;
                }
                else {
                    range.selected = false;
                }
                return range;
            });
            this.selectedRangeContent = this.getSelectedRange().content;
        };
        CardDateRangeComponent.prototype.getSelectedRange = function () {
            return this.ranges.find(function (range) { return range.selected; });
        };
        return CardDateRangeComponent;
    }());
    CardDateRangeComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-card-date-range',
                    template: "\n    <div class=\"iot--card--toolbar-timerange-label\">{{ selectedRangeContent }}</div>\n    <ibm-overflow-menu aiCardToolbarAction [customTrigger]=\"triggerIcon\">\n      <ibm-overflow-menu-option *ngFor=\"let range of ranges\" (selected)=\"onRangeSelected(range.id)\">\n        {{ range.content }}\n      </ibm-overflow-menu-option>\n    </ibm-overflow-menu>\n    <ng-template #triggerIcon>\n      <svg ibmIcon=\"calendar\" size=\"16\"></svg>\n    </ng-template>\n  "
                },] }
    ];
    CardDateRangeComponent.propDecorators = {
        wrapperClass: [{ type: core.HostBinding, args: ['class.iot--card--toolbar-date-range-wrapper',] }],
        ranges: [{ type: core.Input }],
        value: [{ type: core.Input }],
        valueChange: [{ type: core.Output }]
    };

    var ɵ0 = function (parentCardService) {
        return parentCardService || new CardService();
    };
    /**
     * Provider for `CardService` that lets us either use a service provided to us
     * by the parent injector, or fall back to a new instance for this component tree.
     */
    var CARD_SERVICE_PROVIDER = {
        provide: CardService,
        deps: [[new core.Optional(), new core.SkipSelf(), CardService]],
        useFactory: ɵ0,
    };
    var CardComponent = /** @class */ (function () {
        function CardComponent(cardService, elementRef) {
            this.cardService = cardService;
            this.elementRef = elementRef;
            this.defaultHeight = null;
            this.expanded = false;
            this.cardClass = true;
            this.wrapperClass = true;
            this.selected = false;
            this.role = 'presentation';
        }
        CardComponent.prototype.ngOnChanges = function (changes) {
            if (changes.expanded) {
                this.cardService.setExpanded(changes.expanded.currentValue);
            }
        };
        CardComponent.prototype.ngOnInit = function () {
            if (this.defaultHeight) {
                this.cardService.setCardHeight(this.defaultHeight);
            }
        };
        CardComponent.prototype.ngAfterViewInit = function () {
            var hostElement = this.elementRef.nativeElement;
            hostElement.style.setProperty('--card-default-height', this.cardService.getCardHeight());
        };
        return CardComponent;
    }());
    CardComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-card',
                    template: "\n    <ng-template #content>\n      <ng-content></ng-content>\n    </ng-template>\n    <ng-container *ngIf=\"!expanded\" [ngTemplateOutlet]=\"content\"></ng-container>\n    <div *ngIf=\"expanded\" class=\"bx--modal is-visible\">\n      <div class=\"iot--card iot--card--wrapper expanded\">\n        <ng-container [ngTemplateOutlet]=\"content\"></ng-container>\n      </div>\n    </div>\n  ",
                    providers: [CARD_SERVICE_PROVIDER],
                    styles: ["\n      .expanded {\n        height: calc(100% - 50px);\n        width: calc(100% - 50px);\n      }\n    "]
                },] }
    ];
    CardComponent.ctorParameters = function () { return [
        { type: CardService },
        { type: core.ElementRef }
    ]; };
    CardComponent.propDecorators = {
        defaultHeight: [{ type: core.Input }],
        expanded: [{ type: core.Input }],
        cardClass: [{ type: core.HostBinding, args: ['class.iot--card',] }],
        wrapperClass: [{ type: core.HostBinding, args: ['class.iot--card--wrapper',] }],
        selected: [{ type: core.HostBinding, args: ['class.iot--card--wrapper__selected',] }, { type: core.Input }],
        role: [{ type: core.HostBinding, args: ['attr.role',] }]
    };

    var CardModule = /** @class */ (function () {
        function CardModule() {
        }
        return CardModule;
    }());
    CardModule.decorators = [
        { type: core.NgModule, args: [{
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
                    imports: [common.CommonModule, carbonComponentsAngular.IconModule, carbonComponentsAngular.DialogModule],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.CardComponent = CardComponent;
    exports.CardContentComponent = CardContentComponent;
    exports.CardDateRangeComponent = CardDateRangeComponent;
    exports.CardHeaderComponent = CardHeaderComponent;
    exports.CardModule = CardModule;
    exports.CardTitleComponent = CardTitleComponent;
    exports.CardToolbarActionDirective = CardToolbarActionDirective;
    exports.CardToolbarComponent = CardToolbarComponent;
    exports["ɵa"] = CardService;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular-card.umd.js.map
