/**
 *
 * @ai-apps/angular v2.155.1 | rule-builder.component.d.ts
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
import { I18n, ListItem } from 'carbon-components-angular';
export declare class RuleBuilderComponent implements OnInit {
    protected i18n: I18n;
    columns: Array<any>;
    columnOperands: Array<ListItem>;
    /**
     * Example Structure:
     * {
     *   id: '14p5ho3pcu',
     *   groupLogic: 'all',
     *   rules: [
     *     {
     *       id: 'rsiru4rjba',
     *       columnId: 'column2',
     *       operand: 'eq',
     *       value: '45',
     *     },
     *     {
     *       id: 'i34imt0geh',
     *       groupLogic: 'any',
     *       rules: [
     *         {
     *           id: 'ewc2z5kyfu',
     *           columnId: 'column2',
     *           operand: 'gtoet',
     *           value: '46',
     *         },
     *       ],
     *     }
     *   ]
     * }
     */
    tree: any;
    constructor(i18n: I18n);
    ngOnInit(): void;
    updateI18nTranslationString(): void;
    handleAddRule(id: string, isGroup: any): void;
    handleRemoveRule(id: string): void;
}
