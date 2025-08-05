/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-tabs.js
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


import { Component, Input, ElementRef, ViewChild, Directive, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab, DropdownService, DocumentService, DropdownList, Button, TabsModule as TabsModule$1, IconModule, DropdownModule, ButtonModule, UtilsModule } from 'carbon-components-angular';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { TabHeader as TabHeader$1 } from 'carbon-components-angular/tabs';
import { ContextMenuModule } from 'carbon-components-angular/context-menu';

class TabController {
    constructor(tabList = []) {
        this.selection = new BehaviorSubject(null);
        this.tabSource = new BehaviorSubject([]);
        this.tabListWithSelection = combineLatest([this.selection, this.tabSource]).pipe(map(([selection, tabs]) => {
            return tabs.map((tab) => {
                return Object.assign(Object.assign({}, tab), { selected: selection === tab.key });
            });
        }));
        this.tabSource.next(tabList);
        this.tabList = this.tabSource.asObservable();
    }
    setTabs(tabList) {
        this.tabSource.next(tabList);
    }
    getTabs() {
        return this.tabSource.getValue();
    }
    addTab(tab) {
        this.setTabs([...this.tabSource.getValue(), tab]);
    }
    selectTab(key) {
        this.selection.next(key);
    }
    updateTab(updatedTab) {
        const updatedTabs = this.tabSource.getValue().map((tab) => {
            if (tab.key === updatedTab.key) {
                return updatedTab;
            }
            return tab;
        });
        this.setTabs(updatedTabs);
    }
    removeTab(key) {
        var _a;
        const tabs = this.tabSource.getValue();
        const index = tabs.findIndex((tab) => tab.key === key);
        const filteredTabs = tabs.filter((tab) => tab.key !== key);
        this.setTabs(filteredTabs);
        return index > 0 ? filteredTabs[index - 1].key : (_a = filteredTabs[0]) === null || _a === void 0 ? void 0 : _a.key;
    }
}

class TabComponent extends Tab {
    ngOnInit() {
        // use a subscription to set this.active since that affects a number of other
        // tab internals
        this.selectionSubscription = this.controller.selection.subscribe((key) => {
            this.active = key === this.key;
        });
    }
    ngOnDestroy() {
        this.selectionSubscription.unsubscribe();
    }
}
TabComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-tab',
                template: `
    <div
      [attr.tabindex]="tabIndex"
      role="tabpanel"
      *ngIf="shouldRender()"
      class="bx--tab-content"
      [ngStyle]="{
        display: active ? null : 'none'
      }"
      [attr.aria-labelledby]="id + '-header'"
      aria-live="polite"
    >
      <ng-content></ng-content>
    </div>
  `
            },] }
];
TabComponent.propDecorators = {
    key: [{ type: Input }],
    controller: [{ type: Input }]
};

class TabsComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        /**
         * Template to bind to header titles (optional).
         * Tab item is passed in as context.
         *
         * For example:
         *
         * controller = new TabController([
         *  {
         *    title: 'One',
         *    icon: 'edit'
         *  }
         * ]);
         *
         * // Tab items are passed in as context in the form "{tab: tab}" so the let-<your_var_name>="tab" is necessary
         * <ng-template #titleTpl let-tab="tab">
         *  <svg *ngIf="tab.icon" [ibmIcon]="tab.icon" size="16"></svg>
         *  {{ tab.title }}
         * </ng-template>
         *
         * <ai-tabs [controller]="controller" [titleTpl]="titleTpl"></ai-tabs>
         */
        this.titleTpl = null;
    }
    onSelected(key) {
        this.controller.selectTab(key);
    }
    getMaxWidth() {
        const actions = this.elementRef.nativeElement.querySelector('ai-tab-actions');
        if (!actions) {
            return null;
        }
        return `calc(100% - ${getComputedStyle(actions).width})`;
    }
}
TabsComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-tabs',
                template: `
    <ibm-tab-header-group
      [ngStyle]="{
        'max-width': getMaxWidth()
      }"
    >
      <ai-tab-header
        *ngFor="let tab of controller.getTabs()"
        [active]="(controller.selection | async) === tab.key"
        [tab]="tab"
        [actions]="tab.actions"
        (selected)="onSelected(tab.key)"
      >
        <div class="iot--tab__title-container">
          <span *ngIf="!titleTpl">{{ tab.title }}</span>
          <ng-container
            *ngIf="titleTpl"
            [ngTemplateOutlet]="titleTpl"
            [ngTemplateOutletContext]="{ tab: tab }"
          >
          </ng-container>
        </div>
      </ai-tab-header>
    </ibm-tab-header-group>
    <ng-content select="ai-tab-actions"></ng-content>
  `,
                styles: [`
      :host {
        display: flex;
      }
    `]
            },] }
];
TabsComponent.ctorParameters = () => [
    { type: ElementRef }
];
TabsComponent.propDecorators = {
    controller: [{ type: Input }],
    titleTpl: [{ type: Input }]
};

