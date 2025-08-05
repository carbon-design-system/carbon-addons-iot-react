/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-rule-builder.umd.js
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
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('carbon-components-angular'), require('@angular/common'), require('carbon-components-angular/context-menu'), require('@carbon/icons/es/subtract/32'), require('@carbon/icons/es/add/32'), require('@carbon/icons/es/text--new-line/32'), require('@angular/forms')) :
  typeof define === 'function' && define.amd ? define('@ai-apps/angular/rule-builder', ['exports', '@angular/core', 'carbon-components-angular', '@angular/common', 'carbon-components-angular/context-menu', '@carbon/icons/es/subtract/32', '@carbon/icons/es/add/32', '@carbon/icons/es/text--new-line/32', '@angular/forms'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = global["ai-apps"].angular || {}, global["ai-apps"].angular["rule-builder"] = {}), global.ng.core, global.carbonComponentsAngular, global.ng.common, global.contextMenu, global.Subtract32, global.Add32, global.TextNewLine32, global.ng.forms));
})(this, (function (exports, core, carbonComponentsAngular, common, contextMenu, Subtract32, Add32, TextNewLine32, forms) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Subtract32__default = /*#__PURE__*/_interopDefaultLegacy(Subtract32);
  var Add32__default = /*#__PURE__*/_interopDefaultLegacy(Add32);
  var TextNewLine32__default = /*#__PURE__*/_interopDefaultLegacy(TextNewLine32);

  var RuleComponent = /** @class */ (function () {
      function RuleComponent(i18n) {
          this.i18n = i18n;
          this.columns = [];
          this.columnOperands = [];
          this.removeRuleLabel = '';
          this.addNewRuleLabel = '';
          this.addNewGroupLabel = '';
          this.ruleChange = new core.EventEmitter();
          this.removeRule = new core.EventEmitter();
          this.addRule = new core.EventEmitter();
      }
      Object.defineProperty(RuleComponent.prototype, "isRule", {
          get: function () {
              return this.rule && !this.rule.groupLogic && !Array.isArray(this.rule.rules);
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(RuleComponent.prototype, "isRuleGroup", {
          get: function () {
              return this.rule && this.rule.groupLogic && Array.isArray(this.rule.rules);
          },
          enumerable: false,
          configurable: true
      });
      RuleComponent.prototype.ngOnInit = function () {
          this.removeRuleLabel = this.removeRuleLabel || this.i18n.get().RULE_BUILDER.REMOVE_RULE;
          this.addNewRuleLabel = this.addNewRuleLabel || this.i18n.get().RULE_BUILDER.ADD_NEW_RULE;
          this.addNewGroupLabel = this.addNewGroupLabel || this.i18n.get().RULE_BUILDER.ADD_NEW_GROUP;
      };
      RuleComponent.prototype.hasTemplate = function () {
          var _this = this;
          var selectedColumn = this.columns.find(function (column) { return column.id === _this.rule.columnId; });
          return !!(selectedColumn === null || selectedColumn === void 0 ? void 0 : selectedColumn.valueTemplate);
      };
      RuleComponent.prototype.getTemplate = function () {
          var _this = this;
          var selectedColumn = this.columns.find(function (column) { return column.id === _this.rule.columnId; });
          return selectedColumn === null || selectedColumn === void 0 ? void 0 : selectedColumn.valueTemplate;
      };
      RuleComponent.prototype.getColumnOperands = function () {
          var _this = this;
          var selectedColumn = this.columns.find(function (column) { return column.id === _this.rule.columnId; });
          if (selectedColumn === null || selectedColumn === void 0 ? void 0 : selectedColumn.operands) {
              return selectedColumn.operands;
          }
          return this.columnOperands;
      };
      RuleComponent.prototype.getColumns = function () {
          // we cache this because adding operands throws a "circular" error from cca
          // and doing it on the fly makes ngModel not work
          if (!this.dropdownColumns) {
              this.dropdownColumns = this.columns.map(function (column) { return ({
                  content: column.content,
                  id: column.id,
                  selected: column.selected,
              }); });
          }
          return this.dropdownColumns;
      };
      return RuleComponent;
  }());
  RuleComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'ai-rule',
                  template: "\n    <ng-container *ngIf=\"isRuleGroup\">\n      <ai-rule-builder-group-logic [id]=\"rule.id\" [(selected)]=\"rule.groupLogic\">\n      </ai-rule-builder-group-logic>\n      <ng-container *ngFor=\"let r of rule.rules; let i = index\">\n        <ai-rule\n          (addRule)=\"addRule.emit($event)\"\n          (removeRule)=\"removeRule.emit($event)\"\n          [columns]=\"columns\"\n          [columnOperands]=\"columnOperands\"\n          [(rule)]=\"rule.rules[i]\"\n        ></ai-rule>\n      </ng-container>\n    </ng-container>\n    <ng-container *ngIf=\"isRule\">\n      <ibm-dropdown\n        theme=\"light\"\n        placeholder=\"Select a column\"\n        [(ngModel)]=\"rule.columnId\"\n        value=\"id\"\n      >\n        <ibm-dropdown-list [items]=\"getColumns()\"></ibm-dropdown-list>\n      </ibm-dropdown>\n      <ibm-dropdown\n        theme=\"light\"\n        placeholder=\"Select an operand\"\n        [(ngModel)]=\"rule.operand\"\n        value=\"id\"\n      >\n        <ibm-dropdown-list [items]=\"getColumnOperands()\"></ibm-dropdown-list>\n      </ibm-dropdown>\n      <input\n        *ngIf=\"!hasTemplate()\"\n        ibmText\n        theme=\"light\"\n        placeholder=\"Enter a value\"\n        [(ngModel)]=\"rule.value\"\n      />\n      <ng-template\n        *ngIf=\"hasTemplate()\"\n        [ngTemplateOutlet]=\"getTemplate()\"\n        [ngTemplateOutletContext]=\"{ $implicit: rule }\"\n      >\n      </ng-template>\n      <div class=\"iot--rule-builder-rule__actions\">\n        <button ibmButton=\"ghost\" [iconOnly]=\"true\" (click)=\"removeRule.emit(rule.id)\">\n          <svg class=\"bx--btn__icon\" ibmIcon=\"subtract\" size=\"32\"></svg>\n          <span class=\"bx--assistive-text\">{{ removeRuleLabel }}</span>\n        </button>\n        <button ibmButton=\"ghost\" [iconOnly]=\"true\" (click)=\"addRule.emit({ id: rule.id })\">\n          <svg class=\"bx--btn__icon\" ibmIcon=\"add\" size=\"32\"></svg>\n          <span class=\"bx--assistive-text\">{{ addNewRuleLabel }}</span>\n        </button>\n        <button\n          ibmButton=\"ghost\"\n          [iconOnly]=\"true\"\n          (click)=\"addRule.emit({ id: rule.id, isGroup: true })\"\n        >\n          <svg class=\"bx--btn__icon\" ibmIcon=\"text--new-line\" size=\"32\"></svg>\n          <span class=\"bx--assistive-text\">{{ addNewGroupLabel }}</span>\n        </button>\n      </div>\n    </ng-container>\n  "
              },] }
  ];
  RuleComponent.ctorParameters = function () { return [
      { type: carbonComponentsAngular.I18n }
  ]; };
  RuleComponent.propDecorators = {
      columns: [{ type: core.Input }],
      columnOperands: [{ type: core.Input }],
      removeRuleLabel: [{ type: core.Input }],
      addNewRuleLabel: [{ type: core.Input }],
      addNewGroupLabel: [{ type: core.Input }],
      rule: [{ type: core.Input }],
      ruleChange: [{ type: core.Output }],
      removeRule: [{ type: core.Output }],
      addRule: [{ type: core.Output }],
      isRule: [{ type: core.HostBinding, args: ['class.iot--rule-builder-rule',] }],
      isRuleGroup: [{ type: core.HostBinding, args: ['class.iot--rule-builder-rule--group',] }]
  };

  var RuleBuilderGroupLogicComponent = /** @class */ (function () {
      function RuleBuilderGroupLogicComponent(i18n) {
          this.i18n = i18n;
          /**
           * An array of options for the dropdown
           *
           * Each option is an object containing:
           *
           * `content` - the display value (you can use this for translation)
           * `id` - the value used for selection, should be either `'all'` or `'any'`
           * `selected` - set to `true` for the value selected by default ( by default it's `'all'`)
           */
          this.anyAll = [
              { content: 'ALL', id: 'all', selected: true },
              { content: 'ANY', id: 'any', selected: false },
          ];
          this.selected = 'all';
          this.ofTheFollowingLabel = '';
          this.selectedChange = new core.EventEmitter();
      }
      RuleBuilderGroupLogicComponent.prototype.ngOnInit = function () {
          this.ofTheFollowingLabel =
              this.ofTheFollowingLabel || this.i18n.get().RULE_BUILDER.OF_THE_FOLLOWING;
      };
      return RuleBuilderGroupLogicComponent;
  }());
  RuleBuilderGroupLogicComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'ai-rule-builder-group-logic',
                  template: "\n    <div class=\"iot--rule-builder-header__dropdown\">\n      <ibm-dropdown\n        theme=\"light\"\n        [ngModel]=\"selected\"\n        (ngModelChange)=\"selectedChange.emit($event)\"\n        value=\"id\"\n      >\n        <ibm-dropdown-list [items]=\"anyAll\"></ibm-dropdown-list>\n      </ibm-dropdown>\n    </div>\n\n    <span>{{ ofTheFollowingLabel }}</span>\n  "
              },] }
  ];
  RuleBuilderGroupLogicComponent.ctorParameters = function () { return [
      { type: carbonComponentsAngular.I18n }
  ]; };
  RuleBuilderGroupLogicComponent.propDecorators = {
      anyAll: [{ type: core.Input }],
      selected: [{ type: core.Input }],
      ofTheFollowingLabel: [{ type: core.Input }],
      selectedChange: [{ type: core.Output }]
  };

  var RuleBuilderHeaderComponent = /** @class */ (function () {
      function RuleBuilderHeaderComponent(i18n) {
          this.i18n = i18n;
          this.ruleClass = true;
          this.addRuleLabel = '';
          this.addNewRuleLabel = '';
          this.addGroupLabel = '';
          this.addNewGroupLabel = '';
          this.groupLogicChange = new core.EventEmitter();
          this.removeRule = new core.EventEmitter();
          this.addRule = new core.EventEmitter();
      }
      RuleBuilderHeaderComponent.prototype.ngOnInit = function () {
          this.addRuleLabel = this.addRuleLabel || this.i18n.get().RULE_BUILDER.ADD_RULE;
          this.addNewRuleLabel = this.addNewRuleLabel || this.i18n.get().RULE_BUILDER.ADD_NEW_RULE;
          this.addGroupLabel = this.addGroupLabel || this.i18n.get().RULE_BUILDER.ADD_GROUP;
          this.addNewGroupLabel = this.addNewGroupLabel || this.i18n.get().RULE_BUILDER.ADD_NEW_GROUP;
      };
      return RuleBuilderHeaderComponent;
  }());
  RuleBuilderHeaderComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'ai-rule-builder-header',
                  template: "\n    <ai-rule-builder-group-logic\n      [selected]=\"groupLogic\"\n      (selectedChange)=\"groupLogicChange.emit($event)\"\n    >\n    </ai-rule-builder-group-logic>\n    <div class=\"iot--rule-builder-header__buttons\">\n      <button ibmButton=\"ghost\" (click)=\"addRule.emit({})\">\n        {{ addRuleLabel }}\n        <svg class=\"bx--btn__icon\" ibmIcon=\"add\" size=\"32\"></svg>\n        <span class=\"bx--assistive-text\">{{ addNewRuleLabel }}</span>\n      </button>\n      <button ibmButton=\"ghost\" (click)=\"addRule.emit({ isGroup: true })\">\n        {{ addGroupLabel }}\n        <svg class=\"bx--btn__icon\" ibmIcon=\"text--new-line\" size=\"32\"></svg>\n        <span class=\"bx--assistive-text\">{{ addNewGroupLabel }}</span>\n      </button>\n    </div>\n  "
              },] }
  ];
  RuleBuilderHeaderComponent.ctorParameters = function () { return [
      { type: carbonComponentsAngular.I18n }
  ]; };
  RuleBuilderHeaderComponent.propDecorators = {
      ruleClass: [{ type: core.HostBinding, args: ['class.iot--rule-builder-header',] }],
      groupLogic: [{ type: core.Input }],
      addRuleLabel: [{ type: core.Input }],
      addNewRuleLabel: [{ type: core.Input }],
      addGroupLabel: [{ type: core.Input }],
      addNewGroupLabel: [{ type: core.Input }],
      groupLogicChange: [{ type: core.Output }],
      removeRule: [{ type: core.Output }],
      addRule: [{ type: core.Output }]
  };

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
   * RuleBuilder helper function to traverse the tree and find the indicies needed to create
   * a path to the given rule ID
   *
   * @param {array} arr The RuleBuilder tree rules array
   * @param {string} id The id of the rule to find in the tree
   * @param {array} parentIndex an array of ints storing the parent indices in the path
   */
  var findRulePathById = function (arr, id, parentIndex) {
      if (parentIndex === void 0) { parentIndex = []; }
      if (!Array.isArray(arr)) {
          return [];
      }
      return arr.reduce(function (i, rule, index) {
          if (Array.isArray(i) && i.length > 0) {
              return i;
          }
          if (rule.id === id) {
              return __spread(i, parentIndex, [index]);
          }
          if (rule.rules) {
              return findRulePathById(rule.rules, id, __spread(parentIndex, [index]));
          }
          return i;
      }, []);
  };
  /**
   * RuleBuilder helper function to filter a rule out of the tree by ID
   *
   * @param {array} arr The RuleBuilder tree rules
   * @param {string} id The ID of the rule to filter out of the tree
   */
  var filterRulesById = function (arr, id) {
      if (!Array.isArray(arr)) {
          return [];
      }
      return arr.reduce(function (carry, rule) {
          if (rule.rules && rule.rules.length) {
              var rules = filterRulesById(rule.rules, id);
              if (rules.length) {
                  return __spread(carry, [
                      Object.assign(Object.assign({}, rule), { rules: rules }),
                  ]);
              }
          }
          else if (rule.id !== id) {
              return __spread(carry, [rule]);
          }
          return carry;
      }, []);
  };
  /**
   * RuleBuilder helper function to insert a new rule into the tree after the given path
   *
   * @param {array} arr RuleBuilder tree rules
   * @param {object} rule The rule object to be inserted into the tree
   * @param {array} path The array of indicies making a path to the location after which the rule should be inserted
   */
  var insertRuleAfterPath = function (arr, rule, path) {
      if (!Array.isArray(path) || !Array.isArray(arr)) {
          return undefined;
      }
      var insertionPoint = path.pop() + 1;
      var current = arr;
      for (var i = 0; i < path.length; i += 1) {
          if (current[path[i]] && current[path[i]].rules) {
              current = current[path[i]].rules;
          }
          else {
              throw new Error('INVALID_PATH_FOR_RULE_TREE');
          }
      }
      current.splice(insertionPoint, 0, rule);
  };
  /**
   * Generates a new empty rule
   */
  var generateRule = function () {
      return {
          id: Math.random().toString(36).substring(2, 12).padStart(10, '0'),
          columnId: '',
          operand: '',
          value: '',
      };
  };
  /**
   * Generates a new rule group with one default rule
   */
  var generateRuleGroup = function () {
      return {
          id: Math.random().toString(36).substring(2, 12).padStart(10, '0'),
          groupLogic: 'all',
          rules: [generateRule()],
      };
  };

  var RuleBuilderComponent = /** @class */ (function () {
      function RuleBuilderComponent(i18n) {
          this.i18n = i18n;
          this.columns = [];
          this.columnOperands = [
              { content: 'Not equal', id: 'ne', selected: false },
              { content: 'Less than', id: 'lt', selected: false },
              { content: 'Less than or equal to', id: 'ltoet', selected: false },
              { content: 'Equals', id: 'eq', selected: false },
              { content: 'Greater than or equal to', id: 'gtoet', selected: false },
              { content: 'Greater than', id: 'gt', selected: false },
              { content: 'Contains', id: 'con', selected: false },
          ];
      }
      RuleBuilderComponent.prototype.ngOnInit = function () {
          this.updateI18nTranslationString();
      };
      RuleBuilderComponent.prototype.updateI18nTranslationString = function () {
          this.i18n.setLocale('en', {
              RULE_BUILDER: {
                  ADD_RULE: 'Add rule',
                  REMOVE_RULE: 'Remove rule',
                  ADD_NEW_RULE: 'Add new rule',
                  ADD_GROUP: 'Add group',
                  ADD_NEW_GROUP: 'Add new rule group',
                  OF_THE_FOLLOWING: 'of the following are true',
              },
          });
      };
      RuleBuilderComponent.prototype.handleAddRule = function (id, isGroup) {
          var generate = isGroup ? generateRuleGroup : generateRule;
          if (id) {
              var rulePath = findRulePathById(this.tree.rules, id);
              insertRuleAfterPath(this.tree.rules, generate(), rulePath);
              return;
          }
          this.tree.rules.push(generate());
      };
      RuleBuilderComponent.prototype.handleRemoveRule = function (id) {
          this.tree.rules = filterRulesById(this.tree.rules, id);
      };
      return RuleBuilderComponent;
  }());
  RuleBuilderComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'ai-rule-builder',
                  template: "\n    <div>\n      <ai-rule-builder-header\n        [(groupLogic)]=\"tree.groupLogic\"\n        (addRule)=\"handleAddRule($event.id, $event.isGroup)\"\n      ></ai-rule-builder-header>\n      <ng-container *ngFor=\"let rule of tree.rules; let i = index\">\n        <ai-rule\n          (addRule)=\"handleAddRule($event.id, $event.isGroup)\"\n          (removeRule)=\"handleRemoveRule($event)\"\n          [columns]=\"columns\"\n          [columnOperands]=\"columnOperands\"\n          [(rule)]=\"tree.rules[i]\"\n        ></ai-rule>\n      </ng-container>\n    </div>\n  "
              },] }
  ];
  RuleBuilderComponent.ctorParameters = function () { return [
      { type: carbonComponentsAngular.I18n }
  ]; };
  RuleBuilderComponent.propDecorators = {
      columns: [{ type: core.Input }],
      columnOperands: [{ type: core.Input }],
      tree: [{ type: core.Input }]
  };

  var RuleBuilderModule = /** @class */ (function () {
      function RuleBuilderModule(iconService) {
          this.iconService = iconService;
          this.iconService.register(Subtract32__default["default"]);
          this.iconService.register(Add32__default["default"]);
          this.iconService.register(TextNewLine32__default["default"]);
      }
      return RuleBuilderModule;
  }());
  RuleBuilderModule.decorators = [
      { type: core.NgModule, args: [{
                  declarations: [
                      RuleComponent,
                      RuleBuilderComponent,
                      RuleBuilderGroupLogicComponent,
                      RuleBuilderHeaderComponent,
                  ],
                  exports: [
                      RuleComponent,
                      RuleBuilderComponent,
                      RuleBuilderGroupLogicComponent,
                      RuleBuilderHeaderComponent,
                  ],
                  imports: [
                      common.CommonModule,
                      carbonComponentsAngular.DropdownModule,
                      forms.FormsModule,
                      carbonComponentsAngular.ButtonModule,
                      carbonComponentsAngular.IconModule,
                      carbonComponentsAngular.InputModule,
                      contextMenu.ContextMenuModule,
                      carbonComponentsAngular.UtilsModule,
                  ],
              },] }
  ];
  RuleBuilderModule.ctorParameters = function () { return [
      { type: carbonComponentsAngular.IconService }
  ]; };

  /**
   * Generated bundle index. Do not edit.
   */

  exports.RuleBuilderComponent = RuleBuilderComponent;
  exports.RuleBuilderGroupLogicComponent = RuleBuilderGroupLogicComponent;
  exports.RuleBuilderHeaderComponent = RuleBuilderHeaderComponent;
  exports.RuleBuilderModule = RuleBuilderModule;
  exports.RuleComponent = RuleComponent;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular-rule-builder.umd.js.map
