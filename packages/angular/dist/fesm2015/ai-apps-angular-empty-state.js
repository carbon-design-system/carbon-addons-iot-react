/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-empty-state.js
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


import { TemplateRef, Component, Input, Directive, HostBinding, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIIconsModule } from '@ai-apps/angular/icons';

class EmptyStateComponent {
    isTemplate(value) {
        return value instanceof TemplateRef;
    }
}
EmptyStateComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-empty-state',
                template: `
    <div class="iot--empty-state">
      <div class="iot--empty-state--content">
        <ng-container *ngIf="icon !== 'no-icon'">
          <ng-container *ngIf="isTemplate(icon)" [ngTemplateOutlet]="$any(icon)"></ng-container>
          <ng-container *ngIf="!isTemplate(icon)" [ngSwitch]="icon">
            <empty-state-no-results-icon
              *ngSwitchCase="'no-results'"
              iconClass="iot--empty-state--icon"
            >
            </empty-state-no-results-icon>
            <empty-state-404-icon *ngSwitchCase="'error404'" iconClass="iot--empty-state--icon">
            </empty-state-404-icon>
            <empty-state-not-authorized-icon
              *ngSwitchCase="'not-authorized'"
              iconClass="iot--empty-state--icon"
            >
            </empty-state-not-authorized-icon>
            <empty-state-success-icon *ngSwitchCase="'success'" iconClass="iot--empty-state--icon">
            </empty-state-success-icon>
            <empty-state-error-icon *ngSwitchCase="'error'" iconClass="iot--empty-state--icon">
            </empty-state-error-icon>
            <empty-state-default-icon *ngSwitchDefault iconClass="iot--empty-state--icon">
            </empty-state-default-icon>
          </ng-container>
        </ng-container>
        <ng-content select="[aiEmptyStateTitle]"></ng-content>
        <ng-content select="[aiEmptyStateBody]"></ng-content>
        <ng-content select="ai-empty-state-action"></ng-content>
        <ng-content select="ai-empty-state-secondary-action"></ng-content>
      </div>
    </div>
  `
            },] }
];
EmptyStateComponent.propDecorators = {
    icon: [{ type: Input }]
};

class EmptyStateActionComponent {
}
EmptyStateActionComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-empty-state-action',
                template: `
    <div class="iot--empty-state--action">
      <ng-content></ng-content>
    </div>
  `
            },] }
];

class EmptyStateBodyDirective {
    constructor() {
        this.classList = 'iot--empty-state--text';
    }
}
EmptyStateBodyDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiEmptyStateBody]',
            },] }
];
EmptyStateBodyDirective.propDecorators = {
    classList: [{ type: HostBinding, args: ['class',] }]
};

class EmptyStateSecondaryActionComponent {
}
EmptyStateSecondaryActionComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-empty-state-secondary-action',
                template: `
    <div class="iot--empty-state--link">
      <ng-content></ng-content>
    </div>
  `
            },] }
];

class EmptyStateTitleDirective {
    constructor() {
        this.classList = 'iot--empty-state--title';
    }
}
EmptyStateTitleDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiEmptyStateTitle]',
            },] }
];
EmptyStateTitleDirective.propDecorators = {
    classList: [{ type: HostBinding, args: ['class',] }]
};

class EmptyStateModule {
}
EmptyStateModule.decorators = [
    { type: NgModule, args: [{
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
                imports: [CommonModule, AIIconsModule],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { EmptyStateActionComponent, EmptyStateBodyDirective, EmptyStateComponent, EmptyStateModule, EmptyStateSecondaryActionComponent, EmptyStateTitleDirective };
//# sourceMappingURL=ai-apps-angular-empty-state.js.map
