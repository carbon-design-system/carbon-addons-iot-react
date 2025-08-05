/**
 *
 * @ai-apps/angular v2.155.1 | rule-builder-group-logic.component.js
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


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { I18n } from 'carbon-components-angular';
export class RuleBuilderGroupLogicComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS1idWlsZGVyLWdyb3VwLWxvZ2ljLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ydWxlLWJ1aWxkZXIvcnVsZS1idWlsZGVyLWdyb3VwLWxvZ2ljLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQW1CakQsTUFBTSxPQUFPLDhCQUE4QjtJQW1CekMsWUFBc0IsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07UUFsQmhDOzs7Ozs7OztXQVFHO1FBQ00sV0FBTSxHQUFHO1lBQ2hCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDN0MsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtTQUMvQyxDQUFDO1FBRU8sYUFBUSxHQUFrQixLQUFLLENBQUM7UUFDaEMsd0JBQW1CLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUVYLENBQUM7SUFFcEMsUUFBUTtRQUNOLElBQUksQ0FBQyxtQkFBbUI7WUFDdEIsSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDO0lBQzlFLENBQUM7OztZQXpDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjtnQkFDdkMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7O0dBYVQ7YUFDRjs7O1lBbEJRLElBQUk7OztxQkE2QlYsS0FBSzt1QkFLTCxLQUFLO2tDQUNMLEtBQUs7NkJBQ0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEkxOG4gfSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWktcnVsZS1idWlsZGVyLWdyb3VwLWxvZ2ljJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiaW90LS1ydWxlLWJ1aWxkZXItaGVhZGVyX19kcm9wZG93blwiPlxuICAgICAgPGlibS1kcm9wZG93blxuICAgICAgICB0aGVtZT1cImxpZ2h0XCJcbiAgICAgICAgW25nTW9kZWxdPVwic2VsZWN0ZWRcIlxuICAgICAgICAobmdNb2RlbENoYW5nZSk9XCJzZWxlY3RlZENoYW5nZS5lbWl0KCRldmVudClcIlxuICAgICAgICB2YWx1ZT1cImlkXCJcbiAgICAgID5cbiAgICAgICAgPGlibS1kcm9wZG93bi1saXN0IFtpdGVtc109XCJhbnlBbGxcIj48L2libS1kcm9wZG93bi1saXN0PlxuICAgICAgPC9pYm0tZHJvcGRvd24+XG4gICAgPC9kaXY+XG5cbiAgICA8c3Bhbj57eyBvZlRoZUZvbGxvd2luZ0xhYmVsIH19PC9zcGFuPlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBSdWxlQnVpbGRlckdyb3VwTG9naWNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAvKipcbiAgICogQW4gYXJyYXkgb2Ygb3B0aW9ucyBmb3IgdGhlIGRyb3Bkb3duXG4gICAqXG4gICAqIEVhY2ggb3B0aW9uIGlzIGFuIG9iamVjdCBjb250YWluaW5nOlxuICAgKlxuICAgKiBgY29udGVudGAgLSB0aGUgZGlzcGxheSB2YWx1ZSAoeW91IGNhbiB1c2UgdGhpcyBmb3IgdHJhbnNsYXRpb24pXG4gICAqIGBpZGAgLSB0aGUgdmFsdWUgdXNlZCBmb3Igc2VsZWN0aW9uLCBzaG91bGQgYmUgZWl0aGVyIGAnYWxsJ2Agb3IgYCdhbnknYFxuICAgKiBgc2VsZWN0ZWRgIC0gc2V0IHRvIGB0cnVlYCBmb3IgdGhlIHZhbHVlIHNlbGVjdGVkIGJ5IGRlZmF1bHQgKCBieSBkZWZhdWx0IGl0J3MgYCdhbGwnYClcbiAgICovXG4gIEBJbnB1dCgpIGFueUFsbCA9IFtcbiAgICB7IGNvbnRlbnQ6ICdBTEwnLCBpZDogJ2FsbCcsIHNlbGVjdGVkOiB0cnVlIH0sXG4gICAgeyBjb250ZW50OiAnQU5ZJywgaWQ6ICdhbnknLCBzZWxlY3RlZDogZmFsc2UgfSxcbiAgXTtcblxuICBASW5wdXQoKSBzZWxlY3RlZDogJ2FueScgfCAnYWxsJyA9ICdhbGwnO1xuICBASW5wdXQoKSBvZlRoZUZvbGxvd2luZ0xhYmVsID0gJyc7XG4gIEBPdXRwdXQoKSBzZWxlY3RlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaTE4bjogSTE4bikge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm9mVGhlRm9sbG93aW5nTGFiZWwgPVxuICAgICAgdGhpcy5vZlRoZUZvbGxvd2luZ0xhYmVsIHx8IHRoaXMuaTE4bi5nZXQoKS5SVUxFX0JVSUxERVIuT0ZfVEhFX0ZPTExPV0lORztcbiAgfVxufVxuIl19