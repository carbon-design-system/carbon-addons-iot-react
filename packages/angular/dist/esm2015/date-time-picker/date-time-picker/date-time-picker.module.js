/**
 *
 * @ai-apps/angular v2.155.1 | date-time-picker.module.js
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


import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule, DatePickerModule, DialogModule, I18nModule, IconModule, InputModule, NumberModule, RadioModule, SelectModule, TimePickerModule, TimePickerSelectModule, } from 'carbon-components-angular';
import { DateTimePickerComponent } from './date-time-picker.component';
import { CustomDateTimeComponent } from './custom-date-time.component';
import { DateTimeAbsoluteComponent } from './date-time-absolute.component';
import { DateTimeRelativeComponent } from './date-time-relative.component';
import { FormsModule } from '@angular/forms';
export class DateTimePickerModule {
}
DateTimePickerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    DateTimePickerComponent,
                    CustomDateTimeComponent,
                    DateTimeAbsoluteComponent,
                    DateTimeRelativeComponent,
                ],
                exports: [
                    DateTimePickerComponent,
                    CustomDateTimeComponent,
                    DateTimeAbsoluteComponent,
                    DateTimeRelativeComponent,
                ],
                imports: [
                    CommonModule,
                    FormsModule,
                    ButtonModule,
                    RadioModule,
                    SelectModule,
                    NumberModule,
                    TimePickerModule,
                    TimePickerSelectModule,
                    InputModule,
                    DatePickerModule,
                    I18nModule,
                    IconModule,
                    DialogModule,
                ],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10aW1lLXBpY2tlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0ZS10aW1lLXBpY2tlci9kYXRlLXRpbWUtcGlja2VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsWUFBWSxFQUNaLGdCQUFnQixFQUNoQixZQUFZLEVBQ1osVUFBVSxFQUNWLFVBQVUsRUFDVixXQUFXLEVBQ1gsWUFBWSxFQUNaLFdBQVcsRUFDWCxZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLHNCQUFzQixHQUN2QixNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQStCN0MsTUFBTSxPQUFPLG9CQUFvQjs7O1lBN0JoQyxRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLHVCQUF1QjtvQkFDdkIsdUJBQXVCO29CQUN2Qix5QkFBeUI7b0JBQ3pCLHlCQUF5QjtpQkFDMUI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLHVCQUF1QjtvQkFDdkIsdUJBQXVCO29CQUN2Qix5QkFBeUI7b0JBQ3pCLHlCQUF5QjtpQkFDMUI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osV0FBVztvQkFDWCxZQUFZO29CQUNaLFdBQVc7b0JBQ1gsWUFBWTtvQkFDWixZQUFZO29CQUNaLGdCQUFnQjtvQkFDaEIsc0JBQXNCO29CQUN0QixXQUFXO29CQUNYLGdCQUFnQjtvQkFDaEIsVUFBVTtvQkFDVixVQUFVO29CQUNWLFlBQVk7aUJBQ2I7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQnV0dG9uTW9kdWxlLFxuICBEYXRlUGlja2VyTW9kdWxlLFxuICBEaWFsb2dNb2R1bGUsXG4gIEkxOG5Nb2R1bGUsXG4gIEljb25Nb2R1bGUsXG4gIElucHV0TW9kdWxlLFxuICBOdW1iZXJNb2R1bGUsXG4gIFJhZGlvTW9kdWxlLFxuICBTZWxlY3RNb2R1bGUsXG4gIFRpbWVQaWNrZXJNb2R1bGUsXG4gIFRpbWVQaWNrZXJTZWxlY3RNb2R1bGUsXG59IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuaW1wb3J0IHsgRGF0ZVRpbWVQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2RhdGUtdGltZS1waWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEN1c3RvbURhdGVUaW1lQ29tcG9uZW50IH0gZnJvbSAnLi9jdXN0b20tZGF0ZS10aW1lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEYXRlVGltZUFic29sdXRlQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlLXRpbWUtYWJzb2x1dGUuY29tcG9uZW50JztcbmltcG9ydCB7IERhdGVUaW1lUmVsYXRpdmVDb21wb25lbnQgfSBmcm9tICcuL2RhdGUtdGltZS1yZWxhdGl2ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIERhdGVUaW1lUGlja2VyQ29tcG9uZW50LFxuICAgIEN1c3RvbURhdGVUaW1lQ29tcG9uZW50LFxuICAgIERhdGVUaW1lQWJzb2x1dGVDb21wb25lbnQsXG4gICAgRGF0ZVRpbWVSZWxhdGl2ZUNvbXBvbmVudCxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIERhdGVUaW1lUGlja2VyQ29tcG9uZW50LFxuICAgIEN1c3RvbURhdGVUaW1lQ29tcG9uZW50LFxuICAgIERhdGVUaW1lQWJzb2x1dGVDb21wb25lbnQsXG4gICAgRGF0ZVRpbWVSZWxhdGl2ZUNvbXBvbmVudCxcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBGb3Jtc01vZHVsZSxcbiAgICBCdXR0b25Nb2R1bGUsXG4gICAgUmFkaW9Nb2R1bGUsXG4gICAgU2VsZWN0TW9kdWxlLFxuICAgIE51bWJlck1vZHVsZSxcbiAgICBUaW1lUGlja2VyTW9kdWxlLFxuICAgIFRpbWVQaWNrZXJTZWxlY3RNb2R1bGUsXG4gICAgSW5wdXRNb2R1bGUsXG4gICAgRGF0ZVBpY2tlck1vZHVsZSxcbiAgICBJMThuTW9kdWxlLFxuICAgIEljb25Nb2R1bGUsXG4gICAgRGlhbG9nTW9kdWxlLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBEYXRlVGltZVBpY2tlck1vZHVsZSB7fVxuIl19