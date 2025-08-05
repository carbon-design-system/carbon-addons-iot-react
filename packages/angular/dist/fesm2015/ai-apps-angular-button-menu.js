/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-button-menu.js
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


import { EventEmitter, Component, ElementRef, Input, Output, HostListener, NgModule } from '@angular/core';
import { DocumentService, ButtonModule, IconModule, UtilsModule, IconService } from 'carbon-components-angular';
import { CommonModule } from '@angular/common';
import { ContextMenuModule } from 'carbon-components-angular/context-menu';
import ChevronUp16 from '@carbon/icons/es/chevron--up/16';

class ButtonMenuComponent {
    constructor(elementRef, documentService) {
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
        this.openChange = new EventEmitter();
        this.primaryClick = new EventEmitter();
        this.position = {
            top: 0,
            left: 0,
        };
    }
    ngAfterViewInit() {
        const { nativeElement } = this.elementRef;
        const menuElement = nativeElement.querySelector('.bx--context-menu, .bx--menu');
        const dimensions = nativeElement.getBoundingClientRect();
        const menuDimensions = menuElement.getBoundingClientRect();
        // default placement (align left, place bottom)
        let left = dimensions.left;
        let top = dimensions.top + dimensions.height;
        if (this.alignMenu === 'right') {
            left = dimensions.right - menuDimensions.width;
        }
        if (this.placeMenu === 'top') {
            top = dimensions.top - menuDimensions.height;
        }
        this.position = { top, left };
        this.documentService.handleClick((event) => {
            const { nativeElement } = this.elementRef;
            if (this.open && !nativeElement.contains(event.target)) {
                this.toggleMenu();
            }
        });
    }
    toggleMenu() {
        this.open = !this.open;
        this.openChange.emit(this.open);
    }
    handleKeys(event) {
        if (event.key === 'Escape' && this.open) {
            this.toggleMenu();
            const element = this.elementRef.nativeElement;
            let button = element.querySelector('.iot--menu-button__primary');
            if (this.split || this.iconOnly) {
                button = element.querySelector('.iot--menu-button__secondary');
            }
            button.focus();
        }
    }
}
ButtonMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-button-menu',
                template: `
    <div
      [ngClass]="{
        'iot--menu-button--open': open
      }"
      class="iot--menu-button"
    >
      <ng-container *ngIf="!split && !iconOnly">
        <button
          ibmButton="primary"
          class="iot--menu-button__primary iot--menu-button__trigger"
          (click)="toggleMenu()"
        >
          {{ label }}
          <svg *ngIf="!open" class="bx--btn__icon" [ibmIcon]="openIcon" size="16"></svg>
          <svg *ngIf="open" class="bx--btn__icon" [ibmIcon]="closeIcon" size="16"></svg>
        </button>
      </ng-container>
      <ng-container *ngIf="split && !iconOnly">
        <button
          *ngIf="!iconOnly"
          ibmButton="primary"
          class="iot--menu-button__primary"
          (click)="primaryClick.emit($event)"
        >
          {{ label }}
        </button>
        <button
          ibmButton="primary"
          [iconOnly]="true"
          [hasAssistiveText]="iconOnly && !!label"
          class="iot--menu-button__secondary iot--menu-button__trigger"
          (click)="toggleMenu()"
        >
          <svg *ngIf="!open" class="bx--btn__icon" [ibmIcon]="openIcon" size="16"></svg>
          <svg *ngIf="open" class="bx--btn__icon" [ibmIcon]="closeIcon" size="16"></svg>
        </button>
      </ng-container>
      <ng-container *ngIf="iconOnly && !split">
        <button
          ibmButton="ghost"
          [iconOnly]="true"
          [hasAssistiveText]="iconOnly && !!label"
          class="iot--menu-button__secondary"
          (click)="toggleMenu()"
        >
          <svg *ngIf="!open" class="bx--btn__icon" [ibmIcon]="openIcon" size="16"></svg>
          <svg *ngIf="open" class="bx--btn__icon" [ibmIcon]="closeIcon" size="16"></svg>
          <span *ngIf="label" class="bx--assistive-text">{{ label }}</span>
        </button>
      </ng-container>
      <ibm-context-menu [open]="open" [position]="position">
        <ng-content></ng-content>
      </ibm-context-menu>
    </div>
  `,
                styles: [`
      :host {
        display: inline-block;
      }

      .iot--menu-button {
        display: inline-block;
      }

      .bx--btn__icon {
        pointer-events: none;
      }
    `]
            },] }
];
ButtonMenuComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: DocumentService }
];
ButtonMenuComponent.propDecorators = {
    label: [{ type: Input }],
    open: [{ type: Input }],
    openIcon: [{ type: Input }],
    closeIcon: [{ type: Input }],
    iconOnly: [{ type: Input }],
    split: [{ type: Input }],
    alignMenu: [{ type: Input }],
    placeMenu: [{ type: Input }],
    openChange: [{ type: Output }],
    primaryClick: [{ type: Output }],
    handleKeys: [{ type: HostListener, args: ['keyup', ['$event'],] }]
};

class ButtonMenuModule {
    constructor(iconService) {
        this.iconService = iconService;
        this.iconService.register(ChevronUp16);
    }
}
ButtonMenuModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ButtonMenuComponent],
                exports: [ButtonMenuComponent],
                imports: [CommonModule, ButtonModule, IconModule, ContextMenuModule, UtilsModule],
            },] }
];
ButtonMenuModule.ctorParameters = () => [
    { type: IconService }
];

/**
 * Generated bundle index. Do not edit.
 */

export { ButtonMenuComponent, ButtonMenuModule };
//# sourceMappingURL=ai-apps-angular-button-menu.js.map
