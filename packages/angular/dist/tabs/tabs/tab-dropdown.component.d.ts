/**
 *
 * @ai-apps/angular v2.155.1 | tab-dropdown.component.d.ts
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


import { ElementRef, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { DocumentService, DropdownList, DropdownService } from 'carbon-components-angular';
import { TabController } from './tab-controller.class';
export declare class TabDropdownComponent implements OnInit, OnDestroy {
    protected dropdownService: DropdownService;
    protected elementRef: ElementRef;
    protected documentService: DocumentService;
    controller: TabController;
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
    listTpl: TemplateRef<any>;
    dropdownMenu: ElementRef;
    dropdownButton: ElementRef;
    dropdownList: DropdownList;
    isOpen: boolean;
    displayItems: any;
    constructor(dropdownService: DropdownService, elementRef: ElementRef, documentService: DocumentService);
    ngOnInit(): void;
    onSelect(event: any): void;
    toggleMenu(): void;
    openMenu(): void;
    closeMenu(): void;
    ngOnDestroy(): void;
}
