import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ListItem } from 'carbon-components-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'ai-rule',
  template: `
    <ng-container *ngIf="isRuleGroup">
      <ai-rule-builder-group-logic [id]="rule.id" [(selected)]="rule.groupLogic">
      </ai-rule-builder-group-logic>
      <ng-container *ngFor="let rule of rule.rules">
        <ai-rule
          (addRule)="addRule.emit($event)"
          (removeRule)="removeRule.emit($event)"
          [columns]="columns"
          [columnOperands]="columnOperands"
          [(rule)]="rule"
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
        <ibm-dropdown-list [items]="columns"></ibm-dropdown-list>
      </ibm-dropdown>
      <ibm-dropdown
        theme="light"
        placeholder="Select an operand"
        [(ngModel)]="rule.operand"
        value="id"
      >
        <ibm-dropdown-list [items]="columnOperands"></ibm-dropdown-list>
      </ibm-dropdown>
      <input ibmText theme="light" placeholder="Enter a value" [(ngModel)]="rule.value" />
      <div class="iot--rule-builder-rule__actions">
        <button ibmButton="ghost" [iconOnly]="true" (click)="removeRule.emit(rule.id)">
          <svg class="bx--btn__icon" ibmIcon="subtract" size="32"></svg>
          <span class="bx--assistive-text">Remove rule</span>
        </button>
        <button ibmButton="ghost" [iconOnly]="true" (click)="addRule.emit({ id: rule.id })">
          <svg class="bx--btn__icon" ibmIcon="add" size="32"></svg>
          <span class="bx--assistive-text">Add new rule</span>
        </button>
        <button
          ibmButton="ghost"
          [iconOnly]="true"
          (click)="addRule.emit({ id: rule.id, isGroup: true })"
        >
          <svg class="bx--btn__icon" ibmIcon="text--new-line" size="32"></svg>
          <span class="bx--assistive-text">Add new rule group</span>
        </button>
      </div>
    </ng-container>
  `,
})
export class RuleComponent {
  @Input() columns: Array<ListItem> | Observable<Array<ListItem>> = [];
  @Input() columnOperands: Array<ListItem> | Observable<Array<ListItem>> = [];

  @Input() rule: any;
  @Output() ruleChange = new EventEmitter();

  @Output() removeRule = new EventEmitter<string>();

  @Output() addRule = new EventEmitter<{ id: string; isGroup: boolean }>();

  @HostBinding('class.iot--rule-builder-rule') get isRule() {
    return this.rule && !this.rule.groupLogic && !Array.isArray(this.rule.rules);
  }

  @HostBinding('class.iot--rule-builder-rule--group') get isRuleGroup() {
    return this.rule && this.rule.groupLogic && Array.isArray(this.rule.rules);
  }

  constructor() {}
}
