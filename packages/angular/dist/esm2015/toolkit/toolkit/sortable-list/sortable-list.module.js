/**
 *
 * @ai-apps/angular v2.155.1 | sortable-list.module.js
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
import { CheckboxModule, DialogModule } from 'carbon-components-angular';
import { DraggableModule } from '../draggable/index';
import { SortableListItemComponent } from './sortable-list-item.component';
import { SortableListComponent } from './sortable-list.component';
export class SortableListModule {
}
SortableListModule.decorators = [
    { type: NgModule, args: [{
                declarations: [SortableListComponent, SortableListItemComponent],
                imports: [CommonModule, CheckboxModule, DialogModule, DraggableModule],
                exports: [SortableListComponent, SortableListItemComponent],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGUtbGlzdC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvdG9vbGtpdC9zb3J0YWJsZS1saXN0L3NvcnRhYmxlLWxpc3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDekUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBT2xFLE1BQU0sT0FBTyxrQkFBa0I7OztZQUw5QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMscUJBQXFCLEVBQUUseUJBQXlCLENBQUM7Z0JBQ2hFLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQztnQkFDdEUsT0FBTyxFQUFFLENBQUMscUJBQXFCLEVBQUUseUJBQXlCLENBQUM7YUFDNUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENoZWNrYm94TW9kdWxlLCBEaWFsb2dNb2R1bGUgfSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyJztcbmltcG9ydCB7IERyYWdnYWJsZU1vZHVsZSB9IGZyb20gJy4uL2RyYWdnYWJsZS9pbmRleCc7XG5pbXBvcnQgeyBTb3J0YWJsZUxpc3RJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9zb3J0YWJsZS1saXN0LWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IFNvcnRhYmxlTGlzdENvbXBvbmVudCB9IGZyb20gJy4vc29ydGFibGUtbGlzdC5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtTb3J0YWJsZUxpc3RDb21wb25lbnQsIFNvcnRhYmxlTGlzdEl0ZW1Db21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBDaGVja2JveE1vZHVsZSwgRGlhbG9nTW9kdWxlLCBEcmFnZ2FibGVNb2R1bGVdLFxuICBleHBvcnRzOiBbU29ydGFibGVMaXN0Q29tcG9uZW50LCBTb3J0YWJsZUxpc3RJdGVtQ29tcG9uZW50XSxcbn0pXG5leHBvcnQgY2xhc3MgU29ydGFibGVMaXN0TW9kdWxlIHt9XG4iXX0=