class TabDropdownComponent {
    constructor(dropdownService, elementRef, documentService) {
        this.dropdownService = dropdownService;
        this.elementRef = elementRef;
        this.documentService = documentService;
        /**
         * Template to bind to items in the `DropdownList` (optional).
         * `DropdownList` items generated from the `Tab` items are passed in as context.
         * Additional props can included in the generation of the `DropdownList` items through
         * the `dropdownListProps` field in the `Tab`s.
         *
         * For example:
         *
         * controller = new TabController([
         *  {
         *    title: 'One',
         *    dropdownListProps: {
         *      icon: 'settings'
         *    }
         *  }
         * ]);
         *
         * // List items are passed in as context in the form "{item: item}" so the let-<your_var_name>="item" is necessary
         * <ng-template #listTpl let-item="item">
         *  <svg *ngIf="item.icon" [ibmIcon]="item.icon" size="16"></svg>
         *  {{ item.content }}
         * </ng-template>
         *
         * <ai-tabs [controller]="controller" [titleTpl]="titleTpl">
         *  <ai-tab-actions>
         *    <ai-tab-dropdown [controller]="controller" [listTpl]="listTpl"></ai-tab-dropdown>
         *  </ai-tab-actions>
         * </ai-tabs>
         */
        this.listTpl = null;
        this.isOpen = false;
    }
    ngOnInit() {
        // TODO: update dropdown service to handle menus fixed to the right side of the trigger
        this.dropdownService.offset = {
            /**
             * 105 = 210 / 2 the dropdown service will center the menu and
             * then align it to the left edge of the trigger element
             */
            left: 105,
        };
        this.documentService.handleClick((event) => {
            const hostElement = this.elementRef.nativeElement;
            const menuElement = this.dropdownMenu.nativeElement;
            const target = event.target;
            if (this.isOpen && !hostElement.contains(target) && !menuElement.contains(target)) {
                this.closeMenu();
            }
        });
        this.displayItems = this.controller.tabListWithSelection.pipe(map((list) => {
            return list.map((item) => (Object.assign({ content: item.title, key: item.key, selected: item.selected }, item.dropdownListProps)));
        }));
    }
    onSelect(event) {
        if (!event.isUpdate) {
            this.controller.selectTab(event.item.key);
            this.closeMenu();
        }
    }
    toggleMenu() {
        if (!this.isOpen) {
            this.openMenu();
        }
        else {
            this.closeMenu();
        }
    }
    openMenu() {
        this.isOpen = true;
        const wrapper = this.dropdownService.appendToBody(this.dropdownButton.nativeElement, this.dropdownMenu.nativeElement, '');
        wrapper.style.width = '250px';
        this.dropdownList.initFocus();
    }
    closeMenu() {
        this.isOpen = false;
        this.dropdownService.appendToDropdown(this.elementRef.nativeElement);
    }
    ngOnDestroy() {
        this.closeMenu();
    }
}
TabDropdownComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-tab-dropdown',
                template: `
    <button aiTabAction #dropdownButton (click)="toggleMenu()">
      <svg class="bx--btn__icon" ibmIcon="chevron--down" size="16"></svg>
    </button>
    <div style="display: none;" class="dropdown-menu bx--list-box--expanded" #dropdownMenu>
      <ibm-dropdown-list [items]="displayItems" (select)="onSelect($event)" [listTpl]="listTpl">
      </ibm-dropdown-list>
    </div>
  `,
                providers: [DropdownService]
            },] }
];
TabDropdownComponent.ctorParameters = () => [
    { type: DropdownService },
    { type: ElementRef },
    { type: DocumentService }
];
TabDropdownComponent.propDecorators = {
    controller: [{ type: Input }],
    listTpl: [{ type: Input }],
    dropdownMenu: [{ type: ViewChild, args: ['dropdownMenu', { static: true },] }],
    dropdownButton: [{ type: ViewChild, args: ['dropdownButton', { static: true },] }],
    dropdownList: [{ type: ViewChild, args: [DropdownList,] }]
};

class TabActionDirective extends Button {
    constructor(elementRef) {
        super();
        this.elementRef = elementRef;
    }
    ngOnInit() {
        this.ibmButton = 'ghost';
        this.size = 'sm';
        this.iconOnly = true;
        const el = this.elementRef.nativeElement;
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.justifyContent = 'center';
    }
}
TabActionDirective.decorators = [
    { type: Directive, args: [{
                selector: '[aiTabAction]',
            },] }
];
TabActionDirective.ctorParameters = () => [
    { type: ElementRef }
];

class TabActionsComponent {
}
TabActionsComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-tab-actions',
                template: ` <ng-content></ng-content> `,
                styles: [`
      :host {
        display: flex;
      }
    `]
            },] }
];

