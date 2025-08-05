/**
 *
 * @ai-apps/angular v2.155.1 | sterling-table.module.js
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
import { ButtonModule, DialogModule, TableModule } from 'carbon-components-angular';
import { CommonModule } from '@angular/common';
import { SCTableHeadCell } from './head/sterling-table-head-cell.component';
import { SCTableHeadComponent } from './head/sterling-table-head.component';
import { SCTableComponent } from './sterling-table.component';
export class SCTableModule {
}
SCTableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [SCTableComponent, SCTableHeadComponent, SCTableHeadCell],
                imports: [DialogModule, ButtonModule, CommonModule, TableModule],
                exports: [SCTableComponent, SCTableHeadComponent, SCTableHeadCell],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcmxpbmctdGFibGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3Rvb2xraXQvdGFibGUvc3RlcmxpbmctdGFibGUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFcEYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUM1RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQU85RCxNQUFNLE9BQU8sYUFBYTs7O1lBTHpCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxlQUFlLENBQUM7Z0JBQ3ZFLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQztnQkFDaEUsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUUsZUFBZSxDQUFDO2FBQ25FIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQnV0dG9uTW9kdWxlLCBEaWFsb2dNb2R1bGUsIFRhYmxlTW9kdWxlIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBTQ1RhYmxlSGVhZENlbGwgfSBmcm9tICcuL2hlYWQvc3RlcmxpbmctdGFibGUtaGVhZC1jZWxsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTQ1RhYmxlSGVhZENvbXBvbmVudCB9IGZyb20gJy4vaGVhZC9zdGVybGluZy10YWJsZS1oZWFkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTQ1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9zdGVybGluZy10YWJsZS5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtTQ1RhYmxlQ29tcG9uZW50LCBTQ1RhYmxlSGVhZENvbXBvbmVudCwgU0NUYWJsZUhlYWRDZWxsXSxcbiAgaW1wb3J0czogW0RpYWxvZ01vZHVsZSwgQnV0dG9uTW9kdWxlLCBDb21tb25Nb2R1bGUsIFRhYmxlTW9kdWxlXSxcbiAgZXhwb3J0czogW1NDVGFibGVDb21wb25lbnQsIFNDVGFibGVIZWFkQ29tcG9uZW50LCBTQ1RhYmxlSGVhZENlbGxdLFxufSlcbmV4cG9ydCBjbGFzcyBTQ1RhYmxlTW9kdWxlIHt9XG4iXX0=