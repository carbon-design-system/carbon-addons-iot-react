/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-toolkit.umd.js
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
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('carbon-components-angular'), require('@angular/common'), require('rxjs'), require('@angular/platform-browser/animations')) :
    typeof define === 'function' && define.amd ? define('@ai-apps/angular/toolkit', ['exports', '@angular/core', 'carbon-components-angular', '@angular/common', 'rxjs', '@angular/platform-browser/animations'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = global["ai-apps"].angular || {}, global["ai-apps"].angular.toolkit = {}), global.ng.core, global.carbonComponentsAngular, global.ng.common, global.rxjs, global.ng.platformBrowser.animations));
})(this, (function (exports, core, carbonComponentsAngular, common, rxjs, animations) { 'use strict';

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

    /**
     * Adds an item to the end of a `BreadcrumbItem` list to serve as a title for the page header component
     *
     * @param items a list of `BreadcumbItem`s _without_ an item to serve as a title
     * @param title the title to add to the list of items
     */
    var itemsWithTitle = function (items, title) {
        return __spread(items, [
            {
                content: title,
                href: '',
            },
        ]);
    };
    /**
     * Page header
     *
     * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-page-header component
     *
     * The page header component uses the _last_ item in the `items` array as the title.
     *
     * For conveninence we provide a `itemsWithTitle` function that will take an existing
     * set of breadcrumb items and add one to the end to act as a title.
     *
     * Example:
     *
     * component.ts
     * ```typescript
     * items = itemsWithTitle([
     * 	{
     * 		content: "one",
     * 		href: "first link"
     * 	},
     * 	{
     * 		content: "two",
     * 		href: "second link"
     * 	}
     * ], "Hello World");
     * ```
     *
     * component.html
     * ```html
     * <sc-page-header [items]="currentPath"></sc-page-header>
     * ```
     */
    var PageHeaderComponent = /** @class */ (function () {
        function PageHeaderComponent() {
            /**
             * Items to display in the header. The last item is used as the title
             */
            this.items = [];
            /**
             * Emits the navigation status promise when the link is activated
             *
             * (event forwarded from the underlying `ibm-breadcrumb`)
             */
            this.navigation = new core.EventEmitter();
            /**
             * The page header sits on the grid by default.
             * Set to `false` if you need to manually position the page header using the default padding values
             */
            this.onGrid = true;
        }
        Object.defineProperty(PageHeaderComponent.prototype, "title", {
            get: function () {
                return this.items[this.items.length - 1].content;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PageHeaderComponent.prototype, "breadcrumbItems", {
            get: function () {
                return this.items.slice(0, this.items.length - 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PageHeaderComponent.prototype, "hasBreadcrumbs", {
            get: function () {
                return this.items.length > 1;
            },
            enumerable: false,
            configurable: true
        });
        return PageHeaderComponent;
    }());
    PageHeaderComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'sc-page-header',
                    template: "\n    <div [ngClass]=\"{ 'bx--col': onGrid }\">\n      <ibm-breadcrumb\n        class=\"breadcrumbs\"\n        [ariaLabel]=\"ariaLabel\"\n        [items]=\"breadcrumbItems\"\n        (navigation)=\"navigation.emit($event)\"\n      >\n      </ibm-breadcrumb>\n      <h2>{{ title }}</h2>\n    </div>\n  ",
                    styles: [":host{background:#f4f4f4;display:block;max-height:6.25rem;padding:2rem}:host.has-breadcrumbs{padding-top:1rem}h2{font-size:1.75rem;line-height:2.25rem}:host.bx--row{padding-left:0;padding-right:0}:host{max-height:unset}"]
                },] }
    ];
    PageHeaderComponent.propDecorators = {
        items: [{ type: core.Input }],
        ariaLabel: [{ type: core.Input }],
        navigation: [{ type: core.Output }],
        onGrid: [{ type: core.HostBinding, args: ['class.bx--row',] }, { type: core.Input }],
        hasBreadcrumbs: [{ type: core.HostBinding, args: ['class.has-breadcrumbs',] }]
    };

    var PageHeaderModule = /** @class */ (function () {
        function PageHeaderModule() {
        }
        return PageHeaderModule;
    }());
    PageHeaderModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [PageHeaderComponent],
                    imports: [common.CommonModule, carbonComponentsAngular.BreadcrumbModule],
                    exports: [PageHeaderComponent],
                },] }
    ];

    var SCTableHeadCell = /** @class */ (function (_super) {
        __extends(SCTableHeadCell, _super);
        function SCTableHeadCell() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SCTableHeadCell;
    }(carbonComponentsAngular.TableHeadCell));
    SCTableHeadCell.decorators = [
        { type: core.Component, args: [{
                    // tslint:disable-next-line: component-selector
                    selector: '[scTableHeadCell]',
                    template: "\n    <ng-container *ngIf=\"!skeleton\">\n      <button\n        class=\"bx--table-sort\"\n        *ngIf=\"this.sort.observers.length > 0 && column.sortable\"\n        [attr.aria-label]=\"\n          (column.sorted && column.ascending ? getSortDescendingLabel() : getSortAscendingLabel())\n            | async\n        \"\n        aria-live=\"polite\"\n        [ngClass]=\"{\n          'bx--table-sort--active': column.sorted,\n          'bx--table-sort--ascending': column.ascending\n        }\"\n        (click)=\"onClick()\"\n      >\n        <span\n          *ngIf=\"!column.template\"\n          class=\"table-head-cell-text\"\n          [title]=\"column.data\"\n          tabindex=\"-1\"\n        >\n          {{ column.data }}\n        </span>\n        <ng-template\n          [ngTemplateOutlet]=\"column.template\"\n          [ngTemplateOutletContext]=\"{ data: column.data }\"\n        >\n        </ng-template>\n        <span class=\"table-head-cell-icons\">\n          <svg\n            focusable=\"false\"\n            preserveAspectRatio=\"xMidYMid meet\"\n            style=\"will-change: transform;\"\n            xmlns=\"http://www.w3.org/2000/svg\"\n            class=\"bx--table-sort__icon\"\n            width=\"16\"\n            height=\"16\"\n            viewBox=\"0 0 16 16\"\n            aria-hidden=\"true\"\n          >\n            <path d=\"M12.3 9.3l-3.8 3.8V1h-1v12.1L3.7 9.3 3 10l5 5 5-5z\"></path>\n          </svg>\n          <svg\n            focusable=\"false\"\n            preserveAspectRatio=\"xMidYMid meet\"\n            style=\"will-change: transform;\"\n            xmlns=\"http://www.w3.org/2000/svg\"\n            class=\"bx--table-sort__icon-unsorted\"\n            width=\"16\"\n            height=\"16\"\n            viewBox=\"0 0 16 16\"\n            aria-hidden=\"true\"\n          >\n            <path\n              d=\"M13.8 10.3L12 12.1V2h-1v10.1l-1.8-1.8-.7.7 3 3 3-3zM4.5 2l-3 3 .7.7L4 3.9V14h1V3.9l1.8 1.8.7-.7z\"\n            ></path>\n          </svg>\n        </span>\n      </button>\n      <span\n        class=\"bx--table-header-label\"\n        *ngIf=\"\n          this.sort.observers.length === 0 || (this.sort.observers.length > 0 && !column.sortable)\n        \"\n      >\n        <span *ngIf=\"!column.template\" [title]=\"column.data\">{{ column.data }}</span>\n        <ng-template\n          [ngTemplateOutlet]=\"column.template\"\n          [ngTemplateOutletContext]=\"{ data: column.data }\"\n        >\n        </ng-template>\n      </span>\n      <button\n        [ngClass]=\"{ active: column.filterCount > 0 }\"\n        *ngIf=\"column.filterTemplate\"\n        type=\"button\"\n        aria-expanded=\"false\"\n        aria-haspopup=\"true\"\n        [ibmTooltip]=\"column.filterTemplate\"\n        trigger=\"click\"\n        [title]=\"getFilterTitle() | async\"\n        placement=\"bottom,top\"\n        [data]=\"column.filterData\"\n      >\n        <svg\n          xmlns=\"http://www.w3.org/2000/svg\"\n          class=\"icon--sm\"\n          width=\"16\"\n          height=\"16\"\n          viewBox=\"0 0 16 16\"\n        >\n          <path d=\"M0 0v3l6 8v5h4v-5l6-8V0H0zm9 10.7V15H7v-4.3L1.3 3h13.5L9 10.7z\" />\n        </svg>\n        <span *ngIf=\"column.filterCount > 0\">\n          {{ column.filterCount }}\n        </span>\n      </button>\n    </ng-container>\n    <ng-container *ngIf=\"skeleton\">\n      <button class=\"bx--table-sort\">\n        <span class=\"table-head-cell-text\" tabindex=\"-1\"></span>\n      </button>\n    </ng-container>\n  ",
                    encapsulation: core.ViewEncapsulation.None,
                    styles: [".table-head-cell-icons,.table-head-cell-text{top:0}.bx--data-table--compact .table-head-cell-icons,.bx--data-table--compact .table-head-cell-text{line-height:24px}.bx--data-table--short .table-head-cell-icons,.bx--data-table--short .table-head-cell-text{line-height:32px}.bx--data-table--tall .table-head-cell-icons,.bx--data-table--tall .table-head-cell-text{line-height:64px}.table-head-cell-icons{margin-right:10px;right:0}.bx--table-sort.bx--table-sort--active .bx--table-sort__icon{top:16px}.sc-table .bx--table-header-label,.sc-table .table-head-cell-text{padding-left:16px}"]
                },] }
    ];

    /**
     * A subcomponent that creates the thead of the table
     *
     * Example
     *
     * ```html
     * 	<thead scTableHead [model]="model"></thead>
     * ```
     */
    var SCTableHeadComponent = /** @class */ (function (_super) {
        __extends(SCTableHeadComponent, _super);
        function SCTableHeadComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SCTableHeadComponent;
    }(carbonComponentsAngular.TableHead));
    SCTableHeadComponent.decorators = [
        { type: core.Component, args: [{
                    // tslint:disable-next-line:component-selector
                    selector: '[scTableHead]',
                    template: "\n    <ng-container *ngIf=\"model\">\n      <tr *ngFor=\"let headerRow of model.header; let rowIndex = index\" class=\"table-row\">\n        <th ibmTableHeadExpand *ngIf=\"model.hasExpandableRows()\" [id]=\"model.getId('expand')\"></th>\n        <th\n          ibmTableHeadCheckbox\n          *ngIf=\"!skeleton && showSelectionColumn && rowIndex === 0\"\n          class=\"table-selection-column\"\n          [checked]=\"selectAllCheckbox\"\n          [indeterminate]=\"selectAllCheckboxSomeSelected\"\n          [ariaLabel]=\"getCheckboxHeaderLabel()\"\n          [size]=\"size\"\n          [skeleton]=\"skeleton\"\n          [attr.rowspan]=\"model.header.length\"\n          [id]=\"model.getId('select')\"\n          (change)=\"onSelectAllCheckboxChange()\"\n        ></th>\n\n        <ng-container *ngFor=\"let column of headerRow; let i = index\">\n          <th\n            scTableHeadCell\n            *ngIf=\"column && column.visible\"\n            [id]=\"model.getId(i, rowIndex)\"\n            [headers]=\"rowIndex > 0 ? model.getHeaderId(i, column.colSpan) : ''\"\n            [column]=\"column\"\n            [attr.colspan]=\"column.colSpan\"\n            [attr.rowspan]=\"column.rowSpan\"\n            [filterTitle]=\"getFilterTitle()\"\n            (sort)=\"sort.emit(i)\"\n            [class]=\"column.className\"\n            [skeleton]=\"skeleton\"\n            [ngStyle]=\"column.style\"\n          ></th>\n        </ng-container>\n        <th\n          *ngIf=\"!skeleton && stickyHeader\"\n          [ngStyle]=\"{ width: scrollbarWidth + 'px', padding: 0, border: 0 }\"\n        >\n          <!--\n\t\t\t\t\tScrollbar pushes body to the left so this header column is added to push\n\t\t\t\t\tthe title bar the same amount and keep the header and body columns aligned.\n\t\t\t\t--></th>\n      </tr>\n    </ng-container>\n    <ng-content></ng-content>\n  ",
                    encapsulation: core.ViewEncapsulation.None,
                    styles: [".table-row:not(:first-of-type){border-top:2px solid #fff}th:not(:last-of-type){border-right:2px solid #fff}th:not(:last-of-type).table-selection-column{border-right:none}.sc-table.bx--data-table--sort th:first-of-type .bx--table-sort,.sc-table .bx--table-sort{padding-left:0}.sc-table.bx--data-table th:last-of-type{position:inherit}"]
                },] }
    ];
    SCTableHeadComponent.propDecorators = {
        model: [{ type: core.Input }]
    };

    /**
     * Sterling specific table component
     *
     * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-table component
     *
     * Example:
     * ```
     * <sc-table></sc-table>
     * ```
     */
    var SCTableComponent = /** @class */ (function (_super) {
        __extends(SCTableComponent, _super);
        function SCTableComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SCTableComponent;
    }(carbonComponentsAngular.Table));
    SCTableComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'sc-table',
                    template: "\n    <table\n      ibmTable\n      [sortable]=\"true\"\n      [size]=\"size\"\n      [striped]=\"striped\"\n      [skeleton]=\"skeleton\"\n      [ngClass]=\"{ 'bx--data-table--sticky-header': stickyHeader }\"\n      class=\"sc-table\"\n    >\n      <thead\n        scTableHead\n        (deselectAll)=\"onDeselectAll()\"\n        (selectAll)=\"onSelectAll()\"\n        (sort)=\"sort.emit($event)\"\n        [checkboxHeaderLabel]=\"getCheckboxHeaderLabel()\"\n        [filterTitle]=\"getFilterTitle()\"\n        [model]=\"model\"\n        [size]=\"size\"\n        [selectAllCheckbox]=\"selectAllCheckbox\"\n        [selectAllCheckboxSomeSelected]=\"selectAllCheckboxSomeSelected\"\n        [showSelectionColumn]=\"showSelectionColumn\"\n        [skeleton]=\"skeleton\"\n        [sortAscendingLabel]=\"sortAscendingLabel\"\n        [sortDescendingLabel]=\"sortDescendingLabel\"\n        [stickyHeader]=\"stickyHeader\"\n      ></thead>\n      <tbody\n        ibmTableBody\n        (deselectRow)=\"onSelectRow($event)\"\n        (rowClick)=\"onRowClick($event)\"\n        (scroll)=\"onScroll($event)\"\n        (selectRow)=\"onSelectRow($event)\"\n        [checkboxRowLabel]=\"getCheckboxRowLabel()\"\n        [enableSingleSelect]=\"enableSingleSelect\"\n        [expandButtonAriaLabel]=\"expandButtonAriaLabel\"\n        [model]=\"model\"\n        [size]=\"size\"\n        [ngStyle]=\"{ 'overflow-y': 'scroll' }\"\n        [selectionLabelColumn]=\"selectionLabelColumn\"\n        [showSelectionColumn]=\"showSelectionColumn\"\n        [skeleton]=\"skeleton\"\n        *ngIf=\"!noData; else noDataTemplate\"\n      ></tbody>\n      <ng-template #noDataTemplate><ng-content></ng-content></ng-template>\n      <tfoot>\n        <ng-template [ngTemplateOutlet]=\"footerTemplate\"> </ng-template>\n        <tr *ngIf=\"this.model.isLoading\">\n          <td class=\"table_loading-indicator\">\n            <div class=\"bx--loading bx--loading--small\">\n              <svg class=\"bx--loading__svg\" viewBox=\"-75 -75 150 150\">\n                <circle class=\"bx--loading__stroke\" cx=\"0\" cy=\"0\" r=\"37.5\" />\n              </svg>\n            </div>\n          </td>\n        </tr>\n        <tr *ngIf=\"this.model.isEnd\">\n          <td class=\"table_end-indicator\">\n            <h5>{{ getEndOfDataText() | async }}</h5>\n            <button (click)=\"scrollToTop($event)\" class=\"btn--secondary-sm\">\n              {{ getScrollTopText() | async }}\n            </button>\n          </td>\n        </tr>\n      </tfoot>\n    </table>\n  ",
                    encapsulation: core.ViewEncapsulation.None,
                    styles: [".table-head-cell-icons,.table-head-cell-text{top:0}.bx--data-table--compact .table-head-cell-icons,.bx--data-table--compact .table-head-cell-text{line-height:24px}.bx--data-table--short .table-head-cell-icons,.bx--data-table--short .table-head-cell-text{line-height:32px}.bx--data-table--tall .table-head-cell-icons,.bx--data-table--tall .table-head-cell-text{line-height:64px}.table-head-cell-icons{margin-right:10px;right:0}.bx--table-sort.bx--table-sort--active .bx--table-sort__icon{top:16px}.sc-table .bx--table-header-label,.sc-table .table-head-cell-text{padding-left:16px}.table-row:not(:first-of-type){border-top:2px solid #fff}th:not(:last-of-type){border-right:2px solid #fff}th:not(:last-of-type).table-selection-column{border-right:none}.sc-table.bx--data-table--sort th:first-of-type .bx--table-sort,.sc-table .bx--table-sort{padding-left:0}.sc-table.bx--data-table th:last-of-type{position:inherit}"]
                },] }
    ];

    var SCTableModule = /** @class */ (function () {
        function SCTableModule() {
        }
        return SCTableModule;
    }());
    SCTableModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [SCTableComponent, SCTableHeadComponent, SCTableHeadCell],
                    imports: [carbonComponentsAngular.DialogModule, carbonComponentsAngular.ButtonModule, common.CommonModule, carbonComponentsAngular.TableModule],
                    exports: [SCTableComponent, SCTableHeadComponent, SCTableHeadCell],
                },] }
    ];

    var SCTableModel = /** @class */ (function () {
        function SCTableModel() {
            this.headerChange = new rxjs.Subject();
            this.dataChange = new core.EventEmitter();
            this.rowsSelectedChange = new core.EventEmitter();
            this.rowsExpandedChange = new core.EventEmitter();
            /**
             * Gets emitted when `selectAll` is called. Emits false if all rows are deselected and true if
             * all rows are selected.
             */
            this.selectAllChange = new rxjs.Subject();
            /**
             * Contains information about selection state of rows in the table.
             */
            this.rowsSelected = [];
            /**
             * Contains information about expanded state of rows in the table.
             */
            this.rowsExpanded = [];
            /**
             * Contains information about the context of the row.
             *
             * It affects styling of the row to reflect the context.
             *
             * string can be one of `"success" | "warning" | "info" | "error" | ""` and it's
             * empty or undefined by default
             */
            this.rowsContext = [];
            /**
             * Contains class name(s) of the row.
             *
             * It affects styling of the row to reflect the appended class name(s).
             *
             * It's empty or undefined by default
             */
            this.rowsClass = [];
            /**
             * Tracks the current page.
             */
            this.currentPage = 1;
            /**
             * Length of page.
             */
            this.pageLength = 10;
            /**
             * Set to true when there is no more data to load in the table
             */
            this.isEnd = false;
            /**
             * Set to true when lazy loading to show loading indicator
             */
            this.isLoading = false;
            /**
             * Used in `data`
             */
            this._data = [[]];
            this._header = [[]];
            /**
             * The number of models instantiated, this is to make sure each table has a different
             * model count for unique id generation.
             */
            this.tableModelCount = 0;
            this.tableModelCount = SCTableModel.COUNT++;
        }
        Object.defineProperty(SCTableModel.prototype, "header", {
            get: function () {
                return this._header;
            },
            /**
             * Contains information about the header cells of the table.
             */
            set: function (newHeader) {
                if (!newHeader || (Array.isArray(newHeader) && newHeader.length === 0)) {
                    newHeader = [[]];
                }
                this._header = newHeader;
                if (this.headerChange) {
                    this.headerChange.next();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SCTableModel.prototype, "data", {
            /**
             * Gets the full data.
             *
             * You can use it to alter individual `TableItem`s but if you need to change
             * table structure, use `addRow()` and/or `addColumn()`
             */
            get: function () {
                return this._data;
            },
            /**
             * Sets data of the table.
             *
             * Make sure all rows are the same length to keep the column count accurate.
             */
            set: function (newData) {
                if (!newData || (Array.isArray(newData) && newData.length === 0)) {
                    newData = [[]];
                }
                this._data = newData;
                // init rowsSelected
                this.rowsSelected = new Array(this._data.length).fill(false);
                this.rowsExpanded = new Array(this._data.length).fill(false);
                // init rowsContext
                this.rowsContext = new Array(this._data.length);
                // init rowsClass
                this.rowsClass = new Array(this._data.length);
                // only create a fresh header if necessary (header doesn't exist or differs in length)
                // this will only create a single level of headers (it will destroy any existing header items)
                if (this.header == null ||
                    (this.header[0].length !== this._data[0].length && this._data[0].length > 0)) {
                    var newHeader = [[]];
                    // disable this tslint here since we don't actually want to
                    // loop the contents of the data
                    // tslint:disable-next-line: prefer-for-of
                    for (var i = 0; i < this._data[0].length; i++) {
                        newHeader[0].push(new carbonComponentsAngular.TableHeaderItem());
                    }
                    this.header = newHeader;
                }
                this.dataChange.emit();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SCTableModel.prototype, "totalDataLength", {
            /**
             * Total length of data that table has access to, or the amount manually set
             */
            get: function () {
                // if manually set data length
                if (this._totalDataLength !== null && this._totalDataLength >= 0) {
                    return this._totalDataLength;
                }
                // if empty dataset
                if (this.data && this.data.length === 1 && this.data[0].length === 0) {
                    return 0;
                }
                return this.data.length;
            },
            /**
             * Manually set data length in case the data in the table doesn't
             * correctly reflect all the data that table is to display.
             *
             * Example: if you have multiple pages of data that table will display
             * but you're loading one at a time.
             *
             * Set to `null` to reset to default behavior.
             */
            set: function (length) {
                // if this function is called without a parameter we need to set to null to avoid having undefined != null
                this._totalDataLength = length || null;
            },
            enumerable: false,
            configurable: true
        });
        SCTableModel.prototype.isRowFiltered = function (index) {
            var _this = this;
            var realIndex = this.realRowIndex(index);
            return this.header.some(function (headerRow) { return headerRow.some(function (item, i) { return item && item.filter(_this.row(realIndex)[i]); }); });
        };
        /**
         * Returns an id for the given column
         *
         * @param column the column to generate an id for
         * @param row the row of the header to generate an id for
         */
        SCTableModel.prototype.getId = function (column, row) {
            if (row === void 0) { row = 0; }
            return "table-header-" + row + "-" + column + "-" + this.tableModelCount;
        };
        SCTableModel.prototype.getHeaderId = function (column, colSpan) {
            if (colSpan === void 0) { colSpan = 1; }
            if (column === 'select' || column === 'expand') {
                return this.getId(column);
            }
            var ids = [];
            for (var i = this.header.length - 1; i >= 0; i--) {
                for (var j = column; j >= 0; j--) {
                    if (this.header[i][j]) {
                        for (var k = 0; k < colSpan; k++) {
                            ids.push(this.getId(j + k, i));
                        }
                        break;
                    }
                }
            }
            return ids.join(' ');
        };
        /**
         * Finds closest header by trying the lowest cell in header and then work its way to the left
         * @param column
         */
        SCTableModel.prototype.getHeader = function (column) {
            if (!this.header) {
                return null;
            }
            for (var i = this.header.length - 1; i >= 0; i--) {
                var headerCell = this.header[i][column];
                if (headerCell) {
                    return headerCell;
                }
            }
            for (var i = column; i >= 0; i--) {
                var headerCell = this.header[0][i];
                if (headerCell) {
                    return headerCell;
                }
            }
            return null;
        };
        /**
         * Returns how many rows is currently selected
         */
        SCTableModel.prototype.selectedRowsCount = function () {
            var count = 0;
            if (this.rowsSelected) {
                this.rowsSelected.forEach(function (rowSelected) {
                    if (rowSelected) {
                        count++;
                    }
                });
            }
            return count;
        };
        /**
         * Returns how many rows is currently expanded
         */
        SCTableModel.prototype.expandedRowsCount = function () {
            var count = 0;
            if (this.rowsExpanded) {
                this.rowsExpanded.forEach(function (rowExpanded) {
                    if (rowExpanded) {
                        count++;
                    }
                });
            }
            return count;
        };
        /**
         * Returns `index`th row of the table.
         *
         * Negative index starts from the end. -1 being the last element.
         *
         * @param index
         */
        SCTableModel.prototype.row = function (index) {
            return this.data[this.realRowIndex(index)];
        };
        /**
         * Adds a row to the `index`th row or appends to table if index not provided.
         *
         * If row is shorter than other rows or not provided, it will be padded with
         * empty `TableItem` elements.
         *
         * If row is longer than other rows, others will be extended to match so no data is lost.
         *
         * If called on an empty table with no parameters, it creates a 1x1 table.
         *
         * Negative index starts from the end. -1 being the last element.
         *
         * @param [row]
         * @param [index]
         */
        SCTableModel.prototype.addRow = function (row, index) {
            // if table empty create table with row
            if (!this.data || this.data.length === 0 || this.data[0].length === 0) {
                var newData = new Array();
                newData.push(row ? row : [new carbonComponentsAngular.TableItem()]); // row or one empty one column row
                this.data = newData;
                return;
            }
            var realRow = row;
            var columnCount = this.data[0].length;
            if (row == null) {
                realRow = new Array();
                for (var i = 0; i < columnCount; i++) {
                    realRow.push(new carbonComponentsAngular.TableItem());
                }
            }
            if (realRow.length < columnCount) {
                // extend the length of realRow
                var difference = columnCount - realRow.length;
                for (var i = 0; i < difference; i++) {
                    realRow.push(new carbonComponentsAngular.TableItem());
                }
            }
            else if (realRow.length > columnCount) {
                // extend the length of header
                var difference = realRow.length - this.header.length;
                for (var j = 0; j < difference; j++) {
                    this.header.push(new carbonComponentsAngular.TableHeaderItem());
                }
                // extend the length of every other row
                for (var i = 0; i < this.data.length; i++) {
                    var currentRow = this.data[i];
                    difference = realRow.length - currentRow.length;
                    for (var j = 0; j < difference; j++) {
                        currentRow.push(new carbonComponentsAngular.TableItem());
                    }
                }
            }
            if (index == null) {
                this.data.push(realRow);
                // update rowsSelected property for length
                this.rowsSelected.push(false);
                // update rowsExpanded property for length
                this.rowsExpanded.push(false);
                // update rowsContext property for length
                this.rowsContext.push(undefined);
                // update rowsClass property for length
                this.rowsClass.push(undefined);
            }
            else {
                var ri = this.realRowIndex(index);
                this.data.splice(ri, 0, realRow);
                // update rowsSelected property for length
                this.rowsSelected.splice(ri, 0, false);
                // update rowsExpanded property for length
                this.rowsExpanded.splice(ri, 0, false);
                // update rowsContext property for length
                this.rowsContext.splice(ri, 0, undefined);
                // update rowsClass property for length
                this.rowsClass.splice(ri, 0, undefined);
            }
            this.dataChange.emit();
        };
        /**
         * Deletes `index`th row.
         *
         * Negative index starts from the end. -1 being the last element.
         *
         * @param index
         */
        SCTableModel.prototype.deleteRow = function (index) {
            var rri = this.realRowIndex(index);
            this.data.splice(rri, 1);
            this.rowsSelected.splice(rri, 1);
            this.rowsExpanded.splice(rri, 1);
            this.rowsContext.splice(rri, 1);
            this.rowsClass.splice(rri, 1);
            this.dataChange.emit();
        };
        SCTableModel.prototype.hasExpandableRows = function () {
            return this.data.some(function (data) { return data.some(function (d) { return d && d.expandedData; }); }); // checking for some in 2D array
        };
        SCTableModel.prototype.isRowExpandable = function (index) {
            return this.data[index].some(function (d) { return d && d.expandedData; });
        };
        SCTableModel.prototype.isRowExpanded = function (index) {
            return this.rowsExpanded[index];
        };
        SCTableModel.prototype.getRowContext = function (index) {
            return this.rowsContext[index];
        };
        /**
         * Returns `index`th column of the table.
         *
         * Negative index starts from the end. -1 being the last element.
         *
         * @param index
         */
        SCTableModel.prototype.column = function (index) {
            var column = new Array();
            var ri = this.realColumnIndex(index);
            var rc = this.data.length;
            for (var i = 0; i < rc; i++) {
                var row = this.data[i];
                column.push(row[ri]);
            }
            return column;
        };
        /**
         * Adds a column to the `index`th column or appends to table if index not provided.
         *
         * If column is shorter than other columns or not provided, it will be padded with
         * empty `TableItem` elements.
         *
         * If column is longer than other columns, others will be extended to match so no data is lost.
         *
         * If called on an empty table with no parameters, it creates a 1x1 table.
         *
         * Negative index starts from the end. -1 being the last element.
         *
         * @param [column]
         * @param [index]
         */
        SCTableModel.prototype.addColumn = function (column, index) {
            // if table empty create table with row
            if (!this.data || this.data.length === 0 || this.data[0].length === 0) {
                var newData = new Array();
                if (column == null) {
                    newData.push([new carbonComponentsAngular.TableItem()]);
                }
                else {
                    for (var i = 0; i < column.length; i++) {
                        var item = column[i];
                        newData.push([item]);
                    }
                }
                this.data = newData;
                return;
            }
            var rc = this.data.length; // row count
            var ci = this.realColumnIndex(index);
            // append missing rows
            for (var i = 0; column != null && i < column.length - rc; i++) {
                this.addRow();
            }
            rc = this.data.length;
            if (index == null) {
                // append to end
                for (var i = 0; i < rc; i++) {
                    var row = this.data[i];
                    row.push(column == null || column[i] == null ? new carbonComponentsAngular.TableItem() : column[i]);
                }
                // update header if not already set by user
                if (this.header.length < this.data[0].length) {
                    this.header.push(new carbonComponentsAngular.TableHeaderItem());
                }
            }
            else {
                if (index >= this.data[0].length) {
                    // if trying to append
                    ci++;
                }
                // insert
                for (var i = 0; i < rc; i++) {
                    var row = this.data[i];
                    row.splice(ci, 0, column == null || column[i] == null ? new carbonComponentsAngular.TableItem() : column[i]);
                }
                // update header if not already set by user
                if (this.header.length < this.data[0].length) {
                    this.header.splice(ci, 0, new carbonComponentsAngular.TableHeaderItem());
                }
            }
            this.dataChange.emit();
        };
        /**
         * Deletes `index`th column.
         *
         * Negative index starts from the end. -1 being the last element.
         *
         * @param index
         */
        SCTableModel.prototype.deleteColumn = function (index) {
            var rci = this.realColumnIndex(index);
            var rowCount = this.data.length;
            for (var i = 0; i < rowCount; i++) {
                this.data[i].splice(rci, 1);
            }
            // update header if not already set by user
            if (this.header.length > this.data[0].length) {
                this.header.splice(rci, 1);
            }
            this.dataChange.emit();
        };
        SCTableModel.prototype.moveColumn = function (indexFrom, indexTo) {
            var headerFrom = this.header[indexFrom];
            this.addColumn(this.column(indexFrom), indexTo);
            this.deleteColumn(indexFrom + (indexTo < indexFrom ? 1 : 0));
            this.header[indexTo + (indexTo > indexFrom ? -1 : 0)] = headerFrom;
        };
        /**
         * Sorts the data currently present in the model based on `compare()`
         *
         * Direction is set by `ascending` and `descending` properties of `TableHeaderItem`
         * in `index`th column.
         *
         * @param index The column based on which it's sorting
         */
        SCTableModel.prototype.sort = function (index) {
            var headerToSort = this.getHeader(index);
            this.pushRowStateToModelData();
            this.data.sort(function (a, b) { return (headerToSort.descending ? -1 : 1) * headerToSort.compare(a[index], b[index]); });
            this.popRowStateFromModelData();
            this.header.forEach(function (headerRow) {
                headerRow.forEach(function (column) {
                    if (column) {
                        column.sorted = false;
                    }
                });
            });
            headerToSort.sorted = true;
        };
        /**
         * Appends `rowsSelected` and `rowsExpanded` info to model data.
         *
         * When sorting rows, do this first so information about row selection
         * gets sorted with the other row info.
         *
         * Call `popRowSelectionFromModelData()` after sorting to make everything
         * right with the world again.
         */
        SCTableModel.prototype.pushRowStateToModelData = function () {
            for (var i = 0; i < this.data.length; i++) {
                var rowSelectedMark = new carbonComponentsAngular.TableItem();
                rowSelectedMark.data = this.rowsSelected[i];
                this.data[i].push(rowSelectedMark);
                var rowExpandedMark = new carbonComponentsAngular.TableItem();
                rowExpandedMark.data = this.rowsExpanded[i];
                this.data[i].push(rowExpandedMark);
                var rowContext = new carbonComponentsAngular.TableItem();
                rowContext.data = this.rowsContext[i];
                this.data[i].push(rowContext);
                var rowClass = new carbonComponentsAngular.TableItem();
                rowClass.data = this.rowsClass[i];
                this.data[i].push(rowClass);
            }
        };
        /**
         * Restores `rowsSelected` from data pushed by `pushRowSelectionToModelData()`
         *
         * Call after sorting data (if you previously pushed to maintain selection order)
         * to make everything right with the world again.
         */
        SCTableModel.prototype.popRowStateFromModelData = function () {
            for (var i = 0; i < this.data.length; i++) {
                this.rowsClass[i] = this.data[i].pop().data;
                this.rowsContext[i] = this.data[i].pop().data;
                this.rowsExpanded[i] = !!this.data[i].pop().data;
                this.rowsSelected[i] = !!this.data[i].pop().data;
            }
        };
        /**
         * Select/deselect `index`th row based on value
         *
         * @param index index of the row to select
         * @param value state to set the row to. Defaults to `true`
         */
        SCTableModel.prototype.selectRow = function (index, value) {
            if (value === void 0) { value = true; }
            if (this.isRowDisabled(index)) {
                return;
            }
            this.rowsSelected[index] = value;
            this.rowsSelectedChange.emit(index);
        };
        /**
         * Selects or deselects all rows in the model
         *
         * @param value state to set all rows to. Defaults to `true`
         */
        SCTableModel.prototype.selectAll = function (value) {
            if (value === void 0) { value = true; }
            if (this.data.length >= 1) {
                for (var i = 0; i < this.rowsSelected.length; i++) {
                    this.selectRow(i, value);
                }
            }
            this.selectAllChange.next(value);
        };
        SCTableModel.prototype.isRowSelected = function (index) {
            return this.rowsSelected[index];
        };
        /**
         * Checks if row is disabled or not.
         */
        SCTableModel.prototype.isRowDisabled = function (index) {
            var row = this.data[index];
            return !!row.disabled;
        };
        /**
         * Expands/Collapses `index`th row based on value
         *
         * @param index index of the row to expand or collapse
         * @param value expanded state of the row. `true` is expanded and `false` is collapsed
         */
        SCTableModel.prototype.expandRow = function (index, value) {
            if (value === void 0) { value = true; }
            this.rowsExpanded[index] = value;
            this.rowsExpandedChange.emit(index);
        };
        /**
         * Gets the true index of a row based on it's relative position.
         * Like in Python, positive numbers start from the top and
         * negative numbers start from the bottom.
         *
         * @param index
         */
        SCTableModel.prototype.realRowIndex = function (index) {
            return this.realIndex(index, this.data.length);
        };
        /**
         * Gets the true index of a column based on it's relative position.
         * Like in Python, positive numbers start from the top and
         * negative numbers start from the bottom.
         *
         * @param index
         */
        SCTableModel.prototype.realColumnIndex = function (index) {
            return this.realIndex(index, this.data[0].length);
        };
        /**
         * Generic function to calculate the real index of something.
         * Used by `realRowIndex()` and `realColumnIndex()`
         *
         * @param index
         * @param length
         */
        SCTableModel.prototype.realIndex = function (index, length) {
            if (index == null) {
                return length - 1;
            }
            else if (index >= 0) {
                return index >= length ? length - 1 : index;
            }
            else {
                return -index >= length ? 0 : length + index;
            }
        };
        return SCTableModel;
    }());
    /**
     * The number of models instantiated, used for (among other things) unique id generation
     */
    SCTableModel.COUNT = 0;

    var DraggableDirective = /** @class */ (function () {
        function DraggableDirective() {
            this.imageOffset = { x: 0, y: 0 };
            this.start = new core.EventEmitter();
            this.end = new core.EventEmitter();
            this.draggable = true;
        }
        DraggableDirective.prototype.handleDragStart = function (event) {
            // 20 is half the element height
            // 4 is half of a mini-unit, which centers the drag on the handle
            event.dataTransfer.setDragImage(this.dragImage, this.imageOffset.x, this.imageOffset.y);
            event.dataTransfer.effectAllowed = 'move';
            this.start.emit();
        };
        DraggableDirective.prototype.handleEnd = function () {
            this.end.emit();
        };
        return DraggableDirective;
    }());
    DraggableDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[scDraggable], [aiDraggable]',
                },] }
    ];
    DraggableDirective.propDecorators = {
        dragImage: [{ type: core.Input }],
        imageOffset: [{ type: core.Input }],
        start: [{ type: core.Output }],
        end: [{ type: core.Output }],
        draggable: [{ type: core.HostBinding, args: ['attr.draggable',] }],
        handleDragStart: [{ type: core.HostListener, args: ['dragstart', ['$event'],] }],
        handleEnd: [{ type: core.HostListener, args: ['dragend',] }]
    };

    var DroppableDirective = /** @class */ (function () {
        function DroppableDirective() {
            this.active = new core.EventEmitter();
            this.leave = new core.EventEmitter();
            this.dropping = new core.EventEmitter();
        }
        DroppableDirective.prototype.handleDrag = function (event) {
            event.preventDefault();
            this.active.emit(true);
        };
        DroppableDirective.prototype.handleDrop = function () {
            this.active.emit(false);
            this.dropping.emit();
        };
        DroppableDirective.prototype.handleLeave = function () {
            this.leave.emit();
        };
        return DroppableDirective;
    }());
    DroppableDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[scDropzone], [aiDropzone]',
                },] }
    ];
    DroppableDirective.propDecorators = {
        active: [{ type: core.Output }],
        leave: [{ type: core.Output }],
        dropping: [{ type: core.Output }],
        handleDrag: [{ type: core.HostListener, args: ['dragover', ['$event'],] }, { type: core.HostListener, args: ['dragenter', ['$event'],] }],
        handleDrop: [{ type: core.HostListener, args: ['drop',] }],
        handleLeave: [{ type: core.HostListener, args: ['dragleave',] }]
    };

    var DraggableModule = /** @class */ (function () {
        function DraggableModule() {
        }
        return DraggableModule;
    }());
    DraggableModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [DraggableDirective, DroppableDirective],
                    imports: [common.CommonModule],
                    exports: [DraggableDirective, DroppableDirective],
                },] }
    ];

    /**
     * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-sortable-list-item component
     */
    var SortableListItemComponent = /** @class */ (function () {
        function SortableListItemComponent(elementRef) {
            this.elementRef = elementRef;
            this.checked = true;
            this.disabled = false;
            this.dragActive = false;
            this.dragStart = new core.EventEmitter();
            this.dragEnd = new core.EventEmitter();
            this.move = new core.EventEmitter();
        }
        return SortableListItemComponent;
    }());
    SortableListItemComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'sc-sortable-list-item',
                    template: "\n    <div\n      class=\"drag-marker\"\n      [ngClass]=\"{\n        active: dragActive\n      }\"\n    ></div>\n    <div class=\"wrapper\" [ngClass]=\"{ disabled: disabled }\">\n      <div\n        class=\"handle\"\n        scDraggable\n        [dragImage]=\"elementRef.nativeElement\"\n        [imageOffset]=\"{ x: 4, y: 20 }\"\n        (start)=\"!disabled ? dragStart.emit() : null\"\n        (end)=\"!disabled ? dragEnd.emit() : null\"\n      >\n        <svg\n          xmlns=\"http://www.w3.org/2000/svg\"\n          focusable=\"false\"\n          preserveAspectRatio=\"xMidYMid meet\"\n          aria-hidden=\"true\"\n          width=\"16\"\n          height=\"16\"\n          viewBox=\"0 0 32 32\"\n        >\n          <path\n            d=\"M10 6H14V10H10zM18 6H22V10H18zM10 14H14V18H10zM18 14H22V18H18zM10 22H14V26H10zM18 22H22V26H18z\"\n          ></path>\n        </svg>\n      </div>\n      <div class=\"content\">\n        <ibm-checkbox [checked]=\"checked\" [disabled]=\"disabled\">\n          <ng-content></ng-content>\n        </ibm-checkbox>\n        <ibm-overflow-menu [flip]=\"true\">\n          <ibm-overflow-menu-option (selected)=\"move.emit('up')\" [disabled]=\"disabled\"\n            >Move up</ibm-overflow-menu-option\n          >\n          <ibm-overflow-menu-option (selected)=\"move.emit('down')\" [disabled]=\"disabled\"\n            >Move down</ibm-overflow-menu-option\n          >\n        </ibm-overflow-menu>\n      </div>\n    </div>\n  ",
                    styles: [":host{display:list-item;height:2.5rem;margin-bottom:.5rem;padding-left:1rem;padding-right:1rem}.drag-marker{border:1px solid #4589ff;display:none}.drag-marker.active{display:block}.wrapper{align-items:center;display:flex;height:100%;width:100%}.handle{cursor:pointer}.content{align-items:center;background:#f4f4f4;display:flex;height:100%;margin-left:.5rem;padding-left:1rem;padding-right:.5rem;width:100%}"]
                },] }
    ];
    SortableListItemComponent.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };
    SortableListItemComponent.propDecorators = {
        checked: [{ type: core.Input }],
        disabled: [{ type: core.Input }],
        dragActive: [{ type: core.Input }],
        dragStart: [{ type: core.Output }],
        dragEnd: [{ type: core.Output }],
        move: [{ type: core.Output }]
    };

    /**
     * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-sortable-list component
     */
    var SortableListComponent = /** @class */ (function () {
        function SortableListComponent() {
            this.itemsChange = new core.EventEmitter();
            this.dragging = null;
            this.dragOver = null;
        }
        SortableListComponent.prototype.trackByFn = function (index, item) {
            return item;
        };
        SortableListComponent.prototype.dragStart = function (item) {
            this.dragging = item;
        };
        SortableListComponent.prototype.active = function (item) {
            this.dragOver = item;
        };
        SortableListComponent.prototype.leave = function () {
            this.dragOver = null;
        };
        SortableListComponent.prototype.isActive = function (item) {
            return this.dragOver === item;
        };
        SortableListComponent.prototype.end = function () {
            this.dragOver = null;
            this.dragging = null;
        };
        SortableListComponent.prototype.handleDrop = function () {
            if (!this.dragging) {
                return;
            }
            this.items = this.insertBefore(this.dragging, this.dragOver);
            this.end();
            this.itemsChange.emit(this.items);
        };
        SortableListComponent.prototype.handleMove = function (direction, item) {
            var itemIndex = this.items.indexOf(item);
            if (direction === 'up') {
                if (!this.items[itemIndex - 1]) {
                    return;
                }
                this.items = this.insertBefore(item, this.items[itemIndex - 1]);
            }
            else if (direction === 'down') {
                var baseItem = this.items[itemIndex + 2] ? this.items[itemIndex + 2] : 'bottom';
                this.items = this.insertBefore(item, baseItem);
            }
        };
        SortableListComponent.prototype.insertBefore = function (itemToMove, baseItem) {
            var tmpItems = Array.from(this.items);
            var itemToMoveIndex = tmpItems.indexOf(itemToMove);
            tmpItems.splice(itemToMoveIndex, 1);
            if (baseItem === 'bottom') {
                tmpItems.push(itemToMove);
            }
            else {
                var insertionPointIndex = tmpItems.indexOf(baseItem);
                tmpItems.splice(insertionPointIndex, 0, itemToMove);
            }
            return tmpItems;
        };
        return SortableListComponent;
    }());
    SortableListComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'sc-sortable-list',
                    template: "\n    <ol>\n      <ng-container *ngFor=\"let item of items; trackBy: trackByFn\">\n        <li\n          scDropzone\n          class=\"dropzone\"\n          [ngClass]=\"{\n            active: isActive(item),\n            visible: dragging\n          }\"\n          (dropping)=\"handleDrop()\"\n          (active)=\"active(item)\"\n          (leave)=\"leave()\"\n        >\n          <div class=\"line\"></div>\n        </li>\n        <sc-sortable-list-item\n          [disabled]=\"item.disabled\"\n          (dragStart)=\"dragStart(item)\"\n          (dragEnd)=\"end()\"\n          (move)=\"handleMove($event, item)\"\n        >\n          <ng-container *ngIf=\"!item.template\">{{ item?.content | async }}</ng-container>\n          <ng-template\n            *ngIf=\"item.template\"\n            [ngTemplateOutlet]=\"item.template\"\n            [ngTemplateOutletContext]=\"item\"\n          >\n          </ng-template>\n        </sc-sortable-list-item>\n      </ng-container>\n      <li\n        scDropzone\n        class=\"dropzone bottom\"\n        [ngClass]=\"{\n          active: isActive('bottom'),\n          visible: dragging\n        }\"\n        (dropping)=\"handleDrop()\"\n        (active)=\"active('bottom')\"\n        (leave)=\"leave()\"\n      >\n        <div class=\"line\"></div>\n      </li>\n    </ol>\n  ",
                    styles: ["ol{padding-bottom:4px;padding-top:4px;position:relative}.dropzone{display:none;height:2.5rem;margin-top:-28px;padding-left:1rem;padding-right:1rem;position:absolute;width:100%}.dropzone.active .line{border-top:1px solid #0f62fe;position:relative;top:24px;width:100%}.visible{display:block}"]
                },] }
    ];
    SortableListComponent.propDecorators = {
        items: [{ type: core.Input }],
        itemsChange: [{ type: core.Output }]
    };

    var SortableListModule = /** @class */ (function () {
        function SortableListModule() {
        }
        return SortableListModule;
    }());
    SortableListModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [SortableListComponent, SortableListItemComponent],
                    imports: [common.CommonModule, carbonComponentsAngular.CheckboxModule, carbonComponentsAngular.DialogModule, DraggableModule],
                    exports: [SortableListComponent, SortableListItemComponent],
                },] }
    ];

    var BaseSetting = /** @class */ (function () {
        function BaseSetting(options) {
            this.staged = {};
            this.content = new rxjs.BehaviorSubject(null);
            this.contentObservable = this.content.asObservable();
            this.contentSubscription = new rxjs.Subscription();
            this._inputs = new Map();
            this._outputs = new Map();
            this.setContent(options.content);
            this.setTemplate(options.template);
            this.options = options.options;
        }
        BaseSetting.prototype.getContent = function () {
            return this.contentObservable;
        };
        BaseSetting.prototype.setContent = function (content) {
            var _this = this;
            if (rxjs.isObservable(content)) {
                this.contentSubscription.unsubscribe();
                this.contentSubscription = content.subscribe(function (value) {
                    _this.content.next(value);
                });
            }
            else {
                this.content.next(content);
            }
        };
        BaseSetting.prototype.getTemplate = function () {
            return this.template;
        };
        BaseSetting.prototype.setTemplate = function (template) {
            this.template = template;
        };
        /**
         * gets a map of input names to values
         *
         * By default returns a map of 'options' to `this.options`
         */
        BaseSetting.prototype.getInputs = function () {
            return this._inputs;
        };
        BaseSetting.prototype.getOutputs = function () {
            return this._outputs;
        };
        BaseSetting.prototype.toJSON = function () {
            var jsonOptions = null;
            if (this.options) {
                jsonOptions = this.options.map(function (option) { return option.toJSON ? option.toJSON() : JSON.parse(JSON.stringify(option)); });
            }
            return {
                content: this.content.value,
                options: jsonOptions,
            };
        };
        BaseSetting.prototype.toString = function () {
            return JSON.stringify(this.toJSON());
        };
        BaseSetting.prototype.onChanges = function (changes) {
            var e_1, _a;
            try {
                for (var _b = __values(Object.entries(changes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    this.staged[key] = value;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        BaseSetting.prototype.commit = function () {
            var e_2, _a;
            try {
                for (var _b = __values(Object.entries(this.staged)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    this[key] = value;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        return BaseSetting;
    }());

    var SortableListOption = /** @class */ (function () {
        function SortableListOption(options) {
            this.contentSubject = new rxjs.BehaviorSubject(null);
            this.contentSubscription = new rxjs.Subscription();
            this.setContent(options.content);
            this.template = options.template;
            this.order = options.order;
            this.options = options.options;
            this.disabled = options.disabled;
            this.content = this.contentSubject.asObservable();
        }
        SortableListOption.prototype.getContent = function () {
            return this.content;
        };
        SortableListOption.prototype.setContent = function (content) {
            var _this = this;
            if (rxjs.isObservable(content)) {
                this.contentSubscription.unsubscribe();
                this.contentSubscription = content.subscribe(function (value) {
                    _this.contentSubject.next(value);
                });
            }
            else {
                this.contentSubject.next(content);
            }
        };
        SortableListOption.prototype.toJSON = function () {
            var jsonOptions = this.options ? this.options.map(function (option) { return option.toJSON(); }) : [];
            return {
                content: this.contentSubject.value,
                disabled: this.disabled,
                order: this.order,
                options: jsonOptions,
            };
        };
        SortableListOption.prototype.toString = function () {
            return JSON.stringify(this.toJSON());
        };
        return SortableListOption;
    }());
    var SortableList = /** @class */ (function (_super) {
        __extends(SortableList, _super);
        function SortableList(options) {
            var _this = _super.call(this, options) || this;
            _this.component = SortableListComponent;
            _this._outputs = new Map([['itemsChange', _this.onChanges.bind(_this)]]);
            _this._inputs = new Map([['items', _this.options]]);
            // this.options must be set before setting the value (if any)
            _this.options = options.options;
            _this.setContent(options.content);
            _this.setTemplate(options.template);
            return _this;
        }
        SortableList.prototype.getInputs = function () {
            return this._inputs;
        };
        SortableList.prototype.getOutputs = function () {
            return this._outputs;
        };
        SortableList.prototype.onChanges = function (value) {
            this.stagedOptions = value;
        };
        SortableList.prototype.commit = function () {
            this.options = this.stagedOptions;
        };
        return SortableList;
    }(BaseSetting));

    var TableSettingsPane = /** @class */ (function () {
        function TableSettingsPane(options) {
            this.settings = [];
            if (options.settings) {
                this.settings = options.settings;
            }
            this.content = options.content;
            this.title = options.title;
        }
        TableSettingsPane.prototype.addSetting = function (setting) {
            this.settings.push(setting);
        };
        TableSettingsPane.prototype.setSettings = function (settings) {
            this.settings = settings;
        };
        TableSettingsPane.prototype.getSettings = function () {
            return this.settings;
        };
        TableSettingsPane.prototype.getContent = function () {
            if (rxjs.isObservable(this.content)) {
                return this.content;
            }
            return rxjs.of(this.content);
        };
        TableSettingsPane.prototype.toJSON = function () {
            var jsonSettings = [];
            if (this.settings) {
                jsonSettings = this.settings.map(function (setting) { return setting.toJSON(); });
            }
            var jsonContent = this.content ? this.content.toString() : null;
            return {
                settings: jsonSettings,
                content: jsonContent,
            };
        };
        TableSettingsPane.prototype.toString = function () {
            return JSON.stringify(this.toJSON());
        };
        TableSettingsPane.prototype.commit = function () {
            this.settings.forEach(function (setting) { return setting.commit(); });
        };
        return TableSettingsPane;
    }());

    // tslint:disable: max-classes-per-file
    var TableSettings = /** @class */ (function () {
        function TableSettings(options) {
            this.panes = [];
            if (options.panes) {
                this.panes = options.panes;
            }
            this.content = options.content;
            this.title = options.title;
            this.template = options.template;
        }
        TableSettings.prototype.addPane = function (paneOrOptions) {
            if (paneOrOptions instanceof TableSettingsPane) {
                this.panes.push(paneOrOptions);
            }
            else {
                this.panes.push(new TableSettingsPane(paneOrOptions));
            }
        };
        TableSettings.prototype.setPanes = function (panes) {
            this.panes = panes;
        };
        TableSettings.prototype.getPanes = function () {
            return this.panes;
        };
        TableSettings.prototype.getContent = function () {
            if (rxjs.isObservable(this.content)) {
                return this.content;
            }
            return rxjs.of(this.content);
        };
        TableSettings.prototype.toJSON = function () {
            var jsonPanes = [];
            if (this.panes) {
                jsonPanes = this.panes.map(function (pane) { return pane.toJSON(); });
            }
            var jsonContent = this.content ? this.content.toString() : null;
            var jsonTitle = this.title ? this.title.toString() : null;
            return {
                content: jsonContent,
                title: jsonTitle,
                panes: jsonPanes,
            };
        };
        TableSettings.prototype.toString = function () {
            return JSON.stringify(this.toJSON());
        };
        TableSettings.prototype.commit = function () {
            this.panes.forEach(function (pane) { return pane.commit(); });
        };
        return TableSettings;
    }());

    var TableSettingsModalComponent = /** @class */ (function (_super) {
        __extends(TableSettingsModalComponent, _super);
        function TableSettingsModalComponent(model, modelChange) {
            var _this = _super.call(this) || this;
            _this.model = model;
            _this.modelChange = modelChange;
            _this.listComponent = SortableListComponent;
            _this.settingsModelChange = new core.EventEmitter();
            return _this;
        }
        TableSettingsModalComponent.prototype.ngOnInit = function () {
            if (this.settingsModel) {
                this.model = this.settingsModel;
            }
        };
        TableSettingsModalComponent.prototype.cancel = function () {
            this.closeModal();
        };
        TableSettingsModalComponent.prototype.acceptChanges = function () {
            this.model.commit();
            this.settingsModelChange.emit(this.model);
            if (this.modelChange) {
                this.modelChange.next(this.model);
            }
            this.closeModal();
        };
        return TableSettingsModalComponent;
    }(carbonComponentsAngular.BaseModal));
    TableSettingsModalComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'sc-table-settings-modal, ai-table-settings-modal',
                    template: "\n    <ibm-modal (overlaySelected)=\"closeModal()\" [hasScrollingContent]=\"false\" [open]=\"open\">\n      <ibm-modal-header (closeSelect)=\"closeModal()\">\n        <p class=\"bx--modal-header__heading bx--type-beta\">{{ model.title }}</p>\n      </ibm-modal-header>\n      <div class=\"bx--modal-content content\">\n        <ng-container *ngIf=\"!model.template\">{{ model.getContent() | async }}</ng-container>\n        <ng-template\n          *ngIf=\"model.template\"\n          [ngTemplateOutlet]=\"model.template\"\n          [ngTemplateOutletContext]=\"model\"\n        >\n        </ng-template>\n        <ibm-tabs>\n          <ibm-tab *ngFor=\"let pane of model.getPanes()\" [heading]=\"pane.title\">\n            <p>{{ pane.getContent() | async }}</p>\n            <div *ngFor=\"let setting of pane.getSettings()\">\n              <p>{{ setting.getContent() | async }}</p>\n              <ng-template\n                [ngTemplateOutlet]=\"setting.getTemplate()\"\n                [ngTemplateOutletContext]=\"setting\"\n              ></ng-template>\n              <ng-container\n                *scComponentOutlet=\"\n                  setting.component;\n                  inputs: setting.getInputs();\n                  outputs: setting.getOutputs()\n                \"\n              >\n              </ng-container>\n            </div>\n          </ibm-tab>\n        </ibm-tabs>\n      </div>\n      <ibm-modal-footer>\n        <button ibmButton=\"secondary\" (click)=\"cancel()\">Cancel</button>\n        <button ibmButton=\"primary\" (click)=\"acceptChanges()\">Okay</button>\n      </ibm-modal-footer>\n    </ibm-modal>\n  ",
                    styles: [".content{overflow-y:visible;padding-right:1rem}"]
                },] }
    ];
    TableSettingsModalComponent.ctorParameters = function () { return [
        { type: TableSettings, decorators: [{ type: core.Optional }, { type: core.Inject, args: ['model',] }] },
        { type: rxjs.Subject, decorators: [{ type: core.Optional }, { type: core.Inject, args: ['modelChange',] }] }
    ]; };
    TableSettingsModalComponent.propDecorators = {
        settingsModel: [{ type: core.Input }],
        settingsModelChange: [{ type: core.Output }]
    };

    var ComponentOutletDirective = /** @class */ (function () {
        function ComponentOutletDirective(_viewContainerRef) {
            this._viewContainerRef = _viewContainerRef;
            this.scComponentOutletInputs = new Map();
            this.scComponentOutletOutputs = new Map();
            this._componentRef = null;
            this._moduleRef = null;
        }
        // end copy
        ComponentOutletDirective.prototype.ngOnChanges = function (changes) {
            var e_1, _a, e_2, _b;
            // tslint:disable-next-line
            // copied from https://github.com/angular/angular/blob/263bbd43c1808f1201bc4b50fe76e8fbba672c51/packages/common/src/directives/ng_component_outlet.ts#L10-L116
            this._viewContainerRef.clear();
            this._componentRef = null;
            if (this.scComponentOutlet) {
                var elInjector = this.scComponentOutletInjector || this._viewContainerRef.parentInjector;
                if (changes['scComponentOutletNgModuleFactory']) {
                    if (this._moduleRef) {
                        this._moduleRef.destroy();
                    }
                    if (this.scComponentOutletNgModuleFactory) {
                        var parentModule = elInjector.get(core.NgModuleRef);
                        this._moduleRef = this.scComponentOutletNgModuleFactory.create(parentModule.injector);
                    }
                    else {
                        this._moduleRef = null;
                    }
                }
                var componentFactoryResolver = this._moduleRef
                    ? this._moduleRef.componentFactoryResolver
                    : elInjector.get(core.ComponentFactoryResolver);
                var componentFactory = componentFactoryResolver.resolveComponentFactory(this.scComponentOutlet);
                this._componentRef = this._viewContainerRef.createComponent(componentFactory, this._viewContainerRef.length, elInjector, this.scComponentOutletContent);
            }
            // end copy
            if (changes.scComponentOutletInputs) {
                var inputs = Array.from(changes.scComponentOutletInputs.currentValue);
                try {
                    for (var inputs_1 = __values(inputs), inputs_1_1 = inputs_1.next(); !inputs_1_1.done; inputs_1_1 = inputs_1.next()) {
                        var _c = __read(inputs_1_1.value, 2), key = _c[0], value = _c[1];
                        this['_componentRef']['instance'][key] = value;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (inputs_1_1 && !inputs_1_1.done && (_a = inputs_1.return)) _a.call(inputs_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            if (changes.scComponentOutletOutputs) {
                var outputs = Array.from(changes.scComponentOutletOutputs.currentValue);
                var _loop_1 = function (key, value) {
                    this_1['_componentRef']['instance'][key].subscribe(function (event) {
                        value(event);
                    });
                };
                var this_1 = this;
                try {
                    for (var outputs_1 = __values(outputs), outputs_1_1 = outputs_1.next(); !outputs_1_1.done; outputs_1_1 = outputs_1.next()) {
                        var _d = __read(outputs_1_1.value, 2), key = _d[0], value = _d[1];
                        _loop_1(key, value);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (outputs_1_1 && !outputs_1_1.done && (_b = outputs_1.return)) _b.call(outputs_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        // tslint:disable-next-line
        // copied from https://github.com/angular/angular/blob/263bbd43c1808f1201bc4b50fe76e8fbba672c51/packages/common/src/directives/ng_component_outlet.ts#L10-L116
        ComponentOutletDirective.prototype.ngOnDestroy = function () {
            if (this._moduleRef) {
                this._moduleRef.destroy();
            }
        };
        return ComponentOutletDirective;
    }());
    ComponentOutletDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[scComponentOutlet], [aiComponentOutlet]',
                },] }
    ];
    ComponentOutletDirective.ctorParameters = function () { return [
        { type: core.ViewContainerRef }
    ]; };
    ComponentOutletDirective.propDecorators = {
        scComponentOutletInputs: [{ type: core.Input }],
        scComponentOutletOutputs: [{ type: core.Input }],
        scComponentOutlet: [{ type: core.Input }],
        scComponentOutletInjector: [{ type: core.Input }],
        scComponentOutletContent: [{ type: core.Input }],
        scComponentOutletNgModuleFactory: [{ type: core.Input }]
    };

    var UtilsModule = /** @class */ (function () {
        function UtilsModule() {
        }
        return UtilsModule;
    }());
    UtilsModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [ComponentOutletDirective],
                    exports: [ComponentOutletDirective],
                    imports: [common.CommonModule],
                },] }
    ];

    var CheckboxSettingComponent = /** @class */ (function () {
        function CheckboxSettingComponent() {
            this.optionsChange = new core.EventEmitter();
        }
        CheckboxSettingComponent.prototype.getContent = function (option) {
            if (rxjs.isObservable(option.content)) {
                return option.content;
            }
            return rxjs.of(option.content);
        };
        CheckboxSettingComponent.prototype.onChange = function (event, eventOption) {
            var changes = {
                options: this.options.map(function (option) {
                    if (option === eventOption) {
                        return Object.assign({}, option, { checked: event.checked });
                    }
                    return option;
                }),
            };
            this.optionsChange.emit(changes);
        };
        return CheckboxSettingComponent;
    }());
    CheckboxSettingComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'sc-checkbox-setting, ai-checkbox-setting',
                    template: "\n    <ibm-checkbox\n      *ngFor=\"let option of options\"\n      [checked]=\"option.checked\"\n      (change)=\"onChange($event, option)\"\n    >\n      {{ getContent(option) | async }}\n    </ibm-checkbox>\n  "
                },] }
    ];
    CheckboxSettingComponent.propDecorators = {
        options: [{ type: core.Input }],
        optionsChange: [{ type: core.Output }]
    };

    var RadioSettingComponent = /** @class */ (function () {
        function RadioSettingComponent() {
            this.activeChange = new core.EventEmitter();
        }
        RadioSettingComponent.prototype.getContent = function (option) {
            if (rxjs.isObservable(option.content)) {
                return option.content;
            }
            return rxjs.of(option.content);
        };
        RadioSettingComponent.prototype.onChange = function (event) {
            this.activeChange.emit({ active: event.value });
        };
        return RadioSettingComponent;
    }());
    RadioSettingComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'sc-radio-setting, ai-radio-setting',
                    template: "\n    <ibm-radio-group>\n      <ibm-radio\n        *ngFor=\"let option of options\"\n        [checked]=\"option.value === active\"\n        [value]=\"option.value\"\n        (change)=\"onChange($event)\"\n      >\n        {{ getContent(option) | async }}\n      </ibm-radio>\n    </ibm-radio-group>\n  "
                },] }
    ];
    RadioSettingComponent.propDecorators = {
        options: [{ type: core.Input }],
        active: [{ type: core.Input }],
        activeChange: [{ type: core.Output }]
    };

    var TableSettingsService = /** @class */ (function () {
        function TableSettingsService(modalService) {
            this.modalService = modalService;
            this.closeSubject = new rxjs.Subject();
            this.onClose = this.closeSubject.asObservable();
        }
        TableSettingsService.prototype.openSettings = function (settingsModel) {
            var _this = this;
            if (this.modalRef) {
                return;
            }
            this.modalRef = this.modalService.create({
                component: TableSettingsModalComponent,
                inputs: {
                    model: settingsModel,
                },
            });
            this.modalRef.instance.close.subscribe(function () {
                _this.closeSubject.next();
            });
        };
        TableSettingsService.prototype.closeSettings = function () {
            if (!this.modalRef) {
                return;
            }
            this.modalRef.instance.closeModal();
            this.modalRef = null;
        };
        return TableSettingsService;
    }());
    TableSettingsService.decorators = [
        { type: core.Injectable }
    ];
    TableSettingsService.ctorParameters = function () { return [
        { type: carbonComponentsAngular.ModalService }
    ]; };

    var TableSettingsModule = /** @class */ (function () {
        function TableSettingsModule() {
        }
        return TableSettingsModule;
    }());
    TableSettingsModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [TableSettingsModalComponent, CheckboxSettingComponent, RadioSettingComponent],
                    exports: [TableSettingsModalComponent, CheckboxSettingComponent, RadioSettingComponent],
                    providers: [TableSettingsService],
                    imports: [
                        common.CommonModule,
                        animations.BrowserAnimationsModule,
                        SortableListModule,
                        carbonComponentsAngular.ModalModule,
                        carbonComponentsAngular.ButtonModule,
                        carbonComponentsAngular.DialogModule,
                        UtilsModule,
                        carbonComponentsAngular.TabsModule,
                        carbonComponentsAngular.CheckboxModule,
                        carbonComponentsAngular.RadioModule,
                    ],
                    entryComponents: [SortableListComponent, CheckboxSettingComponent, RadioSettingComponent],
                },] }
    ];

    var CheckboxSetting = /** @class */ (function (_super) {
        __extends(CheckboxSetting, _super);
        function CheckboxSetting(options) {
            var _this = _super.call(this, options) || this;
            _this.component = CheckboxSettingComponent;
            _this.options = options.options;
            _this._inputs.set('options', options.options);
            _this._outputs.set('optionsChange', _this.onChanges.bind(_this));
            return _this;
        }
        return CheckboxSetting;
    }(BaseSetting));

    var RadioSetting = /** @class */ (function (_super) {
        __extends(RadioSetting, _super);
        function RadioSetting(options) {
            var _this = _super.call(this, options) || this;
            _this.component = RadioSettingComponent;
            _this.options = options.options;
            _this.active = options.active;
            _this._inputs.set('options', options.options);
            _this._inputs.set('active', options.active);
            _this._outputs.set('activeChange', _this.onChanges.bind(_this));
            return _this;
        }
        RadioSetting.prototype.toJSON = function () {
            var jsonOptions = null;
            if (this.options) {
                jsonOptions = this.options.map(function (option) { return option.toJSON ? option.toJSON() : JSON.parse(JSON.stringify(option)); });
            }
            return {
                content: this.content.value,
                options: jsonOptions,
                active: this.active,
            };
        };
        return RadioSetting;
    }(BaseSetting));

    var ComponentSetting = /** @class */ (function (_super) {
        __extends(ComponentSetting, _super);
        function ComponentSetting(options) {
            var _this = _super.call(this, options) || this;
            _this.component = options.component;
            if (options.inputs) {
                _this._inputs = new Map(Object.entries(options.inputs));
            }
            if (options.outputs) {
                _this._outputs = new Map(Object.entries(options.outputs));
            }
            return _this;
        }
        ComponentSetting.prototype.getInputs = function () {
            return this._inputs;
        };
        ComponentSetting.prototype.getOutputs = function () {
            return this._outputs;
        };
        return ComponentSetting;
    }(BaseSetting));

    // export directly from the index file to work around some bugs with

    /**
     * Generated bundle index. Do not edit.
     */

    exports.BaseSetting = BaseSetting;
    exports.CheckboxSetting = CheckboxSetting;
    exports.CheckboxSettingComponent = CheckboxSettingComponent;
    exports.ComponentOutletDirective = ComponentOutletDirective;
    exports.ComponentSetting = ComponentSetting;
    exports.DraggableDirective = DraggableDirective;
    exports.DraggableModule = DraggableModule;
    exports.DroppableDirective = DroppableDirective;
    exports.PageHeaderComponent = PageHeaderComponent;
    exports.PageHeaderModule = PageHeaderModule;
    exports.RadioSetting = RadioSetting;
    exports.RadioSettingComponent = RadioSettingComponent;
    exports.SCTableComponent = SCTableComponent;
    exports.SCTableHeadCell = SCTableHeadCell;
    exports.SCTableHeadComponent = SCTableHeadComponent;
    exports.SCTableModel = SCTableModel;
    exports.SCTableModule = SCTableModule;
    exports.SortableList = SortableList;
    exports.SortableListComponent = SortableListComponent;
    exports.SortableListItemComponent = SortableListItemComponent;
    exports.SortableListModule = SortableListModule;
    exports.SortableListOption = SortableListOption;
    exports.TableSettings = TableSettings;
    exports.TableSettingsModalComponent = TableSettingsModalComponent;
    exports.TableSettingsModule = TableSettingsModule;
    exports.TableSettingsPane = TableSettingsPane;
    exports.TableSettingsService = TableSettingsService;
    exports.UtilsModule = UtilsModule;
    exports.itemsWithTitle = itemsWithTitle;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular-toolkit.umd.js.map
