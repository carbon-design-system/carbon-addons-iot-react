/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-side-panel.umd.js
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
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@carbon/icons'), require('carbon-components-angular'), require('@angular/common')) :
  typeof define === 'function' && define.amd ? define('@ai-apps/angular/side-panel', ['exports', '@angular/core', '@carbon/icons', 'carbon-components-angular', '@angular/common'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = global["ai-apps"].angular || {}, global["ai-apps"].angular["side-panel"] = {}), global.ng.core, global.icons, global.carbonComponentsAngular, global.ng.common));
})(this, (function (exports, core, icons, carbonComponentsAngular, common) { 'use strict';

  /**
   *
   * [See demo](../../?path=/story/components-side-panel--basic)
   *
   * html:
   * ```
   * <ai-side-panel>
   *	options
   * </ai-side-panel>
   * ```
   */
  var SidePanel = /** @class */ (function () {
      function SidePanel(iconService) {
          this.iconService = iconService;
          this.sidePanelClass = true;
          this.showClose = true;
          this.showDrawer = false;
          this.variation = 'inline';
          /**
           * Activates the panel when set to `true`, by sliding it in or over.
           *
           * Has no effect for `variation` `inline`
           */
          this.active = false;
          this.side = 'left';
          this.close = new core.EventEmitter();
      }
      Object.defineProperty(SidePanel.prototype, "sidePanelSlideInClass", {
          get: function () {
              return this.variation === 'slide-in';
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(SidePanel.prototype, "sidePanelInlineClass", {
          get: function () {
              return this.variation === 'inline';
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(SidePanel.prototype, "sidePanelSlideOverClass", {
          get: function () {
              return this.variation === 'slide-over';
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(SidePanel.prototype, "sidePanelRightClass", {
          get: function () {
              return this.side === 'right';
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(SidePanel.prototype, "sidePanelDrawerClass", {
          get: function () {
              return this.showDrawer && !this.active;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(SidePanel.prototype, "shouldShowDrawer", {
          get: function () {
              return this.showDrawer && this.variation === 'inline';
          },
          enumerable: false,
          configurable: true
      });
      SidePanel.prototype.ngOnInit = function () {
          this.iconService.register(icons.Close16);
          this.iconService.register(icons.ChevronLeft16);
          this.iconService.register(icons.ChevronRight16);
          this.iconService.register(icons.OpenPanelLeft16);
          this.iconService.register(icons.OpenPanelRight16);
      };
      return SidePanel;
  }());
  SidePanel.decorators = [
      { type: core.Component, args: [{
                  selector: 'ai-side-panel',
                  template: "\n    <div\n      class=\"panel\"\n      [ngClass]=\"{\n        'iot--side-panel__left': side === 'left',\n        'iot--side-panel__right': side === 'right'\n      }\"\n    >\n      <button\n        *ngIf=\"showClose || showDrawer\"\n        tabindex=\"0\"\n        class=\"iot--btn bx--btn bx--btn--ghost bx--btn--icon-only close-button\"\n        type=\"button\"\n        (click)=\"close.emit()\"\n      >\n        <svg *ngIf=\"showClose && !shouldShowDrawer\" ibmIcon=\"close\" size=\"16\"></svg>\n        <svg\n          *ngIf=\"shouldShowDrawer && active && side === 'left'\"\n          [ibmIcon]=\"closeIcon || 'chevron--left'\"\n          size=\"16\"\n        ></svg>\n        <svg\n          *ngIf=\"shouldShowDrawer && active && side === 'right'\"\n          [ibmIcon]=\"closeIcon || 'chevron--right'\"\n          size=\"16\"\n        ></svg>\n        <svg\n          *ngIf=\"shouldShowDrawer && !active && side === 'left'\"\n          [ibmIcon]=\"drawerIcon || 'open-panel--left'\"\n          size=\"16\"\n        ></svg>\n        <svg\n          *ngIf=\"shouldShowDrawer && !active && side === 'right'\"\n          [ibmIcon]=\"drawerIcon || 'open-panel--right'\"\n          size=\"16\"\n        ></svg>\n      </button>\n      <div class=\"panel-content-wrapper\">\n        <ng-content></ng-content>\n      </div>\n    </div>\n  ",
                  encapsulation: core.ViewEncapsulation.None
              },] }
  ];
  SidePanel.ctorParameters = function () { return [
      { type: carbonComponentsAngular.IconService }
  ]; };
  SidePanel.propDecorators = {
      sidePanelClass: [{ type: core.HostBinding, args: ['class.iot--side-panel',] }],
      sidePanelSlideInClass: [{ type: core.HostBinding, args: ['class.iot--side-panel__slide-in',] }],
      sidePanelInlineClass: [{ type: core.HostBinding, args: ['class.iot--side-panel__inline',] }],
      sidePanelSlideOverClass: [{ type: core.HostBinding, args: ['class.iot--side-panel__slide-over',] }],
      sidePanelRightClass: [{ type: core.HostBinding, args: ['class.iot--side-panel__right',] }],
      sidePanelDrawerClass: [{ type: core.HostBinding, args: ['class.iot--side-panel__drawer',] }],
      showClose: [{ type: core.Input }],
      showDrawer: [{ type: core.Input }],
      drawerIcon: [{ type: core.Input }],
      closeIcon: [{ type: core.Input }],
      variation: [{ type: core.Input }],
      active: [{ type: core.Input }, { type: core.HostBinding, args: ['class.active',] }],
      overlay: [{ type: core.Input }],
      side: [{ type: core.Input }],
      close: [{ type: core.Output }]
  };

  /**
   * selector: `aiSidePanelTitle`
   */
  var SidePanelTitleDirective = /** @class */ (function () {
      function SidePanelTitleDirective() {
          this.titleClass = true;
          this.condensed = false;
          this.showClose = true;
      }
      return SidePanelTitleDirective;
  }());
  SidePanelTitleDirective.decorators = [
      { type: core.Directive, args: [{
                  selector: '[aiSidePanelTitle]',
                  exportAs: 'aiSidePanelTitle',
              },] }
  ];
  SidePanelTitleDirective.propDecorators = {
      titleClass: [{ type: core.HostBinding, args: ['class.iot--side-panel-title',] }],
      condensed: [{ type: core.Input }, { type: core.HostBinding, args: ['class.iot--side-panel-title__condensed',] }],
      showClose: [{ type: core.Input }, { type: core.HostBinding, args: ['class.iot--side-panel-title__with-close',] }]
  };

  /**
   * selector: `aiSidePanelFooter`
   */
  var SidePanelFooterDirective = /** @class */ (function () {
      function SidePanelFooterDirective() {
          this.footerClass = true;
      }
      return SidePanelFooterDirective;
  }());
  SidePanelFooterDirective.decorators = [
      { type: core.Directive, args: [{
                  selector: '[aiSidePanelFooter]',
                  exportAs: 'aiSidePanelFooter',
              },] }
  ];
  SidePanelFooterDirective.propDecorators = {
      footerClass: [{ type: core.HostBinding, args: ['class.iot--side-panel-footer',] }]
  };

  // modules
  var SidePanelModule = /** @class */ (function () {
      function SidePanelModule() {
      }
      return SidePanelModule;
  }());
  SidePanelModule.decorators = [
      { type: core.NgModule, args: [{
                  declarations: [SidePanel, SidePanelTitleDirective, SidePanelFooterDirective],
                  exports: [SidePanel, SidePanelTitleDirective, SidePanelFooterDirective],
                  providers: [carbonComponentsAngular.DialogService],
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

  exports.SidePanel = SidePanel;
  exports.SidePanelFooterDirective = SidePanelFooterDirective;
  exports.SidePanelModule = SidePanelModule;
  exports.SidePanelTitleDirective = SidePanelTitleDirective;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular-side-panel.umd.js.map
