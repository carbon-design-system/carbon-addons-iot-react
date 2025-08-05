/**
 *
 * @ai-apps/angular v2.155.1 | rule-builder.component.js
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


import { Component, Input } from '@angular/core';
import { I18n } from 'carbon-components-angular';
import { filterRulesById, findRulePathById, generateRule, generateRuleGroup, insertRuleAfterPath, } from './utils';
export class RuleBuilderComponent {
    constructor(i18n) {
        this.i18n = i18n;
        this.columns = [];
        this.columnOperands = [
            { content: 'Not equal', id: 'ne', selected: false },
            { content: 'Less than', id: 'lt', selected: false },
            { content: 'Less than or equal to', id: 'ltoet', selected: false },
            { content: 'Equals', id: 'eq', selected: false },
            { content: 'Greater than or equal to', id: 'gtoet', selected: false },
            { content: 'Greater than', id: 'gt', selected: false },
            { content: 'Contains', id: 'con', selected: false },
        ];
    }
    ngOnInit() {
        this.updateI18nTranslationString();
    }
    updateI18nTranslationString() {
        this.i18n.setLocale('en', {
            RULE_BUILDER: {
                ADD_RULE: 'Add rule',
                REMOVE_RULE: 'Remove rule',
                ADD_NEW_RULE: 'Add new rule',
                ADD_GROUP: 'Add group',
                ADD_NEW_GROUP: 'Add new rule group',
                OF_THE_FOLLOWING: 'of the following are true',
            },
        });
    }
    handleAddRule(id, isGroup) {
        const generate = isGroup ? generateRuleGroup : generateRule;
        if (id) {
            const rulePath = findRulePathById(this.tree.rules, id);
            insertRuleAfterPath(this.tree.rules, generate(), rulePath);
            return;
        }
        this.tree.rules.push(generate());
    }
    handleRemoveRule(id) {
        this.tree.rules = filterRulesById(this.tree.rules, id);
    }
}
RuleBuilderComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-rule-builder',
                template: `
    <div>
      <ai-rule-builder-header
        [(groupLogic)]="tree.groupLogic"
        (addRule)="handleAddRule($event.id, $event.isGroup)"
      ></ai-rule-builder-header>
      <ng-container *ngFor="let rule of tree.rules; let i = index">
        <ai-rule
          (addRule)="handleAddRule($event.id, $event.isGroup)"
          (removeRule)="handleRemoveRule($event)"
          [columns]="columns"
          [columnOperands]="columnOperands"
          [(rule)]="tree.rules[i]"
        ></ai-rule>
      </ng-container>
    </div>
  `
            },] }
];
RuleBuilderComponent.ctorParameters = () => [
    { type: I18n }
];
RuleBuilderComponent.propDecorators = {
    columns: [{ type: Input }],
    columnOperands: [{ type: Input }],
    tree: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS1idWlsZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ydWxlLWJ1aWxkZXIvcnVsZS1idWlsZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUUsSUFBSSxFQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFDM0QsT0FBTyxFQUNMLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLGlCQUFpQixFQUNqQixtQkFBbUIsR0FDcEIsTUFBTSxTQUFTLENBQUM7QUFzQmpCLE1BQU0sT0FBTyxvQkFBb0I7SUF5Qy9CLFlBQXNCLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBeEN2QixZQUFPLEdBQWUsRUFBRSxDQUFDO1FBQ3pCLG1CQUFjLEdBQW9CO1lBQ3pDLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDbkQsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUNuRCxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDbEUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUNoRCxFQUFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDckUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtZQUN0RCxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQ3BELENBQUM7SUErQmlDLENBQUM7SUFFcEMsUUFBUTtRQUNOLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCwyQkFBMkI7UUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO1lBQ3hCLFlBQVksRUFBRTtnQkFDWixRQUFRLEVBQUUsVUFBVTtnQkFDcEIsV0FBVyxFQUFFLGFBQWE7Z0JBQzFCLFlBQVksRUFBRSxjQUFjO2dCQUM1QixTQUFTLEVBQUUsV0FBVztnQkFDdEIsYUFBYSxFQUFFLG9CQUFvQjtnQkFDbkMsZ0JBQWdCLEVBQUUsMkJBQTJCO2FBQzlDO1NBQ0ssQ0FBQyxDQUFDO0lBQ1osQ0FBQztJQUVELGFBQWEsQ0FBQyxFQUFVLEVBQUUsT0FBTztRQUMvQixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFFNUQsSUFBSSxFQUFFLEVBQUU7WUFDTixNQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN2RCxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMzRCxPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsRUFBVTtRQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQzs7O1lBOUZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQlQ7YUFDRjs7O1lBNUJRLElBQUk7OztzQkE4QlYsS0FBSzs2QkFDTCxLQUFLO21CQXFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJMThuLCBMaXN0SXRlbSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuaW1wb3J0IHtcbiAgZmlsdGVyUnVsZXNCeUlkLFxuICBmaW5kUnVsZVBhdGhCeUlkLFxuICBnZW5lcmF0ZVJ1bGUsXG4gIGdlbmVyYXRlUnVsZUdyb3VwLFxuICBpbnNlcnRSdWxlQWZ0ZXJQYXRoLFxufSBmcm9tICcuL3V0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWktcnVsZS1idWlsZGVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2PlxuICAgICAgPGFpLXJ1bGUtYnVpbGRlci1oZWFkZXJcbiAgICAgICAgWyhncm91cExvZ2ljKV09XCJ0cmVlLmdyb3VwTG9naWNcIlxuICAgICAgICAoYWRkUnVsZSk9XCJoYW5kbGVBZGRSdWxlKCRldmVudC5pZCwgJGV2ZW50LmlzR3JvdXApXCJcbiAgICAgID48L2FpLXJ1bGUtYnVpbGRlci1oZWFkZXI+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBydWxlIG9mIHRyZWUucnVsZXM7IGxldCBpID0gaW5kZXhcIj5cbiAgICAgICAgPGFpLXJ1bGVcbiAgICAgICAgICAoYWRkUnVsZSk9XCJoYW5kbGVBZGRSdWxlKCRldmVudC5pZCwgJGV2ZW50LmlzR3JvdXApXCJcbiAgICAgICAgICAocmVtb3ZlUnVsZSk9XCJoYW5kbGVSZW1vdmVSdWxlKCRldmVudClcIlxuICAgICAgICAgIFtjb2x1bW5zXT1cImNvbHVtbnNcIlxuICAgICAgICAgIFtjb2x1bW5PcGVyYW5kc109XCJjb2x1bW5PcGVyYW5kc1wiXG4gICAgICAgICAgWyhydWxlKV09XCJ0cmVlLnJ1bGVzW2ldXCJcbiAgICAgICAgPjwvYWktcnVsZT5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvZGl2PlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBSdWxlQnVpbGRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGNvbHVtbnM6IEFycmF5PGFueT4gPSBbXTtcbiAgQElucHV0KCkgY29sdW1uT3BlcmFuZHM6IEFycmF5PExpc3RJdGVtPiA9IFtcbiAgICB7IGNvbnRlbnQ6ICdOb3QgZXF1YWwnLCBpZDogJ25lJywgc2VsZWN0ZWQ6IGZhbHNlIH0sXG4gICAgeyBjb250ZW50OiAnTGVzcyB0aGFuJywgaWQ6ICdsdCcsIHNlbGVjdGVkOiBmYWxzZSB9LFxuICAgIHsgY29udGVudDogJ0xlc3MgdGhhbiBvciBlcXVhbCB0bycsIGlkOiAnbHRvZXQnLCBzZWxlY3RlZDogZmFsc2UgfSxcbiAgICB7IGNvbnRlbnQ6ICdFcXVhbHMnLCBpZDogJ2VxJywgc2VsZWN0ZWQ6IGZhbHNlIH0sXG4gICAgeyBjb250ZW50OiAnR3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvJywgaWQ6ICdndG9ldCcsIHNlbGVjdGVkOiBmYWxzZSB9LFxuICAgIHsgY29udGVudDogJ0dyZWF0ZXIgdGhhbicsIGlkOiAnZ3QnLCBzZWxlY3RlZDogZmFsc2UgfSxcbiAgICB7IGNvbnRlbnQ6ICdDb250YWlucycsIGlkOiAnY29uJywgc2VsZWN0ZWQ6IGZhbHNlIH0sXG4gIF07XG5cbiAgLyoqXG4gICAqIEV4YW1wbGUgU3RydWN0dXJlOlxuICAgKiB7XG4gICAqICAgaWQ6ICcxNHA1aG8zcGN1JyxcbiAgICogICBncm91cExvZ2ljOiAnYWxsJyxcbiAgICogICBydWxlczogW1xuICAgKiAgICAge1xuICAgKiAgICAgICBpZDogJ3JzaXJ1NHJqYmEnLFxuICAgKiAgICAgICBjb2x1bW5JZDogJ2NvbHVtbjInLFxuICAgKiAgICAgICBvcGVyYW5kOiAnZXEnLFxuICAgKiAgICAgICB2YWx1ZTogJzQ1JyxcbiAgICogICAgIH0sXG4gICAqICAgICB7XG4gICAqICAgICAgIGlkOiAnaTM0aW10MGdlaCcsXG4gICAqICAgICAgIGdyb3VwTG9naWM6ICdhbnknLFxuICAgKiAgICAgICBydWxlczogW1xuICAgKiAgICAgICAgIHtcbiAgICogICAgICAgICAgIGlkOiAnZXdjMno1a3lmdScsXG4gICAqICAgICAgICAgICBjb2x1bW5JZDogJ2NvbHVtbjInLFxuICAgKiAgICAgICAgICAgb3BlcmFuZDogJ2d0b2V0JyxcbiAgICogICAgICAgICAgIHZhbHVlOiAnNDYnLFxuICAgKiAgICAgICAgIH0sXG4gICAqICAgICAgIF0sXG4gICAqICAgICB9XG4gICAqICAgXVxuICAgKiB9XG4gICAqL1xuICBASW5wdXQoKSB0cmVlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGkxOG46IEkxOG4pIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy51cGRhdGVJMThuVHJhbnNsYXRpb25TdHJpbmcoKTtcbiAgfVxuXG4gIHVwZGF0ZUkxOG5UcmFuc2xhdGlvblN0cmluZygpIHtcbiAgICB0aGlzLmkxOG4uc2V0TG9jYWxlKCdlbicsIHtcbiAgICAgIFJVTEVfQlVJTERFUjoge1xuICAgICAgICBBRERfUlVMRTogJ0FkZCBydWxlJyxcbiAgICAgICAgUkVNT1ZFX1JVTEU6ICdSZW1vdmUgcnVsZScsXG4gICAgICAgIEFERF9ORVdfUlVMRTogJ0FkZCBuZXcgcnVsZScsXG4gICAgICAgIEFERF9HUk9VUDogJ0FkZCBncm91cCcsXG4gICAgICAgIEFERF9ORVdfR1JPVVA6ICdBZGQgbmV3IHJ1bGUgZ3JvdXAnLFxuICAgICAgICBPRl9USEVfRk9MTE9XSU5HOiAnb2YgdGhlIGZvbGxvd2luZyBhcmUgdHJ1ZScsXG4gICAgICB9LFxuICAgIH0gYXMgYW55KTtcbiAgfVxuXG4gIGhhbmRsZUFkZFJ1bGUoaWQ6IHN0cmluZywgaXNHcm91cCkge1xuICAgIGNvbnN0IGdlbmVyYXRlID0gaXNHcm91cCA/IGdlbmVyYXRlUnVsZUdyb3VwIDogZ2VuZXJhdGVSdWxlO1xuXG4gICAgaWYgKGlkKSB7XG4gICAgICBjb25zdCBydWxlUGF0aCA9IGZpbmRSdWxlUGF0aEJ5SWQodGhpcy50cmVlLnJ1bGVzLCBpZCk7XG4gICAgICBpbnNlcnRSdWxlQWZ0ZXJQYXRoKHRoaXMudHJlZS5ydWxlcywgZ2VuZXJhdGUoKSwgcnVsZVBhdGgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudHJlZS5ydWxlcy5wdXNoKGdlbmVyYXRlKCkpO1xuICB9XG5cbiAgaGFuZGxlUmVtb3ZlUnVsZShpZDogc3RyaW5nKSB7XG4gICAgdGhpcy50cmVlLnJ1bGVzID0gZmlsdGVyUnVsZXNCeUlkKHRoaXMudHJlZS5ydWxlcywgaWQpO1xuICB9XG59XG4iXX0=