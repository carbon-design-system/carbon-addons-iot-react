import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I18n } from 'carbon-components-angular';

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

    <span>{{ ofTheFollowingLabel }}</span>
  `,
})
export class RuleBuilderGroupLogicComponent implements OnInit {
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
  @Input() ofTheFollowingLabel = '';
  @Output() selectedChange = new EventEmitter();

  constructor(protected i18n: I18n) {}

  ngOnInit() {
    this.ofTheFollowingLabel =
      this.ofTheFollowingLabel || this.i18n.get().RULE_BUILDER.OF_THE_FOLLOWING;
  }
}
