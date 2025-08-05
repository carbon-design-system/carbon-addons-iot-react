/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-rule-builder.js
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


import { EventEmitter, Component, Input, Output, HostBinding, NgModule } from '@angular/core';
import { I18n, DropdownModule, ButtonModule, IconModule, InputModule, UtilsModule, IconService } from 'carbon-components-angular';
import { CommonModule } from '@angular/common';
import { ContextMenuModule } from 'carbon-components-angular/context-menu';
import Subtract32 from '@carbon/icons/es/subtract/32';
import Add32 from '@carbon/icons/es/add/32';
import TextNewLine32 from '@carbon/icons/es/text--new-line/32';
import { FormsModule } from '@angular/forms';

class RuleComponent {
    constructor(i18n) {
        this.i18n = i18n;
        this.columns = [];
        this.columnOperands = [];
        this.removeRuleLabel = '';
        this.addNewRuleLabel = '';
        this.addNewGroupLabel = '';
        this.ruleChange = new EventEmitter();
        this.removeRule = new EventEmitter();
        this.addRule = new EventEmitter();
    }
    get isRule() {
        return this.rule && !this.rule.groupLogic && !Array.isArray(this.rule.rules);
    }
    get isRuleGroup() {
        return this.rule && this.rule.groupLogic && Array.isArray(this.rule.rules);
    }
    ngOnInit() {
        this.removeRuleLabel = this.removeRuleLabel || this.i18n.get().RULE_BUILDER.REMOVE_RULE;
        this.addNewRuleLabel = this.addNewRuleLabel || this.i18n.get().RULE_BUILDER.ADD_NEW_RULE;
        this.addNewGroupLabel = this.addNewGroupLabel || this.i18n.get().RULE_BUILDER.ADD_NEW_GROUP;
    }
    hasTemplate() {
        const selectedColumn = this.columns.find((column) => column.id === this.rule.columnId);
        return !!(selectedColumn === null || selectedColumn === void 0 ? void 0 : selectedColumn.valueTemplate);
    }
    getTemplate() {
        const selectedColumn = this.columns.find((column) => column.id === this.rule.columnId);
        return selectedColumn === null || selectedColumn === void 0 ? void 0 : selectedColumn.valueTemplate;
    }
    getColumnOperands() {
        const selectedColumn = this.columns.find((column) => column.id === this.rule.columnId);
        if (selectedColumn === null || selectedColumn === void 0 ? void 0 : selectedColumn.operands) {
            return selectedColumn.operands;
        }
        return this.columnOperands;
    }
    getColumns() {
        // we cache this because adding operands throws a "circular" error from cca
        // and doing it on the fly makes ngModel not work
        if (!this.dropdownColumns) {
            this.dropdownColumns = this.columns.map((column) => ({
                content: column.content,
                id: column.id,
                selected: column.selected,
            }));
        }
        return this.dropdownColumns;
    }
}
RuleComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-rule',
                template: `
    <ng-container *ngIf="isRuleGroup">
      <ai-rule-builder-group-logic [id]="rule.id" [(selected)]="rule.groupLogic">
      </ai-rule-builder-group-logic>
      <ng-container *ngFor="let r of rule.rules; let i = index">
        <ai-rule
          (addRule)="addRule.emit($event)"
          (removeRule)="removeRule.emit($event)"
          [columns]="columns"
          [columnOperands]="columnOperands"
          [(rule)]="rule.rules[i]"
        ></ai-rule>
      </ng-container>
    </ng-container>
    <ng-container *ngIf="isRule">
      <ibm-dropdown
        theme="light"
        placeholder="Select a column"
        [(ngModel)]="rule.columnId"
        value="id"
      >
        <ibm-dropdown-list [items]="getColumns()"></ibm-dropdown-list>
      </ibm-dropdown>
      <ibm-dropdown
        theme="light"
        placeholder="Select an operand"
        [(ngModel)]="rule.operand"
        value="id"
      >
        <ibm-dropdown-list [items]="getColumnOperands()"></ibm-dropdown-list>
      </ibm-dropdown>
      <input
        *ngIf="!hasTemplate()"
        ibmText
        theme="light"
        placeholder="Enter a value"
        [(ngModel)]="rule.value"
      />
      <ng-template
        *ngIf="hasTemplate()"
        [ngTemplateOutlet]="getTemplate()"
        [ngTemplateOutletContext]="{ $implicit: rule }"
      >
      </ng-template>
      <div class="iot--rule-builder-rule__actions">
        <button ibmButton="ghost" [iconOnly]="true" (click)="removeRule.emit(rule.id)">
          <svg class="bx--btn__icon" ibmIcon="subtract" size="32"></svg>
          <span class="bx--assistive-text">{{ removeRuleLabel }}</span>
        </button>
        <button ibmButton="ghost" [iconOnly]="true" (click)="addRule.emit({ id: rule.id })">
          <svg class="bx--btn__icon" ibmIcon="add" size="32"></svg>
          <span class="bx--assistive-text">{{ addNewRuleLabel }}</span>
        </button>
        <button
          ibmButton="ghost"
          [iconOnly]="true"
          (click)="addRule.emit({ id: rule.id, isGroup: true })"
        >
          <svg class="bx--btn__icon" ibmIcon="text--new-line" size="32"></svg>
          <span class="bx--assistive-text">{{ addNewGroupLabel }}</span>
        </button>
      </div>
    </ng-container>
  `
            },] }
];
RuleComponent.ctorParameters = () => [
    { type: I18n }
];
RuleComponent.propDecorators = {
    columns: [{ type: Input }],
    columnOperands: [{ type: Input }],
    removeRuleLabel: [{ type: Input }],
    addNewRuleLabel: [{ type: Input }],
    addNewGroupLabel: [{ type: Input }],
    rule: [{ type: Input }],
    ruleChange: [{ type: Output }],
    removeRule: [{ type: Output }],
    addRule: [{ type: Output }],
    isRule: [{ type: HostBinding, args: ['class.iot--rule-builder-rule',] }],
    isRuleGroup: [{ type: HostBinding, args: ['class.iot--rule-builder-rule--group',] }]
};

