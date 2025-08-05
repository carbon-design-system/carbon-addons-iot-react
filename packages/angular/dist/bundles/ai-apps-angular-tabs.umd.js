/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-tabs.umd.js
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
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('carbon-components-angular'), require('rxjs/operators'), require('carbon-components-angular/tabs'), require('carbon-components-angular/context-menu')) :
    typeof define === 'function' && define.amd ? define('@ai-apps/angular/tabs', ['exports', '@angular/core', '@angular/common', 'carbon-components-angular', 'rxjs/operators', 'carbon-components-angular/tabs', 'carbon-components-angular/context-menu'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = global["ai-apps"].angular || {}, global["ai-apps"].angular.tabs = {}), global.ng.core, global.ng.common, global.carbonComponentsAngular, global.rxjs.operators, global.tabs, global.contextMenu));
})(this, (function (exports, core, common, carbonComponentsAngular, operators, tabs, contextMenu) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
                if (e.indexOf(p[i]) < 0)
                    t[p[i]] = s[p[i]];
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    function __exportStar(m, exports) {
        for (var p in m)
            if (!exports.hasOwnProperty(p))
                exports[p] = m[p];
    }
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k))
                    result[k] = mod[k];
        result.default = mod;
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    var TabComponent = /** @class */ (function (_super) {
        __extends(TabComponent, _super);
        function TabComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TabComponent.prototype.ngOnInit = function () {
            var _this = this;
            // use a subscription to set this.active since that affects a number of other
            // tab internals
            this.selectionSubscription = this.controller.selection.subscribe(function (key) {
                _this.active = key === _this.key;
            });
        };
        TabComponent.prototype.ngOnDestroy = function () {
            this.selectionSubscription.unsubscribe();
        };
        return TabComponent;
    }(carbonComponentsAngular.Tab));
    TabComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-tab',
                    template: "\n    <div\n      [attr.tabindex]=\"tabIndex\"\n      role=\"tabpanel\"\n      *ngIf=\"shouldRender()\"\n      class=\"bx--tab-content\"\n      [ngStyle]=\"{\n        display: active ? null : 'none'\n      }\"\n      [attr.aria-labelledby]=\"id + '-header'\"\n      aria-live=\"polite\"\n    >\n      <ng-content></ng-content>\n    </div>\n  "
                },] }
    ];
    TabComponent.propDecorators = {
        key: [{ type: core.Input }],
        controller: [{ type: core.Input }]
    };

    var TabsComponent = /** @class */ (function () {
        function TabsComponent(elementRef) {
            this.elementRef = elementRef;
            /**
             * Template to bind to header titles (optional).
             * Tab item is passed in as context.
             *
             * For example:
             *
             * controller = new TabController([
             *  {
             *    title: 'One',
             *    icon: 'edit'
             *  }
             * ]);
             *
             * // Tab items are passed in as context in the form "{tab: tab}" so the let-<your_var_name>="tab" is necessary
             * <ng-template #titleTpl let-tab="tab">
             *  <svg *ngIf="tab.icon" [ibmIcon]="tab.icon" size="16"></svg>
             *  {{ tab.title }}
             * </ng-template>
             *
             * <ai-tabs [controller]="controller" [titleTpl]="titleTpl"></ai-tabs>
             */
            this.titleTpl = null;
        }
        TabsComponent.prototype.onSelected = function (key) {
            this.controller.selectTab(key);
        };
        TabsComponent.prototype.getMaxWidth = function () {
            var actions = this.elementRef.nativeElement.querySelector('ai-tab-actions');
            if (!actions) {
                return null;
            }
            return "calc(100% - " + getComputedStyle(actions).width + ")";
        };
        return TabsComponent;
    }());
    TabsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-tabs',
                    template: "\n    <ibm-tab-header-group\n      [ngStyle]=\"{\n        'max-width': getMaxWidth()\n      }\"\n    >\n      <ai-tab-header\n        *ngFor=\"let tab of controller.getTabs()\"\n        [active]=\"(controller.selection | async) === tab.key\"\n        [tab]=\"tab\"\n        [actions]=\"tab.actions\"\n        (selected)=\"onSelected(tab.key)\"\n      >\n        <div class=\"iot--tab__title-container\">\n          <span *ngIf=\"!titleTpl\">{{ tab.title }}</span>\n          <ng-container\n            *ngIf=\"titleTpl\"\n            [ngTemplateOutlet]=\"titleTpl\"\n            [ngTemplateOutletContext]=\"{ tab: tab }\"\n          >\n          </ng-container>\n        </div>\n      </ai-tab-header>\n    </ibm-tab-header-group>\n    <ng-content select=\"ai-tab-actions\"></ng-content>\n  ",
                    styles: ["\n      :host {\n        display: flex;\n      }\n    "]
                },] }
    ];
    TabsComponent.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };
    TabsComponent.propDecorators = {
        controller: [{ type: core.Input }],
        titleTpl: [{ type: core.Input }]
    };

    var TabDropdownComponent = /** @class */ (function () {
        function TabDropdownComponent(dropdownService, elementRef, documentService) {
            this.dropdownService = dropdownService;
            this.elementRef = elementRef;
            this.documentService = documentService;
            /**
             * Template to bind to items in the `DropdownList` (optional).
             * `DropdownList` items generated from the `Tab` items are passed in as context.
             * Additional props can included in the generation of the `DropdownList` items through
             * the `dropdownListProps` field in the `Tab`s.
             *
             * For example:
             *
             * controller = new TabController([
             *  {
             *    title: 'One',
             *    dropdownListProps: {
             *      icon: 'settings'
             *    }
             *  }
             * ]);
             *
             * // List items are passed in as context in the form "{item: item}" so the let-<your_var_name>="item" is necessary
             * <ng-template #listTpl let-item="item">
             *  <svg *ngIf="item.icon" [ibmIcon]="item.icon" size="16"></svg>
             *  {{ item.content }}
             * </ng-template>
             *
             * <ai-tabs [controller]="controller" [titleTpl]="titleTpl">
             *  <ai-tab-actions>
             *    <ai-tab-dropdown [controller]="controller" [listTpl]="listTpl"></ai-tab-dropdown>
             *  </ai-tab-actions>
             * </ai-tabs>
             */
            this.listTpl = null;
            this.isOpen = false;
        }
        TabDropdownComponent.prototype.ngOnInit = function () {
            var _this = this;
            // TODO: update dropdown service to handle menus fixed to the right side of the trigger
            this.dropdownService.offset = {
                /**
                 * 105 = 210 / 2 the dropdown service will center the menu and
                 * then align it to the left edge of the trigger element
                 */
                left: 105,
            };
            this.documentService.handleClick(function (event) {
                var hostElement = _this.elementRef.nativeElement;
                var menuElement = _this.dropdownMenu.nativeElement;
                var target = event.target;
                if (_this.isOpen && !hostElement.contains(target) && !menuElement.contains(target)) {
                    _this.closeMenu();
                }
            });
            this.displayItems = this.controller.tabListWithSelection.pipe(operators.map(function (list) {
                return list.map(function (item) { return (Object.assign({ content: item.title, key: item.key, selected: item.selected }, item.dropdownListProps)); });
            }));
        };
        TabDropdownComponent.prototype.onSelect = function (event) {
            if (!event.isUpdate) {
                this.controller.selectTab(event.item.key);
                this.closeMenu();
            }
        };
        TabDropdownComponent.prototype.toggleMenu = function () {
            if (!this.isOpen) {
                this.openMenu();
            }
            else {
                this.closeMenu();
            }
        };
        TabDropdownComponent.prototype.openMenu = function () {
            this.isOpen = true;
            var wrapper = this.dropdownService.appendToBody(this.dropdownButton.nativeElement, this.dropdownMenu.nativeElement, '');
            wrapper.style.width = '250px';
            this.dropdownList.initFocus();
        };
        TabDropdownComponent.prototype.closeMenu = function () {
            this.isOpen = false;
            this.dropdownService.appendToDropdown(this.elementRef.nativeElement);
        };
        TabDropdownComponent.prototype.ngOnDestroy = function () {
            this.closeMenu();
        };
        return TabDropdownComponent;
    }());
    TabDropdownComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-tab-dropdown',
                    template: "\n    <button aiTabAction #dropdownButton (click)=\"toggleMenu()\">\n      <svg class=\"bx--btn__icon\" ibmIcon=\"chevron--down\" size=\"16\"></svg>\n    </button>\n    <div style=\"display: none;\" class=\"dropdown-menu bx--list-box--expanded\" #dropdownMenu>\n      <ibm-dropdown-list [items]=\"displayItems\" (select)=\"onSelect($event)\" [listTpl]=\"listTpl\">\n      </ibm-dropdown-list>\n    </div>\n  ",
                    providers: [carbonComponentsAngular.DropdownService]
                },] }
    ];
    TabDropdownComponent.ctorParameters = function () { return [
        { type: carbonComponentsAngular.DropdownService },
        { type: core.ElementRef },
        { type: carbonComponentsAngular.DocumentService }
    ]; };
    TabDropdownComponent.propDecorators = {
        controller: [{ type: core.Input }],
        listTpl: [{ type: core.Input }],
        dropdownMenu: [{ type: core.ViewChild, args: ['dropdownMenu', { static: true },] }],
        dropdownButton: [{ type: core.ViewChild, args: ['dropdownButton', { static: true },] }],
        dropdownList: [{ type: core.ViewChild, args: [carbonComponentsAngular.DropdownList,] }]
    };

    var TabActionDirective = /** @class */ (function (_super) {
        __extends(TabActionDirective, _super);
        function TabActionDirective(elementRef) {
            var _this = _super.call(this) || this;
            _this.elementRef = elementRef;
            return _this;
        }
        TabActionDirective.prototype.ngOnInit = function () {
            this.ibmButton = 'ghost';
            this.size = 'sm';
            this.iconOnly = true;
            var el = this.elementRef.nativeElement;
            el.style.width = '40px';
            el.style.height = '40px';
            el.style.justifyContent = 'center';
        };
        return TabActionDirective;
    }(carbonComponentsAngular.Button));
    TabActionDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[aiTabAction]',
                },] }
    ];
    TabActionDirective.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };

    var TabActionsComponent = /** @class */ (function () {
        function TabActionsComponent() {
        }
        return TabActionsComponent;
    }());
    TabActionsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-tab-actions',
                    template: " <ng-content></ng-content> ",
                    styles: ["\n      :host {\n        display: flex;\n      }\n    "]
                },] }
    ];

    var TabHeader = /** @class */ (function (_super) {
        __extends(TabHeader, _super);
        function TabHeader(elementRef, documentService) {
            var _this = _super.call(this) || this;
            _this.elementRef = elementRef;
            _this.documentService = documentService;
            _this.actions = [];
            _this.tabAction = null;
            _this.tabActions = null;
            _this.menuOpen = false;
            _this.menuPosition = {
                top: 0,
                left: 0,
            };
            return _this;
        }
        TabHeader.prototype.ngOnChanges = function (changes) {
            var _a;
            var actions = (_a = changes.actions) === null || _a === void 0 ? void 0 : _a.currentValue;
            if (actions) {
                if (actions.length === 1) {
                    this.tabAction = Object.assign({}, {
                        title: '',
                        icon: 'close',
                        onClick: function () { },
                    }, actions[0]);
                }
                else if (actions.length > 1) {
                    this.tabActions = actions.map(function (action) { return Object.assign({}, {
                        title: '',
                        icon: '',
                        onClick: function () { },
                    }, action); });
                }
            }
        };
        TabHeader.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.documentService.handleClick(function (event) {
                var nativeElement = _this.elementRef.nativeElement;
                if (_this.menuOpen && !nativeElement.contains(event.target)) {
                    _this.menuOpen = false;
                }
            });
        };
        TabHeader.prototype.onActionClick = function (action) {
            action.onClick(this.tab);
            this.menuOpen = false;
        };
        TabHeader.prototype.onTabMenuClick = function (event) {
            var target = event.target;
            var button = target.closest('button');
            var buttonRect = button.getBoundingClientRect();
            var menuRect = button.parentElement
                .querySelector('.bx--context-menu')
                .getBoundingClientRect();
            this.menuOpen = !this.menuOpen;
            this.menuPosition = {
                top: buttonRect.top + buttonRect.height,
                left: buttonRect.right - menuRect.width,
            };
        };
        return TabHeader;
    }(tabs.TabHeader));
    TabHeader.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-tab-header',
                    template: "\n    <li\n      [ngClass]=\"{\n        'bx--tabs__nav-item--selected bx--tabs--scrollable__nav-item--selected': active,\n        'bx--tabs__nav-item--disabled bx--tabs--scrollable__nav-item--disabled': disabled\n      }\"\n      class=\"bx--tabs--scrollable__nav-item\"\n      role=\"presentation\"\n      (click)=\"selectTab()\"\n    >\n      <div\n        class=\"bx--tabs--scrollable__nav-link\"\n        #tabItem\n        [attr.aria-selected]=\"active\"\n        draggable=\"false\"\n        [title]=\"title\"\n        [attr.tabindex]=\"active ? 0 : -1\"\n        role=\"tab\"\n      >\n        <div class=\"ai--tabs--header_content\">\n          <ng-content></ng-content>\n        </div>\n        <ng-container *ngIf=\"tabAction\">\n          <button\n            ibmButton=\"ghost\"\n            class=\"ai--tabs--header_action\"\n            [title]=\"tabAction.title\"\n            (click)=\"onActionClick(tabAction)\"\n          >\n            <svg [ibmIcon]=\"tabAction.icon\" size=\"16\"></svg>\n          </button>\n        </ng-container>\n        <ng-container *ngIf=\"tabActions\">\n          <button\n            ibmButton=\"ghost\"\n            class=\"ai--tabs--header_action\"\n            (click)=\"onTabMenuClick($event)\"\n          >\n            <svg ibmIcon=\"overflow-menu--vertical\" size=\"16\"></svg>\n          </button>\n          <ibm-context-menu [open]=\"menuOpen\" [position]=\"menuPosition\">\n            <ibm-context-menu-item\n              *ngFor=\"let action of tabActions\"\n              [label]=\"action.title\"\n              [icon]=\"action.icon\"\n              (click)=\"onActionClick(action)\"\n              (keydown.enter)=\"onActionClick(action)\"\n              (keydown.space)=\"onActionClick(action)\"\n            >\n            </ibm-context-menu-item>\n          </ibm-context-menu>\n        </ng-container>\n      </div>\n    </li>\n  ",
                    providers: [
                        {
                            provide: tabs.TabHeader,
                            useExisting: TabHeader,
                        },
                    ],
                    styles: ["\n      .bx--tabs--scrollable__nav-link {\n        display: flex;\n        align-items: end;\n      }\n\n      ::ng-deep .bx--tabs--scrollable .bx--tabs--scrollable__nav-link {\n        padding: 0;\n      }\n\n      .ai--tabs--header_content {\n        width: 100%;\n        padding: 0.75rem 1rem 0.5rem;\n      }\n\n      .ai--tabs--header_action {\n        padding: 0;\n        min-height: 0;\n        height: 1.5rem;\n        width: 1.5rem;\n        align-content: center;\n        justify-content: center;\n        margin-bottom: 0.3rem;\n        margin-right: 0.5rem;\n      }\n    "]
                },] }
    ];
    TabHeader.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: carbonComponentsAngular.DocumentService }
    ]; };
    TabHeader.propDecorators = {
        tab: [{ type: core.Input }],
        actions: [{ type: core.Input }]
    };

    var TabsModule = /** @class */ (function () {
        function TabsModule() {
        }
        return TabsModule;
    }());
    TabsModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [
                        TabsComponent,
                        TabComponent,
                        TabDropdownComponent,
                        TabActionsComponent,
                        TabActionDirective,
                        TabHeader,
                    ],
                    imports: [
                        common.CommonModule,
                        carbonComponentsAngular.TabsModule,
                        carbonComponentsAngular.IconModule,
                        carbonComponentsAngular.DropdownModule,
                        carbonComponentsAngular.ButtonModule,
                        carbonComponentsAngular.UtilsModule,
                        contextMenu.ContextMenuModule,
                    ],
                    exports: [
                        TabsComponent,
                        TabComponent,
                        TabDropdownComponent,
                        TabActionsComponent,
                        TabActionDirective,
                        TabHeader,
                    ],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.TabActionDirective = TabActionDirective;
    exports.TabActionsComponent = TabActionsComponent;
    exports.TabComponent = TabComponent;
    exports.TabDropdownComponent = TabDropdownComponent;
    exports.TabHeader = TabHeader;
    exports.TabsComponent = TabsComponent;
    exports.TabsModule = TabsModule;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular-tabs.umd.js.map
