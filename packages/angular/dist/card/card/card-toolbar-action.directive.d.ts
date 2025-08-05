/**
 *
 * @ai-apps/angular v2.155.1 | card-toolbar-action.directive.d.ts
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


import { OnInit } from '@angular/core';
import { OverflowMenu } from 'carbon-components-angular';
/**
 * Directive to apply toolbar specific styles and behavior.
 *
 * May be applied to a button, or other simple element:
 * ```
 * <button aiCardToolbarAction>
 *   <svg ibmIcon="calendar" size="16"></svg>
 * </button>
 * ```
 *
 * It will also apply the correct styles to an `ibm-overflow-menu`. For example:
 * ```
 * <ibm-overflow-menu aiCardToolbarAction>
 *   <ibm-overflow-menu-option>First option</ibm-overflow-menu-option>
 *   <ibm-overflow-menu-option>Second option</ibm-overflow-menu-option>
 *   <ibm-overflow-menu-option>Third option</ibm-overflow-menu-option>
 *   <ibm-overflow-menu-option>Fourth option</ibm-overflow-menu-option>
 * </ibm-overflow-menu>
 * ```
 *
 * For the overflow-menu it will override the `flip`, `offset`, and `triggerClass` to toolbar specific values.
 */
export declare class CardToolbarActionDirective implements OnInit {
    protected overflowMenuRef: OverflowMenu;
    classList: string;
    /**
     *
     * @param overflowMenuRef optional ref to the OverflowMenu instance this directive may be attached to
     */
    constructor(overflowMenuRef: OverflowMenu);
    ngOnInit(): void;
}
