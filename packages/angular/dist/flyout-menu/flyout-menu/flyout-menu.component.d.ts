/**
 *
 * @ai-apps/angular v2.155.1 | flyout-menu.component.d.ts
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
 * [See demo](../../?path=/story/components-flyout-menu--basic)
 *
 * html:
 * ```
 * <ai-flyout-menu>
 *	options
 * </ai-flyout-menu>
 * ```
 *
 * <example-url>../../iframe.html?id=components-flyout-menu--basic</example-url>
 */
export declare class FlyoutMenu implements OnInit {
    protected iconService: IconService;
    /**
     * This specifies any vertical and horizontal offset for the position of the dialog
     */
    set offset(os: {
        x: number;
        y: number;
    });
    get offset(): {
        x: number;
        y: number;
    };
    flip: boolean;
    placement: 'bottom' | 'top' | 'left' | 'right';
    isOpen: boolean;
    isOpenChange: EventEmitter<boolean>;
    private _offset;
    constructor(iconService: IconService);
    ngOnInit(): void;
}
