import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'ai-rule-builder-header',
  template: `
    <ai-rule-builder-group-logic
      [id]="id"
      [selected]="groupLogic"
      (selectedChange)="groupLogicChange.emit($event)"
    >
    </ai-rule-builder-group-logic>
    <div class="iot--rule-builder-header__buttons">
      <button ibmButton="ghost" (click)="addRule.emit({})">
        Add rule
        <svg class="bx--btn__icon" ibmIcon="add" size="32"></svg>
        <span class="bx--assistive-text">Add new rule</span>
      </button>
      <button ibmButton="ghost" (click)="addRule.emit({ isGroup: true })">
        Add group
        <svg class="bx--btn__icon" ibmIcon="text--new-line" size="32"></svg>
        <span class="bx--assistive-text">Add new rule group</span>
      </button>
    </div>
  `,
})
export class RuleBuilderHeaderComponent {
  @HostBinding('class.iot--rule-builder-header') ruleClass = true;
  @Input() groupLogic: string;
  @Output() groupLogicChange = new EventEmitter();

  @Output() removeRule = new EventEmitter<string>();

  @Output() addRule = new EventEmitter<{ id: string; isGroup: boolean }>();

  constructor() {}
}
