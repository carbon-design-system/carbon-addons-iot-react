/**
 *
 * @ai-apps/angular v2.155.1 | card.module.js
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
import { CardContentComponent } from './card-content.component';
import { CardHeaderComponent } from './card-header.component';
import { CardTitleComponent } from './card-title.component';
import { CardToolbarActionDirective } from './card-toolbar-action.directive';
import { CardToolbarComponent } from './card-toolbar.component';
import { CardDateRangeComponent } from './card-date-range.component';
import { CardComponent } from './card.component';
import { DialogModule, IconModule } from 'carbon-components-angular';
export class CardModule {
}
CardModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    CardContentComponent,
                    CardHeaderComponent,
                    CardTitleComponent,
                    CardToolbarActionDirective,
                    CardToolbarComponent,
                    CardDateRangeComponent,
                    CardComponent,
                ],
                exports: [
                    CardContentComponent,
                    CardHeaderComponent,
                    CardTitleComponent,
                    CardToolbarActionDirective,
                    CardToolbarComponent,
                    CardDateRangeComponent,
                    CardComponent,
                ],
                imports: [CommonModule, IconModule, DialogModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2FyZC9jYXJkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNyRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQXVCckUsTUFBTSxPQUFPLFVBQVU7OztZQXJCdEIsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRTtvQkFDWixvQkFBb0I7b0JBQ3BCLG1CQUFtQjtvQkFDbkIsa0JBQWtCO29CQUNsQiwwQkFBMEI7b0JBQzFCLG9CQUFvQjtvQkFDcEIsc0JBQXNCO29CQUN0QixhQUFhO2lCQUNkO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxvQkFBb0I7b0JBQ3BCLG1CQUFtQjtvQkFDbkIsa0JBQWtCO29CQUNsQiwwQkFBMEI7b0JBQzFCLG9CQUFvQjtvQkFDcEIsc0JBQXNCO29CQUN0QixhQUFhO2lCQUNkO2dCQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsWUFBWSxDQUFDO2FBQ2xEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IENhcmRDb250ZW50Q29tcG9uZW50IH0gZnJvbSAnLi9jYXJkLWNvbnRlbnQuY29tcG9uZW50JztcbmltcG9ydCB7IENhcmRIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2NhcmQtaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYXJkVGl0bGVDb21wb25lbnQgfSBmcm9tICcuL2NhcmQtdGl0bGUuY29tcG9uZW50JztcbmltcG9ydCB7IENhcmRUb29sYmFyQWN0aW9uRGlyZWN0aXZlIH0gZnJvbSAnLi9jYXJkLXRvb2xiYXItYWN0aW9uLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDYXJkVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vY2FyZC10b29sYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYXJkRGF0ZVJhbmdlQ29tcG9uZW50IH0gZnJvbSAnLi9jYXJkLWRhdGUtcmFuZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IENhcmRDb21wb25lbnQgfSBmcm9tICcuL2NhcmQuY29tcG9uZW50JztcbmltcG9ydCB7IERpYWxvZ01vZHVsZSwgSWNvbk1vZHVsZSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBDYXJkQ29udGVudENvbXBvbmVudCxcbiAgICBDYXJkSGVhZGVyQ29tcG9uZW50LFxuICAgIENhcmRUaXRsZUNvbXBvbmVudCxcbiAgICBDYXJkVG9vbGJhckFjdGlvbkRpcmVjdGl2ZSxcbiAgICBDYXJkVG9vbGJhckNvbXBvbmVudCxcbiAgICBDYXJkRGF0ZVJhbmdlQ29tcG9uZW50LFxuICAgIENhcmRDb21wb25lbnQsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBDYXJkQ29udGVudENvbXBvbmVudCxcbiAgICBDYXJkSGVhZGVyQ29tcG9uZW50LFxuICAgIENhcmRUaXRsZUNvbXBvbmVudCxcbiAgICBDYXJkVG9vbGJhckFjdGlvbkRpcmVjdGl2ZSxcbiAgICBDYXJkVG9vbGJhckNvbXBvbmVudCxcbiAgICBDYXJkRGF0ZVJhbmdlQ29tcG9uZW50LFxuICAgIENhcmRDb21wb25lbnQsXG4gIF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEljb25Nb2R1bGUsIERpYWxvZ01vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIENhcmRNb2R1bGUge31cbiJdfQ==