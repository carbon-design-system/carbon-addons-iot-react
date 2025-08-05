/**
 *
 * @ai-apps/angular v2.155.1 | tabs.module.js
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
import { ButtonModule, DropdownModule, IconModule, TabsModule as CTabsModule, UtilsModule, } from 'carbon-components-angular';
import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';
import { TabDropdownComponent } from './tab-dropdown.component';
import { TabActionDirective } from './tab-action.directive';
import { TabActionsComponent } from './tab-actions.component';
import { TabHeader } from './tab-header.component';
import { ContextMenuModule } from 'carbon-components-angular/context-menu';
export class TabsModule {
}
TabsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    TabsComponent,
                    TabComponent,
                    TabDropdownComponent,
                    TabActionsComponent,
                    TabActionDirective,
                    TabHeader,
                ],
                imports: [
                    CommonModule,
                    CTabsModule,
                    IconModule,
                    DropdownModule,
                    ButtonModule,
                    UtilsModule,
                    ContextMenuModule,
                ],
                exports: [
                    TabsComponent,
                    TabComponent,
                    TabDropdownComponent,
                    TabActionsComponent,
                    TabActionDirective,
                    TabHeader,
                ],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdGFicy90YWJzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQ0wsWUFBWSxFQUNaLGNBQWMsRUFDZCxVQUFVLEVBQ1YsVUFBVSxJQUFJLFdBQVcsRUFDekIsV0FBVyxHQUNaLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUE2QjNFLE1BQU0sT0FBTyxVQUFVOzs7WUEzQnRCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUU7b0JBQ1osYUFBYTtvQkFDYixZQUFZO29CQUNaLG9CQUFvQjtvQkFDcEIsbUJBQW1CO29CQUNuQixrQkFBa0I7b0JBQ2xCLFNBQVM7aUJBQ1Y7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osV0FBVztvQkFDWCxVQUFVO29CQUNWLGNBQWM7b0JBQ2QsWUFBWTtvQkFDWixXQUFXO29CQUNYLGlCQUFpQjtpQkFDbEI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGFBQWE7b0JBQ2IsWUFBWTtvQkFDWixvQkFBb0I7b0JBQ3BCLG1CQUFtQjtvQkFDbkIsa0JBQWtCO29CQUNsQixTQUFTO2lCQUNWO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEJ1dHRvbk1vZHVsZSxcbiAgRHJvcGRvd25Nb2R1bGUsXG4gIEljb25Nb2R1bGUsXG4gIFRhYnNNb2R1bGUgYXMgQ1RhYnNNb2R1bGUsXG4gIFV0aWxzTW9kdWxlLFxufSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyJztcbmltcG9ydCB7IFRhYkNvbXBvbmVudCB9IGZyb20gJy4vdGFiLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUYWJzQ29tcG9uZW50IH0gZnJvbSAnLi90YWJzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUYWJEcm9wZG93bkNvbXBvbmVudCB9IGZyb20gJy4vdGFiLWRyb3Bkb3duLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUYWJBY3Rpb25EaXJlY3RpdmUgfSBmcm9tICcuL3RhYi1hY3Rpb24uZGlyZWN0aXZlJztcbmltcG9ydCB7IFRhYkFjdGlvbnNDb21wb25lbnQgfSBmcm9tICcuL3RhYi1hY3Rpb25zLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUYWJIZWFkZXIgfSBmcm9tICcuL3RhYi1oZWFkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvbnRleHRNZW51TW9kdWxlIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhci9jb250ZXh0LW1lbnUnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBUYWJzQ29tcG9uZW50LFxuICAgIFRhYkNvbXBvbmVudCxcbiAgICBUYWJEcm9wZG93bkNvbXBvbmVudCxcbiAgICBUYWJBY3Rpb25zQ29tcG9uZW50LFxuICAgIFRhYkFjdGlvbkRpcmVjdGl2ZSxcbiAgICBUYWJIZWFkZXIsXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgQ1RhYnNNb2R1bGUsXG4gICAgSWNvbk1vZHVsZSxcbiAgICBEcm9wZG93bk1vZHVsZSxcbiAgICBCdXR0b25Nb2R1bGUsXG4gICAgVXRpbHNNb2R1bGUsXG4gICAgQ29udGV4dE1lbnVNb2R1bGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBUYWJzQ29tcG9uZW50LFxuICAgIFRhYkNvbXBvbmVudCxcbiAgICBUYWJEcm9wZG93bkNvbXBvbmVudCxcbiAgICBUYWJBY3Rpb25zQ29tcG9uZW50LFxuICAgIFRhYkFjdGlvbkRpcmVjdGl2ZSxcbiAgICBUYWJIZWFkZXIsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIFRhYnNNb2R1bGUge31cbiJdfQ==