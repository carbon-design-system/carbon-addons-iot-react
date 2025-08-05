/**
 *
 * @ai-apps/angular v2.155.1 | rule.component.js
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


import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { I18n } from 'carbon-components-angular';
export class RuleComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcnVsZS1idWlsZGVyL3J1bGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVGLE9BQU8sRUFBRSxJQUFJLEVBQVksTUFBTSwyQkFBMkIsQ0FBQztBQXFFM0QsTUFBTSxPQUFPLGFBQWE7SUF5QnhCLFlBQXNCLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBeEJ2QixZQUFPLEdBQTBCLEVBQUUsQ0FBQztRQUNwQyxtQkFBYyxHQUFvQixFQUFFLENBQUM7UUFFckMsb0JBQWUsR0FBRyxFQUFFLENBQUM7UUFDckIsb0JBQWUsR0FBRyxFQUFFLENBQUM7UUFDckIscUJBQWdCLEdBQUcsRUFBRSxDQUFDO1FBR3JCLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWhDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBRXhDLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBcUMsQ0FBQztJQVl2QyxDQUFDO0lBVnBDLElBQWlELE1BQU07UUFDckQsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVELElBQXdELFdBQVc7UUFDakUsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBTUQsUUFBUTtRQUNOLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7UUFDeEYsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQztRQUN6RixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQztJQUM5RixDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBVyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUYsT0FBTyxDQUFDLEVBQUMsY0FBYyxhQUFkLGNBQWMsdUJBQWQsY0FBYyxDQUFFLGFBQWEsQ0FBQSxDQUFDO0lBQ3pDLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1RixPQUFPLGNBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxhQUFhLENBQUM7SUFDdkMsQ0FBQztJQUVELGlCQUFpQjtRQUNmLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBVyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFNUYsSUFBSSxjQUFjLGFBQWQsY0FBYyx1QkFBZCxjQUFjLENBQUUsUUFBUSxFQUFFO1lBQzVCLE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQztTQUNoQztRQUVELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBRUQsVUFBVTtRQUNSLDJFQUEyRTtRQUMzRSxpREFBaUQ7UUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDbkQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO2dCQUN2QixFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUU7Z0JBQ2IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO2FBQzFCLENBQUMsQ0FBQyxDQUFDO1NBQ0w7UUFFRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDOUIsQ0FBQzs7O1lBcElGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsU0FBUztnQkFDbkIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErRFQ7YUFDRjs7O1lBcEVRLElBQUk7OztzQkFzRVYsS0FBSzs2QkFDTCxLQUFLOzhCQUVMLEtBQUs7OEJBQ0wsS0FBSzsrQkFDTCxLQUFLO21CQUVMLEtBQUs7eUJBQ0wsTUFBTTt5QkFFTixNQUFNO3NCQUVOLE1BQU07cUJBRU4sV0FBVyxTQUFDLDhCQUE4QjswQkFJMUMsV0FBVyxTQUFDLHFDQUFxQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJMThuLCBMaXN0SXRlbSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhaS1ydWxlJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXNSdWxlR3JvdXBcIj5cbiAgICAgIDxhaS1ydWxlLWJ1aWxkZXItZ3JvdXAtbG9naWMgW2lkXT1cInJ1bGUuaWRcIiBbKHNlbGVjdGVkKV09XCJydWxlLmdyb3VwTG9naWNcIj5cbiAgICAgIDwvYWktcnVsZS1idWlsZGVyLWdyb3VwLWxvZ2ljPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgciBvZiBydWxlLnJ1bGVzOyBsZXQgaSA9IGluZGV4XCI+XG4gICAgICAgIDxhaS1ydWxlXG4gICAgICAgICAgKGFkZFJ1bGUpPVwiYWRkUnVsZS5lbWl0KCRldmVudClcIlxuICAgICAgICAgIChyZW1vdmVSdWxlKT1cInJlbW92ZVJ1bGUuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICBbY29sdW1uc109XCJjb2x1bW5zXCJcbiAgICAgICAgICBbY29sdW1uT3BlcmFuZHNdPVwiY29sdW1uT3BlcmFuZHNcIlxuICAgICAgICAgIFsocnVsZSldPVwicnVsZS5ydWxlc1tpXVwiXG4gICAgICAgID48L2FpLXJ1bGU+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXNSdWxlXCI+XG4gICAgICA8aWJtLWRyb3Bkb3duXG4gICAgICAgIHRoZW1lPVwibGlnaHRcIlxuICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBhIGNvbHVtblwiXG4gICAgICAgIFsobmdNb2RlbCldPVwicnVsZS5jb2x1bW5JZFwiXG4gICAgICAgIHZhbHVlPVwiaWRcIlxuICAgICAgPlxuICAgICAgICA8aWJtLWRyb3Bkb3duLWxpc3QgW2l0ZW1zXT1cImdldENvbHVtbnMoKVwiPjwvaWJtLWRyb3Bkb3duLWxpc3Q+XG4gICAgICA8L2libS1kcm9wZG93bj5cbiAgICAgIDxpYm0tZHJvcGRvd25cbiAgICAgICAgdGhlbWU9XCJsaWdodFwiXG4gICAgICAgIHBsYWNlaG9sZGVyPVwiU2VsZWN0IGFuIG9wZXJhbmRcIlxuICAgICAgICBbKG5nTW9kZWwpXT1cInJ1bGUub3BlcmFuZFwiXG4gICAgICAgIHZhbHVlPVwiaWRcIlxuICAgICAgPlxuICAgICAgICA8aWJtLWRyb3Bkb3duLWxpc3QgW2l0ZW1zXT1cImdldENvbHVtbk9wZXJhbmRzKClcIj48L2libS1kcm9wZG93bi1saXN0PlxuICAgICAgPC9pYm0tZHJvcGRvd24+XG4gICAgICA8aW5wdXRcbiAgICAgICAgKm5nSWY9XCIhaGFzVGVtcGxhdGUoKVwiXG4gICAgICAgIGlibVRleHRcbiAgICAgICAgdGhlbWU9XCJsaWdodFwiXG4gICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgYSB2YWx1ZVwiXG4gICAgICAgIFsobmdNb2RlbCldPVwicnVsZS52YWx1ZVwiXG4gICAgICAvPlxuICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICpuZ0lmPVwiaGFzVGVtcGxhdGUoKVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImdldFRlbXBsYXRlKClcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IHJ1bGUgfVwiXG4gICAgICA+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPGRpdiBjbGFzcz1cImlvdC0tcnVsZS1idWlsZGVyLXJ1bGVfX2FjdGlvbnNcIj5cbiAgICAgICAgPGJ1dHRvbiBpYm1CdXR0b249XCJnaG9zdFwiIFtpY29uT25seV09XCJ0cnVlXCIgKGNsaWNrKT1cInJlbW92ZVJ1bGUuZW1pdChydWxlLmlkKVwiPlxuICAgICAgICAgIDxzdmcgY2xhc3M9XCJieC0tYnRuX19pY29uXCIgaWJtSWNvbj1cInN1YnRyYWN0XCIgc2l6ZT1cIjMyXCI+PC9zdmc+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJieC0tYXNzaXN0aXZlLXRleHRcIj57eyByZW1vdmVSdWxlTGFiZWwgfX08L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGlibUJ1dHRvbj1cImdob3N0XCIgW2ljb25Pbmx5XT1cInRydWVcIiAoY2xpY2spPVwiYWRkUnVsZS5lbWl0KHsgaWQ6IHJ1bGUuaWQgfSlcIj5cbiAgICAgICAgICA8c3ZnIGNsYXNzPVwiYngtLWJ0bl9faWNvblwiIGlibUljb249XCJhZGRcIiBzaXplPVwiMzJcIj48L3N2Zz5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImJ4LS1hc3Npc3RpdmUtdGV4dFwiPnt7IGFkZE5ld1J1bGVMYWJlbCB9fTwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBpYm1CdXR0b249XCJnaG9zdFwiXG4gICAgICAgICAgW2ljb25Pbmx5XT1cInRydWVcIlxuICAgICAgICAgIChjbGljayk9XCJhZGRSdWxlLmVtaXQoeyBpZDogcnVsZS5pZCwgaXNHcm91cDogdHJ1ZSB9KVwiXG4gICAgICAgID5cbiAgICAgICAgICA8c3ZnIGNsYXNzPVwiYngtLWJ0bl9faWNvblwiIGlibUljb249XCJ0ZXh0LS1uZXctbGluZVwiIHNpemU9XCIzMlwiPjwvc3ZnPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYngtLWFzc2lzdGl2ZS10ZXh0XCI+e3sgYWRkTmV3R3JvdXBMYWJlbCB9fTwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgUnVsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGNvbHVtbnM6IEFycmF5PExpc3RJdGVtIHwgYW55PiA9IFtdO1xuICBASW5wdXQoKSBjb2x1bW5PcGVyYW5kczogQXJyYXk8TGlzdEl0ZW0+ID0gW107XG5cbiAgQElucHV0KCkgcmVtb3ZlUnVsZUxhYmVsID0gJyc7XG4gIEBJbnB1dCgpIGFkZE5ld1J1bGVMYWJlbCA9ICcnO1xuICBASW5wdXQoKSBhZGROZXdHcm91cExhYmVsID0gJyc7XG5cbiAgQElucHV0KCkgcnVsZTogYW55O1xuICBAT3V0cHV0KCkgcnVsZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBAT3V0cHV0KCkgcmVtb3ZlUnVsZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIEBPdXRwdXQoKSBhZGRSdWxlID0gbmV3IEV2ZW50RW1pdHRlcjx7IGlkOiBzdHJpbmc7IGlzR3JvdXA/OiBib29sZWFuIH0+KCk7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLXJ1bGUtYnVpbGRlci1ydWxlJykgZ2V0IGlzUnVsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5ydWxlICYmICF0aGlzLnJ1bGUuZ3JvdXBMb2dpYyAmJiAhQXJyYXkuaXNBcnJheSh0aGlzLnJ1bGUucnVsZXMpO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLXJ1bGUtYnVpbGRlci1ydWxlLS1ncm91cCcpIGdldCBpc1J1bGVHcm91cCgpIHtcbiAgICByZXR1cm4gdGhpcy5ydWxlICYmIHRoaXMucnVsZS5ncm91cExvZ2ljICYmIEFycmF5LmlzQXJyYXkodGhpcy5ydWxlLnJ1bGVzKTtcbiAgfVxuXG4gIGRyb3Bkb3duQ29sdW1uczogQXJyYXk8TGlzdEl0ZW0+O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpMThuOiBJMThuKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucmVtb3ZlUnVsZUxhYmVsID0gdGhpcy5yZW1vdmVSdWxlTGFiZWwgfHwgdGhpcy5pMThuLmdldCgpLlJVTEVfQlVJTERFUi5SRU1PVkVfUlVMRTtcbiAgICB0aGlzLmFkZE5ld1J1bGVMYWJlbCA9IHRoaXMuYWRkTmV3UnVsZUxhYmVsIHx8IHRoaXMuaTE4bi5nZXQoKS5SVUxFX0JVSUxERVIuQUREX05FV19SVUxFO1xuICAgIHRoaXMuYWRkTmV3R3JvdXBMYWJlbCA9IHRoaXMuYWRkTmV3R3JvdXBMYWJlbCB8fCB0aGlzLmkxOG4uZ2V0KCkuUlVMRV9CVUlMREVSLkFERF9ORVdfR1JPVVA7XG4gIH1cblxuICBoYXNUZW1wbGF0ZSgpIHtcbiAgICBjb25zdCBzZWxlY3RlZENvbHVtbiA9IHRoaXMuY29sdW1ucy5maW5kKChjb2x1bW46IGFueSkgPT4gY29sdW1uLmlkID09PSB0aGlzLnJ1bGUuY29sdW1uSWQpO1xuICAgIHJldHVybiAhIXNlbGVjdGVkQ29sdW1uPy52YWx1ZVRlbXBsYXRlO1xuICB9XG5cbiAgZ2V0VGVtcGxhdGUoKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRDb2x1bW4gPSB0aGlzLmNvbHVtbnMuZmluZCgoY29sdW1uOiBhbnkpID0+IGNvbHVtbi5pZCA9PT0gdGhpcy5ydWxlLmNvbHVtbklkKTtcbiAgICByZXR1cm4gc2VsZWN0ZWRDb2x1bW4/LnZhbHVlVGVtcGxhdGU7XG4gIH1cblxuICBnZXRDb2x1bW5PcGVyYW5kcygpIHtcbiAgICBjb25zdCBzZWxlY3RlZENvbHVtbiA9IHRoaXMuY29sdW1ucy5maW5kKChjb2x1bW46IGFueSkgPT4gY29sdW1uLmlkID09PSB0aGlzLnJ1bGUuY29sdW1uSWQpO1xuXG4gICAgaWYgKHNlbGVjdGVkQ29sdW1uPy5vcGVyYW5kcykge1xuICAgICAgcmV0dXJuIHNlbGVjdGVkQ29sdW1uLm9wZXJhbmRzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvbHVtbk9wZXJhbmRzO1xuICB9XG5cbiAgZ2V0Q29sdW1ucygpIHtcbiAgICAvLyB3ZSBjYWNoZSB0aGlzIGJlY2F1c2UgYWRkaW5nIG9wZXJhbmRzIHRocm93cyBhIFwiY2lyY3VsYXJcIiBlcnJvciBmcm9tIGNjYVxuICAgIC8vIGFuZCBkb2luZyBpdCBvbiB0aGUgZmx5IG1ha2VzIG5nTW9kZWwgbm90IHdvcmtcbiAgICBpZiAoIXRoaXMuZHJvcGRvd25Db2x1bW5zKSB7XG4gICAgICB0aGlzLmRyb3Bkb3duQ29sdW1ucyA9IHRoaXMuY29sdW1ucy5tYXAoKGNvbHVtbikgPT4gKHtcbiAgICAgICAgY29udGVudDogY29sdW1uLmNvbnRlbnQsXG4gICAgICAgIGlkOiBjb2x1bW4uaWQsXG4gICAgICAgIHNlbGVjdGVkOiBjb2x1bW4uc2VsZWN0ZWQsXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZHJvcGRvd25Db2x1bW5zO1xuICB9XG59XG4iXX0=