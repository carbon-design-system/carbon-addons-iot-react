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
  /**
   * An array of options for the dropdown
   *
   * Each option is an object containing:
   *
   * `content` - the display value (you can use this for translation)
   * `id` - the value used for selection, should be either `'all'` or `'any'`
   * `selected` - set to `true` for the value selected by default ( by default it's `'all'`)
   */
  @Input() anyAll = [
    { content: 'ALL', id: 'all', selected: true },
    { content: 'ANY', id: 'any', selected: false },
  ];

  @Input() selected: 'any' | 'all' = 'all';
  @Output() selectedChange = new EventEmitter();

  constructor() {}
}
