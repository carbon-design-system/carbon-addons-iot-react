/**
 *
 * @ai-apps/angular v2.155.1 | checkbox-setting.component.js
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
import { isObservable, of } from 'rxjs';
export class CheckboxSettingComponent {
    constructor() {
        this.optionsChange = new EventEmitter();
    }
    getContent(option) {
        if (isObservable(option.content)) {
            return option.content;
        }
        return of(option.content);
    }
    onChange(event, eventOption) {
        const changes = {
            options: this.options.map((option) => {
                if (option === eventOption) {
                    return Object.assign({}, option, { checked: event.checked });
                }
                return option;
            }),
        };
        this.optionsChange.emit(changes);
    }
}
CheckboxSettingComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-checkbox-setting, ai-checkbox-setting',
                template: `
    <ibm-checkbox
      *ngFor="let option of options"
      [checked]="option.checked"
      (change)="onChange($event, option)"
    >
      {{ getContent(option) | async }}
    </ibm-checkbox>
  `
            },] }
];
CheckboxSettingComponent.propDecorators = {
    options: [{ type: Input }],
    optionsChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtc2V0dGluZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvdG9vbGtpdC90YWJsZS1zZXR0aW5ncy9zZXR0aW5ncy9jaGVja2JveC1zZXR0aW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZFLE9BQU8sRUFBRSxZQUFZLEVBQWMsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBZ0JwRCxNQUFNLE9BQU8sd0JBQXdCO0lBWnJDO1FBZVksa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBa0IsQ0FBQztJQW9CL0QsQ0FBQztJQWxCQyxVQUFVLENBQUMsTUFBc0I7UUFDL0IsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQztTQUN2QjtRQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQXFCLEVBQUUsV0FBMkI7UUFDekQsTUFBTSxPQUFPLEdBQUc7WUFDZCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDbkMsSUFBSSxNQUFNLEtBQUssV0FBVyxFQUFFO29CQUMxQixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztpQkFDOUQ7Z0JBQ0QsT0FBTyxNQUFNLENBQUM7WUFDaEIsQ0FBQyxDQUFDO1NBQ0gsQ0FBQztRQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLENBQUM7OztZQWxDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDBDQUEwQztnQkFDcEQsUUFBUSxFQUFFOzs7Ozs7OztHQVFUO2FBQ0Y7OztzQkFFRSxLQUFLOzRCQUVMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2hlY2tib3hDaGFuZ2UgfSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyL2NoZWNrYm94L2NoZWNrYm94LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBpc09ic2VydmFibGUsIE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDaGVja2JveE9wdGlvbiB9IGZyb20gJy4vY2hlY2tib3gtc2V0dGluZy5jbGFzcyc7XG5pbXBvcnQgeyBTZXR0aW5nQ2hhbmdlcyB9IGZyb20gJy4vc2V0dGluZy5jbGFzcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NjLWNoZWNrYm94LXNldHRpbmcsIGFpLWNoZWNrYm94LXNldHRpbmcnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxpYm0tY2hlY2tib3hcbiAgICAgICpuZ0Zvcj1cImxldCBvcHRpb24gb2Ygb3B0aW9uc1wiXG4gICAgICBbY2hlY2tlZF09XCJvcHRpb24uY2hlY2tlZFwiXG4gICAgICAoY2hhbmdlKT1cIm9uQ2hhbmdlKCRldmVudCwgb3B0aW9uKVwiXG4gICAgPlxuICAgICAge3sgZ2V0Q29udGVudChvcHRpb24pIHwgYXN5bmMgfX1cbiAgICA8L2libS1jaGVja2JveD5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQ2hlY2tib3hTZXR0aW5nQ29tcG9uZW50IHtcbiAgQElucHV0KCkgb3B0aW9uczogQ2hlY2tib3hPcHRpb25bXTtcblxuICBAT3V0cHV0KCkgb3B0aW9uc0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8U2V0dGluZ0NoYW5nZXM+KCk7XG5cbiAgZ2V0Q29udGVudChvcHRpb246IENoZWNrYm94T3B0aW9uKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICBpZiAoaXNPYnNlcnZhYmxlKG9wdGlvbi5jb250ZW50KSkge1xuICAgICAgcmV0dXJuIG9wdGlvbi5jb250ZW50O1xuICAgIH1cbiAgICByZXR1cm4gb2Yob3B0aW9uLmNvbnRlbnQpO1xuICB9XG5cbiAgb25DaGFuZ2UoZXZlbnQ6IENoZWNrYm94Q2hhbmdlLCBldmVudE9wdGlvbjogQ2hlY2tib3hPcHRpb24pIHtcbiAgICBjb25zdCBjaGFuZ2VzID0ge1xuICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLm1hcCgob3B0aW9uKSA9PiB7XG4gICAgICAgIGlmIChvcHRpb24gPT09IGV2ZW50T3B0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbiwgeyBjaGVja2VkOiBldmVudC5jaGVja2VkIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb247XG4gICAgICB9KSxcbiAgICB9O1xuICAgIHRoaXMub3B0aW9uc0NoYW5nZS5lbWl0KGNoYW5nZXMpO1xuICB9XG59XG4iXX0=