/**
 *
 * @ai-apps/angular v2.155.1 | flyout-menu.directive.d.ts
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


import { TemplateRef, ElementRef, ViewContainerRef } from '@angular/core';
import { EventService } from 'carbon-components-angular/utils';
import { TooltipDirective, DialogService } from 'carbon-components-angular';
/**
 * selector: `aiFlyoutMenu`
 */
export declare class FlyoutMenuDirective extends TooltipDirective {
    protected elementRef: ElementRef;
    protected viewContainerRef: ViewContainerRef;
    protected dialogService: DialogService;
    protected eventService: EventService;
    /**
     * The string or template content to be exposed by the tooltip.
     */
    aiFlyoutMenu: string | TemplateRef<any>;
    /**
     * Controls wether the overflow menu is flipped
     */
    flip: boolean;
    menuClass: boolean;
    /**
     * bx--tooltip__trigger is inherited from TooltipDirective and it enables focus indication
     */
    className: boolean;
    /**
     * Override tabindex to make it not tabbable
     */
    tabIndex: number;
    get openClass(): boolean;
    get menuBottomClass(): boolean;
    get menuTopClass(): boolean;
    /**
     * Creates an instance of `TooltipDirective`.
     */
    constructor(elementRef: ElementRef, viewContainerRef: ViewContainerRef, dialogService: DialogService, eventService: EventService);
    updateConfig(): void;
}
