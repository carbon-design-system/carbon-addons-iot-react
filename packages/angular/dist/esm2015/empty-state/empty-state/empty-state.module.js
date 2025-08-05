/**
 *
 * @ai-apps/angular v2.155.1 | empty-state.module.js
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


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from './empty-state.component';
import { EmptyStateActionComponent } from './empty-state-action-wrapper.component';
import { EmptyStateBodyDirective } from './empty-state-body.directive';
import { EmptyStateSecondaryActionComponent } from './empty-state-secondary-action-wrapper.component';
import { EmptyStateTitleDirective } from './empty-state-title.directive';
import { AIIconsModule } from '@ai-apps/angular/icons';
export class EmptyStateModule {
}
EmptyStateModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    EmptyStateComponent,
                    EmptyStateActionComponent,
                    EmptyStateBodyDirective,
                    EmptyStateSecondaryActionComponent,
                    EmptyStateTitleDirective,
                ],
                exports: [
                    EmptyStateComponent,
                    EmptyStateActionComponent,
                    EmptyStateBodyDirective,
                    EmptyStateSecondaryActionComponent,
                    EmptyStateTitleDirective,
                ],
                imports: [CommonModule, AIIconsModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHktc3RhdGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2VtcHR5LXN0YXRlL2VtcHR5LXN0YXRlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNuRixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsa0NBQWtDLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN0RyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFtQnZELE1BQU0sT0FBTyxnQkFBZ0I7OztZQWpCNUIsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRTtvQkFDWixtQkFBbUI7b0JBQ25CLHlCQUF5QjtvQkFDekIsdUJBQXVCO29CQUN2QixrQ0FBa0M7b0JBQ2xDLHdCQUF3QjtpQkFDekI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLG1CQUFtQjtvQkFDbkIseUJBQXlCO29CQUN6Qix1QkFBdUI7b0JBQ3ZCLGtDQUFrQztvQkFDbEMsd0JBQXdCO2lCQUN6QjtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDO2FBQ3ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IEVtcHR5U3RhdGVDb21wb25lbnQgfSBmcm9tICcuL2VtcHR5LXN0YXRlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFbXB0eVN0YXRlQWN0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9lbXB0eS1zdGF0ZS1hY3Rpb24td3JhcHBlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRW1wdHlTdGF0ZUJvZHlEaXJlY3RpdmUgfSBmcm9tICcuL2VtcHR5LXN0YXRlLWJvZHkuZGlyZWN0aXZlJztcbmltcG9ydCB7IEVtcHR5U3RhdGVTZWNvbmRhcnlBY3Rpb25Db21wb25lbnQgfSBmcm9tICcuL2VtcHR5LXN0YXRlLXNlY29uZGFyeS1hY3Rpb24td3JhcHBlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRW1wdHlTdGF0ZVRpdGxlRGlyZWN0aXZlIH0gZnJvbSAnLi9lbXB0eS1zdGF0ZS10aXRsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQUlJY29uc01vZHVsZSB9IGZyb20gJ0BhaS1hcHBzL2FuZ3VsYXIvaWNvbnMnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBFbXB0eVN0YXRlQ29tcG9uZW50LFxuICAgIEVtcHR5U3RhdGVBY3Rpb25Db21wb25lbnQsXG4gICAgRW1wdHlTdGF0ZUJvZHlEaXJlY3RpdmUsXG4gICAgRW1wdHlTdGF0ZVNlY29uZGFyeUFjdGlvbkNvbXBvbmVudCxcbiAgICBFbXB0eVN0YXRlVGl0bGVEaXJlY3RpdmUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBFbXB0eVN0YXRlQ29tcG9uZW50LFxuICAgIEVtcHR5U3RhdGVBY3Rpb25Db21wb25lbnQsXG4gICAgRW1wdHlTdGF0ZUJvZHlEaXJlY3RpdmUsXG4gICAgRW1wdHlTdGF0ZVNlY29uZGFyeUFjdGlvbkNvbXBvbmVudCxcbiAgICBFbXB0eVN0YXRlVGl0bGVEaXJlY3RpdmUsXG4gIF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEFJSWNvbnNNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBFbXB0eVN0YXRlTW9kdWxlIHt9XG4iXX0=