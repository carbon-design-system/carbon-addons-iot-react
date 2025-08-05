/**
 *
 * @ai-apps/angular v2.155.1 | side-panel.component.d.ts
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


import { EventEmitter, OnInit } from '@angular/core';
import { IconService } from 'carbon-components-angular';
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
export declare class SidePanel implements OnInit {
    protected iconService: IconService;
    sidePanelClass: boolean;
    get sidePanelSlideInClass(): boolean;
    get sidePanelInlineClass(): boolean;
    get sidePanelSlideOverClass(): boolean;
    get sidePanelRightClass(): boolean;
    get sidePanelDrawerClass(): boolean;
    showClose: boolean;
    showDrawer: boolean;
    /**
     * Name of the icon to use when `showDrawer` is `true` and `active` is `false`
     */
    drawerIcon: string;
    /**
     * Name of the icon to use as close icon when `showDrawer` is `true`
     */
    closeIcon: string;
    variation: 'slide-in' | 'inline' | 'slide-over';
    /**
     * Activates the panel when set to `true`, by sliding it in or over.
     *
     * Has no effect for `variation` `inline`
     */
    active: boolean;
    /**
     * Enables overlay when active with `variation` `slide-over`.
     */
    overlay: false;
    side: 'left' | 'right';
    close: EventEmitter<any>;
    get shouldShowDrawer(): boolean;
    constructor(iconService: IconService);
    ngOnInit(): void;
}