class TabHeader extends TabHeader$1 {
    constructor(elementRef, documentService) {
        super();
        this.elementRef = elementRef;
        this.documentService = documentService;
        this.actions = [];
        this.tabAction = null;
        this.tabActions = null;
        this.menuOpen = false;
        this.menuPosition = {
            top: 0,
            left: 0,
        };
    }
    ngOnChanges(changes) {
        var _a;
        const actions = (_a = changes.actions) === null || _a === void 0 ? void 0 : _a.currentValue;
        if (actions) {
            if (actions.length === 1) {
                this.tabAction = Object.assign({}, {
                    title: '',
                    icon: 'close',
                    onClick: () => { },
                }, actions[0]);
            }
            else if (actions.length > 1) {
                this.tabActions = actions.map((action) => Object.assign({}, {
                    title: '',
                    icon: '',
                    onClick: () => { },
                }, action));
            }
        }
    }
    ngAfterViewInit() {
        this.documentService.handleClick((event) => {
            const { nativeElement } = this.elementRef;
            if (this.menuOpen && !nativeElement.contains(event.target)) {
                this.menuOpen = false;
            }
        });
    }
    onActionClick(action) {
        action.onClick(this.tab);
        this.menuOpen = false;
    }
    onTabMenuClick(event) {
        const target = event.target;
        const button = target.closest('button');
        const buttonRect = button.getBoundingClientRect();
        const menuRect = button.parentElement
            .querySelector('.bx--context-menu')
            .getBoundingClientRect();
        this.menuOpen = !this.menuOpen;
        this.menuPosition = {
            top: buttonRect.top + buttonRect.height,
            left: buttonRect.right - menuRect.width,
        };
    }
}
TabHeader.decorators = [
    { type: Component, args: [{
                selector: 'ai-tab-header',
                template: `
    <li
      [ngClass]="{
        'bx--tabs__nav-item--selected bx--tabs--scrollable__nav-item--selected': active,
        'bx--tabs__nav-item--disabled bx--tabs--scrollable__nav-item--disabled': disabled
      }"
      class="bx--tabs--scrollable__nav-item"
      role="presentation"
      (click)="selectTab()"
    >
      <div
        class="bx--tabs--scrollable__nav-link"
        #tabItem
        [attr.aria-selected]="active"
        draggable="false"
        [title]="title"
        [attr.tabindex]="active ? 0 : -1"
        role="tab"
      >
        <div class="ai--tabs--header_content">
          <ng-content></ng-content>
        </div>
        <ng-container *ngIf="tabAction">
          <button
            ibmButton="ghost"
            class="ai--tabs--header_action"
            [title]="tabAction.title"
            (click)="onActionClick(tabAction)"
          >
            <svg [ibmIcon]="tabAction.icon" size="16"></svg>
          </button>
        </ng-container>
        <ng-container *ngIf="tabActions">
          <button
            ibmButton="ghost"
            class="ai--tabs--header_action"
            (click)="onTabMenuClick($event)"
          >
            <svg ibmIcon="overflow-menu--vertical" size="16"></svg>
          </button>
          <ibm-context-menu [open]="menuOpen" [position]="menuPosition">
            <ibm-context-menu-item
              *ngFor="let action of tabActions"
              [label]="action.title"
              [icon]="action.icon"
              (click)="onActionClick(action)"
              (keydown.enter)="onActionClick(action)"
              (keydown.space)="onActionClick(action)"
            >
            </ibm-context-menu-item>
          </ibm-context-menu>
        </ng-container>
      </div>
    </li>
  `,
                providers: [
                    {
                        provide: TabHeader$1,
                        useExisting: TabHeader,
                    },
                ],
                styles: [`
      .bx--tabs--scrollable__nav-link {
        display: flex;
        align-items: end;
      }

      ::ng-deep .bx--tabs--scrollable .bx--tabs--scrollable__nav-link {
        padding: 0;
      }

      .ai--tabs--header_content {
        width: 100%;
        padding: 0.75rem 1rem 0.5rem;
      }

      .ai--tabs--header_action {
        padding: 0;
        min-height: 0;
        height: 1.5rem;
        width: 1.5rem;
        align-content: center;
        justify-content: center;
        margin-bottom: 0.3rem;
        margin-right: 0.5rem;
      }
    `]
            },] }
];
TabHeader.ctorParameters = () => [
    { type: ElementRef },
    { type: DocumentService }
];
TabHeader.propDecorators = {
    tab: [{ type: Input }],
    actions: [{ type: Input }]
};

class TabsModule {
}
TabsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    TabsComponent,
                    TabComponent,
                    TabDropdownComponent,
                    TabActionsComponent,
                    TabActionDirective,
                    TabHeader,
                ],
                imports: [
                    CommonModule,
                    TabsModule$1,
                    IconModule,
                    DropdownModule,
                    ButtonModule,
                    UtilsModule,
                    ContextMenuModule,
                ],
                exports: [
                    TabsComponent,
                    TabComponent,
                    TabDropdownComponent,
                    TabActionsComponent,
                    TabActionDirective,
                    TabHeader,
                ],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { TabActionDirective, TabActionsComponent, TabComponent, TabDropdownComponent, TabHeader, TabsComponent, TabsModule };
//# sourceMappingURL=ai-apps-angular-tabs.js.map
