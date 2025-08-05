/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-flyout-menu.umd.js
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
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('carbon-components-angular'), require('@carbon/icons'), require('carbon-components-angular/i18n'), require('carbon-components-angular/utils'), require('@angular/common')) :
  typeof define === 'function' && define.amd ? define('@ai-apps/angular/flyout-menu', ['exports', '@angular/core', 'carbon-components-angular', '@carbon/icons', 'carbon-components-angular/i18n', 'carbon-components-angular/utils', '@angular/common'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = global["ai-apps"].angular || {}, global["ai-apps"].angular["flyout-menu"] = {}), global.ng.core, global.carbonComponentsAngular, global.icons, global.i18n, global.utils, global.ng.common));
})(this, (function (exports, core, carbonComponentsAngular, icons, i18n, utils, common) { 'use strict';

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
  var FlyoutMenu = /** @class */ (function () {
      function FlyoutMenu(iconService) {
          this.iconService = iconService;
          this.flip = false;
          this.placement = 'bottom';
          this.isOpenChange = new core.EventEmitter();
      }
      Object.defineProperty(FlyoutMenu.prototype, "offset", {
          get: function () {
              if (!this._offset) {
                  return { x: (this.flip ? -1 : 1) * 4, y: 0 };
              }
              return this._offset;
          },
          /**
           * This specifies any vertical and horizontal offset for the position of the dialog
           */
          set: function (os) {
              this._offset = os;
          },
          enumerable: false,
          configurable: true
      });
      FlyoutMenu.prototype.ngOnInit = function () {
          this.iconService.register(icons.Filter16);
      };
      return FlyoutMenu;
  }());
  FlyoutMenu.decorators = [
      { type: core.Component, args: [{
                  selector: 'ai-flyout-menu',
                  template: "\n    <ng-template #templateRef let-tooltip=\"tooltip\">\n      <div class=\"bx--tooltip__content\">\n        <div class=\"iot--flyout-menu--content\">\n          <ng-content></ng-content>\n        </div>\n        <ng-content\n          select=\"ai-flyout-menu-footer, .iot--flyout-menu__bottom-container\"\n        ></ng-content>\n      </div>\n    </ng-template>\n    <div\n      [aiFlyoutMenu]=\"templateRef\"\n      [isOpen]=\"isOpen\"\n      (isOpenChange)=\"isOpenChange.emit($event)\"\n      [offset]=\"offset\"\n      [flip]=\"flip\"\n      trigger=\"click\"\n      [placement]=\"placement\"\n      style=\"--tooltip-visibility: hidden;\"\n    >\n      <button\n        aria-label=\"Helpful description\"\n        data-testid=\"flyout-menu-button\"\n        tabindex=\"0\"\n        ibmButton=\"ghost\"\n        [iconOnly]=\"true\"\n        class=\"\n        iot--flyout-menu--trigger-button\n        iot--btn\n        bx--tooltip__trigger\n        bx--tooltip--a11y\n        bx--tooltip--top\n        bx--tooltip--align-center\"\n      >\n        <svg ibmIcon=\"filter\" size=\"16\" class=\"bx--overflow-menu__icon\"></svg>\n      </button>\n    </div>\n  ",
                  encapsulation: core.ViewEncapsulation.None
              },] }
  ];
  FlyoutMenu.ctorParameters = function () { return [
      { type: carbonComponentsAngular.IconService }
  ]; };
  FlyoutMenu.propDecorators = {
      offset: [{ type: core.Input }],
      flip: [{ type: core.Input }],
      placement: [{ type: core.Input }],
      isOpen: [{ type: core.Input }],
      isOpenChange: [{ type: core.Output }]
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
  var FlyoutMenuPane = /** @class */ (function (_super) {
      __extends(FlyoutMenuPane, _super);
      function FlyoutMenuPane(elementRef, elementService, i18n, animationFrameService) {
          if (animationFrameService === void 0) { animationFrameService = null; }
          var _this = _super.call(this, elementRef, elementService, animationFrameService) || this;
          _this.elementRef = elementRef;
          _this.elementService = elementService;
          _this.i18n = i18n;
          _this.animationFrameService = animationFrameService;
          _this.hasContentTemplate = true;
          /**
           * Sets the role of the tooltip. If there's no focusable content we leave it as a `tooltip`,
           * if there _is_ focusable content we switch to the interactive `dialog` role.
           */
          _this.role = 'tooltip';
          _this.buttonLabel = _this.i18n.get().OVERFLOW_MENU.OVERFLOW;
          _this.light = false;
          _this.open = true;
          _this.openChange = new core.EventEmitter();
          _this.shouldClose = function (meta) {
              return !_this.dialog.nativeElement.contains(meta.target);
          };
          return _this;
      }
      Object.defineProperty(FlyoutMenuPane.prototype, "offset", {
          get: function () {
              if (!this._offset) {
                  return { x: (this.dialogConfig.flip ? -1 : 1) * 4, y: 0 };
              }
              return this._offset;
          },
          /**
           * This specifies any vertical and horizontal offset for the position of the dialog
           */
          set: function (os) {
              this._offset = os;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(FlyoutMenuPane.prototype, "contentTemplate", {
          get: function () {
              return this.dialogConfig.content;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(FlyoutMenuPane.prototype, "position", {
          get: function () {
              return this.dialogConfig.placement + "-" + (this.dialogConfig.flip ? 'end' : 'start');
          },
          enumerable: false,
          configurable: true
      });
      FlyoutMenuPane.prototype.handleOpenChange = function (event) {
          this.open = event;
          this.openChange.emit(event);
      };
      FlyoutMenuPane.prototype.onDialogInit = function () {
          var _this = this;
          var chevronWidth = 16;
          var chevronHeight = 14;
          var borderWidth = 2;
          var positionOverflowMenuVertically = function (pos) {
              var offset;
              var closestRel = carbonComponentsAngular.closestAttr('position', ['relative', 'fixed', 'absolute'], _this.elementRef.nativeElement);
              var topFix = (closestRel ? closestRel.getBoundingClientRect().top * -1 : 0) -
                  chevronHeight / 2 +
                  1 * borderWidth;
              var leftFix = closestRel ? closestRel.getBoundingClientRect().left * -1 : 0;
              if (_this.dialogConfig.placement === 'top') {
                  topFix += chevronHeight / 2;
              }
              /*
               * 20 is half the width of the overflow menu trigger element.
               * we also move the element by half of it's own width, since
               * position service will try and center everything
               */
              offset = Math.round(_this.dialog.nativeElement.offsetWidth / 2) - 20 - chevronWidth / 2;
              if (_this.dialogConfig.flip) {
                  return carbonComponentsAngular.position.addOffset(pos, topFix, -offset + leftFix);
              }
              return carbonComponentsAngular.position.addOffset(pos, topFix, offset + leftFix);
          };
          this.addGap['bottom'] = positionOverflowMenuVertically;
          this.addGap['top'] = positionOverflowMenuVertically;
          var positionOverflowMenuHorizontally = function (pos) {
              var adjustedOffset = _this.getAdjustOffset();
              var topFix = (_this.dialog.nativeElement.offsetHeight -
                  _this.dialogConfig.parentRef.nativeElement.offsetHeight -
                  borderWidth) /
                  2;
              var leftFix = (_this.dialogConfig.placement === 'right' ? 1 : -1) * borderWidth;
              if (_this.dialogConfig.placement === 'right') {
                  leftFix -= chevronWidth / 2;
              }
              if (_this.dialogConfig.flip) {
                  return carbonComponentsAngular.position.addOffset(pos, -5 + adjustedOffset.top - topFix, adjustedOffset.left + leftFix + chevronWidth / 2);
              }
              return carbonComponentsAngular.position.addOffset(pos, -3 + adjustedOffset.top + topFix, adjustedOffset.left + leftFix);
          };
          this.addGap['left'] = positionOverflowMenuHorizontally;
          this.addGap['right'] = positionOverflowMenuHorizontally;
          if (!this.dialogConfig.menuLabel) {
              this.dialogConfig.menuLabel = this.i18n.get().OVERFLOW_MENU.OVERFLOW;
          }
      };
      FlyoutMenuPane.prototype.getAdjustOffset = function () {
          var closestWithPos = carbonComponentsAngular.closestAttr('position', ['relative', 'fixed', 'absolute'], this.elementRef.nativeElement.parentElement);
          var topPos = closestWithPos ? closestWithPos.getBoundingClientRect().top * -1 : 0;
          var leftPos = closestWithPos ? closestWithPos.getBoundingClientRect().left * -1 : 0;
          return { top: topPos, left: leftPos };
      };
      return FlyoutMenuPane;
  }(carbonComponentsAngular.Dialog));
  FlyoutMenuPane.decorators = [
      { type: core.Component, args: [{
                  selector: 'ai-flyout-menu-pane',
                  template: "\n    <div\n      #dialog\n      [id]=\"dialogConfig.compID\"\n      [attr.role]=\"role\"\n      [attr.data-floating-menu-direction]=\"dialogConfig.placement\"\n      class=\"bx--tooltip bx--tooltip--shown iot--flyout-menu--body\"\n      [ngClass]=\"{\n        'iot--flyout-menu--body__bottom-start': position === 'bottom-start',\n        'iot--flyout-menu--body__bottom-end': position === 'bottom-end',\n        'iot--flyout-menu--body__top-start': position === 'top-start',\n        'iot--flyout-menu--body__top-end': position === 'top-end',\n        'iot--flyout-menu--body__left-start': position === 'left-start',\n        'iot--flyout-menu--body__left-end': position === 'left-end',\n        'iot--flyout-menu--body__right-start': position === 'right-start',\n        'iot--flyout-menu--body__right-end': position === 'right-end',\n        'iot--flyout-menu--body__light': light,\n        'iot--flyout-menu--body__open': open\n      }\"\n    >\n      <ng-template\n        *ngIf=\"hasContentTemplate\"\n        [ngTemplateOutlet]=\"contentTemplate\"\n        [ngTemplateOutletContext]=\"{ tooltip: this }\"\n      >\n      </ng-template>\n      <p *ngIf=\"!hasContentTemplate\">\n        {{ dialogConfig.content }}\n      </p>\n    </div>\n  ",
                  encapsulation: core.ViewEncapsulation.None
              },] }
  ];
  FlyoutMenuPane.ctorParameters = function () { return [
      { type: core.ElementRef },
      { type: carbonComponentsAngular.ElementService },
      { type: i18n.I18n },
      { type: carbonComponentsAngular.AnimationFrameService, decorators: [{ type: core.Optional }] }
  ]; };
  FlyoutMenuPane.propDecorators = {
      offset: [{ type: core.Input }],
      buttonLabel: [{ type: core.Input }],
      light: [{ type: core.Input }],
      open: [{ type: core.Input }],
      openChange: [{ type: core.Output }]
  };

  /**
   * selector: `aiFlyoutMenu`
   */
  var FlyoutMenuDirective = /** @class */ (function (_super) {
      __extends(FlyoutMenuDirective, _super);
      /**
       * Creates an instance of `TooltipDirective`.
       */
      function FlyoutMenuDirective(elementRef, viewContainerRef, dialogService, eventService) {
          var _this = _super.call(this, elementRef, viewContainerRef, dialogService, eventService) || this;
          _this.elementRef = elementRef;
          _this.viewContainerRef = viewContainerRef;
          _this.dialogService = dialogService;
          _this.eventService = eventService;
          /**
           * Controls wether the overflow menu is flipped
           */
          _this.flip = false;
          _this.menuClass = true;
          /**
           * bx--tooltip__trigger is inherited from TooltipDirective and it enables focus indication
           */
          _this.className = false;
          /**
           * Override tabindex to make it not tabbable
           */
          _this.tabIndex = -1;
          dialogService.setContext({ component: FlyoutMenuPane });
          return _this;
      }
      Object.defineProperty(FlyoutMenuDirective.prototype, "openClass", {
          get: function () {
              return this.isOpen;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(FlyoutMenuDirective.prototype, "menuBottomClass", {
          get: function () {
              return this.placement === 'bottom';
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(FlyoutMenuDirective.prototype, "menuTopClass", {
          get: function () {
              return this.placement === 'top';
          },
          enumerable: false,
          configurable: true
      });
      FlyoutMenuDirective.prototype.updateConfig = function () {
          this.dialogConfig.content = this.aiFlyoutMenu;
          this.dialogConfig.flip = this.flip;
          this.dialogConfig.offset = this.offset;
          this.dialogConfig.wrapperClass = this.wrapperClass;
          this.dialogConfig.placement = this.placement;
      };
      return FlyoutMenuDirective;
  }(carbonComponentsAngular.TooltipDirective));
  FlyoutMenuDirective.decorators = [
      { type: core.Directive, args: [{
                  selector: '[aiFlyoutMenu]',
                  exportAs: 'aiFlyoutMenu',
                  providers: [carbonComponentsAngular.DialogService],
              },] }
  ];
  FlyoutMenuDirective.ctorParameters = function () { return [
      { type: core.ElementRef },
      { type: core.ViewContainerRef },
      { type: carbonComponentsAngular.DialogService },
      { type: utils.EventService }
  ]; };
  FlyoutMenuDirective.propDecorators = {
      aiFlyoutMenu: [{ type: core.Input }],
      flip: [{ type: core.Input }],
      menuClass: [{ type: core.HostBinding, args: ['class.iot--flyout-menu',] }],
      className: [{ type: core.HostBinding, args: ['class.bx--tooltip__trigger',] }],
      tabIndex: [{ type: core.HostBinding, args: ['tabindex',] }],
      openClass: [{ type: core.HostBinding, args: ['class.iot--flyout-menu__open',] }],
      menuBottomClass: [{ type: core.HostBinding, args: ['class.iot--flyout-menu__bottom',] }],
      menuTopClass: [{ type: core.HostBinding, args: ['class.iot--flyout-menu__top',] }]
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
  var FlyoutMenuFooter = /** @class */ (function () {
      function FlyoutMenuFooter() {
          this.className = true;
      }
      return FlyoutMenuFooter;
  }());
  FlyoutMenuFooter.decorators = [
      { type: core.Component, args: [{
                  selector: 'ai-flyout-menu-footer',
                  template: " <ng-content></ng-content> ",
                  encapsulation: core.ViewEncapsulation.None
              },] }
  ];
  FlyoutMenuFooter.propDecorators = {
      className: [{ type: core.HostBinding, args: ['class.iot--flyout-menu__bottom-container',] }]
  };

  // modules
  var FlyoutMenuModule = /** @class */ (function () {
      function FlyoutMenuModule() {
      }
      return FlyoutMenuModule;
  }());
  FlyoutMenuModule.decorators = [
      { type: core.NgModule, args: [{
                  declarations: [FlyoutMenu, FlyoutMenuPane, FlyoutMenuDirective, FlyoutMenuFooter],
                  exports: [FlyoutMenu, FlyoutMenuPane, FlyoutMenuDirective, FlyoutMenuFooter],
                  providers: [carbonComponentsAngular.DialogService],
                  entryComponents: [FlyoutMenuPane],
                  imports: [
                      carbonComponentsAngular.ButtonModule,
                      common.CommonModule,
                      carbonComponentsAngular.I18nModule,
                      carbonComponentsAngular.PlaceholderModule,
                      carbonComponentsAngular.DialogModule,
                      carbonComponentsAngular.IconModule,
                      carbonComponentsAngular.LinkModule,
                  ],
              },] }
  ];

  /**
   * Generated bundle index. Do not edit.
   */

  exports.FlyoutMenu = FlyoutMenu;
  exports.FlyoutMenuDirective = FlyoutMenuDirective;
  exports.FlyoutMenuFooter = FlyoutMenuFooter;
  exports.FlyoutMenuModule = FlyoutMenuModule;
  exports.FlyoutMenuPane = FlyoutMenuPane;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular-flyout-menu.umd.js.map
