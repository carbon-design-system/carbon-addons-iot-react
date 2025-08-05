/**
 *
 * @ai-apps/angular v2.155.1 | rule-builder-header.component.js
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
export class RuleBuilderHeaderComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS1idWlsZGVyLWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcnVsZS1idWlsZGVyL3J1bGUtYnVpbGRlci1oZWFkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVGLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQXdCakQsTUFBTSxPQUFPLDBCQUEwQjtJQWNyQyxZQUFzQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQWJlLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFFdkQsaUJBQVksR0FBRyxFQUFFLENBQUM7UUFDbEIsb0JBQWUsR0FBRyxFQUFFLENBQUM7UUFDckIsa0JBQWEsR0FBRyxFQUFFLENBQUM7UUFDbkIscUJBQWdCLEdBQUcsRUFBRSxDQUFDO1FBRXJCLHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFdEMsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFFeEMsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFzQyxDQUFDO0lBRXhDLENBQUM7SUFFcEMsUUFBUTtRQUNOLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDL0UsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQztRQUN6RixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDO0lBQzlGLENBQUM7OztZQTNDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQlQ7YUFDRjs7O1lBdkJRLElBQUk7Ozt3QkF5QlYsV0FBVyxTQUFDLGdDQUFnQzt5QkFDNUMsS0FBSzsyQkFDTCxLQUFLOzhCQUNMLEtBQUs7NEJBQ0wsS0FBSzsrQkFDTCxLQUFLOytCQUVMLE1BQU07eUJBRU4sTUFBTTtzQkFFTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEhvc3RCaW5kaW5nLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEkxOG4gfSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWktcnVsZS1idWlsZGVyLWhlYWRlcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGFpLXJ1bGUtYnVpbGRlci1ncm91cC1sb2dpY1xuICAgICAgW3NlbGVjdGVkXT1cImdyb3VwTG9naWNcIlxuICAgICAgKHNlbGVjdGVkQ2hhbmdlKT1cImdyb3VwTG9naWNDaGFuZ2UuZW1pdCgkZXZlbnQpXCJcbiAgICA+XG4gICAgPC9haS1ydWxlLWJ1aWxkZXItZ3JvdXAtbG9naWM+XG4gICAgPGRpdiBjbGFzcz1cImlvdC0tcnVsZS1idWlsZGVyLWhlYWRlcl9fYnV0dG9uc1wiPlxuICAgICAgPGJ1dHRvbiBpYm1CdXR0b249XCJnaG9zdFwiIChjbGljayk9XCJhZGRSdWxlLmVtaXQoe30pXCI+XG4gICAgICAgIHt7IGFkZFJ1bGVMYWJlbCB9fVxuICAgICAgICA8c3ZnIGNsYXNzPVwiYngtLWJ0bl9faWNvblwiIGlibUljb249XCJhZGRcIiBzaXplPVwiMzJcIj48L3N2Zz5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJieC0tYXNzaXN0aXZlLXRleHRcIj57eyBhZGROZXdSdWxlTGFiZWwgfX08L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gaWJtQnV0dG9uPVwiZ2hvc3RcIiAoY2xpY2spPVwiYWRkUnVsZS5lbWl0KHsgaXNHcm91cDogdHJ1ZSB9KVwiPlxuICAgICAgICB7eyBhZGRHcm91cExhYmVsIH19XG4gICAgICAgIDxzdmcgY2xhc3M9XCJieC0tYnRuX19pY29uXCIgaWJtSWNvbj1cInRleHQtLW5ldy1saW5lXCIgc2l6ZT1cIjMyXCI+PC9zdmc+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiYngtLWFzc2lzdGl2ZS10ZXh0XCI+e3sgYWRkTmV3R3JvdXBMYWJlbCB9fTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBSdWxlQnVpbGRlckhlYWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MuaW90LS1ydWxlLWJ1aWxkZXItaGVhZGVyJykgcnVsZUNsYXNzID0gdHJ1ZTtcbiAgQElucHV0KCkgZ3JvdXBMb2dpYzogJ2FueScgfCAnYWxsJztcbiAgQElucHV0KCkgYWRkUnVsZUxhYmVsID0gJyc7XG4gIEBJbnB1dCgpIGFkZE5ld1J1bGVMYWJlbCA9ICcnO1xuICBASW5wdXQoKSBhZGRHcm91cExhYmVsID0gJyc7XG4gIEBJbnB1dCgpIGFkZE5ld0dyb3VwTGFiZWwgPSAnJztcblxuICBAT3V0cHV0KCkgZ3JvdXBMb2dpY0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBAT3V0cHV0KCkgcmVtb3ZlUnVsZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIEBPdXRwdXQoKSBhZGRSdWxlID0gbmV3IEV2ZW50RW1pdHRlcjx7IGlkPzogc3RyaW5nOyBpc0dyb3VwPzogYm9vbGVhbiB9PigpO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpMThuOiBJMThuKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuYWRkUnVsZUxhYmVsID0gdGhpcy5hZGRSdWxlTGFiZWwgfHwgdGhpcy5pMThuLmdldCgpLlJVTEVfQlVJTERFUi5BRERfUlVMRTtcbiAgICB0aGlzLmFkZE5ld1J1bGVMYWJlbCA9IHRoaXMuYWRkTmV3UnVsZUxhYmVsIHx8IHRoaXMuaTE4bi5nZXQoKS5SVUxFX0JVSUxERVIuQUREX05FV19SVUxFO1xuICAgIHRoaXMuYWRkR3JvdXBMYWJlbCA9IHRoaXMuYWRkR3JvdXBMYWJlbCB8fCB0aGlzLmkxOG4uZ2V0KCkuUlVMRV9CVUlMREVSLkFERF9HUk9VUDtcbiAgICB0aGlzLmFkZE5ld0dyb3VwTGFiZWwgPSB0aGlzLmFkZE5ld0dyb3VwTGFiZWwgfHwgdGhpcy5pMThuLmdldCgpLlJVTEVfQlVJTERFUi5BRERfTkVXX0dST1VQO1xuICB9XG59XG4iXX0=