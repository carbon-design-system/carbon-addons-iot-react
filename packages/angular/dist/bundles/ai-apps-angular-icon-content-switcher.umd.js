/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-icon-content-switcher.umd.js
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
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('carbon-components-angular')) :
    typeof define === 'function' && define.amd ? define('@ai-apps/angular/icon-content-switcher', ['exports', '@angular/core', 'carbon-components-angular'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = global["ai-apps"].angular || {}, global["ai-apps"].angular["icon-content-switcher"] = {}), global.ng.core, global.carbonComponentsAngular));
})(this, (function (exports, core, carbonComponentsAngular) { 'use strict';

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
     * selector: `aiIconContentOption`
     */
    var IconContentSwitcherOption = /** @class */ (function (_super) {
        __extends(IconContentSwitcherOption, _super);
        function IconContentSwitcherOption() {
            var _this = _super.apply(this, __spread(arguments)) || this;
            _this.mainClass = "iot--icon-switch\n    bx--btn\n    bx--btn--secondary\n    bx--tooltip--hidden\n    bx--btn--icon-only\n    bx--tooltip__trigger\n    bx--tooltip--a11y\n    bx--btn--icon-only--top\n    bx--tooltip--align-center";
            _this.selectedClass = false;
            _this.size = 'md';
            _this.theme = 'dark';
            return _this;
        }
        Object.defineProperty(IconContentSwitcherOption.prototype, "unselectedClass", {
            get: function () {
                return !this.selectedClass;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(IconContentSwitcherOption.prototype, "isDefaultSize", {
            get: function () {
                return this.size === 'md';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(IconContentSwitcherOption.prototype, "isSmallSize", {
            get: function () {
                return this.size === 'sm';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(IconContentSwitcherOption.prototype, "isLargeSize", {
            get: function () {
                return this.size === 'lg';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(IconContentSwitcherOption.prototype, "isLight", {
            get: function () {
                return this.theme === 'light';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(IconContentSwitcherOption.prototype, "isUnselectedLight", {
            get: function () {
                return this.isLight && !this.selectedClass;
            },
            enumerable: false,
            configurable: true
        });
        return IconContentSwitcherOption;
    }(carbonComponentsAngular.ContentSwitcherOption));
    IconContentSwitcherOption.decorators = [
        { type: core.Directive, args: [{
                    selector: '[aiIconContentOption]',
                    exportAs: 'aiIconContentOption',
                },] }
    ];
    IconContentSwitcherOption.propDecorators = {
        mainClass: [{ type: core.HostBinding, args: ['class',] }],
        selectedClass: [{ type: core.HostBinding, args: ['class.iot--icon-switch--selected',] }, { type: core.HostBinding, args: ['class.bx--content-switcher--selected',] }],
        unselectedClass: [{ type: core.HostBinding, args: ['class.iot--icon-switch--unselected',] }],
        isDefaultSize: [{ type: core.HostBinding, args: ['class.iot--icon-switch--default',] }],
        isSmallSize: [{ type: core.HostBinding, args: ['class.iot--icon-switch--small',] }],
        isLargeSize: [{ type: core.HostBinding, args: ['class.iot--icon-switch--large',] }],
        isLight: [{ type: core.HostBinding, args: ['class.iot--icon-switch--light',] }],
        isUnselectedLight: [{ type: core.HostBinding, args: ['class.iot--icon-switch--unselected--light',] }],
        size: [{ type: core.Input }],
        theme: [{ type: core.Input }]
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
    var IconContentSwitcher = /** @class */ (function (_super) {
        __extends(IconContentSwitcher, _super);
        function IconContentSwitcher() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return IconContentSwitcher;
    }(carbonComponentsAngular.ContentSwitcher));
    IconContentSwitcher.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-content-switcher',
                    template: "\n    <div\n      [attr.aria-label]=\"ariaLabel\"\n      class=\"bx--content-switcher iot--content-switcher--icon\"\n      [class.bx--content-switcher--light]=\"theme === 'light'\"\n      role=\"tablist\"\n    >\n      <ng-content></ng-content>\n    </div>\n  "
                },] }
    ];
    IconContentSwitcher.propDecorators = {
        options: [{ type: core.ContentChildren, args: [IconContentSwitcherOption,] }]
    };

    // modules
    var IconContentSwitcherModule = /** @class */ (function () {
        function IconContentSwitcherModule() {
        }
        return IconContentSwitcherModule;
    }());
    IconContentSwitcherModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [IconContentSwitcher, IconContentSwitcherOption],
                    exports: [IconContentSwitcher, IconContentSwitcherOption],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.IconContentSwitcher = IconContentSwitcher;
    exports.IconContentSwitcherModule = IconContentSwitcherModule;
    exports.IconContentSwitcherOption = IconContentSwitcherOption;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular-icon-content-switcher.umd.js.map
