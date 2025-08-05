/**
 *
 * @ai-apps/angular v2.155.1 | rule-builder-group-logic.component.d.ts
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
import { I18n } from 'carbon-components-angular';
export declare class RuleBuilderGroupLogicComponent implements OnInit {
    protected i18n: I18n;
    /**
     * An array of options for the dropdown
     *
     * Each option is an object containing:
     *
     * `content` - the display value (you can use this for translation)
     * `id` - the value used for selection, should be either `'all'` or `'any'`
     * `selected` - set to `true` for the value selected by default ( by default it's `'all'`)
     */
    anyAll: {
        content: string;
        id: string;
        selected: boolean;
    }[];
    selected: 'any' | 'all';
    ofTheFollowingLabel: string;
    selectedChange: EventEmitter<any>;
    constructor(i18n: I18n);
    ngOnInit(): void;
}
