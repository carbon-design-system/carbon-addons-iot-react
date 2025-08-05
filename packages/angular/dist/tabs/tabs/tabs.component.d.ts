/**
 *
 * @ai-apps/angular v2.155.1 | tabs.component.d.ts
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


import { ElementRef, TemplateRef } from '@angular/core';
import { TabController } from './tab-controller.class';
export declare class TabsComponent {
    protected elementRef: ElementRef;
    controller: TabController;
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
    titleTpl: TemplateRef<any>;
    constructor(elementRef: ElementRef);
    onSelected(key: any): void;
    getMaxWidth(): string;
}