class RuleBuilderGroupLogicComponent {
    constructor(i18n) {
        this.i18n = i18n;
        /**
         * An array of options for the dropdown
         *
         * Each option is an object containing:
         *
         * `content` - the display value (you can use this for translation)
         * `id` - the value used for selection, should be either `'all'` or `'any'`
         * `selected` - set to `true` for the value selected by default ( by default it's `'all'`)
         */
        this.anyAll = [
            { content: 'ALL', id: 'all', selected: true },
            { content: 'ANY', id: 'any', selected: false },
        ];
        this.selected = 'all';
        this.ofTheFollowingLabel = '';
        this.selectedChange = new EventEmitter();
    }
    ngOnInit() {
        this.ofTheFollowingLabel =
            this.ofTheFollowingLabel || this.i18n.get().RULE_BUILDER.OF_THE_FOLLOWING;
    }
}
RuleBuilderGroupLogicComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-rule-builder-group-logic',
                template: `
    <div class="iot--rule-builder-header__dropdown">
      <ibm-dropdown
        theme="light"
        [ngModel]="selected"
        (ngModelChange)="selectedChange.emit($event)"
        value="id"
      >
        <ibm-dropdown-list [items]="anyAll"></ibm-dropdown-list>
      </ibm-dropdown>
    </div>

    <span>{{ ofTheFollowingLabel }}</span>
  `
            },] }
];
RuleBuilderGroupLogicComponent.ctorParameters = () => [
    { type: I18n }
];
RuleBuilderGroupLogicComponent.propDecorators = {
    anyAll: [{ type: Input }],
    selected: [{ type: Input }],
    ofTheFollowingLabel: [{ type: Input }],
    selectedChange: [{ type: Output }]
};

