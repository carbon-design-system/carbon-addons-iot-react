/**
 *
 * @ai-apps/angular v2.155.1 | radio-setting.component.js
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
export class RadioSettingComponent {
    constructor() {
        this.activeChange = new EventEmitter();
    }
    getContent(option) {
        if (isObservable(option.content)) {
            return option.content;
        }
        return of(option.content);
    }
    onChange(event) {
        this.activeChange.emit({ active: event.value });
    }
}
RadioSettingComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-radio-setting, ai-radio-setting',
                template: `
    <ibm-radio-group>
      <ibm-radio
        *ngFor="let option of options"
        [checked]="option.value === active"
        [value]="option.value"
        (change)="onChange($event)"
      >
        {{ getContent(option) | async }}
      </ibm-radio>
    </ibm-radio-group>
  `
            },] }
];
RadioSettingComponent.propDecorators = {
    options: [{ type: Input }],
    active: [{ type: Input }],
    activeChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8tc2V0dGluZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvdG9vbGtpdC90YWJsZS1zZXR0aW5ncy9zZXR0aW5ncy9yYWRpby1zZXR0aW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZFLE9BQU8sRUFBRSxZQUFZLEVBQWMsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBbUJwRCxNQUFNLE9BQU8scUJBQXFCO0lBZmxDO1FBb0JZLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQWtCLENBQUM7SUFZOUQsQ0FBQztJQVZDLFVBQVUsQ0FBQyxNQUFtQjtRQUM1QixJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDaEMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBa0I7UUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQzs7O1lBL0JGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0NBQW9DO2dCQUM5QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7O0dBV1Q7YUFDRjs7O3NCQUVFLEtBQUs7cUJBRUwsS0FBSzsyQkFFTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJhZGlvQ2hhbmdlIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5pbXBvcnQgeyBpc09ic2VydmFibGUsIE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBSYWRpb09wdGlvbiB9IGZyb20gJy4vcmFkaW8tc2V0dGluZy5jbGFzcyc7XG5pbXBvcnQgeyBTZXR0aW5nQ2hhbmdlcyB9IGZyb20gJy4vc2V0dGluZy5jbGFzcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NjLXJhZGlvLXNldHRpbmcsIGFpLXJhZGlvLXNldHRpbmcnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxpYm0tcmFkaW8tZ3JvdXA+XG4gICAgICA8aWJtLXJhZGlvXG4gICAgICAgICpuZ0Zvcj1cImxldCBvcHRpb24gb2Ygb3B0aW9uc1wiXG4gICAgICAgIFtjaGVja2VkXT1cIm9wdGlvbi52YWx1ZSA9PT0gYWN0aXZlXCJcbiAgICAgICAgW3ZhbHVlXT1cIm9wdGlvbi52YWx1ZVwiXG4gICAgICAgIChjaGFuZ2UpPVwib25DaGFuZ2UoJGV2ZW50KVwiXG4gICAgICA+XG4gICAgICAgIHt7IGdldENvbnRlbnQob3B0aW9uKSB8IGFzeW5jIH19XG4gICAgICA8L2libS1yYWRpbz5cbiAgICA8L2libS1yYWRpby1ncm91cD5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgUmFkaW9TZXR0aW5nQ29tcG9uZW50IHtcbiAgQElucHV0KCkgb3B0aW9uczogUmFkaW9PcHRpb25bXTtcblxuICBASW5wdXQoKSBhY3RpdmU6IGFueTtcblxuICBAT3V0cHV0KCkgYWN0aXZlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxTZXR0aW5nQ2hhbmdlcz4oKTtcblxuICBnZXRDb250ZW50KG9wdGlvbjogUmFkaW9PcHRpb24pOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIGlmIChpc09ic2VydmFibGUob3B0aW9uLmNvbnRlbnQpKSB7XG4gICAgICByZXR1cm4gb3B0aW9uLmNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiBvZihvcHRpb24uY29udGVudCk7XG4gIH1cblxuICBvbkNoYW5nZShldmVudDogUmFkaW9DaGFuZ2UpIHtcbiAgICB0aGlzLmFjdGl2ZUNoYW5nZS5lbWl0KHsgYWN0aXZlOiBldmVudC52YWx1ZSB9KTtcbiAgfVxufVxuIl19