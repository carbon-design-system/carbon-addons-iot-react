/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-empty-state.umd.js
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
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@ai-apps/angular/icons')) :
  typeof define === 'function' && define.amd ? define('@ai-apps/angular/empty-state', ['exports', '@angular/core', '@angular/common', '@ai-apps/angular/icons'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["ai-apps"] = global["ai-apps"] || {}, global["ai-apps"].angular = global["ai-apps"].angular || {}, global["ai-apps"].angular["empty-state"] = {}), global.ng.core, global.ng.common, global["ai-apps"].angular.icons));
})(this, (function (exports, core, common, icons) { 'use strict';

  var EmptyStateComponent = /** @class */ (function () {
      function EmptyStateComponent() {
      }
      EmptyStateComponent.prototype.isTemplate = function (value) {
          return value instanceof core.TemplateRef;
      };
      return EmptyStateComponent;
  }());
  EmptyStateComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'ai-empty-state',
                  template: "\n    <div class=\"iot--empty-state\">\n      <div class=\"iot--empty-state--content\">\n        <ng-container *ngIf=\"icon !== 'no-icon'\">\n          <ng-container *ngIf=\"isTemplate(icon)\" [ngTemplateOutlet]=\"$any(icon)\"></ng-container>\n          <ng-container *ngIf=\"!isTemplate(icon)\" [ngSwitch]=\"icon\">\n            <empty-state-no-results-icon\n              *ngSwitchCase=\"'no-results'\"\n              iconClass=\"iot--empty-state--icon\"\n            >\n            </empty-state-no-results-icon>\n            <empty-state-404-icon *ngSwitchCase=\"'error404'\" iconClass=\"iot--empty-state--icon\">\n            </empty-state-404-icon>\n            <empty-state-not-authorized-icon\n              *ngSwitchCase=\"'not-authorized'\"\n              iconClass=\"iot--empty-state--icon\"\n            >\n            </empty-state-not-authorized-icon>\n            <empty-state-success-icon *ngSwitchCase=\"'success'\" iconClass=\"iot--empty-state--icon\">\n            </empty-state-success-icon>\n            <empty-state-error-icon *ngSwitchCase=\"'error'\" iconClass=\"iot--empty-state--icon\">\n            </empty-state-error-icon>\n            <empty-state-default-icon *ngSwitchDefault iconClass=\"iot--empty-state--icon\">\n            </empty-state-default-icon>\n          </ng-container>\n        </ng-container>\n        <ng-content select=\"[aiEmptyStateTitle]\"></ng-content>\n        <ng-content select=\"[aiEmptyStateBody]\"></ng-content>\n        <ng-content select=\"ai-empty-state-action\"></ng-content>\n        <ng-content select=\"ai-empty-state-secondary-action\"></ng-content>\n      </div>\n    </div>\n  "
              },] }
  ];
  EmptyStateComponent.propDecorators = {
      icon: [{ type: core.Input }]
  };

  var EmptyStateActionComponent = /** @class */ (function () {
      function EmptyStateActionComponent() {
      }
      return EmptyStateActionComponent;
  }());
  EmptyStateActionComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'ai-empty-state-action',
                  template: "\n    <div class=\"iot--empty-state--action\">\n      <ng-content></ng-content>\n    </div>\n  "
              },] }
  ];

  var EmptyStateBodyDirective = /** @class */ (function () {
      function EmptyStateBodyDirective() {
          this.classList = 'iot--empty-state--text';
      }
      return EmptyStateBodyDirective;
  }());
  EmptyStateBodyDirective.decorators = [
      { type: core.Directive, args: [{
                  selector: '[aiEmptyStateBody]',
              },] }
  ];
  EmptyStateBodyDirective.propDecorators = {
      classList: [{ type: core.HostBinding, args: ['class',] }]
  };

  var EmptyStateSecondaryActionComponent = /** @class */ (function () {
      function EmptyStateSecondaryActionComponent() {
      }
      return EmptyStateSecondaryActionComponent;
  }());
  EmptyStateSecondaryActionComponent.decorators = [
      { type: core.Component, args: [{
                  selector: 'ai-empty-state-secondary-action',
                  template: "\n    <div class=\"iot--empty-state--link\">\n      <ng-content></ng-content>\n    </div>\n  "
              },] }
  ];

  var EmptyStateTitleDirective = /** @class */ (function () {
      function EmptyStateTitleDirective() {
          this.classList = 'iot--empty-state--title';
      }
      return EmptyStateTitleDirective;
  }());
  EmptyStateTitleDirective.decorators = [
      { type: core.Directive, args: [{
                  selector: '[aiEmptyStateTitle]',
              },] }
  ];
  EmptyStateTitleDirective.propDecorators = {
      classList: [{ type: core.HostBinding, args: ['class',] }]
  };

  var EmptyStateModule = /** @class */ (function () {
      function EmptyStateModule() {
      }
      return EmptyStateModule;
  }());
  EmptyStateModule.decorators = [
      { type: core.NgModule, args: [{
                  declarations: [
                      EmptyStateComponent,
                      EmptyStateActionComponent,
                      EmptyStateBodyDirective,
                      EmptyStateSecondaryActionComponent,
                      EmptyStateTitleDirective,
                  ],
                  exports: [
                      EmptyStateComponent,
                      EmptyStateActionComponent,
                      EmptyStateBodyDirective,
                      EmptyStateSecondaryActionComponent,
                      EmptyStateTitleDirective,
                  ],
                  imports: [common.CommonModule, icons.AIIconsModule],
              },] }
  ];

  /**
   * Generated bundle index. Do not edit.
   */

  exports.EmptyStateActionComponent = EmptyStateActionComponent;
  exports.EmptyStateBodyDirective = EmptyStateBodyDirective;
  exports.EmptyStateComponent = EmptyStateComponent;
  exports.EmptyStateModule = EmptyStateModule;
  exports.EmptyStateSecondaryActionComponent = EmptyStateSecondaryActionComponent;
  exports.EmptyStateTitleDirective = EmptyStateTitleDirective;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ai-apps-angular-empty-state.umd.js.map