class RuleBuilderHeaderComponent {
    constructor(i18n) {
        this.i18n = i18n;
        this.ruleClass = true;
        this.addRuleLabel = '';
        this.addNewRuleLabel = '';
        this.addGroupLabel = '';
        this.addNewGroupLabel = '';
        this.groupLogicChange = new EventEmitter();
        this.removeRule = new EventEmitter();
        this.addRule = new EventEmitter();
    }
    ngOnInit() {
        this.addRuleLabel = this.addRuleLabel || this.i18n.get().RULE_BUILDER.ADD_RULE;
        this.addNewRuleLabel = this.addNewRuleLabel || this.i18n.get().RULE_BUILDER.ADD_NEW_RULE;
        this.addGroupLabel = this.addGroupLabel || this.i18n.get().RULE_BUILDER.ADD_GROUP;
        this.addNewGroupLabel = this.addNewGroupLabel || this.i18n.get().RULE_BUILDER.ADD_NEW_GROUP;
    }
}
RuleBuilderHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-rule-builder-header',
                template: `
    <ai-rule-builder-group-logic
      [selected]="groupLogic"
      (selectedChange)="groupLogicChange.emit($event)"
    >
    </ai-rule-builder-group-logic>
    <div class="iot--rule-builder-header__buttons">
      <button ibmButton="ghost" (click)="addRule.emit({})">
        {{ addRuleLabel }}
        <svg class="bx--btn__icon" ibmIcon="add" size="32"></svg>
        <span class="bx--assistive-text">{{ addNewRuleLabel }}</span>
      </button>
      <button ibmButton="ghost" (click)="addRule.emit({ isGroup: true })">
        {{ addGroupLabel }}
        <svg class="bx--btn__icon" ibmIcon="text--new-line" size="32"></svg>
        <span class="bx--assistive-text">{{ addNewGroupLabel }}</span>
      </button>
    </div>
  `
            },] }
];
RuleBuilderHeaderComponent.ctorParameters = () => [
    { type: I18n }
];
RuleBuilderHeaderComponent.propDecorators = {
    ruleClass: [{ type: HostBinding, args: ['class.iot--rule-builder-header',] }],
    groupLogic: [{ type: Input }],
    addRuleLabel: [{ type: Input }],
    addNewRuleLabel: [{ type: Input }],
    addGroupLabel: [{ type: Input }],
    addNewGroupLabel: [{ type: Input }],
    groupLogicChange: [{ type: Output }],
    removeRule: [{ type: Output }],
    addRule: [{ type: Output }]
};

/**
 * RuleBuilder helper function to traverse the tree and find the indicies needed to create
 * a path to the given rule ID
 *
 * @param {array} arr The RuleBuilder tree rules array
 * @param {string} id The id of the rule to find in the tree
 * @param {array} parentIndex an array of ints storing the parent indices in the path
 */
const findRulePathById = (arr, id, parentIndex = []) => {
    if (!Array.isArray(arr)) {
        return [];
    }
    return arr.reduce((i, rule, index) => {
        if (Array.isArray(i) && i.length > 0) {
            return i;
        }
        if (rule.id === id) {
            return [...i, ...parentIndex, index];
        }
        if (rule.rules) {
            return findRulePathById(rule.rules, id, [...parentIndex, index]);
        }
        return i;
    }, []);
};
/**
 * RuleBuilder helper function to filter a rule out of the tree by ID
 *
 * @param {array} arr The RuleBuilder tree rules
 * @param {string} id The ID of the rule to filter out of the tree
 */
const filterRulesById = (arr, id) => {
    if (!Array.isArray(arr)) {
        return [];
    }
    return arr.reduce((carry, rule) => {
        if (rule.rules && rule.rules.length) {
            const rules = filterRulesById(rule.rules, id);
            if (rules.length) {
                return [
                    ...carry,
                    Object.assign(Object.assign({}, rule), { rules }),
                ];
            }
        }
        else if (rule.id !== id) {
            return [...carry, rule];
        }
        return carry;
    }, []);
};
/**
 * RuleBuilder helper function to insert a new rule into the tree after the given path
 *
 * @param {array} arr RuleBuilder tree rules
 * @param {object} rule The rule object to be inserted into the tree
 * @param {array} path The array of indicies making a path to the location after which the rule should be inserted
 */
const insertRuleAfterPath = (arr, rule, path) => {
    if (!Array.isArray(path) || !Array.isArray(arr)) {
        return undefined;
    }
    const insertionPoint = path.pop() + 1;
    let current = arr;
    for (let i = 0; i < path.length; i += 1) {
        if (current[path[i]] && current[path[i]].rules) {
            current = current[path[i]].rules;
        }
        else {
            throw new Error('INVALID_PATH_FOR_RULE_TREE');
        }
    }
    current.splice(insertionPoint, 0, rule);
};
/**
 * Generates a new empty rule
 */
