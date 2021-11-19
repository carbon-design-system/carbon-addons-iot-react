import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
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

    <span>of the following are true</span>
  `,
})
export class RuleBuilderGroupLogicComponent {
  @Input() anyAll = [
    { content: 'ALL', id: 'all', selected: true },
    { content: 'ANY', id: 'any' },
  ];

  @Input() selected: 'any' | 'all' = 'all';
  @Output() selectedChange = new EventEmitter();

  constructor() {}
}
