import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { I18n } from 'carbon-components-angular';

@Component({
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
  `,
})
export class RuleBuilderHeaderComponent implements OnInit {
  @HostBinding('class.iot--rule-builder-header') ruleClass = true;
  @Input() groupLogic: 'any' | 'all';
  @Input() addRuleLabel = '';
  @Input() addNewRuleLabel = '';
  @Input() addGroupLabel = '';
  @Input() addNewGroupLabel = '';

  @Output() groupLogicChange = new EventEmitter();

  @Output() removeRule = new EventEmitter<string>();

  @Output() addRule = new EventEmitter<{ id?: string; isGroup?: boolean }>();

  constructor(protected i18n: I18n) {}

  ngOnInit() {
    this.addRuleLabel = this.addRuleLabel || this.i18n.get().RULE_BUILDER.ADD_RULE;
    this.addNewRuleLabel = this.addNewRuleLabel || this.i18n.get().RULE_BUILDER.ADD_NEW_RULE;
    this.addGroupLabel = this.addGroupLabel || this.i18n.get().RULE_BUILDER.ADD_GROUP;
    this.addNewGroupLabel = this.addNewGroupLabel || this.i18n.get().RULE_BUILDER.ADD_NEW_GROUP;
  }
}
