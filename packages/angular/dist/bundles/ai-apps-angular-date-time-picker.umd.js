/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-date-time-picker.umd.js
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
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('carbon-components-angular'), require('date-fns'), require('flatpickr/dist/l10n/index'), require('carbon-components-angular/i18n'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('@ai-apps/angular/date-time-picker', ['exports', '@angular/common', '@angular/core', 'carbon-components-angular', 'date-fns', 'flatpickr/dist/l10n/index', 'carbon-components-angular/i18n', '@angular/forms'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = global["ai-apps"].angular || {}, global["ai-apps"].angular["date-time-picker"] = {}), global.ng.common, global.ng.core, global.carbonComponentsAngular, global.dateFns, global.languages, global.i18n, global.ng.forms));
})(this, (function (exports, common, core, carbonComponentsAngular, dateFns, languages, i18n, forms) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var languages__namespace = /*#__PURE__*/_interopNamespace(languages);

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

    var getEndDate = function (relativeTo, relativeToOptions) {
        var _b = __read(relativeTo, 2), relativeToLabel = _b[0], relativeTime = _b[1];
        var _c = __read(relativeTime.split(':'), 2), hourStr = _c[0], minStr = _c[1];
        var hour = parseInt(hourStr, 10);
        var min = parseInt(minStr, 10);
        var numOfDays = relativeToOptions.filter(function (option) { return option.key === relativeToLabel; })[0].value;
        // numOfDays < 0 for past, numOfDays == 0 for today, numOfDays > 0 for future
        if (numOfDays < 0) {
            var pastDays = Math.abs(numOfDays);
            return dateFns.setMinutes(dateFns.setHours(dateFns.subDays(new Date(), pastDays), hour), min);
        }
        return dateFns.setMinutes(dateFns.setHours(dateFns.addDays(new Date(), numOfDays), hour), min);
    };
    var getRangeFromRelative = function (relativeConfig, relativeToOptions) {
        var _b = __read(relativeConfig.last, 2), valueToSubtract = _b[0], valueRange = _b[1];
        var endDate = getEndDate(relativeConfig.relativeTo, relativeToOptions);
        var timeToSub = {
            years: 0,
            months: 0,
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
        timeToSub[valueRange.toLowerCase()] = valueToSubtract;
        var startDate = dateFns.sub(endDate, timeToSub);
        return [startDate, endDate];
    };
    var DateTimeRelativeComponent = /** @class */ (function () {
        function DateTimeRelativeComponent() {
            this.value = null;
            this.valueChange = new core.EventEmitter();
            this.timeToSubtract = 0;
            this.timeRange = 'MINUTES';
            this.relativeTo = 'YESTERDAY';
            this.relativeTime = '00:00';
        }
        DateTimeRelativeComponent.prototype.ngOnChanges = function (changes) {
            var _a;
            if ((_a = changes === null || changes === void 0 ? void 0 : changes.value) === null || _a === void 0 ? void 0 : _a.currentValue) {
                var _b = __read(changes.value.currentValue, 3), start = _b[0], end = _b[1], relativeConfig = _b[2];
                if (!relativeConfig) {
                    return;
                }
                var _c = __read(relativeConfig.last, 2), value = _c[0], valueRange = _c[1];
                var _d = __read(relativeConfig.relativeTo, 2), relativeTo = _d[0], time = _d[1];
                this.timeRange = valueRange;
                this.timeToSubtract = value;
                this.relativeTo = relativeTo;
                this.relativeTime = time;
            }
        };
        DateTimeRelativeComponent.prototype.onChange = function () {
            var _this = this;
            setTimeout(function () {
                var relativeConfig = {
                    last: [_this.timeToSubtract, _this.timeRange],
                    relativeTo: [_this.relativeTo, _this.relativeTime],
                };
                var dates = getRangeFromRelative(relativeConfig, _this.relativeToOptions);
                var range = __spread(dates, [relativeConfig]);
                _this.valueChange.emit(range);
            });
        };
        return DateTimeRelativeComponent;
    }());
    DateTimeRelativeComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-date-time-relative',
                    template: "\n    <fieldset class=\"bx--fieldset iot--date-time-picker__menu-formgroup\">\n      <legend class=\"bx--label\">{{ batchText.LAST }}</legend>\n      <div class=\"iot--date-time-picker__fields-wrapper\">\n        <ibm-number\n          [min]=\"0\"\n          [step]=\"1\"\n          [(ngModel)]=\"timeToSubtract\"\n          (change)=\"onChange()\"\n          theme=\"light\"\n        ></ibm-number>\n        <ibm-select\n          class=\"bx--form-item\"\n          [(ngModel)]=\"timeRange\"\n          (valueChange)=\"onChange()\"\n          theme=\"light\"\n        >\n          <option value=\"MINUTES\">{{ batchText.MINUTES }}</option>\n          <option value=\"HOURS\">{{ batchText.HOURS }}</option>\n          <option value=\"DAYS\">{{ batchText.DAYS }}</option>\n          <option value=\"WEEKS\">{{ batchText.WEEKS }}</option>\n          <option value=\"MONTHS\">{{ batchText.MONTHS }}</option>\n          <option value=\"YEARS\">{{ batchText.YEARS }}</option>\n        </ibm-select>\n      </div>\n    </fieldset>\n    <fieldset class=\"bx--fieldset iot--date-time-picker__menu-formgroup\">\n      <legend class=\"bx--label\">{{ batchText.RELATIVE_TO }}</legend>\n      <div class=\"iot--date-time-picker__fields-wrapper\">\n        <ibm-select\n          class=\"bx--form-item iot--date-time-relative-to__select\"\n          [(ngModel)]=\"relativeTo\"\n          (valueChange)=\"onChange()\"\n          theme=\"light\"\n        >\n          <option\n            *ngFor=\"let option of relativeToOptions; let i = index\"\n            [value]=\"option.key\"\n            [selected]=\"i === 0\"\n          >\n            {{ option.label }}\n          </option>\n        </ibm-select>\n        <!-- tmp until we can implement a better time selector -->\n        <div class=\"bx--form-item\">\n          <input\n            ibmText\n            type=\"time\"\n            [(ngModel)]=\"relativeTime\"\n            (change)=\"onChange()\"\n            theme=\"light\"\n          />\n        </div>\n      </div>\n    </fieldset>\n  ",
                    styles: ["\n      /* tmp hack until carbon-components-angular has the updated number input */\n      ::ng-deep .bx--number__input-wrapper input {\n        min-width: 0px !important;\n        padding-right: 0px !important;\n      }\n    "]
                },] }
    ];
    DateTimeRelativeComponent.propDecorators = {
        value: [{ type: core.Input }],
        batchText: [{ type: core.Input }],
        relativeToOptions: [{ type: core.Input }],
        valueChange: [{ type: core.Output }]
    };

    var DateTimePickerComponent = /** @class */ (function () {
        function DateTimePickerComponent(elementRef, i18n) {
            this.elementRef = elementRef;
            this.i18n = i18n;
            this.wrapper = true;
            this.dateTimeRanges = [
                {
                    key: 'LAST_30_MINUTES',
                    description: 'Last 30 minutes',
                    getRange: function () {
                        var now = new Date();
                        var previous = dateFns.subMinutes(now, 30);
                        return [previous, now];
                    },
                },
                {
                    key: 'LAST_1_HOUR',
                    description: 'Last 1 hour',
                    getRange: function () {
                        var now = new Date();
                        var previous = dateFns.subHours(now, 1);
                        return [previous, now];
                    },
                },
                {
                    key: 'LAST_6_HOURS',
                    description: 'Last 6 hours',
                    getRange: function () {
                        var now = new Date();
                        var previous = dateFns.subHours(now, 6);
                        return [previous, now];
                    },
                },
                {
                    key: 'LAST_12_HOURS',
                    description: 'Last 12 hours',
                    getRange: function () {
                        var now = new Date();
                        var previous = dateFns.subHours(now, 12);
                        return [previous, now];
                    },
                },
                {
                    key: 'LAST_24_HOURS',
                    description: 'Last 24 hours',
                    getRange: function () {
                        var now = new Date();
                        var previous = dateFns.subHours(now, 24);
                        return [previous, now];
                    },
                },
            ];
            /**
             * Language of the flatpickr calendar.
             *
             * For reference of the possible locales:
             * https://github.com/flatpickr/flatpickr/blob/master/src/l10n/index.ts
             */
            this.language = 'en';
            this.selected = null;
            this.hasRelative = true;
            this.hasAbsolute = true;
            this.theme = null;
            this.placeholder = 'yyyy-mm-dd HH:mm';
            this.dateFormat = 'yyyy-MM-dd';
            this.batchText = {
                ABSOLUTE: 'Absolute',
                RELATIVE: 'Relative',
                CUSTOM_RANGE: 'Custom Range',
                RELATIVE_TO: 'Relative to',
                START_DATE: 'Start date',
                END_DATE: 'End date',
                START_TIME: 'Start time',
                END_TIME: 'End time',
                LAST: 'Last',
                CANCEL: 'Cancel',
                APPLY: 'Apply',
                BACK: 'back',
                NOW: 'Now',
                YESTERDAY: 'Yesterday',
                YEARS: 'years',
                MONTHS: 'months',
                WEEKS: 'weeks',
                DAYS: 'days',
                HOURS: 'hours',
                MINUTES: 'minutes',
                RANGE_SEPARATOR: 'to',
            };
            this.relativeToOptions = [
                {
                    key: 'YESTERDAY',
                    label: 'Yesterday',
                    value: -1,
                },
                {
                    key: 'TODAY',
                    label: 'Today',
                    value: 0,
                },
            ];
            this.selectedChange = new core.EventEmitter();
            this.apply = new core.EventEmitter();
            this.cancel = new core.EventEmitter();
            // contains the selection from before a custom selection was made (to handle the "back" case)
            this.previousSelection = null;
            this.selectingCustomRange = false;
            this.expanded = false;
            this.disabled = false;
            this.timeFormat = 'HH:mm';
            this.datePickerFormat = 'Y-m-d';
        }
        Object.defineProperty(DateTimePickerComponent.prototype, "tooltipOffset", {
            get: function () {
                return { x: 0, y: 4 };
            },
            enumerable: false,
            configurable: true
        });
        DateTimePickerComponent.prototype.ngOnChanges = function (changes) {
            var _a;
            if ((_a = changes === null || changes === void 0 ? void 0 : changes.selected) === null || _a === void 0 ? void 0 : _a.currentValue) {
                var _b = __read(changes.selected.currentValue, 1), type = _b[0];
                if (type === 'RELATIVE' || type === 'ABSOLUTE') {
                    this.selectingCustomRange = true;
                }
            }
        };
        DateTimePickerComponent.prototype.ngOnInit = function () {
            if (!this.selected) {
                this.selected = [null];
                this.disabled = true;
            }
            this.previousSelection = this.selected;
            this.updateI18nTranslationString();
            this.updateAbsoluteDateFormat();
        };
        DateTimePickerComponent.prototype.updateAbsoluteDateFormat = function () {
            // convert current dateFormat to proper format for absolute date picker
            var formatCharacters = this.dateFormat.split('');
            var newDateFormat = formatCharacters
                .filter(function (char, i) { return i === 0 || formatCharacters[i] !== formatCharacters[i - 1]; })
                .join('');
            this.datePickerFormat = newDateFormat.replace('y', 'Y').replace('M', 'm');
        };
        DateTimePickerComponent.prototype.updateI18nTranslationString = function () {
            this.i18n.setLocale(this.language, languages__namespace.default[this.language]);
        };
        DateTimePickerComponent.prototype.formatCurrentRangeTitle = function () {
            var _b = __read(this.selected, 1), rangeOrType = _b[0];
            if (!rangeOrType) {
                return this.placeholder;
            }
            else if (rangeOrType === 'RELATIVE' || rangeOrType === 'ABSOLUTE') {
                return this.formatCustomRange();
            }
            var range = this.dateTimeRanges.find(function (range) { return range.key === rangeOrType; });
            return range.description;
        };
        DateTimePickerComponent.prototype.formatCurrentRange = function () {
            var _b = __read(this.selected, 1), rangeOrType = _b[0];
            if (!rangeOrType) {
                return this.placeholder;
            }
            else if (rangeOrType === 'RELATIVE' || rangeOrType === 'ABSOLUTE') {
                return this.formatCustomRange();
            }
            var range = this.dateTimeRanges.find(function (range) { return range.key === rangeOrType; });
            var _c = __read(range.getRange(), 2), start = _c[0], end = _c[1];
            // TODO: provide a way to customize this for g11n
            var formatString = this.dateFormat + " " + this.timeFormat;
            var endFormatted = dateFns.format(end, formatString);
            if (dateFns.isThisMinute(end)) {
                endFormatted = this.batchText.NOW;
            }
            return dateFns.format(start, formatString) + " " + this.batchText.RANGE_SEPARATOR + " " + endFormatted;
        };
        DateTimePickerComponent.prototype.formatCustomRange = function () {
            // TODO: provide a way to customize this for g11n
            var formatString = this.dateFormat + " " + this.timeFormat;
            var _b = __read(this.selected, 4), type = _b[0], start = _b[1], end = _b[2], relativeConfig = _b[3];
            if (type === 'ABSOLUTE') {
                return dateFns.format(start, formatString) + " " + this.batchText.RANGE_SEPARATOR + " " + dateFns.format(end, formatString);
            }
            else if (type === 'RELATIVE') {
                var _c = __read(getRangeFromRelative(relativeConfig, this.relativeToOptions), 2), start_1 = _c[0], end_1 = _c[1];
                return dateFns.format(start_1, formatString) + " " + this.batchText.RANGE_SEPARATOR + " " + dateFns.format(end_1, formatString);
            }
        };
        DateTimePickerComponent.prototype.selectPresetRange = function (range) {
            // set the selected value so the view updates
            this.selected = [range.key];
        };
        DateTimePickerComponent.prototype.rangeChange = function (change) {
            // store the previous selection if we don't have one yet
            if (!this.previousSelection) {
                this.previousSelection = this.selected;
            }
            this.selected = change;
        };
        DateTimePickerComponent.prototype.onBack = function () {
            this.selectingCustomRange = false;
        };
        DateTimePickerComponent.prototype.onApply = function () {
            var _b = __read(this.selected, 3), rangeOrType = _b[0], start = _b[1], end = _b[2];
            if (this.selectingCustomRange) {
                this.apply.emit([start, end]);
                this.selectedChange.emit(this.selected);
            }
            else {
                // emit the date range
                var range = this.dateTimeRanges.find(function (range) { return range.key === rangeOrType; });
                this.selected = __spread([range.key], range.getRange());
                this.selectedChange.emit(this.selected);
                this.apply.emit(range.getRange());
            }
            this.previousSelection = this.selected;
            this.expanded = false;
            this.disabled = false;
        };
        DateTimePickerComponent.prototype.onCancel = function () {
            this.selected = this.previousSelection;
            this.cancel.emit();
            this.expanded = false;
        };
        DateTimePickerComponent.prototype.navigateList = function (event) {
            var target = event.target;
            switch (event.key) {
                case 'ArrowUp': {
                    var prev = target.previousElementSibling;
                    if (prev === null || prev === void 0 ? void 0 : prev.hasAttribute('tabindex')) {
                        target.tabIndex = -1;
                        prev.tabIndex = 0;
                        prev.focus();
                    }
                    break;
                }
                case 'ArrowDown': {
                    var next = target.nextElementSibling;
                    if (next === null || next === void 0 ? void 0 : next.hasAttribute('tabindex')) {
                        target.tabIndex = -1;
                        next.tabIndex = 0;
                        next.focus();
                    }
                    break;
                }
            }
        };
        DateTimePickerComponent.prototype.togglePicker = function () {
            this.expanded = !this.expanded;
            if (this.expanded) {
                var nativeElement = this.elementRef.nativeElement;
                var selected_1 = nativeElement.querySelector('.iot--date-time-picker__listitem--preset-selected');
                if (selected_1) {
                    setTimeout(function () { return selected_1.focus(); });
                }
            }
        };
        return DateTimePickerComponent;
    }());
    DateTimePickerComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-date-time-picker',
                    template: "\n    <div\n      class=\"iot--date-time-picker__box\"\n      [ngClass]=\"{\n        'iot--date-time-picker__box--light': theme === 'light'\n      }\"\n    >\n      <div\n        class=\"iot--date-time-picker__field\"\n        (click)=\"togglePicker()\"\n        (keydown.enter)=\"togglePicker()\"\n        (keydown.space)=\"togglePicker()\"\n        [ibmTooltip]=\"formatCurrentRange()\"\n        [offset]=\"tooltipOffset\"\n        [disabled]=\"disabled\"\n        trigger=\"hover\"\n        placement=\"bottom\"\n        role=\"button\"\n        tabindex=\"0\"\n      >\n        <span [title]=\"formatCurrentRangeTitle()\">{{ formatCurrentRangeTitle() }}</span>\n        <svg ibmIcon=\"calendar\" size=\"16\" class=\"iot--date-time-picker__icon\"></svg>\n      </div>\n      <div\n        class=\"iot--date-time-picker__menu\"\n        [ngClass]=\"{\n          'iot--date-time-picker__menu-expanded': expanded\n        }\"\n        role=\"listbox\"\n      >\n        <div class=\"iot--date-time-picker__menu-scroll\">\n          <!-- root view -->\n          <ol\n            *ngIf=\"!selectingCustomRange\"\n            (keyup)=\"navigateList($event)\"\n            class=\"bx--list--ordered\"\n          >\n            <li\n              class=\"bx--list__item iot--date-time-picker__listitem iot--date-time-picker__listitem--current\"\n            >\n              {{ formatCurrentRange() }}\n            </li>\n            <li\n              *ngIf=\"hasRelative || hasAbsolute\"\n              (click)=\"selectingCustomRange = true\"\n              class=\"bx--list__item iot--date-time-picker__listitem iot--date-time-picker__listitem--custom\"\n              tabindex=\"-1\"\n            >\n              {{ batchText.CUSTOM_RANGE }}\n            </li>\n            <li\n              *ngFor=\"let range of dateTimeRanges\"\n              class=\"bx--list__item iot--date-time-picker__listitem iot--date-time-picker__listitem--preset\"\n              (click)=\"selectPresetRange(range)\"\n              (keyup.space)=\"selectPresetRange(range)\"\n              (keyup.enter)=\"selectPresetRange(range)\"\n              [attr.tabindex]=\"selected[0] === range.key ? 0 : -1\"\n              [ngClass]=\"{\n                'iot--date-time-picker__listitem--preset-selected': selected[0] === range.key\n              }\"\n            >\n              {{ range.description }}\n            </li>\n          </ol>\n          <!-- custom relative/absolute -->\n          <ai-custom-date-time\n            *ngIf=\"selectingCustomRange\"\n            (rangeChange)=\"rangeChange($event)\"\n            [range]=\"selected\"\n            [hasRelative]=\"hasRelative\"\n            [hasAbsolute]=\"hasAbsolute\"\n            [dateFormat]=\"dateFormat\"\n            [datePickerFormat]=\"datePickerFormat\"\n            [placeholder]=\"dateFormat.toLowerCase()\"\n            [flatpickrOptions]=\"flatpickrOptions\"\n            [batchText]=\"batchText\"\n            [relativeToOptions]=\"relativeToOptions\"\n          ></ai-custom-date-time>\n        </div>\n        <div class=\"iot--date-time-picker__menu-btn-set\">\n          <button\n            *ngIf=\"selectingCustomRange\"\n            (click)=\"onBack()\"\n            ibmButton=\"secondary\"\n            class=\"iot--date-time-picker__menu-btn iot--date-time-picker__menu-btn-cancel\"\n            type=\"button\"\n            size=\"field\"\n          >\n            {{ batchText.BACK }}\n          </button>\n          <button\n            *ngIf=\"!selectingCustomRange\"\n            ibmButton=\"secondary\"\n            (click)=\"onCancel()\"\n            class=\"iot--date-time-picker__menu-btn iot--date-time-picker__menu-btn-cancel\"\n            type=\"button\"\n            size=\"field\"\n          >\n            {{ batchText.CANCEL }}\n          </button>\n          <button\n            ibmButton=\"primary\"\n            (click)=\"onApply()\"\n            class=\"iot--date-time-picker__menu-btn iot--date-time-picker__menu-btn-apply\"\n            type=\"button\"\n            size=\"field\"\n          >\n            {{ batchText.APPLY }}\n          </button>\n        </div>\n      </div>\n    </div>\n  ",
                    styles: ["\n      :host {\n        display: block;\n      }\n\n      /* fix for tooltip trigger styles forcing a 1rem font size (???) */\n      .iot--date-time-picker__box {\n        font-size: inherit;\n      }\n    "]
                },] }
    ];
    DateTimePickerComponent.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: i18n.I18n }
    ]; };
    DateTimePickerComponent.propDecorators = {
        wrapper: [{ type: core.HostBinding, args: ['class.iot--date-time-picker__wrapper',] }],
        dateTimeRanges: [{ type: core.Input }],
        language: [{ type: core.Input }],
        selected: [{ type: core.Input }],
        hasRelative: [{ type: core.Input }],
        hasAbsolute: [{ type: core.Input }],
        theme: [{ type: core.Input }],
        placeholder: [{ type: core.Input }],
        dateFormat: [{ type: core.Input }],
        flatpickrOptions: [{ type: core.Input }],
        batchText: [{ type: core.Input }],
        relativeToOptions: [{ type: core.Input }],
        selectedChange: [{ type: core.Output }],
        apply: [{ type: core.Output }],
        cancel: [{ type: core.Output }]
    };

    var CustomDateTimeComponent = /** @class */ (function () {
        function CustomDateTimeComponent() {
            this.mode = 'relative';
            this.value = [];
            this.range = null;
            this.hasRelative = true;
            this.hasAbsolute = true;
            /**
             * Format of date
             *
             * For reference: https://flatpickr.js.org/formatting/
             */
            this.dateFormat = 'yyyy-MM-dd';
            this.datePickerFormat = 'Y-m-d';
            this.placeholder = 'yyyy-mm-dd';
            this.rangeChange = new core.EventEmitter();
            this.wrapperClass = true;
        }
        CustomDateTimeComponent.prototype.ngOnChanges = function (changes) {
            var _a, _b, _c;
            if ((_a = changes === null || changes === void 0 ? void 0 : changes.range) === null || _a === void 0 ? void 0 : _a.currentValue) {
                var _d = __read(changes.range.currentValue, 4), type = _d[0], start = _d[1], end = _d[2], relativeConfig = _d[3];
                if (type === 'RELATIVE') {
                    this.mode = 'relative';
                    this.value = [start, end, relativeConfig];
                }
                if (type === 'ABSOLUTE') {
                    this.mode = 'absolute';
                    this.value = [start, end];
                }
            }
            if (((_b = changes === null || changes === void 0 ? void 0 : changes.hasRelative) === null || _b === void 0 ? void 0 : _b.currentValue) === false) {
                this.mode = 'absolute';
            }
            if (((_c = changes === null || changes === void 0 ? void 0 : changes.hasAbsolute) === null || _c === void 0 ? void 0 : _c.currentValue) === false) {
                this.mode = 'relative';
            }
        };
        CustomDateTimeComponent.prototype.relativeChange = function (change) {
            this.rangeChange.emit(__spread(['RELATIVE'], change));
        };
        CustomDateTimeComponent.prototype.absoluteChange = function (change) {
            this.rangeChange.emit(__spread(['ABSOLUTE'], change));
        };
        return CustomDateTimeComponent;
    }());
    CustomDateTimeComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-custom-date-time',
                    template: "\n    <div class=\"bx--form-item\" *ngIf=\"hasRelative && hasAbsolute\">\n      <fieldset class=\"bx--fieldset\">\n        <legend class=\"bx--label\">{{ batchText.CUSTOM_RANGE }}</legend>\n        <ibm-radio-group [(ngModel)]=\"mode\">\n          <ibm-radio value=\"relative\">{{ batchText.RELATIVE }}</ibm-radio>\n          <ibm-radio value=\"absolute\">{{ batchText.ABSOLUTE }}</ibm-radio>\n        </ibm-radio-group>\n      </fieldset>\n    </div>\n    <!-- relative picker -->\n    <ai-date-time-relative\n      *ngIf=\"mode === 'relative' && hasRelative\"\n      (valueChange)=\"relativeChange($event)\"\n      [value]=\"value\"\n      [batchText]=\"batchText\"\n      [relativeToOptions]=\"relativeToOptions\"\n    >\n    </ai-date-time-relative>\n    <ai-date-time-absolute\n      *ngIf=\"mode === 'absolute' && hasAbsolute\"\n      (valueChange)=\"absoluteChange($event)\"\n      [value]=\"value\"\n      [batchText]=\"batchText\"\n      [dateFormat]=\"dateFormat\"\n      [datePickerFormat]=\"datePickerFormat\"\n      [placeholder]=\"placeholder\"\n      [flatpickrOptions]=\"flatpickrOptions\"\n    >\n    </ai-date-time-absolute>\n  ",
                    styles: ["\n      :host {\n        display: block;\n      }\n    "]
                },] }
    ];
    CustomDateTimeComponent.propDecorators = {
        range: [{ type: core.Input }],
        hasRelative: [{ type: core.Input }],
        hasAbsolute: [{ type: core.Input }],
        batchText: [{ type: core.Input }],
        dateFormat: [{ type: core.Input }],
        datePickerFormat: [{ type: core.Input }],
        placeholder: [{ type: core.Input }],
        relativeToOptions: [{ type: core.Input }],
        flatpickrOptions: [{ type: core.Input }],
        rangeChange: [{ type: core.Output }],
        wrapperClass: [{ type: core.HostBinding, args: ['class.iot--date-time-picker__custom-wrapper',] }]
    };

    var DateTimeAbsoluteComponent = /** @class */ (function () {
        function DateTimeAbsoluteComponent() {
            this.startTime = '00:00';
            this.endTime = '23:59';
            this.dateRange = null;
            this.value = [];
            this.dateFormat = 'yyyy-MM-dd';
            this.datePickerFormat = 'Y-m-d';
            this.placeholder = 'yyyy-mm-dd';
            this.valueChange = new core.EventEmitter();
        }
        DateTimeAbsoluteComponent.prototype.ngOnInit = function () {
            // if dateRange is not null (e.g. switch from relative range)
            if (this.dateRange) {
                var _b = __read(this.dateRange, 2), startDate = _b[0], endDate = _b[1];
                startDate = dateFns.format(startDate, this.dateFormat);
                endDate = dateFns.format(endDate, this.dateFormat);
                this.dateRange = [startDate, endDate];
            }
        };
        DateTimeAbsoluteComponent.prototype.ngOnChanges = function (changes) {
            var _a;
            if ((_a = changes === null || changes === void 0 ? void 0 : changes.value) === null || _a === void 0 ? void 0 : _a.currentValue) {
                var _b = __read(changes.value.currentValue, 2), start = _b[0], end = _b[1];
                if (!start || !end) {
                    return;
                }
                this.dateRange = [start, end];
                var formatString = 'HH:mm';
                this.startTime = dateFns.format(start, formatString);
                this.endTime = dateFns.format(end, formatString);
            }
        };
        DateTimeAbsoluteComponent.prototype.onChange = function () {
            if (!this.dateRange) {
                return;
            }
            var _b = __read(this.startTime.split(':'), 2), startHourStr = _b[0], startMinStr = _b[1];
            var _c = __read(this.endTime.split(':'), 2), endHourStr = _c[0], endMinStr = _c[1];
            var startHour = parseInt(startHourStr, 10);
            var startMin = parseInt(startMinStr, 10);
            var endHour = parseInt(endHourStr, 10);
            var endMin = parseInt(endMinStr, 10);
            var _d = __read(this.dateRange, 2), startDate = _d[0], endDate = _d[1];
            var startDateTime = dateFns.setMinutes(dateFns.setHours(startDate, startHour), startMin);
            var endDateTime = dateFns.setMinutes(dateFns.setHours(endDate, endHour), endMin);
            this.valueChange.emit([startDateTime, endDateTime]);
        };
        return DateTimeAbsoluteComponent;
    }());
    DateTimeAbsoluteComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ai-date-time-absolute',
                    template: "\n    <fieldset class=\"bx--fieldset iot--date-time-picker__menu-formgroup\" style=\"padding: 0 0.9rem;\">\n      <div class=\"bx--form-item\">\n        <ibm-date-picker\n          [range]=\"true\"\n          [label]=\"batchText.START_DATE\"\n          [rangeLabel]=\"batchText.END_DATE\"\n          [dateFormat]=\"datePickerFormat\"\n          [(ngModel)]=\"dateRange\"\n          [placeholder]=\"placeholder\"\n          [flatpickrOptions]=\"flatpickrOptions\"\n          (valueChange)=\"onChange()\"\n          theme=\"light\"\n        >\n        </ibm-date-picker>\n      </div>\n    </fieldset>\n    <fieldset class=\"bx--fieldset iot--date-time-picker__menu-formgroup\">\n      <div class=\"iot--date-time-picker__fields-wrapper\">\n        <!-- tmp until we can implement a better time selector -->\n        <div class=\"bx--form-item\" style=\"margin-right: 1rem\">\n          <label class=\"bx--label\">{{ batchText.START_TIME }}</label>\n          <input ibmText type=\"time\" [(ngModel)]=\"startTime\" (change)=\"onChange()\" theme=\"light\" />\n        </div>\n        <!-- tmp until we can implement a better time selector -->\n        <div class=\"bx--form-item\">\n          <label class=\"bx--label\">{{ batchText.END_TIME }}</label>\n          <input ibmText type=\"time\" [(ngModel)]=\"endTime\" (change)=\"onChange()\" theme=\"light\" />\n        </div>\n      </div>\n    </fieldset>\n  ",
                    styles: ["\n      /*\n        all of this is a bunch of gross styling hacks until we can settle on a reasonable\n        UX decision for the range picker. By default react forces the picker open, which\n        totally breaks the interaction for re-selecting dates. We also need to fix the HTML\n        structure upstream as we can't apply the right spacing (easily) due to the duplication\n        of classes at multiple levels of the underlying datepicker.\n      */\n      ::ng-deep .iot--date-time-picker__wrapper .bx--date-picker-container {\n        opacity: 1;\n      }\n\n      ::ng-deep\n        .iot--date-time-picker__wrapper\n        .bx--date-picker--range\n        > .bx--date-picker-container:first-child {\n        margin-right: 0;\n      }\n\n      ::ng-deep .iot--date-time-picker__wrapper .bx--date-picker--range {\n        position: initial;\n      }\n\n      ::ng-deep .iot--date-time-picker__wrapper .bx--date-picker-input__wrapper {\n        max-width: 137px;\n      }\n\n      ::ng-deep .iot--date-time-picker__wrapper .bx--date-picker__input {\n        width: 100%;\n      }\n\n      /* we do this since there's only one level of ibm-date-picker-input. the other wrapper classes are duplicated */\n      ::ng-deep\n        .iot--date-time-picker__wrapper\n        .bx--date-picker--range\n        .bx--date-picker-container:first-child\n        ibm-date-picker-input {\n        margin-right: 16px;\n        width: 137px;\n      }\n    "]
                },] }
    ];
    DateTimeAbsoluteComponent.propDecorators = {
        value: [{ type: core.Input }],
        batchText: [{ type: core.Input }],
        dateFormat: [{ type: core.Input }],
        datePickerFormat: [{ type: core.Input }],
        placeholder: [{ type: core.Input }],
        flatpickrOptions: [{ type: core.Input }],
        valueChange: [{ type: core.Output }]
    };

    var DateTimePickerModule = /** @class */ (function () {
        function DateTimePickerModule() {
        }
        return DateTimePickerModule;
    }());
    DateTimePickerModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [
                        DateTimePickerComponent,
                        CustomDateTimeComponent,
                        DateTimeAbsoluteComponent,
                        DateTimeRelativeComponent,
                    ],
                    exports: [
                        DateTimePickerComponent,
                        CustomDateTimeComponent,
                        DateTimeAbsoluteComponent,
                        DateTimeRelativeComponent,
                    ],
                    imports: [
                        common.CommonModule,
                        forms.FormsModule,
                        carbonComponentsAngular.ButtonModule,
                        carbonComponentsAngular.RadioModule,
                        carbonComponentsAngular.SelectModule,
                        carbonComponentsAngular.NumberModule,
                        carbonComponentsAngular.TimePickerModule,
                        carbonComponentsAngular.TimePickerSelectModule,
                        carbonComponentsAngular.InputModule,
                        carbonComponentsAngular.DatePickerModule,
                        carbonComponentsAngular.I18nModule,
                        carbonComponentsAngular.IconModule,
                        carbonComponentsAngular.DialogModule,
                    ],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.CustomDateTimeComponent = CustomDateTimeComponent;
    exports.DateTimeAbsoluteComponent = DateTimeAbsoluteComponent;
    exports.DateTimePickerComponent = DateTimePickerComponent;
    exports.DateTimePickerModule = DateTimePickerModule;
    exports.DateTimeRelativeComponent = DateTimeRelativeComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular-date-time-picker.umd.js.map
