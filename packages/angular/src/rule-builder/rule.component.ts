import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { I18n, ListItem } from 'carbon-components-angular';

@Component({
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
  `,
})
export class RuleComponent implements OnInit {
  @Input() columns: Array<ListItem | any> = [];
  @Input() columnOperands: Array<ListItem> = [];

  @Input() removeRuleLabel = '';
  @Input() addNewRuleLabel = '';
  @Input() addNewGroupLabel = '';

  @Input() rule: any;
  @Output() ruleChange = new EventEmitter();

  @Output() removeRule = new EventEmitter<string>();

  @Output() addRule = new EventEmitter<{ id: string; isGroup?: boolean }>();

  @HostBinding('class.iot--rule-builder-rule') get isRule() {
    return this.rule && !this.rule.groupLogic && !Array.isArray(this.rule.rules);
  }

  @HostBinding('class.iot--rule-builder-rule--group') get isRuleGroup() {
    return this.rule && this.rule.groupLogic && Array.isArray(this.rule.rules);
  }

  dropdownColumns: Array<ListItem>;

  constructor(protected i18n: I18n) {}

  ngOnInit() {
    this.removeRuleLabel = this.removeRuleLabel || this.i18n.get().RULE_BUILDER.REMOVE_RULE;
    this.addNewRuleLabel = this.addNewRuleLabel || this.i18n.get().RULE_BUILDER.ADD_NEW_RULE;
    this.addNewGroupLabel = this.addNewGroupLabel || this.i18n.get().RULE_BUILDER.ADD_NEW_GROUP;
  }

  hasTemplate() {
    const selectedColumn = this.columns.find((column: any) => column.id === this.rule.columnId);
    return !!selectedColumn?.valueTemplate;
  }

  getTemplate() {
    const selectedColumn = this.columns.find((column: any) => column.id === this.rule.columnId);
    return selectedColumn?.valueTemplate;
  }

  getColumnOperands() {
    const selectedColumn = this.columns.find((column: any) => column.id === this.rule.columnId);

    if (selectedColumn?.operands) {
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
