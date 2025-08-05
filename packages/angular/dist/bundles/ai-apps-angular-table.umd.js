/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-table.umd.js
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
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('carbon-components-angular'), require('@angular/common'), require('@carbon/icons/es/arrows--vertical/16'), require('@carbon/icons/es/arrow--down/16'), require('@carbon/icons/es/filter/16'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('@ai-apps/angular/table', ['exports', '@angular/core', 'carbon-components-angular', '@angular/common', '@carbon/icons/es/arrows--vertical/16', '@carbon/icons/es/arrow--down/16', '@carbon/icons/es/filter/16', 'rxjs'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = global["ai-apps"].angular || {}, global["ai-apps"].angular.table = {}), global.ng.core, global.carbonComponentsAngular, global.ng.common, global.ArrowsVertical16, global.ArrowDown16, global.Filter16, global.rxjs));
})(this, (function (exports, core, carbonComponentsAngular, common, ArrowsVertical16, ArrowDown16, Filter16, rxjs) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var ArrowsVertical16__default = /*#__PURE__*/_interopDefaultLegacy(ArrowsVertical16);
    var ArrowDown16__default = /*#__PURE__*/_interopDefaultLegacy(ArrowDown16);
    var Filter16__default = /*#__PURE__*/_interopDefaultLegacy(Filter16);

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

    var AITableHeadCell = /** @class */ (function (_super) {
        __extends(AITableHeadCell, _super);
        function AITableHeadCell() {
            var _this = _super.apply(this, __spread(arguments)) || this;
            _this.cssClass = true;
            return _this;
        }
        return AITableHeadCell;
    }(carbonComponentsAngular.TableHeadCell));
    AITableHeadCell.decorators = [
        { type: core.Component, args: [{
                    // tslint:disable-next-line: component-selector
                    selector: '[aiTableHeadCell]',
                    template: "\n    <ng-container *ngIf=\"!skeleton\">\n      <button\n        class=\"bx--table-sort table-header-label iot--table-head--table-header\"\n        [ngClass]=\"{\n          'table-header-label-start': column.alignment === 'start',\n          'table-header-label-center': column.alignment === 'center',\n          'table-header-label-end': column.alignment === 'end'\n        }\"\n        *ngIf=\"this.sort.observers.length > 0 && column.sortable\"\n        [attr.aria-label]=\"\n          (column.sorted && column.ascending ? getSortDescendingLabel() : getSortAscendingLabel())\n            | async\n        \"\n        aria-live=\"polite\"\n        [ngClass]=\"{\n          'bx--table-sort--active': column.sorted,\n          'bx--table-sort--ascending': column.ascending\n        }\"\n        (click)=\"onClick()\"\n      >\n        <span\n          *ngIf=\"!column.template\"\n          class=\"bx--table-header-label\"\n          [title]=\"column.data\"\n          tabindex=\"-1\"\n        >\n          <span>\n            {{ column.data }}\n          </span>\n        </span>\n        <ng-template\n          [ngTemplateOutlet]=\"column.template\"\n          [ngTemplateOutletContext]=\"{ data: column.data }\"\n        >\n        </ng-template>\n        <span class=\"table-head-cell-icons\">\n          <svg ibmIcon=\"arrow--down\" size=\"16\" class=\"bx--table-sort__icon\"></svg>\n          <svg ibmIcon=\"arrows--vertical\" size=\"16\" class=\"bx--table-sort__icon-unsorted\"></svg>\n        </span>\n      </button>\n      <span\n        class=\"bx--table-header-label\"\n        *ngIf=\"\n          this.sort.observers.length === 0 || (this.sort.observers.length > 0 && !column.sortable)\n        \"\n      >\n        <span *ngIf=\"!column.template\" [title]=\"column.data\">{{ column.data }}</span>\n        <ng-template\n          [ngTemplateOutlet]=\"column.template\"\n          [ngTemplateOutletContext]=\"{ data: column.data }\"\n        >\n        </ng-template>\n      </span>\n      <button\n        [ngClass]=\"{ active: column.filterCount > 0 }\"\n        *ngIf=\"column.filterTemplate\"\n        type=\"button\"\n        aria-expanded=\"false\"\n        aria-haspopup=\"true\"\n        [ibmTooltip]=\"column.filterTemplate\"\n        trigger=\"click\"\n        [attr.data-floating-menu-container]=\"true\"\n        [title]=\"getFilterTitle() | async\"\n        placement=\"bottom,top\"\n        [data]=\"column.filterData\"\n      >\n        <svg ibmIcon=\"filter\" size=\"16\" class=\"icon--sm\"></svg>\n        <span *ngIf=\"column.filterCount > 0\">\n          {{ column.filterCount }}\n        </span>\n      </button>\n    </ng-container>\n    <ng-container *ngIf=\"skeleton\">\n      <button class=\"bx--table-sort\">\n        <span class=\"table-head-cell-text\" tabindex=\"-1\"></span>\n      </button>\n    </ng-container>\n  ",
                    encapsulation: core.ViewEncapsulation.None
                },] }
    ];
    AITableHeadCell.propDecorators = {
        cssClass: [{ type: core.HostBinding, args: ['class.iot--table-head-cell',] }],
        column: [{ type: core.Input }]
    };

    /**
     * A subcomponent that creates the thead of the table
     *
     * Example
     *
     * ```html
     * 	<thead aiTableHead [model]="model"></thead>
     * ```
     */
    var AITableHeadComponent = /** @class */ (function (_super) {
        __extends(AITableHeadComponent, _super);
        function AITableHeadComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AITableHeadComponent;
    }(carbonComponentsAngular.TableHead));
    AITableHeadComponent.decorators = [
        { type: core.Component, args: [{
                    // tslint:disable-next-line:component-selector
                    selector: '[aiTableHead]',
                    template: "\n    <ng-container *ngIf=\"model\">\n      <tr *ngFor=\"let headerRow of model.header; let rowIndex = index\" class=\"table-row\">\n        <th ibmTableHeadExpand *ngIf=\"model.hasExpandableRows()\" [id]=\"model.getId('expand')\"></th>\n        <th\n          ibmTableHeadCheckbox\n          *ngIf=\"!skeleton && showSelectionColumn && rowIndex === 0\"\n          class=\"table-selection-column\"\n          [checked]=\"selectAllCheckbox\"\n          [indeterminate]=\"selectAllCheckboxSomeSelected\"\n          [ariaLabel]=\"getCheckboxHeaderLabel()\"\n          [size]=\"size\"\n          [skeleton]=\"skeleton\"\n          [attr.rowspan]=\"model.header.length\"\n          [id]=\"model.getId('select')\"\n          (change)=\"onSelectAllCheckboxChange()\"\n        ></th>\n\n        <ng-container *ngFor=\"let column of headerRow; let i = index\">\n          <th\n            aiTableHeadCell\n            *ngIf=\"column && column.visible\"\n            [id]=\"model.getId(i, rowIndex)\"\n            [headers]=\"rowIndex > 0 ? model.getHeaderId(i, column.colSpan) : ''\"\n            [column]=\"column\"\n            [attr.colspan]=\"column.colSpan\"\n            [attr.rowspan]=\"column.rowSpan\"\n            [filterTitle]=\"getFilterTitle()\"\n            (sort)=\"sort.emit(i)\"\n            [class]=\"column.className\"\n            [skeleton]=\"skeleton\"\n            [ngClass]=\"{\n              'iot--table-head--table-header': true,\n              'table-header-label-start': column.alignment === 'start',\n              'table-header-label-center': column.alignment === 'center',\n              'table-header-label-end': column.alignment === 'end'\n            }\"\n            [ngStyle]=\"column.style\"\n          ></th>\n        </ng-container>\n        <th\n          *ngIf=\"!skeleton && stickyHeader\"\n          [ngStyle]=\"{ width: scrollbarWidth + 'px', padding: 0, border: 0 }\"\n        >\n          <!--\n\t\t\t\t\tScrollbar pushes body to the left so this header column is added to push\n\t\t\t\t\tthe title bar the same amount and keep the header and body columns aligned.\n\t\t\t\t--></th>\n      </tr>\n    </ng-container>\n    <ng-content></ng-content>\n  ",
                    encapsulation: core.ViewEncapsulation.None
                },] }
    ];
    AITableHeadComponent.propDecorators = {
        model: [{ type: core.Input }]
    };

    /**
     * AI PAL table component
     *
     * Example:
     * ```
     * <ai-table></ai-table>
     * ```
     */
    var AITableComponent = /** @class */ (function (_super) {
        __extends(AITableComponent, _super);
        function AITableComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AITableComponent;
    }(carbonComponentsAngular.Table));
    AITableComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-table',
                    template: "\n    <table\n      ibmTable\n      [sortable]=\"true\"\n      [size]=\"size\"\n      [striped]=\"striped\"\n      [skeleton]=\"skeleton\"\n      [ngClass]=\"{ 'bx--data-table--sticky-header': stickyHeader }\"\n      class=\"iot-table\"\n    >\n      <thead\n        aiTableHead\n        (deselectAll)=\"onDeselectAll()\"\n        (selectAll)=\"onSelectAll()\"\n        (sort)=\"sort.emit($event)\"\n        [checkboxHeaderLabel]=\"getCheckboxHeaderLabel()\"\n        [filterTitle]=\"getFilterTitle()\"\n        [model]=\"model\"\n        [size]=\"size\"\n        [selectAllCheckbox]=\"selectAllCheckbox\"\n        [selectAllCheckboxSomeSelected]=\"selectAllCheckboxSomeSelected\"\n        [showSelectionColumn]=\"showSelectionColumn\"\n        [skeleton]=\"skeleton\"\n        [sortAscendingLabel]=\"sortAscendingLabel\"\n        [sortDescendingLabel]=\"sortDescendingLabel\"\n        [stickyHeader]=\"stickyHeader\"\n      ></thead>\n      <tbody\n        aiTableBody\n        (deselectRow)=\"onSelectRow($event)\"\n        (rowClick)=\"onRowClick($event)\"\n        (scroll)=\"onScroll($event)\"\n        (selectRow)=\"onSelectRow($event)\"\n        [checkboxRowLabel]=\"getCheckboxRowLabel()\"\n        [enableSingleSelect]=\"enableSingleSelect\"\n        [expandButtonAriaLabel]=\"expandButtonAriaLabel\"\n        [model]=\"model\"\n        [size]=\"size\"\n        [ngStyle]=\"{ 'overflow-y': 'scroll' }\"\n        [selectionLabelColumn]=\"selectionLabelColumn\"\n        [showSelectionColumn]=\"showSelectionColumn\"\n        [skeleton]=\"skeleton\"\n        *ngIf=\"model.totalDataLength; else noDataTemplate\"\n      ></tbody>\n      <ng-template #noDataTemplate>\n        <tbody>\n          <tr class=\"iot--empty-table--table-row\">\n            <td colspan=\"100%\">\n              <div class=\"empty-table-cell--default\">\n                <ng-content></ng-content>\n              </div>\n            </td>\n          </tr>\n        </tbody>\n      </ng-template>\n      <tfoot>\n        <ng-template [ngTemplateOutlet]=\"footerTemplate\"> </ng-template>\n        <tr *ngIf=\"this.model.isLoading\">\n          <td class=\"table_loading-indicator\">\n            <div class=\"bx--loading bx--loading--small\">\n              <svg class=\"bx--loading__svg\" viewBox=\"-75 -75 150 150\">\n                <circle class=\"bx--loading__stroke\" cx=\"0\" cy=\"0\" r=\"37.5\" />\n              </svg>\n            </div>\n          </td>\n        </tr>\n        <tr *ngIf=\"this.model.isEnd\">\n          <td class=\"table_end-indicator\">\n            <h5>{{ getEndOfDataText() | async }}</h5>\n            <button (click)=\"scrollToTop($event)\" class=\"btn--secondary-sm\">\n              {{ getScrollTopText() | async }}\n            </button>\n          </td>\n        </tr>\n      </tfoot>\n    </table>\n  ",
                    encapsulation: core.ViewEncapsulation.None
                },] }
    ];
    AITableComponent.propDecorators = {
        model: [{ type: core.Input }]
    };

    var AITableBody = /** @class */ (function (_super) {
        __extends(AITableBody, _super);
        function AITableBody() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AITableBody;
    }(carbonComponentsAngular.TableBody));
    AITableBody.decorators = [
        { type: core.Component, args: [{
                    // tslint:disable-next-line: component-selector
                    selector: '[aiTableBody]',
                    template: "\n    <ng-container *ngIf=\"model\">\n      <ng-container *ngFor=\"let row of model.rows(); let i = index\">\n        <tr\n          aiTableRow\n          [model]=\"model\"\n          [row]=\"row\"\n          [size]=\"size\"\n          [selected]=\"model.isRowSelected(i)\"\n          [expandable]=\"model.isRowExpandable(i)\"\n          [expanded]=\"model.isRowExpanded(i)\"\n          [checkboxLabel]=\"getCheckboxRowLabel()\"\n          [expandButtonAriaLabel]=\"getExpandButtonAriaLabel()\"\n          [showSelectionColumn]=\"showSelectionColumn\"\n          [enableSingleSelect]=\"enableSingleSelect\"\n          [skeleton]=\"skeleton\"\n          (selectRow)=\"onRowCheckboxChange(i)\"\n          (deselectRow)=\"onRowCheckboxChange(i)\"\n          (expandRow)=\"model.expandRow(i, !model.isRowExpanded(i))\"\n          (rowClick)=\"onRowClick(i)\"\n          *ngIf=\"!model.isRowFiltered(i)\"\n          [class]=\"model.rowsClass[i] ? model.rowsClass[i] : null\"\n          [ngClass]=\"{\n            'tbody_row--success': !model.isRowSelected(i) && model.getRowContext(i) === 'success',\n            'tbody_row--warning': !model.isRowSelected(i) && model.getRowContext(i) === 'warning',\n            'tbody_row--info': !model.isRowSelected(i) && model.getRowContext(i) === 'info',\n            'tbody_row--error': !model.isRowSelected(i) && model.getRowContext(i) === 'error'\n          }\"\n        ></tr>\n        <tr\n          *ngIf=\"model.isRowExpandable(i) && !shouldExpandAsTable(row) && !model.isRowFiltered(i)\"\n          ibmTableExpandedRow\n          ibmExpandedRowHover\n          [row]=\"row\"\n          [expanded]=\"model.isRowExpanded(i)\"\n          [skeleton]=\"skeleton\"\n        ></tr>\n        <ng-container\n          *ngIf=\"\n            model.isRowExpandable(i) &&\n            shouldExpandAsTable(row) &&\n            model.isRowExpanded(i) &&\n            !model.isRowFiltered(i)\n          \"\n        >\n          <tr\n            *ngFor=\"let expandedDataRow of firstExpandedDataInRow(row)\"\n            aiTableRow\n            [model]=\"model\"\n            [showSelectionColumnCheckbox]=\"false\"\n            [showSelectionColumn]=\"showSelectionColumn\"\n            [row]=\"expandedDataRow\"\n            [size]=\"size\"\n            [skeleton]=\"skeleton\"\n          ></tr>\n        </ng-container>\n      </ng-container>\n    </ng-container>\n    <ng-content></ng-content>\n  "
                },] }
    ];
    AITableBody.propDecorators = {
        model: [{ type: core.Input }]
    };

    var AITableRowComponent = /** @class */ (function (_super) {
        __extends(AITableRowComponent, _super);
        function AITableRowComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AITableRowComponent;
    }(carbonComponentsAngular.TableRowComponent));
    AITableRowComponent.decorators = [
        { type: core.Component, args: [{
                    // tslint:disable-next-line: component-selector
                    selector: '[aiTableRow]',
                    template: "\n    <ng-container *ngIf=\"model\">\n      <td\n        *ngIf=\"model.hasExpandableRows()\"\n        ibmTableExpandButton\n        class=\"bx--table-expand-v2\"\n        [expanded]=\"expanded\"\n        [expandable]=\"expandable\"\n        [skeleton]=\"skeleton\"\n        [ariaLabel]=\"getExpandButtonAriaLabel()\"\n        [headers]=\"model.getHeaderId('expand')\"\n        (expandRow)=\"expandRow.emit()\"\n      ></td>\n      <ng-container *ngIf=\"!skeleton && showSelectionColumn && !enableSingleSelect\">\n        <td *ngIf=\"!showSelectionColumnCheckbox; else tableCheckboxTemplate\"></td>\n        <ng-template #tableCheckboxTemplate>\n          <td\n            ibmTableCheckbox\n            class=\"bx--checkbox-table-cell\"\n            [size]=\"size\"\n            [selected]=\"selected\"\n            [label]=\"getCheckboxLabel()\"\n            [row]=\"row\"\n            [skeleton]=\"skeleton\"\n            [headers]=\"model.getHeaderId('select')\"\n            (change)=\"onSelectionChange()\"\n          ></td>\n        </ng-template>\n      </ng-container>\n      <td\n        *ngIf=\"!skeleton && showSelectionColumn && enableSingleSelect\"\n        ibmTableRadio\n        [selected]=\"selected\"\n        [label]=\"getCheckboxLabel()\"\n        [row]=\"row\"\n        [skeleton]=\"skeleton\"\n        [headers]=\"model.getHeaderId('select')\"\n        (change)=\"onSelectionChange()\"\n      ></td>\n      <ng-container *ngFor=\"let item of row; let j = index\">\n        <td\n          *ngIf=\"item && model.getClosestHeader(j) && model.getClosestHeader(j).visible\"\n          ibmTableData\n          [headers]=\"model.getHeaderId(j, item.colSpan)\"\n          [item]=\"item\"\n          [title]=\"item.title\"\n          [class]=\"model.getClosestHeader(j).className\"\n          [ngStyle]=\"model.getClosestHeader(j).style\"\n          [ngClass]=\"{\n            'data-table-end': model.getClosestHeader(j).alignment === 'end',\n            'data-table-start': model.getClosestHeader(j).alignment === 'start',\n            'data-table-center': model.getClosestHeader(j).alignment === 'center',\n            'iot--table__cell--sortable': model.getClosestHeader(j).sortable\n          }\"\n          [skeleton]=\"skeleton\"\n          [attr.colspan]=\"item.colSpan\"\n          [attr.rowspan]=\"item.rowSpan\"\n          (click)=\"onRowClick()\"\n          (keydown.enter)=\"onRowClick()\"\n        ></td>\n        <td\n          *ngIf=\"item && model.getClosestHeader(j) == null\"\n          ibmTableData\n          [headers]=\"model.getHeaderId(j, item.colSpan)\"\n          [item]=\"item\"\n          [title]=\"item.title\"\n          [skeleton]=\"skeleton\"\n          [attr.colspan]=\"item.colSpan\"\n          [attr.rowspan]=\"item.rowSpan\"\n          (click)=\"onRowClick()\"\n          (keydown.enter)=\"onRowClick()\"\n        ></td>\n      </ng-container>\n    </ng-container>\n    <ng-content></ng-content>\n  "
                },] }
    ];
    AITableRowComponent.propDecorators = {
        model: [{ type: core.Input }]
    };

    var AITableModule = /** @class */ (function () {
        function AITableModule(iconService) {
            this.iconService = iconService;
            iconService.registerAll([ArrowsVertical16__default["default"], ArrowDown16__default["default"], Filter16__default["default"]]);
        }
        return AITableModule;
    }());
    AITableModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [
                        AITableComponent,
                        AITableBody,
                        AITableHeadComponent,
                        AITableHeadCell,
                        AITableRowComponent,
                    ],
                    imports: [carbonComponentsAngular.DialogModule, carbonComponentsAngular.ButtonModule, common.CommonModule, carbonComponentsAngular.TableModule],
                    exports: [
                        AITableComponent,
                        AITableBody,
                        AITableHeadComponent,
                        AITableHeadCell,
                        AITableRowComponent,
                    ],
                },] }
    ];
    AITableModule.ctorParameters = function () { return [
        { type: carbonComponentsAngular.IconService }
    ]; };

    var AITableHeaderItem = /** @class */ (function (_super) {
        __extends(AITableHeaderItem, _super);
        function AITableHeaderItem(rawData) {
            var _this = _super.call(this, rawData) || this;
            /**
             * Defines the alignment of the the header item and the column below it.
             */
            _this.alignment = 'start';
            var defaults = {
                alignment: _this.alignment,
            };
            // fill our object with provided props, and fallback to defaults
            Object.assign(_this, defaults, rawData);
            return _this;
        }
        return AITableHeaderItem;
    }(carbonComponentsAngular.TableHeaderItem));
    /**
     * TableModel represents a data model for two-dimensional data. It's used for all things table
     * (table component, table toolbar, pagination, etc)
     *
     * TableModel manages its internal data integrity very well if you use the provided helper
     * functions for modifying rows and columns and assigning header and data in that order.
     */
    var AITableModel = /** @class */ (function () {
        function AITableModel() {
            this.dataChange = new rxjs.Subject();
            this.rowsSelectedChange = new rxjs.Subject();
            this.rowsExpandedChange = new rxjs.Subject();
            /**
             * Gets emitted when `selectAll` is called. Emits false if all rows are deselected and true if
             * all rows are selected.
             */
            this.selectAllChange = new rxjs.Subject();
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
            /**
             * Contains information about the header cells of the table.
             */
            this.header = [[]];
            /**
             * The number of models instantiated, this is to make sure each table has a different
             * model count for unique id generation.
             */
            this.tableModelCount = 0;
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
            this.tableModelCount = AITableModel.COUNT++;
        }
        Object.defineProperty(AITableModel.prototype, "totalDataLength", {
            /**
             * Total length of data that table has access to, or the amount manually set
             */
            get: function () {
                // if manually set data length
                if (this._totalDataLength !== null && this._totalDataLength >= 0) {
                    return this._totalDataLength;
                }
                // if empty dataset
                if (this._data && this._data.length === 1 && this._data[0].length === 0) {
                    return 0;
                }
                return this._data.length;
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
        /**
         * Sets data of the table.
         *
         * Make sure all rows are the same length to keep the column count accurate.
         */
        AITableModel.prototype.setData = function (newData) {
            var _this = this;
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
            if (this.header == null) {
                var newHeader = [[]];
                // disable this tslint here since we don't actually want to
                // loop the contents of the data
                // tslint:disable-next-line: prefer-for-of
                for (var i = 0; i < this._data[0].length; i++) {
                    newHeader[0].push(new AITableHeaderItem());
                }
                this.header = newHeader;
            }
            else {
                this.header.forEach(function (headerRow, rowIndex) {
                    var projectedRowLength = _this.projectedRowLength(headerRow, rowIndex, _this.header);
                    if (projectedRowLength < _this._data[0].length && _this._data[0].length > 0) {
                        var difference = _this._data[0].length - projectedRowLength;
                        // disable this tslint here since we don't actually want to
                        // loop the difference between contents of data and projected header row length
                        // tslint:disable-next-line: prefer-for-of
                        for (var i = 0; i < difference; i++) {
                            headerRow.push(new AITableHeaderItem());
                        }
                    }
                });
            }
            this.dataChange.next();
        };
        /**
         * Sets data of the table.
         *
         * Make sure all rows are the same length to keep the column count accurate.
         */
        AITableModel.prototype.setHeader = function (newHeader) {
            if (!newHeader) {
                newHeader = [[]];
            }
            else if (Array.isArray(newHeader) && newHeader.length > 0 && !Array.isArray(newHeader[0])) {
                newHeader = [newHeader];
            }
            else if (Array.isArray(newHeader) && newHeader.length === 0) {
                newHeader = [[]];
            }
            newHeader = newHeader.map(function (row) { return row.map(function (col) { return col.constructor.name === 'AITableHeaderItem' ? col : new AITableHeaderItem(col); }); });
            this.header = newHeader;
            this.dataChange.next();
        };
        AITableModel.prototype.setItem = function (rowIndex, columnIndex, item) {
            this._data[rowIndex][columnIndex] = item;
            // TODO make sure changes are reflected in the table
        };
        AITableModel.prototype.setItemData = function (rowIndex, columnIndex, data) {
            this._data[rowIndex][columnIndex].data = data;
            // TODO make sure changes are reflected in the table
        };
        /**
         * Returns an id for the given column
         *
         * @param column the column to generate an id for
         * @param row the row of the header to generate an id for
         */
        AITableModel.prototype.getId = function (column, row) {
            if (row === void 0) { row = 0; }
            return "table-header-" + row + "-" + column + "-" + this.tableModelCount;
        };
        /**
         * Returns the id of the header. Used to link the cells with headers (or headers with headers)
         *
         * @param column the column to start getting headers for
         * @param colSpan the number of columns to get headers for (defaults to 1)
         */
        AITableModel.prototype.getHeaderId = function (column, colSpan) {
            if (colSpan === void 0) { colSpan = 1; }
            if (column === 'select' || column === 'expand') {
                return this.getId(column);
            }
            var ids = [];
            for (var i = column; i >= 0; i--) {
                if (this.header[i]) {
                    for (var j = 0; j < colSpan; j++) {
                        ids.push(this.getId(i + j));
                    }
                    break;
                }
            }
            return ids.join(' ');
        };
        /**
         * Finds closest header by trying the lowest cell in header and then work its way to the left
         * @param column
         */
        AITableModel.prototype.getClosestHeader = function (column) {
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
         * @returns a list of indices of selected rows
         */
        AITableModel.prototype.selectedRowIndices = function () {
            return this.rowsSelected.reduce(function (acc, current, index) {
                if (current) {
                    return __spread(acc, [index]);
                }
                return acc;
            }, []);
        };
        /**
         * Returns how many rows is currently selected
         */
        AITableModel.prototype.selectedRowsCount = function () {
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
         * @returns a list of indices of expanded rows
         */
        AITableModel.prototype.expandedRowIndices = function () {
            return this.rowsExpanded.reduce(function (acc, current, index) {
                if (current) {
                    return __spread(acc, [index]);
                }
                return acc;
            }, []);
        };
        /**
         * Returns how many rows is currently expanded
         */
        AITableModel.prototype.expandedRowsCount = function () {
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
        AITableModel.prototype.row = function (index) {
            return this._data[this.realRowIndex(index)];
        };
        /**
         * Returns all the rows.
         *
         * Use `row()` instead.
         */
        AITableModel.prototype.rows = function () {
            return this._data;
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
        AITableModel.prototype.addRow = function (row, index) {
            // if table empty create table with row
            if (!this._data || this._data.length === 0 || this._data[0].length === 0) {
                var newData = new Array();
                newData.push(row ? row : [new carbonComponentsAngular.TableItem()]); // row or one empty one column row
                this.setData(newData);
                return;
            }
            var realRow = row;
            var columnCount = this._data[0].length;
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
                var difference = realRow.length - this.projectedRowLength(this.header[0], 0, this.header);
                for (var j = 0; j < difference; j++) {
                    // add to the first header row and row-span to fill the height of the header
                    var headerItem = new AITableHeaderItem();
                    headerItem.rowSpan = this.header.length;
                    this.header[0].push(headerItem);
                }
                // extend the length of every other row
                for (var i = 0; i < this._data.length; i++) {
                    var currentRow = this._data[i];
                    difference = realRow.length - currentRow.length;
                    for (var j = 0; j < difference; j++) {
                        currentRow.push(new carbonComponentsAngular.TableItem());
                    }
                }
            }
            if (index == null) {
                this._data.push(realRow);
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
                this._data.splice(ri, 0, realRow);
                // update rowsSelected property for length
                this.rowsSelected.splice(ri, 0, false);
                // update rowsExpanded property for length
                this.rowsExpanded.splice(ri, 0, false);
                // update rowsContext property for length
                this.rowsContext.splice(ri, 0, undefined);
                // update rowsClass property for length
                this.rowsClass.splice(ri, 0, undefined);
            }
            this.dataChange.next();
        };
        /**
         * Deletes `index`th row.
         *
         * Negative index starts from the end. -1 being the last element.
         *
         * @param index
         */
        AITableModel.prototype.deleteRow = function (index) {
            var rri = this.realRowIndex(index);
            this._data.splice(rri, 1);
            this.rowsSelected.splice(rri, 1);
            this.rowsExpanded.splice(rri, 1);
            this.rowsContext.splice(rri, 1);
            this.rowsClass.splice(rri, 1);
            this.dataChange.next();
        };
        AITableModel.prototype.rowMetaInfo = function (index) {
            return {
                selected: this.rowsSelected[index],
                expanded: this.rowsExpanded[index],
                expandable: this.isRowExpandable(index),
                context: this.rowsContext[index],
                rowClass: this.rowsClass[index],
            };
        };
        AITableModel.prototype.hasExpandableRows = function () {
            return this._data.some(function (data) { return data.some(function (d) { return d && d.expandedData; }); }); // checking for some in 2D array
        };
        AITableModel.prototype.isRowExpandable = function (index) {
            return this._data[index].some(function (d) { return d && d.expandedData; });
        };
        AITableModel.prototype.isRowExpanded = function (index) {
            return this.rowsExpanded[index];
        };
        AITableModel.prototype.getRowContext = function (index) {
            return this.rowsContext[index];
        };
        AITableModel.prototype.setRowContext = function (index, context) {
            return (this.rowsContext[index] = context);
        };
        /**
         * Returns `index`th column of the table.
         *
         * Negative index starts from the end. -1 being the last element.
         *
         * @param index
         */
        AITableModel.prototype.column = function (index) {
            var column = new Array();
            var ri = this.realColumnIndex(index);
            var rc = this._data.length;
            for (var i = 0; i < rc; i++) {
                var row = this._data[i];
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
        AITableModel.prototype.addColumn = function (column, index) {
            // if table empty create table with row
            if (!this._data || this._data.length === 0 || this._data[0].length === 0) {
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
                this.setData(newData);
                return;
            }
            var rc = this._data.length; // row count
            var ci = this.realColumnIndex(index);
            // append missing rows
            for (var i = 0; column != null && i < column.length - rc; i++) {
                this.addRow();
            }
            rc = this._data.length;
            if (index == null) {
                // append to end
                for (var i = 0; i < rc; i++) {
                    var row = this._data[i];
                    row.push(column == null || column[i] == null ? new carbonComponentsAngular.TableItem() : column[i]);
                }
                // update header if not already set by user
                if (this.header.length > 0 && this.header[0].length < this._data[0].length) {
                    // add to the first header row and row-span to fill the height of the header
                    var headerItem = new AITableHeaderItem();
                    headerItem.rowSpan = this.header.length;
                    this.header[0].push(headerItem);
                }
            }
            else {
                if (index >= this._data[0].length) {
                    // if trying to append
                    ci++;
                }
                // insert
                for (var i = 0; i < rc; i++) {
                    var row = this._data[i];
                    row.splice(ci, 0, column == null || column[i] == null ? new carbonComponentsAngular.TableItem() : column[i]);
                }
                // update header if not already set by user
                if (this.header.length > 0 && this.header[0].length < this._data[0].length) {
                    // add to the first header row and row-span to fill the height of the header
                    var headerItem = new AITableHeaderItem();
                    headerItem.rowSpan = this.header.length;
                    // this.header[0].push(headerItem);
                    this.header[0].splice(ci, 0, headerItem);
                }
            }
            this.dataChange.next();
        };
        /**
         * Deletes `index`th column.
         *
         * Negative index starts from the end. -1 being the last element.
         *
         * @param index
         */
        AITableModel.prototype.deleteColumn = function (index) {
            var rci = this.realColumnIndex(index);
            var rowCount = this._data.length;
            for (var i = 0; i < rowCount; i++) {
                this._data[i].splice(rci, 1);
            }
            // update header if not already set by user
            if (this.header.length > 0 && this.header[0].length > this._data[0].length) {
                for (var i = 0; i < this.header.length; i++) {
                    var headerRow = this.header[i];
                    headerRow.splice(rci, 1);
                }
            }
            this.dataChange.next();
        };
        /**
         * Move the column at `indexFrom` to `indexTo` of the `rowIndex` row
         *
         * _Note: only works with one row headers at the moment_
         *
         * If headers have merged cells, they should only be merged in a way that a higher row
         * contains all the lower row columns and not vice versa
         *
         * Multiline header example *(good)*:
         *
         * | h1  |           h2          ||||
         * | h11 |    h12    ||    h13   ||
         * | h21 | h22 | h23 | h24 | h25 |
         * |-----|-----|-----|-----|-----|
         * |  a  |  b  |  c  |  d  |  e  |
         * |  f  |  g  |  h  |  i  |  j  |
         *
         * Multiline header example *(not good)*:
         *
         * | h1  |           h2          ||||
         * | h21 | h22 | h23 | h24 | h25 |
         * | h11 |    h12    ||    h13   ||
         * |-----|-----|-----|-----|-----|
         * |  a  |  b  |  c  |  d  |  e  |
         * |  f  |  g  |  h  |  i  |  j  |
         *
         * ## Usage example:
         *
         * ### Moving h2 in place of h1
         *
         * `model.moveColumn(1, 0)`
         *
         * *Before*
         *
         * | h1  |           h2          ||||
         * | h11 |    h12    ||    h13   ||
         * | h21 | h22 | h23 | h24 | h25 |
         * |-----|-----|-----|-----|-----|
         * |  a  |  b  |  c  |  d  |  e  |
         * |  f  |  g  |  h  |  i  |  j  |
         *
         * *After*
         *
         * |           h2          | h1  ||||
         * |    h12    ||    h13   | h11 ||
         * | h22 | h23 | h24 | h25 | h21 |
         * |-----|-----|-----|-----|-----|
         * |  b  |  c  |  d  |  e  |  a  |
         * |  g  |  h  |  i  |  j  |  f  |
         *
         * ### Moving h13 in place of h12
         *
         * `model.moveColumn(2, 1, 1)`
         *
         * *Before*
         *
         * | h1  |           h2          ||||
         * | h11 |    h12    ||    h13   ||
         * | h21 | h22 | h23 | h24 | h25 |
         * |-----|-----|-----|-----|-----|
         * |  a  |  b  |  c  |  d  |  e  |
         * |  f  |  g  |  h  |  i  |  j  |
         *
         * *After*
         *
         * | h1  |           h2          ||||
         * | h11 |    h13    ||    h12   ||
         * | h21 | h24 | h25 | h22 | h23 |
         * |-----|-----|-----|-----|-----|
         * |  a  |  d  |  e  |  b  |  c  |
         * |  f  |  i  |  j  |  g  |  h  |
         *
         * ### Moving h24 in place of h25
         *
         * `model.moveColumn(3, 4, 2)`
         *
         * _Note: while you_ could _move h24 to h22, you shouldn't because it doesn't belong under_
         * _the same subheader._
         *
         * *Before*
         *
         * | h1  |           h2          ||||
         * | h11 |    h12    ||    h13   ||
         * | h21 | h22 | h23 | h24 | h25 |
         * |-----|-----|-----|-----|-----|
         * |  a  |  b  |  c  |  d  |  e  |
         * |  f  |  g  |  h  |  i  |  j  |
         *
         * *After*
         *
         * | h1  |           h2          ||||
         * | h11 |    h12    ||    h13   ||
         * | h21 | h22 | h23 | h25 | h24 |
         * |-----|-----|-----|-----|-----|
         * |  a  |  b  |  c  |  e  |  d  |
         * |  f  |  g  |  h  |  j  |  i  |
         */
        AITableModel.prototype.moveColumn = function (indexFrom, indexTo, rowIndex) {
            if (rowIndex === void 0) { rowIndex = 0; }
            var nested = this.tabularToNested();
            this.moveNested(nested, indexFrom, indexTo, rowIndex);
            var _d = this.nestedToTabular(nested), header = _d.header, data = _d.data;
            this.header = header;
            this._data = data;
        };
        /**
         * Sorts the data currently present in the model based on `compare()`
         *
         * Direction is set by `ascending` and `descending` properties of `AITableHeaderItem`
         * in `index`th column.
         *
         * @param index The column based on which it's sorting
         */
        AITableModel.prototype.sort = function (index) {
            var headerToSort = this.getClosestHeader(index);
            this.pushRowStateToModelData();
            this._data.sort(function (a, b) { return (headerToSort.descending ? -1 : 1) * headerToSort.compare(a[index], b[index]); });
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
        AITableModel.prototype.pushRowStateToModelData = function () {
            for (var i = 0; i < this._data.length; i++) {
                var rowSelectedMark = new carbonComponentsAngular.TableItem();
                rowSelectedMark.data = this.rowsSelected[i];
                this._data[i].push(rowSelectedMark);
                var rowExpandedMark = new carbonComponentsAngular.TableItem();
                rowExpandedMark.data = this.rowsExpanded[i];
                this._data[i].push(rowExpandedMark);
                var rowContext = new carbonComponentsAngular.TableItem();
                rowContext.data = this.rowsContext[i];
                this._data[i].push(rowContext);
                var rowClass = new carbonComponentsAngular.TableItem();
                rowClass.data = this.rowsClass[i];
                this._data[i].push(rowClass);
            }
        };
        /**
         * Restores `rowsSelected` from data pushed by `pushRowSelectionToModelData()`
         *
         * Call after sorting data (if you previously pushed to maintain selection order)
         * to make everything right with the world again.
         */
        AITableModel.prototype.popRowStateFromModelData = function () {
            for (var i = 0; i < this._data.length; i++) {
                this.rowsClass[i] = this._data[i].pop().data;
                this.rowsContext[i] = this._data[i].pop().data;
                this.rowsExpanded[i] = !!this._data[i].pop().data;
                this.rowsSelected[i] = !!this._data[i].pop().data;
            }
        };
        /**
         * Checks if row is filtered out.
         *
         * @param index
         * @returns true if any of the filters in header filters out the `index`th row
         */
        AITableModel.prototype.isRowFiltered = function (index) {
            var _this = this;
            var realIndex = this.realRowIndex(index);
            return this.header.some(function (headerRow) { return headerRow.some(function (item, i) { return item && item.filter(_this.row(realIndex)[i]); }); });
        };
        /**
         * Select/deselect `index`th row based on value
         *
         * @param index index of the row to select
         * @param value state to set the row to. Defaults to `true`
         */
        AITableModel.prototype.selectRow = function (index, value, emitChange) {
            if (value === void 0) { value = true; }
            if (emitChange === void 0) { emitChange = true; }
            if (this.isRowDisabled(index)) {
                return;
            }
            this.rowsSelected[index] = value;
            if (emitChange) {
                this.rowsSelectedChange.next(index);
            }
        };
        /**
         * Selects or deselects all rows in the model
         *
         * @param value state to set all rows to. Defaults to `true`
         */
        AITableModel.prototype.selectAll = function (value) {
            if (value === void 0) { value = true; }
            if (this._data.length >= 1) {
                for (var i = 0; i < this.rowsSelected.length; i++) {
                    this.selectRow(i, value);
                }
            }
            this.selectAllChange.next(value);
        };
        AITableModel.prototype.isRowSelected = function (index) {
            return this.rowsSelected[index];
        };
        /**
         * Checks if row is disabled or not.
         */
        AITableModel.prototype.isRowDisabled = function (index) {
            var row = this._data[index];
            return !!row.disabled;
        };
        /**
         * Expands/Collapses `index`th row based on value
         *
         * @param index index of the row to expand or collapse
         * @param value expanded state of the row. `true` is expanded and `false` is collapsed
         */
        AITableModel.prototype.expandRow = function (index, value) {
            if (value === void 0) { value = true; }
            this.rowsExpanded[index] = value;
            this.rowsExpandedChange.next(index);
        };
        /**
         * Gets the true index of a row based on it's relative position.
         * Like in Python, positive numbers start from the top and
         * negative numbers start from the bottom.
         *
         * @param index
         */
        AITableModel.prototype.realRowIndex = function (index) {
            return this.realIndex(index, this._data.length);
        };
        /**
         * Gets the true index of a column based on it's relative position.
         * Like in Python, positive numbers start from the top and
         * negative numbers start from the bottom.
         *
         * @param index
         */
        AITableModel.prototype.realColumnIndex = function (index) {
            return this.realIndex(index, this._data[0].length);
        };
        /**
         * Generic function to calculate the real index of something.
         * Used by `realRowIndex()` and `realColumnIndex()`
         *
         * @param index
         * @param length
         */
        AITableModel.prototype.realIndex = function (index, length) {
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
        AITableModel.prototype.projectedRowLengthSimple = function (itemArray) {
            return itemArray.reduce(function (len, item) { return len + (item ? item.colSpan || 1 : 0); }, 0);
        };
        /**
         * @param itemArray TableItem[] | AITableHeaderItem[]
         * @returns the number of columns as if now cells were merged
         */
        AITableModel.prototype.projectedRowLength = function (itemArray, rowIndex, matrix) {
            var _this = this;
            // `any[]` should be `AITableItem[] | AITableHeaderItem[]` but typescript
            if (rowIndex === undefined || matrix === undefined) {
                return this.projectedRowLengthSimple(itemArray);
            }
            // the rest of the function takes into account row spans
            var rowLengths = matrix.map(function (row) { return _this.projectedRowLengthSimple(row); });
            var _loop_1 = function (index) {
                var row = matrix[index];
                row.forEach(function (item) {
                    if (item && item.rowSpan) {
                        // increment all row lengths that the span covers
                        for (var i = index + 1; i < index + 1 + item.rowSpan; i++) {
                            rowLengths[i]++;
                        }
                    }
                });
            };
            for (var index = 0; index < rowIndex; index++) {
                _loop_1(index);
            }
            return rowLengths[rowIndex];
        };
        /**
         * Convert a projected index to actual index, where actual index is the index in the list
         * that's passed in
         * @param projectedIndex index of a column if none of the cells were merged
         * @param list a row of the header or the body
         */
        AITableModel.prototype.projectedIndexToActualIndex = function (projectedIndex, list) {
            var index = 0;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                index += (item === null || item === void 0 ? void 0 : item.colSpan) || 1;
                if (index > projectedIndex) {
                    return i;
                }
            }
            return list.length - 1;
        };
        /**
         * Convert an actual index to a projected indices array
         * @param actualIndex index of a column as-is
         * @param list a row of the header or the body
         */
        AITableModel.prototype.actualIndexToProjectedIndices = function (actualIndex, list) {
            // find the starting projected index
            var startingIndex = 0;
            for (var i = 0; i < actualIndex; i++) {
                var item = list[i];
                startingIndex += item.colSpan || 1;
            }
            return new Array(list[actualIndex].colSpan).fill(0).map(function (_, index) { return startingIndex + index; });
        };
        AITableModel.prototype.projectedIndicesToActualIndices = function (projectedIndices, list) {
            var e_1, _d;
            var actualIndicesSet = new Set();
            try {
                for (var projectedIndices_1 = __values(projectedIndices), projectedIndices_1_1 = projectedIndices_1.next(); !projectedIndices_1_1.done; projectedIndices_1_1 = projectedIndices_1.next()) {
                    var projectedIndex = projectedIndices_1_1.value;
                    actualIndicesSet.add(this.projectedIndexToActualIndex(projectedIndex, list));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (projectedIndices_1_1 && !projectedIndices_1_1.done && (_d = projectedIndices_1.return)) _d.call(projectedIndices_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return Array.from(actualIndicesSet).sort();
        };
        AITableModel.prototype.moveMultipleToIndex = function (indices, index, list) {
            // assumes indices is sorted low to high and continuous
            // NOTE might need to generalize it
            var blockStart = indices[0];
            var blockEnd = indices[indices.length - 1];
            // if moving to left
            if (blockStart > index) {
                var block = list.splice(blockStart, blockEnd - blockStart + 1);
                list.splice.apply(list, [index, 0].concat(block));
            }
            else {
                // if moving to right
                var block = list.slice(blockStart, blockEnd + 1);
                list.splice.apply(list, [index + 1, 0].concat(block));
                list.splice(blockStart, blockEnd - blockStart + 1);
            }
        };
        AITableModel.prototype.tabularToNested = function (headerRow, availableHeaderItems, 
        // This allows us to walk the leaves as if they were in a list from left to right.
        // We need to pass by reference so that we can update this value from within the recursion.
        leafIndexRef, rowIndex) {
            var _this = this;
            if (headerRow === void 0) { headerRow = []; }
            if (availableHeaderItems === void 0) { availableHeaderItems = []; }
            if (leafIndexRef === void 0) { leafIndexRef = { current: 0 }; }
            if (rowIndex === void 0) { rowIndex = 0; }
            if (!headerRow.length && rowIndex === 0) {
                headerRow = this.header[0];
            }
            if (!availableHeaderItems.length) {
                availableHeaderItems = this.header.map(function (headerRow) { return headerRow.filter(function (headerItem) { return headerItem !== null; }); });
            }
            return headerRow
                .filter(function (headerItem) { return headerItem !== null; })
                .map(function (headerItem, i) {
                var colSpan = (headerItem === null || headerItem === void 0 ? void 0 : headerItem.colSpan) || 1;
                var rowSpan = (headerItem === null || headerItem === void 0 ? void 0 : headerItem.rowSpan) || 1;
                // Leaf
                if (rowIndex + rowSpan >= _this.header.length) {
                    var leafIndex = leafIndexRef.current;
                    leafIndexRef.current += colSpan;
                    return {
                        headerItem: headerItem,
                        leafIndex: leafIndex,
                        rowIndex: rowIndex,
                        children: [],
                    };
                }
                var spaceLeft = colSpan;
                var availableChildren = availableHeaderItems[rowIndex + rowSpan];
                var children = [];
                while (spaceLeft > 0 && availableChildren.length) {
                    var nextChild = availableChildren.shift();
                    spaceLeft -= (nextChild === null || nextChild === void 0 ? void 0 : nextChild.colSpan) || 1;
                    children.push(nextChild);
                }
                return {
                    headerItem: headerItem,
                    leafIndex: -1,
                    rowIndex: rowIndex,
                    children: _this.tabularToNested(children, availableHeaderItems, leafIndexRef, rowIndex + rowSpan),
                };
            });
        };
        AITableModel.prototype.nestedToTabular = function (nested, header, data, rowIndex) {
            var _this = this;
            if (header === void 0) { header = new Array(this.header.length).fill([]); }
            if (data === void 0) { data = new Array(this._data.length).fill([]); }
            if (rowIndex === void 0) { rowIndex = 0; }
            nested.forEach(function (headerObj) {
                var _a, _b;
                var rowSpan = ((_a = headerObj.headerItem) === null || _a === void 0 ? void 0 : _a.rowSpan) || 1;
                var colSpan = ((_b = headerObj.headerItem) === null || _b === void 0 ? void 0 : _b.colSpan) || 1;
                header[rowIndex] = __spread(header[rowIndex], [headerObj.headerItem]);
                if (headerObj.leafIndex >= 0) {
                    for (var i = 0; i < data.length; i++) {
                        data[i] = __spread(data[i], _this._data[i].slice(headerObj.leafIndex, headerObj.leafIndex + colSpan));
                    }
                }
                if (rowIndex + rowSpan >= _this.header.length) {
                    return;
                }
                var children = headerObj.children;
                _this.nestedToTabular(children, header, data, rowIndex + rowSpan);
            });
            return {
                header: header,
                data: data,
            };
        };
        /**
         * Move `nested` element at `rowIndex` with index `indexFrom` to `indexTo`.
         */
        AITableModel.prototype.moveNested = function (nested, indexFrom, indexTo, rowIndex, startingChildIndex) {
            var _this = this;
            if (rowIndex === void 0) { rowIndex = 0; }
            if (startingChildIndex === void 0) { startingChildIndex = 0; }
            if (!nested.length) {
                return;
            }
            var currentRowIndex = nested[0].rowIndex;
            if (currentRowIndex === rowIndex &&
                startingChildIndex <= indexFrom &&
                startingChildIndex + nested.length >= indexFrom &&
                startingChildIndex <= indexTo &&
                startingChildIndex + nested.length >= indexTo) {
                this.moveMultipleToIndex([indexFrom - startingChildIndex], indexTo - startingChildIndex, nested);
                return;
            }
            nested.forEach(function (headerObj, i) {
                var _a, _b, _c;
                var rowSpan = ((_a = headerObj.headerItem) === null || _a === void 0 ? void 0 : _a.rowSpan) || 1;
                var children = headerObj.children;
                _this.moveNested(children, indexFrom, indexTo, rowIndex, (_b = _this.header[currentRowIndex + rowSpan]) === null || _b === void 0 ? void 0 : _b.indexOf((_c = children[0]) === null || _c === void 0 ? void 0 : _c.headerItem));
            });
        };
        return AITableModel;
    }());
    /**
     * The number of models instantiated, used for (among other things) unique id generation
     */
    AITableModel.COUNT = 0;

    /**
     * Generated bundle index. Do not edit.
     */

    exports.AITableBody = AITableBody;
    exports.AITableComponent = AITableComponent;
    exports.AITableHeadCell = AITableHeadCell;
    exports.AITableHeadComponent = AITableHeadComponent;
    exports.AITableHeaderItem = AITableHeaderItem;
    exports.AITableModel = AITableModel;
    exports.AITableModule = AITableModule;
    exports.AITableRowComponent = AITableRowComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular-table.umd.js.map
