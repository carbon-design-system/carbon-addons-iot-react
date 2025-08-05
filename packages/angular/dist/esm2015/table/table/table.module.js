/**
 *
 * @ai-apps/angular v2.155.1 | table.module.js
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
import { ButtonModule, DialogModule, IconService, TableModule, } from 'carbon-components-angular';
import { CommonModule } from '@angular/common';
import { AITableHeadCell } from './head/table-head-cell.component';
import { AITableHeadComponent } from './head/table-head.component';
import { AITableComponent } from './table.component';
import { AITableBody } from './body/table-body.component';
import { AITableRowComponent } from './body/table-row.component';
import ArrowsVertical16 from '@carbon/icons/es/arrows--vertical/16';
import ArrowDown16 from '@carbon/icons/es/arrow--down/16';
import Filter16 from '@carbon/icons/es/filter/16';
export class AITableModule {
    constructor(iconService) {
        this.iconService = iconService;
        iconService.registerAll([ArrowsVertical16, ArrowDown16, Filter16]);
    }
}
AITableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    AITableComponent,
                    AITableBody,
                    AITableHeadComponent,
                    AITableHeadCell,
                    AITableRowComponent,
                ],
                imports: [DialogModule, ButtonModule, CommonModule, TableModule],
                exports: [
                    AITableComponent,
                    AITableBody,
                    AITableHeadComponent,
                    AITableHeadCell,
                    AITableRowComponent,
                ],
            },] }
];
AITableModule.ctorParameters = () => [
    { type: IconService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3RhYmxlL3RhYmxlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFDTCxZQUFZLEVBQ1osWUFBWSxFQUVaLFdBQVcsRUFDWCxXQUFXLEdBQ1osTUFBTSwyQkFBMkIsQ0FBQztBQUVuQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUVqRSxPQUFPLGdCQUFnQixNQUFNLHNDQUFzQyxDQUFDO0FBQ3BFLE9BQU8sV0FBVyxNQUFNLGlDQUFpQyxDQUFDO0FBQzFELE9BQU8sUUFBUSxNQUFNLDRCQUE0QixDQUFDO0FBbUJsRCxNQUFNLE9BQU8sYUFBYTtJQUN4QixZQUFzQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUM1QyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQzs7O1lBcEJGLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUU7b0JBQ1osZ0JBQWdCO29CQUNoQixXQUFXO29CQUNYLG9CQUFvQjtvQkFDcEIsZUFBZTtvQkFDZixtQkFBbUI7aUJBQ3BCO2dCQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQztnQkFDaEUsT0FBTyxFQUFFO29CQUNQLGdCQUFnQjtvQkFDaEIsV0FBVztvQkFDWCxvQkFBb0I7b0JBQ3BCLGVBQWU7b0JBQ2YsbUJBQW1CO2lCQUNwQjthQUNGOzs7WUEvQkMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIEJ1dHRvbk1vZHVsZSxcbiAgRGlhbG9nTW9kdWxlLFxuICBJY29uTW9kdWxlLFxuICBJY29uU2VydmljZSxcbiAgVGFibGVNb2R1bGUsXG59IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQUlUYWJsZUhlYWRDZWxsIH0gZnJvbSAnLi9oZWFkL3RhYmxlLWhlYWQtY2VsbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQUlUYWJsZUhlYWRDb21wb25lbnQgfSBmcm9tICcuL2hlYWQvdGFibGUtaGVhZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQUlUYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IEFJVGFibGVCb2R5IH0gZnJvbSAnLi9ib2R5L3RhYmxlLWJvZHkuY29tcG9uZW50JztcbmltcG9ydCB7IEFJVGFibGVSb3dDb21wb25lbnQgfSBmcm9tICcuL2JvZHkvdGFibGUtcm93LmNvbXBvbmVudCc7XG5cbmltcG9ydCBBcnJvd3NWZXJ0aWNhbDE2IGZyb20gJ0BjYXJib24vaWNvbnMvZXMvYXJyb3dzLS12ZXJ0aWNhbC8xNic7XG5pbXBvcnQgQXJyb3dEb3duMTYgZnJvbSAnQGNhcmJvbi9pY29ucy9lcy9hcnJvdy0tZG93bi8xNic7XG5pbXBvcnQgRmlsdGVyMTYgZnJvbSAnQGNhcmJvbi9pY29ucy9lcy9maWx0ZXIvMTYnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBSVRhYmxlQ29tcG9uZW50LFxuICAgIEFJVGFibGVCb2R5LFxuICAgIEFJVGFibGVIZWFkQ29tcG9uZW50LFxuICAgIEFJVGFibGVIZWFkQ2VsbCxcbiAgICBBSVRhYmxlUm93Q29tcG9uZW50LFxuICBdLFxuICBpbXBvcnRzOiBbRGlhbG9nTW9kdWxlLCBCdXR0b25Nb2R1bGUsIENvbW1vbk1vZHVsZSwgVGFibGVNb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgQUlUYWJsZUNvbXBvbmVudCxcbiAgICBBSVRhYmxlQm9keSxcbiAgICBBSVRhYmxlSGVhZENvbXBvbmVudCxcbiAgICBBSVRhYmxlSGVhZENlbGwsXG4gICAgQUlUYWJsZVJvd0NvbXBvbmVudCxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQUlUYWJsZU1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpY29uU2VydmljZTogSWNvblNlcnZpY2UpIHtcbiAgICBpY29uU2VydmljZS5yZWdpc3RlckFsbChbQXJyb3dzVmVydGljYWwxNiwgQXJyb3dEb3duMTYsIEZpbHRlcjE2XSk7XG4gIH1cbn1cbiJdfQ==