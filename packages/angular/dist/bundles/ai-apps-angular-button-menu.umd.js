/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-button-menu.umd.js
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
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('carbon-components-angular'), require('@angular/common'), require('carbon-components-angular/context-menu'), require('@carbon/icons/es/chevron--up/16')) :
  typeof define === 'function' && define.amd ? define('@ai-apps/angular/button-menu', ['exports', '@angular/core', 'carbon-components-angular', '@angular/common', 'carbon-components-angular/context-menu', '@carbon/icons/es/chevron--up/16'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = global["ai-apps"].angular || {}, global["ai-apps"].angular["button-menu"] = {}), global.ng.core, global.carbonComponentsAngular, global.ng.common, global.contextMenu, global.ChevronUp16));
})(this, (function (exports, core, carbonComponentsAngular, common, contextMenu, ChevronUp16) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var ChevronUp16__default = /*#__PURE__*/_interopDefaultLegacy(ChevronUp16);

  var ButtonMenuComponent = /** @class */ (function () {
      function ButtonMenuComponent(elementRef, documentService) {
          this.elementRef = elementRef;
          this.documentService = documentService;
          this.label = '';
          this.open = false;
          this.openIcon = 'chevron--down';
          this.closeIcon = 'chevron--up';
          this.iconOnly = false;
          this.split = false;
          this.alignMenu = 'left';
          this.placeMenu = 'bottom';
          this.openChange = new core.EventEmitter();
          this.primaryClick = new core.EventEmitter();
          this.position = {
              top: 0,
              left: 0,
          };
      }
      ButtonMenuComponent.prototype.ngAfterViewInit = function () {
          var _this = this;
          var nativeElement = this.elementRef.nativeElement;
          var menuElement = nativeElement.querySelector('.bx--context-menu, .bx--menu');
          var dimensions = nativeElement.getBoundingClientRect();
          var menuDimensions = menuElement.getBoundingClientRect();
          // default placement (align left, place bottom)
          var left = dimensions.left;
          var top = dimensions.top + dimensions.height;
          if (this.alignMenu === 'right') {
              left = dimensions.right - menuDimensions.width;
          }
          if (this.placeMenu === 'top') {
              top = dimensions.top - menuDimensions.height;
          }
          this.position = { top: top, left: left };
          this.documentService.handleClick(function (event) {
              var nativeElement = _this.elementRef.nativeElement;
              if (_this.open && !nativeElement.contains(event.target)) {
                  _this.toggleMenu();
              }
          });
      };
      ButtonMenuComponent.prototype.toggleMenu = function () {
          this.open = !this.open;
          this.openChange.emit(this.open);
      };
      ButtonMenuComponent.prototype.handleKeys = function (event) {
          if (event.key === 'Escape' && this.open) {
              this.toggleMenu();
              var element = this.elementRef.nativeElement;
              var button = element.querySelector('.iot--menu-button__primary');
              if (this.split || this.iconOnly) {
                  button = element.querySelector('.iot--menu-button__secondary');
              }
              button.focus();
          }
      };
      return ButtonMenuComponent;
  }());
  ButtonMenuComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'ai-button-menu',
                  template: "\n    <div\n      [ngClass]=\"{\n        'iot--menu-button--open': open\n      }\"\n      class=\"iot--menu-button\"\n    >\n      <ng-container *ngIf=\"!split && !iconOnly\">\n        <button\n          ibmButton=\"primary\"\n          class=\"iot--menu-button__primary iot--menu-button__trigger\"\n          (click)=\"toggleMenu()\"\n        >\n          {{ label }}\n          <svg *ngIf=\"!open\" class=\"bx--btn__icon\" [ibmIcon]=\"openIcon\" size=\"16\"></svg>\n          <svg *ngIf=\"open\" class=\"bx--btn__icon\" [ibmIcon]=\"closeIcon\" size=\"16\"></svg>\n        </button>\n      </ng-container>\n      <ng-container *ngIf=\"split && !iconOnly\">\n        <button\n          *ngIf=\"!iconOnly\"\n          ibmButton=\"primary\"\n          class=\"iot--menu-button__primary\"\n          (click)=\"primaryClick.emit($event)\"\n        >\n          {{ label }}\n        </button>\n        <button\n          ibmButton=\"primary\"\n          [iconOnly]=\"true\"\n          [hasAssistiveText]=\"iconOnly && !!label\"\n          class=\"iot--menu-button__secondary iot--menu-button__trigger\"\n          (click)=\"toggleMenu()\"\n        >\n          <svg *ngIf=\"!open\" class=\"bx--btn__icon\" [ibmIcon]=\"openIcon\" size=\"16\"></svg>\n          <svg *ngIf=\"open\" class=\"bx--btn__icon\" [ibmIcon]=\"closeIcon\" size=\"16\"></svg>\n        </button>\n      </ng-container>\n      <ng-container *ngIf=\"iconOnly && !split\">\n        <button\n          ibmButton=\"ghost\"\n          [iconOnly]=\"true\"\n          [hasAssistiveText]=\"iconOnly && !!label\"\n          class=\"iot--menu-button__secondary\"\n          (click)=\"toggleMenu()\"\n        >\n          <svg *ngIf=\"!open\" class=\"bx--btn__icon\" [ibmIcon]=\"openIcon\" size=\"16\"></svg>\n          <svg *ngIf=\"open\" class=\"bx--btn__icon\" [ibmIcon]=\"closeIcon\" size=\"16\"></svg>\n          <span *ngIf=\"label\" class=\"bx--assistive-text\">{{ label }}</span>\n        </button>\n      </ng-container>\n      <ibm-context-menu [open]=\"open\" [position]=\"position\">\n        <ng-content></ng-content>\n      </ibm-context-menu>\n    </div>\n  ",
                  styles: ["\n      :host {\n        display: inline-block;\n      }\n\n      .iot--menu-button {\n        display: inline-block;\n      }\n\n      .bx--btn__icon {\n        pointer-events: none;\n      }\n    "]
              },] }
  ];
  ButtonMenuComponent.ctorParameters = function () { return [
      { type: core.ElementRef },
      { type: carbonComponentsAngular.DocumentService }
  ]; };
  ButtonMenuComponent.propDecorators = {
      label: [{ type: core.Input }],
      open: [{ type: core.Input }],
      openIcon: [{ type: core.Input }],
      closeIcon: [{ type: core.Input }],
      iconOnly: [{ type: core.Input }],
      split: [{ type: core.Input }],
      alignMenu: [{ type: core.Input }],
      placeMenu: [{ type: core.Input }],
      openChange: [{ type: core.Output }],
      primaryClick: [{ type: core.Output }],
      handleKeys: [{ type: core.HostListener, args: ['keyup', ['$event'],] }]
  };

  var ButtonMenuModule = /** @class */ (function () {
      function ButtonMenuModule(iconService) {
          this.iconService = iconService;
          this.iconService.register(ChevronUp16__default["default"]);
      }
      return ButtonMenuModule;
  }());
  ButtonMenuModule.decorators = [
      { type: core.NgModule, args: [{
                  declarations: [ButtonMenuComponent],
                  exports: [ButtonMenuComponent],
                  imports: [common.CommonModule, carbonComponentsAngular.ButtonModule, carbonComponentsAngular.IconModule, contextMenu.ContextMenuModule, carbonComponentsAngular.UtilsModule],
              },] }
  ];
  ButtonMenuModule.ctorParameters = function () { return [
      { type: carbonComponentsAngular.IconService }
  ]; };

  /**
   * Generated bundle index. Do not edit.
   */

  exports.ButtonMenuComponent = ButtonMenuComponent;
  exports.ButtonMenuModule = ButtonMenuModule;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular-button-menu.umd.js.map