const generateRule = () => {
    return {
        id: Math.random().toString(36).substring(2, 12).padStart(10, '0'),
        columnId: '',
        operand: '',
        value: '',
    };
};
/**
 * Generates a new rule group with one default rule
 */
const generateRuleGroup = () => {
    return {
        id: Math.random().toString(36).substring(2, 12).padStart(10, '0'),
        groupLogic: 'all',
        rules: [generateRule()],
    };
};

class RuleBuilderComponent {
    constructor(i18n) {
        this.i18n = i18n;
        this.columns = [];
        this.columnOperands = [
            { content: 'Not equal', id: 'ne', selected: false },
            { content: 'Less than', id: 'lt', selected: false },
            { content: 'Less than or equal to', id: 'ltoet', selected: false },
            { content: 'Equals', id: 'eq', selected: false },
            { content: 'Greater than or equal to', id: 'gtoet', selected: false },
            { content: 'Greater than', id: 'gt', selected: false },
            { content: 'Contains', id: 'con', selected: false },
        ];
    }
    ngOnInit() {
        this.updateI18nTranslationString();
    }
    updateI18nTranslationString() {
        this.i18n.setLocale('en', {
            RULE_BUILDER: {
                ADD_RULE: 'Add rule',
                REMOVE_RULE: 'Remove rule',
                ADD_NEW_RULE: 'Add new rule',
                ADD_GROUP: 'Add group',
                ADD_NEW_GROUP: 'Add new rule group',
                OF_THE_FOLLOWING: 'of the following are true',
            },
        });
    }
    handleAddRule(id, isGroup) {
        const generate = isGroup ? generateRuleGroup : generateRule;
        if (id) {
            const rulePath = findRulePathById(this.tree.rules, id);
            insertRuleAfterPath(this.tree.rules, generate(), rulePath);
            return;
        }
        this.tree.rules.push(generate());
    }
    handleRemoveRule(id) {
        this.tree.rules = filterRulesById(this.tree.rules, id);
    }
}
RuleBuilderComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-rule-builder',
                template: `
    <div>
      <ai-rule-builder-header
        [(groupLogic)]="tree.groupLogic"
        (addRule)="handleAddRule($event.id, $event.isGroup)"
      ></ai-rule-builder-header>
      <ng-container *ngFor="let rule of tree.rules; let i = index">
        <ai-rule
          (addRule)="handleAddRule($event.id, $event.isGroup)"
          (removeRule)="handleRemoveRule($event)"
          [columns]="columns"
          [columnOperands]="columnOperands"
          [(rule)]="tree.rules[i]"
        ></ai-rule>
      </ng-container>
    </div>
  `
            },] }
];
RuleBuilderComponent.ctorParameters = () => [
    { type: I18n }
];
RuleBuilderComponent.propDecorators = {
    columns: [{ type: Input }],
    columnOperands: [{ type: Input }],
    tree: [{ type: Input }]
};

class RuleBuilderModule {
    constructor(iconService) {
        this.iconService = iconService;
        this.iconService.register(Subtract32);
        this.iconService.register(Add32);
        this.iconService.register(TextNewLine32);
    }
}
RuleBuilderModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    RuleComponent,
                    RuleBuilderComponent,
                    RuleBuilderGroupLogicComponent,
                    RuleBuilderHeaderComponent,
                ],
                exports: [
                    RuleComponent,
                    RuleBuilderComponent,
                    RuleBuilderGroupLogicComponent,
                    RuleBuilderHeaderComponent,
                ],
                imports: [
                    CommonModule,
                    DropdownModule,
                    FormsModule,
                    ButtonModule,
                    IconModule,
                    InputModule,
                    ContextMenuModule,
                    UtilsModule,
                ],
            },] }
];
RuleBuilderModule.ctorParameters = () => [
    { type: IconService }
];

/**
 * Generated bundle index. Do not edit.
 */

export { RuleBuilderComponent, RuleBuilderGroupLogicComponent, RuleBuilderHeaderComponent, RuleBuilderModule, RuleComponent };
//# sourceMappingURL=ai-apps-angular-rule-builder.js.map
